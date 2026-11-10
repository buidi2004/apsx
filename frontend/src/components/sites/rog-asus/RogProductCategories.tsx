/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { RogApi } from "@/lib/api-client";
import "./RogProductCategories.css";

type RogProduct = {
  image: string;
  label: string;
  href: string;
};

const PRODUCTS: RogProduct[] = [
  { image: "/sites/rog-asus/img/products/laptop-gaming.webp", label: "Laptop Gaming ASUS ROG", href: "/vn/laptops-group" },
  { image: "/sites/rog-asus/img/products/bo-mach-chu.webp", label: "Bo mạch chủ", href: "/vn/motherboards-group" },
  { image: "/sites/rog-asus/img/products/card-do-hoa.webp", label: "Card Đồ họa", href: "/vn/graphics-cards-group" },
  { image: "/sites/rog-asus/img/products/man-hinh.webp", label: "Màn hình", href: "/vn/monitors-group" },
  { image: "/sites/rog-asus/img/products/phones.webp", label: "Điện thoại & Thiết bị di động", href: "/vn/phones-group" },
  { image: "/sites/rog-asus/img/products/may-bo-pc-gaming.webp", label: "MÁY BỘ PC GAMING", href: "/vn/desktops-group" },
  { image: "/sites/rog-asus/img/products/nguon-may-tinh.webp", label: "Nguồn máy tính", href: "/vn/power-supply-units-group" },
  { image: "/sites/rog-asus/img/products/dock-vga.webp", label: "Dock VGA gắn ngoài", href: "/vn/external-graphics-docks-group" },
  { image: "/sites/rog-asus/img/products/thiet-bi-mang.webp", label: "Thiết bị mạng", href: "/vn/networking-group" },
  { image: "/sites/rog-asus/img/products/ban-phim.webp", label: "Bàn phím", href: "/vn/keyboards-group" },
  { image: "/sites/rog-asus/img/products/chuot-lot-chuot.webp", label: "Chuột & Lót chuột", href: "/vn/mice-mouse-pads-group" },
  { image: "/sites/rog-asus/img/products/tai-nghe-audio.webp", label: "Tai nghe & audio", href: "/vn/headsets-audio-group" },
  { image: "/sites/rog-asus/img/products/cases.webp", label: "Cases", href: "/vn/cases-group" },
  { image: "/sites/rog-asus/img/products/apparel-bags-gear.webp", label: "Apparel, Bags, & Gear", href: "/vn/apparel-bags-gear-group" },
  { image: "/sites/rog-asus/img/products/streaming-kits.webp", label: "Streaming Kits", href: "/vn/streaming-kits-group" },
  { image: "/sites/rog-asus/img/products/tay-cam.webp", label: "Tay cầm", href: "/vn/controllers-group" },
  { image: "/sites/rog-asus/img/products/o-luu-tru.webp", label: "Ổ lưu trữ", href: "/vn/storage-group" },
  { image: "/sites/rog-asus/img/products/protection-gadgets.webp", label: "Protection and Gadgets", href: "/vn/protection-and-gadgets-group" },
  { image: "/sites/rog-asus/img/products/lam-mat.webp", label: "Làm mát", href: "/vn/cooling-group" },
  { image: "/sites/rog-asus/img/products/gaming-handhelds.webp", label: "Gaming Handhelds", href: "/vn/gaming-handhelds-group" },
  { image: "/sites/rog-asus/img/products/rog-saga.webp", label: "ROG SAGA", href: "/vn/rog-saga-group" },
  { image: "/sites/rog-asus/img/products/docks-chargers-cables.webp", label: "Docks, Chargers and Cables", href: "/vn/docks-chargers-and-cables-group" },
];

const VISIBLE_COUNT = 5;
const AUTO_INTERVAL_MS = 6000;

