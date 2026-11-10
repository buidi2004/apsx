"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useEffect } from "react";
import "../RogProductDetail.css";
import "./matrix-style.css";
import { MATRIX_FEATURES_HTML } from "./matrix-html";
import RogCardMatrix5090PostFeatures from "./RogCardMatrix5090PostFeatures";

export default function RogCardMatrix5090Overview() {
  useEffect(() => {
    // 0. Inject vendor CSS into <head>
    const cssUrls = ["/sites/rog-asus/matrix-5090/css/hd-style.css"];
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
    const cleanupLinks = () => {
      injectedLinks.forEach((l) => { try { l.remove(); } catch { /* ignore */ } });
    };

    // Suppress video play()/pause() abort rejections in modern browsers
    const handleRejection = (e: PromiseRejectionEvent) => {
      if (
        e.reason?.name === "AbortError" ||
        (typeof e.reason?.message === "string" && e.reason.message.includes("pause"))
      ) {
        e.preventDefault();
      }
    };
    window.addEventListener("unhandledrejection", handleRejection);

    const triggerRefresh = () => {
      window.dispatchEvent(new Event("resize"));
      window.dispatchEvent(new Event("scroll"));
      const win = window as unknown as { refreshMatrixAnimations?: () => void };
      if (typeof win.refreshMatrixAnimations === "function") {
        win.refreshMatrixAnimations();
      }
    };

    // If script already loaded, just refresh
    if (document.querySelector("script[data-matrix-script]")) {
      triggerRefresh();
      return () => {
        window.removeEventListener("unhandledrejection", handleRejection);
        cleanupLinks();
      };
    }

    // Dynamically inject the official ROG Matrix RTX 5090 runtime script
    const script = document.createElement("script");
    script.src = "/sites/rog-asus/matrix-5090/js/matrix-main.js";
    script.setAttribute("data-matrix-script", "true");
    script.defer = true;
    script.onload = () => {
      triggerRefresh();
    };
    document.body.appendChild(script);

    const timer1 = setTimeout(triggerRefresh, 250);
    const timer2 = setTimeout(triggerRefresh, 700);
    const timer3 = setTimeout(triggerRefresh, 1500);

    return () => {
      window.removeEventListener("unhandledrejection", handleRejection);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      try {
        script.remove();
      } catch {
        // ignore
      }
      cleanupLinks();
    };
  }, []);

  return (
    <article className="rog-pd" style={{ backgroundColor: "#000", color: "#fff" }}>
      {/* 1. Breadcrumb navigation */}
      <div className="rog-pd-crumb-wrap">
        <nav className="rog-pd-crumb" aria-label="Breadcrumb">
          <Link href="/">Trang chủ</Link>
          <span className="rog-crumb-sep">›</span>
          <Link href="/vn/graphics-cards-group/">Card Đồ họa</Link>
          <span className="rog-crumb-sep">›</span>
          <Link href="/vn/graphics-cards-group/">ROG Matrix Series</Link>
          <span className="rog-crumb-sep">›</span>
          <span className="rog-crumb-curr">ROG Matrix GeForce RTX™ 5090 (30th Anniversary)</span>
        </nav>
      </div>

      {/* 2. Sticky Subbar */}
      <div className="rog-pd-subbar" style={{ position: "sticky", top: 50, zIndex: 900 }}>
        <div className="rog-pd-subbar-inner">
          <div className="rog-pd-subbar-left">
            <img
              src="/sites/rog-asus/matrix-5090/img/ksp/quad-fan.png"
              alt="ROG Matrix GeForce RTX™ 5090"
              className="rog-pd-subbar-thumb"
            />
            <div className="rog-pd-subbar-title">ROG Matrix GeForce RTX™ 5090 32GB</div>
          </div>

          <nav className="rog-pd-subbar-tabs" aria-label="Tabs sản phẩm">
            <Link
              href="/vn/graphics-cards/rog-matrix/rog-matrix-rtx5090-p32g-30th"
              className="rog-pd-tab-link is-active"
            >
              Tính năng (Xem thêm)
            </Link>
            <Link
              href="/vn/graphics-cards/rog-matrix/rog-matrix-rtx5090-p32g-30th/spec"
              className="rog-pd-tab-link"
            >
              Chi tiết / Thông số kỹ thuật
            </Link>
            <a href="#awards" className="rog-pd-tab-link">
              Giải thưởng
            </a>
            <a href="#pageContent-sec-cooling" className="rog-pd-tab-link">
              Tản nhiệt
            </a>
            <a href="#pageContent-sec-psu" className="rog-pd-tab-link">
              Nguồn cấp
            </a>
            <Link href="/vn/where-to-buy" className="rog-pd-tab-link">
              Nơi mua
            </Link>
            <Link href="/vn/support" className="rog-pd-tab-link">
              Hỗ trợ
            </Link>
          </nav>

          <div className="rog-pd-subbar-actions">
            <div className="rog-pd-subbar-price-wrap">
              <span className="rog-pd-subbar-price-label">Phiên bản giới hạn</span>
              <span className="rog-pd-subbar-price" style={{ color: "#ff0036", fontWeight: 700 }}>
                Kỷ Niệm 30 Năm
              </span>
            </div>
            <Link href="/vn/where-to-buy" className="rog-pd-buy-btn">
              Lựa Chọn
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Bespoke 1:1 ROG Matrix GeForce RTX 5090 Interactive Core (18 Official Sections) */}
      <div
        className="matrix-overview-container"
        dangerouslySetInnerHTML={{ __html: MATRIX_FEATURES_HTML }}
        suppressHydrationWarning
      />

      {/* 4. Official Post-Features (Awards, Video Reviews, Media Reviews, Ecosystem, Disclaimers) */}
      <RogCardMatrix5090PostFeatures />
    </article>
  );
}
