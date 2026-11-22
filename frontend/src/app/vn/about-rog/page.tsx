/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import RogNavbar from "@/components/sites/rog-asus/RogNavbar";
import RogPromoBar from "@/components/sites/rog-asus/RogPromoBar";
import RogFooter from "@/components/sites/rog-asus/RogFooter";
import RogChatWidget from "@/components/sites/rog-asus/RogChatWidget";
import RogJoinRepublic from "@/components/sites/rog-asus/RogJoinRepublic";
import { RogApi } from "@/lib/api-client";
import "./AboutRog.css";

export const metadata: Metadata = {
  title: "Giới thiệu về ROG - Republic of Gamers｜Việt Nam | For Those Who Dare",
  description:
    "Tìm hiểu lịch sử và tinh thần Republic of Gamers (ROG) từ năm 2006. Sứ mệnh kiến tạo thế giới không giới hạn cho những game thủ dám thử thách.",
};

const DEFAULT_STORIES = [
  {
    yearTag: "NĂM 2006 // SỰ KHỞI ĐẦU",
    heading: "SỰ RA ĐỜI CỦA BO MẠCH CHỦ GAMING ĐẦU TIÊN",
    content: "Trở lại năm 2006, thị trường gaming PC phát triển nhanh chóng nhưng các bo mạch chủ thời bấy giờ không đáp ứng được nhu cầu ép xung của game thủ. Jonson Lee và nhóm R&D của ASUS đã tạo nên chiếc bo mạch chủ dành riêng cho gaming đầu tiên trên thế giới: ROG Crosshair. Được thiết kế với tản nhiệt đồng ba phần kết nối ống dẫn nhiệt, BIOS tinh chỉnh sâu và mạch cấp nguồn ổn định, Crosshair đã trở thành vũ khí tối thượng giúp game thủ bắn trúng mọi mục tiêu trong tầm ngắm.",
    imageUrl: "/sites/rog-asus/img/mb/hot-crosshair-x870e.webp",
  },
  {
    yearTag: "NĂM 2016 // BƯỚC NGOẶT SIÊU MỎNG",
    heading: "CHUYẾN BAY TRUYỀN CẢM HỨNG CHO CUỘC CÁCH MẠNG ZEPHYRUS",
    content: "Năm 2016, việc phải xách chiếc laptop gaming nặng 4.4kg qua các nhà ga sân bay dài dằng dặc đã thôi thúc lãnh đạo ROG thốt lên: “Chúng ta cần một chiếc laptop gaming nhẹ hơn!” Dự án Zephyrus ra đời. Với hệ thống Khí động lực Chủ động (AAS), ROG đã đưa sức mạnh máy bàn vào khung máy siêu mỏng nhẹ từ hợp kim nhôm CNC, khai sinh kỷ nguyên laptop gaming siêu mỏng nhẹ hàng đầu thế giới.",
    imageUrl: "/sites/rog-asus/img/hero/zephyrus-g14.webp",
  },
  {
    yearTag: "NĂM 2008 // ĐỈNH CAO CARD ĐỒ HỌA",
    heading: "KHÁM PHÁ MATRIX & TIÊN PHONG CÔNG NGHỆ ĐÈN LED RGB",
    content: "Năm 2008, ROG ra mắt card đồ họa Matrix đầu tiên, nâng tầm toàn ngành với khả năng ép xung vượt trội. Đặc biệt, chiếc ROG Matrix GeForce GTX 285 là card đồ họa đầu tiên trên thế giới trang bị đèn LED đổi màu theo mức tải GPU. Từ ý tưởng tiên phong đó, hệ sinh thái ánh sáng Aura Sync RGB đã ra đời, trở thành nét thẩm mỹ biểu tượng không thể thiếu của mọi góc máy gaming hiện đại.",
    imageUrl: "/sites/rog-asus/img/vga/hot-matrix-5090.webp",
  },
];

