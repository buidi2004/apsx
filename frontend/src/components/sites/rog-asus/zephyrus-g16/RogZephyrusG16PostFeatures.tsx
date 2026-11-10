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
    id: "time-2024",
    title: "World's Best Brands",
    issuer:
      "Republic of Gamers (ROG) announced that it has been awarded as one of the World’s Best Brands 2024 by TIME in the United States in the Consumer Electronics and Gaming Hardware and Peripherals category.",
    logo: "/sites/rog-asus/zephyrus-g16/awards/award-time-2024.png",
    link: "https://time.com/7177358/worlds-best-brands-united-states-2024/",
  },
  {
    id: "computerhoy-92",
    title: "92 / 100",
    issuer: "It has shown me that you can take top-tier gaming anywhere.",
    logo: "/sites/rog-asus/zephyrus-g16/awards/award-score-92.png",
    link: "https://computerhoy.20minutos.es/dispositivos/asus-rog-zephyrus-g16-2025-me-ha-demostrado-gaming-top-puedes-llevarlo-cualquier-lado-1480628",
  },
  {
    id: "muycomputer-rec",
    title: "Recommended product",
    issuer:
      "Highly recommended if you are looking for a compact device that weighs less than two kilograms and is still capable of delivering a good level of performance in both professional applications and demanding games.",
    logo: "/sites/rog-asus/zephyrus-g16/awards/award-recommended.png",
    link: "https://www.muycomputer.com/2025/08/05/asus-rog-zephyrus-g16-2025-analisis-completo-con-geforce-rtx-5070/",
  },
];

type MediaReview = {
  id: string;
  outlet: string;
  quote: string;
  logo: string;
  link: string;
};

const MEDIA_REVIEWS: MediaReview[] = [
  {
    id: "hungrygeeks",
    outlet: "HungryGeeks.ph",
    quote:
      "The ASUS ROG Zephyrus G16 2025 proves that the thin and light segment for gaming laptops have plenty of performance despite their space constraint.",
    logo: "/sites/rog-asus/zephyrus-g16/awards/media-hungrygeeks.png",
    link: "https://hungrygeeks.com.ph/rog-zephyrus-g16-2025-review-premium-mobile-performance/",
  },
  {
    id: "unbox",
    outlet: "unbox.ph",
    quote:
      "a masterful addition to the line that has always been known to deliver great gaming performance for its form factor",
    logo: "/sites/rog-asus/zephyrus-g16/awards/media-unbox.png",
    link: "https://unbox.ph/gadget/rog-zephyrus-g16-review-philippines/",
  },
];

type RelatedArticle = {
  id: string;
  title: string;
  desc: string;
  img: string;
  link: string;
};

