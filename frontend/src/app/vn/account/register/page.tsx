"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import RogNavbar from "@/components/sites/rog-asus/RogNavbar";
import RogPromoBar from "@/components/sites/rog-asus/RogPromoBar";
import RogFooter from "@/components/sites/rog-asus/RogFooter";
import RogChatWidget from "@/components/sites/rog-asus/RogChatWidget";
import { RogApi, saveCustomerAuth } from "@/lib/api-client";

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
} as const;

export default function CustomerRegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const update = (field: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const auth = await RogApi.customerRegister({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phoneNumber: form.phoneNumber.trim(),
        password: form.password,
      });
      saveCustomerAuth(auth);
      router.push("/vn/account");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng ký thất bại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rog-page">
      <RogNavbar />
      <RogPromoBar />
      <main style={{ background: "#0a0a0c", color: "#fff", minHeight: "70vh", padding: "70px 24px 110px" }}>
        <div style={{ maxWidth: "500px", margin: "0 auto", background: "#111116", border: "1px solid #26262e", borderRadius: "6px", padding: "32px" }}>
          <span style={{ color: "#ff0036", fontSize: "11px", fontWeight: 800, letterSpacing: "2px" }}>{"// ROG ELITE MEMBER"}</span>
          <h1 style={{ fontSize: "24px", fontWeight: 900, margin: "8px 0 6px", textTransform: "uppercase" }}>Đăng ký thành viên</h1>
          <p style={{ color: "#888", fontSize: "13px", margin: "0 0 20px" }}>
            Nhận 100 điểm chào mừng, theo dõi đơn hàng và đặc quyền ROG Elite.
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label htmlFor="fullName" style={labelStyle}>Họ và tên</label>
              <input id="fullName" required style={inputStyle} value={form.fullName} onChange={(e) => update("fullName", e.target.value)} placeholder="Nguyễn Văn A" />
            </div>
            <div>
              <label htmlFor="email" style={labelStyle}>Email</label>
              <input id="email" type="email" required autoComplete="email" style={inputStyle} value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="email@example.com" />
            </div>
            <div>
              <label htmlFor="phoneNumber" style={labelStyle}>Số điện thoại</label>
              <input id="phoneNumber" required style={inputStyle} value={form.phoneNumber} onChange={(e) => update("phoneNumber", e.target.value)} placeholder="0901234567" />
            </div>
            <div>
              <label htmlFor="password" style={labelStyle}>Mật khẩu (tối thiểu 6 ký tự)</label>
              <input id="password" type="password" required minLength={6} autoComplete="new-password" style={inputStyle} value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="••••••••" />
            </div>
            <div>
              <label htmlFor="confirmPassword" style={labelStyle}>Xác nhận mật khẩu</label>
              <input id="confirmPassword" type="password" required minLength={6} autoComplete="new-password" style={inputStyle} value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} placeholder="••••••••" />
            </div>

            {error && (
              <div role="alert" style={{ background: "#20040a", border: "1px solid #ff0036", color: "#ff809b", padding: "10px 12px", fontSize: "13px", borderRadius: "2px" }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={submitting} style={{ background: submitting ? "#7a1b2c" : "#ff0036", color: "#fff", border: "none", padding: "14px", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", fontSize: "13px", borderRadius: "2px", cursor: submitting ? "wait" : "pointer" }}>
              {submitting ? "Đang tạo tài khoản…" : "Tạo tài khoản"}
            </button>
          </form>

          <p style={{ margin: "18px 0 0", fontSize: "13px", color: "#888", textAlign: "center" }}>
            Đã có tài khoản?{" "}
            <Link href="/vn/account/login" style={{ color: "#ff0036", fontWeight: 700, textDecoration: "none" }}>Đăng nhập</Link>
          </p>
        </div>
      </main>
      <RogFooter />
      <RogChatWidget />
    </div>
  );
}
