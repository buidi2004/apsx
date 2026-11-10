/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import RogNavbar from "@/components/sites/rog-asus/RogNavbar";
import RogPromoBar from "@/components/sites/rog-asus/RogPromoBar";
import RogFooter from "@/components/sites/rog-asus/RogFooter";
import RogChatWidget from "@/components/sites/rog-asus/RogChatWidget";

export const metadata: Metadata = {
  title: "Sự Kiện & Khuyến Mãi Nổi Bật｜ROG - Republic of Gamers｜Việt Nam",
  description:
    "Cập nhật các chương trình khuyến mãi, tặng code game bản quyền và sự kiện offline mới nhất từ ASUS ROG Việt Nam.",
};

const CAMPAIGNS = [
  {
    badge: "ƯU ĐÃI NỔI BẬT",
    title: "CHIẾN GAME ĐỈNH CAO — TẶNG CODE GAME BOM TẤN KHI MUA ROG RTX 50 SERIES",
    period: "Áp dụng từ 01/01/2026 đến khi hết quà tặng",
    desc: "Khách hàng mua laptop gaming ROG Strix SCAR 18, ROG Zephyrus G16 hoặc ROG Zephyrus G14 trang bị card đồ họa NVIDIA® GeForce RTX™ 50 Series sẽ nhận ngay mã kích hoạt game bản quyền AAA kèm gói vật phẩm độc quyền trị giá 1.800.000đ.",
    img: "/sites/rog-asus/img/hero/gamescom.webp",
    ctaText: "XEM CHI TIẾT THỂ LỆ",
    ctaLink: "/vn/laptops-group",
  },
  {
    badge: "BACK TO SCHOOL",
    title: "BỨT PHÁ GIỚI HẠN — COMBO QUÀ TẶNG LÊN ĐẾN 4 TRIỆU ĐỒNG",
    period: "Áp dụng cho học sinh, sinh viên toàn quốc",
    desc: "Đón năm học mới đầy phong cách với laptop ROG. Khi mua bất kỳ sản phẩm ROG Strix G16 hoặc Zephyrus, bạn sẽ được tặng ngay Balo ROG Archer Backpack chống nước cao cấp cùng Chuột chơi game siêu nhẹ ROG Keris II.",
    img: "/sites/rog-asus/img/hero/strix-scar-18.webp",
    ctaText: "KHÁM PHÁ CÁC MODEL ÁP DỤNG",
    ctaLink: "/vn/laptops/rog-strix-series",
  },
  {
    badge: "SỰ KIỆN OFFLINE",
    title: "ĐẠI HỘI ROG DAY 2026 — FOR THOSE WHO DARE",
    period: "Tháng 8/2026 tại TP. Hồ Chí Minh & Hà Nội",
    desc: "Ngày hội thường niên lớn nhất dành riêng cho cộng đồng game thủ ROG. Trực tiếp trải nghiệm cỗ máy ROG Flow Z13-KJP và ROG Ally X, giao lưu cùng các tuyển thủ thể thao điện tử hàng đầu và cơ hội bốc thăm may mắn nhận laptop ROG.",
    img: "/sites/rog-asus/img/flow/hero-kjp.webp",
    ctaText: "ĐĂNG KÝ THAM GIA MIỄN PHÍ",
    ctaLink: "/vn/community",
  },
];

export default function EventsPage() {
  return (
    <div className="rog-page">
      <RogNavbar />
      <RogPromoBar />

      <main style={{ background: "#0a0a0c", color: "#fff", paddingBottom: "80px" }}>
        {/* Hero */}
        <section
          style={{
            padding: "100px 24px 60px",
            textAlign: "center",
            background: "radial-gradient(ellipse at top, #26050b 0%, #0a0a0c 70%)",
            borderBottom: "1px solid #1f1f23",
          }}
        >
          <span
            style={{
              color: "#ff0036",
              fontSize: "13px",
              fontWeight: 800,
              letterSpacing: "3px",
              textTransform: "uppercase",
            }}
          >
            {"// ROG EVENTS & PROMOTIONS"}
          </span>
          <h1
            style={{
              fontSize: "clamp(32px, 5vw, 52px)",
              fontWeight: 900,
              letterSpacing: "1px",
              margin: "16px 0",
              textTransform: "uppercase",
            }}
          >
            SỰ KIỆN & ƯU ĐÃI NỔI BẬT
          </h1>
          <p style={{ fontSize: "16px", color: "#aaa", maxWidth: "720px", margin: "0 auto", lineHeight: 1.6 }}>
            Đừng bỏ lỡ các chương trình quà tặng bản quyền, ưu đãi đổi mới và các ngày hội giao lưu
            công nghệ sôi động nhất dành cho fan cứng ROG tại Việt Nam.
          </p>

          <div
            style={{
              marginTop: "24px",
              display: "flex",
              justifyContent: "center",
              gap: "12px",
              fontSize: "13px",
              color: "#888",
            }}
          >
            <Link href="/" style={{ color: "#aaa", textDecoration: "none" }}>Trang chủ</Link>
            <span>›</span>
            <span style={{ color: "#ff0036" }}>Nổi bật</span>
          </div>
        </section>

        {/* Campaign List */}
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "60px 24px 0" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
            {CAMPAIGNS.map((c) => (
              <div
                key={c.title}
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                  gap: "36px",
                  background: "#121216",
                  border: "1px solid #222",
                  borderRadius: "8px",
                  overflow: "hidden",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
                }}
              >
                <div style={{ minHeight: "260px" }}>
                  <img
                    src={c.img}
                    alt={c.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                </div>

                <div
                  style={{
                    padding: "36px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      alignSelf: "flex-start",
                      background: "#ff0036",
                      color: "#fff",
                      fontSize: "11px",
                      fontWeight: 800,
                      letterSpacing: "1px",
                      padding: "4px 10px",
                      borderRadius: "2px",
                      marginBottom: "12px",
                    }}
                  >
                    {c.badge}
                  </span>
                  <h2 style={{ fontSize: "22px", fontWeight: 800, lineHeight: 1.3, margin: "0 0 10px 0" }}>
                    {c.title}
                  </h2>
                  <div style={{ color: "#ff0036", fontSize: "13px", fontWeight: 600, marginBottom: "16px" }}>
                    Thời gian: {c.period}
                  </div>
                  <p style={{ color: "#aaa", fontSize: "14px", lineHeight: 1.6, marginBottom: "24px" }}>
                    {c.desc}
                  </p>
                  <div>
                    <Link
                      href={c.ctaLink}
                      style={{
                        display: "inline-block",
                        padding: "12px 24px",
                        background: "#1a1a24",
                        color: "#fff",
                        fontSize: "12px",
                        fontWeight: 700,
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                        textDecoration: "none",
                        borderRadius: "2px",
                        border: "1px solid #333",
                      }}
                    >
                      {c.ctaText} →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <RogFooter />
      <RogChatWidget variant="greeting" />
    </div>
  );
}
