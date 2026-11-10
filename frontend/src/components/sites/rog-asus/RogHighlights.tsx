"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { RogApi } from "@/lib/api-client";
import "./RogHighlights.css";

type Article = {
  img: string;
  tag: string;
  title: string;
  overlay?: string;
  date: string;
  href: string;
};

const ARTICLES: Article[] = [
  {
    img: "/sites/rog-asus/img/articles/gta6.webp",
    tag: "// GAMING",
    title:
      "TỔNG HỢP THÔNG TIN GTA 6: GTA 6 RA MẮT KHI NÀO, CẤU HÌNH YÊU CẦU RA SAO?",
    overlay:
      "TỔNG HỢP TIN TỨC GTA 6 MỚI NHẤT: GTA 6 RA MẮT KHI NÀO VÀ CẤU HÌNH CHI TIẾT",
    date: "Jun 30, 2026",
    href: "/vn/articles/gaming/thong-tin-gta-6-moi-cau-hinh-yeu-cau",
  },
  {
    img: "/sites/rog-asus/img/articles/scenario-profiles.webp",
    tag: "// GUIDES",
    title:
      "TẤT TẦN TẬT CÁCH SỬ DỤNG SCENARIO PROFILES TRONG ARMOURY CRATE ĐỂ TỐI ƯU LAPTOP GAMING ROG",
    overlay:
      "TẤT TẦN TẬT CÁCH SỬ DỤNG SCENARIO PROFILES TRONG ARMOURY CRATE ĐỂ TỐI ƯU LAPTOP ASUS",
    date: "Jun 28, 2026",
    href: "/vn/articles/guides/su-dung-scenario-profiles-trong-armoury-crate",
  },
  {
    img: "/sites/rog-asus/img/articles/aura-sync.webp",
    tag: "// GUIDES",
    title:
      "HƯỚNG DẪN SỬ DỤNG AURA SYNC TRONG ARMOURY CRATE ĐỂ ĐỒNG BỘ ĐÈN LED LAPTOP GAMING ROG",
    overlay:
      "Hướng dẫn sử dụng Aura Sync trong Armoury Crate để đồng bộ đèn LED laptop ASUS",
    date: "Jun 28, 2026",
    href: "/vn/articles/guides/su-dung-aura-sync-trong-armoury-crate",
  },
  {
    img: "/sites/rog-asus/img/articles/tiet-kiem-pin.webp",
    tag: "// GUIDES",
    title: "CÁCH TĂNG THỜI LƯỢNG PIN LAPTOP GAMING ROG VỚI ARMOURY CRATE",
    overlay:
      "CÁCH TỐI ƯU ARMOURY CRATE GIÚP LAPTOP ROG PIN TRÂU CÁ NGÀY TRÊN GIẢNG ĐƯỜNG",
    date: "Jun 28, 2026",
    href: "/vn/articles/guides/tang-thoi-luong-pin-laptop-gaming-asus-rog",
  },
  {
    img: "/sites/rog-asus/img/articles/zephyrus-duo-2-man-hinh.webp",
    tag: "// ROG GAMING LAPTOPS",
    title:
      "LAPTOP GAMING 2 MÀN HÌNH MỎNG NHẸ CÓ MẠNH KHÔNG? THỰC TẾ DÙNG ROG ZEPHYRUS DUO 2026 LÀM ĐỒ HỌA",
    date: "Jun 22, 2026",
    href: "/vn/articles/rog-gaming-laptops/laptop-gaming-2-man-hinh-16-inch",
  },
];

function ArticleCard({ article, big }: { article: Article; big?: boolean }) {
  return (
    <Link className="rog-hl-card" href={article.href}>
      <div className={`rog-hl-card-img${big ? " rog-hl-card-img-big" : ""}`}>
        <img src={article.img} alt={article.title} />
      </div>
      <div className="rog-hl-card-body">
        <span className="rog-hl-card-tag">{article.tag}</span>
        <h3 className="rog-hl-card-title">{article.title}</h3>
        <div className="rog-hl-card-meta">
          <span>ROG</span>
          <span>{article.date}</span>
        </div>
        <span className="rog-hl-card-line" />
      </div>
    </Link>
  );
}

