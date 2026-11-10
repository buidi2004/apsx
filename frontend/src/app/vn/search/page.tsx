/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import RogNavbar from "@/components/sites/rog-asus/RogNavbar";
import RogPromoBar from "@/components/sites/rog-asus/RogPromoBar";
import RogFooter from "@/components/sites/rog-asus/RogFooter";
import RogChatWidget from "@/components/sites/rog-asus/RogChatWidget";
import { ARTICLES_DATABASE } from "@/components/sites/rog-asus/articles-data";
import { RogApi } from "@/lib/api-client";

type SearchEntry = {
  type: "product" | "article" | "category";
  typeLabel: string;
  title: string;
  desc: string;
  href: string;
  badge?: string;
  img?: string;
};

const BASE_PRODUCTS: SearchEntry[] = [
  {
    type: "product",
    typeLabel: "SẢN PHẨM",
    title: "ROG Zephyrus Duo (2026)",
    desc: "Laptop gaming 2 màn hình kép OLED 3K 120Hz cảm ứng, GPU lên đến NVIDIA GeForce RTX 5090, Intel Core Ultra 9 386H và bản lề AAS Ultra.",
    href: "/vn/laptops/rog-zephyrus/rog-zephyrus-duo-2026",
    badge: "2 MÀN HÌNH",
    img: "/sites/rog-asus/img/hot/zephyrus-duo.webp",
  },
  {
    type: "product",
    typeLabel: "SẢN PHẨM",
    title: "ROG Matrix GeForce RTX™ 5090 - Phiên bản 30 Năm ASUS",
    desc: "Card đồ họa phiên bản kỷ niệm 30 năm ASUS: Song song BTF + 12V-2x6 cấp tới 800W, bốn quạt buồng hơi đồng, keo kim loại lỏng và Memory Defroster LN2.",
    href: "/vn/graphics-cards/rog-matrix/rog-matrix-rtx5090-p32g-30th",
    badge: "RTX 5090",
    img: "/sites/rog-asus/img/vga/hot-matrix-5090.webp",
  },
  {
    type: "product",
    typeLabel: "SẢN PHẨM",
    title: "ROG Strix SCAR 18 (2026)",
    desc: "Laptop gaming mạnh nhất thế giới với Intel Core Ultra 9 290HX Plus, NVIDIA GeForce RTX 5090 và màn hình 4K 240Hz Mini LED Nebula HDR.",
    href: "/vn/laptops/rog-strix/rog-strix-scar-18-2026",
    badge: "FLAGSHIP",
    img: "/sites/rog-asus/img/detail/scar18-kv.webp",
  },
  {
    type: "product",
    typeLabel: "SẢN PHẨM",
    title: "ROG Zephyrus G16 (2025) GU605",
    desc: "Laptop gaming mỏng nhẹ với khung nhôm CNC 1.49 cm, Intel Core Ultra 9, RTX 5090 và màn hình ROG Nebula OLED 2.5K 240Hz.",
    href: "/vn/laptops/rog-zephyrus/rog-zephyrus-g16-2025-gu605",
    badge: "MỎNG NHẸ",
    img: "/sites/rog-asus/img/detail/gu605-kv.webp",
  },
  {
    type: "product",
    typeLabel: "SẢN PHẨM",
    title: "ROG Flow Z13-KJP (2026)",
    desc: "Laptop gaming 2 trong 1 hợp tác cùng KOJIMA PRODUCTIONS, AMD Ryzen AI Max+ 395, Radeon 8060S, 128GB RAM.",
    href: "/vn/laptops/rog-flow/rog-flow-z13-kjp",
    badge: "2-IN-1",
    img: "/sites/rog-asus/img/detail/z13-kjp-front.webp",
  },
  {
    type: "product",
    typeLabel: "SẢN PHẨM",
    title: "ROG Zephyrus G14 (2025) GA403",
    desc: "Laptop 14-inch OLED di động với AMD Ryzen AI 9 HX 370, GeForce RTX 5060, dải đèn Slash Lighting.",
    href: "/vn/laptops/rog-zephyrus/rog-zephyrus-g14-2025-ga403",
    badge: "14-INCH",
    img: "/sites/rog-asus/img/series/zephyrus-ga403.webp",
  },
  {
    type: "product",
    typeLabel: "SẢN PHẨM",
    title: "ROG Ally X (2024) RC72LA",
    desc: "Máy chơi game cầm tay chạy Windows 11 với AMD Ryzen Z1 Extreme, 24GB LPDDR5X-7500, SSD 1TB và pin 80Wh.",
    href: "/vn/gaming-handhelds/rog-ally/rog-ally-x-2024",
    badge: "HANDHELD",
    img: "/sites/rog-asus/img/products/gaming-handhelds.webp",
  },
  {
    type: "product",
    typeLabel: "SẢN PHẨM",
    title: "ROG Ally (2023) RC71L",
    desc: "Máy chơi game cầm tay chạy Windows 11 với AMD Ryzen Z1 Extreme, 16GB LPDDR5, màn hình 7\" FHD 120Hz 100% sRGB.",
    href: "/vn/gaming-handhelds/rog-ally/rog-ally-2023",
    badge: "HANDHELD",
    img: "/sites/rog-asus/img/handheld/big-1.webp",
  },
  {
    type: "product",
    typeLabel: "SẢN PHẨM",
    title: "ROG Phone 8 Pro",
    desc: "Điện thoại gaming Snapdragon 8 Gen 3, màn hình AniMe Vision, camera 50MP Gimbal OIS, chống nước IP68.",
    href: "/vn/phones/rog-phone-8-pro",
    badge: "PHONE",
    img: "/sites/rog-asus/img/products/phones.webp",
  },
  {
    type: "product",
    typeLabel: "SẢN PHẨM",
    title: "Samsung Galaxy Z Fold8 Ultra",
    desc: "Siêu phẩm màn hình gập titan 8.0 inch QHD+ 120Hz không nếp gấp, chip Snapdragon 8 Gen 5 for Galaxy, Galaxy AI Now Nudge, bút S-Pen chuyên dụng.",
    href: "/vn/smartphones/galaxy-z-fold8-ultra",
    badge: "PHONE",
    img: "/sites/mobile/galaxy-z-fold8-ultra.jpg",
  },
  {
    type: "product",
    typeLabel: "SẢN PHẨM",
    title: "Apple iPhone Duo (2026)",
    desc: "Thiết kế màn hình kép xoay lật 360° gốm titan siêu mỏng, chip Apple A19 Pro Bionic, màn hình Super Retina XDR Duo 120Hz ProMotion và Apple Intelligence.",
    href: "/vn/iphone-duo",
    badge: "PHONE",
    img: "/sites/mobile/iphone-duo.png",
  },
  {
    type: "product",
    typeLabel: "SẢN PHẨM",
    title: "Apple iPhone 18 Pro",
    desc: "Khung titan hàng không vũ trụ, chip Apple A20 Bionic 2nm, camera Pro Fusion 48MP zoom quang học 10X, quay phim 4K 120 fps Dolby Vision HDR.",
    href: "/vn/iphone-18-pro",
    badge: "PHONE",
    img: "/sites/mobile/iphone-18-pro.png",
  },
  {
    type: "product",
    typeLabel: "SẢN PHẨM",
    title: "Apple iPad Pro M4",
    desc: "Màn hình Ultra Retina XDR Tandem OLED hai lớp đột phá, trang bị vi xử lý Apple M4 thế hệ mới, hỗ trợ bút Apple Pencil Pro, thân máy nhôm siêu mỏng 5.1 mm.",
    href: "/vn/ipad-pro",
    badge: "TABLET",
    img: "/sites/mobile/ipad-pro.jpg",
  },
  {
    type: "product",
    typeLabel: "SẢN PHẨM",
    title: "Apple MacBook Pro ProLED XDR",
    desc: "Màn hình ProLED XDR Display độ sáng 1600 nits đỉnh, vi xử lý Apple M4 Pro / M4 Max, 128GB RAM hợp nhất và thời lượng pin sử dụng liên tục đến 24 giờ.",
    href: "/vn/macbook-pro/proled-xdr-display",
    badge: "LAPTOP",
    img: "/sites/mobile/macbook-pro.jpg",
  },
  {
    type: "product",
    typeLabel: "SẢN PHẨM",
    title: "ROG Phone 9 Pro",
    desc: "Qualcomm Snapdragon 8 Elite 3nm, RAM 24GB LPDDR5X, 1TB UFS 4.0, AMOLED 6.78 inch 185Hz LTPO, AniMe Vision 648 LED, GameCool 9.",
    href: "/vn/phones/rog-phone-9-pro",
    badge: "PHONE",
    img: "/sites/rog-asus/img/products/phones.webp",
  },
  {
    type: "product",
    typeLabel: "SẢN PHẨM",
    title: "ROG Phone 7",
    desc: "Snapdragon 8 Gen 2, màn hình 165Hz Samsung AMOLED 1500 nits, buồng hơi tản nhiệt GameCool 7, nút siêu âm AirTrigger và pin khủng 6000 mAh.",
    href: "/vn/phones/rog-phone-7",
    badge: "PHONE",
    img: "/sites/rog-asus/img/detail/rog-phone-7-thumb.webp",
  },
  {
    type: "product",
    typeLabel: "SẢN PHẨM",
    title: "ROG Strix G16 (2025) G614",
    desc: "Laptop gaming eSports với Intel Core i9 HX, RTX 5070, màn hình ROG Nebula 2.5K 240Hz và tản nhiệt Tri-Fan.",
    href: "/vn/laptops/rog-strix/rog-strix-g16-2025",
    badge: "LAPTOP",
    img: "/sites/rog-asus/img/hot/strix-scar-18.webp",
  },
  {
    type: "product",
    typeLabel: "SẢN PHẨM",
    title: "ROG Crosshair X870E Hero",
    desc: "Bo mạch chủ AM5 cho AMD Ryzen 9000, dàn cấp nguồn 18+2+2 pha 110A, hai cổng USB4 40Gbps, Wi-Fi 7 và 5 khe M.2.",
    href: "/vn/motherboards/rog-crosshair/rog-crosshair-x870e-hero",
    badge: "BO MẠCH CHỦ",
    img: "/sites/rog-asus/img/mb/hot-crosshair-x870e.webp",
  },
  {
    type: "product",
    typeLabel: "SẢN PHẨM",
    title: "ROG Swift OLED PG34WCDN",
    desc: "Màn hình gaming cong 34 inch QD-OLED 360Hz 0.03ms, độ phân giải UWQHD, DisplayPort 2.1a 80Gbps.",
    href: "/vn/monitors/32-to-34-inches/rog-swift-oled-pg34wcdn",
    badge: "MÀN HÌNH",
    img: "/sites/rog-asus/img/relprod/swift-oled-pg34wcdn.webp",
  },
  {
    type: "category",
    typeLabel: "DANH MỤC",
    title: "Laptop Gaming ASUS ROG",
    desc: "Toàn bộ dải sản phẩm laptop gaming đỉnh cao ROG Strix, ROG Zephyrus và ROG Flow.",
    href: "/vn/laptops-group/",
  },
  {
    type: "category",
    typeLabel: "DANH MỤC",
    title: "Gaming Handhelds (Máy chơi game cầm tay)",
    desc: "Các dòng máy chơi game PC di động ROG Ally X và ROG Ally chạy Windows 11.",
    href: "/vn/gaming-handhelds-group/",
  },
  {
    type: "category",
    typeLabel: "DANH MỤC",
    title: "Điện thoại & Thiết bị di động (ROG Phone, iPhone, Galaxy, iPad, Mac)",
    desc: "Bộ sưu tập điện thoại gaming ROG Phone, Samsung Galaxy Z Fold8 Ultra, iPhone Duo, iPhone 18 Pro, iPad Pro M4 và MacBook Pro ProLED XDR.",
    href: "/vn/phones-group",
  },
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "product" | "article">("all");
  const [beProducts, setBeProducts] = useState<SearchEntry[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("q") ?? "";
      if (q) {
        queueMicrotask(() => {
          setQuery(q);
        });
      }
    }
    const onPopState = () => {
      const params = new URLSearchParams(window.location.search);
      setQuery(params.get("q") ?? "");
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!query.trim()) {
        setBeProducts([]);
        return;
      }
      RogApi.getProducts({ search: query.trim(), pageSize: 40 }).then((res) => {
        if (res && res.items && res.items.length > 0) {
          const mapped: SearchEntry[] = res.items.map((p) => {
            const priceText = p.price > 0 ? `${(p.price / 1000000).toLocaleString("vi-VN")} TRIỆU` : "ROG";
            return {
              type: "product" as const,
              typeLabel: "SẢN PHẨM",
              title: p.name,
              desc: p.tagline || `Sản phẩm chính hãng ROG — ${p.modelCode}`,
              href: p.basePath,
              badge: p.isHot ? "HOT" : priceText,
              img: p.thumbnailUrl,
            };
          });
          setBeProducts(mapped);
        } else {
          setBeProducts([]);
        }
      });
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  const articleEntries: SearchEntry[] = useMemo(
    () =>
      Object.values(ARTICLES_DATABASE).map((a) => ({
        type: "article" as const,
        typeLabel: "BÀI VIẾT",
        title: a.title,
        desc: a.lead,
        href: `/vn/articles/${a.slug}`,
        img: a.image,
      })),
    []
  );

  const allEntries = useMemo(() => {
    const productsToUse = beProducts.length > 0 ? beProducts : BASE_PRODUCTS;
    return [...productsToUse, ...articleEntries];
  }, [beProducts, articleEntries]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allEntries.filter((item) => {
      const matchType = activeTab === "all" || item.type === activeTab;
      if (!matchType) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q)
      );
    });
  }, [allEntries, query, activeTab]);

  return (
    <div className="rog-page">
      <RogNavbar />
      <RogPromoBar />

      <main style={{ background: "#0a0a0c", color: "#fff", minHeight: "80vh", paddingBottom: "80px" }}>
        {/* Search Input Bar */}
        <section
          style={{
            padding: "80px 24px 40px",
            textAlign: "center",
            background: "radial-gradient(ellipse at top, #26050b 0%, #0a0a0c 70%)",
            borderBottom: "1px solid #1f1f23",
          }}
        >
          <span style={{ color: "#ff0036", fontSize: "12px", fontWeight: 800, letterSpacing: "3px" }}>
            {"// ROG SEARCH ENGINE"}
          </span>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 900, margin: "12px 0 24px" }}>
            TÌM KIẾM SẢN PHẨM & TIN TỨC ROG
          </h1>

          <div style={{ maxWidth: "680px", margin: "0 auto" }}>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Nhập tên laptop, linh kiện, CPU, GPU, bài viết hướng dẫn..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                style={{
                  width: "100%",
                  background: "#14141a",
                  border: "2px solid #ff0036",
                  color: "#fff",
                  padding: "16px 24px",
                  fontSize: "16px",
                  borderRadius: "4px",
                  outline: "none",
                  boxShadow: "0 0 25px rgba(255, 0, 54, 0.2)",
                }}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  style={{
                    position: "absolute",
                    right: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#888",
                    fontSize: "18px",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick tags */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center", marginTop: "14px" }}>
              <span style={{ color: "#666", fontSize: "12px" }}>Gợi ý:</span>
              {["RTX 5090", "SCAR 18", "Zephyrus", "Flow Z13", "Ally X", "Armoury Crate", "OLED 240Hz", "GTA 6"].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setQuery(tag)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#aaa",
                    fontSize: "12px",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Results Container */}
        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 24px 0" }}>
          {/* Tabs */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "32px", borderBottom: "1px solid #222", paddingBottom: "12px" }}>
            {[
              { id: "all", label: `TẤT CẢ (${allEntries.length})` },
              { id: "product", label: "SẢN PHẨM" },
              { id: "article", label: "BÀI VIẾT & HƯỚNG DẪN" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                style={{
                  background: "none",
                  border: "none",
                  color: activeTab === tab.id ? "#ff0036" : "#888",
                  fontWeight: 700,
                  fontSize: "13px",
                  letterSpacing: "1px",
                  padding: "8px 16px",
                  cursor: "pointer",
                  borderBottom: activeTab === tab.id ? "2px solid #ff0036" : "2px solid transparent",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ color: "#888", fontSize: "13px", marginBottom: "24px" }}>
            Tìm thấy <strong style={{ color: "#fff" }}>{results.length}</strong> kết quả
            {query && (
              <>
                {" "}cho từ khóa &quot;<strong style={{ color: "#ff0036" }}>{query}</strong>&quot;
              </>
            )}:
          </div>

          {/* Result Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {results.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  gap: "24px",
                  background: "#121216",
                  border: "1px solid #222",
                  borderRadius: "6px",
                  padding: "20px",
                  textDecoration: "none",
                  color: "inherit",
                  alignItems: "center",
                  transition: "border-color 0.2s, background 0.2s",
                }}
              >
                {item.img && (
                  <div
                    style={{
                      width: "120px",
                      height: "80px",
                      background: "#181820",
                      borderRadius: "4px",
                      overflow: "hidden",
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={item.img}
                      alt={item.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                )}

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "6px" }}>
                    <span
                      style={{
                        color: item.type === "product" ? "#ff0036" : "#00e676",
                        fontSize: "11px",
                        fontWeight: 800,
                        letterSpacing: "1px",
                      }}
                    >
                      {item.typeLabel}
                    </span>
                    {item.badge && (
                      <span
                        style={{
                          background: "#222",
                          color: "#fff",
                          fontSize: "10px",
                          padding: "2px 6px",
                          borderRadius: "2px",
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <h3 style={{ fontSize: "17px", fontWeight: 700, margin: "0 0 6px 0", color: "#fff" }}>
                    {item.title}
                  </h3>
                  <p
                    style={{
                      color: "#aaa",
                      fontSize: "13px",
                      lineHeight: 1.5,
                      margin: 0,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {item.desc}
                  </p>
                </div>

                <div style={{ color: "#ff0036", fontWeight: 700, fontSize: "18px", paddingRight: "8px" }}>
                  →
                </div>
              </Link>
            ))}

            {results.length === 0 && (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "#888" }}>
                <p style={{ fontSize: "16px", marginBottom: "12px" }}>
                  Không tìm thấy kết quả nào phù hợp với từ khóa của bạn.
                </p>
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  style={{
                    background: "#ff0036",
                    color: "#fff",
                    border: "none",
                    padding: "10px 20px",
                    fontWeight: 700,
                    fontSize: "12px",
                    borderRadius: "2px",
                    cursor: "pointer",
                  }}
                >
                  XÓA BỘ LỌC TÌM KIẾM
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <RogFooter />
      <RogChatWidget variant="greeting" />
    </div>
  );
}
