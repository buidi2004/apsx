/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";

export interface AwardItem {
  id: string;
  title: string;
  issuer: string;
  logo: string;
  link?: string;
  year?: string;
}

export interface MediaReviewItem {
  id: string;
  outlet: string;
  quote: string;
  reviewer?: string;
  link?: string;
}

const DEFAULT_AWARDS: AwardItem[] = [
  {
    id: "tinhte-choice",
    title: "Tinh Tế Bình Chọn — Thiết Bị Đột Phá Xuất Sắc",
    issuer:
      "Hiệu năng gaming đỉnh cao kết hợp màn hình ROG Nebula chuẩn màu rực rỡ và hệ thống tản nhiệt buồng hơi vượt trội so với các đối thủ cùng phân khúc.",
    logo: "/sites/rog-asus/rog-ally-2023/awards/award-tinhte-2023-1.png",
    link: "https://tinhte.vn",
    year: "2025 - 2026",
  },
  {
    id: "tech-awards",
    title: "Tech Awards — Sản Phẩm Công Nghệ Đột Phá",
    issuer:
      "Thống lĩnh thị trường phần cứng gaming chuyên nghiệp với sức mạnh phần cứng thế hệ mới, tản nhiệt kim loại lỏng và phần mềm Armoury Crate thông minh.",
    logo: "/sites/rog-asus/img/detail/awards/award-1.png",
    link: "https://vnexpress.net/so-hoa/tech-awards",
    year: "2025 - 2026",
  },
  {
    id: "ces-innovation",
    title: "CES Innovation Awards Honoree",
    issuer:
      "Giải thưởng vinh danh tại Triển lãm Điện tử Tiêu dùng CES Hoa Kỳ cho các bước tiến công nghệ đột phá và thiết kế phần cứng tiên phong toàn cầu.",
    logo: "/sites/rog-asus/img/detail/awards/award-3.png",
    link: "https://www.ces.tech",
    year: "CES 2026",
  },
  {
    id: "genk-better-choice",
    title: "GenK Better Choice Awards — Đổi Mới Sáng Tạo",
    issuer:
      "Thiết bị gaming mang tính cách mạng cho trải nghiệm giải trí và sáng tạo nội dung ở mọi lúc mọi nơi với độ hoàn thiện kim loại cao cấp.",
    logo: "/sites/rog-asus/rog-ally-2023/awards/award-genk-2023.png",
    link: "https://genk.vn",
    year: "2025 - 2026",
  },
];

const DEFAULT_MEDIA_REVIEWS: MediaReviewItem[] = [
  {
    id: "media-tinhte",
    outlet: "Tinh Tế",
    reviewer: "Chuyên gia đánh giá phần cứng",
    quote:
      "Màn hình ROG Nebula tuyệt mỹ với độ tương phản sâu và tần số quét cao, kết hợp cùng hiệu năng ấn tượng biến chiếc máy thành vũ khí tối thượng cho mọi game thủ.",
    link: "https://tinhte.vn",
  },
  {
    id: "media-vnexpress",
    outlet: "VnExpress Số Hóa",
    reviewer: "Ban Công Nghệ",
    quote:
      "Khả năng duy trì xung nhịp ổn định và hệ thống quạt vận hành êm ái chứng minh đẳng cấp làm chủ nhiệt độ hàng đầu thế giới của ASUS ROG.",
    link: "https://vnexpress.net/so-hoa",
  },
  {
    id: "media-tomshardware",
    outlet: "Tom's Hardware / PC Gamer",
    reviewer: "Hardware Editor",
    quote:
      "A masterpiece in modern high-performance engineering. Uncompromising build quality, industry-leading display, and exceptional thermal headroom.",
    link: "https://www.tomshardware.com",
  },
];

interface RogProductAwardsProps {
  productName?: string;
  awards?: AwardItem[];
  mediaReviews?: MediaReviewItem[];
}

