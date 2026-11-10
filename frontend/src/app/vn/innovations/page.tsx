/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import RogNavbar from "@/components/sites/rog-asus/RogNavbar";
import RogPromoBar from "@/components/sites/rog-asus/RogPromoBar";
import RogFooter from "@/components/sites/rog-asus/RogFooter";
import RogChatWidget from "@/components/sites/rog-asus/RogChatWidget";

export const metadata: Metadata = {
  title: "Sáng Tạo & Công Nghệ Đột Phá｜ROG - Republic of Gamers｜Việt Nam",
  description:
    "Khám phá các công nghệ tiên phong của ROG: Tản nhiệt buồng hơi kim loại lỏng ROG Intelligent Cooling, màn hình ROG Nebula HDR, đèn AniMe Matrix và MUX Switch.",
};

const INNOVATIONS = [
  {
    tag: "// TẢN NHIỆT ĐỈNH CAO",
    title: "ROG INTELLIGENT COOLING",
    desc: "Hiệu năng khủng đòi hỏi giải pháp tản nhiệt tối thượng. ROG dẫn đầu ngành công nghiệp với keo tản nhiệt kim loại lỏng Conductonaut Extreme giúp giảm tới 15°C nhiệt độ vi xử lý, buồng hơi Vapor Chamber bao phủ toàn diện và cụm 3 quạt Arc Flow Fans với 84 cánh khí động học.",
    highlights: [
      "Kim loại lỏng Thermal Grizzly Conductonaut Extreme",
      "Buồng hơi tản nhiệt Vapor Chamber mở rộng",
      "Cụm 3 quạt làm mát Tri-Fan Technology với quạt Arc Flow Gen 2",
      "Bộ lọc bụi siêu mịn và rãnh chống bụi tự làm sạch",
      "Vận hành 0dB êm ái ở các tác vụ văn phòng",
    ],
    img: "/sites/rog-asus/img/detail/gu605-cooling.webp",
  },
  {
    tag: "// HIỂN THỊ HOÀN HẢO",
    title: "MÀN HÌNH ROG NEBULA & NEBULA HDR",
    desc: "Chuẩn mực màn hình gaming hàng đầu thế giới. ROG Nebula Display bảo đảm độ sáng rực rỡ, độ bao phủ màu sắc 100% DCI-P3 chuẩn điện ảnh, tần số quét siêu cao lên đến 240Hz và thời gian đáp ứng thần tốc 0.03ms trên tấm nền QD-OLED và Mini LED 2048 vùng làm mờ.",
    highlights: [
      "Tấm nền QD-OLED & Mini LED với độ sáng tối đa 1100 nits",
      "Thời gian phản hồi siêu thấp 0.03ms - 0.2ms",
      "Chứng nhận chuẩn màu quốc tế Pantone® Validated",
      "Hỗ trợ Dolby Vision HDR & VESA DisplayHDR True Black 500",
      "Tần số quét lên đến 240Hz chống xé hình với G-SYNC®",
    ],
    img: "/sites/rog-asus/img/detail/gu605-display.webp",
  },
  {
    tag: "// CÁ TÍNH ĐỘC BẢN",
    title: "ANIME MATRIX & SLASH LIGHTING",
    desc: "Biến mặt lưng laptop thành bức tranh nghệ thuật tương tác sống động. Hàng nghìn đèn mini-LED được gia công cơ khí chính xác bằng máy khoan CNC, cho phép hiển thị ảnh động GIF, nhịp điệu âm thanh sống động hoặc thông báo thời lượng pin theo thời gian thực.",
    highlights: [
      "Ma trận đèn LED AniMe Matrix hiển thị nội dung tùy chỉnh",
      "Dải đèn chéo Slash Lighting nhôm CNC phong cách Cyberpunk",
      "Hiệu ứng Visualizer đồng bộ theo điệu nhạc và sự kiện game",
      "Phần mềm Armoury Crate cho phép tự thiết kế pixel art riêng",
    ],
    img: "/sites/rog-asus/img/detail/g16-2025-kv.webp",
  },
  {
    tag: "// TỐI ĐA SỨC MẠNH",
    title: "ROG MUX SWITCH & NVIDIA ADVANCED OPTIMUS",
    desc: "Trên các laptop thông thường, tín hiệu hình ảnh từ GPU rời phải trung chuyển qua đồ họa tích hợp trước khi đến màn hình, gây nghẽn cổ chai và giảm 10-15% FPS. MUX Switch của ROG kết nối trực tiếp GPU với màn hình hiển thị, giải phóng 100% hiệu năng phần cứng cho các tựa game esports đối kháng đỉnh cao.",
    highlights: [
      "Chuyển đổi luồng xuất hình trực tiếp từ GPU rời",
      "Tăng từ 5% đến 15% khung hình FPS trong Valorant, CS2",
      "Tự động chuyển đổi thông minh không cần khởi động lại máy",
      "Chế độ GPU Eco Mode ngắt điện hoàn toàn GPU rời khi dùng pin",
    ],
    img: "/sites/rog-asus/img/detail/gu605-mux.webp",
  },
];

