"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import "./RogNavbar.css";
import { RogApi } from "@/lib/api-client";

type NavItem = {
  label: string;
  href: string;
  hasMega?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { label: "MUA HÀNG", href: "/vn/store" },
  { label: "SẢN PHẨM", href: "#", hasMega: true },
  { label: "SÁNG TẠO", href: "/vn/innovations" },
  { label: "TẢI XUỐNG", href: "/vn/downloads" },
  { label: "CỘNG ĐỒNG", href: "/vn/community" },
  { label: "NỔI BẬT", href: "/vn/events" },
  { label: "HỖ TRỢ", href: "/vn/support" },
  { label: "ĐẠI LÝ", href: "/vn/where-to-buy" },
];

type MegaItem = {
  label: string;
  href: string;
  sub?: boolean;
  badge?: string;
};

const MEGA_COLUMNS: { col: number; items: MegaItem[] }[] = [
  {
    col: 1,
    items: [
      { label: "Laptop Gaming ASUS ROG", href: "/vn/laptops-group" },
      { label: "Phones & Mobile", href: "/vn/phones-group/allmodels" },
      { label: "Samsung Galaxy Z Fold Series", href: "/vn/smartphones/galaxy-z-fold8-ultra", sub: true },
      { label: "Apple iPhone Pro & Duo Series", href: "/vn/iphone-18-pro", sub: true },
      { label: "Apple iPad Pro Series", href: "/vn/ipad-pro", sub: true },
      { label: "Apple MacBook Pro Series", href: "/vn/macbook-pro/proled-xdr-display", sub: true },
      { label: "ASUS ROG Phone Series", href: "/vn/phones/rog-phone-7", sub: true },
      { label: "MÁY BỘ PC GAMING", href: "/vn/desktops-group" },
      { label: "Gaming Handhelds", href: "/vn/gaming-handhelds-group" },
    ],
  },
  {
    col: 2,
    items: [
      { label: "Bo mạch chủ", href: "/vn/motherboards-group" },
      { label: "Card Đồ họa", href: "/vn/graphics-cards-group" },
      { label: "Màn hình", href: "/vn/monitors-group" },
      { label: "Nguồn máy tính", href: "/vn/power-supply-units-group" },
      { label: "Thiết bị mạng", href: "/vn/networking-group/allmodels" },
      { label: "Cases", href: "/vn/cases-group/allmodels" },
      { label: "Làm mát", href: "/vn/cooling-group" },
    ],
  },
  {
    col: 3,
    items: [
      { label: "Dock VGA gắn ngoài", href: "/vn/external-graphics-docks-group/allmodels" },
      { label: "Bàn phím", href: "/vn/keyboards-group" },
      { label: "Chuột & Lót chuột", href: "/vn/mice-mouse-pads-group" },
      { label: "Tai nghe & audio", href: "/vn/headsets-audio-group" },
      { label: "Apparel, Bags, & Gear", href: "/vn/apparel-bags-gear-group" },
      { label: "Streaming Kits", href: "/vn/streaming-kits-group/allmodels" },
      { label: "Tay cầm", href: "/vn/controllers-group/allmodels" },
      { label: "Ổ lưu trữ", href: "/vn/storage/rog-strix-arion-model" },
      { label: "Protection and Gadgets", href: "/vn/protection-and-gadgets-group" },
      { label: "Docks, Chargers and Cables", href: "/vn/docks-chargers-and-cables-group" },
    ],
  },
];

