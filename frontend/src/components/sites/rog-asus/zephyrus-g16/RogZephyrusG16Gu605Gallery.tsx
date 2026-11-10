"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useState } from "react";
import "../RogProductDetail.css";

type GalleryImage = {
  id: string;
  title: string;
  desc: string;
  color: "all" | "grey" | "white";
  src: string;
  tag: string;
};

const GALLERY_IMAGES: GalleryImage[] = [
  {
    id: "g1",
    title: "Mặt trước mở máy ROG Zephyrus G16 (2025)",
    desc: "Màn hình ROG Nebula Display OLED 16-inch tỷ lệ 16:10 viền siêu mỏng, độ phân giải 2.5K 240Hz sắc nét.",
    color: "grey",
    src: "/sites/rog-asus/img/detail/gu605-kv.webp",
    tag: "Eclipse Grey",
  },
  {
    id: "g2",
    title: "Mặt lưng nhôm CNC & Dải đèn Slash Lighting",
    desc: "Vỏ nhôm hàng không vũ trụ phay CNC nguyên khối với dải đèn LED chéo Slash Lighting độc bản 7 hiệu ứng ánh sáng.",
    color: "grey",
    src: "/sites/rog-asus/img/hot/zephyrus-g16.webp",
    tag: "Slash Lighting",
  },
  {
    id: "g3",
    title: "Phiên bản Platinum White sang trọng",
    desc: "Sắc trắng bạch kim tinh khôi xử lý bề mặt anodize chống bám vân tay, độ dày chỉ 1,49 cm và nặng 1,85 kg.",
    color: "white",
    src: "/sites/rog-asus/img/series/hero-zephyrus.webp",
    tag: "Platinum White",
  },
  {
    id: "g4",
    title: "Cạnh bên siêu mỏng 1,49 cm",
    desc: "Thiết kế vát cạnh CNC tinh xảo, mỏng nhẹ hàng đầu phân khúc laptop gaming 16-inch trang bị GPU RTX 5090.",
    color: "white",
    src: "/sites/rog-asus/img/series/zephyrus-ga403.webp",
    tag: "Profile 1.49 cm",
  },
  {
    id: "g5",
    title: "Màn hình OLED 2.5K 240Hz 0.2ms VESA True Black 500",
    desc: "Màu đen sâu vô tận, độ phủ màu 100% DCI-P3 chuẩn điện ảnh, độ sáng đỉnh 500 nits và chứng nhận bảo vệ mắt TÜV Rheinland.",
    color: "all",
    src: "https://dlcdnwebimgs.asus.com/files/media/4a28d63e-9bb1-4da5-a80d-b606d7b2f9c7/v2/images/medium/1x/display_bg1.webp",
    tag: "Nebula OLED",
  },
  {
    id: "g6",
    title: "Hệ thống 3 quạt tản nhiệt Arc Flow Fans 2.0",
    desc: "Công nghệ buồng hơi Vapor Chamber kim loại lỏng kết hợp 3 quạt tản nhiệt giữ nhiệt độ máy luôn mát mẻ và vận hành êm ái 0dB.",
    color: "all",
    src: "https://dlcdnwebimgs.asus.com/files/media/4a28d63e-9bb1-4da5-a80d-b606d7b2f9c7/v2/images/large/1x/3fan_fan.webp",
    tag: "Intelligent Cooling",
  },
  {
    id: "g7",
    title: "Bàn phím Stealth Keyboard & Bàn di chuột 16:10",
    desc: "Hành trình phím sâu 1.7mm gõ cực êm, đèn nền RGB 1 vùng Aura Sync và Touchpad phủ kính kích thước lớn nhất từng có trên Zephyrus.",
    color: "grey",
    src: "https://dlcdnwebimgs.asus.com/files/media/4a28d63e-9bb1-4da5-a80d-b606d7b2f9c7/v2/images/small/1x/control_slide_power_key.jpg",
    tag: "Stealth Keyboard",
  },
  {
    id: "g8",
    title: "Hệ thống âm thanh 6 loa Dolby Atmos",
    desc: "2 loa cao tần hướng lên và 4 loa trầm triệt tiêu lực kép hướng xuống mang lại âm trường 3D sống động chuẩn phòng thu.",
    color: "all",
    src: "https://dlcdnwebimgs.asus.com/files/media/4a28d63e-9bb1-4da5-a80d-b606d7b2f9c7/v2/images/large/2x/audio_laptop_translucent.webp",
    tag: "Dolby Atmos 6 Loa",
  },
];