export default function RogProductCategories() {
  const [categories, setCategories] = useState<RogProduct[]>(PRODUCTS);
  const [page, setPage] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    RogApi.getCategories().then((data) => {
      if (data && data.length > 0) {
        setCategories(data);
      }
    });
  }, []);

  const totalItems = categories.length;
  const pageCount = Math.ceil(totalItems / VISIBLE_COUNT) || 1;
  const maxStartIndex = Math.max(0, totalItems - VISIBLE_COUNT);

  const startIndexForCurrentPage = (p: number) => {
    return Math.min(p * VISIBLE_COUNT, maxStartIndex);
  };

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setPage((p) => (p + 1) % pageCount);
    }, AUTO_INTERVAL_MS);
  }, [pageCount]);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  const goTo = (p: number) => {
    setPage(((p % pageCount) + pageCount) % pageCount);
    startTimer();
  };

  const startIndex = startIndexForCurrentPage(page);
  // Each item occupies 20% of the track, so shifting by one item = 20%.
  const trackStyle = {
    transform: `translateX(-${startIndex * (100 / VISIBLE_COUNT)}%)`,
  };

  return (
    <section className="rog-products">
      <h2 className="rog-section-title rog-products-title">
        KHÁM PHÁ SẢN PHẨM CỦA CHÚNG TÔI
      </h2>
      <p className="rog-products-sub">Unsure which product fits you?</p>
      <p className="rog-products-desc">
        Share your needs with AI and get tailored suggestions instantly.
      </p>
      <div className="rog-products-btn-row">
        <Link className="rog-ai-btn" href="/vn/compare">
          <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ marginRight: 8, display: "inline-block", verticalAlign: "middle" }}>
            <path fillRule="evenodd" clipRule="evenodd" d="M8.605 1.076l2.663 4.867 4.867 2.663-4.867 2.662-2.663 4.867-2.662-4.867-4.867-2.662 4.867-2.663 2.662-4.867zm0 3.765L7.53 7.53 4.84 8.606 7.53 9.68l1.075 2.69L9.67 9.68l2.7-1.075L9.681 7.53 8.605 4.84z" fill="#fff" />
            <path d="M13.984 2.008l1.255.753.753 1.255.753-1.255L18 2.008l-1.255-.753L15.992 0l-.753 1.255-1.255.753zM0 2.43l.846.507.508.847.508-.847.846-.507-.846-.508-.508-.846-.508.846L0 2.43zM13.446 15.338l.846.508.508.846.508-.847.846-.507-.846-.508-.508-.846-.508.846-.846.508z" fill="#fff" />
          </svg>
          <span>AI Recommendations</span>
        </Link>
      </div>

      <div className="rog-carousel">
        <button
          type="button"
          className="rog-carousel-arrow rog-carousel-arrow--prev"
          aria-label="Trang sản phẩm trước"
          onClick={() => goTo(page - 1)}
        >
          <svg width="15" height="28" viewBox="0 0 15 28" fill="none" aria-hidden="true">
            <path
              d="M13.5 2 2.5 14l11 12"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="rog-carousel-viewport">
          <ul className="rog-carousel-track" style={trackStyle}>
            {categories.map((product) => (
              <li key={product.label} className="rog-product-item">
                <Link href={product.href}>
                  <img
                    className="rog-product-img"
                    src={product.image}
                    alt={product.label}
                    width={240}
                    height={175}
                   
                  />
                  <span className="rog-product-label">{product.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <button
          type="button"
          className="rog-carousel-arrow rog-carousel-arrow--next"
          aria-label="Trang sản phẩm tiếp theo"
          onClick={() => goTo(page + 1)}
        >
          <svg width="15" height="28" viewBox="0 0 15 28" fill="none" aria-hidden="true">
            <path
              d="M1.5 2l11 12-11 12"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="rog-carousel-dots">
        {Array.from({ length: pageCount }, (_, i) => (
          <button
            key={i}
            type="button"
            className={`rog-carousel-dot${i === page ? " rog-carousel-dot--active" : ""}`}
            aria-label={`Trang sản phẩm ${i + 1}`}
            aria-current={i === page}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </section>
  );
}
