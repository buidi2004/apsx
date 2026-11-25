"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useState, useEffect } from "react";
import { RogApi, type PublicReviewDto } from "@/lib/api-client";

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
    title: "2026 Red Dot Product Design Winner",
    issuer:
      "By combining highly efficient cooling with a striking exterior design, the ASUS ROG Matrix RTX 5090 sets new standards for ultra-enthusiast computing.",
    logo: "/sites/rog-asus/matrix-5090/img/kv/reddot-winner-2026.png",
    link: "https://rog.asus.com/vn/graphics-cards/graphics-cards/rog-matrix/rog-matrix-rtx5090-p32g-30th/",
  },
  {
    id: "eha-2026",
    title: "EHA 2026 Reader Awards — Best NVIDIA-Based Graphics Cards",
    issuer:
      "Được bình chọn bởi hàng trăm ngàn độc giả từ các tạp chí công nghệ hàng đầu châu Âu (European Hardware Association).",
    logo: "/sites/rog-asus/matrix-5090/img/kv/eha-reader-awards-best-nvidia-based-grahpics-cards.jpg",
    link: "https://rog.asus.com/vn/graphics-cards/graphics-cards/rog-matrix/rog-matrix-rtx5090-p32g-30th/",
  },
  {
    id: "top-class",
    title: "Top Class Flagship Performance Award",
    issuer:
      "The ASUS GeForce RTX 5090 ROG Matrix Platinum is the fastest graphics card we have ever tested. Outstanding liquid metal cooling and BTF power deliver unbeatable overclocking headroom.",
    logo: "https://www.asus.com/media/images/award_logo/1346/202009141915437960192.png",
    link: "https://rog.asus.com/vn/graphics-cards/graphics-cards/rog-matrix/rog-matrix-rtx5090-p32g-30th/",
  },
];

type MediaReview = {
  outlet: string;
  title: string;
  desc: string;
  link: string;
};

const MEDIA_REVIEWS: MediaReview[] = [
  {
    outlet: "Techflow",
    title: "ASUS Nhá Hàng ROG MATRIX GeForce RTX 5090: Card Đồ Họa Đỉnh Cao Dành Cho Người Dùng Đam Mê",
    desc: "Phiên bản kỷ niệm 30 năm kết tinh toàn bộ tinh hoa công nghệ chế tác GPU của ASUS với công suất chịu tải 800W và buồng hơi đồng nguyên khối.",
    link: "https://rog.asus.com/vn/graphics-cards/graphics-cards/rog-matrix/rog-matrix-rtx5090-p32g-30th/",
  },
  {
    outlet: "MMOSite",
    title: "ASUS ra mắt card đồ họa ROG Matrix GeForce RTX 5090 “30th Anniversary Edition”",
    desc: "Thiết kế không dây cáp kết nối ẩn mặt sau BTF kết hợp cùng hệ thống làm mát 4 quạt tạo nên bước đột phá lớn trong thẩm mỹ build PC gaming.",
    link: "https://rog.asus.com/vn/graphics-cards/graphics-cards/rog-matrix/rog-matrix-rtx5090-p32g-30th/",
  },
  {
    outlet: "Tinh Tế",
    title: "Asus ROG Matrix GeForce RTX 5090 30th Anniversary Limited Edition: Kỷ niệm 30 năm Asus làm card đồ họa",
    desc: "Tính năng Memory Defroster độc quyền làm tan băng bộ nhớ GDDR7 trong tích tắc, mở ra tiềm năng phá vỡ mọi kỷ lục ép xung thế giới bằng nitơ lỏng (LN2).",
    link: "https://rog.asus.com/vn/graphics-cards/graphics-cards/rog-matrix/rog-matrix-rtx5090-p32g-30th/",
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
    id: "thor-1600",
    name: "ROG Thor 1600W Titanium",
    tagline: "Nguồn máy tính công suất cực đỉnh chuẩn ATX 3.1 & PCIe 5.1 dành cho card 800W",
    img: "/sites/rog-asus/img/psu/hero-1.webp",
    href: "/vn/power-supply-units-group/",
  },
  {
    id: "pg34wcdn",
    name: "ROG Swift OLED PG34WCDN",
    tagline: "Màn hình cong 34 inch QD-OLED 360Hz 0.03ms UWQHD đỉnh cao trải nghiệm 4K",
    img: "/sites/rog-asus/img/relprod/swift-oled-pg34wcdn.webp",
    href: "/vn/monitors/32-to-34-inches/rog-swift-oled-pg34wcdn/",
  },
  {
    id: "duo-2026",
    name: "ROG Zephyrus Duo (2026)",
    tagline: "Laptop Gaming 2 Màn Hình Cảm Ứng OLED 3K 120Hz Kép Intel Ultra 9 + RTX 5090",
    img: "/sites/rog-asus/img/hot/zephyrus-duo.webp",
    href: "/vn/laptops/rog-zephyrus/rog-zephyrus-duo-2026",
  },
  {
    id: "z13-kjp",
    name: "ROG Flow Z13-KJP (2026)",
    tagline: "Laptop Gaming 2-in-1 Hợp tác cùng KOJIMA PRODUCTIONS AMD AI Max+ 395",
    img: "/sites/rog-asus/img/detail/z13-kjp-front.webp",
    href: "/vn/laptops/rog-flow/rog-flow-z13-kjp",
  },
];

