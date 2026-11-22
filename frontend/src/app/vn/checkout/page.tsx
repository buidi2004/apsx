"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RogNavbar from "@/components/sites/rog-asus/RogNavbar";
import RogPromoBar from "@/components/sites/rog-asus/RogPromoBar";
import RogFooter from "@/components/sites/rog-asus/RogFooter";
import RogChatWidget from "@/components/sites/rog-asus/RogChatWidget";
import { formatVnd, useCart } from "@/lib/cart";
import { getCustomerUser, RogApi } from "@/lib/api-client";

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  background: "#181820",
  border: "1px solid #333",
  color: "#fff",
  borderRadius: "2px",
  fontSize: "14px",
  outline: "none",
} as const;

const labelStyle = {
  display: "block",
  fontSize: "12px",
  fontWeight: 700,
  color: "#aaa",
  marginBottom: "6px",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
} as const;

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, subtotal, ready, clear } = useCart();
  const [form, setForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    note: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = getCustomerUser();
    if (user) {
      setForm((prev) => ({
        ...prev,
        customerName: prev.customerName || user.fullName,
        email: prev.email || user.email,
        phone: prev.phone || user.phoneNumber,
      }));
    }
  }, []);

  const update = (field: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lines.length === 0) {
      setError("Giỏ hàng đang trống.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const order = await RogApi.createOrder({
        customerName: form.customerName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        note: form.note.trim() || undefined,
        items: lines.map((line) => ({
          slug: line.slug,
          quantity: line.quantity,
          selectedSpecs: line.selectedSpecs,
          name: line.name,
          unitPrice: line.price,
        })),
      });
      clear();
      router.push(`/vn/orders/${order.orderCode}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tạo đơn hàng. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rog-page">
      <RogNavbar />
      <RogPromoBar />
      <main style={{ background: "#0a0a0c", color: "#fff", minHeight: "70vh", padding: "60px 24px 100px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ marginBottom: "28px" }}>
            <span style={{ color: "#ff0036", fontSize: "12px", fontWeight: 800, letterSpacing: "3px" }}>
              {"// ROG OFFICIAL STORE"}
            </span>
            <h1 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 900, margin: "8px 0 0", textTransform: "uppercase" }}>
              Thanh toán
            </h1>
          </div>

          {ready && lines.length === 0 ? (
            <div style={{ background: "#111116", border: "1px solid #26262e", borderRadius: "6px", padding: "48px 24px", textAlign: "center" }}>
              <p style={{ color: "#aaa" }}>Giỏ hàng đang trống, chưa thể thanh toán.</p>
              <Link href="/vn/store" style={{ color: "#ff0036", fontWeight: 700, textDecoration: "none" }}>
                ← Quay lại cửa hàng
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "minmax(0, 2fr) minmax(280px, 1fr)", gap: "24px", alignItems: "start" }}>
              <section style={{ background: "#111116", border: "1px solid #26262e", borderRadius: "6px", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
                <h2 style={{ fontSize: "15px", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>Thông tin giao hàng</h2>

                <div>
                  <label style={labelStyle} htmlFor="customerName">Họ và tên *</label>
                  <input id="customerName" style={inputStyle} required value={form.customerName} onChange={(e) => update("customerName", e.target.value)} placeholder="Nguyễn Văn A" />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={labelStyle} htmlFor="email">Email *</label>
                    <input id="email" type="email" style={inputStyle} required value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="email@example.com" />
                  </div>
                  <div>
                    <label style={labelStyle} htmlFor="phone">Số điện thoại *</label>
                    <input id="phone" style={inputStyle} required value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="0901234567" />
                  </div>
                </div>

                <div>
                  <label style={labelStyle} htmlFor="address">Địa chỉ nhận hàng *</label>
                  <textarea id="address" style={{ ...inputStyle, minHeight: "76px", resize: "vertical" }} required value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố" />
                </div>

                <div>
                  <label style={labelStyle} htmlFor="note">Ghi chú (không bắt buộc)</label>
                  <textarea id="note" style={{ ...inputStyle, minHeight: "64px", resize: "vertical" }} value={form.note} onChange={(e) => update("note", e.target.value)} placeholder="Thời gian nhận hàng, yêu cầu xuất hóa đơn…" />
                </div>

                {error && (
                  <div role="alert" style={{ background: "#20040a", border: "1px solid #ff0036", color: "#ff809b", padding: "10px 14px", fontSize: "13px", borderRadius: "2px" }}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  style={{ background: submitting ? "#7a1b2c" : "#ff0036", color: "#fff", border: "none", padding: "14px", fontSize: "13px", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", borderRadius: "2px", cursor: submitting ? "wait" : "pointer" }}
                >
                  {submitting ? "Đang tạo đơn hàng…" : "Đặt hàng (COD)"}
                </button>
                <p style={{ color: "#666", fontSize: "11px", lineHeight: 1.6, margin: 0 }}>
                  Bằng việc đặt hàng, bạn đồng ý với chính sách bảo mật và điều khoản mua bán của ASUS ROG Việt Nam.
                </p>
              </section>

              <aside style={{ background: "#111116", border: "1px solid #26262e", borderRadius: "6px", padding: "20px", position: "sticky", top: "24px" }}>
                <h2 style={{ fontSize: "15px", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 16px" }}>Đơn hàng</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "340px", overflowY: "auto" }}>
                  {lines.map((line) => (
                    <div key={`${line.slug}::${line.selectedSpecs ?? ""}`} style={{ display: "flex", justifyContent: "space-between", gap: "12px", fontSize: "13px" }}>
                      <span style={{ color: "#ccc" }}>{line.name} <span style={{ color: "#777" }}>× {line.quantity}</span></span>
                      <span style={{ color: "#fff", whiteSpace: "nowrap" }}>{formatVnd(line.price * line.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: "1px solid #26262e", marginTop: "16px", paddingTop: "14px", display: "flex", justifyContent: "space-between", color: "#aaa", fontSize: "13px" }}>
                  <span>Tạm tính</span><span>{formatVnd(subtotal)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#aaa", fontSize: "13px", marginTop: "8px" }}>
                  <span>Vận chuyển</span><span style={{ color: "#5ddb8a" }}>Miễn phí</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 900, fontSize: "18px", marginTop: "14px" }}>
                  <span>Tổng</span><span style={{ color: "#ff0036" }}>{formatVnd(subtotal)}</span>
                </div>
                <Link href="/vn/cart" style={{ display: "block", marginTop: "14px", color: "#888", fontSize: "12px", textDecoration: "none" }}>
                  ← Sửa giỏ hàng
                </Link>
              </aside>
            </form>
          )}
        </div>
      </main>
      <RogFooter />
      <RogChatWidget />
    </div>
  );
}
