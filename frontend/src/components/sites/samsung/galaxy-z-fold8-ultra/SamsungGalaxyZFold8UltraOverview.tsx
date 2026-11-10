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

    const htmlClasses = [
      "samsung-page-active",
      "desktop",
    ];
    html.classList.add(...htmlClasses);

    const bodyClasses = ["page-flagship", "theme-black"];
    body.classList.add(...bodyClasses);

    // 3. Auto-play videos on scroll with IntersectionObserver
    const videos = document.querySelectorAll<HTMLVideoElement>(
      ".galaxy-z-fold8-ultra-container video"
    );
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

    // 4. Inject Interactive Scripts sequentially
    const scriptUrls = [
      "/sites/samsung/galaxy-z-fold8-ultra/js/common.min.js",
      "/sites/samsung/galaxy-z-fold8-ultra/js/floating-nav.js",
    ];

    const injectedScripts: HTMLScriptElement[] = [];

    const loadScripts = async () => {
      // Ensure window.sg exists
      const win = window as unknown as Record<string, unknown>;
      win.sg = win.sg || { common: { libs: {}, $q: () => ({ target: [], on: () => {}, off: () => {} }), constants: { BREAKPOINTS: {} }, utils: { bindRaf: () => {} }, menu: {} } };

      for (const url of scriptUrls) {
        if (!document.querySelector(`script[src="${url}"]`)) {
          await new Promise<void>((resolve) => {
            const s = document.createElement("script");
            s.src = url;
            s.async = false;
            s.onload = () => resolve();
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
      injectedLinks.forEach((l) => { try { l.remove(); } catch { /* ignore */ } });
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