const RELATED_ARTICLES: RelatedArticle[] = [
  {
    id: "art-1",
    title: "Laptop Gaming Chọn Chip Intel Hay AMD: Đâu Là Lựa Chọn Tốt Nhất 2026?",
    desc: "Khi chọn laptop gaming Intel hay AMD, điểm khác biệt không chỉ là logo mà nằm ở cách hai nền tảng xử lý game, đồ họa và AI trong suốt một ngày dùng.",
    img: "/sites/rog-asus/zephyrus-g16/articles/art1.webp",
    link: "https://rog.asus.com/vn/articles/guides/chon-laptop-gaming-intel-hay-amd/",
  },
  {
    id: "art-2",
    title: "TOP GAME ANIME HÀNH ĐỘNG NHẬP VAI (ARPG) ĐỒ HỌA CỰC ĐỈNH CHO LAPTOP GAMING ROG",
    desc: "Dòng game Anime hành động nhập vai (ARPG) luôn có sức hút mãnh liệt nhờ đồ họa mãn nhãn và lối chơi kịch tính, rất thích hợp chơi trên các dòng laptop gaming ROG.",
    img: "/sites/rog-asus/zephyrus-g16/articles/art2.webp",
    link: "https://rog.asus.com/vn/articles/gaming/top-game-anime-hanh-dong-nhap-vai-arpg/",
  },
  {
    id: "art-3",
    title: "Lưu Ý Khi Chọn Mua Laptop RTX 50 Series Để Giải Trí Và Làm Sáng Tạo",
    desc: "Laptop RTX 50 series là thế hệ laptop dùng GPU NVIDIA Blackwell mới, tập trung rất mạnh vào hiệu năng AI, ray tracing và tối ưu điện năng cho thiết kế mỏng nhẹ.",
    img: "/sites/rog-asus/zephyrus-g16/articles/art3.webp",
    link: "https://rog.asus.com/vn/articles/guides/huong-dan-mua-laptop-rtx-50-series/",
  },
  {
    id: "art-4",
    title: "Sức Mạnh Laptop RTX 50 Series: Ai Nên Nâng Cấp Và Giá Bao Nhiêu Trong Năm Nay?",
    desc: "Laptop RTX 50 Series mang lại cấu hình laptop mạnh vượt trội, là lý do thuyết phục để game thủ và dân đồ họa nâng cấp laptop giúp việc đầu tư cho công việc và giải trí trở nên xứng đáng hơn.",
    img: "/sites/rog-asus/zephyrus-g16/articles/art4.webp",
    link: "https://rog.asus.com/vn/articles/guides/tu-van-laptop-rtx-50-series/",
  },
  {
    id: "art-5",
    title: "Top 3 Phần Mềm Laptop ASUS ROG Chính Chủ Buộc Phải Có Để Tối Ưu Hiệu Năng",
    desc: "Việc cài đặt phần mềm laptop chuẩn xác không chỉ giúp tối ưu hoạt động mượt mà, mát mẻ hơn mà còn kéo dài tuổi thọ linh kiện. Dưới đây là bộ công cụ gồm các ứng dụng ASUS chính hãng và tiện ích bổ trợ giúp tối ưu hiệu năng chơi game lên mức cao nhất.",
    img: "/sites/rog-asus/zephyrus-g16/articles/art5.webp",
    link: "https://rog.asus.com/vn/articles/guides-software/phan-mem-laptop-rog/",
  },
  {
    id: "art-6",
    title: "So Sánh ROG Strix G16 Và Zephyrus G16 (2025): Game Thủ Nên Chọn Laptop Gaming Nào?",
    desc: "Giữa ROG Strix G16 và ROG Zephyrus G16, nên chọn laptop gaming nào theo nhu cầu, so sánh chi tiết các tiêu chí về hiệu năng, cũng như giá thành.",
    img: "/sites/rog-asus/zephyrus-g16/articles/art6.webp",
    link: "https://rog.asus.com/vn/articles/guides/chon-laptop-gaming-rog/",
  },
  {
    id: "art-7",
    title: "Hướng Dẫn Chọn Laptop Gaming Dành Cho Bạn: Màn Hình, GPU, Tản Nhiệt",
    desc: "Chọn laptop gaming phù hợp. So sánh Strix (hiệu năng tối đa), Zephyrus (cân bằng), và Flow (linh hoạt) để tìm ra cỗ máy chiến game lý tưởng cho bạn.",
    img: "/sites/rog-asus/zephyrus-g16/articles/art7.webp",
    link: "https://rog.asus.com/vn/articles/hands-on/huong-dan-chon-laptop-gaming-phu-hop/",
  },
  {
    id: "art-8",
    title: "ROG XBOX ALLY VS. LAPTOP GAMING: Lựa Chọn Nào Dành Cho Bạn?",
    desc: "Nên chọn ROG Xbox Ally cơ động hay laptop gaming mạnh mẽ? So sánh hiệu năng, tính đa dụng, và khả năng nâng cấp của Strix, Zephyrus và Ally để tìm ra cỗ máy của bạn.",
    img: "/sites/rog-asus/zephyrus-g16/articles/art8.webp",
    link: "https://rog.asus.com/vn/articles/rog-gaming-laptops/lua-chon-thiet-bi-gaming-phu-hop/",
  },
];

type RecommendLaptop = {
  id: string;
  name: string;
  img: string;
  link: string;
  buyUrl?: string;
};

