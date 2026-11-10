"use client";

import { useEffect } from "react";
import RogNavbar from "@/components/sites/rog-asus/RogNavbar";
import RogFooter from "@/components/sites/rog-asus/RogFooter";
import RogChatWidget from "@/components/sites/rog-asus/RogChatWidget";
import "./apple-proled.css";
import { APPLE_PROLED_HTML } from "./apple-proled-html";

export default function AppleMacbookProProledOverview() {
  useEffect(() => {
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
      "inline-media",
      "display-enhanced",
      "performance-enhanced",
      "enhanced-touch-icons",
      "apple-page-active",
    ];
    html.classList.add(...htmlClasses);

    const bodyClasses = [
      "page-overview",
      "page-overview-macbook-pro-proled-xdr-display",
    ];
    body.classList.add(...bodyClasses);
    body.setAttribute(
      "data-component-list",
      "FocusManager LocalnavTrigger LocalnavThemeChanger MediaHero TextGlow HeroGlowTrigger WelcomeLayout"
    );
    body.setAttribute("data-localnav-trigger-anchor", ".main");
    body.setAttribute("data-localnav-trigger-distance", "-50vh");
    body.setAttribute("data-anim-scroll-group", "body");

    // 3. Auto-play videos on scroll with IntersectionObserver
    const videos = document.querySelectorAll<HTMLVideoElement>(".apple-proled-container video");
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

    // 4. Inject Apple Interactive Scripts (excluding globalheader & globalfooter)
    const scriptUrls = [
      "/sites/apple/macbook-pro-proled/js/head.built.js",
      "/sites/apple/macbook-pro-proled/js/ac-localnav.built.js",
      "/sites/apple/macbook-pro-proled/js/Welcome.built.js",
      "/sites/apple/macbook-pro-proled/js/main.built.js",
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
    };
  }, []);

  return (
    <article className="rog-page apple-integrated-page" style={{ backgroundColor: "#000", color: "#fff", minHeight: "100vh" }}>
      {/* 1. Official ROG Header */}
      <RogNavbar />

      {/* 2. Apple Stylesheets & Font Links */}
      <link rel="stylesheet" href="/sites/apple/macbook-pro-proled/css/apple-fonts.css" />
      <link rel="stylesheet" href="/sites/apple/macbook-pro-proled/css/ac-localnav.built.css" />
      <link rel="stylesheet" href="/sites/apple/macbook-pro-proled/css/campaigns-overview.built.css" />
      <link rel="stylesheet" href="/sites/apple/macbook-pro-proled/css/overview.built.css" />
      <link rel="stylesheet" href="/sites/apple/macbook-pro-proled/css/modal.css" />

      {/* 3. MacBook Pro with PROLED XDR Display Core (Sticky Localnav & 19 Sections) */}
      <div
        className="apple-proled-container"
        dangerouslySetInnerHTML={{ __html: APPLE_PROLED_HTML }}
        suppressHydrationWarning
      />

      {/* 4. Official ROG Footer */}
      <RogFooter />

      {/* 5. ROG AI Chat Widget */}
      <RogChatWidget />
    </article>
  );
}
