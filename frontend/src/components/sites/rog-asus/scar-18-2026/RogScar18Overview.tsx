"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useEffect, useState } from "react";
import { RogApi } from "@/lib/api-client";
import "../RogProductDetail.css";
import "./scar18-style.css";
import { SCAR18_FEATURES_HTML } from "./scar18-html";
import { initScar18Runtime } from "./scar18-runtime";

export default function RogScar18Overview({
  productName = "ROG Strix SCAR 18 (2026) G835",
  price = "139.990.000 ₫",
  basePath = "/vn/laptops/rog-strix/rog-strix-scar-18-2026",
}: {
  productName?: string;
  price?: string;
  basePath?: string;
}) {
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [currentVideoTitle, setCurrentVideoTitle] = useState("ROG Strix Flagship Review");
  const [currentPrice, setCurrentPrice] = useState(price);

  useEffect(() => {
    RogApi.getBatchPricing(["laptops/rog-strix/rog-strix-scar-18-2026"])
      .then((prices) => {
        if (prices && prices.length > 0 && prices[0].formattedPrice) {
          setCurrentPrice(prices[0].formattedPrice);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    // 0. Initialize Full GSAP, ScrollTrigger, Webflow IX2, and Aura Engine
    let cleanupRuntime: (() => void) | undefined;
    initScar18Runtime().then((cleanup) => {
      cleanupRuntime = cleanup;
    });

    // 1. Video Autoplay on Viewport Observer
    const videos = document.querySelectorAll<HTMLVideoElement>(
      ".scar18-overview-container video"
    );
    videos.forEach((v) => {
      v.muted = true;
      v.playsInline = true;
      v.setAttribute("muted", "");
      v.setAttribute("playsinline", "");
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.15 }
    );

    videos.forEach((v) => observer.observe(v));

    // 2. FAQ Accordion Toggle Listener
    const faqButtons = document.querySelectorAll<HTMLButtonElement>(
      ".scar18-overview-container .faq-block .question"
    );
    const handleFaqClick = (e: Event) => {
      const btn = (e.currentTarget as HTMLElement).closest("button");
      if (!btn) return;
      const targetId = btn.getAttribute("aria-controls");
      if (!targetId) return;
      const targetBox = document.getElementById(targetId);
      if (!targetBox) return;

      const isExpanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", isExpanded ? "false" : "true");
      if (isExpanded) {
        targetBox.setAttribute("hidden", "");
      } else {
        targetBox.removeAttribute("hidden");
      }
    };

    faqButtons.forEach((btn) => {
      btn.addEventListener("click", handleFaqClick);
    });

    // 3. Smooth Anchor Menu Clicking
    const anchorLinks = document.querySelectorAll<HTMLAnchorElement>(
      ".scar18-overview-container .ss-anchor-link"
    );
    const handleAnchorClick = (e: MouseEvent) => {
      const href = (e.currentTarget as HTMLAnchorElement).getAttribute("href");
      if (href && href.startsWith("#")) {
        const targetEl = document.querySelector(href);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
          anchorLinks.forEach((a) => a.classList.remove("is-active"));
          (e.currentTarget as HTMLAnchorElement).classList.add("is-active");
        }
      }
    };
    anchorLinks.forEach((a) => a.addEventListener("click", handleAnchorClick as EventListener));

    // 4. Video Review Play Button Click Handler
    const videoPlayBtns = document.querySelectorAll<HTMLButtonElement>(
      ".scar18-overview-container .AwardVideo__videoBtn__IPOqS"
    );
    const handlePlayClick = (e: Event) => {
      e.preventDefault();
      const parentCard = (e.currentTarget as HTMLElement).closest(".AwardVideo__actionVideoContent__EhXqJ");
      const titleEl = parentCard?.querySelector(".ProductAwardVideoContent__actionTitle__zPI47");
      if (titleEl) {
        setCurrentVideoTitle(titleEl.textContent?.trim() || "ROG Strix Flagship Review");
      }
      setVideoModalOpen(true);
    };
    videoPlayBtns.forEach((btn) => btn.addEventListener("click", handlePlayClick));

    // 5. Populate Rich Customer Reviews Container into .Product__productReviews__QyRI4
    const reviewsWrapper = document.querySelector<HTMLDivElement>(
      ".scar18-overview-container .Product__productReviews__QyRI4"
    );
    if (reviewsWrapper && !reviewsWrapper.querySelector(".rog-reviews-container")) {
      reviewsWrapper.innerHTML = `
        <div class="rog-reviews-container">
          <div class="rog-reviews-summary">
            <div class="rog-reviews-score-box">
              <div class="rog-reviews-big-score">4.9<span>/5</span></div>
              <div class="rog-reviews-stars">★★★★★</div>
              <div class="rog-reviews-count">Dựa trên 128 đánh giá từ người dùng đã xác thực</div>
              <div class="rog-reviews-bv-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#00e676"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                <span>Đánh giá xác thực · Bazaarvoice Authenticated</span>
              </div>
            </div>
            <div class="rog-reviews-bars">
              <div class="rog-bar-row"><span>5 sao</span><div class="rog-bar-track"><div class="rog-bar-fill" style="width: 94%"></div></div><span>94%</span></div>
              <div class="rog-bar-row"><span>4 sao</span><div class="rog-bar-track"><div class="rog-bar-fill" style="width: 6%"></div></div><span>6%</span></div>
              <div class="rog-bar-row"><span>3 sao</span><div class="rog-bar-track"><div class="rog-bar-fill" style="width: 0%"></div></div><span>0%</span></div>
              <div class="rog-bar-row"><span>2 sao</span><div class="rog-bar-track"><div class="rog-bar-fill" style="width: 0%"></div></div><span>0%</span></div>
              <div class="rog-bar-row"><span>1 sao</span><div class="rog-bar-track"><div class="rog-bar-fill" style="width: 0%"></div></div><span>0%</span></div>
            </div>
            <div class="rog-reviews-cta">
              <button class="rog-write-review-btn" type="button" id="btnWriteReview">+ VIẾT ĐÁNH GIÁ SẢN PHẨM</button>
              <p class="rog-reviews-cta-sub">Chia sẻ trải nghiệm chơi game và hiệu năng thực tế</p>
            </div>
          </div>
          <div class="rog-reviews-list">
            <div class="rog-review-card">
              <div class="rog-review-header">
                <div class="rog-review-user">
                  <div class="rog-user-avatar">HN</div>
                  <div><div class="rog-user-name">Trần Hoàng Nam <span class="rog-verified-pill">✓ Người Mua Xác Thực</span></div><div class="rog-user-spec">Cấu hình: Intel Core Ultra 9 290HX Plus / RTX 5090 / 64GB RAM</div></div>
                </div>
                <div class="rog-review-date">03/03/2026</div>
              </div>
              <div class="rog-review-stars">★★★★★</div>
              <h4 class="rog-review-title">Quái vật gaming thực sự, màn hình 4K 240Hz Nebula HDR đẹp nín thở!</h4>
              <p class="rog-review-text">Máy xử lý mượt mà mọi tựa game AAA ở thiết lập Ultra 4K. Tản nhiệt buồng hơi 3 quạt cực êm, không bị bóp xung thermal throttling sau 4 tiếng chiến Cyberpunk 2077 liên tục. Hệ thống đèn AniMe Vision mặt lưng nhìn bên ngoài cực kỳ ngầu và thu hút ánh nhìn!</p>
            </div>
            <div class="rog-review-card">
              <div class="rog-review-header">
                <div class="rog-review-user">
                  <div class="rog-user-avatar">MT</div>
                  <div><div class="rog-user-name">Nguyễn Minh Tuấn <span class="rog-verified-pill">✓ Người Mua Xác Thực</span></div><div class="rog-user-spec">Cấu hình: Intel Core Ultra 9 / RTX 5080 / 32GB RAM</div></div>
                </div>
                <div class="rog-review-date">26/02/2026</div>
              </div>
              <div class="rog-review-stars">★★★★★</div>
              <h4 class="rog-review-title">Bàn phím cơ bấm nảy tốt, cơ chế tháo lắp Q-Latch quá thông minh!</h4>
              <p class="rog-review-text">Hiệu ứng AniMe Vision và dải LED RGB quanh thân máy sáng rất đều, tùy biến trong Armoury Crate mượt mà. Đặc biệt cơ chế tháo nắp Q-Latch không cần ốc vít giúp mình tự gắn thêm thanh SSD PCIe 5.0 4TB chỉ trong vòng 1 phút. Xứng đáng danh hiệu flagship số 1 của ASUS!</p>
            </div>
            <div class="rog-review-card">
              <div class="rog-review-header">
                <div class="rog-review-user">
                  <div class="rog-user-avatar">QB</div>
                  <div><div class="rog-user-name">Lê Quốc Bảo <span class="rog-verified-pill">✓ Người Mua Xác Thực</span></div><div class="rog-user-spec">Cấu hình: Intel Core Ultra 9 290HX Plus / RTX 5090 / 128GB RAM</div></div>
                </div>
                <div class="rog-review-date">18/02/2026</div>
              </div>
              <div class="rog-review-stars">★★★★★</div>
              <h4 class="rog-review-title">Cỗ máy làm việc đồ họa 3D và dựng phim 8K hoàn hảo</h4>
              <p class="rog-review-text">Render Premiere Pro và Blender siêu tốc nhờ CPU duy trì 200W và RTX 5090 175W. Độ phủ màu 100% DCI-P3 chuẩn điện ảnh kết hợp chuẩn màu Pantone Validated giúp mình cân chỉnh màu sắc video vô cùng tự tin. Trải nghiệm âm thanh 4 loa Dolby Atmos đỉnh cao.</p>
            </div>
          </div>
        </div>
      `;

      const writeBtn = reviewsWrapper.querySelector("#btnWriteReview");
      if (writeBtn) {
        writeBtn.addEventListener("click", async () => {
          const ok = await RogApi.submitProductReview("laptops/rog-strix/rog-strix-scar-18-2026", "Khách hàng yêu cầu gửi đánh giá từ trang sản phẩm ROG Strix SCAR 18 (2026).", 5);
          alert(ok ? "Cảm ơn bạn! Đánh giá đã được gửi và sẽ được duyệt." : "Không thể gửi đánh giá lúc này.");
        });
      }
    }

    return () => {
      cleanupRuntime?.();
      observer.disconnect();
      faqButtons.forEach((btn) => btn.removeEventListener("click", handleFaqClick));
      anchorLinks.forEach((a) => a.removeEventListener("click", handleAnchorClick as EventListener));
      videoPlayBtns.forEach((btn) => btn.removeEventListener("click", handlePlayClick));
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
          <Link href="/vn/laptops/rog-strix-series">ROG Strix Series</Link>
          <span className="rog-crumb-sep">›</span>
          <span className="rog-crumb-curr">{productName}</span>
        </nav>
      </div>

      {/* Sticky Subbar with 6 tabs & official price */}
      <div className="rog-pd-subbar" style={{ position: "sticky", top: 50, zIndex: 900 }}>
        <div className="rog-pd-subbar-inner">
          <div className="rog-pd-subbar-left">
            <img
              src="/sites/rog-asus/img/hot/strix-scar-18.webp"
              alt={productName}
              className="rog-pd-subbar-thumb"
            />
            <div className="rog-pd-subbar-title">{productName}</div>
          </div>

          <nav className="rog-pd-subbar-tabs" aria-label="Tabs sản phẩm">
            <Link
              href={basePath}
              className="rog-pd-tab-link is-active"
            >
              Tính năng (Xem thêm)
            </Link>
            <Link
              href={`${basePath}/spec`}
              className="rog-pd-tab-link"
            >
              Chi tiết / Thông số kỹ thuật
            </Link>
            <a href="#awardClone" className="rog-pd-tab-link">
              Giải thưởng
            </a>
            <a href="#performance" className="rog-pd-tab-link">
              Thư viện
            </a>
            <Link href="/vn/store" className="rog-pd-tab-link">
              Nơi mua
            </Link>
            <Link href="/vn/support" className="rog-pd-tab-link">
              Hỗ trợ
            </Link>
          </nav>

          <div className="rog-pd-subbar-actions">
            <div className="rog-pd-subbar-price-wrap">
              <span className="rog-pd-subbar-price-label">Giá khởi điểm ASUS estore</span>
              <span className="rog-pd-subbar-price">{currentPrice}</span>
            </div>
            <Link href="/vn/store" className="rog-pd-buy-btn">
              MUA NGAY
            </Link>
          </div>
        </div>
      </div>

      {/* 1:1 Bespoke SCAR 18 Experience Container */}
      <div
        className="scar18-overview-container"
        dangerouslySetInnerHTML={{ __html: SCAR18_FEATURES_HTML }}
        suppressHydrationWarning
      />

      {/* Video Lightbox Modal */}
      {videoModalOpen && (
        <div className="rog-video-modal-backdrop" onClick={() => setVideoModalOpen(false)}>
          <div className="rog-video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="rog-video-modal-close"
              onClick={() => setVideoModalOpen(false)}
              aria-label="Đóng video"
            >
              ✕
            </button>
            <div style={{ padding: "16px 20px", background: "#111", borderBottom: "1px solid #222" }}>
              <h3 style={{ margin: 0, fontSize: "16px", color: "#fff", fontWeight: 700 }}>
                {currentVideoTitle}
              </h3>
            </div>
            <div className="rog-video-modal-player">
              <video
                src="/sites/rog-asus/videos/scar18/flow.webm"
                controls
                autoPlay
                playsInline
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Footer disclaimers */}
      <footer
        className="rog-pd-foot-note"
        style={{
          padding: "40px 24px",
          background: "#0b0b0b",
          borderTop: "1px solid #222",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            fontSize: "13px",
            color: "#888",
            lineHeight: 1.8,
          }}
        >
          <p>
            *Thuật ngữ “HDMI”, “HDMI High-Definition Multimedia Interface”, nhãn quan thương mại HDMI và Logo HDMI là các nhãn hiệu thương mại hoặc nhãn hiệu thương mại đã đăng ký của HDMI Licensing Administrator, Inc.
          </p>
          <p>
            *Các tính năng và thông số kỹ thuật thực tế có thể thay đổi theo từng quốc gia hoặc khu vực phân phối. Intel, logo Intel, Intel Core và Core Ultra là các nhãn hiệu của Tập đoàn Intel hoặc các chi nhánh. NVIDIA, logo NVIDIA, GeForce và RTX là các nhãn hiệu của Tập đoàn NVIDIA.
          </p>
          <p>
            *Tổng công suất hệ thống đạt mức tối đa 320W khi kết hợp giữa Intel® Core™ Ultra 9 290HX Plus (duy trì 200W) và NVIDIA® GeForce RTX™ 5090 Laptop GPU (175W TGP với Dynamic Boost) trong điều kiện kiểm thử tiêu chuẩn của phòng thí nghiệm ASUS.
          </p>
        </div>
      </footer>
    </article>
  );
}