const GLYPHS = [
  "0>>>1",
  // gear
  <svg key="gear" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3.2" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1" /></svg>,
  // network node
  <svg key="net" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="2.5" /><circle cx="4" cy="6" r="1.8" /><circle cx="20" cy="6" r="1.8" /><circle cx="4" cy="18" r="1.8" /><circle cx="20" cy="18" r="1.8" /><path d="M5.8 7l4.3 3.5M14 10.5l4.3-3.5M5.8 17l4.3-3.5M14 13.5l4.3 3.5" /></svg>,
  // stacked layers
  <svg key="layers" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><ellipse cx="12" cy="6" rx="8" ry="3" /><path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6" /><path d="M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" /></svg>,
  // envelope
  <svg key="env" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="5" width="18" height="14" rx="1" /><path d="M3 7l9 6 9-6" /></svg>,
  // half moon
  <svg key="moon" viewBox="0 0 24 24" fill="currentColor"><path d="M14 3a9 9 0 100 18A9 9 0 0114 3zm0 2a7 7 0 110 14 7 7 0 010-14z" /></svg>,
  // dashed grid
  <svg key="grid" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2"><rect x="3" y="3" width="18" height="18" /><path d="M3 9h18M3 15h18M9 3v18M15 3v18" /></svg>,
  // crosshair
  <svg key="cross" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="7" /><path d="M12 2v4M12 18v4M2 12h4M18 12h4" /></svg>,
  // database
  <svg key="db" viewBox="0 0 24 24" fill="currentColor"><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5c0 1.7-3.6 3-8 3S4 6.7 4 5z" /><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6c0 1.7-3.6 3-8 3s-8-1.3-8-3z" /></svg>,
];

export default function RogHighlights() {
  const [articles, setArticles] = useState<Article[]>([]);
  const mobileTrackRef = useRef<HTMLDivElement>(null);
  const [mobilePage, setMobilePage] = useState(0);

  useEffect(() => {
    RogApi.getArticles("highlights").then((data) => {
      if (data && data.length > 0) {
        const mapped = data.map((d): Article | null => {
          if (!d.title) return null;
          return {
            img: d.img || "",
            tag: d.tag || "",
            title: d.title,
            overlay: d.overlay || "",
            date: d.date || "",
            href: d.href ? d.href.replace("https://rog.asus.com", "") : "",
          };
        }).filter((item): item is Article => item !== null);
        setArticles(mapped);
      }
    });
  }, []);

  const onMobileScroll = () => {
    const el = mobileTrackRef.current;
    if (!el) return;
    const page = Math.round(el.scrollLeft / el.clientWidth);
    setMobilePage(Math.min(articles.length - 1, Math.max(0, page)));
  };

  return (
    <section className="rog-hl rog-highlights-bg">
      <img
        className="rog-hl-grid"
        src="/sites/rog-asus/img/misc/home-grid.svg"
        alt=""
        aria-hidden
      />
      <div className="rog-hl-rail" aria-hidden>
        <span className="rog-hl-rail-year">EST. 2006</span>
        <span className="rog-hl-rail-dots">▼ ▼ ▼</span>
      </div>

      <div className="rog-hl-inner">
        <h2 className="rog-hl-title">ROG HIGHLIGHTS</h2>

        {/* Desktop grid */}
        <div className="rog-hl-grid-cards">
          <div className="rog-hl-row rog-hl-row-big">
            {articles.slice(0, 2).map((a) => (
              <ArticleCard key={a.href} article={a} big />
            ))}
          </div>
          <div className="rog-hl-row rog-hl-row-small">
            {articles.slice(2).map((a) => (
              <ArticleCard key={a.href} article={a} />
            ))}
          </div>
        </div>

        {/* Mobile swipe carousel */}
        <div className="rog-hl-carousel">
          <div
            className="rog-hl-track"
            ref={mobileTrackRef}
            onScroll={onMobileScroll}
          >
            {articles.map((a) => (
              <div className="rog-hl-slide" key={a.href}>
                <ArticleCard article={a} />
              </div>
            ))}
          </div>
          <div className="rog-hl-dots">
            {articles.map((a, i) => (
              <span
                key={a.href}
                className={`rog-hl-dot${i === mobilePage ? " rog-hl-dot-active" : ""}`}
              />
            ))}
          </div>
        </div>

        <div className="rog-hl-viewall-wrap">
          <Link className="rog-hl-viewall" href="/vn/articles">
            VIEW ALL ARTICLES <span className="rog-hl-viewall-chev">›</span>
          </Link>
        </div>

        <div className="rog-hl-glyphs" aria-hidden>
          {GLYPHS.map((g, i) => (
            <span className="rog-hl-glyph" key={i}>
              {g}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