export default async function AboutRogPage() {
  let aboutData = null;
  try {
    aboutData = await RogApi.getAboutRog();
  } catch {
    // fallback
  }

  const heroTitle = aboutData?.heroTitle || "FOR THOSE WHO DARE";
  const heroSubtitle =
    aboutData?.heroSubtitle ||
    "Republic of Gamers được sáng lập để theo đuổi sự hoàn hảo, không ngừng vượt qua mọi giới hạn kỹ thuật để mang đến những cỗ máy tối thượng cho game thủ.";
  const manifestoTitle = aboutData?.manifestoTitle || "DÀNH CHO NHỮNG NGƯỜI TÁO BẠO";
  const manifestoText =
    aboutData?.manifestoText ||
    "Republic of Gamers là nền tảng uy tín cho phép theo đuổi sự hoàn hảo và không ngừng thúc đẩy giới hạn. Mỗi vết sẹo chiến tích là một huy chương danh dự—cái giá của chiến thắng. Chúng tôi tôn vinh những người dám phiêu lưu và đối mặt với nỗi sợ hãi của chính mình. Nếu bạn cam kết sẽ là chính mình và chiến đấu vì đồng đội, Republic of Gamers trông cậy vào bạn.";

  const stories =
    aboutData?.stories && aboutData.stories.length > 0
      ? aboutData.stories
      : DEFAULT_STORIES;

  return (
    <div className="rog-page">
      <RogNavbar />
      <RogPromoBar />

      <main className="rog-about">
        {/* Hero banner */}
        <section className="rog-about-hero">
          <span className="rog-about-badge">EST. 2006 // REPUBLIC OF GAMERS</span>
          <h1 className="rog-about-hero-title">{heroTitle}</h1>
          <p className="rog-about-hero-subtitle">{heroSubtitle}</p>
        </section>

        {/* Breadcrumb */}
        <div className="rog-about-crumb">
          <Link href="/">Trang chủ</Link>
          <span>›</span>
          <span>Giới thiệu về ROG</span>
        </div>

        <div className="rog-about-container">
          {/* 3 Core Pillars: SỨ MỆNH - TẦM NHÌN - QUYẾT TÂM */}
          <section className="rog-about-pillars">
            <div className="rog-about-pillar">
              <div className="rog-about-pillar-tag">{"// SỨ MỆNH"}</div>
              <h2 className="rog-about-pillar-title">THẾ GIỚI KHÔNG GIỚI HẠN</h2>
              <p className="rog-about-pillar-text">
                Thông qua việc sáng tạo nên những sản phẩm đem lại trải nghiệm xuất sắc cho mọi
                game thủ, chúng tôi xây dựng một thế giới không có giới hạn, nơi đam mê gaming
                được giải phóng tối đa.
              </p>
            </div>

            <div className="rog-about-pillar">
              <div className="rog-about-pillar-tag">{"// TẦM NHÌN"}</div>
              <h2 className="rog-about-pillar-title">KHAI PHÓNG TIỀM NĂNG</h2>
              <p className="rog-about-pillar-text">
                Với chúng tôi, mọi game thủ đều có thể phát huy được tiềm năng thực sự của mình
                khi cùng nhau sát cánh trong những trận chiến kịch tính nhất của thế giới ảo.
              </p>
            </div>

            <div className="rog-about-pillar">
              <div className="rog-about-pillar-tag">{"// QUYẾT TÂM"}</div>
              <h2 className="rog-about-pillar-title">ĐỘT PHÁ KHÁC BIỆT</h2>
              <p className="rog-about-pillar-text">
                “Đột phá khác biệt” chính là giá trị cốt lõi của gaming. Để phá vỡ, để pha trộn,
                để nổi loạn: đây là những cách thức giúp game thủ thể hiện bản sắc đích thực của họ.
              </p>
            </div>
          </section>

          {/* Manifesto Banner */}
          <section className="rog-about-manifesto">
            <h2>{manifestoTitle}</h2>
            <p>{manifestoText}</p>
          </section>

          {/* Historical Stories */}
          <section className="rog-about-stories">
            {stories.map((story, idx) => (
              <article className="rog-about-story" key={idx}>
                <div className="rog-about-story-content">
                  <div className="rog-about-story-year">{story.yearTag}</div>
                  <h3 className="rog-about-story-heading">{story.heading}</h3>
                  <p className="rog-about-story-text">{story.content}</p>
                </div>
                {story.imageUrl && (
                  <div className="rog-about-story-media">
                    <img
                      src={story.imageUrl}
                      alt={story.heading}
                      loading="lazy"
                    />
                  </div>
                )}
              </article>
            ))}
          </section>
        </div>

        <RogJoinRepublic />
      </main>

      <RogFooter />
      <RogChatWidget variant="greeting" />
    </div>
  );
}
