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
    id: "nghenhin-2023",
    title: "EDITORS' CHOICE AWARDS 2023",
    issuer:
      "ROG Ally sở hữu cấu hình mạnh mẽ trong một thân hình nhỏ gọn, trở thành máy chơi game cầm tay tốt nhất năm 2023 do EDITORS' CHOICE bình chọn.",
    logo: "/sites/rog-asus/rog-ally-2023/awards/award-nghenhin-2023.png",
    link: "https://nghenhinvietnam.vn/editors-choice-awards-2023-rog-ally-may-choi-game-cam-tay-cua-nam",
  },
  {
    id: "tgs-2023",
    title: "Editor's Choice Awards 2023",
    issuer:
      "Thiết kế ấn tượng, hiệu suất chơi game tốt, đặc biệt người dùng có thể chơi tiếp các màn game trên nền tảng Steam ở bất kỳ đâu, chế độ hậu mãi tốt…, ROG Ally xứng đáng giành giải 'Máy game cầm tay tốt nhất năm' của Editor's Choice Awards 2023.",
    logo: "/sites/rog-asus/rog-ally-2023/awards/award-tgs-2023.png",
    link: "https://tgs.vn/trai-nghiem/giai-thuong-editors-choice-awards-2023-asus-rog-ally-may-choi-game-cam-tay-tot-nhat-nam/",
  },
  {
    id: "tinhte-2023-1",
    title: "Tinh Tế Bình Chọn 2023 — PC Handheld Yêu Thích Nhất",
    issuer:
      "ASUS ROG Ally: PC Handheld yêu thích nhất nhờ hiệu năng mang lại vượt trội hoàn toàn so với các đối thủ cùng phân khúc.",
    logo: "/sites/rog-asus/rog-ally-2023/awards/award-tinhte-2023-1.png",
    link: "https://tinhte.vn/thread/asus-rog-ally-pc-handheld-yeu-thich-nhat.3746991/",
  },
  {
    id: "tinhte-2023-2",
    title: "Tinh Tế Bình Chọn 2023 — Handheld PC Đáng Mua Nhất",
    issuer:
      "Handheld PC đáng mua ROG Ally, thoả mãn những ý tưởng tưởng như sẽ không bao giờ thành sự thật: chơi game AAA ở mọi lúc mọi nơi.",
    logo: "/sites/rog-asus/rog-ally-2023/awards/award-tinhte-2023-2.png",
    link: "https://tinhte.vn/thread/handheld-pc-dang-mua-rog-ally.3745496/",
  },
  {
    id: "genk-2023",
    title: "Better Choice Awards 2023",
    issuer:
      "Khả năng chơi game PC mọi lúc mọi nơi đã giúp ASUS ROG Ally chiến thắng hạng mục Thiết bị chơi game đột phá và đổi mới sáng tạo trong ứng dụng giải trí.",
    logo: "/sites/rog-asus/rog-ally-2023/awards/award-genk-2023.png",
    link: "https://genk.vn/better-choice-awards-2023-he-lo-san-pham-chien-thang-hang-muc-thiet-bi-choi-game-dot-pha-va-doi-moi-sang-tao-trong-ung-dung-giai-tri-2023102920051522.chn",
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
    id: "baomoi",
    outlet: "BaoMoi",
    quote:
      "ROG Ally - máy chơi game cầm tay chạy trên nền tảng Windows 11 đầu tiên được xem là đối thủ cạnh tranh trực tiếp với các thiết bị chơi game cầm tay cao cấp trên thị trường.",
    logo: "/sites/rog-asus/rog-ally-2023/awards/media-baomoi.png",
    link: "https://baomoi.com/rog-ally-may-choi-game-cam-tay-tren-nen-tang-windows-11-co-gia-gan-20-trieu-dong/c/45800784.epi",
  },
  {
    id: "geekculture",
    outlet: "Geek Culture",
    quote: "We Played Diablo IV On The ROG Ally And Its Performance Slayed!",
    logo: "/sites/rog-asus/rog-ally-2023/awards/media-geekculture.png",
    link: "https://geekculture.co/we-played-diablo-iv-on-the-rog-ally-and-its-performance-slayed/",
  },
  {
    id: "xataka",
    outlet: "XATAKA",
    quote: "When we tested the new Asus Rog Ally, I told you here that this portable console promised a lot.",
    logo: "/sites/rog-asus/rog-ally-2023/awards/media-xataka.png",
    link: "https://youtu.be/5m77J0_BUSY",
  },
];

type RecommendHandheld = {
  id: string;
  name: string;
  img: string;
  link: string;
  buyUrl?: string;
};

