/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import RogNavbar from "@/components/sites/rog-asus/RogNavbar";
import RogPromoBar from "@/components/sites/rog-asus/RogPromoBar";
import RogFooter from "@/components/sites/rog-asus/RogFooter";
import RogChatWidget from "@/components/sites/rog-asus/RogChatWidget";
import { RogApi } from "@/lib/api-client";

type CompareProduct = {
  id: string;
  name: string;
  img: string;
  segment: string;
  cpu: string;
  gpu: string;
  display: string;
  ram: string;
  storage: string;
  weight: string;
  thickness: string;
  cooling: string;
  battery: string;
  price: string;
  href: string;
};

const COMPARE_DATABASE: Record<string, CompareProduct> = {
  scar18: {
    id: "scar18",
    name: "ROG Strix SCAR 18 (2026)",
    img: "/sites/rog-asus/img/detail/scar18-kv.webp",
    segment: "Esports Flagship Chuyên Nghiệp",
    cpu: "Intel® Core™ Ultra 9 290HX Plus (24 nhân, 32 luồng)",
    gpu: "NVIDIA® GeForce RTX™ 5090 24GB GDDR7 (175W TGP)",
    display: "18-inch 4K Nebula HDR Mini LED 240Hz, 1100 nits, 100% DCI-P3",
    ram: "64GB DDR5-6400MHz (Hỗ trợ nâng cấp đến 128GB)",
    storage: "2TB SSD PCIe 4.0 NVMe M.2 (RAID 0)",
    weight: "3.10 kg",
    thickness: "2.31 ~ 3.08 cm",
    cooling: "Vapor Chamber buồng hơi + Keo kim loại lỏng + Cụm 3 quạt Tri-Fan",
    battery: "90Wh sạc nhanh 330W Adapter",
    price: "134.990.000 ₫",
    href: "/vn/laptops/rog-strix/rog-strix-scar-18-2026",
  },
  g16: {
    id: "g16",
    name: "ROG Zephyrus G16 (2025)",
    img: "/sites/rog-asus/img/detail/gu605-kv.webp",
    segment: "Laptop Gaming Mỏng Nhẹ AI & Creator",
    cpu: "Intel® Core™ Ultra 9 285H (16 nhân, NPU Intel AI Boost)",
    gpu: "NVIDIA® GeForce RTX™ 5090 16GB GDDR7 (115W TGP)",
    display: "16-inch 2.5K ROG Nebula OLED 240Hz 0.2ms, G-Sync, 500 nits",
    ram: "32GB LPDDR5X-7467 onboard",
    storage: "2TB PCIe 4.0 NVMe M.2 SSD",
    weight: "1.85 kg",
    thickness: "1.49 ~ 1.64 cm (Khung nhôm CNC)",
    cooling: "Buồng hơi tản nhiệt Vapor Chamber + 3 quạt Arc Flow Gen 2",
    battery: "90Wh sạc nhanh 100W USB-C PD / 240W Adapter",
    price: "79.990.000 ₫",
    href: "/vn/laptops/rog-zephyrus/rog-zephyrus-g16-2025-gu605",
  },
  z13: {
    id: "z13",
    name: "ROG Flow Z13-KJP (2026)",
    img: "/sites/rog-asus/img/detail/z13-kjp-front.webp",
    segment: "Tablet Gaming 2-in-1 Siêu Di Động",
    cpu: "AMD Ryzen™ AI Max+ 395 (16 nhân Zen 5, NPU 50 TOPS)",
    gpu: "Đồ họa tích hợp Radeon 8060S 40 CUs (Hỗ trợ XG Mobile RTX 5090)",
    display: "13.4-inch 2.5K Cảm ứng ROG Nebula Display 180Hz 500 nits",
    ram: "128GB LPDDR5X-8533 (RAM khủng nhất)",
    storage: "1TB M.2 2230 NVMe PCIe 4.0 SSD",
    weight: "1.18 kg (Thân tablet không kèm phím)",
    thickness: "1.20 cm",
    cooling: "Buồng hơi Vapor Chamber mở rộng + 2 quạt 0dB",
    battery: "70Wh sạc nhanh Type-C 130W",
    price: "109.990.000 ₫",
    href: "/vn/laptops/rog-flow/rog-flow-z13-kjp",
  },
  g14: {
    id: "g14",
    name: "ROG Zephyrus G14 (2025)",
    img: "/sites/rog-asus/img/series/zephyrus-ga403.webp",
    segment: "Laptop 14-inch Gọn Gàng Đỉnh Cao",
    cpu: "AMD Ryzen™ AI 9 HX 370 (12 nhân, 24 luồng, 50 TOPS)",
    gpu: "NVIDIA® GeForce RTX™ 5060 8GB GDDR7 (90W TGP)",
    display: "14-inch 3K OLED 120Hz 0.2ms, G-Sync, 500 nits",
    ram: "32GB LPDDR5X-7500",
    storage: "1TB PCIe 4.0 NVMe SSD",
    weight: "1.50 kg",
    thickness: "1.59 cm",
    cooling: "Cụm 3 quạt Tri-Fan + Ống đồng composite dẫn nhiệt kép",
    battery: "73Wh sạc nhanh Type-C 100W",
    price: "54.990.000 ₫",
    href: "/vn/laptops/rog-zephyrus/rog-zephyrus-g14-2025-ga403",
  },
};