const DISCLAIMERS: string[] = [
  "The terms HDMI and HDMI High-Definition Multimedia Interface, and the HDMI Logo are trademarks or registered trademarks of HDMI Licensing Administrator, Inc. in the United States and other countries.",
  "Các thuật ngữ HDMI, HDMI High-Definition Multimedia Interface, Nhận diện thương mại HDMI (HDMI Trade dress) và Logo HDMI là các nhãn hiệu thương mại hoặc nhãn hiệu thương mại đã đăng ký của HDMI Licensing Administrator, Inc.",
  "Các sản phẩm do Ủy ban Truyền thông Liên bang và Công nghiệp Canada chứng nhận sẽ được phân phối tại Hoa Kỳ và Canada. Vui lòng truy cập các trang web của ASUS Hoa Kỳ và ASUS Canada để biết thêm thông tin về các sản phẩm sẵn có tại địa phương.",
  "Tất cả các thông số có thể thay đổi mà không có thông báo. Vui lòng kiểm tra với nhà cung cấp để biết chính xác về gói sản phẩm cung cấp. Các sản phẩm có thể không có trên tất cả các thị trường.",
  "Thuật và tính năng khác nhau theo model sản phẩm và mọi hình ảnh chỉ mang tính chất minh họa. Vui lòng tham khảo các trang thông số kỹ thuật để biết chi tiết đầy đủ.",
  "Màu PCB và các phiên bản phần mềm đi kèm đều có thể thay đổi mà không thông báo trước.",
  "Tên thương hiệu và sản phẩm được đề cập là nhãn hiệu của các công ty tương ứng.",
  "Nếu không có giải thích thêm, các căn cứ về hiệu năng dựa trên hiệu năng lý thuyết. Số liệu thực tế có thể thay đổi tùy theo trường hợp thực tế.",
  "Tốc độ truyền dữ liệu thực tế của USB 3.0, 3.1, 3.2 và / hoặc Type-C sẽ khác nhau tùy thuộc vào nhiều yếu tố bao gồm tốc độ xử lý của thiết bị chủ, thuộc tính tệp và các yếu tố khác liên quan đến cấu hình hệ thống cũng như môi trường hoạt động.",
];

