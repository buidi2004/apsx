"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import RogNavbar from "@/components/sites/rog-asus/RogNavbar";
import RogPromoBar from "@/components/sites/rog-asus/RogPromoBar";
import RogFooter from "@/components/sites/rog-asus/RogFooter";
import RogChatWidget from "@/components/sites/rog-asus/RogChatWidget";
import { formatVnd } from "@/lib/cart";
import { RogApi, type OrderDto } from "@/lib/api-client";

export default function OrderDetailPage() {
  const params = useParams<{ code: string }>();
  const code = decodeURIComponent(params?.code ?? "");
  const [order, setOrder] = useState<OrderDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const handleCancelOrder = async () => {
    if (!order) return;
    if (!window.confirm(`Bạn có chắc chắn muốn hủy đơn hàng ${order.orderCode}?`)) return;
    try {
      setCancelling(true);
      await RogApi.cancelOrder(order.orderCode);
      setOrder((prev) => (prev ? { ...prev, status: "Cancelled", statusText: "Đã hủy" } : null));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Hủy đơn hàng thất bại.");
    } finally {
      setCancelling(false);
    }
  };

  useEffect(() => {
    if (!code) return;
    let cancelled = false;
    setLoading(true);
    RogApi.getOrder(code)
      .then((data) => {
        if (!cancelled) setOrder(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Không tìm thấy đơn hàng.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [code]);

  return (
    <div className="rog-page">
      <RogNavbar />
      <RogPromoBar />
      <main style={{ background: "#0a0a0c", color: "#fff", minHeight: "70vh", padding: "60px 24px 100px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          {loading ? (
            <p style={{ color: "#888" }}>Đang tải đơn hàng…</p>
          ) : error || !order ? (
            <div style={{ background: "#111116", border: "1px solid #26262e", borderRadius: "6px", padding: "48px 24px", textAlign: "center" }}>
              <h1 style={{ fontSize: "22px", margin: "0 0 8px" }}>Không tìm thấy đơn hàng</h1>
              <p style={{ color: "#888" }}>{error ?? `Mã đơn ${code} không tồn tại.`}</p>
              <Link href="/vn/store" style={{ color: "#ff0036", fontWeight: 700, textDecoration: "none" }}>
                ← Về cửa hàng
              </Link>
            </div>
          ) : (
            <>
              <div style={{ background: "linear-gradient(135deg, #1c0409 0%, #111116 70%)", border: "1px solid #ff0036", borderRadius: "6px", padding: "28px", marginBottom: "20px" }}>
                <div style={{ color: "#5ddb8a", fontWeight: 800, fontSize: "13px", letterSpacing: "2px", textTransform: "uppercase" }}>
                  ✓ Đặt hàng thành công
                </div>
                <h1 style={{ fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 900, margin: "8px 0" }}>
                  Mã đơn: <span style={{ color: "#ff0036" }}>{order.orderCode}</span>
                </h1>
                <p style={{ color: "#aaa", margin: 0, lineHeight: 1.6 }}>
                  Cảm ơn {order.customerName}! Chúng tôi sẽ gọi xác nhận tới số {order.phone} trong thời gian sớm nhất.
                </p>
                <div style={{ marginTop: "14px", display: "inline-block", background: "#2a0a10", border: "1px solid #ff0036", color: "#ff809b", fontSize: "12px", fontWeight: 700, padding: "4px 10px", borderRadius: "2px" }}>
                  Trạng thái: {order.statusText}
                </div>
              </div>

              <section style={{ background: "#111116", border: "1px solid #26262e", borderRadius: "6px", padding: "24px", marginBottom: "20px" }}>
                <h2 style={{ fontSize: "15px", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 16px" }}>Sản phẩm</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {order.items.map((item, index) => (
                    <div key={`${item.productSlug}-${index}`} style={{ display: "flex", justifyContent: "space-between", gap: "16px", borderBottom: index < order.items.length - 1 ? "1px solid #222" : "none", paddingBottom: index < order.items.length - 1 ? "12px" : 0 }}>
                      <div>
                        <div style={{ fontWeight: 700 }}>{item.productName}</div>
                        {item.selectedSpecs && <div style={{ color: "#888", fontSize: "12px", marginTop: "4px" }}>{item.selectedSpecs}</div>}
                        <div style={{ color: "#888", fontSize: "12px", marginTop: "4px" }}>
                          {formatVnd(item.unitPrice)} × {item.quantity}
                        </div>
                      </div>
                      <div style={{ fontWeight: 800, whiteSpace: "nowrap" }}>{formatVnd(item.lineTotal)}</div>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: "1px solid #26262e", marginTop: "18px", paddingTop: "14px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", color: "#aaa" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span>Tạm tính</span><span>{formatVnd(order.subtotal)}</span></div>
                  {order.discountAmount && order.discountAmount > 0 ? (
                    <div style={{ display: "flex", justifyContent: "space-between", color: "#5ddb8a" }}>
                      <span>Mã ưu đãi {order.couponCode ? `(${order.couponCode})` : ""}</span>
                      <span>-{formatVnd(order.discountAmount)}</span>
                    </div>
                  ) : null}
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span>Vận chuyển</span><span>{order.shippingFee === 0 ? "Miễn phí" : formatVnd(order.shippingFee)}</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#fff", fontWeight: 900, fontSize: "18px" }}><span>Tổng cộng</span><span style={{ color: "#ff0036" }}>{formatVnd(order.total)}</span></div>
                </div>
              </section>

              <section style={{ background: "#111116", border: "1px solid #26262e", borderRadius: "6px", padding: "24px" }}>
                <h2 style={{ fontSize: "15px", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 12px" }}>Thông tin giao hàng</h2>
                <p style={{ margin: "0 0 6px", color: "#ccc" }}>{order.customerName} · {order.phone}</p>
                <p style={{ margin: "0 0 6px", color: "#ccc" }}>{order.email}</p>
                <p style={{ margin: 0, color: "#aaa", lineHeight: 1.6 }}>{order.address}</p>
                {order.note && <p style={{ margin: "10px 0 0", color: "#888", fontStyle: "italic" }}>Ghi chú: {order.note}</p>}
                {(order.shippingCarrier || order.trackingNumber) && (
                  <div style={{ marginTop: "14px", padding: "12px", background: "#181824", border: "1px solid #333348", borderRadius: "4px" }}>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>
                      📦 Thông tin vận chuyển
                    </div>
                    {order.shippingCarrier && <div style={{ color: "#fff", fontSize: "13px" }}>Đơn vị vận chuyển: <strong>{order.shippingCarrier}</strong></div>}
                    {order.trackingNumber && <div style={{ color: "#ff809b", fontSize: "13px", marginTop: "2px" }}>Mã vận đơn: <strong>{order.trackingNumber}</strong></div>}
                  </div>
                )}
              </section>

              <div style={{ display: "flex", gap: "12px", marginTop: "20px", flexWrap: "wrap", alignItems: "center" }}>
                <Link href="/vn/store" style={{ background: "#ff0036", color: "#fff", padding: "12px 22px", fontWeight: 800, textDecoration: "none", borderRadius: "2px", textTransform: "uppercase", letterSpacing: "1px", fontSize: "12px" }}>
                  Tiếp tục mua sắm
                </Link>
                <Link href="/vn/account" style={{ border: "1px solid #444", color: "#ddd", padding: "12px 22px", fontWeight: 800, textDecoration: "none", borderRadius: "2px", textTransform: "uppercase", letterSpacing: "1px", fontSize: "12px" }}>
                  Tài khoản của tôi
                </Link>
                {order.status === "Pending" && (
                  <button
                    type="button"
                    onClick={handleCancelOrder}
                    disabled={cancelling}
                    style={{
                      background: "transparent",
                      border: "1px solid #ef4444",
                      color: "#ef4444",
                      padding: "11px 20px",
                      fontWeight: 800,
                      cursor: cancelling ? "not-allowed" : "pointer",
                      borderRadius: "2px",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      fontSize: "12px",
                      marginLeft: "auto",
                      opacity: cancelling ? 0.6 : 1,
                    }}
                  >
                    {cancelling ? "Đang hủy…" : "✕ Hủy đơn hàng"}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </main>
      <RogFooter />
      <RogChatWidget />
    </div>
  );
}