const RECOMMEND_PRODUCTS: RecommendHandheld[] = [
  {
    id: "ally-x-2025",
    name: "ROG Xbox Ally X (2025) RC73XA",
    img: "/sites/rog-asus/rog-ally-2023/recommend/ally-x-2025.webp",
    link: "/vn/gaming-handhelds/rog-ally/rog-xbox-ally-x-2025",
  },
  {
    id: "ally-case-2in1",
    name: "ROG Xbox Ally (2-in-1) Premium Case",
    img: "/sites/rog-asus/rog-ally-2023/recommend/ally-case-2in1.webp",
    link: "/vn/gaming-handhelds/accessories/rog-xbox-ally-2-in-1-premium-case",
  },
  {
    id: "ally-travel-case",
    name: "ROG Ally Travel Case",
    img: "/sites/rog-asus/rog-ally-2023/recommend/ally-travel-case.webp",
    link: "/vn/gaming-handhelds/accessories/rog-ally-travel-case",
    buyUrl: "https://vn.store.asus.com/tui-dung-cho-may-choi-game-cam-tay-asus-rog-ally-travel-case.html",
  },
  {
    id: "ally-2025-rc73ya",
    name: "ROG Xbox Ally (2025) RC73YA",
    img: "/sites/rog-asus/rog-ally-2023/recommend/ally-2025-rc73ya.webp",
    link: "/vn/gaming-handhelds/rog-ally/rog-xbox-ally-2025",
  },
  {
    id: "ally-x-2024",
    name: "ROG Ally X (2024) RC72LA",
    img: "/sites/rog-asus/rog-ally-2023/recommend/ally-x-2024.webp",
    link: "/vn/gaming-handhelds/rog-ally/rog-ally-x-2024",
    buyUrl: "https://vn.store.asus.com/may-choi-game-cam-tay-rog-ally-x-rc72la-nh007w.html",
  },
  {
    id: "zephyrus-duo",
    name: "ROG Zephyrus Duo (2026) GX651",
    img: "/sites/rog-asus/rog-ally-2023/recommend/zephyrus-duo.webp",
    link: "/vn/laptops/rog-zephyrus/rog-zephyrus-duo-2026",
  },
  {
    id: "flow-z13",
    name: "ROG Flow Z13 (2025) GZ302",
    img: "/sites/rog-asus/rog-ally-2023/recommend/flow-z13.webp",
    link: "/vn/laptops/rog-flow/rog-flow-z13-2025",
  },
  {
    id: "raikiri",
    name: "ROG Raikiri Pro Controller",
    img: "/sites/rog-asus/rog-ally-2023/recommend/raikiri.webp",
    link: "/vn/controllers/rog-raikiri-model",
  },
];

const DISCLAIMERS: string[] = [
  "Các sản phẩm do Ủy ban Truyền thông Liên bang và Công nghiệp Canada chứng nhận sẽ được phân phối tại Hoa Kỳ và Canada. Vui lòng truy cập các trang web của ASUS Hoa Kỳ và ASUS Canada để biết thêm thông tin về các sản phẩm sẵn có tại địa phương.",
  "Tất cả các thông số có thể thay đổi mà không có thông báo. Vui lòng kiểm tra với nhà cung cấp để biết chính xác về gói sản phẩm cung cấp. Các sản phẩm có thể không có trên tất cả các thị trường.",
  "Thuật và tính năng khác nhau theo model sản phẩm và mọi hình ảnh chỉ mang tính chất minh họa. Vui lòng tham khảo các trang thông số kỹ thuật để biết chi tiết đầy đủ.",
  "Màu PCB và các phiên bản phần mềm đi kèm đều có thể thay đổi mà không thông báo trước.",
  "Brand and product names mentioned are trademarks of their respective companies.",
  "Nếu không có giải thích thêm, các căn cứ về hiệu năng dựa trên hiệu năng lý thuyết. Số liệu thực tế có thể thay đổi tùy theo trường hợp thực tế.",
  "Tốc độ truyền dữ liệu thực tế của USB 3.0, 3.1, 3.2 và / hoặc Type-C sẽ khác nhau tùy thuộc vào nhiều yếu tố bao gồm tốc độ xử lý của thiết bị chủ, thuộc tính tệp và các yếu tố khác liên quan đến cấu hình hệ thống cũng như môi trường hoạt động.",
];