export default function RogCardMatrix5090PostFeatures() {
  const [activeVideoModal, setActiveVideoModal] = useState<string | null>(null);

  // Live reviews state
  const [reviews, setReviews] = useState<PublicReviewDto[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewerName, setReviewerName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewContent, setReviewContent] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState("");

  // Newsletter state
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    RogApi.getProductReviews("graphics-cards/rog-matrix/rog-matrix-rtx5090-p32g-30th")
      .then((data) => {
        if (data) setReviews(data);
      })
      .catch(() => {});
  }, []);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewContent.trim()) return;
    try {
      setSubmittingReview(true);
      await RogApi.submitProductReview(
        "graphics-cards/rog-matrix/rog-matrix-rtx5090-p32g-30th",
        reviewContent.trim(),
        reviewRating,
        reviewerName.trim() || undefined
      );
      setReviewSuccessMsg("Cảm ơn bạn! Đánh giá đã được gửi và sẽ hiển thị sau khi quản trị viên phê duyệt.");
      setReviewContent("");
      setTimeout(() => setShowReviewForm(false), 2000);
    } catch {
      alert("Gửi đánh giá không thành công, vui lòng thử lại sau.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    if (await RogApi.subscribeNewsletter(email.trim())) setIsSubscribed(true);
  };

  return (
    <div id="awards" className="matrix-post-features-wrap" style={{ backgroundColor: "#0b0b0b", color: "#fff" }}>
      {/* 1. AWARDS & ACCOLADES SECTION */}
      <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "64px 24px 32px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <span style={{ color: "#ff0036", fontWeight: 700, fontSize: "14px", letterSpacing: "2px", textTransform: "uppercase" }}>
            VINH DANH TOÀN CẦU
          </span>
          <h2 style={{ fontSize: "36px", fontWeight: 800, marginTop: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>
            GIẢI THƯỞNG & CÔNG NHẬN
          </h2>
          <div style={{ width: "60px", height: "3px", backgroundColor: "#ff0036", margin: "16px auto 0" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
          {AWARDS.map((award) => (
            <div
              key={award.id}
              style={{
                backgroundColor: "#141414",
                border: "1px solid #262626",
                borderRadius: "8px",
                padding: "32px 24px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                transition: "border-color 0.2s, transform 0.2s",
              }}
            >
              <div style={{ height: "90px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
                <img
                  src={award.logo}
                  alt={award.title}
                  style={{ maxHeight: "85px", maxWidth: "180px", objectFit: "contain" }}
                />
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#fff", marginBottom: "12px", lineHeight: 1.4 }}>
                {award.title}
              </h3>
              <p style={{ fontSize: "14px", color: "#9e9e9e", lineHeight: 1.6, flexGrow: 1 }}>
                {award.issuer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 2. VIDEO REVIEW SECTION */}
      <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 24px 48px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <span style={{ color: "#ff0036", fontWeight: 700, fontSize: "14px", letterSpacing: "2px", textTransform: "uppercase" }}>
            ĐÁNH GIÁ CHUYÊN SÂU
          </span>
          <h2 style={{ fontSize: "32px", fontWeight: 800, marginTop: "8px", textTransform: "uppercase" }}>
            VIDEO REVIEW
          </h2>
          <div style={{ width: "60px", height: "3px", backgroundColor: "#ff0036", margin: "16px auto 0" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "24px" }}>
          <div
            style={{
              backgroundColor: "#141414",
              border: "1px solid #262626",
              borderRadius: "8px",
              overflow: "hidden",
              cursor: "pointer",
            }}
            onClick={() => setActiveVideoModal("https://www.youtube-nocookie.com/embed/AHMJeQy5kqw?autoplay=1")}
          >
            <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", backgroundColor: "#000" }}>
              <img
                src="/sites/rog-asus/matrix-5090/video/product.jpg"
                alt="ROG Matrix RTX 5090 Review"
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 0, 54, 0.9)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 20px rgba(255, 0, 54, 0.5)",
                }}
              >
                <svg viewBox="0 0 24 24" fill="#fff" width="28" height="28" style={{ marginLeft: "4px" }}>
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            <div style={{ padding: "20px" }}>
              <h4 style={{ fontSize: "16px", fontWeight: 700, color: "#fff", lineHeight: 1.4 }}>
                The Most Powerful GPU has Zero Cables... | ROG Matrix RTX 5090 BTF Build
              </h4>
              <p style={{ fontSize: "13px", color: "#888", marginTop: "8px" }}>
                Kênh công nghệ quốc tế trải nghiệm chiếc card đồ họa mạnh nhất thế giới không dây cáp nguồn lộ thiên.
              </p>
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#141414",
              border: "1px solid #262626",
              borderRadius: "8px",
              overflow: "hidden",
              cursor: "pointer",
            }}
            onClick={() => setActiveVideoModal("https://www.youtube-nocookie.com/embed/AHMJeQy5kqw?autoplay=1")}
          >
            <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", backgroundColor: "#000" }}>
              <img
                src="/sites/rog-asus/matrix-5090/video/copper.jpg"
                alt="ROG Matrix 5090 Buồng hơi tản nhiệt"
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 0, 54, 0.9)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 20px rgba(255, 0, 54, 0.5)",
                }}
              >
                <svg viewBox="0 0 24 24" fill="#fff" width="28" height="28" style={{ marginLeft: "4px" }}>
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            <div style={{ padding: "20px" }}>
              <h4 style={{ fontSize: "16px", fontWeight: 700, color: "#fff", lineHeight: 1.4 }}>
                Khám phá công nghệ Buồng hơi đồng & Keo kim loại lỏng trên ROG Matrix RTX 5090
              </h4>
              <p style={{ fontSize: "13px", color: "#888", marginTop: "8px" }}>
                Bóc tách chi tiết hệ thống tản nhiệt 4 quạt và keo tản nhiệt kim loại lỏng duy trì xung nhịp đỉnh cao.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MEDIA REVIEWS SECTION */}
      <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "16px 24px 48px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <span style={{ color: "#ff0036", fontWeight: 700, fontSize: "14px", letterSpacing: "2px", textTransform: "uppercase" }}>
            TRUYỀN THÔNG ĐÁNH GIÁ
          </span>
          <h2 style={{ fontSize: "32px", fontWeight: 800, marginTop: "8px", textTransform: "uppercase" }}>
            MEDIA REVIEW
          </h2>
          <div style={{ width: "60px", height: "3px", backgroundColor: "#ff0036", margin: "16px auto 0" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
          {MEDIA_REVIEWS.map((review, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: "#141414",
                border: "1px solid #262626",
                borderRadius: "8px",
                padding: "28px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <span style={{ color: "#ff0036", fontSize: "13px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}>
                  {review.outlet}
                </span>
                <h4 style={{ fontSize: "18px", fontWeight: 700, color: "#fff", margin: "12px 0", lineHeight: 1.4 }}>
                  {review.title}
                </h4>
                <p style={{ fontSize: "14px", color: "#9e9e9e", lineHeight: 1.6 }}>
                  {review.desc}
                </p>
              </div>
              <div style={{ marginTop: "20px" }}>
                <a
                  href={review.link}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#ff0036", fontSize: "14px", fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  XEM BÀI VIẾT <span>›</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. ECOSYSTEM / RELATED PRODUCTS */}
      <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 24px 64px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <span style={{ color: "#ff0036", fontWeight: 700, fontSize: "14px", letterSpacing: "2px", textTransform: "uppercase" }}>
            HỆ SINH THÁI ROG
          </span>
          <h2 style={{ fontSize: "32px", fontWeight: 800, marginTop: "8px", textTransform: "uppercase" }}>
            SẢN PHẨM ĐƯỢC ĐỀ XUẤT
          </h2>
          <div style={{ width: "60px", height: "3px", backgroundColor: "#ff0036", margin: "16px auto 0" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px" }}>
          {RELATED_PRODUCTS.map((prod) => (
            <Link
              key={prod.id}
              href={prod.href}
              style={{
                backgroundColor: "#141414",
                border: "1px solid #262626",
                borderRadius: "8px",
                overflow: "hidden",
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
                transition: "border-color 0.2s, transform 0.2s",
              }}
            >
              <div style={{ width: "100%", height: "200px", backgroundColor: "#080808", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
                <img
                  src={prod.img}
                  alt={prod.name}
                  style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                />
              </div>
              <div style={{ padding: "24px", flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <h4 style={{ fontSize: "18px", fontWeight: 700, color: "#fff", lineHeight: 1.4 }}>
                    {prod.name}
                  </h4>
                  <p style={{ fontSize: "13px", color: "#888", marginTop: "8px", lineHeight: 1.5 }}>
                    {prod.tagline}
                  </p>
                </div>
                <div style={{ marginTop: "16px" }}>
                  <span style={{ color: "#ff0036", fontSize: "13px", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    TÌM HIỂU THÊM <span>›</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4B. Customer Reviews */}
      <section style={{ maxWidth: "1280px", margin: "0 auto 60px", padding: "0 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid #222", paddingBottom: "12px" }}>
          <div>
            <span style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "2px", color: "#ff0036", fontWeight: 700 }}>CỘNG ĐỒNG GAMER</span>
            <h2 style={{ fontSize: "24px", fontWeight: 800, margin: "4px 0 0" }}>Đánh giá từ người dùng ({reviews.length})</h2>
          </div>
          <button
            type="button"
            onClick={() => setShowReviewForm((v) => !v)}
            style={{
              background: "#ff0036",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              padding: "8px 18px",
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer",
              textTransform: "uppercase",
            }}
          >
            {showReviewForm ? "Đóng form" : "Viết đánh giá"}
          </button>
        </div>

        {showReviewForm && (
          <div style={{ background: "#121218", border: "1px solid #282835", borderRadius: "8px", padding: "24px", marginBottom: "30px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px", color: "#fff" }}>Gửi nhận xét về ROG Matrix GeForce RTX 5090</h3>
            {reviewSuccessMsg ? (
              <div style={{ color: "#00e676", fontWeight: 600, padding: "12px", background: "rgba(0,230,118,0.1)", borderRadius: "4px" }}>{reviewSuccessMsg}</div>
            ) : (
              <form onSubmit={handleSubmitReview} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "#888", marginBottom: "4px" }}>Họ tên hoặc Nickname</label>
                  <input
                    type="text"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder="VD: Nguyễn Tuấn - Overclocker"
                    style={{ width: "100%", background: "#0a0a0c", border: "1px solid #333", color: "#fff", padding: "8px 12px", borderRadius: "4px", fontSize: "13px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "#888", marginBottom: "4px" }}>Đánh giá số sao</label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    style={{ width: "100%", background: "#0a0a0c", border: "1px solid #333", color: "#eab308", padding: "8px 12px", borderRadius: "4px", fontSize: "13px" }}
                  >
                    <option value={5}>★★★★★ (5 sao - Tuyệt vời)</option>
                    <option value={4}>★★★★☆ (4 sao - Rất tốt)</option>
                    <option value={3}>★★★☆☆ (3 sao - Tạm ổn)</option>
                    <option value={2}>★★☆☆☆ (2 sao - Cần cải thiện)</option>
                    <option value={1}>★☆☆☆☆ (1 sao - Kém)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "#888", marginBottom: "4px" }}>Nội dung nhận xét</label>
                  <textarea
                    value={reviewContent}
                    onChange={(e) => setReviewContent(e.target.value)}
                    required
                    rows={3}
                    placeholder="Chia sẻ cảm nhận về buồng hơi đồng, keo kim loại lỏng, thiết kế BTF..."
                    style={{ width: "100%", background: "#0a0a0c", border: "1px solid #333", color: "#fff", padding: "8px 12px", borderRadius: "4px", fontSize: "13px", resize: "vertical" }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={submittingReview}
                  style={{
                    alignSelf: "flex-start",
                    background: "#ff0036",
                    color: "#fff",
                    border: "none",
                    padding: "10px 24px",
                    fontWeight: 700,
                    borderRadius: "4px",
                    cursor: submittingReview ? "not-allowed" : "pointer",
                    fontSize: "12px",
                    textTransform: "uppercase",
                  }}
                >
                  {submittingReview ? "Đang gửi…" : "Gửi đánh giá"}
                </button>
              </form>
            )}
          </div>
        )}

        {reviews.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
            {reviews.map((rev) => (
              <div key={rev.id} style={{ background: "#141418", border: "1px solid #222", borderRadius: "6px", padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <span style={{ fontWeight: 800, color: "#fff", fontSize: "13px" }}>{rev.authorName || "Game thủ ROG"}</span>
                  <span style={{ color: "#eab308", fontSize: "12px" }}>
                    {"★".repeat(Math.max(1, Math.min(5, rev.rating)))}
                    {"☆".repeat(Math.max(0, 5 - Math.max(1, Math.min(5, rev.rating))))}
                  </span>
                </div>
                <p style={{ color: "#ccc", fontSize: "13px", lineHeight: 1.6, margin: "0 0 6px" }}>{rev.content}</p>
                <div style={{ color: "#666", fontSize: "11px" }}>{new Date(rev.createdAtUtc).toLocaleDateString("vi-VN")}</div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: "#888", fontSize: "13px", fontStyle: "italic" }}>Chưa có đánh giá nào. Hãy là người đầu tiên để lại nhận xét!</div>
        )}
      </section>

      {/* 4C. Official ROG Newsletter Subscription */}
      <section style={{ maxWidth: "1280px", margin: "0 auto 60px", padding: "0 24px" }}>
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
            overflow: "hidden",
          }}
        >
          <span style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "3px", color: "#ff0036", fontWeight: 700, marginBottom: "8px" }}>
            REPUBLIC OF GAMERS
          </span>
          <h2 style={{ fontSize: "28px", fontWeight: 800, margin: "0 0 12px", color: "#fff" }}>
            ĐĂNG KÝ NHẬN TIN VỀ ROG MATRIX RTX 5090
          </h2>
          <p style={{ fontSize: "14px", color: "#aaa", maxWidth: "600px", lineHeight: "1.6", margin: "0 0 28px" }}>
            Nhận thông báo sớm nhất về phiên bản giới hạn kỷ niệm 30 năm ROG Matrix GeForce RTX 5090, sự kiện mở bán và cập nhật driver mới nhất.
          </p>

          {isSubscribed ? (
            <div style={{ padding: "16px 24px", backgroundColor: "rgba(0, 200, 83, 0.15)", border: "1px solid #00c853", borderRadius: "8px", color: "#00e676", fontWeight: 600 }}>
              ✓ Cảm ơn bạn! Chúng tôi sẽ gửi thông tin mở bán sớm nhất qua email của bạn.
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
                  outline: "none",
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
                  transition: "background-color 0.2s ease",
                }}
              >
                Đăng Ký
              </button>
            </form>
          )}
        </div>
      </section>

      {/* 5. DISCLAIMERS & LEGAL */}
      <footer style={{ borderTop: "1px solid #1c1c1c", backgroundColor: "#080808", padding: "40px 24px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", fontSize: "12px", color: "#777", lineHeight: 1.8 }}>
          <p style={{ fontWeight: 700, color: "#aaa", marginBottom: "12px" }}>GHI CHÚ & ĐIỀU KHOẢN PHÁP LÝ:</p>
          <ul style={{ listStyleType: "decimal", paddingLeft: "18px", margin: 0 }}>
            {DISCLAIMERS.map((note, idx) => (
              <li key={idx} style={{ marginBottom: "6px" }}>
                {note}
              </li>
            ))}
          </ul>
        </div>
      </footer>

      {/* Lightbox Video Modal */}
      {activeVideoModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
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
              boxShadow: "0 0 30px rgba(0,0,0,0.8)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveVideoModal(null)}
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                zIndex: 10,
                backgroundColor: "rgba(0,0,0,0.6)",
                border: "none",
                color: "#fff",
                fontSize: "24px",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✕
            </button>
            <div style={{ position: "relative", paddingTop: "56.25%" }}>
              <iframe
                src={activeVideoModal}
                title="ROG Matrix Video Review"
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
