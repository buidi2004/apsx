/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import RogNavbar from "@/components/sites/rog-asus/RogNavbar";
import RogPromoBar from "@/components/sites/rog-asus/RogPromoBar";
import RogFooter from "@/components/sites/rog-asus/RogFooter";
import RogChatWidget from "@/components/sites/rog-asus/RogChatWidget";
import { RogApi } from "@/lib/api-client";

type StoreItem = {
  id: string;
  name: string;
  cat: "laptop" | "monitor" | "handheld" | "gear" | "phone" | "component";
  catLabel: string;
  price: string;
  oldPrice?: string;
  specs: string;
  img: string;
  href: string;
  stock: boolean;
};

const STORE_ITEMS: StoreItem[] = [
  {
    id: "scar18",
    name: "ROG Strix SCAR 18 (2026) G834",
    cat: "laptop",
    catLabel: "Laptop Flagship",
    price: "134.990.000 ₫",
    specs: "Intel Core Ultra 9 290HX Plus · RTX 5090 24GB · 64GB RAM · 2TB SSD · 18\" 4K Mini LED 240Hz",
    img: "/sites/rog-asus/img/detail/scar18-kv.webp",
    href: "/vn/laptops/rog-strix/rog-strix-scar-18-2026",
    stock: true,
  },
  {
    id: "z13_kjp",
    name: "ROG Flow Z13-KJP (2026)",
    cat: "laptop",
    catLabel: "Laptop 2-in-1",
    price: "109.990.000 ₫",
    specs: "AMD Ryzen AI Max+ 395 · Radeon 8060S · 128GB LPDDR5X · 1TB SSD · 13.4\" 2.5K 180Hz Cảm ứng",
    img: "/sites/rog-asus/img/detail/z13-kjp-front.webp",
    href: "/vn/laptops/rog-flow/rog-flow-z13-kjp",
    stock: true,
  },
  {
    id: "g16",
    name: "ROG Zephyrus G16 (2025) GU605",
    cat: "laptop",
    catLabel: "Laptop Mỏng Nhẹ AI",
    price: "79.990.000 ₫",
    oldPrice: "84.990.000 ₫",
    specs: "Intel Core Ultra 9 285H · RTX 5090 16GB · 32GB LPDDR5X · 2TB SSD · 16\" OLED 2.5K 240Hz",
    img: "/sites/rog-asus/img/detail/gu605-kv.webp",
    href: "/vn/laptops/rog-zephyrus/rog-zephyrus-g16-2025-gu605",
    stock: true,
  },
  {
    id: "strix_g16",
    name: "ROG Strix G16 (2025) G614",
    cat: "laptop",
    catLabel: "Laptop eSports",
    price: "48.990.000 ₫",
    specs: "Intel Core i9-14900HX · RTX 5070 8GB · 32GB DDR5 · 1TB SSD · 16\" 2.5K 240Hz Nebula",
    img: "/sites/rog-asus/img/hot/strix-scar-18.webp",
    href: "/vn/laptops/rog-strix/rog-strix-g16-2025",
    stock: true,
  },
  {
    id: "g14",
    name: "ROG Zephyrus G14 (2025) GA403",
    cat: "laptop",
    catLabel: "Laptop 14-inch Di Động",
    price: "54.990.000 ₫",
    specs: "AMD Ryzen AI 9 HX 370 · RTX 5060 · 32GB RAM · 1TB SSD · 14\" 3K OLED 120Hz · 1.5kg",
    img: "/sites/rog-asus/img/series/zephyrus-ga403.webp",
    href: "/vn/laptops/rog-zephyrus/rog-zephyrus-g14-2025-ga403",
    stock: true,
  },
  {
    id: "phone_8_pro",
    name: "ROG Phone 8 Pro (16GB/512GB)",
    cat: "phone",
    catLabel: "Điện Thoại Gaming",
    price: "29.990.000 ₫",
    specs: "Snapdragon 8 Gen 3 · 16GB RAM · 512GB ROM · Màn hình AniMe Vision 341 Mini-LED · IP68",
    img: "/sites/rog-asus/img/products/phones.webp",
    href: "/vn/phones/rog-phone-8-pro",
    stock: true,
  },
  {
    id: "phone_9_pro",
    name: "ROG Phone 9 Pro (24GB/1TB)",
    cat: "phone",
    catLabel: "Điện Thoại Gaming 185Hz",
    price: "34.990.000 ₫",
    specs: "Snapdragon® 8 Elite 3nm · 24GB LPDDR5X · 1TB ROM · 185Hz LTPO · AniMe Vision 648 LED",
    img: "/sites/rog-asus/img/products/phones.webp",
    href: "/vn/phones/rog-phone-9-pro",
    stock: true,
  },
  {
    id: "phone_7",
    name: "ROG Phone 7 (16GB/512GB)",
    cat: "phone",
    catLabel: "Điện Thoại Gaming eSports",
    price: "24.990.000 ₫",
    specs: "Snapdragon® 8 Gen 2 · AMOLED 165Hz · Tản nhiệt GameCool 7 · Pin 6000 mAh · 65W HyperCharge",
    img: "/sites/rog-asus/img/detail/rog-phone-7-thumb.webp",
    href: "/vn/phones/rog-phone-7",
    stock: true,
  },
  {
    id: "galaxy_z_fold8_ultra",
    name: "Samsung Galaxy Z Fold8 Ultra (16GB/512GB)",
    cat: "phone",
    catLabel: "Flagship Màn Hình Gập Titan",
    price: "52.990.000 ₫",
    specs: "Snapdragon® 8 Gen 5 for Galaxy · 8.0\" QHD+ 120Hz Flex Titanium · Galaxy AI Now Nudge · S-Pen",
    img: "/sites/mobile/galaxy-z-fold8-ultra.jpg",
    href: "/vn/smartphones/galaxy-z-fold8-ultra",
    stock: true,
  },
  {
    id: "iphone_duo",
    name: "Apple iPhone Duo (2026) 256GB",
    cat: "phone",
    catLabel: "Điện Thoại Màn Hình Kép 360°",
    price: "49.990.000 ₫",
    specs: "Apple A19 Pro Bionic · Dual Super Retina XDR OLED 120Hz · Gốm Titan · Apple Intelligence",
    img: "/sites/mobile/iphone-duo.png",
    href: "/vn/iphone-duo",
    stock: true,
  },
  {
    id: "iphone_18_pro",
    name: "Apple iPhone 18 Pro (256GB)",
    cat: "phone",
    catLabel: "Flagship Titan Hàng Không",
    price: "39.990.000 ₫",
    specs: "Apple A20 Bionic 2nm · Khung Titan Cấp Vũ Trụ · Camera Pro Fusion 48MP Zoom 10X · 4K 120fps",
    img: "/sites/mobile/iphone-18-pro.png",
    href: "/vn/iphone-18-pro",
    stock: true,
  },
  {
    id: "ipad_pro_m4",
    name: "Apple iPad Pro M4 (13-inch Nano-texture)",
    cat: "phone",
    catLabel: "Tablet Di Động Tandem OLED",
    price: "37.990.000 ₫",
    specs: "Apple M4 10-core · Ultra Retina XDR Tandem OLED · Thân máy mỏng 5.1mm · Apple Pencil Pro",
    img: "/sites/mobile/ipad-pro.jpg",
    href: "/vn/ipad-pro",
    stock: true,
  },
  {
    id: "macbook_pro_m4",
    name: "Apple MacBook Pro 16\" ProLED XDR Display",
    cat: "phone",
    catLabel: "Máy Tính Di Động Đỉnh Cao",
    price: "64.990.000 ₫",
    specs: "Apple M4 Max · ProLED XDR Display 1600 nits · 36GB RAM · 1TB SSD · Pin 24 giờ",
    img: "/sites/mobile/macbook-pro.jpg",
    href: "/vn/macbook-pro/proled-xdr-display",
    stock: true,
  },
  {
    id: "crosshair_x870e",
    name: "ROG Crosshair X870E Hero",
    cat: "component",
    catLabel: "Bo Mạch Chủ AM5 Flagship",
    price: "18.990.000 ₫",
    specs: "AMD AM5 · 18+2+2 pha 110A · Wi-Fi 7 · 2 cổng USB4 40Gbps · 5 khe M.2 PCIe 5.0",
    img: "/sites/rog-asus/img/mb/hot-crosshair-x870e.webp",
    href: "/vn/motherboards/rog-crosshair/rog-crosshair-x870e-hero",
    stock: true,
  },
  {
    id: "matrix_5090",
    name: "ROG Matrix GeForce RTX 5090 (30th)",
    cat: "component",
    catLabel: "Card Đồ Họa Kỷ Niệm 30 Năm",
    price: "89.990.000 ₫",
    specs: "32GB GDDR7 · 2 đầu 16-pin 800W · Kim loại lỏng & Buồng hơi đồng · 4 quạt tản nhiệt",
    img: "/sites/rog-asus/img/products/card-do-hoa.webp",
    href: "/vn/graphics-cards/rog-matrix/rog-matrix-rtx5090-p32g-30th",
    stock: true,
  },
  {
    id: "pg34wcdn",
    name: "ROG Swift OLED PG34WCDN",
    cat: "monitor",
    catLabel: "Màn Hình QD-OLED",
    price: "36.990.000 ₫",
    specs: "34-inch Cong 800R · 3440 x 1440 · 360Hz · 0.03ms · 99% DCI-P3 · DisplayPort 2.1a 80Gbps",
    img: "/sites/rog-asus/img/relprod/swift-oled-pg34wcdn.webp",
    href: "/vn/monitors/32-to-34-inches/rog-swift-oled-pg34wcdn",
    stock: true,
  },
  {
    id: "ally_x",
    name: "ROG Ally X (2024) RC72LA",
    cat: "handheld",
    catLabel: "Gaming Handheld",
    price: "24.990.000 ₫",
    specs: "AMD Ryzen Z1 Extreme · 24GB LPDDR5X-7500 · 1TB NVMe · Pin 80Wh · Màn hình 7\" FHD 120Hz",
    img: "/sites/rog-asus/img/products/gaming-handhelds.webp",
    href: "/vn/gaming-handhelds/rog-ally/rog-ally-x-2024",
    stock: true,
  },
  {
    id: "ally_2023",
    name: "ROG Ally (2023) RC71L",
    cat: "handheld",
    catLabel: "Gaming Handheld",
    price: "16.990.000 ₫",
    oldPrice: "17.990.000 ₫",
    specs: "AMD Ryzen Z1 Extreme · 16GB LPDDR5 · 512GB NVMe · Màn hình 7\" FHD 120Hz 100% sRGB",
    img: "/sites/rog-asus/img/handheld/big-1.webp",
    href: "/vn/gaming-handhelds/rog-ally/rog-ally-2023",
    stock: true,
  },
  {
    id: "azoth",
    name: "ROG Azoth Extreme Edition 20",
    cat: "gear",
    catLabel: "Bàn Phím Cơ Custom",
    price: "12.990.000 ₫",
    specs: "Khung nhôm CNC · Plate sợi carbon · Màn hình OLED full-color · Switch ROG NX Pre-lubed",
    img: "/sites/rog-asus/img/kb/hot-azoth-extreme.webp",
    href: "/vn/keyboards-group/",
    stock: true,
  },
  {
    id: "delta2",
    name: "ROG Delta II Wireless Headset",
    cat: "gear",
    catLabel: "Tai Nghe Không Dây",
    price: "6.490.000 ₫",
    specs: "Driver 50mm mạ Titanium · Tri-Mode SpeedNova · Pin 110 giờ · Micro boom khử ồn AI",
    img: "/sites/rog-asus/img/audio/hot-delta-2.webp",
    href: "/vn/headsets-audio-group/",
    stock: true,
  },
];

