"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import { RogApi } from "@/lib/api-client";
import RogProductAwards from "@/components/sites/rog-asus/universal/RogProductAwards";
import "../RogProductDetail.css";
import "./kjp-style.css";
import { KJP_FEATURES_HTML } from "./kjp-html";

export default function RogFlowZ13KjpOverview() {
  const router = useRouter();
  const { addLine } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [livePrice, setLivePrice] = useState("109.990.000 ₫");
  const [unitPriceNum, setUnitPriceNum] = useState(109990000);

  const handleBuyNow = () => {
    addLine({
      slug: "laptops/rog-flow/rog-flow-z13-kjp",
      name: "ROG Flow Z13-KJP (2026)",
      image: "/sites/rog-asus/img/detail/z13-kjp-front.webp",
      price: unitPriceNum,
      href: "/vn/laptops/rog-flow/rog-flow-z13-kjp",
      selectedSpecs: "Ryzen AI Max+ 395 / 128GB RAM",
    });
    router.push("/vn/checkout");
  };

  useEffect(() => {
    RogApi.getBatchPricing(["laptops/rog-flow/rog-flow-z13-kjp"])
      .then((res) => {
        if (res && res.length > 0 && res[0].formattedPrice) {
          setLivePrice(res[0].formattedPrice);
          if (res[0].price) setUnitPriceNum(res[0].price);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
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
      const win = window as unknown as { refreshKjpAnimations?: () => void };
      if (typeof win.refreshKjpAnimations === "function") {
        win.refreshKjpAnimations();
      }
    };

    if (document.querySelector("script[data-kjp-script]")) {
      triggerRefresh();
      return () => {
        window.removeEventListener("unhandledrejection", handleRejection);
      };
    }

    const script = document.createElement("script");
    script.src = "/sites/rog-asus/flow-z13-kjp/kjp-main.js";
    script.setAttribute("data-kjp-script", "true");
    script.defer = true;
    script.onload = () => {
      triggerRefresh();
    };
    document.body.appendChild(script);

    const timer1 = setTimeout(triggerRefresh, 300);
    const timer2 = setTimeout(triggerRefresh, 800);
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
    };
  }, []);

  return (
    <article className="rog-pd" style={{ backgroundColor: "#000", color: "#fff" }}>
      {/* breadcrumb */}
      <div className="rog-pd-crumb-wrap">
        <nav className="rog-pd-crumb" aria-label="Breadcrumb">
          <Link href="/">Trang chủ</Link>
          <span className="rog-crumb-sep">›</span>
          <Link href="/vn/laptops-group/">Laptop Gaming ASUS ROG</Link>
          <span className="rog-crumb-sep">›</span>
          <Link href="/vn/laptops/rog-flow-series">ROG Flow Series</Link>
          <span className="rog-crumb-sep">›</span>
          <span className="rog-crumb-curr">ROG Flow Z13-KJP</span>
        </nav>
      </div>

      {/* sticky subbar with tabs */}
      <div
        id="productTabBarContainer"
        className="rog-pd-subbar productTabBarContainer ProductTabBar__productTabBarContainer__O9P3C"
        style={{ position: "sticky", top: 50, zIndex: 999, fontSize: "16px", lineHeight: "18.4px" }}
      >
        <div className="rog-pd-subbar-inner">
          <div className="rog-pd-subbar-left">
            <img
              src="/sites/rog-asus/img/detail/z13-kjp-front.webp"
              alt="ROG Flow Z13-KJP"
              className="rog-pd-subbar-thumb"
            />
            <div className="rog-pd-subbar-title">ROG Flow Z13-KJP</div>
          </div>

          <nav className="rog-pd-subbar-tabs" aria-label="Tabs sản phẩm">
            <Link
              href="/vn/laptops/rog-flow/rog-flow-z13-kjp"
              className="rog-pd-tab-link is-active"
            >
              Tính năng
            </Link>
            <Link
              href="/vn/laptops/rog-flow/rog-flow-z13-kjp/spec"
              className="rog-pd-tab-link"
            >
              Thông số kỹ thuật
            </Link>
            <Link
              href="/vn/laptops/rog-flow/rog-flow-z13-kjp/award"
              className="rog-pd-tab-link"
            >
              Giải thưởng
            </Link>
            <Link
              href="/vn/laptops/rog-flow/rog-flow-z13-kjp/gallery"
              className="rog-pd-tab-link"
            >
              Thư viện
            </Link>
            <Link
              href="/vn/laptops/rog-flow/rog-flow-z13-kjp/wtb"
              className="rog-pd-tab-link"
            >
              Nơi mua
            </Link>
            <Link
              href="/vn/laptops/rog-flow/rog-flow-z13-kjp/helpdesk"
              className="rog-pd-tab-link"
            >
              Hỗ trợ
            </Link>
          </nav>

          <div className="rog-pd-subbar-actions" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <div className="rog-pd-subbar-price-wrap">
              <span className="rog-pd-subbar-price-label">Giá trên ASUS estore</span>
              <span className="rog-pd-subbar-price">{livePrice}</span>
            </div>
            <Link
              href="/vn/laptops/rog-flow/rog-flow-z13-kjp/spec"
              className="rog-pd-buy-btn"
              style={{ background: "#ff0036", color: "#fff", textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
            >
              LỰA CHỌN
            </Link>
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
              href="/vn/laptops/rog-flow/rog-flow-z13-kjp"
              className="rog-pd-subbar-mobile-link is-active"
              onClick={() => setMobileMenuOpen(false)}
            >
              Tính năng
            </Link>
            <Link
              href="/vn/laptops/rog-flow/rog-flow-z13-kjp/spec"
              className="rog-pd-subbar-mobile-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Thông số kỹ thuật
            </Link>
            <Link
              href="/vn/laptops/rog-flow/rog-flow-z13-kjp/award"
              className="rog-pd-subbar-mobile-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Giải thưởng
            </Link>
            <Link
              href="/vn/laptops/rog-flow/rog-flow-z13-kjp/gallery"
              className="rog-pd-subbar-mobile-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Thư viện
            </Link>
            <Link
              href="/vn/laptops/rog-flow/rog-flow-z13-kjp/wtb"
              className="rog-pd-subbar-mobile-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Nơi mua
            </Link>
            <Link
              href="/vn/laptops/rog-flow/rog-flow-z13-kjp/helpdesk"
              className="rog-pd-subbar-mobile-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Hỗ trợ
            </Link>
          </div>
        )}
      </div>

      {/* 1:1 Bespoke KJP Experience Container */}
      <div
        className="kjp-overview-container"
        dangerouslySetInnerHTML={{ __html: KJP_FEATURES_HTML }}
        suppressHydrationWarning
      />

      {/* Official Awards & Media Reviews */}
      <RogProductAwards productName="ROG Flow Z13-KJP (2026)" />

      {/* Footer disclaimers */}
      <footer className="rog-pd-foot-note" style={{ padding: "40px 24px", background: "#0b0b0b", borderTop: "1px solid #222" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", fontSize: "13px", color: "#888", lineHeight: 1.8 }}>
          <p>
            *ROG Flow Z13-KJP là sản phẩm hợp tác đặc biệt giữa Republic of Gamers và KOJIMA PRODUCTIONS.
            Mọi hình ảnh, logo Ludens và thiết kế nhân vật thuộc bản quyền của © KOJIMA PRODUCTIONS.
          </p>
          <p>
            *Thông số kỹ thuật, màn hình ROG Nebula 2.5K 180Hz, vi xử lý AMD Ryzen™ AI MAX+ 395 và bộ nhớ LPDDR5X 128GB
            có thể thay đổi tùy khu vực phân phối. Vui lòng tham khảo bảng thông số kỹ thuật chi tiết để biết cấu hình chính xác tại Việt Nam.
          </p>
        </div>
      </footer>
    </article>
  );
}
