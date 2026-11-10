import type { Metadata } from "next";
import Link from "next/link";
import RogNavbar from "@/components/sites/rog-asus/RogNavbar";
import RogPromoBar from "@/components/sites/rog-asus/RogPromoBar";
import RogFooter from "@/components/sites/rog-asus/RogFooter";

export const metadata: Metadata = {
  title: "Quy Chế Pháp Lý & Chính Sách Bảo Mật｜ROG - Republic of Gamers｜Việt Nam",
  description:
    "Chính sách bảo vệ quyền riêng tư và xử lý dữ liệu cá nhân của ASUS ROG Việt Nam.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="rog-page">
      <RogNavbar />
      <RogPromoBar />

      <main style={{ background: "#0a0a0c", color: "#fff", padding: "80px 24px" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <div style={{ marginBottom: "24px", fontSize: "13px", color: "#888" }}>
            <Link href="/" style={{ color: "#aaa", textDecoration: "none" }}>Trang chủ</Link>
            <span> › </span>
            <span style={{ color: "#ff0036" }}>Quy chế pháp lý</span>
          </div>

          <span style={{ color: "#ff0036", fontSize: "12px", fontWeight: 800, letterSpacing: "2px" }}>
            {"// LEGAL NOTICE & PRIVACY POLICY"}
          </span>
          <h1 style={{ fontSize: "36px", fontWeight: 900, margin: "12px 0 24px" }}>
            CHÍNH SÁCH BẢO MẬT THÔNG TIN
          </h1>
          <p style={{ color: "#888", fontSize: "13px", marginBottom: "32px" }}>
            Cập nhật lần cuối: Tháng 01/2026 · Công Ty TNHH Công Nghệ Asus (Việt Nam)
          </p>

          <div style={{ color: "#bbb", fontSize: "15px", lineHeight: 1.8, display: "flex", flexDirection: "column", gap: "24px" }}>
            <section>
              <h2 style={{ color: "#fff", fontSize: "20px", fontWeight: 700, marginBottom: "12px" }}>
                1. Cam kết bảo vệ quyền riêng tư của khách hàng
              </h2>
              <p>
                ASUSTeK Computer Inc. và các công ty trực thuộc (“ASUS”) tôn trọng và cam kết bảo vệ quyền riêng tư
                của người sử dụng. Chính sách Bảo mật này mô tả cách thức chúng tôi thu thập, sử dụng, lưu trữ
                và bảo vệ thông tin cá nhân của bạn khi bạn truy cập trang web rog.asus.com hoặc sử dụng các dịch vụ trực tuyến của ROG.
              </p>
            </section>

            <section>
              <h2 style={{ color: "#fff", fontSize: "20px", fontWeight: 700, marginBottom: "12px" }}>
                2. Dữ liệu chúng tôi thu thập
              </h2>
              <p>
                Khi bạn đăng ký tài khoản ROG ID, kích hoạt bảo hành sản phẩm hoặc tham gia chương trình ROG Elite Rewards,
                chúng tôi có thể thu thập: Họ tên, số điện thoại, địa chỉ email, số Serial Number của thiết bị và thông tin cấu hình phần cứng.
              </p>
            </section>

            <section>
              <h2 style={{ color: "#fff", fontSize: "20px", fontWeight: 700, marginBottom: "12px" }}>
                3. Mục đích sử dụng dữ liệu
              </h2>
              <p>
                Dữ liệu cá nhân chỉ được sử dụng nhằm mục đích: Cung cấp dịch vụ bảo hành chính hãng, hỗ trợ kỹ thuật trực tuyến,
                gửi thông báo cập nhật phần mềm Armoury Crate / BIOS, và trao thưởng các giải đấu esports do ROG tổ chức.
              </p>
            </section>

            <section>
              <h2 style={{ color: "#fff", fontSize: "20px", fontWeight: 700, marginBottom: "12px" }}>
                4. Liên hệ bộ phận bảo mật dữ liệu
              </h2>
              <p>
                Mọi thắc mắc liên quan đến quyền bảo vệ dữ liệu cá nhân, vui lòng liên hệ:
                <br />
                Công Ty TNHH Công Nghệ Asus (Việt Nam) — 285 Cách Mạng Tháng Tám, Phường 12, Quận 10, TP. Hồ Chí Minh.
                <br />
                Hotline miễn phí: <strong>1800 65 88</strong>
              </p>
            </section>
          </div>
        </div>
      </main>

      <RogFooter />
    </div>
  );
}