const RECOMMEND_LAPTOPS: RecommendLaptop[] = [
  {
    id: "g16-2025",
    name: "ROG Zephyrus G16 (2025) GU605",
    img: "/sites/rog-asus/zephyrus-g16/recommend/g16-2025.webp",
    link: "/vn/laptops/rog-zephyrus/rog-zephyrus-g16-2025-gu605/",
    buyUrl:
      "https://vn.store.asus.com/laptop-gaming-ai-rog-zephyrus-g16-gu605cx-qr083w.html?utm_source=productpage&utm_medium=button&utm_campaign=25q1_ecom-preorder_vn&utm_content=rtx50",
  },
  {
    id: "g14-2025",
    name: "ROG Zephyrus G14 (2025) GA403",
    img: "/sites/rog-asus/zephyrus-g16/recommend/g14-2025.webp",
    link: "/vn/laptops/rog-zephyrus/rog-zephyrus-g14-2025/",
    buyUrl: "https://vn.store.asus.com/laptop-gaming-ai-rog-zephyrus-g14-ga403wm-qs051ws.html",
  },
  {
    id: "duo-2026",
    name: "ROG Zephyrus Duo (2026) GX651",
    img: "/sites/rog-asus/zephyrus-g16/recommend/duo-2026.webp",
    link: "/vn/laptops/rog-zephyrus/rog-zephyrus-duo-2026/",
    buyUrl: "https://vn.store.asus.com/laptop-gaming-ai-rog-zephyrus-duo-2026-gx651ax-sr050ws.html",
  },
  {
    id: "g14-2026-ga403",
    name: "ROG Zephyrus G14 (2026) GA403",
    img: "/sites/rog-asus/zephyrus-g16/recommend/g14-2026-ga403.webp",
    link: "/vn/laptops/rog-zephyrus/rog-zephyrus-g14-2026-ga403/",
  },
  {
    id: "strix-g16-2025",
    name: "ROG Strix G16 (2025) G614",
    img: "/sites/rog-asus/zephyrus-g16/recommend/strix-g16-2025.webp",
    link: "/vn/laptops/rog-strix/rog-strix-g16-2025-g614/",
  },
  {
    id: "g16-2026-gu606",
    name: "ROG Zephyrus G16 (2026) GU606",
    img: "/sites/rog-asus/zephyrus-g16/recommend/g16-2026-gu606.webp",
    link: "/vn/laptops/rog-zephyrus/rog-zephyrus-g16-2026/",
  },
  {
    id: "g14-2026-gu405",
    name: "ROG Zephyrus G14 (2026) GU405",
    img: "/sites/rog-asus/zephyrus-g16/recommend/g14-2026-gu405.webp",
    link: "/vn/laptops/rog-zephyrus/rog-zephyrus-g14-2026-gu405/",
  },
  {
    id: "scar-16-2025",
    name: "ROG Strix SCAR 16 (2025) G635",
    img: "/sites/rog-asus/zephyrus-g16/recommend/scar-16-2025.webp",
    link: "/vn/laptops/rog-strix/rog-strix-scar-16-2025/",
    buyUrl:
      "https://vn.store.asus.com/rog/laptop-gaming-ai-rog-strix-scar-16-g635lx-rw179w.html?utm_source=productpage&utm_medium=button&utm_campaign=25q2_ecom-preorder_vn",
  },
];

type RelatedAccessory = {
  id: string;
  name: string;
  img: string;
  link: string;
};

const RELATED_ACCESSORIES: RelatedAccessory[] = [
  {
    id: "raikiri-ii",
    name: "ROG Raikiri II Xbox Wireless Controller",
    img: "/sites/rog-asus/zephyrus-g16/recommend/raikiri-ii.webp",
    link: "/vn/controllers/rog-raikiri-ii-xbox-wireless-controller/",
  },
  {
    id: "carnyx",
    name: "ROG Carnyx",
    img: "/sites/rog-asus/zephyrus-g16/recommend/carnyx.webp",
    link: "/vn/streaming-kits/rog-carnyx/",
  },
  {
    id: "tessen",
    name: "ROG Tessen Mobile Controller",
    img: "/sites/rog-asus/zephyrus-g16/recommend/tessen.webp",
    link: "/vn/controllers/rog-tessen-mobile-controller/",
  },
];

const DISCLAIMERS: string[] = [
  "Môi trường thử nghiệm tiêu chuẩn của Asus về tuổi thọ pin như sau: Hệ điều hành Windows, mô-đun hiển thị với độ sáng 150 nits, tắt đèn và các cài đặt ứng dụng khác.",
  "Phát lại video: Thử nghiệm được thực hiện khi tắt Wi-Fi / Bluetooth, Windows Power Plan ở chế độ Cân bằng, Chế độ nguồn trên thanh tác vụ được đặt thành Trình tiết kiệm pin, âm lượng hệ thống ở mức 67% và video ở chế độ toàn màn hình, độ phân giải 1080p",
  "Duyệt web: Thử nghiệm được thực hiện với Wi-Fi / Bluetooth, Windows Power Plan ở chế độ Cân bằng, Chế độ nguồn trên thanh tác vụ được đặt thành Pin tốt hơn và sử dụng trang web Weblooper Top50 trong Google Chrome để phát video với thời gian làm mới là 10 giây.",
  "Các yếu tố ảnh hưởng tới thời lượng pin gồm có cấu hình laptop, cài đặt nguồn, và cách sử dụng. Dung lượng pin suy giảm theo thời gian và số lượng chu kỳ.",
  "Thời gian sạc nhanh được áp dụng khi sử dụng bộ điều hợp ASUS/ROG phù hợp được bao gồm cùng với kiểu máy đã chọn và hệ thống nguồn được tắt (thông qua lệnh \"shut down\"). Trong các tình huống tương thích, pin có thể được sạc lại 50% trong vòng 30 phút trong phạm vi nhiệt độ tối ưu từ 20-45 độ C. Thời gian sạc có thể thay đổi +/- 10% do dung sai của hệ thống.",
  "Các thuật ngữ HDMI, HDMI High-Definition Multimedia Interface (Giao diện đa phương tiện độ phân giải cao), thiết kế HDMI và các logo HDMI là các nhãn hiệu đã đăng ký của HDMI Licensing Administrator, Inc.",
  "Cần kiểm tra phiên bản HDMI thực tế của sản phẩm tương ứng trên trang thông số kỹ thuật của sản phẩm.",
  "Thiết bị có cổng RJ45 không hỗ trợ “Power over Ethernet” (PoE), chỉ hỗ trợ truyền gửi dữ liệu.",
  "Các sản phẩm do Ủy ban Truyền thông Liên bang và Công nghiệp Canada chứng nhận sẽ được phân phối tại Hoa Kỳ và Canada. Vui lòng truy cập các trang web của ASUS Hoa Kỳ và ASUS Canada để biết thêm thông tin về các sản phẩm sẵn có tại địa phương.",
  "Tất cả các thông số có thể thay đổi mà không có thông báo. Vui lòng kiểm tra với nhà cung cấp để biết chính xác về gói sản phẩm cung cấp. Các sản phẩm có thể không có trên tất cả các thị trường.",
  "Thuật và tính năng khác nhau theo model sản phẩm và mọi hình ảnh chỉ mang tính chất minh họa. Vui lòng tham khảo các trang thông số kỹ thuật để biết chi tiết đầy đủ.",
  "Màu PCB và các phiên bản phần mềm đi kèm đều có thể thay đổi mà không thông báo trước.",
  "Brand and product names mentioned are trademarks of their respective companies.",
  "Nếu không có giải thích thêm, các căn cứ về hiệu năng dựa trên hiệu năng lý thuyết. Số liệu thực tế có thể thay đổi tùy theo trường hợp thực tế.",
  "Tốc độ truyền dữ liệu thực tế của USB 3.0, 3.1, 3.2 và / hoặc Type-C sẽ khác nhau tùy thuộc vào nhiều yếu tố bao gồm tốc độ xử lý của thiết bị chủ, thuộc tính tệp và các yếu tố khác liên quan đến cấu hình hệ thống cũng như môi trường hoạt động.",
];