export default function RogProductAwards({
  productName = "ASUS ROG",
  awards = DEFAULT_AWARDS,
  mediaReviews = DEFAULT_MEDIA_REVIEWS,
}: RogProductAwardsProps) {
  const [activeTab, setActiveTab] = useState<"awards" | "media">("awards");

  return (
    <section
      id="awards"
      style={{
        backgroundColor: "#0a0a0c",
        color: "#ffffff",
        padding: "80px 24px 90px",
        borderTop: "1px solid #1a1a1f",
        borderBottom: "1px solid #1a1a1f",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background ambient glow */}
      <div
        style={{
          position: "absolute",
          top: "-150px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "300px",
          background: "radial-gradient(ellipse at center, rgba(255, 0, 54, 0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "1240px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <span
            style={{
              display: "inline-block",
              color: "#ff0036",
              fontSize: "12px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "3px",
              marginBottom: "8px",
            }}
          >
            BẢO CHỨNG CHẤT LƯỢNG TOÀN CẦU
          </span>
          <h2
            style={{
              fontSize: "clamp(26px, 4vw, 38px)",
              fontWeight: 900,
              letterSpacing: "-0.5px",
              margin: "0 0 16px",
              textTransform: "uppercase",
            }}
          >
            Giải thưởng & Đánh giá
          </h2>
          <p
            style={{
              color: "#888894",
              fontSize: "15px",
              maxWidth: "680px",
              margin: "0 auto 28px",
              lineHeight: 1.6,
            }}
          >
            {productName} tự hào được vinh danh bởi các tổ chức công nghệ hàng đầu thế giới và các tạp chí chuyên môn uy tín nhất tại Việt Nam.
          </p>

          {/* Toggle pill buttons */}
          <div
            style={{
              display: "inline-flex",
              backgroundColor: "#141418",
              border: "1px solid #24242c",
              borderRadius: "40px",
              padding: "4px",
              gap: "4px",
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab("awards")}
              style={{
                backgroundColor: activeTab === "awards" ? "#ff0036" : "transparent",
                color: "#fff",
                border: "none",
                borderRadius: "32px",
                padding: "8px 24px",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              Giải thưởng ({awards.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("media")}
              style={{
                backgroundColor: activeTab === "media" ? "#ff0036" : "transparent",
                color: "#fff",
                border: "none",
                borderRadius: "32px",
                padding: "8px 24px",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              Media Review ({mediaReviews.length})
            </button>
          </div>
        </div>

        {/* 1. Awards Grid */}
        {activeTab === "awards" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
              gap: "24px",
            }}
          >
            {awards.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: "#111116",
                  border: "1px solid #202028",
                  borderRadius: "12px",
                  padding: "32px 24px 28px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  transition: "transform 0.2s ease, border-color 0.2s ease",
                }}
              >
                {/* Award Badge Image */}
                <div
                  style={{
                    height: "90px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "20px",
                  }}
                >
                  <img
                    src={item.logo}
                    alt={item.title}
                    loading="lazy"
                    style={{
                      maxHeight: "80px",
                      maxWidth: "180px",
                      objectFit: "contain",
                      filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.5))",
                    }}
                  />
                </div>

                {item.year && (
                  <span
                    style={{
                      color: "#ff0036",
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                      marginBottom: "6px",
                    }}
                  >
                    {item.year}
                  </span>
                )}

                <h3
                  style={{
                    fontSize: "17px",
                    fontWeight: 700,
                    margin: "0 0 12px",
                    color: "#ffffff",
                    lineHeight: 1.4,
                  }}
                >
                  {item.title}
                </h3>

                <p
                  style={{
                    fontSize: "13px",
                    color: "#9999a6",
                    lineHeight: 1.65,
                    margin: "0 0 20px",
                    flexGrow: 1,
                  }}
                >
                  “{item.issuer}”
                </p>

                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#ff0036",
                      fontSize: "12px",
                      fontWeight: 700,
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    Xem chi tiết đánh giá ↗
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 2. Media Reviews Grid */}
        {activeTab === "media" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "24px",
            }}
          >
            {mediaReviews.map((m) => (
              <div
                key={m.id}
                style={{
                  backgroundColor: "#111116",
                  border: "1px solid #202028",
                  borderRadius: "12px",
                  padding: "32px 28px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "16px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "18px",
                        fontWeight: 800,
                        color: "#fff",
                        letterSpacing: "-0.3px",
                      }}
                    >
                      {m.outlet}
                    </span>
                    <span style={{ color: "#ffb400", fontSize: "14px" }}>★★★★★</span>
                  </div>

                  <p
                    style={{
                      fontSize: "14px",
                      color: "#b0b0be",
                      lineHeight: 1.7,
                      fontStyle: "italic",
                      margin: "0 0 20px",
                    }}
                  >
                    “{m.quote}”
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: "1px solid #1f1f26",
                    paddingTop: "16px",
                  }}
                >
                  <span style={{ fontSize: "12px", color: "#666675" }}>
                    {m.reviewer || "Tech Reviewer"}
                  </span>
                  {m.link && (
                    <a
                      href={m.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#ff0036",
                        fontSize: "12px",
                        fontWeight: 700,
                        textDecoration: "none",
                      }}
                    >
                      Đọc bài viết ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
