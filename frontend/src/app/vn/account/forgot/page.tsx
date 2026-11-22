import Link from "next/link";
import type { Metadata } from "next";
import RogNavbar from "@/components/sites/rog-asus/RogNavbar";
import RogPromoBar from "@/components/sites/rog-asus/RogPromoBar";
import RogFooter from "@/components/sites/rog-asus/RogFooter";
import RogChatWidget from "@/components/sites/rog-asus/RogChatWidget";
import { fetchSiteConfig } from "@/lib/rogBackend";

export const metadata: Metadata = {
  title: "Quên mật khẩu | ROG Elite Việt Nam",
};

export default async function ForgotPasswordPage() {
  const config = await fetchSiteConfig();
  const phone = config?.footer?.company?.phone || "1800 65 88";
  const cleanPhone = phone.replace(/[^0-9+]/g, "");

  return (
    <div className="rog-page">
      <RogNavbar />
      <RogPromoBar />
      <main style={{ background: "#0a0a0c", color: "#fff", minHeight: "70vh", padding: "70px 24px 110px" }}>
        <div style={{ maxWidth: "520px", margin: "0 auto", background: "#111116", border: "1px solid #26262e", borderRadius: "6px", padding: "32px" }}>
          <span style={{ color: "#ff0036", fontSize: "11px", fontWeight: 800, letterSpacing: "2px" }}>{"// ROG ELITE MEMBER"}</span>
          <h1 style={{ fontSize: "24px", fontWeight: 900, margin: "8px 0 12px", textTransform: "uppercase" }}>Quên mật khẩu</h1>
          <p style={{ color: "#aaa", lineHeight: 1.7, marginTop: 0 }}>
            Để bảo mật tài khoản, vui lòng liên hệ bộ phận hỗ trợ ROG Việt Nam để được đặt lại mật khẩu.
          </p>
          <div style={{ background: "#181820", border: "1px solid #2a2a33", borderRadius: "4px", padding: "16px", margin: "18px 0" }}>
            <div style={{ color: "#888", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>Hotline hỗ trợ</div>
            <a href={`tel:${cleanPhone}`} style={{ color: "#ff0036", fontSize: "22px", fontWeight: 900, textDecoration: "none" }}>{phone}</a>
            <div style={{ color: "#888", fontSize: "12px", marginTop: "4px" }}>Thứ 2 – Thứ 7, 08:00 – 18:00</div>
          </div>
          <p style={{ color: "#888", fontSize: "13px", lineHeight: 1.7 }}>
            Hoặc gửi email tới <a href="mailto:support@asus.com.vn" style={{ color: "#ff0036" }}>support@asus.com.vn</a> kèm email đăng ký và số điện thoại.
          </p>
          <Link href="/vn/account/login" style={{ display: "inline-block", marginTop: "10px", color: "#ff0036", fontWeight: 700, textDecoration: "none" }}>
            ← Quay lại đăng nhập
          </Link>
        </div>
      </main>
      <RogFooter />
      <RogChatWidget />
    </div>
  );
}
