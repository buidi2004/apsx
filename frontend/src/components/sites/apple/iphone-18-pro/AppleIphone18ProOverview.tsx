"use client";

import { useEffect } from "react";
import RogNavbar from "@/components/sites/rog-asus/RogNavbar";
import RogFooter from "@/components/sites/rog-asus/RogFooter";
import RogChatWidget from "@/components/sites/rog-asus/RogChatWidget";
import "./iphone-18-pro.css";
import { IPHONE_18_PRO_HTML } from "./iphone-18-pro-html";

export default function AppleIphone18ProOverview() {
  useEffect(() => {
    // 0. Inject vendor CSS into <head>
    const cssUrls = [
      "/sites/apple/macbook-pro-proled/css/apple-fonts.css",
      "/sites/apple/iphone-18-pro/css/overview.built.css",
      "/sites/apple/iphone-duo/css/modal.css",
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

    // 2. Set up Apple document classes & attributes
    const html = document.documentElement;
    const body = document.body;

    const htmlClasses = [
      "js",
      "no-touch",
      "no-reduced-motion",
      "desktop",
      "enhanced",
      "enhanced-rt",
      "inline-media",
      "inline-media-alpha",
      "apple-page-active",
    ];
    html.classList.add(...htmlClasses);

    const bodyClasses = ["page-overview", "globalheader-dark"];
    body.classList.add(...bodyClasses);
    body.setAttribute(
      "data-component-list",
      "AutoARQL FocusManager MediaHero DeepLink"
    );
    body.setAttribute("data-anim-scroll-group", "body");

    // 3. Auto-play videos on scroll with IntersectionObserver
    const videos = document.querySelectorAll<HTMLVideoElement>(".iphone-18-pro-container video");
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

    // 4. Inject Apple Interactive Scripts
    const scriptUrls = [
      "/sites/apple/iphone-18-pro/js/head.built.js",
      "/sites/apple/iphone-18-pro/js/main.built.js",
    ];

    const injectedScripts: HTMLScriptElement[] = [];

    const loadScripts = async () => {
      for (const url of scriptUrls) {
        if (!document.querySelector(`script[src="${url}"]`)) {
          const s = document.createElement("script");
          s.src = url;
          s.defer = true;
          document.body.appendChild(s);
          injectedScripts.push(s);
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
      className="rog-page apple-integrated-page iphone-18-pro-page"
      style={{ backgroundColor: "#000", color: "#fff", minHeight: "100vh" }}
    >
      {/* 1. Official ROG Header */}
      <RogNavbar />

      {/* 2. iPhone 18 Pro Core (Sticky Localnav & 24 Product Sections) */}
      <div
        className="iphone-18-pro-container"
        dangerouslySetInnerHTML={{ __html: IPHONE_18_PRO_HTML }}
        suppressHydrationWarning
      />

      {/* 4. Official ROG Footer */}
      <RogFooter />

      {/* 5. ROG AI Chat Widget */}
      <RogChatWidget />
    </article>
  );
}
