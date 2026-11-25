"use client";

import { useEffect } from "react";
import RogNavbar from "@/components/sites/rog-asus/RogNavbar";
import RogFooter from "@/components/sites/rog-asus/RogFooter";
import RogChatWidget from "@/components/sites/rog-asus/RogChatWidget";
import "./galaxy-z-fold8-ultra.css";
import { GALAXY_Z_FOLD8_ULTRA_HTML } from "./galaxy-z-fold8-ultra-html";

export default function SamsungGalaxyZFold8UltraOverview() {
  useEffect(() => {
    // 0. Inject vendor CSS into <head>
    const cssUrls = [
      "/sites/samsung/galaxy-z-fold8-ultra/css/fonts.css",
      "/sites/samsung/galaxy-z-fold8-ultra/css/vn-site.css",
      "/sites/samsung/galaxy-z-fold8-ultra/css/vn.min.css",
      "/sites/samsung/galaxy-z-fold8-ultra/css/dependencies.css",
      "/sites/samsung/galaxy-z-fold8-ultra/css/base-ux26.css",
      "/sites/samsung/galaxy-z-fold8-ultra/css/flagship-compact.css",
      "/sites/samsung/galaxy-z-fold8-ultra/css/floating-nav.css",
      "/sites/samsung/galaxy-z-fold8-ultra/css/static-content.css",
      "/sites/samsung/galaxy-z-fold8-ultra/css/common.min.css",
      "/sites/samsung/galaxy-z-fold8-ultra/css/viewer-style.css",
    ];
    const injectedLinks: HTMLLinkElement[] = [];
    for (const href of cssUrls) {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        document.head.appendChild(link);
        injectedLinks.push(link);
      }
    }

    // 1. Suppress video play()/pause() abort rejections in modern browsers
    const handleRejection = (e: PromiseRejectionEvent) => {
      if (
        e.reason?.name === "AbortError" ||
        (typeof e.reason?.message === "string" && e.reason.message.includes("pause"))
      ) {
        e.preventDefault();
      }
    };
    window.addEventListener("unhandledrejection", handleRejection);

    // 2. Set up document classes
    const html = document.documentElement;
    const body = document.body;

    const htmlClasses = ["samsung-page-active", "desktop"];
    html.classList.add(...htmlClasses);

    const bodyClasses = ["page-flagship", "theme-black"];
    body.classList.add(...bodyClasses);

    // 3. Initialize global Samsung framework variables on window
    const win = window as unknown as Record<string, unknown>;
    win.siteCode = "vn";
    win.FLAGSHIP_PROD_NAME = "galaxy-z-fold8-ultra";
    win.FLAGSHIP_PAGE_NAME = "features";
    win.COUNTRY_SHOP_STATUS = "buy";
    win.COUNTRY_SHOP_URL = "/vn/smartphones/galaxy-z-fold8-ultra/buy";
    win.sg = win.sg || {};
    const sg = win.sg as Record<string, unknown>;
    sg.common = sg.common || {};
    const sgCommon = sg.common as Record<string, unknown>;
    sgCommon.utils = sgCommon.utils || {};
    win.LOCAL_VARI = {
      selected: "Đã chọn",
      slide: "Trình chiếu",
      play: "Phát",
      pause: "Tạm dừng",
      default: "Màu mặc định",
      newWindow: "Mở trong cửa sổ mới",
      seeDisclaimer: "Xem Tuyên bố miễn trừ trách nhiệm",
      closeDisclaimer: "Đóng Tuyên bố miễn trừ trách nhiệm",
    };
    win.digitalData = win.digitalData || {
      page: {
        pageInfo: { pageTrack: "flagship pdp" },
        pathIndicator: { depth_2: "mobile" },
      },
      user: {},
    };

    // 4. Promote all lazy images so pictures load smoothly
    const container = document.querySelector(".galaxy-z-fold8-ultra-container");
    if (container) {
      const isMobile = window.innerWidth <= 768;
      const imgs = container.querySelectorAll<HTMLImageElement>("img");
      imgs.forEach((img) => {
        const targetSrc = isMobile
          ? img.getAttribute("data-src-mo") ||
            img.getAttribute("data-mobile-src") ||
            img.getAttribute("data-src-pc") ||
            img.getAttribute("data-desktop-src")
          : img.getAttribute("data-src-pc") ||
            img.getAttribute("data-desktop-src") ||
            img.getAttribute("data-src-mo") ||
            img.getAttribute("data-mobile-src");

        if (targetSrc && (!img.src || img.src.endsWith("/") || img.src.includes("undefined"))) {
          let clean = targetSrc.trim();
          if (clean.startsWith("//")) clean = "https:" + clean;
          img.src = clean;
        }
      });
    }

    // 5. Promote and auto-play all 19 video elements with IntersectionObserver
    const videos = document.querySelectorAll<HTMLVideoElement>(
      ".galaxy-z-fold8-ultra-container video"
    );
    const isMobile = window.innerWidth <= 768;
    videos.forEach((vid) => {
      const vidAttr = isMobile
        ? vid.getAttribute("data-video-src-mo") || vid.getAttribute("data-video-src-pc")
        : vid.getAttribute("data-video-src-pc") || vid.getAttribute("data-video-src-mo");

      if (vidAttr && (!vid.src || vid.src.endsWith("/"))) {
        let clean = vidAttr.trim();
        if (clean.startsWith("//")) clean = "https:" + clean;
        if (!clean.endsWith(".mp4")) clean += ".mp4";
        vid.src = clean;
      }
      vid.muted = true;
      vid.playsInline = true;
      vid.loop = true;
      vid.preload = "auto";
    });

    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const vid = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            vid.muted = true;
            vid.playsInline = true;
            vid.play().catch(() => {});
          } else {
            vid.pause();
          }
        });
      },
      { threshold: 0.1 }
    );
    videos.forEach((v) => videoObserver.observe(v));

    // 6. Floating Navigation Scroll & Theme Controller
    const handleScroll = () => {
      const nav = document.querySelector<HTMLElement>(".floating-navigation");
      if (!nav) return;
      const scrollY = window.scrollY || document.documentElement.scrollTop;

      // Fixed toggle when scrolled past hero
      if (scrollY > 300) {
        nav.classList.add("floating-navigation--fixed");
      } else {
        nav.classList.remove("floating-navigation--fixed");
      }

      // Check current section background color/theme
      const lightSection = document.elementFromPoint(window.innerWidth / 2, 120);
      if (lightSection) {
        const closestLight = lightSection.closest(
          ".theme-white, [class*='white'], .features-camera, .features-specs"
        );
        if (closestLight) {
          nav.classList.add("floating-navigation--theme-white");
          nav.classList.remove("floating-navigation--theme-black");
        } else {
          nav.classList.add("floating-navigation--theme-black");
          nav.classList.remove("floating-navigation--theme-white");
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // 7. Interactive Color Switcher Handler
    const handleColorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>(
        ".features-colors__tab button, .features-colors__selector-wrap button, .option-selector__color"
      );
      if (!target) return;

      const buttons = document.querySelectorAll(
        ".features-colors__tab button, .features-colors__selector-wrap button"
      );
      buttons.forEach((b) => {
        b.classList.remove("is-active", "active", "selected");
        b.setAttribute("aria-selected", "false");
      });
      target.classList.add("is-active", "active", "selected");
      target.setAttribute("aria-selected", "true");

      // Update color title if attribute exists
      const colorName =
        target.getAttribute("data-color-name") ||
        target.getAttribute("aria-label") ||
        target.innerText?.trim();
      if (colorName) {
        const titleEl = document.querySelector(".features-colors__title .color-name");
        if (titleEl) titleEl.textContent = colorName;
      }
    };
    document.addEventListener("click", handleColorClick);

    // 8. Inject Interactive Scripts sequentially
    const scriptUrls = [
      "/sites/samsung/galaxy-z-fold8-ultra/js/dependencies.js",
      "/sites/samsung/galaxy-z-fold8-ultra/js/base-ux26.js",
      "/sites/samsung/galaxy-z-fold8-ultra/js/flagship-compact.js",
      "/sites/samsung/galaxy-z-fold8-ultra/js/floating-nav.js",
      "/sites/samsung/galaxy-z-fold8-ultra/js/common.min.js",
      "/sites/samsung/galaxy-z-fold8-ultra/js/product-features.js",
      "/sites/samsung/galaxy-z-fold8-ultra/js/viewer-main.js",
    ];

    const injectedScripts: HTMLScriptElement[] = [];

    const loadScripts = async () => {
      for (const url of scriptUrls) {
        if (!document.querySelector(`script[src="${url}"]`)) {
          await new Promise<void>((resolve) => {
            const s = document.createElement("script");
            s.src = url;
            s.async = false;
            s.onload = () => {
              // Ensure jQuery alias $ is always available
              const w = window as unknown as Record<string, unknown>;
              if (w.jQuery && !w.$) w.$ = w.jQuery;
              resolve();
            };
            s.onerror = () => resolve();
            document.body.appendChild(s);
            injectedScripts.push(s);
          });
        }
      }
    };
    loadScripts();

    return () => {
      window.removeEventListener("unhandledrejection", handleRejection);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleColorClick);
      html.classList.remove(...htmlClasses);
      body.classList.remove(...bodyClasses);
      videoObserver.disconnect();
      injectedScripts.forEach((s) => {
        try {
          s.remove();
        } catch {
          // ignore
        }
      });
      injectedLinks.forEach((l) => {
        try {
          l.remove();
        } catch {
          // ignore
        }
      });
    };
  }, []);

  return (
    <article
      className="rog-page samsung-page galaxy-z-fold8-ultra-page"
      style={{ backgroundColor: "#000", color: "#fff", minHeight: "100vh" }}
    >
      {/* 1. Official ROG Header */}
      <RogNavbar />

      {/* 2. Samsung Galaxy Z Fold 8 Ultra Core (Sticky Floating Nav & 38 Product Sections) */}
      <div
        className="galaxy-z-fold8-ultra-container"
        dangerouslySetInnerHTML={{ __html: GALAXY_Z_FOLD8_ULTRA_HTML }}
        suppressHydrationWarning
      />

      {/* 4. Official ROG Footer */}
      <RogFooter />

      {/* 5. ROG AI Chat Widget */}
      <RogChatWidget />
    </article>
  );
}
