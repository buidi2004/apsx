"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useState } from "react";
import { RogApi } from "@/lib/api-client";

type Award = {
  id: string;
  title: string;
  issuer: string;
  logo: string;
  link: string;
};

const AWARDS: Award[] = [
  {
    id: "reddot-2026",
    title: "2026 Red Dot Product Design",
    issuer: "The ROG Zephyrus Duo impresses with a concept that combines dual-screen use, different usage scenarios and technical integration in a concise manner.",
    logo: "https://www.asus.com/media/images/award_logo/1265/202607131003146260676.PNG",
    link: "https://rog.asus.com/vn/laptops/rog-zephyrus/rog-zephyrus-duo-2026/",
  },
  {
    id: "gold-award",
    title: "Gold Award Excellence",
    issuer: "The ASUS ROG Zephyrus Duo 2026 is an engineering feat unrivaled in the market",
    logo: "https://www.asus.com/media/images/award_logo/1337/202410161517525870835.png",
    link: "https://rog.asus.com/vn/laptops/rog-zephyrus/rog-zephyrus-duo-2026/",
  },
  {
    id: "platinum-award",
    title: "Platinum Award",
    issuer: "Overwhelming performance. The laptop flies no matter what you do.",
    logo: "https://www.asus.com/media/images/award_logo/1337/15719.png",
    link: "https://rog.asus.com/vn/laptops/rog-zephyrus/rog-zephyrus-duo-2026/",
  },
  {
    id: "score-88",
    title: "88% Score Editor's Choice",
    issuer: "A gaming beast with two screens that hides much more",
    logo: "https://www.asus.com/media/images/award_logo/1337/202108302143369940870.png",
    link: "https://rog.asus.com/vn/laptops/rog-zephyrus/rog-zephyrus-duo-2026/",
  },
  {
    id: "performance-choice",
    title: "Performance Monster",
    issuer: "Ultra-premium gaming laptop with dual OLED screens and RTX 5090",
    logo: "https://www.asus.com/media/images/award_logo/1337/202003062031367220176.PNG",
    link: "https://rog.asus.com/vn/laptops/rog-zephyrus/rog-zephyrus-duo-2026/",
  },
];

type RelatedProduct = {
  id: string;
  name: string;
  tagline: string;
  img: string;
  href: string;
};

const RELATED_PRODUCTS: RelatedProduct[] = [
  {
    id: "matrix5090",
    name: "ROG Matrix RTX 5090 (30th)",
    tagline: "Card Đồ Họa Kỷ Niệm 30 Năm ASUS BTF 800W 4 Quạt Keo Kim Loại Lỏng",
    img: "/sites/rog-asus/img/vga/hot-matrix-5090.webp",
    href: "/vn/graphics-cards/rog-matrix/rog-matrix-rtx5090-p32g-30th",
  },
  {
    id: "g16",
    name: "ROG Zephyrus G16 (2025) GU605",
    tagline: "Laptop Gaming Siêu Mỏng Nhẹ OLED 2.5K 240Hz Intel Ultra 9 + RTX 5090",
    img: "https://dlcdnwebimgs.asus.com/gain/E4E1A4CD-1261-43D1-A18D-C91711A989AD/w260/fwebp",
    href: "/vn/laptops/rog-zephyrus/rog-zephyrus-g16-2025-gu605",
  },
  {
    id: "ga403",
    name: "ROG Zephyrus G14 (2025) GA403",
    tagline: "Laptop Gaming Mỏng Nhẹ OLED 14-inch AMD Ryzen AI 9 + Slash Lighting",
    img: "https://dlcdnwebimgs.asus.com/gain/4EF58E53-1C62-44B8-8163-A6A2F4C5BC11/w260/fwebp",
    href: "/vn/laptops/rog-zephyrus/rog-zephyrus-g14-2025-ga403",
  },
  {
    id: "z13_kjp",
    name: "ROG Flow Z13-KJP (2026)",
    tagline: "Laptop Gaming 2-in-1 Hợp tác độc quyền cùng KOJIMA PRODUCTIONS",
    img: "https://dlcdnwebimgs.asus.com/gain/4C012B41-07B2-41FA-ACB6-B8CE5F049207/w260/fwebp",
    href: "/vn/laptops/rog-flow/rog-flow-z13-kjp",
  },
  {
    id: "scar18",
    name: "ROG Strix SCAR 18 (2026)",
    tagline: "Laptop Gaming Mạnh Nhất Của ROG Intel Ultra 9 + RTX 5090 Nebula HDR",
    img: "https://dlcdnwebimgs.asus.com/gain/EB1F261B-C068-4943-96E9-04B234ED9654/w260/fwebp",
    href: "/vn/laptops/rog-strix/rog-strix-scar-18-2026",
  },
];

