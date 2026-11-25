"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import "../RogProductDetail.css";

export interface GalleryItem {
  id: string;
  title: string;
  desc: string;
  category?: string;
  src: string;
  tag?: string;
}

export interface RogProductGalleryProps {
  productName: string;
  basePath: string;
  price?: string;
  thumbImg?: string;
  breadcrumb?: { label: string; href: string }[];
  categories?: { id: string; label: string }[];
  images: GalleryItem[];
}

export default function RogProductGallery({
  productName,
  basePath,
  price,
  thumbImg,
  breadcrumb = [],
  categories = [
    { id: "all", label: "Tất cả góc nhìn" },
    { id: "overview", label: "Tổng thể thiết kế" },
    { id: "details", label: "Chi tiết phần cứng & Cổng I/O" },
  ],
  images,
}: RogProductGalleryProps) {
  const router = useRouter();
  const { addLine } = useCart();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [lightboxImg, setLightboxImg] = useState<GalleryItem | null>(null);

  const cleanSlug = basePath.replace(/^\/vn\//, "");

  const handleBuyNow = () => {
    let numericPrice = 0;
    if (price) {
      const parsed = parseInt(price.replace(/[^0-9]/g, ""), 10);
      if (!isNaN(parsed)) numericPrice = parsed;
    }
    addLine({
      slug: cleanSlug,
      name: productName,
      image: thumbImg || images[0]?.src || "/sites/rog-asus/img/hot/strix-scar-18.webp",
      price: numericPrice,
      href: basePath,
    });
    router.push("/vn/checkout");
  };

  const filteredImages =
    activeCategory === "all"
      ? images
      : images.filter((img) => !img.category || img.category === activeCategory);

  const activeIndex = lightboxImg ? filteredImages.findIndex((img) => img.id === lightboxImg.id) : -1;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeIndex > 0) {
      setLightboxImg(filteredImages[activeIndex - 1]);
    } else {
      setLightboxImg(filteredImages[filteredImages.length - 1]);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeIndex < filteredImages.length - 1) {
      setLightboxImg(filteredImages[activeIndex + 1]);
    } else {
      setLightboxImg(filteredImages[0]);
    }
  };

  return (
    <div className="rog-pd" style={{ backgroundColor: "#0b0b0b", color: "#fff", minHeight: "100vh" }}>
      {/* 1:1 Breadcrumbs */}
      <div className="rog-pd-breadcrumb">
        <Link href="/">Trang chủ</Link>
        {breadcrumb.map((b) => (
          <span key={b.label} style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
            <span>›</span>
            <Link href={b.href}>{b.label}</Link>
          </span>
        ))}
        <span>›</span>
        <Link href={basePath}>{productName}</Link>
        <span>›</span>
        <span>Thư viện ảnh</span>
      </div>

      {/* Sticky Subbar */}
      <div className="rog-pd-subbar" style={{ position: "sticky", top: 50, zIndex: 1000 }}>
        <div className="rog-pd-subbar-inner">
          <div className="rog-pd-subbar-left">
            {thumbImg && (
              <img
                src={thumbImg}
                alt={productName}
                className="rog-pd-subbar-thumb"
              />
            )}
            <div className="rog-pd-subbar-title">{productName}</div>
          </div>

          <nav className="rog-pd-subbar-tabs" aria-label="Tabs sản phẩm">
            <Link href={basePath} className="rog-pd-tab-link">
              Tính năng
            </Link>
            <Link href={`${basePath}/spec`} className="rog-pd-tab-link">
              Thông số kỹ thuật
            </Link>
            <a href={`${basePath}#awards`} className="rog-pd-tab-link">
              Giải thưởng
            </a>
            <Link href={`${basePath}/gallery`} className="rog-pd-tab-link is-active">
              Thư viện
            </Link>
            <Link href="/vn/where-to-buy" className="rog-pd-tab-link">
              Nơi mua
            </Link>
            <Link href="/vn/support" className="rog-pd-tab-link">
              Hỗ trợ
            </Link>
          </nav>

          <div className="rog-pd-subbar-actions">
            {price && (
              <div className="rog-pd-subbar-price-wrap">
                <span className="rog-pd-subbar-price-label">Giá khởi điểm ASUS estore</span>
                <span className="rog-pd-subbar-price">{price}</span>
              </div>
            )}
            <button
              type="button"
              onClick={handleBuyNow}
              className="rog-pd-buy-btn"
              style={{ cursor: "pointer", padding: "8px 16px" }}
            >
              MUA NGAY
            </button>
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
            {productName}
          </h1>
          <p style={{ color: "#aaa", fontSize: "16px", maxWidth: "700px", margin: "0 auto" }}>
            Khám phá vẻ đẹp chuẩn xác của từng chi tiết thiết kế, các góc máy sắc sảo và công nghệ phần cứng đỉnh cao.
          </p>

          {/* Filter Pills */}
          {categories.length > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "28px", flexWrap: "wrap" }}>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  style={{
                    padding: "10px 24px",
                    borderRadius: "2px",
                    border: activeCategory === cat.id ? "1px solid #ff0036" : "1px solid #333",
                    background: activeCategory === cat.id ? "#ff0036" : "#1a1a1a",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "13px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {cat.label.toUpperCase()} {cat.id === "all" ? `(${images.length})` : ""}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Gallery Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
            gap: "24px",
            marginTop: "32px",
          }}
        >
          {filteredImages.map((img) => (
            <div
              key={img.id}
              onClick={() => setLightboxImg(img)}
              style={{
                backgroundColor: "#141414",
                border: "1px solid #222",
                borderRadius: "4px",
                overflow: "hidden",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#ff0036";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#222";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ position: "relative", width: "100%", aspectRatio: "16/10", overflow: "hidden", background: "#000" }}>
                <img
                  src={img.src}
                  alt={img.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    display: "block",
                    padding: "12px",
                    transition: "transform 0.4s ease",
                  }}
                />
                {img.tag && (
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
                      padding: "4px 8px",
                      borderRadius: "2px",
                      textTransform: "uppercase",
                    }}
                  >
                    {img.tag}
                  </span>
                )}
              </div>
              <div style={{ padding: "16px 20px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#fff", margin: "0 0 6px" }}>
                  {img.title}
                </h3>
                <p style={{ fontSize: "13px", color: "#888", margin: 0, lineHeight: 1.5 }}>
                  {img.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxImg && (
        <div
          onClick={() => setLightboxImg(null)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.92)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setLightboxImg(null)}
            style={{
              position: "absolute",
              top: "24px",
              right: "24px",
              background: "#1f1f1f",
              border: "1px solid #444",
              color: "#fff",
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              fontSize: "20px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 100000,
            }}
          >
            ✕
          </button>

          {/* Prev button */}
          <button
            type="button"
            onClick={handlePrev}
            style={{
              position: "absolute",
              left: "24px",
              background: "#1f1f1f",
              border: "1px solid #444",
              color: "#fff",
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              fontSize: "24px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 100000,
            }}
          >
            ‹
          </button>

          {/* Image & description container */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "1000px",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div style={{ maxHeight: "70vh", width: "100%", display: "flex", justifyContent: "center" }}>
              <img
                src={lightboxImg.src}
                alt={lightboxImg.title}
                style={{
                  maxHeight: "70vh",
                  maxWidth: "100%",
                  objectFit: "contain",
                  borderRadius: "4px",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.8)",
                }}
              />
            </div>
            <div style={{ textAlign: "center", marginTop: "20px", maxWidth: "800px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 700, margin: "0 0 8px", color: "#fff" }}>
                {lightboxImg.title}
              </h2>
              <p style={{ fontSize: "14px", color: "#aaa", margin: 0, lineHeight: 1.6 }}>
                {lightboxImg.desc}
              </p>
              <div style={{ marginTop: "12px", color: "#ff0036", fontSize: "12px", fontWeight: 700 }}>
                {activeIndex + 1} / {filteredImages.length}
              </div>
            </div>
          </div>

          {/* Next button */}
          <button
            type="button"
            onClick={handleNext}
            style={{
              position: "absolute",
              right: "24px",
              background: "#1f1f1f",
              border: "1px solid #444",
              color: "#fff",
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              fontSize: "24px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 100000,
            }}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