export default function ComparePage() {
  const [db, setDb] = useState<Record<string, CompareProduct>>(COMPARE_DATABASE);
  const [slot1, setSlot1] = useState<string>("scar18");
  const [slot2, setSlot2] = useState<string>("g16");
  const [slot3, setSlot3] = useState<string>("z13");

  useEffect(() => {
    const slugs = Object.values(COMPARE_DATABASE).map((p) => p.href.replace("/vn/", ""));
    RogApi.getBatchPricing(slugs).then((prices) => {
      if (prices && prices.length > 0) {
        setDb((prev) => {
          const updated = { ...prev };
          for (const key of Object.keys(updated)) {
            const p = updated[key];
            const pSlug = p.href.replace("/vn/", "");
            const live = prices.find((lp) => lp.slug === pSlug || pSlug.endsWith(lp.slug));
            if (live && live.price > 0) {
              updated[key] = {
                ...p,
                price: live.formattedPrice,
              };
            }
          }
          return updated;
        });
      }
    });
  }, []);

  const p1 = db[slot1] || COMPARE_DATABASE[slot1];
  const p2 = db[slot2] || COMPARE_DATABASE[slot2];
  const p3 = db[slot3] || COMPARE_DATABASE[slot3];

  const CRITERIA = [
    { label: "Phân khúc máy", k1: p1.segment, k2: p2.segment, k3: p3.segment },
    { label: "Vi xử lý (CPU)", k1: p1.cpu, k2: p2.cpu, k3: p3.cpu },
    { label: "Đồ họa (GPU)", k1: p1.gpu, k2: p2.gpu, k3: p3.gpu },
    { label: "Màn hình hiển thị", k1: p1.display, k2: p2.display, k3: p3.display },
    { label: "Bộ nhớ RAM", k1: p1.ram, k2: p2.ram, k3: p3.ram },
    { label: "Ổ cứng SSD", k1: p1.storage, k2: p2.storage, k3: p3.storage },
    { label: "Trọng lượng", k1: p1.weight, k2: p2.weight, k3: p3.weight },
    { label: "Độ mỏng thân máy", k1: p1.thickness, k2: p2.thickness, k3: p3.thickness },
    { label: "Hệ thống tản nhiệt", k1: p1.cooling, k2: p2.cooling, k3: p3.cooling },
    { label: "Dung lượng Pin", k1: p1.battery, k2: p2.battery, k3: p3.battery },
    { label: "Giá niêm yết chính hãng", k1: p1.price, k2: p2.price, k3: p3.price, highlight: true },
  ];

  return (
    <div className="rog-page">
      <RogNavbar />
      <RogPromoBar />

      <main style={{ background: "#0a0a0c", color: "#fff", paddingBottom: "80px" }}>
        {/* Header */}
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
            {"// ROG PRODUCT COMPARISON TOOL"}
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
            SO SÁNH CÁC DÒNG LAPTOP ROG
          </h1>
          <p style={{ fontSize: "16px", color: "#aaa", maxWidth: "720px", margin: "0 auto", lineHeight: 1.6 }}>
            Đặt các cỗ máy chiến game đỉnh cao cạnh nhau để so sánh chi tiết hiệu năng CPU,
            GPU, công nghệ màn hình Nebula và trọng lượng giúp bạn chọn được chiếc máy phù hợp nhất.
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
            <span style={{ color: "#ff0036" }}>So sánh sản phẩm</span>
          </div>
        </section>

        {/* Comparison Table */}
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px 0" }}>
          {/* Selectors Bar */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1fr 1fr 1fr",
              gap: "16px",
              marginBottom: "32px",
              alignItems: "end",
            }}
          >
            <div>
              <span style={{ color: "#888", fontSize: "13px", textTransform: "uppercase", fontWeight: 700 }}>
                Chọn máy so sánh:
              </span>
            </div>

            <div>
              <select
                value={slot1}
                onChange={(e) => setSlot1(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  background: "#181820",
                  color: "#fff",
                  border: "1px solid #333",
                  borderRadius: "2px",
                  fontSize: "13px",
                  outline: "none",
                }}
              >
                {Object.values(db).map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={slot2}
                onChange={(e) => setSlot2(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  background: "#181820",
                  color: "#fff",
                  border: "1px solid #333",
                  borderRadius: "2px",
                  fontSize: "13px",
                  outline: "none",
                }}
              >
                {Object.values(db).map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={slot3}
                onChange={(e) => setSlot3(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  background: "#181820",
                  color: "#fff",
                  border: "1px solid #333",
                  borderRadius: "2px",
                  fontSize: "13px",
                  outline: "none",
                }}
              >
                {Object.values(db).map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Cards Header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1fr 1fr 1fr",
              gap: "16px",
              marginBottom: "16px",
              background: "#121216",
              borderRadius: "8px 8px 0 0",
              border: "1px solid #222",
              padding: "24px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#ff0036", margin: 0, textTransform: "uppercase" }}>
                THÔNG SỐ KỸ THUẬT
              </h3>
            </div>

            {[p1, p2, p3].map((p, idx) => (
              <div key={idx} style={{ textAlign: "center" }}>
                <img
                  src={p.img}
                  alt={p.name}
                  style={{ height: "120px", maxWidth: "100%", objectFit: "contain", margin: "0 auto 12px" }}
                />
                <h4 style={{ fontSize: "15px", fontWeight: 700, margin: "0 0 8px 0" }}>{p.name}</h4>
                <Link
                  href={p.href}
                  style={{
                    display: "inline-block",
                    padding: "6px 14px",
                    background: "#ff0036",
                    color: "#fff",
                    fontSize: "11px",
                    fontWeight: 700,
                    textDecoration: "none",
                    borderRadius: "2px",
                    letterSpacing: "0.5px",
                  }}
                >
                  XEM TRANG MÁY
                </Link>
              </div>
            ))}
          </div>

          {/* Criteria Rows */}
          <div style={{ border: "1px solid #222", borderTop: "none", borderRadius: "0 0 8px 8px", overflow: "hidden" }}>
            {CRITERIA.map((row, idx) => (
              <div
                key={row.label}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.2fr 1fr 1fr 1fr",
                  gap: "16px",
                  padding: "18px 24px",
                  background: idx % 2 === 0 ? "#0d0d12" : "#121216",
                  borderBottom: idx < CRITERIA.length - 1 ? "1px solid #1a1a22" : "none",
                  alignItems: "center",
                }}
              >
                <div style={{ fontWeight: 700, fontSize: "13px", color: row.highlight ? "#ff0036" : "#aaa" }}>
                  {row.label}
                </div>
                <div style={{ fontSize: "13px", color: "#fff", lineHeight: 1.5, fontWeight: row.highlight ? 800 : 400 }}>
                  {row.k1}
                </div>
                <div style={{ fontSize: "13px", color: "#fff", lineHeight: 1.5, fontWeight: row.highlight ? 800 : 400 }}>
                  {row.k2}
                </div>
                <div style={{ fontSize: "13px", color: "#fff", lineHeight: 1.5, fontWeight: row.highlight ? 800 : 400 }}>
                  {row.k3}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <RogFooter />
      <RogChatWidget variant="greeting" />
    </div>
  );
}
