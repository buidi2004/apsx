import type { Metadata } from "next";
import Link from "next/link";
import RogNavbar from "@/components/sites/rog-asus/RogNavbar";
import RogPromoBar from "@/components/sites/rog-asus/RogPromoBar";
import RogFooter from "@/components/sites/rog-asus/RogFooter";

export const metadata: Metadata = {
  title: "Thông Tin Hợp Pháp & Điều Khoản Sử Dụng｜ROG - Republic of Gamers｜Việt Nam",
  description:
    "Điều khoản sử dụng website chính thức ASUS ROG Việt Nam và quyền sở hữu trí tuệ thương hiệu.",
};

export default function OfficialSiteTermsPage() {
  return (
    <div className="rog-page">
      <RogNavbar />
      <RogPromoBar />

      <main style={{ background: "#0a0a0c", color: "#fff", padding: "80px 24px" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <div style={{ marginBottom: "24px", fontSize: "13px", color: "#888" }}>
            <Link href="/" style={{ color: "#aaa", textDecoration: "none" }}>Trang chủ</Link>
            <span> › </span>
            <span style={{ color: "#ff0036" }}>Thông tin hợp pháp</span>
          </div>

          <span style={{ color: "#ff0036", fontSize: "12px", fontWeight: 800, letterSpacing: "2px" }}>
            {"// TERMS OF USE // OFFICIAL SITE"}
          </span>
          <h1 style={{ fontSize: "36px", fontWeight: 900, margin: "12px 0 24px" }}>
            ĐIỀU KHOẢN SỬ DỤNG TRANG WEB CHÍNH THỨC
          </h1>
          <p style={{ color: "#888", fontSize: "13px", marginBottom: "32px" }}>
            Bản quyền © 2026 ASUSTeK Computer Inc. Mọi quyền được bảo lưu.
          </p>

          <div style={{ color: "#bbb", fontSize: "15px", lineHeight: 1.8, display: "flex", flexDirection: "column", gap: "24px" }}>
            <section>
              <h2 style={{ color: "#fff", fontSize: "20px", fontWeight: 700, marginBottom: "12px" }}>
                1. Chấp nhận các điều khoản
              </h2>
              <p>
                Bằng việc truy cập, duyệt hoặc sử dụng trang web này, bạn xác nhận rằng bạn đã đọc, hiểu và đồng ý
                tuân theo các Điều khoản sử dụng này cùng toàn bộ các quy định pháp luật hiện hành của Nước Cộng hòa Xã hội Chủ nghĩa Việt Nam.
              </p>
            </section>

            <section>
              <h2 style={{ color: "#fff", fontSize: "20px", fontWeight: 700, marginBottom: "12px" }}>
                2. Quyền sở hữu trí tuệ
              </h2>
              <p>
                Toàn bộ nội dung trên trang web này, bao gồm logo mắt ROG, nhãn hiệu &quot;Republic of Gamers&quot;,
                slogan &quot;For Those Who Dare&quot;, hình ảnh, đồ họa, âm thanh, video, thiết kế giao diện và mã nguồn
                đều là tài sản sở hữu trí tuệ độc quyền của ASUSTeK Computer Inc. Mọi hành vi sao chép thương mại trái phép
                đều bị nghiêm cấm theo Luật Sở hữu trí tuệ.
              </p>
            </section>

            <section>
              <h2 style={{ color: "#fff", fontSize: "20px", fontWeight: 700, marginBottom: "12px" }}>
                3. Thông tin pháp lý doanh nghiệp
              </h2>
              <p>
                <strong>Công Ty TNHH Công Nghệ Asus (Việt Nam)</strong>
                <br />
                Địa chỉ: 285 Cách Mạng Tháng Tám, Phường 12, Quận 10, TP. Hồ Chí Minh
                <br />
                Giấy chứng nhận đăng ký doanh nghiệp số 0304965680 do Sở Kế hoạch và Đầu tư TP. Hồ Chí Minh cấp ngày 03/05/2007.
                <br />
                Giấy phép kinh doanh hoạt động mua bán hàng hóa số 0304965680/KD-0321 do Sở Công thương TP.HCM cấp.
              </p>
            </section>
          </div>
        </div>
      </main>

      <RogFooter />
    </div>
  );
}
