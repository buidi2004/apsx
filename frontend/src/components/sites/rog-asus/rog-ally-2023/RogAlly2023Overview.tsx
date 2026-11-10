"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "../RogProductDetail.css";
import "./ally-style.css";
import "../zephyrus-g16/subbar.css";
import { ALLY_FEATURES_HTML } from "./ally-html";
import { RogAllyAwardsAndReviews, RogAllyFooterContent } from "./RogAlly2023PostFeatures";

export default function RogAlly2023Overview() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

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

    const mountTimer = setTimeout(() => setMounted(true), 0);

    if (document.querySelector("script[data-ally-main]")) {
      window.dispatchEvent(new Event("scroll"));
      return () => {
        window.removeEventListener("unhandledrejection", handleRejection);
      };
    }

    // Step 1: Ensure jQuery 3.6.0 is loaded FIRST before ally-main.js
    const loadMainScript = () => {
      if (document.querySelector("script[data-ally-main]")) return;
      const mainScript = document.createElement("script");
      mainScript.src = "/sites/rog-asus/rog-ally-2023/ally-main.js";
      mainScript.setAttribute("data-ally-main", "true");
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

    let jqScript: HTMLScriptElement | null = document.querySelector("script[data-ally-jq]");
    if (!jqScript && !(window as unknown as { jQuery?: unknown }).jQuery) {
      jqScript = document.createElement("script");
      jqScript.src = "/sites/rog-asus/rog-ally-2023/jquery-3.6.0.min.js";
      jqScript.setAttribute("data-ally-jq", "true");
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
      clearTimeout(mountTimer);
      window.removeEventListener("unhandledrejection", handleRejection);
      clearTimeout(timer1);
      clearTimeout(timer2);
      const mainEl = document.querySelector("script[data-ally-main]");
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
          <Link href="/vn/gaming-handhelds-group/">Gaming Handhelds</Link>
          <span className="rog-crumb-sep">›</span>
          <Link href="/vn/gaming-handhelds-group/">ROG Ally Series</Link>
          <span className="rog-crumb-sep">›</span>
          <span className="rog-crumb-curr">ROG Ally (2023) RC71L</span>
        </nav>
      </div>

      {/* 1:1 Official Sticky Subbar */}
      <div
        id="productTabBarContainer"
        className="productTabBarContainer ProductTabBar__productTabBarContainer__O9P3C ProductTabBar__noPrice__wQ7fE"
        style={{ position: "sticky", top: 0, zIndex: 100 }}
      >
        <div className="ProductTabBar__productTabBarWrapper__NkfAp">
          {/* Left info: Thumbnail + Title + Price */}
          <div className="ProductTabBar__productInfo__kijFw">
            <Link
              href="/vn/gaming-handhelds/rog-ally/rog-ally-2023/"
              className="ProductTabBar__productName__2TSo7"
              style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}
            >
              <img
                src="/sites/rog-asus/rog-ally-2023/subbar-thumb.webp"
                alt="ROG Ally (2023) RC71L"
                style={{ width: "42px", height: "30px", objectFit: "contain" }}
              />
              <h1>ROG Ally (2023) RC71L</h1>
            </Link>

            <div className="ProductTabBar__productBuyPrice__GImtH ProductTabBar__mobile__JCkq0">
              <span className="ProductTabBar__productStartingAt__GEQtS">Giá khởi điểm trên ASUS estore là</span>
              <span className="ProductTabBar__productMoney__Y7npp">16.990.000 ₫</span>
              <span className="ProductTabBar__originalPriceValue__BQdUC">17.990.000 ₫</span>
            </div>
          </div>

          {/* Right actions: Desktop Price + "Lựa Chọn" button + Desktop Tabs */}
          <div className="ProductTabBar__productTabBarList__7JGkm">
            <div className="ProductTabBar__productTabWrapper__wiiO+">
              <div className="ProductTabBar__productTabBarBuyNow__LuhPt">
                <div className="ProductTabBar__productBuyPrice__GImtH">
                  <span className="ProductTabBar__productStartingAt__GEQtS">Giá khởi điểm trên ASUS estore là</span>
                  <span className="ProductTabBar__productMoney__Y7npp">16.990.000 ₫</span>
                  <span className="ProductTabBar__originalPriceValue__BQdUC">17.990.000 ₫</span>
                </div>
                <div className="ButtonRed__redFullButton__0lMzl ButtonRed__isProductBarButton__qIAJB">
                  <Link
                    href="/vn/gaming-handhelds/rog-ally/rog-ally-2023/spec"
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
                      <Link href="/vn/gaming-handhelds/rog-ally/rog-ally-2023" id="rogContent">
                        Tính năng (Xem thêm)
                      </Link>
                    </li>
                    <li className="tabItem">
                      <Link href="/vn/gaming-handhelds/rog-ally/rog-ally-2023/spec" id="tabItemLink_1">
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
                      <Link href="/vn/gaming-handhelds/rog-ally/rog-ally-2023/gallery/" id="tabItemLink_3">
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
                href="/vn/gaming-handhelds/rog-ally/rog-ally-2023"
                style={{ color: "#ff0036", textDecoration: "none", fontWeight: 700 }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Tính năng (Xem thêm)
              </Link>
            </li>
            <li className="tabItem ProductTabBar__mobileTabItem__KF1TS" style={{ padding: "8px 0" }}>
              <Link
                href="/vn/gaming-handhelds/rog-ally/rog-ally-2023/spec"
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
                href="/vn/gaming-handhelds/rog-ally/rog-ally-2023/gallery/"
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

      {/* 1:1 Bespoke ROG Ally 2023 Experience Container */}
      <div
        className="ally-overview-container"
        dangerouslySetInnerHTML={{ __html: ALLY_FEATURES_HTML }}
        suppressHydrationWarning
      />

      {/* 1:1 Official Awards & Video/Media Reviews Portaled right into beforeAward slot inside section__pd */}
      {mounted && typeof document !== "undefined" && document.getElementById("ally-before-award-slot")
        ? createPortal(<RogAllyAwardsAndReviews />, document.getElementById("ally-before-award-slot")!)
        : null}

      {/* Official 1:1 Post-Features (Recommended Handhelds, Accessories, Disclaimers) */}
      <RogAllyFooterContent />
    </article>
  );
}

