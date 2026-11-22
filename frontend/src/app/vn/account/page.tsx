"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RogNavbar from "@/components/sites/rog-asus/RogNavbar";
import RogPromoBar from "@/components/sites/rog-asus/RogPromoBar";
import RogFooter from "@/components/sites/rog-asus/RogFooter";
import RogChatWidget from "@/components/sites/rog-asus/RogChatWidget";
import { formatVnd } from "@/lib/cart";
import {
  clearCustomerAuth,
  getCustomerToken,
  RogApi,
  type CustomerProfileDto,
  type OrderDto,
} from "@/lib/api-client";

export default function AccountPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<CustomerProfileDto | null>(null);
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit profile state
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [fullNameInput, setFullNameInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ text: string; ok: boolean } | null>(null);

  // Change password state
  const [showChangePwd, setShowChangePwd] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdMsg, setPwdMsg] = useState<{ text: string; ok: boolean } | null>(null);

  useEffect(() => {
    if (!getCustomerToken()) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    Promise.all([RogApi.getCustomerMe(), RogApi.getMyOrders()])
      .then(([me, myOrders]) => {
        if (cancelled) return;
        setProfile(me);
        setFullNameInput(me.fullName);
        setPhoneInput(me.phoneNumber);
        setOrders(myOrders);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Không tải được tài khoản.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullNameInput.trim()) {
      setProfileMsg({ text: "Họ tên không được để trống.", ok: false });
      return;
    }
    try {
      setProfileSaving(true);
      setProfileMsg(null);
      const updated = await RogApi.updateCustomerProfile({
        fullName: fullNameInput.trim(),
        phoneNumber: phoneInput.trim(),
      });
      setProfile(updated);
      setProfileMsg({ text: "Cập nhật thông tin thành công!", ok: true });
      setTimeout(() => setShowEditProfile(false), 1500);
    } catch (err) {
      setProfileMsg({ text: err instanceof Error ? err.message : "Lỗi khi cập nhật.", ok: false });
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      setPwdMsg({ text: "Vui lòng nhập đầy đủ mật khẩu.", ok: false });
      return;
    }
    if (newPassword.length < 6) {
      setPwdMsg({ text: "Mật khẩu mới phải từ 6 ký tự trở lên.", ok: false });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdMsg({ text: "Mật khẩu xác nhận không khớp.", ok: false });
      return;
    }
    try {
      setPwdSaving(true);
      setPwdMsg(null);
      await RogApi.changeCustomerPassword({ oldPassword, newPassword });
      setPwdMsg({ text: "Đổi mật khẩu thành công!", ok: true });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setShowChangePwd(false), 1500);
    } catch (err) {
      setPwdMsg({ text: err instanceof Error ? err.message : "Đổi mật khẩu thất bại.", ok: false });
    } finally {
      setPwdSaving(false);
    }
  };

  const logout = () => {
    clearCustomerAuth();
    router.push("/vn/account/login");
  };

  return (
    <div className="rog-page">
      <RogNavbar />
      <RogPromoBar />
      <main style={{ background: "#0a0a0c", color: "#fff", minHeight: "70vh", padding: "60px 24px 100px" }}>
        <div style={{ maxWidth: "980px", margin: "0 auto" }}>
          <div style={{ marginBottom: "24px" }}>
            <span style={{ color: "#ff0036", fontSize: "12px", fontWeight: 800, letterSpacing: "3px" }}>
              {"// ROG ELITE MEMBER"}
            </span>
            <h1 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 900, margin: "8px 0 0", textTransform: "uppercase" }}>
              Tài khoản của tôi
            </h1>
          </div>

          {loading ? (
            <p style={{ color: "#888" }}>Đang tải tài khoản…</p>
          ) : !getCustomerToken() ? (
            <div style={{ background: "#111116", border: "1px solid #26262e", borderRadius: "6px", padding: "48px 24px", textAlign: "center" }}>
              <h2 style={{ fontSize: "20px", margin: "0 0 8px" }}>Bạn chưa đăng nhập</h2>
              <p style={{ color: "#888", margin: "0 0 22px" }}>Đăng nhập để xem điểm thưởng và lịch sử đơn hàng.</p>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/vn/account/login" style={{ background: "#ff0036", color: "#fff", padding: "12px 24px", fontWeight: 800, textDecoration: "none", borderRadius: "2px", textTransform: "uppercase", fontSize: "12px" }}>
                  Đăng nhập
                </Link>
                <Link href="/vn/account/register" style={{ border: "1px solid #444", color: "#ddd", padding: "12px 24px", fontWeight: 800, textDecoration: "none", borderRadius: "2px", textTransform: "uppercase", fontSize: "12px" }}>
                  Đăng ký
                </Link>
              </div>
            </div>
          ) : error ? (
            <div style={{ background: "#20040a", border: "1px solid #ff0036", color: "#ff809b", padding: "16px", borderRadius: "4px" }}>
              {error}
              <button type="button" onClick={logout} style={{ marginLeft: "12px", background: "transparent", color: "#fff", border: "1px solid #666", padding: "6px 12px", cursor: "pointer", borderRadius: "2px" }}>
                Đăng xuất
              </button>
            </div>
          ) : profile ? (
            <>
              <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
                <div style={{ background: "#111116", border: "1px solid #26262e", borderRadius: "6px", padding: "20px" }}>
                  <div style={{ color: "#888", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>Thành viên</div>
                  <div style={{ fontSize: "20px", fontWeight: 900, marginTop: "6px" }}>{profile.fullName}</div>
                  <div style={{ color: "#aaa", fontSize: "13px", marginTop: "2px" }}>{profile.email}</div>
                  <div style={{ color: "#888", fontSize: "12px", marginTop: "4px" }}>{profile.phoneNumber || "Chưa cập nhật SĐT"}</div>
                  <div style={{ display: "flex", gap: "8px", marginTop: "12px", flexWrap: "wrap" }}>
                    <button
                      type="button"
                      onClick={() => { setShowEditProfile(!showEditProfile); setShowChangePwd(false); }}
                      style={{ background: "#222", border: "1px solid #444", color: "#eee", fontSize: "11px", fontWeight: 700, padding: "4px 8px", cursor: "pointer", borderRadius: "2px" }}
                    >
                      {showEditProfile ? "Đóng" : "Sửa thông tin"}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowChangePwd(!showChangePwd); setShowEditProfile(false); }}
                      style={{ background: "#222", border: "1px solid #444", color: "#eee", fontSize: "11px", fontWeight: 700, padding: "4px 8px", cursor: "pointer", borderRadius: "2px" }}
                    >
                      {showChangePwd ? "Đóng" : "Đổi mật khẩu"}
                    </button>
                  </div>
                </div>
                <div style={{ background: "#111116", border: "1px solid #26262e", borderRadius: "6px", padding: "20px" }}>
                  <div style={{ color: "#888", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>Hạng ROG Elite</div>
                  <div style={{ fontSize: "20px", fontWeight: 900, marginTop: "6px", color: "#ff0036" }}>{profile.tier}</div>
                  <div style={{ color: "#aaa", fontSize: "13px", marginTop: "4px" }}>{profile.points} điểm thưởng</div>
                </div>
                <div style={{ background: "#111116", border: "1px solid #26262e", borderRadius: "6px", padding: "20px" }}>
                  <div style={{ color: "#888", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>Đơn hàng</div>
                  <div style={{ fontSize: "20px", fontWeight: 900, marginTop: "6px" }}>{profile.orderCount}</div>
                  <button type="button" onClick={logout} style={{ marginTop: "10px", background: "transparent", color: "#ff809b", border: "1px solid #444", padding: "6px 12px", cursor: "pointer", borderRadius: "2px", fontSize: "12px" }}>
                    Đăng xuất
                  </button>
                </div>
              </section>

              {showEditProfile && (
                <section style={{ background: "#15151c", border: "1px solid #333", borderRadius: "6px", padding: "20px", marginBottom: "24px" }}>
                  <h3 style={{ fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 12px", color: "#ff0036" }}>Chỉnh sửa thông tin cá nhân</h3>
                  <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "400px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", color: "#888", marginBottom: "4px" }}>Họ và tên</label>
                      <input
                        type="text"
                        value={fullNameInput}
                        onChange={(e) => setFullNameInput(e.target.value)}
                        required
                        style={{ width: "100%", background: "#0a0a0c", border: "1px solid #333", color: "#fff", padding: "8px 10px", borderRadius: "4px", fontSize: "13px" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", color: "#888", marginBottom: "4px" }}>Số điện thoại</label>
                      <input
                        type="tel"
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        placeholder="09xxxxxxxx"
                        style={{ width: "100%", background: "#0a0a0c", border: "1px solid #333", color: "#fff", padding: "8px 10px", borderRadius: "4px", fontSize: "13px" }}
                      />
                    </div>
                    {profileMsg && (
                      <div style={{ color: profileMsg.ok ? "#4ade80" : "#ef4444", fontSize: "12px" }}>{profileMsg.text}</div>
                    )}
                    <button
                      type="submit"
                      disabled={profileSaving}
                      style={{ alignSelf: "flex-start", background: "#ff0036", color: "#fff", border: "none", padding: "8px 18px", fontWeight: 700, borderRadius: "2px", cursor: profileSaving ? "not-allowed" : "pointer", fontSize: "12px" }}
                    >
                      {profileSaving ? "Đang lưu…" : "Lưu thay đổi"}
                    </button>
                  </form>
                </section>
              )}

              {showChangePwd && (
                <section style={{ background: "#15151c", border: "1px solid #333", borderRadius: "6px", padding: "20px", marginBottom: "24px" }}>
                  <h3 style={{ fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 12px", color: "#ff0036" }}>Đổi mật khẩu tài khoản</h3>
                  <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "400px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", color: "#888", marginBottom: "4px" }}>Mật khẩu hiện tại</label>
                      <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                        style={{ width: "100%", background: "#0a0a0c", border: "1px solid #333", color: "#fff", padding: "8px 10px", borderRadius: "4px", fontSize: "13px" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", color: "#888", marginBottom: "4px" }}>Mật khẩu mới (tối thiểu 6 ký tự)</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        style={{ width: "100%", background: "#0a0a0c", border: "1px solid #333", color: "#fff", padding: "8px 10px", borderRadius: "4px", fontSize: "13px" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", color: "#888", marginBottom: "4px" }}>Xác nhận mật khẩu mới</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        style={{ width: "100%", background: "#0a0a0c", border: "1px solid #333", color: "#fff", padding: "8px 10px", borderRadius: "4px", fontSize: "13px" }}
                      />
                    </div>
                    {pwdMsg && (
                      <div style={{ color: pwdMsg.ok ? "#4ade80" : "#ef4444", fontSize: "12px" }}>{pwdMsg.text}</div>
                    )}
                    <button
                      type="submit"
                      disabled={pwdSaving}
                      style={{ alignSelf: "flex-start", background: "#ff0036", color: "#fff", border: "none", padding: "8px 18px", fontWeight: 700, borderRadius: "2px", cursor: pwdSaving ? "not-allowed" : "pointer", fontSize: "12px" }}
                    >
                      {pwdSaving ? "Đang đổi…" : "Cập nhật mật khẩu"}
                    </button>
                  </form>
                </section>
              )}

              <section style={{ background: "#111116", border: "1px solid #26262e", borderRadius: "6px", padding: "24px" }}>
                <h2 style={{ fontSize: "15px", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 16px" }}>Lịch sử đơn hàng</h2>
                {orders.length === 0 ? (
                  <div style={{ color: "#888" }}>
                    Chưa có đơn hàng nào.{" "}
                    <Link href="/vn/store" style={{ color: "#ff0036", textDecoration: "none" }}>Mua sắm ngay →</Link>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {orders.map((order) => (
                      <Link
                        key={order.orderCode}
                        href={`/vn/orders/${order.orderCode}`}
                        style={{ display: "flex", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", background: "#181820", border: "1px solid #2a2a33", borderRadius: "4px", padding: "14px 16px", color: "#fff", textDecoration: "none" }}
                      >
                        <div>
                          <div style={{ fontWeight: 800 }}>{order.orderCode}</div>
                          <div style={{ color: "#888", fontSize: "12px", marginTop: "4px" }}>
                            {new Date(order.createdAt).toLocaleString("vi-VN")} · {order.items.length} sản phẩm
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ color: "#ff0036", fontWeight: 800 }}>{formatVnd(order.total)}</div>
                          <div style={{ color: "#aaa", fontSize: "12px", marginTop: "4px" }}>{order.statusText}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </section>
            </>
          ) : null}
        </div>
      </main>
      <RogFooter />
      <RogChatWidget />
    </div>
  );
}
