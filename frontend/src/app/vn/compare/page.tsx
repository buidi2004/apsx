/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import RogNavbar from "@/components/sites/rog-asus/RogNavbar";
import RogPromoBar from "@/components/sites/rog-asus/RogPromoBar";
import RogFooter from "@/components/sites/rog-asus/RogFooter";
import RogChatWidget from "@/components/sites/rog-asus/RogChatWidget";
import { RogApi } from "@/lib/api-client";
import allProductsIndexRaw from "@/components/sites/rog-asus/universal/all-products-search-index.json";

type IndexProductItem = {
  id: number;
  partNo: string;
  title: string;
  subName: string;
  img: string;
  link: string;
  price: string;
  specs: string;
};

type CompareProduct = {
  id: string;
  partNo?: string;
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
  rawSpecs: string[];
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
    rawSpecs: [],
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
    rawSpecs: [],
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
    rawSpecs: [],
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
    rawSpecs: [],
    price: "54.990.000 ₫",
    href: "/vn/laptops/rog-zephyrus/rog-zephyrus-g14-2025-ga403",
  },
};

function parseRawSpecField(bullets: string[], regex: RegExp): string {
  return bullets.find((b) => regex.test(b)) || "—";
}

function buildCatalogDatabase(): Record<string, CompareProduct> {
  const catalogEntries: Record<string, CompareProduct> = {};
  const list = allProductsIndexRaw as IndexProductItem[];
  for (const item of list) {
    const key = item.partNo || `sku-${item.id}`;
    const bullets = (item.specs || "")
      .split(" • ")
      .map((s) => s.trim())
      .filter(Boolean);

    catalogEntries[key] = {
      id: key,
      partNo: item.partNo,
      name: item.subName ? `${item.title} (${item.subName})` : item.title,
      img: item.img || "/sites/rog-asus/img/detail/scar18-kv.webp",
      segment: item.subName || item.partNo || "Sản phẩm ASUS ROG chính hãng",
      cpu: parseRawSpecField(bullets, /intel|ryzen|core|snapdragon|chipset|am5|lga|socket|sensor|aimpoint|driver/i),
      gpu: parseRawSpecField(bullets, /rtx|radeon|geforce|gddr|vram|watt|psu|pci|omega|hz/i),
      display: parseRawSpecField(bullets, /inch|oled|ips|nebula|hdr|240hz|360hz|180hz|144hz|4k|qhd|fhd|nit/i),
      ram: parseRawSpecField(bullets, /ddr5|lpddr|ram|gb/i),
      storage: parseRawSpecField(bullets, /ssd|nvme|pcie|tb|m\.2|sata/i),
      weight: parseRawSpecField(bullets, /\bkg\b|\bg\b(?!b|bps|hz)/i),
      thickness: parseRawSpecField(bullets, /\bcm\b|\bmm\b/i),
      cooling: parseRawSpecField(bullets, /tản nhiệt|quạt|fan|cooling|vapor|liquid|aio/i),
      battery: parseRawSpecField(bullets, /wh\b|pin|battery|giờ|hours|mah/i),
      rawSpecs: bullets,
      price: item.price && item.price.trim() ? item.price : "Liên hệ đại lý / Nơi mua",
      href: item.link && item.link.startsWith("/") ? item.link : `/vn/${item.link || ""}`,
    };
  }
  return { ...COMPARE_DATABASE, ...catalogEntries };
}

const INITIAL_DATABASE = buildCatalogDatabase();

function matchProductKey(
  query: string | null,
  database: Record<string, CompareProduct>,
  fallback: string
): string {
  if (!query) return fallback;
  const trimmed = query.trim();
  if (!trimmed) return fallback;
  if (database[trimmed]) return trimmed;

  const lower = trimmed.toLowerCase();
  for (const [k, v] of Object.entries(database)) {
    if (
      k.toLowerCase() === lower ||
      v.partNo?.toLowerCase() === lower ||
      v.name.toLowerCase() === lower ||
      v.name.toLowerCase().includes(lower) ||
      v.segment.toLowerCase() === lower
    ) {
      return k;
    }
  }
  return fallback;
}

const FALLBACK_PRODUCT: CompareProduct = {
  id: "unknown",
  name: "Chưa chọn sản phẩm",
  img: "/sites/rog-asus/img/hot/strix-scar-18.webp",
  segment: "—",
  cpu: "—",
  gpu: "—",
  display: "—",
  ram: "—",
  storage: "—",
  weight: "—",
  thickness: "—",
  cooling: "—",
  battery: "—",
  rawSpecs: [],
  price: "Liên hệ",
  href: "/vn/store",
};

