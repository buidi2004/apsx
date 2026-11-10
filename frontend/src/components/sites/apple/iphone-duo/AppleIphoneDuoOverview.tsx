"use client";

import Link from "next/link";
import { useEffect } from "react";
import RogNavbar from "@/components/sites/rog-asus/RogNavbar";
import RogFooter from "@/components/sites/rog-asus/RogFooter";
import RogChatWidget from "@/components/sites/rog-asus/RogChatWidget";
import "./iphone-duo.css";
import { IPHONE_DUO_HTML } from "./iphone-duo-html";

export default function AppleIphoneDuoOverview() {
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
      "enhanced-rt",
      "inline-media",
      "inline-media-alpha",
      "apple-page-active",
    ];
    html.classList.add(...htmlClasses);

    const bodyClasses = ["page-overview"];
    body.classList.add(...bodyClasses);
    body.setAttribute("data-component-list", "AutoARQL DeepLink FocusManager WelcomeLayout");
    body.setAttribute("data-anim-scroll-group", "body");

    // 3. Auto-play videos on scroll with IntersectionObserver
    const videos = document.querySelectorAll<HTMLVideoElement>(".iphone-duo-container video");
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
      "/sites/apple/iphone-duo/js/head.built.js",
      "/sites/apple/iphone-duo/js/welcome.built.js",
      "/sites/apple/iphone-duo/js/main.built.js",
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
    <article
      className="rog-page apple-integrated-page iphone-duo-page"
      style={{ backgroundColor: "#000", color: "#fff", minHeight: "100vh" }}
    >
      {/* 1. Official ROG Header */}
      <RogNavbar />

      {/* 2. Apple Stylesheets & Font Links */}
      <link rel="stylesheet" href="/sites/apple/macbook-pro-proled/css/apple-fonts.css" />
      <link rel="stylesheet" href="/sites/apple/iphone-duo/css/overview.built.css" />
      <link rel="stylesheet" href="/sites/apple/iphone-duo/css/modal.css" />

      {/* 3. iPhone Duo Core (Sticky Localnav & 19 Product Sections) */}
      <div
        className="iphone-duo-container"
        dangerouslySetInnerHTML={{ __html: IPHONE_DUO_HTML }}
        suppressHydrationWarning
      />

      {/* 4. Official ROG Footer */}
      <RogFooter />

      {/* 5. ROG AI Chat Widget */}
      <RogChatWidget />
    </article>
  );
}
