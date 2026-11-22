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

export default function CustomerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const auth = await RogApi.customerLogin(email.trim(), password);
      saveCustomerAuth(auth);
      router.push("/vn/account");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng nhập thất bại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rog-page">
      <RogNavbar />
      <RogPromoBar />
      <main style={{ background: "#0a0a0c", color: "#fff", minHeight: "70vh", padding: "70px 24px 110px" }}>
        <div style={{ maxWidth: "460px", margin: "0 auto", background: "#111116", border: "1px solid #26262e", borderRadius: "6px", padding: "32px" }}>
          <span style={{ color: "#ff0036", fontSize: "11px", fontWeight: 800, letterSpacing: "2px" }}>{"// ROG ELITE MEMBER"}</span>
          <h1 style={{ fontSize: "24px", fontWeight: 900, margin: "8px 0 20px", textTransform: "uppercase" }}>Đăng nhập</h1>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label htmlFor="email" style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#aaa", marginBottom: "6px" }}>Email</label>
              <input id="email" type="email" required autoComplete="email" style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" />
            </div>
            <div>
              <label htmlFor="password" style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#aaa", marginBottom: "6px" }}>Mật khẩu</label>
              <input id="password" type="password" required autoComplete="current-password" style={inputStyle} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>

            {error && (
              <div role="alert" style={{ background: "#20040a", border: "1px solid #ff0036", color: "#ff809b", padding: "10px 12px", fontSize: "13px", borderRadius: "2px" }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={submitting} style={{ background: submitting ? "#7a1b2c" : "#ff0036", color: "#fff", border: "none", padding: "14px", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", fontSize: "13px", borderRadius: "2px", cursor: submitting ? "wait" : "pointer" }}>
              {submitting ? "Đang đăng nhập…" : "Đăng nhập"}
            </button>
          </form>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "18px", fontSize: "13px" }}>
            <Link href="/vn/account/forgot" style={{ color: "#aaa", textDecoration: "none" }}>Quên mật khẩu?</Link>
            <Link href="/vn/account/register" style={{ color: "#ff0036", fontWeight: 700, textDecoration: "none" }}>Đăng ký thành viên →</Link>
          </div>
        </div>
      </main>
      <RogFooter />
      <RogChatWidget />
    </div>
  );
}
