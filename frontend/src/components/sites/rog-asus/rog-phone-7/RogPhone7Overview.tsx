"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useEffect, useState } from "react";
import "./phone7-style.css";
import { PHONE7_FEATURES_HTML } from "./phone7-html";
import { initPhone7Runtime } from "./phone7-runtime";

export default function RogPhone7Overview({
  productName = "ROG Phone 7",
  price = "24.990.000 ₫",
  basePath = "/vn/phones/rog-phone-7",
}: {
  productName?: string;
  price?: string;
  basePath?: string;
}) {
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [buyModalOpen, setBuyModalOpen] = useState(false);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    initPhone7Runtime().then((c) => {
      cleanup = c;
    });

    // Intercept .btn__youtube or play button in section 2 to open responsive high-def modal
    const videoBtns = document.querySelectorAll<HTMLElement>(
      "#section__2 .btn__youtube, #section__2 .video__play__btn"
    );
    const handleVideoClick = (e: MouseEvent) => {
      e.preventDefault();
      setVideoModalOpen(true);
    };
    videoBtns.forEach((btn) => btn.addEventListener("click", handleVideoClick));

    return () => {
      if (cleanup) cleanup();
      videoBtns.forEach((btn) => btn.removeEventListener("click", handleVideoClick));
    };
  }, []);

  return (
    <article className="rog-phone7-container">
      {/* 1:1 Breadcrumbs */}
      <div className="rog-phone7-crumb-wrap">
        <nav className="rog-phone7-crumb" aria-label="Breadcrumb">
          <Link href="/">Trang chủ</Link>
          <span className="sep">›</span>
          <Link href="/vn/phones-group/">Điện thoại</Link>
          <span className="sep">›</span>
          <Link href="/vn/phones-group/allmodels">ROG Phone Series</Link>
          <span className="sep">›</span>
          <span className="current">{productName}</span>
        </nav>
      </div>

      {/* 1:1 Sticky Subbar */}
      <div className="rog-phone7-subbar">
        <div className="rog-phone7-subbar-inner">
          <div className="rog-phone7-subbar-left">
            <img
              src="/sites/rog-asus/img/detail/rog-phone-7-thumb.webp"
              alt={productName}
              className="rog-phone7-subbar-thumb"
            />
            <div className="rog-phone7-subbar-title">{productName}</div>
          </div>

          <nav className="rog-phone7-subbar-tabs" aria-label="Tabs sản phẩm">
            <Link href={basePath} className="rog-phone7-tab-link is-active">
              Tính năng (Xem thêm)
            </Link>
            <Link href={`${basePath}/spec`} className="rog-phone7-tab-link">
              Chi tiết / Thông số kỹ thuật
            </Link>
            <a
              href="#awardClone"
              className="rog-phone7-tab-link"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("awardClone")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Giải thưởng
            </a>
            <a
              href="#section__2"
              className="rog-phone7-tab-link"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("section__2")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Thư viện
            </a>
            <Link href="/vn/where-to-buy" className="rog-phone7-tab-link">
              Nơi mua
            </Link>
            <Link href="/vn/support" className="rog-phone7-tab-link">
              Hỗ trợ
            </Link>
          </nav>

          <div className="rog-phone7-subbar-actions">
            <div className="rog-phone7-price-wrap">
              <span className="rog-phone7-price-label">Giá trên ASUS estore</span>
              <span className="rog-phone7-price">{price}</span>
            </div>
            <button
              type="button"
              onClick={() => setBuyModalOpen(true)}
              className="rog-phone7-buy-btn"
            >
              MUA NGAY
            </button>
          </div>
        </div>
      </div>

      {/* Complete 28 Sections Sourced from live ASUS ROG */}
      <div
        className="rog-phone7-features-wrapper"
        dangerouslySetInnerHTML={{ __html: PHONE7_FEATURES_HTML }}
        suppressHydrationWarning
      />

      {/* YouTube High-Def Video Modal */}
      {videoModalOpen && (
        <div
          className="rog-phone7-video-modal"
          role="dialog"
          aria-modal="true"
          onClick={() => setVideoModalOpen(false)}
        >
          <div
            className="rog-phone7-video-wrapper"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="rog-phone7-video-close"
              onClick={() => setVideoModalOpen(false)}
              aria-label="Đóng video"
            >
              ✕
            </button>
            <iframe
              src="https://www.youtube.com/embed/OP2j6W8R-eY?autoplay=1&rel=0&modestbranding=1"
              title="ROG Phone 7 Official Product Video"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Buy Now Drawer / Modal */}
      {buyModalOpen && (
        <div
          className="rog-phone7-video-modal"
          role="dialog"
          aria-modal="true"
          onClick={() => setBuyModalOpen(false)}
        >
          <div
            className="rog-phone7-video-wrapper"
            style={{
              maxWidth: 540,
              aspectRatio: "auto",
              padding: 32,
              backgroundColor: "#111111",
              border: "1px solid rgba(255, 0, 51, 0.4)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="rog-phone7-video-close"
              onClick={() => setBuyModalOpen(false)}
              aria-label="Đóng"
            >
              ✕
            </button>
            <div style={{ textAlign: "center" }}>
              <img
                src="/sites/rog-asus/img/detail/rog-phone-7-thumb.webp"
                alt={productName}
                style={{ height: 120, margin: "0 auto 16px auto", display: "block" }}
              />
              <h3 style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 8 }}>
                {productName}
              </h3>
              <p style={{ color: "#aaa", fontSize: 14, marginBottom: 16 }}>
                Snapdragon 8 Gen 2 | 165Hz AMOLED | 6000 mAh | 16GB / 512GB
              </p>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#ff0033", marginBottom: 24 }}>
                {price}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <Link
                  href="/vn/store"
                  className="rog-phone7-buy-btn"
                  style={{ textAlign: "center", padding: "12px 24px", fontSize: 15 }}
                >
                  ĐẶT MUA TẠI ASUS ESTORE
                </Link>
                <Link
                  href="/vn/where-to-buy"
                  style={{
                    textAlign: "center",
                    padding: "10px 24px",
                    fontSize: 14,
                    color: "#fff",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: 2,
                    textDecoration: "none",
                  }}
                >
                  TÌM ĐẠI LÝ GẦN NHẤT
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

