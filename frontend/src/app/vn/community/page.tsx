import type { Metadata } from "next";
import Link from "next/link";
import RogNavbar from "@/components/sites/rog-asus/RogNavbar";
import RogPromoBar from "@/components/sites/rog-asus/RogPromoBar";
import RogFooter from "@/components/sites/rog-asus/RogFooter";
import RogChatWidget from "@/components/sites/rog-asus/RogChatWidget";

export const metadata: Metadata = {
  title: "Cộng Đồng Game Thủ ROG VN & ROG Elite Rewards｜ROG",
  description:
    "Gia nhập Cộng đồng Republic of Gamers Việt Nam. Tham gia chương trình tích điểm đổi quà ROG Elite Rewards, giải đấu ROG Masters và hội game thủ.",
};

const CHANNELS = [
  {
    name: "HỘI ASUS ROG VIỆT NAM (FACEBOOK)",
    members: "520.000+ Game thủ",
    desc: "Cộng đồng chia sẻ góc máy, trao đổi kinh nghiệm tối ưu hóa laptop gaming, chia sẻ profile quạt và tư vấn cấu hình lớn nhất Việt Nam.",
    link: "https://www.facebook.com/groups/asusrogvietnam",
    btn: "THAM GIA NHÓM FACEBOOK ↗",
  },
  {
    name: "ROG DISCORD COMMUNITY",
    members: "45.000+ Thành viên",
    desc: "Kênh Discord chính thức để tìm đồng đội chiến game (LFG), nhận vai trò độc quyền, tham gia minigame và voice chat cùng các admin ROG.",
    link: "https://discord.gg/asus-rog",
    btn: "THAM GIA DISCORD ↗",
  },
  {
    name: "YOUTUBE ASUS ROG VIỆT NAM",
    members: "380.000+ Đăng ký",
    desc: "Kênh video chính thức phát sóng các giải đấu ROG Masters, video unboxing linh kiện mới, hướng dẫn công nghệ và trải nghiệm máy trực tiếp.",
    link: "https://www.youtube.com/@asusrogvietnam",
    btn: "XEM KÊNH YOUTUBE ↗",
  },
  {
    name: "TIKTOK @ASUSROGVN",
    members: "650.000+ Theo dõi",
    desc: "Nơi cập nhật nhanh những góc máy setup đỉnh cao, video ngắn review mẹo chơi game và các xu hướng công nghệ gaming hot nhất.",
    link: "https://www.tiktok.com/@asusrogvn",
    btn: "THEO DÕI TIKTOK ↗",
  },
];

const ELITE_TIERS = [
  { tier: "BRONZE", points: "0 - 999 Điểm", perk: "Huy hiệu thành viên, tin tức khuyến mãi độc quyền sớm nhất." },
  { tier: "SILVER", points: "1.000 - 2.999 Điểm", perk: "Nhận quà sinh nhật, tham gia bốc thăm trúng thưởng gear ROG hàng quý." },
  { tier: "GOLD", points: "3.000 - 6.999 Điểm", perk: "Vé VIP tham dự sự kiện ROG Day, quà tặng merchandise độc bản giới hạn." },
  { tier: "DIAMOND", points: "7.000+ Điểm", perk: "Đặc quyền bảo hành VIP tận nơi ưu tiên, trải nghiệm sản phẩm mới trước ngày ra mắt." },
];

export default function CommunityPage() {
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
            {"// JOIN THE REPUBLIC // COMMUNITY"}
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
            CỘNG ĐỒNG REPUBLIC OF GAMERS
          </h1>
          <p style={{ fontSize: "16px", color: "#aaa", maxWidth: "720px", margin: "0 auto", lineHeight: 1.6 }}>
            Kết nối với hơn nửa triệu game thủ tại Việt Nam. Cùng nhau chia sẻ đam mê phần cứng,
            tham gia các giải đấu thể thao điện tử và nhận những đặc quyền vô giá từ ROG Elite.
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
            <span style={{ color: "#ff0036" }}>Cộng đồng</span>
          </div>
        </section>

        {/* ROG Elite Rewards */}
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "60px 24px 0" }}>
          <div
            style={{
              background: "linear-gradient(135deg, #180308 0%, #111116 100%)",
              border: "1px solid #331118",
              borderRadius: "8px",
              padding: "48px 36px",
              marginBottom: "80px",
            }}
          >
            <div style={{ maxWidth: "700px" }}>
              <span style={{ color: "#ff0036", fontSize: "12px", fontWeight: 800, letterSpacing: "2px" }}>
                {"// CHƯƠNG TRÌNH KHÁCH HÀNG THÂN THIẾT"}
              </span>
              <h2 style={{ fontSize: "32px", fontWeight: 900, margin: "12px 0 16px" }}>
                ROG ELITE REWARDS
              </h2>
              <p style={{ color: "#bbb", fontSize: "15px", lineHeight: 1.6, marginBottom: "24px" }}>
                Đăng ký số Serial Number của laptop, bo mạch chủ hoặc gaming gear ROG bạn sở hữu
                để tích lũy điểm thưởng. Sử dụng điểm thưởng để đổi lấy áo khoác, nón, balo, keycap
                sưu tầm hoặc mã giảm giá độc quyền.
              </p>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <Link
                  href="/vn/store"
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
                  ĐĂNG KÝ TÍCH ĐIỂM NGAY →
                </Link>
                <Link
                  href="/vn/support"
                  style={{
                    display: "inline-block",
                    padding: "12px 28px",
                    border: "1px solid #444",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "13px",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    borderRadius: "2px",
                  }}
                >
                  TRA CỨU SERIAL NUMBER
                </Link>
              </div>
            </div>

            {/* Tiers Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "20px",
                marginTop: "40px",
              }}
            >
              {ELITE_TIERS.map((t) => (
                <div
                  key={t.tier}
                  style={{
                    background: "rgba(0,0,0,0.4)",
                    border: "1px solid #282830",
                    borderRadius: "6px",
                    padding: "20px",
                  }}
                >
                  <div style={{ color: "#ff0036", fontWeight: 800, fontSize: "18px", marginBottom: "4px" }}>
                    {t.tier}
                  </div>
                  <div style={{ color: "#888", fontSize: "12px", marginBottom: "12px" }}>{t.points}</div>
                  <div style={{ color: "#ccc", fontSize: "13px", lineHeight: 1.5 }}>{t.perk}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Channels */}
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
            CÁC KÊNH KẾT NỐI CHÍNH THỨC
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "24px",
            }}
          >
            {CHANNELS.map((ch) => (
              <div
                key={ch.name}
                style={{
                  background: "#121216",
                  border: "1px solid #222",
                  borderRadius: "6px",
                  padding: "28px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 6px 0", color: "#fff" }}>
                    {ch.name}
                  </h3>
                  <div style={{ color: "#ff0036", fontSize: "13px", fontWeight: 600, marginBottom: "14px" }}>
                    {ch.members}
                  </div>
                  <p style={{ color: "#aaa", fontSize: "13px", lineHeight: 1.6, marginBottom: "24px" }}>
                    {ch.desc}
                  </p>
                </div>
                <a
                  href={ch.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "block",
                    textAlign: "center",
                    padding: "10px 16px",
                    background: "#1a1a24",
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    borderRadius: "2px",
                    border: "1px solid #333",
                  }}
                >
                  {ch.btn}
                </a>
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