function CompareContent() {
  const searchParams = useSearchParams();
  const [db, setDb] = useState<Record<string, CompareProduct>>(INITIAL_DATABASE);

  const initialSlots = useMemo(() => {
    const productsParam = searchParams.get("products");
    if (productsParam) {
      const requested = productsParam
        .split(",")
        .map((s) => decodeURIComponent(s).trim())
        .filter(Boolean)
        .slice(0, 4);

      if (requested.length > 0) {
        const mapped = requested.map((q, idx) =>
          matchProductKey(q, INITIAL_DATABASE, idx === 0 ? "scar18" : idx === 1 ? "g16" : "z13")
        );
        while (mapped.length < 3) {
          const fallback = mapped.length === 1 ? "g16" : "z13";
          mapped.push(mapped.includes(fallback) ? "g14" : fallback);
        }
        return mapped;
      }
    }
    return [
      matchProductKey(searchParams.get("m1"), INITIAL_DATABASE, "scar18"),
      matchProductKey(searchParams.get("m2"), INITIAL_DATABASE, "g16"),
      matchProductKey(searchParams.get("m3"), INITIAL_DATABASE, "z13"),
    ];
  }, [searchParams]);

  const [slots, setSlots] = useState<string[]>(initialSlots);

  useEffect(() => {
    setSlots(initialSlots);
  }, [initialSlots]);

  useEffect(() => {
    RogApi.getProducts({ pageSize: 100 })
      .then((res) => {
        if (res?.items?.length) {
          const beEntries: Record<string, CompareProduct> = {};
          for (const p of res.items) {
            if (!db[p.slug]) {
              beEntries[p.slug] = {
                id: p.slug,
                name: p.name,
                img: p.thumbnailUrl || "/sites/rog-asus/img/detail/scar18-kv.webp",
                segment: p.tagline || "Sản phẩm Gaming ROG",
                cpu: "Intel® / AMD Ryzen™",
                gpu: "NVIDIA® GeForce RTX™",
                display: "ROG Nebula Display",
                ram: "DDR5 Tốc độ cao",
                storage: "PCIe® NVMe™ SSD",
                weight: "Tiêu chuẩn ROG",
                thickness: "—",
                cooling: "ROG Intelligent Cooling",
                battery: "—",
                rawSpecs: [],
                price: p.price > 0 ? `${p.price.toLocaleString("vi-VN")} ₫` : "Liên hệ",
                href: p.basePath.startsWith("/vn/") ? p.basePath : `/vn/${p.basePath}`,
              };
            }
          }
          if (Object.keys(beEntries).length > 0) {
            setDb((prev) => ({ ...prev, ...beEntries }));
          }
        }
      })
      .catch(() => {});
  }, []);

  const selectedProducts = slots.map((key) => db[key] || COMPARE_DATABASE[key] || FALLBACK_PRODUCT);
  const hasRawSpecsMode = selectedProducts.some((p) => p.rawSpecs.length > 0);
  const colTemplate = `1.2fr repeat(${selectedProducts.length}, 1fr)`;

  const criteriaRows: Array<{ label: string; values: string[]; highlight?: boolean }> = hasRawSpecsMode
    ? [
        { label: "Mã Model / SKU", values: selectedProducts.map((p) => p.segment) },
        { label: "Thông số nổi bật 1", values: selectedProducts.map((p) => p.rawSpecs[0] || p.cpu) },
        { label: "Thông số nổi bật 2", values: selectedProducts.map((p) => p.rawSpecs[1] || p.gpu) },
        { label: "Thông số nổi bật 3", values: selectedProducts.map((p) => p.rawSpecs[2] || p.display) },
        { label: "Thông số nổi bật 4", values: selectedProducts.map((p) => p.rawSpecs[3] || p.ram) },
        { label: "Giá niêm yết ASUS eStore", values: selectedProducts.map((p) => p.price), highlight: true },
      ]
    : [
        { label: "Phân khúc máy", values: selectedProducts.map((p) => p.segment) },
        { label: "Vi xử lý (CPU)", values: selectedProducts.map((p) => p.cpu) },
        { label: "Đồ họa (GPU)", values: selectedProducts.map((p) => p.gpu) },
        { label: "Màn hình hiển thị", values: selectedProducts.map((p) => p.display) },
        { label: "Bộ nhớ RAM", values: selectedProducts.map((p) => p.ram) },
        { label: "Ổ cứng SSD", values: selectedProducts.map((p) => p.storage) },
        { label: "Trọng lượng", values: selectedProducts.map((p) => p.weight) },
        { label: "Độ mỏng thân máy", values: selectedProducts.map((p) => p.thickness) },
        { label: "Hệ thống tản nhiệt", values: selectedProducts.map((p) => p.cooling) },
        { label: "Dung lượng Pin", values: selectedProducts.map((p) => p.battery) },
        { label: "Giá niêm yết chính hãng", values: selectedProducts.map((p) => p.price), highlight: true },
      ];

  const allOptions = useMemo(() => Object.values(db), [db]);

  return (
    <div className="rog-page">
      <RogNavbar />
      <RogPromoBar />

      <main style={{ background: "#0a0a0c", color: "#fff", paddingBottom: "80px" }}>
        <section
          style={{
            padding: "96px 24px 56px",
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
              fontSize: "clamp(30px, 5vw, 50px)",
              fontWeight: 900,
              letterSpacing: "1px",
              margin: "16px 0",
              textTransform: "uppercase",
            }}
          >
            SO SÁNH SẢN PHẨM ASUS ROG
          </h1>
          <p style={{ fontSize: "16px", color: "#aaa", maxWidth: "740px", margin: "0 auto", lineHeight: 1.6 }}>
            Đặt các sản phẩm ROG cạnh nhau để đối chiếu trực tiếp thông số kỹ thuật, cấu hình và giá bán chính hãng từ toàn bộ 449 sản phẩm ASUS ROG Việt Nam.
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
            <Link href="/vn" style={{ color: "#aaa", textDecoration: "none" }}>
              Trang chủ
            </Link>
            <span>›</span>
            <span style={{ color: "#ff0036" }}>So sánh sản phẩm ({selectedProducts.length})</span>
          </div>
        </section>

        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "36px 24px 0" }}>
          <div style={{ overflowX: "auto" }}>
            <div style={{ minWidth: selectedProducts.length > 3 ? "920px" : "760px" }}>
              {/* Selectors Bar */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: colTemplate,
                  gap: "14px",
                  marginBottom: "28px",
                  alignItems: "end",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <span style={{ color: "#888", fontSize: "13px", textTransform: "uppercase", fontWeight: 700 }}>
                    Chọn sản phẩm ({selectedProducts.length}/4):
                  </span>
                  {slots.length < 4 && (
                    <button
                      type="button"
                      onClick={() => setSlots((prev) => [...prev, "g14"])}
                      style={{
                        alignSelf: "flex-start",
                        background: "transparent",
                        border: "1px solid #ff0036",
                        color: "#ff0036",
                        padding: "6px 12px",
                        fontSize: "12px",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      + Thêm cột so sánh
                    </button>
                  )}
                </div>

                {slots.map((slotVal, sIdx) => (
                  <div key={sIdx}>
                    <select
                      aria-label={`Chọn sản phẩm so sánh số ${sIdx + 1}`}
                      value={slotVal}
                      onChange={(e) => {
                        const nextVal = e.target.value;
                        setSlots((prev) => prev.map((v, i) => (i === sIdx ? nextVal : v)));
                      }}
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
                      {allOptions.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              {/* Cards Header */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: colTemplate,
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

                {selectedProducts.map((p, idx) => (
                  <div key={idx} style={{ textAlign: "center" }}>
                    <img
                      src={p.img}
                      alt={p.name}
                      style={{ height: "120px", maxWidth: "100%", objectFit: "contain", margin: "0 auto 12px" }}
                    />
                    <h4 style={{ fontSize: "15px", fontWeight: 700, margin: "0 0 10px 0", minHeight: "38px" }}>{p.name}</h4>
                    <Link
                      href={p.href}
                      style={{
                        display: "inline-block",
                        padding: "7px 14px",
                        background: "#ff0036",
                        color: "#fff",
                        fontSize: "11px",
                        fontWeight: 700,
                        textDecoration: "none",
                        borderRadius: "2px",
                        letterSpacing: "0.5px",
                      }}
                    >
                      XEM CHI TIẾT
                    </Link>
                  </div>
                ))}
              </div>

              {/* Criteria Rows */}
              <div style={{ border: "1px solid #222", borderTop: "none", borderRadius: "0 0 8px 8px", overflow: "hidden" }}>
                {criteriaRows.map((row, idx) => (
                  <div
                    key={row.label}
                    style={{
                      display: "grid",
                      gridTemplateColumns: colTemplate,
                      gap: "16px",
                      padding: "18px 24px",
                      background: idx % 2 === 0 ? "#0d0d12" : "#121216",
                      borderBottom: idx < criteriaRows.length - 1 ? "1px solid #1a1a22" : "none",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: "13px", color: row.highlight ? "#ff0036" : "#aaa" }}>
                      {row.label}
                    </div>
                    {row.values.map((val, cIdx) => (
                      <div
                        key={cIdx}
                        style={{
                          fontSize: "13px",
                          color: row.highlight ? "#ff4d6d" : "#fff",
                          lineHeight: 1.5,
                          fontWeight: row.highlight ? 800 : 400,
                        }}
                      >
                        {val}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <RogFooter />
      <RogChatWidget variant="greeting" />
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "100vh", backgroundColor: "#0b0b0e", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
          Đang tải dữ liệu so sánh sản phẩm ROG...
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  );
}
