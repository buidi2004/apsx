"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RogApi } from "@/lib/api-client";
import { useCart } from "@/lib/cart";
import "../RogProductDetail.css";
import "./matrix-style.css";
import { MATRIX_FEATURES_HTML } from "./matrix-html";
import RogCardMatrix5090PostFeatures from "./RogCardMatrix5090PostFeatures";

export default function RogCardMatrix5090Overview() {
  const router = useRouter();
  const { addLine } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [livePrice, setLivePrice] = useState<string>("99.990.000 ₫");
  const [priceLabel, setPriceLabel] = useState<string>("Giá trên ASUS estore");
  const [unitPriceNum, setUnitPriceNum] = useState<number>(99990000);
  const [stockStatus, setStockStatus] = useState<number>(0);

  useEffect(() => {
    RogApi.getBatchPricing(["graphics-cards/rog-matrix/rog-matrix-rtx5090-p32g-30th"])
      .then((res) => {
        if (res && res.length > 0) {
          const item = res[0];
          if (item.formattedPrice) {
            setLivePrice(item.formattedPrice);
            setPriceLabel("Giá trên ASUS estore");
          }
          if (item.price) setUnitPriceNum(item.price);
          setStockStatus(item.stockStatus);
        }
      })
      .catch(() => {});
  }, []);

  const handleBuyNow = () => {
    if (unitPriceNum > 0) {
      addLine({
        slug: "graphics-cards/rog-matrix/rog-matrix-rtx5090-p32g-30th",
        name: "ROG Matrix Platinum GeForce RTX™ 5090 - ASUS 30th Anniversary Edition",
        image: "/sites/rog-asus/img/vga/hot-matrix-5090.webp",
        price: unitPriceNum,
        href: "/vn/graphics-cards/rog-matrix/rog-matrix-rtx5090-p32g-30th",
        selectedSpecs: "32GB GDDR7 · 800W Dual BTF/12V-2x6 · Quad Fan Liquid Metal",
      });
      router.push("/vn/checkout");
    } else {
      router.push("/vn/where-to-buy");
    }
  };
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
      <div
        id="productTabBarContainer"
        className="rog-pd-subbar productTabBarContainer ProductTabBar__productTabBarContainer__O9P3C"
        style={{ position: "sticky", top: 50, zIndex: 999, fontSize: "16px", lineHeight: "18.4px" }}
      >
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
              Tính năng
            </Link>
            <Link
              href="/vn/graphics-cards/rog-matrix/rog-matrix-rtx5090-p32g-30th/spec"
              className="rog-pd-tab-link"
            >
              Thông số kỹ thuật
            </Link>
            <Link href="/vn/graphics-cards/rog-matrix/rog-matrix-rtx5090-p32g-30th/award" className="rog-pd-tab-link">
              Giải thưởng
            </Link>
            <Link href="/vn/graphics-cards/rog-matrix/rog-matrix-rtx5090-p32g-30th/gallery" className="rog-pd-tab-link">
              Thư viện
            </Link>
            <a href="#pageContent-sec-cooling" className="rog-pd-tab-link">
              Tản nhiệt
            </a>
            <a href="#pageContent-sec-psu" className="rog-pd-tab-link">
              Nguồn cấp
            </a>
            <Link href="/vn/graphics-cards/rog-matrix/rog-matrix-rtx5090-p32g-30th/wtb" className="rog-pd-tab-link">
              Nơi mua
            </Link>
            <Link href="/vn/graphics-cards/rog-matrix/rog-matrix-rtx5090-p32g-30th/helpdesk" className="rog-pd-tab-link">
              Hỗ trợ
            </Link>
          </nav>

          <div className="rog-pd-subbar-actions">
            <div className="rog-pd-subbar-price-wrap">
              <span className="rog-pd-subbar-price-label">{priceLabel}</span>
              <span className="rog-pd-subbar-price" style={{ color: "#ff0036", fontWeight: 700 }}>
                {livePrice}
              </span>
            </div>
            <button
              type="button"
              onClick={handleBuyNow}
              className="rog-pd-buy-btn"
              style={{ cursor: "pointer", border: "none" }}
            >
              {stockStatus === 1 ? "TẠM HẾT HÀNG" : "LỰA CHỌN"}
            </button>
            <button
              type="button"
              aria-label="Toggle mobile menu"
              className="rog-pd-subbar-burger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span>{mobileMenuOpen ? "ĐÓNG" : "MENU"}</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: mobileMenuOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}>
                <path d="M1 4l5 6 5-6H1z" fill="#fff" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile dropdown drawer */}
        {mobileMenuOpen && (
          <div className="rog-pd-subbar-mobile-menu">
            <Link
              href="/vn/graphics-cards/rog-matrix/rog-matrix-rtx5090-p32g-30th"
              className="rog-pd-subbar-mobile-link is-active"
              onClick={() => setMobileMenuOpen(false)}
            >
              Tính năng
            </Link>
            <Link
              href="/vn/graphics-cards/rog-matrix/rog-matrix-rtx5090-p32g-30th/spec"
              className="rog-pd-subbar-mobile-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Thông số kỹ thuật
            </Link>
            <Link
              href="/vn/graphics-cards/rog-matrix/rog-matrix-rtx5090-p32g-30th/award"
              className="rog-pd-subbar-mobile-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Giải thưởng
            </Link>
            <Link
              href="/vn/graphics-cards/rog-matrix/rog-matrix-rtx5090-p32g-30th/gallery"
              className="rog-pd-subbar-mobile-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Thư viện
            </Link>
            <Link
              href="/vn/graphics-cards/rog-matrix/rog-matrix-rtx5090-p32g-30th/wtb"
              className="rog-pd-subbar-mobile-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Nơi mua
            </Link>
            <Link
              href="/vn/graphics-cards/rog-matrix/rog-matrix-rtx5090-p32g-30th/helpdesk"
              className="rog-pd-subbar-mobile-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Hỗ trợ
            </Link>
          </div>
        )}
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