export default function RogZephyrusG16Gu605Gallery() {
  const [selectedColor, setSelectedColor] = useState<"all" | "grey" | "white">("all");
  const [lightboxImg, setLightboxImg] = useState<GalleryImage | null>(null);

  const filteredImages =
    selectedColor === "all"
      ? GALLERY_IMAGES
      : GALLERY_IMAGES.filter((img) => img.color === "all" || img.color === selectedColor);

  return (
    <div className="rog-pd" style={{ backgroundColor: "#0b0b0b", color: "#fff", minHeight: "100vh" }}>
      {/* breadcrumb */}
      <div className="rog-pd-crumb-wrap">
        <nav className="rog-pd-crumb" aria-label="Breadcrumb">
          <Link href="/">Trang chủ</Link>
          <span className="rog-crumb-sep">›</span>
          <Link href="/vn/laptops-group/">Laptop Gaming ASUS ROG</Link>
          <span className="rog-crumb-sep">›</span>
          <Link href="/vn/laptops/rog-zephyrus-series">ROG Zephyrus Series</Link>
          <span className="rog-crumb-sep">›</span>
          <Link href="/vn/laptops/rog-zephyrus/rog-zephyrus-g16-2025-gu605">ROG Zephyrus G16 GU605</Link>
          <span className="rog-crumb-sep">›</span>
          <span className="rog-crumb-curr">Thư viện ảnh</span>
        </nav>
      </div>

      {/* sticky subbar with official 6 tabs */}
      <div className="rog-pd-subbar" style={{ position: "sticky", top: 50, zIndex: 900 }}>
        <div className="rog-pd-subbar-inner">
          <div className="rog-pd-subbar-left">
            <img
              src="/sites/rog-asus/img/hot/zephyrus-g16.webp"
              alt="ROG Zephyrus G16 (2025) GU605"
              className="rog-pd-subbar-thumb"
            />
            <div className="rog-pd-subbar-title">ROG Zephyrus G16 (2025) GU605</div>
          </div>

          <nav className="rog-pd-subbar-tabs" aria-label="Tabs sản phẩm">
            <Link
              href="/vn/laptops/rog-zephyrus/rog-zephyrus-g16-2025-gu605"
              className="rog-pd-tab-link"
            >
              Tính năng
            </Link>
            <Link
              href="/vn/laptops/rog-zephyrus/rog-zephyrus-g16-2025-gu605/spec"
              className="rog-pd-tab-link"
            >
              Thông số kỹ thuật
            </Link>
            <Link
              href="/vn/laptops/rog-zephyrus/rog-zephyrus-g16-2025-gu605#awards"
              className="rog-pd-tab-link"
            >
              Giải thưởng
            </Link>
            <Link
              href="/vn/laptops/rog-zephyrus/rog-zephyrus-g16-2025-gu605/gallery"
              className="rog-pd-tab-link is-active"
            >
              Thư viện
            </Link>
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
              <span className="rog-pd-subbar-price-label">Giá khởi điểm trên ASUS estore là</span>
              <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                <span className="rog-pd-subbar-price" style={{ color: "#ff0036", fontWeight: 700 }}>73.990.000 ₫</span>
                <span style={{ fontSize: "12px", color: "#888", textDecoration: "line-through" }}>74.990.000 ₫</span>
              </div>
            </div>
            <Link
              href="/vn/laptops/rog-zephyrus/rog-zephyrus-g16-2025-gu605/spec"
              className="rog-pd-buy-btn"
            >
              Lựa Chọn
            </Link>
          </div>
        </div>
      </div>

      {/* Gallery Header */}
      <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "48px 24px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <span style={{ color: "#ff0036", fontWeight: 700, fontSize: "14px", letterSpacing: "2px", textTransform: "uppercase" }}>
            THƯ VIỆN HÌNH ẢNH SẢN PHẨM
          </span>
          <h1 style={{ fontSize: "36px", fontWeight: 900, margin: "8px 0 16px", letterSpacing: "1px" }}>
            ROG ZEPHYRUS G16 (2025) GU605
          </h1>
          <p style={{ color: "#aaa", fontSize: "16px", maxWidth: "700px", margin: "0 auto" }}>
            Khám phá vẻ đẹp chuẩn xác của tuyệt tác khung nhôm CNC 1,49 cm, dải đèn Slash Lighting mặt A và màn hình ROG Nebula OLED từ mọi góc nhìn.
          </p>

          {/* Color filter tabs */}
          <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "28px" }}>
            <button
              type="button"
              onClick={() => setSelectedColor("all")}
              style={{
                padding: "10px 24px",
                borderRadius: "2px",
                border: selectedColor === "all" ? "1px solid #ff0036" : "1px solid #333",
                background: selectedColor === "all" ? "#ff0036" : "#1a1a1a",
                color: "#fff",
                fontWeight: 700,
                fontSize: "13px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              TẤT CẢ GÓC NHÌN ({GALLERY_IMAGES.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedColor("grey")}
              style={{
                padding: "10px 24px",
                borderRadius: "2px",
                border: selectedColor === "grey" ? "1px solid #ff0036" : "1px solid #333",
                background: selectedColor === "grey" ? "#ff0036" : "#1a1a1a",
                color: "#fff",
                fontWeight: 700,
                fontSize: "13px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              ECLIPSE GREY (XÁM)
            </button>
            <button
              type="button"
              onClick={() => setSelectedColor("white")}
              style={{
                padding: "10px 24px",
                borderRadius: "2px",
                border: selectedColor === "white" ? "1px solid #ff0036" : "1px solid #333",
                background: selectedColor === "white" ? "#ff0036" : "#1a1a1a",
                color: "#fff",
                fontWeight: 700,
                fontSize: "13px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              PLATINUM WHITE (TRẮNG)
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
            gap: "24px",
            marginTop: "16px",
          }}
        >
          {filteredImages.map((img) => (
            <div
              key={img.id}
              onClick={() => setLightboxImg(img)}
              style={{
                background: "#141414",
                border: "1px solid #262626",
                borderRadius: "4px",
                overflow: "hidden",
                cursor: "pointer",
                transition: "transform 0.3s ease, border-color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = "#ff0036";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "#262626";
              }}
            >
              <div style={{ position: "relative", height: "240px", background: "#050505", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                <img
                  src={img.src}
                  alt={img.title}
                  style={{
                    maxHeight: "100%",
                    maxWidth: "100%",
                    objectFit: "contain",
                    transition: "transform 0.4s ease",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    top: "12px",
                    left: "12px",
                    background: "rgba(0,0,0,0.75)",
                    border: "1px solid #ff0036",
                    color: "#fff",
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "4px 10px",
                    borderRadius: "2px",
                    textTransform: "uppercase",
                  }}
                >
                  {img.tag}
                </span>
                <span
                  style={{
                    position: "absolute",
                    bottom: "12px",
                    right: "12px",
                    background: "rgba(0,0,0,0.6)",
                    color: "#fff",
                    fontSize: "12px",
                    padding: "4px 8px",
                    borderRadius: "2px",
                  }}
                >
                  🔍 Phóng to
                </span>
              </div>
              <div style={{ padding: "16px 20px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 6px", color: "#fff" }}>
                  {img.title}
                </h3>
                <p style={{ fontSize: "13px", color: "#888", margin: 0, lineHeight: 1.6 }}>
                  {img.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Bar */}
        <div
          style={{
            marginTop: "60px",
            padding: "36px",
            background: "linear-gradient(135deg, #181818 0%, #111 100%)",
            border: "1px solid #333",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <div>
            <h2 style={{ fontSize: "22px", fontWeight: 900, margin: "0 0 6px" }}>
              Bạn muốn tìm hiểu thêm về cấu hình chi tiết?
            </h2>
            <p style={{ fontSize: "14px", color: "#999", margin: 0 }}>
              Xem bảng thông số kỹ thuật đầy đủ hoặc đặt mua ngay trên ASUS Store Việt Nam.
            </p>
          </div>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <Link
              href="/vn/laptops/rog-zephyrus/rog-zephyrus-g16-2025-gu605/spec"
              style={{
                padding: "12px 24px",
                border: "1px solid #666",
                color: "#fff",
                fontWeight: 700,
                fontSize: "13px",
                textDecoration: "none",
                borderRadius: "2px",
              }}
            >
              XEM THÔNG SỐ KỸ THUẬT →
            </Link>
            <Link
              href="/vn/store"
              style={{
                padding: "12px 28px",
                background: "#ff0036",
                color: "#fff",
                fontWeight: 700,
                fontSize: "13px",
                textDecoration: "none",
                borderRadius: "2px",
              }}
            >
              MUA NGAY (73.990.000 ₫)
            </Link>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxImg && (
        <div
          onClick={() => setLightboxImg(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.92)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            cursor: "zoom-out",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "1000px",
              width: "100%",
              background: "#161616",
              border: "1px solid #333",
              borderRadius: "6px",
              overflow: "hidden",
              cursor: "default",
            }}
          >
            <div style={{ position: "relative", background: "#000", padding: "20px", display: "flex", justifyContent: "center", alignItems: "center", maxHeight: "70vh" }}>
              <img
                src={lightboxImg.src}
                alt={lightboxImg.title}
                style={{ maxHeight: "65vh", maxWidth: "100%", objectFit: "contain" }}
              />
              <button
                type="button"
                onClick={() => setLightboxImg(null)}
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  background: "#ff0036",
                  color: "#fff",
                  border: "none",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  fontSize: "18px",
                  fontWeight: 900,
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>
            <div style={{ padding: "20px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
                <span style={{ background: "#ff0036", color: "#fff", fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "2px" }}>
                  {lightboxImg.tag}
                </span>
                <h3 style={{ fontSize: "18px", fontWeight: 700, margin: 0, color: "#fff" }}>
                  {lightboxImg.title}
                </h3>
              </div>
              <p style={{ fontSize: "14px", color: "#aaa", margin: 0 }}>
                {lightboxImg.desc}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
