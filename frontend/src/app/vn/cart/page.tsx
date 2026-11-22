/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import RogNavbar from "@/components/sites/rog-asus/RogNavbar";
import RogPromoBar from "@/components/sites/rog-asus/RogPromoBar";
import RogFooter from "@/components/sites/rog-asus/RogFooter";
import RogChatWidget from "@/components/sites/rog-asus/RogChatWidget";
import { formatVnd, useCart } from "@/lib/cart";

export default function CartPage() {
  const { lines, count, subtotal, ready, removeLine, setQuantity, clear } = useCart();

  return (
    <div className="rog-page">
      <RogNavbar />
      <RogPromoBar />
      <main style={{ background: "#0a0a0c", color: "#fff", minHeight: "70vh", padding: "60px 24px 100px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "16px", flexWrap: "wrap", marginBottom: "28px" }}>
            <div>
              <span style={{ color: "#ff0036", fontSize: "12px", fontWeight: 800, letterSpacing: "3px" }}>
                {"// ROG OFFICIAL STORE"}
              </span>
              <h1 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 900, margin: "8px 0 0", textTransform: "uppercase" }}>
                Giỏ hàng của bạn
              </h1>
            </div>
            <Link href="/vn/store" style={{ color: "#ff0036", fontWeight: 700, textDecoration: "none" }}>
              ← Tiếp tục mua sắm
            </Link>
          </div>

          {!ready ? (
            <p style={{ color: "#888" }}>Đang tải giỏ hàng…</p>
          ) : lines.length === 0 ? (
            <div style={{ background: "#111116", border: "1px solid #26262e", borderRadius: "6px", padding: "60px 24px", textAlign: "center" }}>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>🛒</div>
              <h2 style={{ fontSize: "20px", margin: "0 0 8px" }}>Giỏ hàng đang trống</h2>
              <p style={{ color: "#888", margin: "0 0 24px" }}>Hãy chọn một sản phẩm ROG để bắt đầu.</p>
              <Link
                href="/vn/store"
                style={{ display: "inline-block", background: "#ff0036", color: "#fff", padding: "12px 28px", fontWeight: 800, textDecoration: "none", borderRadius: "2px", textTransform: "uppercase", letterSpacing: "1px" }}
              >
                Đến cửa hàng
              </Link>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 2fr) minmax(280px, 1fr)", gap: "24px", alignItems: "start" }}>
              <section style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {lines.map((line) => (
                  <article
                    key={`${line.slug}::${line.selectedSpecs ?? ""}`}
                    style={{ display: "grid", gridTemplateColumns: "96px minmax(0, 1fr) auto", gap: "16px", background: "#111116", border: "1px solid #26262e", borderRadius: "6px", padding: "16px" }}
                  >
                    <Link href={line.href}>
                      <img src={line.image} alt={line.name} style={{ width: "96px", height: "96px", objectFit: "contain", background: "#0b0b0e", borderRadius: "4px" }} />
                    </Link>
                    <div style={{ minWidth: 0 }}>
                      <Link href={line.href} style={{ color: "#fff", fontWeight: 800, textDecoration: "none", fontSize: "15px" }}>
                        {line.name}
                      </Link>
                      {line.selectedSpecs && (
                        <p style={{ color: "#888", fontSize: "12px", lineHeight: 1.5, margin: "6px 0 0" }}>{line.selectedSpecs}</p>
                      )}
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "12px" }}>
                        <div style={{ display: "flex", alignItems: "center", border: "1px solid #333", borderRadius: "2px" }}>
                          <button type="button" aria-label="Giảm số lượng" onClick={() => setQuantity(line.slug, line.quantity - 1, line.selectedSpecs)} style={{ width: "32px", height: "30px", background: "transparent", color: "#fff", border: "none", cursor: "pointer", fontSize: "16px" }}>−</button>
                          <span style={{ width: "34px", textAlign: "center", fontSize: "13px" }}>{line.quantity}</span>
                          <button type="button" aria-label="Tăng số lượng" onClick={() => setQuantity(line.slug, line.quantity + 1, line.selectedSpecs)} style={{ width: "32px", height: "30px", background: "transparent", color: "#fff", border: "none", cursor: "pointer", fontSize: "16px" }}>+</button>
                        </div>
                        <button type="button" onClick={() => removeLine(line.slug, line.selectedSpecs)} style={{ background: "transparent", color: "#ff6b81", border: "none", cursor: "pointer", fontSize: "12px" }}>
                          Xóa
                        </button>
                      </div>
                    </div>
                    <div style={{ textAlign: "right", fontWeight: 800, color: "#ff0036", whiteSpace: "nowrap" }}>
                      {formatVnd(line.price * line.quantity)}
                    </div>
                  </article>
                ))}
                <button type="button" onClick={clear} style={{ alignSelf: "flex-start", background: "transparent", color: "#888", border: "1px solid #333", padding: "8px 14px", borderRadius: "2px", cursor: "pointer", fontSize: "12px" }}>
                  Xóa toàn bộ giỏ hàng
                </button>
              </section>

              <aside style={{ background: "#111116", border: "1px solid #26262e", borderRadius: "6px", padding: "20px", position: "sticky", top: "24px" }}>
                <h2 style={{ fontSize: "15px", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 16px" }}>Tóm tắt đơn hàng</h2>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#aaa", fontSize: "13px", marginBottom: "8px" }}>
                  <span>Số lượng</span><span>{count} sản phẩm</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#aaa", fontSize: "13px", marginBottom: "8px" }}>
                  <span>Tạm tính</span><span>{formatVnd(subtotal)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#aaa", fontSize: "13px", marginBottom: "16px" }}>
                  <span>Phí vận chuyển</span><span style={{ color: "#5ddb8a" }}>Miễn phí</span>
                </div>
                <div style={{ borderTop: "1px solid #26262e", paddingTop: "14px", display: "flex", justifyContent: "space-between", fontWeight: 900, fontSize: "18px" }}>
                  <span>Tổng cộng</span><span style={{ color: "#ff0036" }}>{formatVnd(subtotal)}</span>
                </div>
                <Link
                  href="/vn/checkout"
                  style={{ display: "block", textAlign: "center", marginTop: "18px", background: "#ff0036", color: "#fff", padding: "14px", fontWeight: 800, textDecoration: "none", borderRadius: "2px", textTransform: "uppercase", letterSpacing: "1px" }}
                >
                  Tiến hành thanh toán
                </Link>
                <p style={{ color: "#666", fontSize: "11px", lineHeight: 1.6, margin: "14px 0 0" }}>
                  Thanh toán khi nhận hàng (COD). Đơn hàng sẽ được xác nhận qua điện thoại.
                </p>
              </aside>
            </div>
          )}
        </div>
      </main>
      <RogFooter />
      <RogChatWidget />
    </div>
  );
}
