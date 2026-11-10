/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import RogNavbar from "@/components/sites/rog-asus/RogNavbar";
import RogPromoBar from "@/components/sites/rog-asus/RogPromoBar";
import RogFooter from "@/components/sites/rog-asus/RogFooter";
import RogChatWidget from "@/components/sites/rog-asus/RogChatWidget";

export const metadata: Metadata = {
  title: "Tải Xuống & Phần Mềm｜ROG - Republic of Gamers｜Việt Nam",
  description:
    "Tải các phần mềm điều khiển độc quyền của ASUS ROG: Armoury Crate, Aura Creator, GPU Tweak III và bộ sưu tập hình nền ROG Wallpapers 4K.",
};

const SOFTWARES = [
  {
    name: "ARMOURY CRATE",
    version: "v5.9.15.0",
    size: "2.8 MB (Trình cài đặt Web)",
    desc: "Trung tâm chỉ huy toàn diện cho hệ sinh thái ROG. Tùy chỉnh chế độ quạt, xung nhịp CPU/GPU, đồng bộ đèn RGB Aura Sync, quản lý thư viện trò chơi và cập nhật driver mới nhất.",
    features: [
      "Kiểm soát chế độ vận hành (Silent, Performance, Turbo, Manual)",
      "Đồng bộ đèn Aura Sync trên toàn bộ hệ thống gear và linh kiện",
      "Scenario Profiles tự động áp dụng cấu hình theo từng tựa game",
      "GameVisual tối ưu màu sắc hiển thị cho FPS, MOBA, Racing",
    ],
    os: "Windows 11 / 10 64-bit",
    badge: "PHẦN MỀM CHỦ LỰC",
    downloadUrl: "https://www.asus.com/supportonly/armoury%20crate/helpdesk_download/",
  },
  {
    name: "ARMOURY CRATE SE (SPECIAL EDITION)",
    version: "v1.6.4",
    size: "85 MB",
    desc: "Phiên bản thiết kế đặc biệt tối ưu cho máy chơi game cầm tay ROG Ally và ROG Ally X. Giao diện trực quan tùy biến điều khiển nút bấm, TDP từ 10W đến 30W và gom toàn bộ launcher game vào một nơi.",
    features: [
      "Quản lý thư viện game tập trung từ Steam, Game Pass, Epic, Battle.net",
      "Tùy biến bản đồ nút phím (Key Mapping) và độ nhạy cần Joystick",
      "Tùy chỉnh công suất TDP và đường cong quạt kép làm mát",
      "Truy cập nhanh Command Center ngay trong khi đang chơi game",
    ],
    os: "Windows 11 64-bit (ROG Ally / Ally X)",
    badge: "DÀNH CHO ROG ALLY",
    downloadUrl: "/vn/gaming-handhelds-group/",
  },
  {
    name: "GPU TWEAK III",
    version: "v1.9.4.0",
    size: "95 MB",
    desc: "Công cụ ép xung và giám sát phần cứng GPU đỉnh cao. Kiểm soát xung nhịp nhân, xung nhịp bộ nhớ, điện áp Vcore và thiết lập biểu đồ tốc độ quạt thông minh.",
    features: [
      "Ép xung 1 chạm với OC Scanner tự động tìm mức ổn định nhất",
      "Hiển thị bảng thông số OSD (On-Screen Display) trong game",
      "Tự động điều chỉnh quạt theo nhiệt độ GPU và nhiệt độ điểm nóng Hotspot",
      "Tích hợp sẵn tiện ích kiểm tra độ ổn định FurMark ROG Edition",
    ],
    os: "Windows 11 / 10 64-bit",
    badge: "DÀNH CHO CARD ĐỒ HỌA",
    downloadUrl: "https://www.asus.com/campaign/GPU-Tweak-III/",
  },
  {
    name: "AURA CREATOR",
    version: "v3.2.7.0",
    size: "18 MB",
    desc: "Phần mềm biên tập hiệu ứng ánh sáng chuyên nghiệp. Tạo dựng kịch bản ánh sáng đa tầng theo timeline cho bàn phím, chuột, tai nghe và quạt tản nhiệt ROG.",
    features: [
      "Giao diện timeline nhiều lớp (multi-track) giống phần mềm dựng phim",
      "Hàng chục hiệu ứng ánh sáng RGB độc bản có thể tùy biến góc chiếu",
      "Đồng bộ với các thiết bị Aura Sync trong phòng chơi game",
    ],
    os: "Windows 11 / 10 64-bit",
    badge: "SÁNG TẠO RGB",
    downloadUrl: "https://www.asus.com/campaign/aura/vn/creator.php",
  },
];

const WALLPAPERS = [
  { title: "ROG Zephyrus G16 Neon Cyber", res: "3840 x 2160 (4K)", img: "/sites/rog-asus/img/hero/gamescom.webp" },
  { title: "ROG SAGA — Omni Awakening", res: "3840 x 2160 (4K)", img: "/sites/rog-asus/img/hero/control-resonant.webp" },
  { title: "For Those Who Dare — Strix Edition", res: "3840 x 2160 (4K)", img: "/sites/rog-asus/img/hero/strix-scar-18.webp" },
  { title: "ROG Kojima Alliance — Z13", res: "3840 x 2160 (4K)", img: "/sites/rog-asus/img/flow/hero-kjp.webp" },
];