/* ROG "REPUBLIC OF GAMERS" wordmark (extracted from source header svg-0) */
function RogWordmark() {
  return (
    <svg
      viewBox="0 0 200 37"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="#e60012"
        d="M22.2 29.1c.8.5 1.6 1 2.4 1.4 8.6 3.8 21.3 6.1 23.7 5.3C55 33.6 62.5 19.5 64.8 13c0 0-7 2.8-14.1 6.1-5.9 2.8-12.4 6-12.4 6l16.5-5s-4.4 10.4-10.2 11.6c-5.8 1.2-16-2.9-16-2.9.8-.7 11.6-8.6 36.8-18.9 1.1-.8 1.8-2.1 2-3.4-5.8.6-11.4 2.3-16.7 4.8-10.6 5-28.5 17.8-28.5 17.8zM3.8 24c1.8 2.3 9.2 4.2 10.2 4.4-4.6-3.2-14-12-14-12 1 2.7 2.3 5.2 3.8 7.6z"
      />
      <path
        fill="#e60012"
        d="M25.6 22.9C30.5 19.3 47.9 4.6 64.7.6c0 0-8.8-1.4-21.3 2.5-4.5 1.4-11 7.7-23.1 19.4-1.6.9-7.5-2.5-10.9-4.1 0 0 5.6 8.9 7.6 11.5 3 4.1 8.5 6.5 8.5 6.5-.5-.5-4.3-4.5-5.4-6.8-.7-1.1.1-2.7 5.5-6.7z"
      />
      <path
        fill="#e60012"
        d="M127.9 6.8h-3v8.9h-5.6V6.8h-3v10.4h11.6zM152.9 15.6h-7.5V6.8h-3.1v10.4h9.2zM154.2 6.8h3.1v10.4h-3.1zM191.7 8.3h6.9l1.4-1.5h-11.4v10.4h3.1v-5.1h6.7l1.2-1.6h-7.9zM106.6 13.8h8.3V7.6c0-.4-.3-.8-.7-.8h-10.7v10.3h3.1v-3.3zm0-5.5h5c.1 0 .3 0 .3.5v3.5h-5.3v-4zM140.7 10.8h-.9v-3c0-.6-.3-1-.8-1h-9.7v10.4h11.3l.1-6.4zm-3.1 4.8h-5.2v-3.3h5.2v3.3zm0-4.8h-5.2V8.3h4.9c.3 0 .3.4.3.5v2zM100.5 8.3l1.6-1.5H90.5v10.3h11.6l-1.6-1.5h-6.9v-2.8h7.8v-1.7h-7.8V8.3zM162 8.3h7l1.5-1.5h-11.6v10.3H169l1.5-1.5H162zM154 24.5l1.3-1.5h-11.8v5.6h8.5v3.1h-8.9l1.9 1.6h10.2V27h-8.6v-2.5zM100.6 23h-11v10.3h3.1v-4.4h5.5v4.4h3.1v-9.4c.1-.4-.2-.8-.7-.9zm-2.4 4.4h-5.4v-2.9h5.1c.3 0 .3.3.3.5v2.4zM127.2 24.5l1.6-1.5h-11.7v10.3h11.7l-1.6-1.5h-7V29h7.9v-1.7h-7.9v-2.8zM86.4 24.6L88 23H75.8v10.3h11.8v-5.6h-3.1v4.1H79v-7.2zM103 23v10.4h3.2v-6l3 2.1 3.1-2.1v6h3.1V23l-6.2 4.1zM141.8 28.9v-5c0-.5-.3-1-.8-1h-11.2v10.4h3.1v-8.8h5.4c.3 0 .3.3.3.5v2h-5.1l5.6 6.3h3.7l-3.9-4.4h2.9zM88.7 14.1V7.8c0-.5 0-1-.6-1H75.8V14l3.2 3.5V8.3h6c.4 0 .5.1.5.5v3.3h-5.3l8.5 8.9v-3.5L85.5 14h3.2zM186.1 6.8h-10.5v7.5l2.5 2.9h8.7V7.6c0-.4-.3-.8-.7-.8zm-2.4 8.8h-3.3l-1.7-2V8.3h5v7.3z"
      />
    </svg>
  );
}

