"use client";

import { useEffect } from "react";

export interface RogExtractedScript {
  src?: string;
  inline?: string;
  isModule?: boolean;
}

interface RogDetailInteractiveProps {
  scripts: RogExtractedScript[];
  slugPath: string;
  wfPage?: string;
  wfSite?: string;
}

type RogRuntimeWindow = {
  __rogLoadedExternalScripts?: Record<string, Promise<void>>;
  jQuery?: { holdReady?: (hold: boolean) => void; readyWait?: number };
  featuresRun?: () => void;
  Webflow?: { ready?: () => void };
  ScrollTrigger?: {
    refresh?: (safe?: boolean) => void;
    getAll?: () => Array<{ kill: () => void }>;
  };
};

function getFallbackCdnUrl(src: string): string | null {
  if (/(?:^|\/)jquery(?:-\d[\d.]*)?(?:\.min)?\.js(?:[?#]|$)/i.test(src) && !src.includes("cdnjs.cloudflare.com")) {
    return "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.min.js";
  }
  if (/ScrollTrigger(?:\.min)?\.js/i.test(src) && !src.includes("cdnjs.cloudflare.com")) {
    return "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js";
  }
  if (/\/gsap(?:\.min)?\.js/i.test(src) && !src.includes("cdnjs.cloudflare.com")) {
    return "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js";
  }
  if (/scrollreveal(?:\.min)?\.js/i.test(src) && !src.includes("unpkg.com")) {
    return "https://unpkg.com/scrollreveal@3.3.6/dist/scrollreveal.min.js";
  }
  return null;
}

function loadExternalScriptSequential(src: string, isModule?: boolean): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  const win = window as unknown as RogRuntimeWindow;
  if (!win.__rogLoadedExternalScripts) {
    win.__rogLoadedExternalScripts = {};
  }

  // Avoid refetching heavy core libraries across client navigations
  const isLibrary =
    src.includes("jquery") ||
    src.includes("gsap") ||
    src.includes("ScrollTrigger") ||
    src.includes("swiper-bundle");

  if (isLibrary && src in win.__rogLoadedExternalScripts) {
    return win.__rogLoadedExternalScripts[src];
  }

  // For page-specific scripts (e.g. G16 index.js), replace any prior tag on new container mount
  if (!isLibrary) {
    document.querySelectorAll(`script[data-rog-dynamic-src="${src}"]`).forEach((el) => el.remove());
  }

  const p = new Promise<void>((resolve) => {
    const appendScript = (targetSrc: string, allowFallback: boolean) => {
      const script = document.createElement("script");
      if (isModule) {
        script.type = "module";
      }
      script.src = targetSrc;
      if (!isLibrary) {
        script.setAttribute("data-rog-dynamic-src", src);
      }
      script.async = false;
      script.onload = () => resolve();
      script.onerror = () => {
        const fb = allowFallback ? getFallbackCdnUrl(targetSrc) : null;
        if (fb) {
          appendScript(fb, false);
        } else {
          resolve();
        }
      };
      document.body.appendChild(script);
    };
    appendScript(src, true);
  });

  if (isLibrary) {
    win.__rogLoadedExternalScripts[src] = p;
  }
  return p;
}

const CORE_JQUERY_RE = /(?:^|\/)jquery(?:-\d[\d.]*)?(?:\.min)?\.js(?:[?#]|$)/i;
const EARLY_DEP_RE =
  /TweenMax|TweenLite|gsap(?:\.min)?\.js|ScrollMagic(?:\.min)?\.js|ScrollTrigger|animation\.gsap|debug\.addIndicators|skrollr|createjs|mg-main|plu\/overview\.js|farbtastic|scrollreveal|navScroll|navscroll|colorbox|mCustomScrollbar|\/video\.js/i;

function buildOrderedScripts(scripts: RogExtractedScript[]): {
  hasOwnCoreJquery: boolean;
  ordered: RogExtractedScript[];
} {
  const existingSrcs = new Set(scripts.map((s) => s.src).filter(Boolean));
  const coreIndices: number[] = [];
  let firstUsageBeforeCore = false;
  let sawOrchestrator = false;
  let needsLegacyReorder = false;

  scripts.forEach((s, i) => {
    if (s.src && CORE_JQUERY_RE.test(s.src)) {
      coreIndices.push(i);
      return;
    }
    if (coreIndices.length === 0 && ((s.inline && /\$\(|jQuery\(/i.test(s.inline)) || (s.src && EARLY_DEP_RE.test(s.src)))) {
      firstUsageBeforeCore = true;
    }
    if (s.src && /\/main\.js|\/main_scrollreveal\.js|\/hd-main\.js|\/main\.min\.js/i.test(s.src)) {
      sawOrchestrator = true;
    } else if (sawOrchestrator && s.src && EARLY_DEP_RE.test(s.src)) {
      needsLegacyReorder = true;
    }
  });

  // Extract missing $.getScript dependencies declared in featuresRun() blocks
  const extractedDeps: RogExtractedScript[] = [];
  for (const s of scripts) {
    if (!s.inline) continue;
    const matches = s.inline.matchAll(/\$\.getScript\(\s*["'](https?:\/\/[^"']+)["']/gi);
    for (const m of matches) {
      const depUrl = m[1];
      if (
        !existingSrcs.has(depUrl) &&
        /scrollreveal|farbtastic|navScroll|mCustomScrollbar|colorbox|gsap|ScrollTrigger/i.test(depUrl)
      ) {
        existingSrcs.add(depUrl);
        extractedDeps.push({ src: depUrl });
      }
    }
  }

  // Pull default_table_product config ahead of compare_table.min.js without disturbing anything else
  const compareIdx = scripts.findIndex((s) => s.src && /compare_table/i.test(s.src));
  const earlyDefaultTable: RogExtractedScript[] = [];
  let ordered: RogExtractedScript[] = [];

  for (let i = 0; i < scripts.length; i++) {
    const s = scripts[i];
    if (compareIdx >= 0 && i > compareIdx && s.inline && /\bdefault_table_product\b/.test(s.inline)) {
      earlyDefaultTable.push(s);
      continue;
    }
    if (firstUsageBeforeCore && s.src && CORE_JQUERY_RE.test(s.src)) {
      continue;
    }
    ordered.push(s);
  }

  if (firstUsageBeforeCore && coreIndices.length > 0) {
    ordered = [...coreIndices.map((idx) => scripts[idx]), ...ordered];
  }

  if (earlyDefaultTable.length > 0) {
    const targetIdx = ordered.findIndex((s) => s.src && /compare_table/i.test(s.src));
    if (targetIdx >= 0) {
      ordered.splice(targetIdx, 0, ...earlyDefaultTable);
    } else {
      ordered.unshift(...earlyDefaultTable);
    }
  }

  // Inject missing featuresRun() plugin dependencies before the first main/bundle script
  if (extractedDeps.length > 0) {
    const mainIdx = ordered.findIndex((s) => s.src && /\/main\.js|\/bundle/i.test(s.src));
    if (mainIdx >= 0) {
      ordered.splice(mainIdx, 0, ...extractedDeps);
    } else {
      ordered.push(...extractedDeps);
    }
  }

  // Only on legacy microsites where plugins follow main.js, hoist external early deps before main.js & $(document).ready
  if (needsLegacyReorder) {
    const deps: RogExtractedScript[] = [];
    const rest: RogExtractedScript[] = [];
    for (const s of ordered) {
      if (s.src && !CORE_JQUERY_RE.test(s.src) && EARLY_DEP_RE.test(s.src)) {
        deps.push(s);
      } else {
        rest.push(s);
      }
    }
    // Keep core jQuery & default_table_product at the very front, then hoisted deps (TweenMax before ScrollMagic), then rest
    deps.sort((a, b) => {
      const rank = (u = "") =>
        /TweenMax|TweenLite|gsap/i.test(u) ? 0 : /ScrollMagic(?:\.min)?\.js/i.test(u) && !/plugins\//i.test(u) ? 1 : 2;
      return rank(a.src) - rank(b.src);
    });
    const firstNonCore = rest.findIndex(
      (s) => !(s.src && CORE_JQUERY_RE.test(s.src)) && !(s.inline && /\b(?:default_table_product|jQuery\.browser)\b/.test(s.inline))
    );
    const insertAt = firstNonCore >= 0 ? firstNonCore : rest.length;
    rest.splice(insertAt, 0, ...deps);
    ordered = rest;
  }

  return {
    hasOwnCoreJquery: coreIndices.length > 0,
    ordered,
  };
}

export default function RogDetailInteractive({
  scripts,
  slugPath,
  wfPage,
  wfSite,
}: RogDetailInteractiveProps) {
  useEffect(() => {
    // Skip catalog pages (handled by RogCatalogInteractive)
    if (
      document.querySelector(
        ".ProductResult__productResultGroupItems__g7jzg, .SeriesHome__seriesHomeGroupItems__lXu3g"
      )
    ) {
      return;
    }

    // Add Webflow metadata & interaction classes expected by product detail CSS/JS
    if (wfPage) document.documentElement.setAttribute("data-wf-page", wfPage);
    if (wfSite) document.documentElement.setAttribute("data-wf-site", wfSite);
    document.documentElement.classList.add("w-mod-js");
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
      document.documentElement.classList.add("w-mod-touch");
    }

    // Reveal progressive images immediately
    document.querySelectorAll(".progressive-image").forEach((el) => {
      el.classList.remove("progressive-image");
    });

    // Guard empty placeholder videos so IntersectionObserver scripts don't trigger play errors
    document.querySelectorAll<HTMLElement>("[data-video]").forEach((wrapper) => {
      const video = wrapper.querySelector("video");
      const hasSource = Boolean(video?.querySelector("source[src]") || video?.getAttribute("src"));
      if (!video || !hasSource) {
        wrapper.removeAttribute("data-video");
      }
    });

    // Wire ProductTabBar mobile navigation drawer
    const mobileMenuBtn = document.querySelector<HTMLButtonElement>(
      ".ProductTabBar__mobileFullMenuButton__YjpKG"
    );
    const mobileTabList = document.querySelector<HTMLElement>(
      ".ProductTabBar__mobileTabList__OFkOO"
    );
    if (mobileMenuBtn && mobileTabList) {
      mobileMenuBtn.onclick = (e) => {
        e.preventDefault();
        const isCollapsed = mobileTabList.style.height === "0px" || !mobileTabList.style.height;
        mobileTabList.style.height = isCollapsed ? "auto" : "0px";
        mobileTabList.style.overflow = isCollapsed ? "visible" : "hidden";
        mobileTabList.setAttribute("aria-hidden", isCollapsed ? "false" : "true");
      };

      // Map mobile spans cleanly to desktop tab hrefs
      const desktopLinks = new Map<string, string>();
      document
        .querySelectorAll<HTMLAnchorElement>("#productTabBarContainer .tabList a")
        .forEach((a) => {
          const label = a.textContent?.trim().toLowerCase() || "";
          const href = a.getAttribute("href");
          if (label && href) desktopLinks.set(label, href);
        });

      mobileTabList.querySelectorAll<HTMLElement>("li.tabItem").forEach((li) => {
        li.style.cursor = "pointer";
        li.onclick = () => {
          const txt = li.textContent?.trim().toLowerCase() || "";
          const targetHref = desktopLinks.get(txt);
          if (targetHref) {
            window.location.href = targetHref;
          }
        };
      });
    }

    // Wire smooth scrolling for right-side & inline anchor links (#performance, #cooling, etc.)
    const mainContainer = document.querySelector<HTMLElement>(".rog-universal-main-container");
    const anchorHandler = (e: Event) => {
      const link = (e.target as HTMLElement)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!link) return;
      const hash = link.getAttribute("href");
      if (!hash || hash === "#") return;
      const target = document.getElementById(hash.slice(1));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    mainContainer?.addEventListener("click", anchorHandler);

    // Ensure valid product detail videos play cleanly in view & don't get stuck invisible
    const detailVideos = Array.from(
      document.querySelectorAll<HTMLVideoElement>(".rog-universal-main-container video")
    ).filter((v) => Boolean(v.querySelector("source[src]") || v.getAttribute("src")));

    detailVideos.forEach((v) => {
      v.muted = true;
      v.playsInline = true;
    });

    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            video.style.opacity = "1";
            video.play().catch(() => {});
          }
        });
      },
      { threshold: 0.2 }
    );
    detailVideos.forEach((v) => videoObserver.observe(v));

    // Suppress harmless browser AbortError from third-party scroll video play/pause toggles
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason as { name?: string; message?: string } | string | undefined;
      const msg = typeof reason === "string" ? reason : reason?.message || "";
      if (
        (typeof reason === "object" && reason?.name === "AbortError") ||
        msg.includes("play() request was interrupted by a call to pause()")
      ) {
        event.preventDefault();
      }
    };
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    // Expose .newHeader on main site navbar so third-party detail scripts (e.g. Duo 2026) measure sticky offsets cleanly
    const navHeader = document.querySelector<HTMLElement>("header.rog-nav");
    navHeader?.classList.add("newHeader");

    // Proxy cross-origin ASUS /recent-data/ fetch calls (e.g. OLED compare_table.min.js) to same-origin Next API
    const origFetch = window.fetch.bind(window);
    window.fetch = function (input: RequestInfo | URL, init?: RequestInit) {
      if (typeof input === "string") {
        const recentMatch = input.match(
          /^https?:\/\/(?:rog|api-rog|odinapi)\.asus\.com\/recent-data\/(.+)/i
        );
        if (recentMatch) {
          return origFetch(`/api/rog-recent-data/${recentMatch[1]}`, init);
        }
      }
      return origFetch(input, init);
    };

    // Provide harmless legacy Google Analytics & WebFont stubs so old microsites never throw ReferenceError
    const legacyWin = window as unknown as { ga?: () => void; WebFont?: { load?: () => void } };
    if (typeof legacyWin.ga !== "function") {
      legacyWin.ga = () => {};
    }
    if (!legacyWin.WebFont) {
      legacyWin.WebFont = { load: () => {} };
    }

    // Run scripts ONCE per mounted mainContainer (survives React 19 StrictMode micro-remount without double-calling Slick/Swiper)
    let fallbackTimer: ReturnType<typeof setTimeout> | undefined;
    const targetNode = mainContainer || document.body;

    if (targetNode.getAttribute("data-rog-scripts-started") !== slugPath) {
      targetNode.setAttribute("data-rog-scripts-started", slugPath);

      (async () => {
        const win = window as unknown as RogRuntimeWindow;
        const { hasOwnCoreJquery, ordered: orderedScripts } = buildOrderedScripts(scripts);
        // Official ROG Nuxt <head> provides jquery-1.12.4; load only when page lacks its own core jQuery so plugins bind cleanly to one $
        if (!hasOwnCoreJquery && !win.jQuery) {
          await loadExternalScriptSequential("https://dlcdnrog.asus.com/rog/js/jquery-1.12.4.min.js");
        }
        if (!targetNode.isConnected) return;

        const domReadyQueue: EventListenerOrEventListenerObject[] = [];
        const winLoadQueue: EventListenerOrEventListenerObject[] = [];
        const origDocAdd = document.addEventListener.bind(document);
        const origWinAdd = window.addEventListener.bind(window);
        const origDocWrite = document.write.bind(document);
        const origDocWriteln = document.writeln.bind(document);

        // Guard legacy inline document.write calls so post-hydration execution never wipes the DOM
        const safeNoopWrite = () => {};
        document.write = safeNoopWrite;
        document.writeln = safeNoopWrite;

        document.addEventListener = function (
          type: string,
          listener: EventListenerOrEventListenerObject | null,
          options?: boolean | AddEventListenerOptions
        ) {
          if (type === "DOMContentLoaded" && listener) {
            domReadyQueue.push(listener);
            return;
          }
          return origDocAdd(type, listener as EventListenerOrEventListenerObject, options);
        } as typeof document.addEventListener;

        window.addEventListener = function (
          type: string,
          listener: EventListenerOrEventListenerObject | null,
          options?: boolean | AddEventListenerOptions
        ) {
          if (type === "load" && listener) {
            winLoadQueue.push(listener);
            return;
          }
          return origWinAdd(type, listener as EventListenerOrEventListenerObject, options);
        } as typeof window.addEventListener;

        // Keep any newly loaded jQuery version held until all plugins & trailing inline configs finish
        const jq = win.jQuery as ({ holdReady?: (h: boolean) => void; browser?: Record<string, unknown> } | undefined);
        jq?.holdReady?.(true);
        if (jq && !jq.browser) {
          jq.browser = { msie: false, version: 0 };
        }
        try {
          for (const s of orderedScripts) {
            if (!targetNode.isConnected) break;
            if (s.src) {
              await loadExternalScriptSequential(s.src, s.isModule);
              if (s.src.includes("jquery")) {
                const nextJq = win.jQuery as ({ holdReady?: (h: boolean) => void; browser?: Record<string, unknown> } | undefined);
                nextJq?.holdReady?.(true);
                if (nextJq && !nextJq.browser) {
                  nextJq.browser = { msie: false, version: 0 };
                }
              }
            } else if (s.inline && s.inline.trim().length > 0 && targetNode.isConnected) {
              try {
                const cleanCode = s.inline.replace(
                  /https:\/\/dlcdnimgs\.asus\.com\/websites\/global\/products\/vinnjsoyhjlwgtj7\/css\/font\.css/gi,
                  "/sites/rog-asus/fonts/fontHQ.css"
                );
                const inlineScript = document.createElement("script");
                if (s.isModule) {
                  inlineScript.type = "module";
                }
                inlineScript.textContent = cleanCode;
                document.body.appendChild(inlineScript);
              } catch {
                // Non-fatal if an optional SKU DOM node isn't present in this layout variant
              }
            }
          }
        } finally {
          document.addEventListener = origDocAdd;
          window.addEventListener = origWinAdd;
          document.write = origDocWrite;
          document.writeln = origDocWriteln;
        }

        if (!targetNode.isConnected) return;

        // Flush DOMContentLoaded and late window load callbacks queued after React hydration
        for (const listener of domReadyQueue) {
          try {
            const ev = new Event("DOMContentLoaded");
            if (typeof listener === "function") {
              listener.call(document, ev);
            } else if (typeof listener.handleEvent === "function") {
              listener.handleEvent(ev);
            }
          } catch {
            // ignore
          }
        }
        const flushWinLoad = () => {
          for (const listener of winLoadQueue) {
            try {
              const ev = new Event("load");
              if (typeof listener === "function") {
                listener.call(window, ev);
              } else if (typeof listener.handleEvent === "function") {
                listener.handleEvent(ev);
              }
            } catch {
              // ignore
            }
          }
        };
        if (document.readyState === "complete") {
          flushWinLoad();
        } else {
          origWinAdd("load", flushWinLoad, { once: true });
        }

        // Release jQuery holdReady & initialize Webflow / ScrollTrigger (skip featuresRun so bundled scripts don't double-execute)
        try {
          if (typeof win.jQuery?.holdReady === "function") {
            let guard = 0;
            while ((win.jQuery.readyWait ?? 1) > 0 && guard++ < 10) {
              win.jQuery.holdReady(false);
            }
          }
          win.Webflow?.ready?.();
          win.ScrollTrigger?.refresh?.(true);
        } catch {
          // ignore
        }

        // Safety net: ensure ScrollTrigger refreshes once hero images finish sizing
        fallbackTimer = setTimeout(() => {
          try {
            (window as unknown as RogRuntimeWindow).ScrollTrigger?.refresh?.(true);
          } catch {
            // ignore
          }
        }, 800);
      })();
    }

    return () => {
      window.fetch = origFetch;
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
      navHeader?.classList.remove("newHeader");
      if (fallbackTimer) clearTimeout(fallbackTimer);
      videoObserver.disconnect();
      mainContainer?.removeEventListener("click", anchorHandler);
      if (mainContainer && !mainContainer.isConnected) {
        try {
          (window as unknown as RogRuntimeWindow).ScrollTrigger?.getAll?.().forEach((st) => st.kill());
        } catch {
          // ignore
        }
        if (wfPage) document.documentElement.removeAttribute("data-wf-page");
        if (wfSite) document.documentElement.removeAttribute("data-wf-site");
      }
    };
  }, [scripts, slugPath, wfPage, wfSite]);

  return null;
}
