"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useEffect, useState } from "react";
import { RogApi } from "@/lib/api-client";
import "../RogProductDetail.css";
import "./g16-style.css";
import "./subbar.css";
import { G16_FEATURES_HTML } from "./g16-html";
import RogZephyrusG16PostFeatures from "./RogZephyrusG16PostFeatures";

export default function RogZephyrusG16Gu605Overview() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Suppress video play()/pause() abort rejections in dev overlay
    const handleRejection = (e: PromiseRejectionEvent) => {
      if (
        e.reason?.name === "AbortError" ||
        (typeof e.reason?.message === "string" && e.reason.message.includes("pause"))
      ) {
        e.preventDefault();
      }
    };
    window.addEventListener("unhandledrejection", handleRejection);

    // Define helper handlers used by embedded HTML
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
      alert(ok ? "Cảm ơn bạn đã đăng ký nhận thông tin ROG Zephyrus G16!" : "Không thể đăng ký lúc này.");
      if (ok) {
        const el = document.querySelector(".subscribeEDM") as HTMLElement | null;
        if (el) el.style.display = "none";
      }
    };

    if (document.querySelector("script[data-g16-main]")) {
      window.dispatchEvent(new Event("scroll"));
      return () => {
        window.removeEventListener("unhandledrejection", handleRejection);
      };
    }

    // Step 1: Ensure official jQuery 1.12.4 is loaded FIRST before g16-main.js
    const loadMainScript = () => {
      if (document.querySelector("script[data-g16-main]")) return;
      const mainScript = document.createElement("script");
      mainScript.src = "/sites/rog-asus/zephyrus-g16/g16-main.js";
      mainScript.setAttribute("data-g16-main", "true");
      mainScript.defer = true;
      mainScript.onload = () => {
        window.dispatchEvent(new Event("resize"));
        window.dispatchEvent(new Event("scroll"));
        const wpWin = window as unknown as { Waypoint?: { refreshAll?: () => void } };
        if (wpWin.Waypoint && typeof wpWin.Waypoint.refreshAll === "function") {
          wpWin.Waypoint.refreshAll();
        }
      };
      document.body.appendChild(mainScript);
    };

    let jqScript: HTMLScriptElement | null = document.querySelector("script[data-g16-jq]");
    if (!jqScript && !(window as unknown as { jQuery?: unknown }).jQuery) {
      jqScript = document.createElement("script");
      jqScript.src = "/sites/rog-asus/zephyrus-g16/jquery-1.12.4.min.js";
      jqScript.setAttribute("data-g16-jq", "true");
      jqScript.onload = () => {
        loadMainScript();
      };
      document.body.appendChild(jqScript);
    } else {
      loadMainScript();
    }

    const timer1 = setTimeout(() => {
      window.dispatchEvent(new Event("scroll"));
    }, 400);
    const timer2 = setTimeout(() => {
      window.dispatchEvent(new Event("scroll"));
    }, 1000);

    return () => {
      window.removeEventListener("unhandledrejection", handleRejection);
      clearTimeout(timer1);
      clearTimeout(timer2);
      const mainEl = document.querySelector("script[data-g16-main]");
      if (mainEl?.parentNode) {
        mainEl.parentNode.removeChild(mainEl);
      }
    };
  }, []);

  return (
    <article className="rog-pd" style={{ backgroundColor: "#000", color: "#fff" }}>
      {/* 1:1 Breadcrumbs */}
      <div className="rog-pd-crumb-wrap">
        <nav className="rog-pd-crumb" aria-label="Breadcrumb">
          <Link href="/">Trang chủ</Link>
          <span className="rog-crumb-sep">›</span>
          <Link href="/vn/laptops-group/">Laptop Gaming ASUS ROG</Link>
          <span className="rog-crumb-sep">›</span>
          <Link href="/vn/laptops/rog-zephyrus-series">ROG Zephyrus Series</Link>
          <span className="rog-crumb-sep">›</span>
          <span className="rog-crumb-curr">ROG Zephyrus G16 (2025) GU605</span>
        </nav>
      </div>

      {/* 1:1 Official Sticky Subbar */}
      <div
        id="productTabBarContainer"
        className="productTabBarContainer ProductTabBar__productTabBarContainer__O9P3C"
        style={{ position: "sticky", top: 0, zIndex: 100 }}
      >
        <div className="ProductTabBar__productTabBarWrapper__NkfAp">
          {/* Left info: Thumbnail + Title + Price */}
          <div className="ProductTabBar__productInfo__kijFw">
            <Link
              href="/vn/laptops/rog-zephyrus/rog-zephyrus-g16-2025-gu605/"
              className="ProductTabBar__productName__2TSo7"
              style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}
            >
              <img
                src="/sites/rog-asus/zephyrus-g16/subbar-thumb.webp"
                alt="ROG Zephyrus G16 (2025) GU605"
                style={{ width: "42px", height: "30px", objectFit: "contain" }}
              />
              <h1>ROG Zephyrus G16 (2025) GU605</h1>
            </Link>

            <div className="ProductTabBar__productBuyPrice__GImtH ProductTabBar__mobile__JCkq0">
              <span className="ProductTabBar__productStartingAt__GEQtS">Giá khởi điểm trên ASUS estore là</span>
              <span className="ProductTabBar__productMoney__Y7npp">73.990.000 ₫</span>
              <span className="ProductTabBar__originalPriceValue__BQdUC">74.990.000 ₫</span>
            </div>
          </div>

          {/* Right actions: Desktop Price + "Lựa Chọn" button + Desktop Tabs */}
          <div className="ProductTabBar__productTabBarList__7JGkm">
            <div className="ProductTabBar__productTabWrapper__wiiO+">
              <div className="ProductTabBar__productTabBarBuyNow__LuhPt">
                <div className="ProductTabBar__productBuyPrice__GImtH">
                  <span className="ProductTabBar__productStartingAt__GEQtS">Giá khởi điểm trên ASUS estore là</span>
                  <span className="ProductTabBar__productMoney__Y7npp">73.990.000 ₫</span>
                  <span className="ProductTabBar__originalPriceValue__BQdUC">74.990.000 ₫</span>
                </div>
                <div className="ButtonRed__redFullButton__0lMzl ButtonRed__isProductBarButton__qIAJB">
                  <Link
                    href="/vn/laptops/rog-zephyrus/rog-zephyrus-g16-2025-gu605/spec/"
                    className="btn ButtonRed__btnRed__SXGza ButtonRed__isFull__6Glcz ButtonRed__isFilter__EzHBw ButtonRed__modelButton__tDIKt"
                  >
                    <div className="ButtonRed__inner__U++OE">
                      <span className="buttonName">Lựa Chọn</span>
                    </div>
                    <div className="ButtonRed__hoverColor__0DIt8" />
                  </Link>
                </div>
              </div>

              {/* Desktop 6 Tabs */}
              <div className="ProductTabBar__productTabDesktop__Al-sY">
                <div className="ProductTabBar__productTabBarBottom__AnMuB">
                  <ul role="list" className="tabList">
                    <li className="tabItem ProductTabBar__active__N4qFo">
                      <Link href="/vn/laptops/rog-zephyrus/rog-zephyrus-g16-2025-gu605" id="rogContent">
                        Tính năng (Xem thêm)
                      </Link>
                    </li>
                    <li className="tabItem">
                      <Link href="/vn/laptops/rog-zephyrus/rog-zephyrus-g16-2025-gu605/spec" id="tabItemLink_1">
                        Chi tiết / Thông số kỹ thuật
                      </Link>
                    </li>
                    <li className="tabItem">
                      <a
                        href="#awards"
                        id="tabItemLink_2"
                        onClick={(e) => {
                          e.preventDefault();
                          const el = document.getElementById("awards");
                          if (el) el.scrollIntoView({ behavior: "smooth" });
                        }}
                      >
                        Giải thưởng
                      </a>
                    </li>
                    <li className="tabItem">
                      <Link href="/vn/laptops/rog-zephyrus/rog-zephyrus-g16-2025-gu605/gallery/" id="tabItemLink_3">
                        Thư viện
                      </Link>
                    </li>
                    <li className="tabItem">
                      <Link href="/vn/where-to-buy" id="tabItemLink_4">
                        Nơi mua
                      </Link>
                    </li>
                    <li className="tabItem">
                      <Link href="/vn/support" id="tabItemLink_5">
                        Hỗ trợ
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Full Menu Toggle Button */}
        <div className="ProductTabBar__productFullMenuMobile__S2P4+">
          <button
            type="button"
            aria-label="show mobile tab list"
            className="ProductTabBar__mobileFullMenuButton__YjpKG"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span>Menu</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                transform: mobileMenuOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
              }}
            >
              <path d="M1 4l5 6 5-6H1z" fill="#fff" />
            </svg>
          </button>
        </div>

        {/* Mobile Expandable Tab List */}
        <div
          aria-hidden={!mobileMenuOpen}
          className="ProductTabBar__mobileTabList__OFkOO"
          style={{
            height: mobileMenuOpen ? "auto" : "0px",
            overflow: "hidden",
            transition: "all 0.3s ease",
            display: mobileMenuOpen ? "block" : "none",
            backgroundColor: "#111",
            borderTop: "1px solid #222",
          }}
        >
          <ul style={{ listStyle: "none", padding: "12px 16px", margin: 0 }}>
            <li className="tabItem firstTabItem ProductTabBar__active__N4qFo" style={{ padding: "8px 0" }}>
              <Link
                href="/vn/laptops/rog-zephyrus/rog-zephyrus-g16-2025-gu605"
                style={{ color: "#ff0036", textDecoration: "none", fontWeight: 700 }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Tính năng (Xem thêm)
              </Link>
            </li>
            <li className="tabItem ProductTabBar__mobileTabItem__KF1TS" style={{ padding: "8px 0" }}>
              <Link
                href="/vn/laptops/rog-zephyrus/rog-zephyrus-g16-2025-gu605/spec"
                style={{ color: "#fff", textDecoration: "none" }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Chi tiết / Thông số kỹ thuật
              </Link>
            </li>
            <li className="tabItem ProductTabBar__mobileTabItem__KF1TS" style={{ padding: "8px 0" }}>
              <a
                href="#awards"
                style={{ color: "#fff", textDecoration: "none" }}
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  const el = document.getElementById("awards");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Giải thưởng
              </a>
            </li>
            <li className="tabItem ProductTabBar__mobileTabItem__KF1TS" style={{ padding: "8px 0" }}>
              <Link
                href="/vn/laptops/rog-zephyrus/rog-zephyrus-g16-2025-gu605/gallery/"
                style={{ color: "#fff", textDecoration: "none" }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Thư viện
              </Link>
            </li>
            <li className="tabItem ProductTabBar__mobileTabItem__KF1TS" style={{ padding: "8px 0" }}>
              <Link
                href="/vn/where-to-buy"
                style={{ color: "#fff", textDecoration: "none" }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Nơi mua
              </Link>
            </li>
            <li className="tabItem ProductTabBar__mobileTabItem__KF1TS" style={{ padding: "8px 0" }}>
              <Link
                href="/vn/support"
                style={{ color: "#fff", textDecoration: "none" }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Hỗ trợ
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* 1:1 Bespoke Zephyrus G16 Experience Container */}
      <div
        className="g16-overview-container"
        dangerouslySetInnerHTML={{ __html: G16_FEATURES_HTML }}
        suppressHydrationWarning
      />

      {/* Official 1:1 Post-Features (Awards, Video Reviews, Media Quotes, Related Ecosystem, Disclaimers) */}
      <RogZephyrusG16PostFeatures />
    </article>
  );
}
