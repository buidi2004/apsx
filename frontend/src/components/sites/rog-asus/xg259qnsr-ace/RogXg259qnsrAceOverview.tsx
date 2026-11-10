"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useEffect, useState } from "react";
import "./xg259-style.css";
import { XG259_FEATURES_HTML } from "./xg259-html";
import { initXg259Runtime } from "./xg259-runtime";

export default function RogXg259qnsrAceOverview({
  productName = "ROG Strix XG259QNSR Ace",
  price = "14.990.000 ₫",
  basePath = "/vn/monitors/23-to-24-5-inches/rog-strix-xg259qnsr-ace",
}: {
  productName?: string;
  price?: string;
  basePath?: string;
}) {
  const [buyModalOpen, setBuyModalOpen] = useState(false);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    initXg259Runtime().then((c) => {
      cleanup = c;
    });

    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <article className="rog-xg259-container">
      {/* 1:1 Breadcrumbs */}
      <div className="rog-xg259-crumb-wrap">
        <nav className="rog-xg259-crumb" aria-label="Breadcrumb">
          <Link href="/">Trang chủ</Link>
          <span className="sep">›</span>
          <Link href="/vn/monitors-group/">Gaming Màn hình</Link>
          <span className="sep">›</span>
          <Link href="/vn/monitors/23-to-24-5-inches-group/">23 đến 24.5 Inches</Link>
          <span className="sep">›</span>
          <span className="current">{productName}</span>
        </nav>
      </div>

      {/* 1:1 Sticky Subbar */}
      <div className="rog-xg259-subbar">
        <div className="rog-xg259-subbar-inner">
          <div className="rog-xg259-subbar-left">
            <img
              src="https://dlcdnwebimgs.asus.com/gain/B276CBB3-24EB-4015-B005-87C455818976/w717/h525/fwebp"
              alt={productName}
              className="rog-xg259-subbar-thumb"
            />
            <span className="rog-xg259-subbar-title">{productName}</span>
          </div>

          <div className="rog-xg259-subbar-center">
            <Link href={basePath} className="rog-xg259-tab active">
              Tính năng (Xem thêm)
            </Link>
            <Link href={`${basePath}/spec`} className="rog-xg259-tab">
              Chi tiết / Thông số kỹ thuật
            </Link>
            <Link href={`${basePath}/gallery`} className="rog-xg259-tab">
              Thư viện
            </Link>
            <Link href={`${basePath}/helpdesk`} className="rog-xg259-tab">
              Hỗ trợ
            </Link>
          </div>

          <div className="rog-xg259-subbar-right">
            <span className="rog-xg259-subbar-price">{price}</span>
            <button
              type="button"
              className="rog-xg259-buy-btn"
              onClick={() => setBuyModalOpen(true)}
            >
              MUA NGAY
            </button>
          </div>
        </div>
      </div>

      {/* 1:1 Extracted Features Content (Banner, 8 Sections, FAQ, Recommended) */}
      <div
        className="rog-xg259-content-root"
        dangerouslySetInnerHTML={{ __html: XG259_FEATURES_HTML }}
      />

      {/* 1:1 Purchase Options Modal */}
      {buyModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(10px)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
          onClick={() => setBuyModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: "#111114",
              border: "1px solid rgba(255, 0, 54, 0.4)",
              maxWidth: 520,
              width: "100%",
              padding: 32,
              position: "relative",
              color: "#ffffff",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(255, 0, 54, 0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setBuyModalOpen(false)}
              aria-label="Đóng"
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                background: "transparent",
                border: "none",
                color: "#aaaaaa",
                fontSize: 24,
                cursor: "pointer",
                padding: "4px 10px",
              }}
            >
              ✕
            </button>

            <h3
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#ffffff",
                marginBottom: 8,
                letterSpacing: 0.5,
              }}
            >
              {productName}
            </h3>
            <p style={{ color: "#ff0036", fontSize: 24, fontWeight: 700, marginBottom: 20 }}>
              {price}
            </p>
            <p style={{ color: "#aaaaaa", fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
              Sản phẩm có sẵn tại ASUS Store Việt Nam và các đại lý chính hãng ủy quyền trên toàn quốc.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <a
                href="https://vn.store.asus.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  textAlign: "center",
                  background: "#ff0036",
                  color: "#ffffff",
                  padding: "14px 24px",
                  fontSize: 14,
                  fontWeight: 700,
                  textDecoration: "none",
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  transition: "background 0.2s ease",
                }}
              >
                Mua Tại ASUS Store VN
              </a>
              <button
                type="button"
                onClick={() => setBuyModalOpen(false)}
                style={{
                  background: "transparent",
                  color: "#aaaaaa",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  padding: "12px 24px",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Đóng Cửa Sổ
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