export function RogAllyAwardsAndReviews() {
  const [activeVideoModal, setActiveVideoModal] = useState<string | null>(null);

  return (
    <div id="awards" className="ally-post-features-wrap" style={{ backgroundColor: "#000", color: "#fff" }}>
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
                  className="ProductOverviewAwardsContent__rewardContainer__DcEna"
                  style={{ width: "100%", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "24px" }}
                >
                  {AWARDS.map((award) => (
                    <div
                      key={award.id}
                      className="ProductOverviewAwardsItem__rewardItem__Pqq8U"
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
                  className="ProductOverviewAwardsVideoContent__awardVideoContainer__pau8D ProductOverviewAwardsVideoContent__productVideoItemOnlyOne__QKbvr"
                  style={{ width: "100%", maxWidth: "720px", margin: "0 auto" }}
                >
                  <div
                    aria-label="Play video"
                    role="group"
                    className="AwardVideo__actionVideoContent__EhXqJ AwardVideo__overviewVideo__17AQA ProductOverviewAwardsVideoContent__videoReviewItem__F2Fjj"
                    style={{ position: "relative", cursor: "pointer", overflow: "hidden", borderRadius: "8px", border: "1px solid #222" }}
                    onClick={() => setActiveVideoModal("https://www.youtube-nocookie.com/embed/xBU-Rs4LLTA?autoplay=1")}
                  >
                    <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", backgroundColor: "#000" }}>
                      <img
                        src="/sites/rog-asus/rog-ally-2023/video-cover.jpg"
                        alt="ROG Ally Video Review"
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
                        The best Handheld i have used till now
                      </p>
                      <p style={{ fontSize: "13px", color: "#888", marginTop: "6px", margin: "6px 0 0" }}>
                        Tech Reviewer: Đánh giá chi tiết trải nghiệm thực tế máy chơi game cầm tay ROG Ally (2023)
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
                  className="ProductOverviewAwardsContent__rewardContainer__DcEna"
                  style={{ width: "100%", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "24px" }}
                >
                  {MEDIA_REVIEWS.map((media) => (
                    <div
                      key={media.id}
                      className="ProductOverviewMediaItem__mediaItem__AT0ID"
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
              <div style={{ fontSize: "48px", fontWeight: 900, color: "#ff0036", lineHeight: 1 }}>4.8</div>
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
                onClick={async () => { const ok = await RogApi.submitProductReview("handhelds/rog-ally/rog-ally-2023", "Khách hàng muốn gửi đánh giá sản phẩm ROG Ally 2023.", 5); alert(ok ? "Cảm ơn bạn! Đánh giá đã được gửi và sẽ được duyệt." : "Không thể gửi đánh giá lúc này."); }}
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
                title="ROG Ally Video Review"
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

export function RogAllyFooterContent() {
  const [recPage, setRecPage] = useState(0);
  const recPerPage = 4;
  const totalRecPages = Math.ceil(RECOMMEND_PRODUCTS.length / recPerPage);
  const currentRecs = RECOMMEND_PRODUCTS.slice(
    recPage * recPerPage,
    (recPage + 1) * recPerPage
  );

  return (
    <div className="ally-footer-content-wrap" style={{ backgroundColor: "#000", color: "#fff" }}>
      {/* 3. RECOMMENDED HANDHELDS & RELATED ECOSYSTEM                 */}
      {/* ============================================================ */}
      <div className="productRecommendRelatedContainer" style={{ marginTop: "80px" }}>
        <div className="ProductRecommendRelated__productRecommendRelatedWrapper__8USX2" style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
          <div className="RecommendRelatedBox__recommendRelatedBox__KKRhC">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
              <div className="RecommendRelatedBox__recommendRelateTitle__5hEeM">
                <h2 className="vnRogFont" style={{ fontSize: "28px", fontWeight: 800, margin: 0 }}>
                  Sản phẩm được đề xuất &amp; Hệ sinh thái ROG
                </h2>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  aria-label="Previous slide"
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
                  aria-label="Next slide"
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
                {currentRecs.map((prod) => (
                  <div
                    key={prod.id}
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
                      href={prod.link}
                      aria-label={prod.name}
                      className="RecommendRelatedItem__recommendRelatedItemTopContent__SCXs9"
                      style={{ textDecoration: "none", color: "inherit", width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}
                    >
                      <div className="RecommendRelatedItem__recommendRelatedItemImageBox__uqJTU" style={{ height: "160px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                        <img
                          src={prod.img}
                          alt={prod.name}
                          loading="lazy"
                          style={{ maxHeight: "140px", maxWidth: "220px", objectFit: "contain" }}
                        />
                      </div>
                      <div className="RecommendRelatedItem__recommendRelatedName__PL6NZ">
                        <h3 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 16px", minHeight: "44px", color: "#fff" }}>
                          {prod.name}
                        </h3>
                      </div>
                    </Link>

                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", marginTop: "auto" }}>
                      {prod.buyUrl ? (
                        <div className="RecommendRelatedItem__productCustomizeButton__Uh69i">
                          <div className="ButtonRed__redFullButton__0lMzl ButtonRed__isSmall__MI8RB">
                            <a
                              href={prod.buyUrl}
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
                          href={prod.link}
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

              {/* Bullets */}
              <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "24px" }}>
                {Array.from({ length: totalRecPages }).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    aria-label={`Go to slide ${idx + 1}`}
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
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. DISCLAIMERS & TECHNICAL FOOTNOTES WITH HDMI LOGO           */}
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

      </div>
  );
}

export default function RogAlly2023PostFeatures() {
  return (
    <>
      <RogAllyAwardsAndReviews />
      <RogAllyFooterContent />
    </>
  );
}