/* ASUS wordmark (extracted from source header svg-8, rendered white) */
function AsusWordmark() {
  return (
    <svg
      viewBox="0 0 71.418 15.556"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        stroke="rgba(0,0,0,0)"
        strokeMiterlimit={10}
        d="M52.803 15.056l.009-3.84h13.593a1.609 1.609 0 00.649-.183.818.818 0 00.256-.578c0-.737-.613-.769-.921-.785l-9.882-.815A4.615 4.615 0 0154.3 7.812a3.758 3.758 0 01-1.271-2.052s12.766.746 14.184.877a4.359 4.359 0 013.618 3.351 6.077 6.077 0 01-.022 1.57 4.233 4.233 0 01-4.008 3.5zm-12.767-.017l-.354-.025a4.216 4.216 0 01-3.621-3.534v-.609a5.825 5.825 0 01-.077.656 4.261 4.261 0 01-3.52 3.5h-18.3v-9.8l3.8.276v5.738h13.688a.768.768 0 00.807-.74c.007-.738-.562-.814-.864-.828 0 0-9.444-.774-9.782-.806a4.988 4.988 0 01-2.284-1.074 3.976 3.976 0 01-1.2-2.258s12.694 1 14.119 1.129c2.392.221 3.494 2.753 3.59 3.327 0 0 .008.059.015.164V4.642l3.881.278v5.078a1.23 1.23 0 001.119 1.273h6.6a1.264 1.264 0 001.267-1.285v-4.46l3.843.227v5.358c0 3.627-3.817 3.931-3.817 3.931zM.918 15.021L7.651 4.597l4.341.458-6.472 9.966zM52.803 4.363v-.311a5.491 5.491 0 01.973-2A4.27 4.27 0 0156.918.5h14v3.866zm-3.937 0V.519h3.909v3.844zm-12.844 0V.519h3.912v3.844zm-28.216 0s1.589-2.59 1.983-3.1a1.682 1.682 0 011.4-.738h6.946v3.527a5.5 5.5 0 01.977-2A4.252 4.252 0 0122.253.496h13.086v3.863z"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.045 16.645a7.5 7.5 0 11.707-.707l4.254 4.254-.707.707-4.254-4.254zm-.342-1.049A6.5 6.5 0 106.51 6.404a6.5 6.5 0 009.193 9.192z"
        fill="currentColor"
      />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M12 2a4 4 0 00-4 4v2.1c0 .8-.3 1.5-.9 2.1L5.5 12c-.7.7-1 1.7-.8 2.6.2.9.9 1.6 1.8 1.8 3.6.5 7.4.5 11 0 .9-.2 1.6-.9 1.8-1.8.2-.9-.1-1.9-.8-2.6l-1.6-1.8c-.6-.6-.9-1.3-.9-2.1V6a4 4 0 00-4-4zm-2.5 16a2.5 2.5 0 005 0h-5z"
        fill="currentColor"
      />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M3 4h2.2l2.6 11.1c.2.8.9 1.4 1.7 1.4h9.6c.8 0 1.5-.6 1.7-1.4L22 7H6.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="19.5" r="1.5" fill="currentColor" />
      <circle cx="18" cy="19.5" r="1.5" fill="currentColor" />
    </svg>
  );
}

function HamburgerIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20 6H4v1h16V6zm0 5.5H4v1h16v-1zM4 17h16v1H4v-1z"
        fill="currentColor"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function RogNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [authUsername, setAuthUsername] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authStatus, setAuthStatus] = useState<string | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<{ username: string; fullName: string; role: string } | null>(null);
  const megaTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("rog_user");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          queueMicrotask(() => {
            setLoggedInUser(parsed);
          });
        } catch {
          // ignore
        }
      }
    }
  }, []);

  const handleMouseEnter = () => {
    if (megaTimeoutRef.current) {
      clearTimeout(megaTimeoutRef.current);
      megaTimeoutRef.current = null;
    }
    setMegaOpen(true);
  };

  const handleMouseLeave = () => {
    megaTimeoutRef.current = setTimeout(() => {
      setMegaOpen(false);
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (megaTimeoutRef.current) {
        clearTimeout(megaTimeoutRef.current);
      }
    };
  }, []);

  return (
    <header className="rog-nav">
      <div className="rog-nav-inner">
        <button
          type="button"
          className="rog-nav-burger"
          aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
          aria-expanded={menuOpen}
          aria-controls="rog-nav-mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <HamburgerIcon />
        </button>

        <Link
          className="rog-nav-logo"
          href="/"
          aria-label="Republic of Gamers Việt Nam — Trang chủ"
        >
          <RogWordmark />
        </Link>

        <nav className="rog-nav-menu" aria-label="Điều hướng chính">
          {NAV_ITEMS.map((item) =>
            item.hasMega ? (
              <div
                key={item.label}
                className={`rog-nav-item-wrap${megaOpen ? " is-active" : ""}`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  className="rog-nav-menu-btn"
                  onClick={() => setMegaOpen(!megaOpen)}
                  aria-expanded={megaOpen}
                >
                  {item.label}
                </button>

                {megaOpen && (
                  <div className="rog-mega-menu" role="menu">
                    <div className="rog-mega-columns">
                      {MEGA_COLUMNS.map((col) => (
                        <div key={col.col} className="rog-mega-col">
                          {col.items.map((sub) => (
                            <Link
                              key={sub.label}
                              href={sub.href}
                              className={`rog-mega-link${sub.sub ? " is-sub" : ""}`}
                              onClick={() => setMegaOpen(false)}
                            >
                              {sub.label}
                              {sub.badge && <span className="rog-mega-badge">{sub.badge}</span>}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>

                    <div className="rog-mega-bottom">
                      <Link
                        href="/vn/rog-saga-group"
                        className="rog-mega-bottom-link"
                        onClick={() => setMegaOpen(false)}
                      >
                        ROG SAGA
                      </Link>
                      <a
                        href="https://www.asus.com/campaign/tuf-gaming/vn/index.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rog-mega-bottom-link"
                      >
                        <svg
                          viewBox="0 0 16 16"
                          width="13"
                          height="13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          className="rog-mega-ext-icon"
                        >
                          <path
                            d="M13 8.5V13a1 1 0 01-1 1H3a1 1 0 01-1-1V4a1 1 0 011-1h4.5M10 2h4v4M8.5 7.5L13.5 2.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span>ASUS TUF Gaming</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className="rog-nav-link"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="rog-nav-right">
          <a
            className="rog-nav-asus"
            href="https://www.asus.com/vn/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="ASUS Việt Nam"
          >
            <AsusWordmark />
          </a>
          <span className="rog-nav-divider" aria-hidden="true" />
          <Link href="/vn/search" className="rog-nav-icon" aria-label="Tìm kiếm">
            <SearchIcon />
          </Link>
          <button
            type="button"
            className="rog-nav-icon rog-nav-bell"
            aria-label="Thông báo"
          >
            <BellIcon />
          </button>
          <Link
            className="rog-nav-icon"
            href="/vn/store"
            aria-label="Giỏ hàng"
          >
            <CartIcon />
          </Link>
          <button
            type="button"
            className="rog-nav-icon rog-nav-user"
            aria-label="Tài khoản ASUS / ROG Member"
            onClick={() => setUserModalOpen(true)}
          >
            <UserIcon />
          </button>
        </div>
      </div>

      <div
        id="rog-nav-mobile-menu"
        className={`rog-nav-mobile-menu${menuOpen ? " is-open" : ""}`}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <nav aria-label="Điều hướng chính (di động)">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div style={{ marginTop: 16, borderTop: "1px solid #333", paddingTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            <span style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: 1 }}>Sản phẩm mới</span>
            <Link
              href="/vn/gaming-handhelds-group"
              onClick={() => setMenuOpen(false)}
              style={{ color: "#ff0036", fontWeight: 700 }}
            >
              ★ Gaming Handhelds (ROG Ally)
            </Link>
            <Link
              href="/vn/laptops/rog-zephyrus/rog-zephyrus-duo-2026"
              onClick={() => setMenuOpen(false)}
              style={{ color: "#ff0036", fontWeight: 700 }}
            >
              ★ ROG Zephyrus Duo (2026)
            </Link>
            <Link
              href="/vn/graphics-cards/rog-matrix/rog-matrix-rtx5090-p32g-30th"
              onClick={() => setMenuOpen(false)}
              style={{ color: "#ff0036", fontWeight: 700 }}
            >
              ★ ROG Matrix RTX 5090 (30th)
            </Link>
            <Link
              href="/vn/laptops/rog-zephyrus/rog-zephyrus-g16-2025-gu605"
              onClick={() => setMenuOpen(false)}
              style={{ color: "#ff0036", fontWeight: 700 }}
            >
              ★ ROG Zephyrus G16 (2025)
            </Link>
            <Link
              href="/vn/laptops/rog-flow/rog-flow-z13-kjp"
              onClick={() => setMenuOpen(false)}
              style={{ color: "#ff0036", fontWeight: 700 }}
            >
              ★ ROG Flow Z13-KJP
            </Link>
          </div>
        </nav>
      </div>

      {/* ASUS & ROG VIP Account Modal */}
      {userModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Tài khoản thành viên ROG VIP"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(8px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setUserModalOpen(false)}
        >
          <div
            style={{
              background: "#111116",
              border: "1px solid #ff0036",
              borderRadius: "4px",
              maxWidth: "460px",
              width: "100%",
              padding: "36px 32px",
              color: "#fff",
              position: "relative",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(255, 0, 54, 0.25)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setUserModalOpen(false)}
              aria-label="Đóng cửa sổ"
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "transparent",
                border: "none",
                color: "#888",
                fontSize: "22px",
                cursor: "pointer",
                padding: "4px 8px",
              }}
            >
              ✕
            </button>

            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <span style={{ color: "#ff0036", fontSize: "11px", fontWeight: 800, letterSpacing: "2px" }}>
                {"// ASUS & ROG MEMBER"}
              </span>
              <h3 style={{ fontSize: "22px", fontWeight: 900, margin: "8px 0 6px 0", textTransform: "uppercase" }}>
                {loggedInUser ? "THÔNG TIN THÀNH VIÊN" : "ĐĂNG NHẬP THÀNH VIÊN"}
              </h3>
              <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>
                {loggedInUser
                  ? "Đặc quyền bảo hành VIP ROG On-site và quyền ưu tiên sự kiện."
                  : "Hưởng trọn vẹn đặc quyền bảo hành VIP, ưu đãi sinh nhật & điểm thưởng ROG Elite."}
              </p>
            </div>

            {loggedInUser ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ background: "#181820", padding: "16px", borderRadius: "4px", border: "1px solid #333" }}>
                  <div style={{ fontSize: "12px", color: "#888", marginBottom: "4px" }}>TÀI KHOẢN ĐANG ĐĂNG NHẬP</div>
                  <div style={{ fontSize: "18px", fontWeight: 800, color: "#fff" }}>{loggedInUser.fullName || loggedInUser.username}</div>
                  <div style={{ display: "inline-block", marginTop: "6px", background: "#ff0036", color: "#fff", fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "2px" }}>
                    {loggedInUser.role === "Admin" ? "QUẢN TRỊ VIÊN HỆ THỐNG" : "ROG ELITE VIP MEMBER"}
                  </div>
                </div>

                {loggedInUser.role === "Admin" && (
                  <a
                    href="http://localhost:5161/admin/index.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: "#222",
                      border: "1px solid #ff0036",
                      color: "#ff0036",
                      textAlign: "center",
                      padding: "12px",
                      fontSize: "13px",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      borderRadius: "2px",
                      textDecoration: "none",
                      display: "block",
                    }}
                  >
                    ⚙ MỞ BẢNG QUẢN TRỊ ROGADMIN (PORT 5161) →
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem("rog_user");
                    localStorage.removeItem("rog_auth_token");
                    setLoggedInUser(null);
                    setAuthStatus(null);
                  }}
                  style={{
                    background: "transparent",
                    color: "#aaa",
                    border: "1px solid #444",
                    padding: "10px",
                    fontSize: "12px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    borderRadius: "2px",
                    cursor: "pointer",
                  }}
                >
                  ĐĂNG XUẤT TÀI KHOẢN
                </button>
              </div>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setAuthStatus("Đang xác thực thông tin với máy chủ Backend...");
                  try {
                    const data = await RogApi.login(
                      authUsername.trim() || "admin",
                      authPassword.trim() || "Admin@123"
                    );
                      localStorage.setItem("rog_auth_token", data.token);
                      localStorage.setItem("rog_user", JSON.stringify(data.user));
                      setLoggedInUser(data.user);
                      setAuthStatus(`✓ Đăng nhập thành công! Xin chào ${data.user.fullName || data.user.username}`);
                      setTimeout(() => setUserModalOpen(false), 1200);
                      return;
                  } catch {
                    setAuthStatus("Không thể kết nối máy chủ xác thực.");
                  }
                }}
                style={{ display: "flex", flexDirection: "column", gap: "16px" }}
              >
                {authStatus && (
                  <div style={{ background: "#20040a", border: "1px solid #ff0036", color: "#ff809b", padding: "8px 12px", fontSize: "12px", borderRadius: "2px" }}>
                    {authStatus}
                  </div>
                )}

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#aaa", marginBottom: "6px" }}>
                    Tài khoản ASUS / Username / Email
                  </label>
                  <input
                    type="text"
                    required
                    value={authUsername}
                    onChange={(e) => setAuthUsername(e.target.value)}
                    placeholder="admin hoặc email của bạn"
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      background: "#181820",
                      border: "1px solid #333",
                      color: "#fff",
                      borderRadius: "2px",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                  <span style={{ fontSize: "11px", color: "#666", marginTop: "4px", display: "block" }}>
                    Gợi ý tài khoản quản trị: <code>admin</code> / <code>Admin@123</code>
                  </span>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#aaa", marginBottom: "6px" }}>
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      background: "#181820",
                      border: "1px solid #333",
                      color: "#fff",
                      borderRadius: "2px",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#888" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                    <input type="checkbox" defaultChecked /> Ghi nhớ đăng nhập
                  </label>
                  <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Vui lòng liên hệ hotline 1800 6588 để đặt lại mật khẩu."); }} style={{ color: "#ff0036", textDecoration: "none" }}>
                    Quên mật khẩu?
                  </a>
                </div>

                <button
                  type="submit"
                  style={{
                    background: "#ff0036",
                    color: "#fff",
                    border: "none",
                    padding: "14px",
                    fontSize: "13px",
                    fontWeight: 800,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    borderRadius: "2px",
                    cursor: "pointer",
                    marginTop: "8px",
                    boxShadow: "0 4px 20px rgba(255, 0, 54, 0.4)",
                  }}
                >
                  XÁC THỰC & ĐĂNG NHẬP
                </button>
              </form>
            )}

            <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid #222", textAlign: "center", fontSize: "13px", color: "#888" }}>
              Chưa có tài khoản?{" "}
              <Link
                href="/vn/community"
                onClick={() => setUserModalOpen(false)}
                style={{ color: "#ff0036", fontWeight: 700, textDecoration: "none" }}
              >
                Đăng ký thành viên ROG Elite →
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