export default function StorePage() {
  const [items, setItems] = useState<StoreItem[]>(STORE_ITEMS);
  const [filterCat, setFilterCat] = useState<string>("all");
  const [cartCount, setCartCount] = useState<number>(0);

  useEffect(() => {
    const slugs = STORE_ITEMS.map((i) => i.href.replace("/vn/", ""));
    RogApi.getBatchPricing(slugs).then((prices) => {
      if (prices && prices.length > 0) {
        setItems((prev) =>
          prev.map((item) => {
            const itemSlug = item.href.replace("/vn/", "");
            const live = prices.find((p) => p.slug === itemSlug || itemSlug.endsWith(p.slug));
            if (live && live.price > 0) {
              return {
                ...item,
                price: live.formattedPrice,
                oldPrice: live.formattedOldPrice || item.oldPrice,
                stock: live.stockStatus !== 1,
              };
            }
            return item;
          })
        );
      }
    });
  }, []);

  const filteredItems =
    filterCat === "all"
      ? items
      : items.filter((i) => i.cat === filterCat);

  return (
    <div className="rog-page">
      <RogNavbar />
      <RogPromoBar />

      <main style={{ background: "#0a0a0c", color: "#fff", paddingBottom: "80px" }}>
        {/* Hero */}
        <section
          style={{
            padding: "100px 24px 60px",
            textAlign: "center",
            background: "radial-gradient(ellipse at top, #26050b 0%, #0a0a0c 70%)",
            borderBottom: "1px solid #1f1f23",
          }}
        >
          <span
            style={{
              color: "#ff0036",
              fontSize: "13px",
              fontWeight: 800,
              letterSpacing: "3px",
              textTransform: "uppercase",
            }}
          >
            {"// ROG OFFICIAL STORE // VIETNAM"}
          </span>
          <h1
            style={{
              fontSize: "clamp(32px, 5vw, 52px)",
              fontWeight: 900,
              letterSpacing: "1px",
              margin: "16px 0",
              textTransform: "uppercase",
            }}
          >
            CỬA HÀNG TRỰC TUYẾN ASUS ROG
          </h1>
          <p style={{ fontSize: "16px", color: "#aaa", maxWidth: "720px", margin: "0 auto", lineHeight: 1.6 }}>
            Mua sắm trực tiếp các thiết bị gaming cao cấp chính hãng từ ASUS.
            Cam kết 100% hàng mới nguyên seal, bảo hành 2 năm quốc tế và giao hàng miễn phí.
          </p>

          <div
            style={{
              marginTop: "24px",
              display: "flex",
              justifyContent: "center",
              gap: "12px",
              fontSize: "13px",
              color: "#888",
            }}
          >
            <Link href="/" style={{ color: "#aaa", textDecoration: "none" }}>Trang chủ</Link>
            <span>›</span>
            <span style={{ color: "#ff0036" }}>Mua hàng</span>
          </div>
        </section>

        {/* Benefits Badges */}
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px 0" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px",
              marginBottom: "40px",
            }}
          >
            {[
              { icon: "🚚", title: "GIAO HÀNG HỎA TỐC", desc: "Miễn phí vận chuyển toàn quốc" },
              { icon: "🛡️", title: "BẢO HÀNH CHÍNH HÃNG", desc: "2 năm quốc tế & On-site VIP" },
              { icon: "💳", title: "TRẢ GÓP 0% LÃI SUẤT", desc: "Kỳ hạn linh hoạt qua thẻ tín dụng" },
              { icon: "🎁", title: "TÍCH ĐIỂM ROG ELITE", desc: "Nhận quà tặng độc quyền" },
            ].map((b) => (
              <div
                key={b.title}
                style={{
                  background: "#121216",
                  border: "1px solid #222",
                  borderRadius: "6px",
                  padding: "18px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                <span style={{ fontSize: "28px" }}>{b.icon}</span>
                <div>
                  <h4 style={{ fontSize: "13px", fontWeight: 700, margin: "0 0 2px" }}>{b.title}</h4>
                  <p style={{ fontSize: "12px", color: "#888", margin: 0 }}>{b.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Filter Tabs */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              justifyContent: "center",
              marginBottom: "48px",
            }}
          >
            {[
              { id: "all", label: "TẤT CẢ SẢN PHẨM" },
              { id: "phone", label: "ĐIỆN THOẠI & MOBILE" },
              { id: "laptop", label: "LAPTOP GAMING" },
              { id: "component", label: "LINH KIỆN PC" },
              { id: "monitor", label: "MÀN HÌNH" },
              { id: "handheld", label: "HANDHELDS" },
              { id: "gear", label: "PHỤ KIỆN GEAR" },
            ].map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => setFilterCat(btn.id)}
                style={{
                  background: filterCat === btn.id ? "#ff0036" : "#141418",
                  color: "#fff",
                  border: filterCat === btn.id ? "1px solid #ff0036" : "1px solid #282830",
                  padding: "10px 24px",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  borderRadius: "2px",
                  cursor: "pointer",
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "28px",
            }}
          >
            {filteredItems.map((item) => (
              <div
                key={item.id}
                style={{
                  background: "#121216",
                  border: "1px solid #222",
                  borderRadius: "8px",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "transform 0.2s, border-color 0.2s",
                }}
              >
                <div>
                  <div
                    style={{
                      background: "#1a1a20",
                      height: "220px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "20px",
                      position: "relative",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        top: "12px",
                        left: "12px",
                        background: "rgba(0,0,0,0.6)",
                        color: "#ff0036",
                        fontSize: "10px",
                        fontWeight: 800,
                        letterSpacing: "1px",
                        padding: "3px 8px",
                        borderRadius: "2px",
                      }}
                    >
                      {item.catLabel}
                    </span>
                    <img
                      src={item.img}
                      alt={item.name}
                      style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                    />
                  </div>

                  <div style={{ padding: "24px 20px 16px" }}>
                    <h3 style={{ fontSize: "17px", fontWeight: 700, margin: "0 0 10px 0", lineHeight: 1.3 }}>
                      <Link href={item.href} style={{ color: "#fff", textDecoration: "none" }}>
                        {item.name}
                      </Link>
                    </h3>
                    <p style={{ color: "#888", fontSize: "12px", lineHeight: 1.5, marginBottom: "16px" }}>
                      {item.specs}
                    </p>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                      <span style={{ color: "#ff0036", fontSize: "20px", fontWeight: 800 }}>
                        {item.price}
                      </span>
                      {item.oldPrice && (
                        <span style={{ color: "#666", fontSize: "14px", textDecoration: "line-through" }}>
                          {item.oldPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ padding: "0 20px 24px", display: "flex", gap: "10px" }}>
                  <Link
                    href={item.href}
                    style={{
                      flex: 1,
                      textAlign: "center",
                      padding: "10px",
                      background: "#1e1e28",
                      color: "#fff",
                      fontSize: "12px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      textDecoration: "none",
                      borderRadius: "2px",
                      border: "1px solid #333",
                    }}
                  >
                    XEM THÊM & CHI TIẾT
                  </Link>
                  <button
                    type="button"
                    onClick={() => setCartCount((c) => c + 1)}
                    style={{
                      flex: 1,
                      padding: "10px",
                      background: "#ff0036",
                      color: "#fff",
                      fontSize: "12px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      border: "none",
                      borderRadius: "2px",
                      cursor: "pointer",
                    }}
                  >
                    MUA NGAY
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Notice Toast */}
          {cartCount > 0 && (
            <div
              style={{
                position: "fixed",
                bottom: "32px",
                left: "32px",
                background: "#ff0036",
                color: "#fff",
                padding: "12px 24px",
                borderRadius: "4px",
                fontWeight: 700,
                fontSize: "14px",
                boxShadow: "0 10px 25px rgba(255,0,54,0.4)",
                zIndex: 999,
              }}
            >
              🛒 Đã thêm vào giỏ hàng ({cartCount} sản phẩm)
            </div>
          )}
        </div>
      </main>

      <RogFooter />
      <RogChatWidget variant="greeting" />
    </div>
  );
}
