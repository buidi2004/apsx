"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useEffect } from "react";
import { RogApi } from "@/lib/api-client";
import "../RogProductDetail.css";
import "./duo-style.css";
import { DUO_FEATURES_HTML } from "./duo-html";
import RogZephyrusDuo2026PostFeatures from "./RogZephyrusDuo2026PostFeatures";

export default function RogZephyrusDuo2026Overview() {
  useEffect(() => {

    // Suppress video play()/pause() abort rejections in Next.js dev overlay
    const handleRejection = (e: PromiseRejectionEvent) => {
      if (
        e.reason?.name === "AbortError" ||
        (typeof e.reason?.message === "string" && e.reason.message.includes("pause"))
      ) {
        e.preventDefault();
      }
    };
    window.addEventListener("unhandledrejection", handleRejection);

    // Helper functions for newsletter modals
    const win = window as unknown as Record<string, unknown>;
    win.closeSubscribeEDM = () => {
      const el = document.querySelector(".subscribeEDM") as HTMLElement | null;
      if (el) el.style.display = "none";
    };
    win.getEmail = () => {
      const input = document.getElementById("inputEmail") as HTMLInputElement | null;
      return input?.value ?? "";
    };
    win.triggerSubscribeForm = async () => {
      const ok = await RogApi.subscribeNewsletter((win.getEmail as () => string)());
      alert(ok ? "Cảm ơn bạn đã đăng ký nhận thông tin ROG Zephyrus Duo 2026!" : "Không thể đăng ký lúc này.");
      if (ok) {
        const el = document.querySelector(".subscribeEDM") as HTMLElement | null;
        if (el) el.style.display = "none";
      }
    };

    // Sequential script loader
    const scripts = [
      "/sites/rog-asus/zephyrus-duo-2026/swiper-bundle.min.js",
      "/sites/rog-asus/zephyrus-duo-2026/gsap.min.js",
      "/sites/rog-asus/zephyrus-duo-2026/ScrollTrigger.min.js",
      "/sites/rog-asus/zephyrus-duo-2026/SplitText.js",
      "/sites/rog-asus/zephyrus-duo-2026/lazysizes.min.js",
      "/sites/rog-asus/zephyrus-duo-2026/ls.unveilhooks.js",
      "/sites/rog-asus/zephyrus-duo-2026/duo-main.js",
    ];

    const injectedScripts: HTMLScriptElement[] = [];

    const loadScript = (index: number) => {
      if (index >= scripts.length) {
        window.dispatchEvent(new Event("resize"));
        window.dispatchEvent(new Event("scroll"));
        const duoWin = window as unknown as { initDuoEngine?: () => void };
        if (typeof duoWin.initDuoEngine === "function") {
          duoWin.initDuoEngine();
        }
        document.querySelectorAll("video").forEach((v) => {
          v.muted = true;
          v.play().catch(() => {});
        });
        return;
      }

      const src = scripts[index];
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        loadScript(index + 1);
        return;
      }

      const s = document.createElement("script");
      s.src = src;
      s.async = false;
      s.onload = () => {
        const duoWin = window as unknown as { initDuoEngine?: () => void };
        if (typeof duoWin.initDuoEngine === "function") {
          duoWin.initDuoEngine();
        }
        loadScript(index + 1);
      };
      s.onerror = () => loadScript(index + 1);
      document.body.appendChild(s);
      injectedScripts.push(s);
    };

    loadScript(0);

    const triggerEngine = () => {
      window.dispatchEvent(new Event("resize"));
      window.dispatchEvent(new Event("scroll"));
      const duoWin = window as unknown as { initDuoEngine?: () => void };
      if (typeof duoWin.initDuoEngine === "function") {
        duoWin.initDuoEngine();
      }
      document.querySelectorAll("video").forEach((v) => {
        v.muted = true;
        v.play().catch(() => {});
      });
    };

    const timer1 = setTimeout(triggerEngine, 200);
    const timer2 = setTimeout(triggerEngine, 600);
    const timer3 = setTimeout(triggerEngine, 1500);

    return () => {
      window.removeEventListener("unhandledrejection", handleRejection);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      injectedScripts.forEach((s) => {
        if (s.parentNode) {
          s.parentNode.removeChild(s);
        }
      });
    };
  }, []);

  return (
    <article className="rog-pd rog-zephyrus-duo" style={{ backgroundColor: "#000", color: "#fff" }}>
      {/* 1. Breadcrumb */}
      <div className="rog-pd-crumb-wrap">
        <nav className="rog-pd-crumb" aria-label="Breadcrumb">
          <Link href="/">Trang chủ</Link>
          <span className="rog-crumb-sep">›</span>
          <Link href="/vn/laptops-group/">Laptop Gaming ASUS ROG</Link>
          <span className="rog-crumb-sep">›</span>
          <Link href="/vn/laptops/rog-zephyrus-series">ROG Zephyrus Series</Link>
          <span className="rog-crumb-sep">›</span>
          <span className="rog-crumb-curr">ROG Zephyrus Duo (2026) GX651</span>
        </nav>
      </div>

      {/* 2. Sticky Product Subbar with official 6 tabs */}
      <div className="rog-pd-subbar" style={{ position: "sticky", top: 50, zIndex: 900 }}>
        <div className="rog-pd-subbar-inner">
          <div className="rog-pd-subbar-left">
            <img
              src="https://dlcdnwebimgs.asus.com/gain/52E0E939-8413-4B35-8197-0F581DB0CC30"
              alt="ROG Zephyrus Duo (2026) GX651"
              className="rog-pd-subbar-thumb"
            />
            <div className="rog-pd-subbar-title">ROG Zephyrus Duo (2026) GX651</div>
          </div>

          <nav className="rog-pd-subbar-tabs" aria-label="Tabs sản phẩm">
            <Link
              href="/vn/laptops/rog-zephyrus/rog-zephyrus-duo-2026"
              className="rog-pd-tab-link is-active"
            >
              Tính năng (Xem thêm)
            </Link>
            <Link
              href="/vn/laptops/rog-zephyrus/rog-zephyrus-duo-2026/spec"
              className="rog-pd-tab-link"
            >
              Chi tiết / Thông số kỹ thuật
            </Link>
            <a
              href="#awards"
              className="rog-pd-tab-link"
            >
              Giải thưởng
            </a>
            <Link
              href="/vn/where-to-buy"
              className="rog-pd-tab-link"
            >
              Nơi mua
            </Link>
            <Link
              href="/vn/support"
              className="rog-pd-tab-link"
            >
              Hỗ trợ
            </Link>
          </nav>

          <div className="rog-pd-subbar-actions">
            <div className="rog-pd-subbar-price-wrap">
              <span className="rog-pd-subbar-price-label">Giá trên ASUS estore</span>
              <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                <span className="rog-pd-subbar-price" style={{ color: "#ff0036", fontWeight: 700 }}>189.990.000 ₫</span>
                <span style={{ fontSize: "12px", color: "#888", textDecoration: "line-through" }}>199.990.000 ₫</span>
              </div>
            </div>
            <Link
              href="/vn/where-to-buy"
              className="rog-pd-buy-btn"
            >
              Mua ngay
            </Link>
          </div>
        </div>
      </div>

      {/* 3. 1:1 Bespoke Zephyrus Duo 2026 Experience (14 Sections) */}
      <div
        className="duo-overview-container"
        dangerouslySetInnerHTML={{ __html: DUO_FEATURES_HTML }}
        suppressHydrationWarning
      />

      {/* 4. Official 1:1 Post-Features (Awards, Newsletter, Ecosystem, Disclaimers) */}
      <RogZephyrusDuo2026PostFeatures />
    </article>
  );
}