const DISCLAIMERS: string[] = [
  "Môi trường thử nghiệm tiêu chuẩn của Asus về tuổi thọ pin như sau: Hệ điều hành Windows, mô-đun hiển thị với độ sáng 150 nits, tắt đèn và các cài đặt ứng dụng khác.",
  "Phát lại video: Thử nghiệm được thực hiện khi tắt Wi-Fi / Bluetooth, Windows Power Plan ở chế độ Cân bằng, Chế độ nguồn trên thanh tác vụ được đặt thành Trình tiết kiệm pin, âm lượng hệ thống ở mức 67% và video ở chế độ toàn màn hình, độ phân giải 1080p.",
  "Duyệt web: Thử nghiệm được thực hiện với Wi-Fi / Bluetooth, Windows Power Plan ở chế độ Cân bằng, Chế độ nguồn trên thanh tác vụ được đặt thành Pin tốt hơn và sử dụng trang web Weblooper Top50 trong Google Chrome để phát video với thời gian làm mới là 10 giây.",
  "Các yếu tố ảnh hưởng đến tuổi thọ pin bao gồm cấu hình máy tính xách tay, cài đặt nguồn và cách sử dụng. Dung lượng pin giảm dần theo số chu kỳ sạc và thời gian sử dụng.",
  "Thời gian sạc nhanh áp dụng khi sử dụng bộ chuyển đổi ASUS đi kèm và hệ thống đang tắt nguồn (tắt máy hoàn toàn). Trong các điều kiện nhiệt độ tương thích, pin có thể được sạc tới 50% trong vòng 30 phút.",
  "Dữ liệu thử nghiệm từ các phòng thí nghiệm nội bộ của ASUS, hiệu suất thực tế có thể thay đổi tùy thuộc vào môi trường sử dụng cụ thể.",
  "Thông số kỹ thuật có thể thay đổi mà không cần thông báo trước. Vui lòng kiểm tra với nhà phân phối chính thức của ASUS tại Việt Nam để biết chi tiết chính xác.",
];