export default function RogZephyrusG16PostFeatures() {
  const [activeVideoModal, setActiveVideoModal] = useState<string | null>(null);
  const [articlePage, setArticlePage] = useState(0);
  const [recPage, setRecPage] = useState(0);

  const articlesPerPage = 4;
  const totalArticlePages = Math.ceil(RELATED_ARTICLES.length / articlesPerPage);
  const currentArticles = RELATED_ARTICLES.slice(
    articlePage * articlesPerPage,
    (articlePage + 1) * articlesPerPage
  );

  const recPerPage = 4;
  const totalRecPages = Math.ceil(RECOMMEND_LAPTOPS.length / recPerPage);
  const currentRecLaptops = RECOMMEND_LAPTOPS.slice(
    recPage * recPerPage,
    (recPage + 1) * recPerPage
  );

  return (
    <div id="awards" className="g16-post-features-wrap" style={{ backgroundColor: "#000", color: "#fff" }}>
      {/* ============================================================ */}
      {/* 1. OFFICIAL AWARDS, VIDEO REVIEW & MEDIA REVIEW               */}
      {/* ============================================================ */}
      <div className="awardClone Product__specialOverviewAward__St9uq">
        <div className="ProductOverviewAwards__productOverviewAwards__CtD9H">
          {/* 1A. AWARDS CONTAINER */}
          <div className="ProductOverviewAwardsContent__productAwardContainer__JF3vK ProductOverviewAwardsContent__black__p4RLG">
            <h2 className="awardTitle vnRogFont ProductOverviewAwardsContent__vnRogFontSize__G4nLE">
              Giải thưởng
            </h2>
            <div className="ProductOverviewAwardsContent__productAwardPage__VsRsr">
              <div className="ProductOverviewAwardsContent__productAwardWrapper__uKQ3+">
                <div
                  className="ProductOverviewAwardsContent__rewardContainer__DcEna ProductOverviewAwardsContent__productAwardItemLessThanThree__ppiZq"
                  style={{ width: "100%", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "24px" }}
                >
                  {AWARDS.map((award) => (
                    <div
                      key={award.id}
                      className="ProductOverviewAwardsItem__rewardItem__Pqq8U ProductOverviewAwardsItem__rewardItemLessThanThree__P9dm7"
                      style={{ maxWidth: "360px", flex: "1 1 300px" }}
                    >
                      <a
                        href={award.link}
                        aria-label={`Award of ${award.title}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column", height: "100%" }}
                      >
                        <div className="ProductOverviewAwardsItem__rewardImageWrapper__Hrxbu">
                          <div role="presentation" className="ProductOverviewAwardsItem__rewardImageBox__3iTki">
                            <img
                              src={award.logo}
                              alt={award.title}
                              aria-label={award.title}
                              loading="lazy"
                              style={{ maxHeight: "80px", maxWidth: "160px", objectFit: "contain", margin: "0 auto" }}
                            />
                          </div>
                        </div>
                        <p className="ProductOverviewAwardsItem__rewardItemName__eeEOl" style={{ fontWeight: 700, margin: "16px 0 8px", fontSize: "16px" }}>
                          {award.title}
                        </p>
                        <p style={{ fontSize: "13px", color: "#9e9e9e", lineHeight: 1.6 }}>
                          {award.issuer}
                        </p>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 1B. VIDEO REVIEW CONTAINER */}
          <div className="overviewVideos ProductOverviewAwardsVideoContent__productAwardContainer__Np6oK" style={{ marginTop: "64px" }}>
            <h2 className="videoTitle vnRogFont ProductOverviewAwardsVideoContent__vnRogFontSize__61mN8">
              Video review
            </h2>
            <div className="ProductOverviewAwardsVideoContent__productAwardPage__Aik+I">
              <div className="ProductOverviewAwardsVideoContent__productAwardWrapper__OteNX ProductOverviewAwardsVideoContent__videoAwardWrapper__SPAFj">
                <div
                  className="ProductOverviewAwardsVideoContent__awardVideoContainer__pau8D ProductOverviewAwardsVideoContent__productVideoItemLessThanThree__nOT4E ProductOverviewAwardsVideoContent__productVideoItemOnlyOne__QKbvr"
                  style={{ width: "100%", maxWidth: "720px", margin: "0 auto" }}
                >
                  <div
                    aria-label="Play video"
                    role="group"
                    className="AwardVideo__actionVideoContent__EhXqJ AwardVideo__overviewVideo__17AQA ProductOverviewAwardsVideoContent__videoReviewItem__F2Fjj"
                    style={{ position: "relative", cursor: "pointer", overflow: "hidden", borderRadius: "8px", border: "1px solid #222" }}
                    onClick={() => setActiveVideoModal("https://www.youtube-nocookie.com/embed/xPoc1wYmIIE?autoplay=1")}
                  >
                    <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", backgroundColor: "#000" }}>
                      <img
                        src="/sites/rog-asus/zephyrus-g16/video-cover.jpg"
                        alt="ROG Zephyrus G16 Video Review"
                        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
                      />
                      <button
                        type="button"
                        className="VideoButton__videoButton__XVz9e VideoButton__overviewVideoButton__d9DBl AwardVideo__videoBtn__IPOqS"
                        aria-label="Play"
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          width: "64px",
                          height: "64px",
                          borderRadius: "50%",
                          backgroundColor: "#ff0036",
                          border: "none",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          boxShadow: "0 0 24px rgba(255, 0, 54, 0.6)",
                        }}
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff" style={{ marginLeft: "3px" }}>
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </button>
                    </div>

                    <div className="ProductAwardVideoContent__actionsItemContent__U1plq" style={{ padding: "16px 20px", backgroundColor: "#111" }}>
                      <p className="ProductAwardVideoContent__actionTitle__zPI47" style={{ fontSize: "18px", fontWeight: 700, margin: 0, color: "#fff" }}>
                        It&apos;s a WORK OF ART!
                      </p>
                      <p style={{ fontSize: "13px", color: "#888", marginTop: "6px", margin: "6px 0 0" }}>
                        Reviewer: TecnoForce · Đánh giá trải nghiệm thực tế ROG Zephyrus G16 (2025)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 1C. MEDIA REVIEW CONTAINER */}
          <div className="ProductOverviewAwardsContent__productAwardContainer__JF3vK ProductOverviewAwardsContent__black__p4RLG" style={{ marginTop: "64px" }}>
            <h2 className="awardTitle vnRogFont ProductOverviewAwardsContent__vnRogFontSize__G4nLE">
              Media review
            </h2>
            <div className="ProductOverviewAwardsContent__productAwardPage__VsRsr ProductOverviewAwardsContent__productAwardBorderLine__XDl58">
              <div className="ProductOverviewAwardsContent__productAwardWrapper__uKQ3+ ProductOverviewAwardsContent__productMediaContainer__ijROd">
                <div
                  className="ProductOverviewAwardsContent__rewardContainer__DcEna ProductOverviewAwardsContent__productAwardItemLessThanThree__ppiZq"
                  style={{ width: "100%", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "24px" }}
                >
                  {MEDIA_REVIEWS.map((media) => (
                    <div
                      key={media.id}
                      className="ProductOverviewMediaItem__mediaItem__AT0ID ProductOverviewMediaItem__lessItem__6Kwdn"
                      style={{ maxWidth: "480px", flex: "1 1 340px", backgroundColor: "#0e0e0e", border: "1px solid #222", padding: "28px 24px", borderRadius: "8px" }}
                    >
                      <a
                        href={media.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column", height: "100%" }}
                      >
                        <div className="ProductOverviewMediaItem__mediaImageBox__c69pk" style={{ marginBottom: "16px" }}>
                          <img
                            src={media.logo}
                            alt={media.outlet}
                            style={{ maxHeight: "40px", maxWidth: "160px", objectFit: "contain" }}
                          />
                        </div>
                        <p className="ProductOverviewMediaItem__mediaItemName__i01Sh" style={{ fontWeight: 700, fontSize: "15px", color: "#fff", marginBottom: "8px" }}>
                          {media.outlet}
                        </p>
                        <blockquote style={{ fontSize: "14px", color: "#b3b3b3", lineHeight: 1.6, fontStyle: "italic", margin: 0 }}>
                          &ldquo;{media.quote}&rdquo;
                        </blockquote>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. CUSTOMER REVIEWS (BAZAARVOICE INTEGRATION CONTAINER)        */}
      {/* ============================================================ */}
      <div className="Product__productReviewsWrapper__Q4tw6" style={{ maxWidth: "1280px", margin: "64px auto 0", padding: "0 24px" }}>
        <div className="Product__productReviewsTitle__CsKxo">
          <h2 className="Product__productReviewsTitleText__aEPU6" style={{ fontSize: "28px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>
            CUSTOMER REVIEWS
          </h2>
        </div>
        <div className="Product__productReviews__QyRI4" style={{ backgroundColor: "#111", border: "1px solid #222", borderRadius: "8px", padding: "32px", marginTop: "24px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ fontSize: "48px", fontWeight: 900, color: "#ff0036", lineHeight: 1 }}>4.9</div>
              <div>
                <div style={{ display: "flex", gap: "4px", color: "#ff0036", fontSize: "18px" }}>
                  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
                <div style={{ fontSize: "13px", color: "#888", marginTop: "4px" }}>
                  Dựa trên đánh giá của cộng đồng ROG Gamers toàn cầu
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                type="button"
                onClick={async () => { const ok = await RogApi.submitProductReview("laptops/rog-zephyrus/rog-zephyrus-g16-gu605", "Khách hàng muốn gửi đánh giá sản phẩm ROG Zephyrus G16.", 5); alert(ok ? "Cảm ơn bạn! Đánh giá đã được gửi và sẽ được duyệt." : "Không thể gửi đánh giá lúc này."); }}
                style={{
                  backgroundColor: "#ff0036",
                  color: "#fff",
                  border: "none",
                  padding: "10px 24px",
                  fontWeight: 700,
                  fontSize: "13px",
                  borderRadius: "2px",
                  cursor: "pointer",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                Viết đánh giá
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. RELATED ARTICLES (ROG SAGA CAROUSEL)                      */}
      {/* ============================================================ */}
      <div className="articleClone" style={{ marginTop: "64px" }}>
        <div className="ProductOverviewArticle__productOverviewArticle__KDq5R">
          <div className="ProductOverviewArticle__productOverviewArticleWrapper__vlFiI" style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
              <h2 className="ProductOverviewArticle__articleTitle__AJJzH" style={{ fontSize: "28px", fontWeight: 800, margin: 0 }}>
                BÀI VIẾT LIÊN QUAN
              </h2>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  aria-label="Previous article page"
                  onClick={() => setArticlePage((prev) => (prev > 0 ? prev - 1 : totalArticlePages - 1))}
                  style={{
                    backgroundColor: "#181818",
                    border: "1px solid #333",
                    color: "#fff",
                    width: "40px",
                    height: "40px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ‹
                </button>
                <button
                  type="button"
                  aria-label="Next article page"
                  onClick={() => setArticlePage((prev) => (prev < totalArticlePages - 1 ? prev + 1 : 0))}
                  style={{
                    backgroundColor: "#181818",
                    border: "1px solid #333",
                    color: "#fff",
                    width: "40px",
                    height: "40px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ›
                </button>
              </div>
            </div>

            <div className="ProductOverviewArticle__productOverviewArticleContent__Bkp7h">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
                {currentArticles.map((art) => (
                  <a
                    key={art.id}
                    href={art.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ActionFourItem__actionsItem__nQZ-t"
                    style={{
                      textDecoration: "none",
                      backgroundColor: "#111",
                      border: "1px solid #222",
                      borderRadius: "6px",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      transition: "transform 0.2s, border-color 0.2s",
                    }}
                  >
                    <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", overflow: "hidden" }}>
                      <img
                        src={art.img}
                        alt={art.title}
                        loading="lazy"
                        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                    <div style={{ padding: "20px", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                      <div style={{ marginBottom: "10px" }}>
                        <span
                          style={{
                            backgroundColor: "#ff0036",
                            color: "#fff",
                            fontSize: "10px",
                            fontWeight: 800,
                            letterSpacing: "1px",
                            textTransform: "uppercase",
                            padding: "3px 8px",
                            borderRadius: "2px",
                          }}
                        >
                          POST
                        </span>
                      </div>
                      <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#fff", lineHeight: 1.4, margin: "0 0 10px" }}>
                        {art.title}
                      </h3>
                      <p style={{ fontSize: "12px", color: "#888", lineHeight: 1.6, margin: 0, flexGrow: 1 }}>
                        {art.desc}
                      </p>
                    </div>
                  </a>
                ))}
              </div>

              {/* Bullets */}
              <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "24px" }}>
                {Array.from({ length: totalArticlePages }).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    aria-label={`Go to article slide ${idx + 1}`}
                    onClick={() => setArticlePage(idx)}
                    style={{
                      width: idx === articlePage ? "24px" : "8px",
                      height: "8px",
                      borderRadius: "4px",
                      backgroundColor: idx === articlePage ? "#ff0036" : "#444",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. RECOMMENDED LAPTOPS (8 MODELS) & RELATED ACCESSORIES (3) */}
      {/* ============================================================ */}
      <div className="productRecommendRelatedContainer" style={{ marginTop: "80px" }}>
        <div className="ProductRecommendRelated__productRecommendRelatedWrapper__8USX2" style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
          {/* 4A. RECOMMENDED LAPTOPS */}
          <div className="RecommendRelatedBox__recommendRelatedBox__KKRhC">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
              <div className="RecommendRelatedBox__recommendRelateTitle__5hEeM">
                <h2 className="vnRogFont" style={{ fontSize: "28px", fontWeight: 800, margin: 0 }}>
                  Sản phẩm được đề xuất
                </h2>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  aria-label="Previous laptop slide"
                  onClick={() => setRecPage((prev) => (prev > 0 ? prev - 1 : totalRecPages - 1))}
                  style={{
                    backgroundColor: "#181818",
                    border: "1px solid #333",
                    color: "#fff",
                    width: "40px",
                    height: "40px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ‹
                </button>
                <button
                  type="button"
                  aria-label="Next laptop slide"
                  onClick={() => setRecPage((prev) => (prev < totalRecPages - 1 ? prev + 1 : 0))}
                  style={{
                    backgroundColor: "#181818",
                    border: "1px solid #333",
                    color: "#fff",
                    width: "40px",
                    height: "40px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ›
                </button>
              </div>
            </div>

            <div className="RecommendRelatedBox__recommendRelatedListWrapper__aI6sg">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "24px" }}>
                {currentRecLaptops.map((lap) => (
                  <div
                    key={lap.id}
                    className="RecommendRelatedItem__recommendRelatedItem__Yue-5"
                    style={{
                      backgroundColor: "#111",
                      border: "1px solid #222",
                      borderRadius: "6px",
                      padding: "24px 20px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      position: "relative",
                    }}
                  >
                    <Link
                      href={lap.link}
                      aria-label={lap.name}
                      className="RecommendRelatedItem__recommendRelatedItemTopContent__SCXs9"
                      style={{ textDecoration: "none", color: "inherit", width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}
                    >
                      <div className="RecommendRelatedItem__recommendRelatedItemImageBox__uqJTU" style={{ height: "160px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                        <img
                          src={lap.img}
                          alt={lap.name}
                          loading="lazy"
                          style={{ maxHeight: "140px", maxWidth: "220px", objectFit: "contain" }}
                        />
                      </div>
                      <div className="RecommendRelatedItem__recommendRelatedName__PL6NZ">
                        <h3 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 16px", minHeight: "44px", color: "#fff" }}>
                          {lap.name}
                        </h3>
                      </div>
                    </Link>

                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", marginTop: "auto" }}>
                      {lap.buyUrl ? (
                        <div className="RecommendRelatedItem__productCustomizeButton__Uh69i">
                          <div className="ButtonRed__redFullButton__0lMzl ButtonRed__isSmall__MI8RB">
                            <a
                              href={lap.buyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn ButtonRed__btnRed__SXGza ButtonRed__isFull__6Glcz ButtonRed__isShort__sbOeL"
                              style={{ display: "block", textDecoration: "none" }}
                            >
                              <div className="ButtonRed__inner__U++OE">
                                <span className="buttonName">Mua ngay</span>
                              </div>
                              <div className="ButtonRed__hoverColor__0DIt8" />
                            </a>
                          </div>
                        </div>
                      ) : null}

                      <div className="RecommendRelatedItem__relatedProductMoreBox__MtnMi">
                        <Link
                          href={lap.link}
                          aria-label="TÌM HIỂU THÊM"
                          className="MoreButton__moreButton__c16n8 MoreButton__largerFontSize__BmxsE MoreButton__isBlackBackground__ZbmFL"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "12px",
                            fontWeight: 700,
                            letterSpacing: "1px",
                            color: "#fff",
                            textDecoration: "none",
                            padding: "6px 0",
                          }}
                        >
                          TÌM HIỂU THÊM
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 32 32" fill="#ff0036">
                            <path d="M23.07 13.77L9.06 0v6.7l9.18 8.94-9.18 9.66V32l14.01-14.49 1.87-1.87-1.87-1.87z" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Laptops Bullets */}
              <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "24px" }}>
                {Array.from({ length: totalRecPages }).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    aria-label={`Go to laptop slide ${idx + 1}`}
                    onClick={() => setRecPage(idx)}
                    style={{
                      width: idx === recPage ? "24px" : "8px",
                      height: "8px",
                      borderRadius: "4px",
                      backgroundColor: idx === recPage ? "#ff0036" : "#444",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* 4B. RELATED ACCESSORIES */}
          <div className="RecommendRelatedBox__recommendRelatedBox__KKRhC" style={{ marginTop: "64px" }}>
            <div className="RecommendRelatedBox__recommendRelateTitle__5hEeM" style={{ marginBottom: "32px" }}>
              <h2 className="vnRogFont" style={{ fontSize: "28px", fontWeight: 800, margin: 0 }}>
                Sản phẩm liên quan
              </h2>
            </div>

            <div className="RecommendRelatedBox__recommendRelatedListWrapper__aI6sg">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
                {RELATED_ACCESSORIES.map((acc) => (
                  <div
                    key={acc.id}
                    className="RecommendRelatedItem__recommendRelatedItem__Yue-5"
                    style={{
                      backgroundColor: "#111",
                      border: "1px solid #222",
                      borderRadius: "6px",
                      padding: "24px 20px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    <Link
                      href={acc.link}
                      aria-label={acc.name}
                      className="RecommendRelatedItem__recommendRelatedItemTopContent__SCXs9"
                      style={{ textDecoration: "none", color: "inherit", width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}
                    >
                      <div className="RecommendRelatedItem__recommendRelatedItemImageBox__uqJTU" style={{ height: "160px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                        <img
                          src={acc.img}
                          alt={acc.name}
                          loading="lazy"
                          style={{ maxHeight: "140px", maxWidth: "220px", objectFit: "contain" }}
                        />
                      </div>
                      <div className="RecommendRelatedItem__recommendRelatedName__PL6NZ">
                        <h3 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 16px", minHeight: "44px", color: "#fff" }}>
                          {acc.name}
                        </h3>
                      </div>
                    </Link>

                    <div className="RecommendRelatedItem__relatedProductMoreBox__MtnMi" style={{ marginTop: "auto" }}>
                      <Link
                        href={acc.link}
                        aria-label="TÌM HIỂU THÊM"
                        className="MoreButton__moreButton__c16n8 MoreButton__largerFontSize__BmxsE MoreButton__isBlackBackground__ZbmFL"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          fontSize: "12px",
                          fontWeight: 700,
                          letterSpacing: "1px",
                          color: "#fff",
                          textDecoration: "none",
                          padding: "6px 0",
                        }}
                      >
                        TÌM HIỂU THÊM
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 32 32" fill="#ff0036">
                          <path d="M23.07 13.77L9.06 0v6.7l9.18 8.94-9.18 9.66V32l14.01-14.49 1.87-1.87-1.87-1.87z" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 5. DISCLAIMERS & TECHNICAL FOOTNOTES WITH HDMI LOGO           */}
      {/* ============================================================ */}
      <div
        className="ProductFooter__productFooterContainer__Mu9vd ProductFooter__productBackgroundDarkBlack__NOol7"
        style={{ maxWidth: "1280px", margin: "80px auto 0", padding: "48px 24px 64px", borderTop: "1px solid #1a1a1a" }}
      >
        <div className="ProductFooter__productFooterContent__mXPuo">
          <div className="ProductFooter__productFooterHDMI__watNS" style={{ marginBottom: "24px" }}>
            <img
              src="/sites/rog-asus/zephyrus-g16/HDMI_logo_R_Gray.png"
              alt="Product has High-Definition Multimedia Interface"
              style={{ maxHeight: "28px", width: "auto" }}
            />
          </div>
          <p className="sr-only">Disclaimer</p>
          <div className="ProductFooter__productFooterList__J6HzI">
            <ul style={{ listStyleType: "decimal", paddingLeft: "20px", margin: 0 }}>
              {DISCLAIMERS.map((note, idx) => (
                <li key={idx} style={{ color: "#777", fontSize: "12px", lineHeight: 1.8, marginBottom: "8px" }}>
                  <div>{note}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Video Modal Popup */}
      {activeVideoModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Video Modal"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
          onClick={() => setActiveVideoModal(null)}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "960px",
              backgroundColor: "#000",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 0 40px rgba(0,0,0,0.9)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close video"
              onClick={() => setActiveVideoModal(null)}
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                background: "rgba(0,0,0,0.7)",
                border: "1px solid #444",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                color: "#fff",
                fontSize: "20px",
                cursor: "pointer",
                zIndex: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✕
            </button>
            <div style={{ position: "relative", width: "100%", paddingTop: "56.25%" }}>
              <iframe
                src={activeVideoModal}
                title="Video Review"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
