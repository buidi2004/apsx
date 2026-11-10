"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useEffect, useState } from "react";
import { RogApi } from "@/lib/api-client";
import "./RogArticleListing.css";

type ListingArticle = {
  img: string;
  tag: string;
  title: string;
  excerpt: string;
  href: string;
};

const ARTICLES: ListingArticle[] = [
  {
    img: "/sites/rog-asus/img/articles/ally-armoury-crate-se.webp",
    tag: "// ROG Xbox Ally",
    title: "ROG Ally Cập Nhật Armoury Crate SE: Tùy Biến Nút Bấm, Travel Mode và Remote Play",
    excerpt:
      "ROG Ally vừa nhận bản cập nhật Armoury Crate SE quan trọng với 3 nhóm tính năng chính: tùy biến nút Command Center, Library và Action; Travel Mode giới hạn công suất sạc ở 65W; cùng Remote Play beta để chơi game PC từ xa mượt mà.",
    href: "/vn/articles/rog-xbox-ally/14069929-a664-4cb5-b0a0-aeeee0c6c32f",
  },
  {
    img: "/sites/rog-asus/img/articles/sci-vs-sce.webp",
    tag: "// Technologies",
    title: "SCI vs SCE: Màn Hình Chống Phản Chiếu Có Ý Nghĩa Gì Với Người Dùng Laptop Gaming?",
    excerpt:
      "Màn hình chống phản chiếu giúp giảm lượng ánh sáng môi trường phản ngược về mắt, nhờ đó hình ảnh giữ được độ tương phản, màu sắc và độ rõ nét ngay cả khi bạn làm việc hoặc chơi game gần cửa sổ.",
    href: "/vn/articles/technologies/man-hinh-chong-phan-chieu-laptop-gaming-rog",
  },
  {
    img: "/sites/rog-asus/img/articles/tan-nhiet-tot.webp",
    tag: "// Guides",
    title: "Laptop Gaming Tản Nhiệt Tốt: Chọn ROG Nào Để Chơi Game Mát Và Êm?",
    excerpt:
      "Laptop gaming tản nhiệt tốt là laptop giữ được CPU và GPU ở ngưỡng nhiệt an toàn, hạn chế thermal throttling và duy trì hiệu năng ổn định trong các phiên chơi dài.",
    href: "/vn/articles/guides/laptop-gaming-tan-nhiet-tot-em-ai",
  },
  {
    img: "/sites/rog-asus/img/articles/oled-hay-mini-led.webp",
    tag: "// Guides",
    title:
      "Mini LED hay OLED: Chọn Laptop Gaming OLED Hay Laptop Gaming Mini LED Cho Trải Nghiệm HDR Tốt Nhất?",
    excerpt:
      "Laptop gaming OLED là lựa chọn tốt hơn nếu bạn ưu tiên độ tương phản, màu đen tuyệt đối, thời gian phản hồi nhanh và trải nghiệm HDR trong không gian thiếu sáng; laptop gaming Mini LED là lựa chọn tốt cho độ sáng và tuổi thọ pin.",
    href: "/vn/articles/guides/chon-laptop-gaming-oled-hay-mini-led",
  },
  {
    img: "/sites/rog-asus/img/articles/mo-khoa-tgp.webp",
    tag: "// Guides",
    title: "Cách Mở Khóa TGP Tối Đa Trên Laptop Gaming ROG Bằng Manual Mode Trong Armoury Crate",
    excerpt:
      "Manual Mode trong Armoury Crate là cách chính thức để mở khóa TGP tối đa trên laptop gaming ROG.",
    href: "/vn/articles/guides/mo-khoa-tgp-laptop-gaming-rog",
  },
  {
    img: "/sites/rog-asus/img/articles/rtx-5050.webp",
    tag: "// ROG Gaming Laptops",
    title:
      "Laptop RTX 5050: Không Chỉ Để Chơi Game, Hiệu Năng Thực Tế Cho Công Việc, Sáng Tạo Và Học Tập",
    excerpt:
      "Laptop RTX 5050 là lựa chọn đa năng cho người dùng cần một chiếc máy vừa học tập, làm việc sáng tạo vừa chơi game.",
    href: "/vn/articles/rog-gaming-laptops/hieu-nang-laptop-rtx-50-series-rog",
  },
  {
    img: "/sites/rog-asus/img/articles/rtx-50-series.webp",
    tag: "// ROG Gaming Laptops",
    title:
      "Laptop RTX 50 Series: Thế Hệ GPU Mới Thay Đổi Gì Cho Người Dùng Không Chỉ Chơi Game?",
    excerpt:
      "Nếu bạn cần một chiếc laptop RTX 50 series cho học tập, sáng tạo và giải trí, hãy ưu tiên ba yếu tố: GPU phù hợp workload, công suất TGP đủ cao và hệ thống tản nhiệt giữ được hiệu năng trong thời gian dài.",
    href: "/vn/articles/rog-gaming-laptops/laptop-rtx-50-series-rog",
  },
  {
    img: "/sites/rog-asus/img/articles/rtx-50-hieu-nang.webp",
    tag: "// ROG Gaming Laptops",
    title:
      "Laptop Gaming RTX 50 Series: Hiệu Năng Cao Cho Game, Công Việc Nặng Và Sáng Tạo Nội Dung",
    excerpt:
      "Một chiếc laptop gaming RTX 50 Series tốt không chỉ được quyết định bởi tên GPU. Người mua cần xem đồng thời TGP của GPU, CPU, RAM, VRAM, SSD, màn hình, hệ thống tản nhiệt, chế độ hiệu năng và khả năng nâng cấp.",
    href: "/vn/articles/rog-gaming-laptops/hieu-nang-laptop-gaming-rtx-50-series",
  },
  {
    img: "/sites/rog-asus/img/articles/rtx-5060.webp",
    tag: "// ROG Gaming Laptops",
    title:
      "Laptop RTX 5060: GPU Tầm Trung Đủ Mạnh Cho Content Creator, Kỹ Sư Và Người Dùng Cần Laptop Hiệu Năng Cao",
    excerpt:
      "Laptop RTX 5060 là lựa chọn hợp lý cho content creator, designer, kỹ sư và game developer cần GPU rời để dựng video 4K, làm đồ họa, render 3D hoặc chơi game.",
    href: "/vn/articles/rog-gaming-laptops/hieu-nang-laptop-rtx-5060",
  },
];