export default function RogZephyrusDuo2026PostFeatures() {
  const [awardIdx, setAwardIdx] = useState(0);
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const prevAward = () => {
    setAwardIdx((prev) => (prev > 0 ? prev - 1 : AWARDS.length - 1));
  };

  const nextAward = () => {
    setAwardIdx((prev) => (prev < AWARDS.length - 1 ? prev + 1 : 0));
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    if (await RogApi.subscribeNewsletter(email.trim())) setIsSubscribed(true);
  };

  return (
    <section className="rog-duo-post-features" style={{ backgroundColor: "#0b0b0b", color: "#fff", paddingTop: "60px", paddingBottom: "80px" }}>
      {/* 1. Official Awards Section */}
      <div id="awards" style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px 60px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px", borderBottom: "1px solid #222", paddingBottom: "16px" }}>
          <div>
            <span style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "2px", color: "#ff0036", fontWeight: 700 }}>Danh hiệu toàn cầu</span>
            <h2 style={{ fontSize: "32px", fontWeight: 800, margin: "6px 0 0", letterSpacing: "-0.5px" }}>Giải thưởng & Đánh giá</h2>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              onClick={prevAward}
              aria-label="Previous Award"
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                backgroundColor: "#181818",
                border: "1px solid #333",
                color: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease"
              }}
            >
              ‹
            </button>
            <button
              type="button"
              onClick={nextAward}
              aria-label="Next Award"
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                backgroundColor: "#181818",
                border: "1px solid #333",
                color: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease"
              }}
            >
              ›
            </button>
          </div>
        </div>

        {/* Awards Grid / Card */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
          {AWARDS.map((award, idx) => (
            <div
              key={award.id}
              style={{
                backgroundColor: idx === awardIdx ? "#1c1417" : "#141414",
                border: idx === awardIdx ? "1px solid #ff0036" : "1px solid #222",
                borderRadius: "12px",
                padding: "28px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                transition: "all 0.3s ease"
              }}
            >
              <div style={{ height: "70px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
                <img
                  src={award.logo}
                  alt={award.title}
                  style={{ maxHeight: "65px", maxWidth: "180px", objectFit: "contain", filter: "brightness(0.95)" }}
                />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 10px", color: "#fff" }}>{award.title}</h3>
              <p style={{ fontSize: "13px", lineHeight: "1.6", color: "#999", margin: 0 }}>{award.issuer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Official ROG Newsletter Subscription */}
      <div style={{ maxWidth: "1280px", margin: "0 auto 60px", padding: "0 24px" }}>
        <div
          style={{
            background: "linear-gradient(135deg, #181818 0%, #111111 100%)",
            border: "1px solid #2a2a2a",
            borderRadius: "16px",
            padding: "48px 36px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            position: "relative",
            overflow: "hidden"
          }}
        >
          <span style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "3px", color: "#ff0036", fontWeight: 700, marginBottom: "8px" }}>
            REPUBLIC OF GAMERS
          </span>
          <h2 style={{ fontSize: "28px", fontWeight: 800, margin: "0 0 12px", color: "#fff" }}>
            ĐĂNG KÝ NHẬN TIN TỨC ĐỘC QUYỀN ZEPHYRUS DUO 2026
          </h2>
          <p style={{ fontSize: "14px", color: "#aaa", maxWidth: "600px", lineHeight: "1.6", margin: "0 0 28px" }}>
            Nhận thông báo sớm nhất về đợt mở bán ROG Zephyrus Duo 2026 tại Việt Nam, các gói quà tặng độc quyền và ưu đãi phần cứng ROG.
          </p>

          {isSubscribed ? (
            <div style={{ padding: "16px 24px", backgroundColor: "rgba(0, 200, 83, 0.15)", border: "1px solid #00c853", borderRadius: "8px", color: "#00e676", fontWeight: 600 }}>
              ✓ Cảm ơn bạn! Chúng tôi sẽ gửi thông tin mở bán ROG Zephyrus Duo 2026 sớm nhất qua email của bạn.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} style={{ display: "flex", width: "100%", maxWidth: "520px", gap: "10px" }}>
              <input
                type="email"
                required
                placeholder="Nhập địa chỉ email của bạn..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  flex: 1,
                  backgroundColor: "#0d0d0d",
                  border: "1px solid #333",
                  borderRadius: "8px",
                  padding: "14px 18px",
                  fontSize: "14px",
                  color: "#fff",
                  outline: "none"
                }}
              />
              <button
                type="submit"
                style={{
                  backgroundColor: "#ff0036",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "14px 28px",
                  fontSize: "14px",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "background-color 0.2s ease"
                }}
              >
                Đăng Ký
              </button>
            </form>
          )}
        </div>
      </div>

      {/* 3. Related ROG Ecosystem */}
      <div style={{ maxWidth: "1280px", margin: "0 auto 60px", padding: "0 24px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: 800, margin: "0 0 24px", borderBottom: "1px solid #222", paddingBottom: "12px" }}>
          Sản phẩm liên quan trong hệ sinh thái ROG
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
          {RELATED_PRODUCTS.map((prod) => (
            <Link
              key={prod.id}
              href={prod.href}
              style={{
                backgroundColor: "#121212",
                border: "1px solid #222",
                borderRadius: "12px",
                padding: "20px",
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s ease, border-color 0.2s ease"
              }}
            >
              <div style={{ height: "160px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                <img
                  src={prod.img}
                  alt={prod.name}
                  style={{ maxHeight: "140px", maxWidth: "100%", objectFit: "contain" }}
                />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 8px", color: "#fff" }}>{prod.name}</h3>
              <p style={{ fontSize: "12px", color: "#888", lineHeight: "1.5", margin: "0 0 16px", flex: 1 }}>{prod.tagline}</p>
              <span style={{ fontSize: "13px", color: "#ff0036", fontWeight: 700 }}>Tìm hiểu thêm ›</span>
            </Link>
          ))}
        </div>
      </div>

      {/* 4. Official Disclaimers */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ borderTop: "1px solid #222", paddingTop: "32px" }}>
          <h4 style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", color: "#666", marginBottom: "12px" }}>
            Ghi chú pháp lý & Điều kiện thử nghiệm
          </h4>
          <ol style={{ paddingLeft: "18px", margin: 0, fontSize: "12px", lineHeight: "1.7", color: "#666" }}>
            {DISCLAIMERS.map((disc, idx) => (
              <li key={idx} style={{ marginBottom: "6px" }}>{disc}</li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