export default function InnovationsPage() {
  return (
    <div className="rog-page">
      <RogNavbar />
      <RogPromoBar />

      <main style={{ background: "#0a0a0c", color: "#fff", paddingBottom: "80px" }}>
        {/* Hero Section */}
        <section
          style={{
            position: "relative",
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
            {"// ROG INNOVATIONS & TECHNOLOGIES"}
          </span>
          <h1
            style={{
              fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: 900,
              letterSpacing: "1px",
              margin: "16px 0",
              textTransform: "uppercase",
            }}
          >
            SÁNG TẠO & CÔNG NGHỆ ĐỘT PHÁ
          </h1>
          <p
            style={{
              fontSize: "17px",
              color: "#aaa",
              maxWidth: "760px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Tại Republic of Gamers, chúng tôi không ngừng thúc đẩy ranh giới của kỹ thuật
            và vật lý để kiến tạo nên những cỗ máy chơi game mạnh mẽ nhất, mát nhất và đẹp nhất.
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
            <span style={{ color: "#ff0036" }}>Sáng tạo</span>
          </div>
        </section>

        {/* Feature Sections */}
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "60px 24px 0" }}>
          {INNOVATIONS.map((item, idx) => (
            <div
              key={item.title}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "48px",
                alignItems: "center",
                marginBottom: "80px",
                paddingBottom: "80px",
                borderBottom: idx < INNOVATIONS.length - 1 ? "1px solid #1a1a20" : "none",
                direction: idx % 2 === 1 ? "rtl" : "ltr",
              }}
            >
              {/* Media */}
              <div
                style={{
                  direction: "ltr",
                  background: "#141418",
                  border: "1px solid #222",
                  borderRadius: "8px",
                  overflow: "hidden",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                }}
              >
                <img
                  src={item.img}
                  alt={item.title}
                  style={{ width: "100%", height: "auto", display: "block", objectFit: "cover" }}
                />
              </div>

              {/* Text */}
              <div style={{ direction: "ltr" }}>
                <span style={{ color: "#ff0036", fontSize: "13px", fontWeight: 800, letterSpacing: "2px" }}>
                  {item.tag}
                </span>
                <h2
                  style={{
                    fontSize: "clamp(24px, 3vw, 36px)",
                    fontWeight: 800,
                    margin: "12px 0 20px",
                    lineHeight: 1.2,
                  }}
                >
                  {item.title}
                </h2>
                <p style={{ color: "#bbb", fontSize: "16px", lineHeight: 1.7, marginBottom: "24px" }}>
                  {item.desc}
                </p>

                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px 0" }}>
                  {item.highlights.map((h) => (
                    <li
                      key={h}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "12px",
                        color: "#ddd",
                        fontSize: "14px",
                      }}
                    >
                      <span style={{ color: "#ff0036", fontWeight: 900 }}>✓</span>
                      {h}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/vn/laptops-group/"
                  style={{
                    display: "inline-block",
                    padding: "12px 28px",
                    background: "#ff0036",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "13px",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    borderRadius: "2px",
                  }}
                >
                  KHÁM PHÁ SẢN PHẨM ÁP DỤNG →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <RogFooter />
      <RogChatWidget variant="greeting" />
    </div>
  );
}
