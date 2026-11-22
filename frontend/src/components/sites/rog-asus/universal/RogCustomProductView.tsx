"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import RogNavbar from "@/components/sites/rog-asus/RogNavbar";
import RogFooter from "@/components/sites/rog-asus/RogFooter";
import RogChatWidget from "@/components/sites/rog-asus/RogChatWidget";
import { useCart, formatVnd } from "@/lib/cart";
import { RogApi, type ProductDetailDto, type PublicReviewDto } from "@/lib/api-client";

interface Props {
  product: ProductDetailDto;
}

export default function RogCustomProductView({ product }: Props) {
  const router = useRouter();
  const { addLine } = useCart();
  const [selectedImg, setSelectedImg] = useState<string>(
    product.keyVisualUrl || product.thumbnailUrl || "/sites/rog-asus/img/detail/scar18-kv.webp"
  );
  const [addedNotice, setAddedNotice] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState<PublicReviewDto[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewerName, setReviewerName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewContent, setReviewContent] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState("");

  useEffect(() => {
    let cancelled = false;
    RogApi.getProductReviews(product.slug)
      .then((data) => {
        if (!cancelled) setReviews(data || []);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setReviewsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [product.slug]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewContent.trim()) return;
    try {
      setSubmittingReview(true);
      await RogApi.submitProductReview(product.slug, reviewContent.trim(), reviewRating);
      setReviewSuccessMsg("Cảm ơn bạn! Đánh giá đã được gửi và sẽ hiển thị sau khi quản trị viên phê duyệt.");
      setReviewContent("");
    } catch {
      alert("Gửi đánh giá không thành công, vui lòng thử lại sau.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const images: string[] = [];
  if (product.keyVisualUrl) images.push(product.keyVisualUrl);
  if (product.thumbnailUrl && !images.includes(product.thumbnailUrl)) images.push(product.thumbnailUrl);
  if (product.galleryImages) {
    for (const img of product.galleryImages) {
      if (img && !images.includes(img)) images.push(img);
    }
  }
  if (images.length === 0) images.push("/sites/rog-asus/img/detail/scar18-kv.webp");

  const handleAddToCart = () => {
    addLine({
      slug: product.slug,
      name: product.name,
      image: product.thumbnailUrl || images[0],
      price: product.price,
      href: `/vn/${product.slug}`,
      selectedSpecs: product.modelCode || undefined,
    });
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3000);
  };

  const handleBuyNow = () => {
    addLine({
      slug: product.slug,
      name: product.name,
      image: product.thumbnailUrl || images[0],
      price: product.price,
      href: `/vn/${product.slug}`,
      selectedSpecs: product.modelCode || undefined,
    });
    router.push("/vn/checkout");
  };

  // Group specs by spec group
  const specsByGroup: Record<string, { key: string; value: string }[]> = {};
  if (product.specs && product.specs.length > 0) {
    for (const spec of product.specs) {
      const grp = spec.group || "Thông số chung";
      if (!specsByGroup[grp]) specsByGroup[grp] = [];
      specsByGroup[grp].push({ key: spec.key, value: spec.value });
    }
  }

  return (
    <div className="rog-page" style={{ backgroundColor: "#0b0b10", color: "#fff", minHeight: "100vh" }}>
      <RogNavbar />

      <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 24px 80px" }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: "13px", color: "#888", marginBottom: "24px" }}>
          <Link href="/vn" style={{ color: "#aaa", textDecoration: "none" }}>Trang chủ</Link>
          <span style={{ margin: "0 8px" }}>›</span>
          <span style={{ color: "#ff0036", textTransform: "capitalize" }}>{product.categorySlug || "Sản phẩm"}</span>
          <span style={{ margin: "0 8px" }}>›</span>
          <span style={{ color: "#eee" }}>{product.name}</span>
        </div>

        {/* Product Hero Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "48px", marginBottom: "64px" }}>
          {/* Images Section */}
          <div>
            <div style={{
              background: "radial-gradient(circle at center, #1e1e2d 0%, #0d0d14 100%)",
              border: "1px solid #232334",
              borderRadius: "8px",
              padding: "32px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "400px",
              marginBottom: "16px"
            }}>
              <img
                src={selectedImg}
                alt={product.name}
                style={{ maxWidth: "100%", maxHeight: "380px", objectFit: "contain" }}
              />
            </div>

            {images.length > 1 && (
              <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "8px" }}>
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImg(img)}
                    style={{
                      border: selectedImg === img ? "2px solid #ff0036" : "1px solid #232334",
                      background: "#13131c",
                      borderRadius: "6px",
                      padding: "4px",
                      cursor: "pointer",
                      width: "72px",
                      height: "54px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0
                    }}
                  >
                    <img src={img} alt="" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Buy Section */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ background: "#ff0036", color: "#fff", fontSize: "11px", fontWeight: 800, padding: "2px 8px", borderRadius: "3px" }}>
                ROG OFFICIAL
              </span>
              {product.modelCode && (
                <span style={{ color: "#888", fontSize: "12px", fontFamily: "monospace" }}>
                  MÃ: {product.modelCode}
                </span>
              )}
            </div>

            <h1 style={{ fontSize: "32px", fontWeight: 900, lineHeight: 1.2, margin: "0 0 16px" }}>
              {product.name}
            </h1>

            {product.tagline && (
              <p style={{ color: "#aaa", fontSize: "15px", lineHeight: 1.6, margin: "0 0 24px" }}>
                {product.tagline}
              </p>
            )}

            {/* Price Box */}
            <div style={{ background: "#14141e", border: "1px solid #232334", borderRadius: "8px", padding: "20px", marginBottom: "28px" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "16px", flexWrap: "wrap", marginBottom: "8px" }}>
                <span style={{ fontSize: "30px", fontWeight: 900, color: "#ff0036" }}>
                  {product.price > 0 ? formatVnd(product.price) : "Liên hệ báo giá"}
                </span>
                {product.oldPrice && product.oldPrice > product.price && (
                  <span style={{ fontSize: "16px", color: "#777", textDecoration: "line-through" }}>
                    {formatVnd(product.oldPrice)}
                  </span>
                )}
                {product.discountLabel && (
                  <span style={{ background: "#3d131b", color: "#ff4466", border: "1px solid #ff0036", fontSize: "12px", fontWeight: 700, padding: "3px 8px", borderRadius: "4px" }}>
                    {product.discountLabel}
                  </span>
                )}
              </div>

              <div style={{ fontSize: "13px", color: "#888" }}>
                Tình trạng:{" "}
                {Number(product.stockStatus) === 0 ? (
                  <span style={{ color: "#22c55e", fontWeight: 700 }}>● Còn hàng tại kho</span>
                ) : Number(product.stockStatus) === 1 ? (
                  <span style={{ color: "#ef4444", fontWeight: 700 }}>● Tạm hết hàng</span>
                ) : (
                  <span style={{ color: "#f59e0b", fontWeight: 700 }}>● Đặt trước (Pre-Order)</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "20px" }}>
              <button
                type="button"
                onClick={handleAddToCart}
                style={{
                  background: "transparent",
                  color: "#ff0036",
                  border: "2px solid #ff0036",
                  borderRadius: "4px",
                  padding: "14px 28px",
                  fontSize: "14px",
                  fontWeight: 800,
                  cursor: "pointer",
                  letterSpacing: "1px",
                  transition: "all 0.2s"
                }}
              >
                🛒 THÊM VÀO GIỎ
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                style={{
                  background: "#ff0036",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  padding: "14px 32px",
                  fontSize: "14px",
                  fontWeight: 800,
                  cursor: "pointer",
                  letterSpacing: "1px",
                  boxShadow: "0 4px 14px rgba(255, 0, 54, 0.4)"
                }}
              >
                MUA NGAY ➔
              </button>
            </div>

            {addedNotice && (
              <div style={{ background: "rgba(34, 197, 94, 0.15)", border: "1px solid #22c55e", color: "#4ade80", padding: "10px 16px", borderRadius: "6px", fontSize: "13px" }}>
                ✓ Đã thêm <strong>{product.name}</strong> vào giỏ hàng thành công!
              </div>
            )}
          </div>
        </div>

        {/* Specifications Section */}
        {Object.keys(specsByGroup).length > 0 && (
          <section style={{ borderTop: "1px solid #232334", paddingTop: "48px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: 900, marginBottom: "32px", display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ color: "#ff0036" }}>//</span> THÔNG SỐ KỸ THUẬT CHI TIẾT
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
              {Object.entries(specsByGroup).map(([grp, items]) => (
                <div key={grp} style={{ background: "#13131c", border: "1px solid #232334", borderRadius: "8px", padding: "20px" }}>
                  <h3 style={{ fontSize: "15px", fontWeight: 800, color: "#ff0036", marginTop: 0, marginBottom: "16px", borderBottom: "1px solid #232334", paddingBottom: "8px" }}>
                    {grp}
                  </h3>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                    <tbody>
                      {items.map((it, idx) => (
                        <tr key={idx} style={{ borderBottom: idx < items.length - 1 ? "1px solid #1a1a26" : "none" }}>
                          <td style={{ padding: "8px 0", color: "#888", width: "40%", verticalAlign: "top" }}>{it.key}</td>
                          <td style={{ padding: "8px 0", color: "#ddd", fontWeight: 600 }}>{it.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Product Reviews Section */}
        <section style={{ borderTop: "1px solid #232334", paddingTop: "48px", marginTop: "48px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <h2 style={{ fontSize: "24px", fontWeight: 900, margin: "0 0 6px", display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ color: "#ff0036" }}>//</span> ĐÁNH GIÁ TỪ CỘNG ĐỒNG ROG
              </h2>
              <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>
                {reviews.length > 0 ? `${reviews.length} nhận xét đã được kiểm duyệt chính thức` : "Chưa có đánh giá nào cho sản phẩm này"}
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "32px" }}>
            {/* Reviews List */}
            <div>
              {reviewsLoading ? (
                <p style={{ color: "#888" }}>Đang tải đánh giá…</p>
              ) : reviews.length === 0 ? (
                <div style={{ background: "#13131c", border: "1px solid #232334", borderRadius: "8px", padding: "32px", textAlign: "center", color: "#888" }}>
                  Chưa có đánh giá nào. Hãy là người đầu tiên chia sẻ cảm nhận về {product.name}!
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {reviews.map((rev) => (
                    <div key={rev.id} style={{ background: "#13131c", border: "1px solid #232334", borderRadius: "8px", padding: "20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <div style={{ fontWeight: 800, color: "#fff", fontSize: "14px" }}>{rev.authorName || "Game thủ ROG"}</div>
                        <div style={{ color: "#eab308", fontSize: "14px" }}>
                          {"★".repeat(Math.max(1, Math.min(5, rev.rating)))}
                          {"☆".repeat(Math.max(0, 5 - Math.max(1, Math.min(5, rev.rating))))}
                        </div>
                      </div>
                      {rev.title && <div style={{ fontWeight: 700, color: "#ff0036", fontSize: "13px", marginBottom: "6px" }}>{rev.title}</div>}
                      <p style={{ color: "#ccc", fontSize: "13px", lineHeight: 1.6, margin: "0 0 8px" }}>{rev.content}</p>
                      <div style={{ color: "#666", fontSize: "11px" }}>
                        {new Date(rev.createdAtUtc).toLocaleDateString("vi-VN")}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Review Form */}
            <div style={{ background: "#13131c", border: "1px solid #232334", borderRadius: "8px", padding: "24px", height: "fit-content" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 800, margin: "0 0 16px", textTransform: "uppercase", letterSpacing: "1px" }}>
                Viết nhận xét của bạn
              </h3>
              {reviewSuccessMsg ? (
                <div style={{ background: "rgba(34, 197, 94, 0.15)", border: "1px solid #22c55e", color: "#4ade80", padding: "14px", borderRadius: "6px", fontSize: "13px" }}>
                  ✓ {reviewSuccessMsg}
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", color: "#888", marginBottom: "4px" }}>Tên của bạn</label>
                    <input
                      type="text"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      placeholder="VD: Tuấn ROG"
                      style={{ width: "100%", background: "#0b0b10", border: "1px solid #333", color: "#fff", padding: "8px 12px", borderRadius: "4px", fontSize: "13px" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", color: "#888", marginBottom: "4px" }}>Đánh giá số sao</label>
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                      style={{ width: "100%", background: "#0b0b10", border: "1px solid #333", color: "#eab308", padding: "8px 12px", borderRadius: "4px", fontSize: "13px" }}
                    >
                      <option value={5}>★★★★★ (5 sao - Tuyệt vời)</option>
                      <option value={4}>★★★★☆ (4 sao - Rất tốt)</option>
                      <option value={3}>★★★☆☆ (3 sao - Tạm ổn)</option>
                      <option value={2}>★★☆☆☆ (2 sao - Cần cải thiện)</option>
                      <option value={1}>★☆☆☆☆ (1 sao - Kém)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", color: "#888", marginBottom: "4px" }}>Nội dung nhận xét</label>
                    <textarea
                      value={reviewContent}
                      onChange={(e) => setReviewContent(e.target.value)}
                      required
                      rows={4}
                      placeholder="Chia sẻ trải nghiệm hiệu năng, màn hình, tản nhiệt của bạn..."
                      style={{ width: "100%", background: "#0b0b10", border: "1px solid #333", color: "#fff", padding: "8px 12px", borderRadius: "4px", fontSize: "13px", resize: "vertical" }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    style={{
                      background: "#ff0036",
                      color: "#fff",
                      border: "none",
                      padding: "10px 20px",
                      fontWeight: 800,
                      borderRadius: "4px",
                      cursor: submittingReview ? "not-allowed" : "pointer",
                      fontSize: "13px",
                      letterSpacing: "1px",
                      textTransform: "uppercase"
                    }}
                  >
                    {submittingReview ? "Đang gửi…" : "Gửi đánh giá"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <RogFooter />
      <RogChatWidget />
    </div>
  );
}