const FILTERS = ["THỂ LOẠI", "Chassi", "ROG Xbox Ally", "Technologies", "Guides", "ROG Gaming Laptops"];

export default function RogArticleListing() {
  const [articles, setArticles] = useState<ListingArticle[]>([]);
  const [filter, setFilter] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    RogApi.getArticles("listing").then((data) => {
      if (data && data.length > 0) {
        const mapped = data.map((d): ListingArticle | null => {
          if (!d.title) return null;
          return {
            img: d.img || "",
            tag: d.tag || "",
            title: d.title,
            excerpt: d.excerpt || "",
            href: d.href ? d.href.replace("https://rog.asus.com", "") : "",
          };
        }).filter((item): item is ListingArticle => item !== null);
        setArticles(mapped);
      }
    });
  }, []);

  const visible = filter
    ? articles.filter((a) => a.tag.toLowerCase().includes(filter.toLowerCase()))
    : articles;

  return (
    <div className="rog-al">
      <div className="rog-al-banner">
        <div className="rog-al-banner-inner">
          <h1 className="rog-al-title">BÀI VIẾT</h1>
          <span className="rog-al-slash" aria-hidden>/</span>
          <p className="rog-al-desc">
            Tin tức về phần cứng chơi game ROG mới nhất, cùng với các mẹo và
            hướng dẫn để tối ưu hóa thiết bị lập PC hoặc máy tính xách tay chơi
            game của bạn.
          </p>
        </div>
        <div className="rog-al-banner-rule" aria-hidden />
      </div>

      <div className="rog-al-body">
        <div className="rog-al-toolbar">
          <h2 className="rog-al-heading">BÀI VIẾT MỚI NHẤT</h2>
          <div className="rog-al-filter">
            <span className="rog-al-filter-label">Chọn một mục:</span>
            <button
              type="button"
              className="rog-al-filter-btn"
              onClick={() => setDropdownOpen((v) => !v)}
              aria-expanded={dropdownOpen}
            >
              {filter ?? "THỂ LOẠI"}
              <svg viewBox="0 0 12 8" width="12" height="8" aria-hidden>
                <path d="M1 1.5L6 6.5L11 1.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </button>
            {dropdownOpen && (
              <ul className="rog-al-filter-menu">
                {[null, ...FILTERS.slice(1)].map((f) => (
                  <li key={f ?? "all"}>
                    <button
                      type="button"
                      onClick={() => {
                        setFilter(f);
                        setDropdownOpen(false);
                      }}
                    >
                      {f ?? "Tất cả bài viết"}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="rog-al-grid">
          {visible.map((a) => (
            <Link className="rog-al-card" key={a.href} href={a.href}>
              <div className="rog-al-card-img">
                <img src={a.img} alt={a.title} />
              </div>
              <span className="rog-al-card-tag">{a.tag}</span>
              <h3 className="rog-al-card-title">{a.title}</h3>
              <p className="rog-al-card-excerpt">{a.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