export default function DownloadsPage() {
  return (
    <div className="rog-page">
      <RogNavbar />
      <RogPromoBar />

      <main style={{ background: "#0a0a0c", color: "#fff", paddingBottom: "80px" }}>
        {/* Header */}
        <section
          style={{
            padding: "100px 24px 60px",
            textAlign: "center",
            background: "radial-gradient(ellipse at top, #20040a 0%, #0a0a0c 70%)",
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
            {"// ROG SOFTWARE & DRIVERS"}
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
            TRUNG TÂM PHẦN MỀM & TẢI XUỐNG
          </h1>
          <p style={{ fontSize: "16px", color: "#aaa", maxWidth: "700px", margin: "0 auto" }}>
            Tải các bộ công cụ điều khiển hệ thống, tiện ích tối ưu hóa phần cứng và
            hình nền độ phân giải cao chính thức từ Republic of Gamers.
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
            <span style={{ color: "#ff0036" }}>Tải xuống</span>
          </div>
        </section>

        {/* Software Grid */}
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "60px 24px 0" }}>
          <h2
            style={{
              fontSize: "24px",
              fontWeight: 800,
              letterSpacing: "1px",
              textTransform: "uppercase",
              marginBottom: "32px",
              borderLeft: "4px solid #ff0036",
              paddingLeft: "16px",
            }}
          >
            PHẦN MỀM ĐỘC QUYỀN ROG
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "28px",
              marginBottom: "80px",
            }}
          >
            {SOFTWARES.map((sw) => (
              <div
                key={sw.name}
                style={{
                  background: "#121216",
                  border: "1px solid #222",
                  borderRadius: "6px",
                  padding: "32px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "3px",
                    background: "linear-gradient(90deg, #ff0036 0%, transparent 100%)",
                  }}
                />

                <div>
                  <span
                    style={{
                      display: "inline-block",
                      background: "#1f1f28",
                      color: "#ff0036",
                      fontSize: "11px",
                      fontWeight: 800,
                      letterSpacing: "1px",
                      padding: "4px 10px",
                      borderRadius: "2px",
                      marginBottom: "16px",
                    }}
                  >
                    {sw.badge}
                  </span>
                  <h3 style={{ fontSize: "22px", fontWeight: 800, margin: "0 0 8px 0" }}>
                    {sw.name}
                  </h3>
                  <div style={{ color: "#888", fontSize: "13px", marginBottom: "16px" }}>
                    <span>Phiên bản: {sw.version}</span> · <span>{sw.size}</span>
                  </div>
                  <p style={{ color: "#bbb", fontSize: "14px", lineHeight: 1.6, marginBottom: "20px" }}>
                    {sw.desc}
                  </p>

                  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px 0" }}>
                    {sw.features.map((f) => (
                      <li
                        key={f}
                        style={{
                          fontSize: "13px",
                          color: "#ccc",
                          display: "flex",
                          gap: "8px",
                          marginBottom: "8px",
                        }}
                      >
                        <span style={{ color: "#ff0036" }}>•</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div style={{ fontSize: "12px", color: "#666", marginBottom: "12px" }}>
                    Hệ điều hành: {sw.os}
                  </div>
                  <a
                    href={sw.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "block",
                      textAlign: "center",
                      padding: "12px 20px",
                      background: "#ff0036",
                      color: "#fff",
                      fontSize: "13px",
                      fontWeight: 700,
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                      textDecoration: "none",
                      borderRadius: "2px",
                    }}
                  >
                    TẢI BẢN CÀI ĐẶT ↗
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Wallpapers Section */}
          <h2
            style={{
              fontSize: "24px",
              fontWeight: 800,
              letterSpacing: "1px",
              textTransform: "uppercase",
              marginBottom: "32px",
              borderLeft: "4px solid #ff0036",
              paddingLeft: "16px",
            }}
          >
            HÌNH NỀN ROG 4K ULTRA-HD
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "24px",
            }}
          >
            {WALLPAPERS.map((wp) => (
              <div
                key={wp.title}
                style={{
                  background: "#121216",
                  border: "1px solid #222",
                  borderRadius: "6px",
                  overflow: "hidden",
                }}
              >
                <img
                  src={wp.img}
                  alt={wp.title}
                  style={{ width: "100%", height: "160px", objectFit: "cover", display: "block" }}
                />
                <div style={{ padding: "16px" }}>
                  <h4 style={{ fontSize: "14px", fontWeight: 700, margin: "0 0 6px" }}>{wp.title}</h4>
                  <p style={{ fontSize: "12px", color: "#888", margin: "0 0 12px" }}>Độ phân giải: {wp.res}</p>
                  <a
                    href={wp.img}
                    download
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-block",
                      color: "#ff0036",
                      fontSize: "12px",
                      fontWeight: 700,
                      textDecoration: "none",
                      letterSpacing: "0.5px",
                    }}
                  >
                    TẢI VỀ 4K ↓
                  </a>
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
