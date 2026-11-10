/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useState } from "react";
import "./RogSeriesPage.css";

export type SeriesType = "flow" | "zephyrus" | "strix";

type SeriesProduct = {
  img: string;
  status: string;
  deal?: boolean;
  name: string;
  model: string;
  specs: string[];
  priceLabel: string;
  price: string;
  save?: string | null;
  oldPrice?: string;
  cta: string;
  href: string;
};

type SeriesConfig = {
  heroImg: string;
  heroAlt: string;
  heroLink: string;
  title: string;
  desc: string;
  chip: string;
  crumb: string;
  products: SeriesProduct[];
};

const SERIES_DATA: Record<SeriesType, SeriesConfig> = {
  flow: {
    heroImg: "/sites/rog-asus/img/flow/hero-kjp.webp",
    heroAlt: "ROG Flow Z13-KJP — Republic of Gamers in alliance with KOJIMA PRODUCTIONS",
    heroLink: "/vn/laptops/rog-flow/rog-flow-z13-kjp",
    title: "ROG FLOW LAPTOP GAMING ASUS ROG",
    desc: "Laptop gaming 2 trong 1 siêu di động — vừa là tablet, vừa là laptop gaming. ROG Flow Z13 với AMD Ryzen™ AI Max+ 395 mang hiệu năng AAA trong thân máy 13 inch mỏng nhẹ nhất dòng ROG.",
    chip: "ROG Flow",
    crumb: "ROG FLOW",
    products: [
      {
        img: "/sites/rog-asus/img/flow/z13-kjp.webp",
        status: "TEMPORARILY OUT OF STOCK",
        deal: false,
        name: "ROG Flow Z13-KJP",
        model: "GZ302EAC-RU184WS",
        specs: [
          "Windows 11 Home",
          "AMD XDNA™ NPU up to 50TOPS",
          "AMD Ryzen™ AI Max+ 395 Processor",
          '13.4" 2.5K (2560 x 1600, WQXGA) 16:10, 180Hz ROG Nebula Display touchscreen',
          "1TB M.2 NVMe™ PCIe® 4.0 SSD storage",
        ],
        priceLabel: "Giá trên ASUS estore",
        price: "109.990.000 đ",
        save: null,
        cta: "XEM CHI TIẾT",
        href: "/vn/laptops/rog-flow/rog-flow-z13-kjp",
      },
      {
        img: "/sites/rog-asus/img/flow/z13-2025.webp",
        status: "CÒN HÀNG",
        deal: true,
        name: "ROG Flow Z13 (2025)",
        model: "GZ302EA-RU232WS",
        specs: [
          "Windows 11 Home",
          "AMD XDNA™ NPU up to 50TOPS",
          "AMD Ryzen™ AI Max+ 395 Processor",
          '13.4" 2.5K (2560 x 1600, WQXGA) 16:10, 180Hz ROG Nebula Display touchscreen',
          "1TB M.2 NVMe™ PCIe® 4.0 SSD storage",
        ],
        priceLabel: "Giá trên ASUS estore",
        price: "104.990.000 đ",
        save: "Save 8.000.000 đ",
        oldPrice: "112.990.000 đ",
        cta: "MUA NGAY",
        href: "/vn/store",
      },
    ],
  },

  zephyrus: {
    heroImg: "/sites/rog-asus/img/series/hero-zephyrus.webp",
    heroAlt: "ROG Zephyrus Series — Laptop gaming mỏng nhẹ cao cấp với vỏ nhôm CNC",
    heroLink: "/vn/laptops/rog-zephyrus/rog-zephyrus-g16-2025-gu605",
    title: "ROG ZEPHYRUS LAPTOP GAMING ASUS ROG",
    desc: "Laptop gaming mỏng nhẹ cao cấp với vỏ nhôm CNC nguyên khối và màn hình ROG Nebula OLED. Zephyrus G14, G16 và Duo trang bị GPU NVIDIA® RTX™ 50 Series — hiệu năng đỉnh cao trong thân máy từ 1.5 kg.",
    chip: "ROG Zephyrus",
    crumb: "ROG ZEPHYRUS",
    products: [
      {
        img: "/sites/rog-asus/img/series/zephyrus-gu605.webp",
        status: "CÒN HÀNG",
        deal: false,
        name: "ROG Zephyrus G16 (2025) GU605",
        model: "GU605CP-QR141W",
        specs: [
          "Windows 11 Home",
          "Intel® Core™ Ultra 9 Processor 285H",
          "NVIDIA® GeForce RTX™ 5070 Laptop GPU",
          '16" 2.5K (2560 x 1600, WQXGA) 16:10 240Hz OLED ROG Nebula Display',
          "512GB M.2 NVMe™ PCIe® 4.0 SSD storage",
        ],
        priceLabel: "Giá trên ASUS estore",
        price: "73.990.000 đ",
        save: null,
        cta: "XEM CHI TIẾT",
        href: "/vn/laptops/rog-zephyrus/rog-zephyrus-g16-2025-gu605",
      },
      {
        img: "/sites/rog-asus/img/series/zephyrus-ga403.webp",
        status: "CÒN HÀNG",
        deal: false,
        name: "ROG Zephyrus G14 (2025) GA403",
        model: "GA403WM-QS051WS",
        specs: [
          "Windows 11 Home",
          "AMD Ryzen™ AI 9 HX 370 Processor",
          "NVIDIA® GeForce RTX™ 5060 Laptop GPU",
          "AMD XDNA™ NPU up to 50TOPS",
          '14" 3K (2880 x 1800) 16:10 120Hz OLED ROG Nebula Display',
          "1TB M.2 NVMe™ PCIe® 4.0 SSD storage",
        ],
        priceLabel: "Giá trên ASUS estore",
        price: "54.990.000 đ",
        save: null,
        cta: "XEM CHI TIẾT",
        href: "/vn/laptops/rog-zephyrus/rog-zephyrus-g14-2025-ga403",
      },
      {
        img: "/sites/rog-asus/img/hot/zephyrus-g16.webp",
        status: "CÒN HÀNG",
        deal: false,
        name: "ROG Zephyrus G16 (2026)",
        model: "GU606AX-TB042WS",
        specs: [
          "Windows 11 Home",
          "Intel® Core™ Ultra 9 Processor 386H",
          "NVIDIA® GeForce RTX™ 5090 Laptop GPU",
          '16" 2.5K (2560 x 1600, WQXGA) 16:10 240Hz OLED ROG Nebula HDR Display',
          "2TB M.2 NVMe™ PCIe® 4.0 SSD storage",
        ],
        priceLabel: "Giá trên ASUS estore",
        price: "119.990.000 đ",
        save: null,
        cta: "XEM CHI TIẾT",
        href: "/vn/laptops/rog-zephyrus/rog-zephyrus-g16-2025-gu605",
      },
      {
        img: "/sites/rog-asus/img/series/zephyrus-gu405.webp",
        status: "CÒN HÀNG",
        deal: false,
        name: "ROG Zephyrus G14 (2026) GU405",
        model: "GU405AW-SY029W",
        specs: [
          "Windows 11 Home",
          "Intel® Core™ Ultra 9 Processor 386H",
          "NVIDIA® GeForce RTX™ 5080 Laptop GPU",
          '14" 3K (2880 x 1800) 16:10 120Hz OLED ROG Nebula HDR Display',
          "1TB M.2 NVMe™ PCIe® 4.0 SSD storage",
        ],
        priceLabel: "Giá trên ASUS estore",
        price: "89.990.000 đ",
        save: null,
        cta: "XEM CHI TIẾT",
        href: "/vn/laptops/rog-zephyrus/rog-zephyrus-g14-2025-ga403",
      },
      {
        img: "/sites/rog-asus/img/series/zephyrus-gx651.webp",
        status: "CÒN HÀNG",
        deal: true,
        name: "ROG Zephyrus Duo (2026)",
        model: "GX651AX-SR050WS",
        specs: [
          "Windows 11 Home",
          "Intel® Core™ Ultra 9 Processor 386H",
          "NVIDIA® GeForce RTX™ 5090 Laptop GPU",
          '16" 3K (2880 x 1800) 16:10 120Hz OLED ROG Nebula HDR Display touchscreen',
          "2TB PCIe® 5.0 NVMe™ M.2 Performance SSD storage",
        ],
        priceLabel: "Giá trên ASUS estore",
        price: "139.990.000 đ",
        save: "Save 5.000.000 đ",
        oldPrice: "144.990.000 đ",
        cta: "CHI TIẾT",
        href: "/vn/laptops/rog-zephyrus/rog-zephyrus-duo-2026",
      },
      {
        img: "/sites/rog-asus/img/hot/zephyrus-g16.webp",
        status: "CÒN HÀNG",
        deal: false,
        name: "ROG Zephyrus G16 (2026)",
        model: "GU606AR-TB027W",
        specs: [
          "Windows 11 Home",
          "Intel® Core™ Ultra 9 Processor 386H",
          "NVIDIA® GeForce RTX™ 5070 Ti Laptop GPU",
          '16" 2.5K (2560 x 1600, WQXGA) 16:10 240Hz OLED ROG Nebula HDR Display',
          "1TB M.2 NVMe™ PCIe® 4.0 SSD storage",
        ],
        priceLabel: "Giá trên ASUS estore",
        price: "94.990.000 đ",
        save: null,
        cta: "XEM CHI TIẾT",
        href: "/vn/laptops/rog-zephyrus/rog-zephyrus-g16-2025-gu605",
      },
    ],
  },

  strix: {
    heroImg: "/sites/rog-asus/img/series/hero-strix.webp",
    heroAlt: "ROG Strix Series — Thống lĩnh mọi đấu trường Esports",
    heroLink: "/vn/laptops/rog-strix/rog-strix-scar-18-2026",
    title: "ROG STRIX LAPTOP GAMING ASUS ROG",
    desc: "Laptop gaming mạnh nhất của ROG dành cho game thủ eSports và nhà sáng tạo chuyên nghiệp. ROG Strix G16, G18 và SCAR 18 với Intel® Core™ Ultra / RTX™ 5090, màn hình ROG Nebula HDR Mini LED 240Hz.",
    chip: "ROG Strix",
    crumb: "ROG STRIX",
    products: [
      {
        img: "/sites/rog-asus/img/series/strix-g835.webp",
        status: "CÒN HÀNG",
        deal: false,
        name: "ROG Strix SCAR 18 (2026)",
        model: "G835LXG-TQ473W",
        specs: [
          "Windows 11 Home",
          "Intel® Core™ Ultra 9 Processor 290HX Plus",
          "NVIDIA® GeForce RTX™ 5090 Laptop GPU",
          '18" 4K (3840 x 2400) 16:10 240Hz ROG Nebula HDR Display',
          "2TB M.2 NVMe™ PCIe® 4.0 Performance SSD storage",
        ],
        priceLabel: "Giá trên ASUS estore",
        price: "135.990.000 đ",
        save: null,
        cta: "XEM CHI TIẾT",
        href: "/vn/laptops/rog-strix/rog-strix-scar-18-2026",
      },
      {
        img: "/sites/rog-asus/img/hot/strix-scar-18.webp",
        status: "CÒN HÀNG",
        deal: true,
        name: "ROG Strix SCAR 18 (2026)",
        model: "G835LWG-TQ383W",
        specs: [
          "Windows 11 Home",
          "Intel® Core™ Ultra 9 Processor 290HX Plus",
          "NVIDIA® GeForce RTX™ 5080 Laptop GPU",
          '18" 4K (3840 x 2400) 16:10 240Hz ROG Nebula HDR Display',
          "2TB M.2 NVMe™ PCIe® 4.0 Performance SSD storage",
        ],
        priceLabel: "Giá trên ASUS estore",
        price: "109.990.000 đ",
        save: "Save 6.000.000 đ",
        oldPrice: "115.990.000 đ",
        cta: "XEM CHI TIẾT",
        href: "/vn/laptops/rog-strix/rog-strix-scar-18-2026",
      },
      {
        img: "/sites/rog-asus/img/series/strix-g815.webp",
        status: "CÒN HÀNG",
        deal: false,
        name: "ROG Strix G18 (2025)",
        model: "G815LM-S9088W",
        specs: [
          "Windows 11 Home",
          "Intel® Core™ Ultra 9 Processor 275HX",
          "NVIDIA® GeForce RTX™ 5060 Laptop GPU",
          '18" 2.5K (2560 x 1600, WQXGA) 16:10 240Hz ROG Nebula Display',
          "1TB M.2 NVMe™ PCIe® 4.0 SSD storage",
        ],
        priceLabel: "Giá trên ASUS estore",
        price: "62.990.000 đ",
        save: null,
        cta: "XEM CHI TIẾT",
        href: "/vn/laptops/rog-strix/rog-strix-g18-2025",
      },
      {
        img: "/sites/rog-asus/img/series/strix-g614.webp",
        status: "CÒN HÀNG",
        deal: false,
        name: "ROG Strix G16 (2025) G614",
        model: "G614PW-TS051W",
        specs: [
          "Windows 11 Home",
          "AMD Ryzen™ 9 8940HX Processor",
          "NVIDIA® GeForce RTX™ 5080 Laptop GPU",
          '16" 2.5K (2560 x 1600, WQXGA) 16:10 300Hz ROG Nebula Display',
          "1TB M.2 NVMe™ PCIe® 4.0 SSD storage",
        ],
        priceLabel: "Giá trên ASUS estore",
        price: "84.990.000 đ",
        save: null,
        cta: "XEM CHI TIẾT",
        href: "/vn/laptops/rog-strix/rog-strix-scar-18-2026",
      },
      {
        img: "/sites/rog-asus/img/series/strix-g614.webp",
        status: "CÒN HÀNG",
        deal: false,
        name: "ROG Strix G16 (2025) G614",
        model: "G614PR-TS103W",
        specs: [
          "Windows 11 Home",
          "AMD Ryzen™ 9 8940HX Processor",
          "NVIDIA® GeForce RTX™ 5070 Ti Laptop GPU",
          '16" 2.5K (2560 x 1600, WQXGA) 16:10 300Hz ROG Nebula Display',
          "512GB M.2 NVMe™ PCIe® 4.0 SSD storage",
        ],
        priceLabel: "Giá trên ASUS estore",
        price: "68.990.000 đ",
        save: null,
        cta: "XEM CHI TIẾT",
        href: "/vn/laptops/rog-strix/rog-strix-scar-18-2026",
      },
      {
        img: "/sites/rog-asus/img/series/strix-g614.webp",
        status: "CÒN HÀNG",
        deal: false,
        name: "ROG Strix G16 (2025) G614",
        model: "G614PM-TS334W",
        specs: [
          "Windows 11 Home",
          "AMD Ryzen™ 9 8940HX Processor",
          "NVIDIA® GeForce RTX™ 5060 Laptop GPU",
          '16" 2.5K (2560 x 1600, WQXGA) 16:10 300Hz ROG Nebula Display',
          "512GB M.2 NVMe™ PCIe® 4.0 SSD storage",
        ],
        priceLabel: "Giá trên ASUS estore",
        price: "49.990.000 đ",
        save: null,
        cta: "XEM CHI TIẾT",
        href: "/vn/laptops/rog-strix/rog-strix-scar-18-2026",
      },
    ],
  },
};

type FilterItem = { label: string; count?: number; checked?: boolean; disabled?: boolean };
type FilterGroup = {
  title: string;
  open?: boolean;
  price?: boolean;
  items?: FilterItem[];
  ranges?: FilterItem[];
};

export default function RogSeriesPage({ series = "flow" }: { series?: SeriesType }) {
  const [compare, setCompare] = useState<Record<string, boolean>>({});
  const cfg = SERIES_DATA[series] ?? SERIES_DATA.flow;

  const filterGroups: FilterGroup[] = [
    {
      title: "CÓ SẴN TẠI ROG STORE",
      open: true,
      items: [
        { label: "In Stock on eShop", count: cfg.products.filter((p) => p.status === "CÒN HÀNG").length, checked: false },
        { label: "Pre-order on eShop", count: 0, checked: false, disabled: true },
        { label: "Temporarily Out of Stock on eShop", count: cfg.products.filter((p) => p.status !== "CÒN HÀNG").length, checked: false },
        { label: "All Products", count: cfg.products.length, checked: false },
      ],
    },
    { title: "MUA", open: true, items: [{ label: "Deals", count: cfg.products.filter((p) => p.deal).length, checked: false }] },
    {
      title: "GIÁ",
      open: true,
      price: true,
      ranges: [
        { label: "~ 76.390.000 đ", count: cfg.products.filter((p) => parseInt(p.price.replace(/\D/g, "")) <= 76390000).length, checked: false },
        { label: "76.390.001 đ ~ 104.790.000 đ", count: cfg.products.filter((p) => {
          const v = parseInt(p.price.replace(/\D/g, ""));
          return v > 76390000 && v <= 104790000;
        }).length, checked: false },
        { label: "104.790.001 đ ~ 133.190.000 đ", count: cfg.products.filter((p) => {
          const v = parseInt(p.price.replace(/\D/g, ""));
          return v > 104790000 && v <= 133190000;
        }).length, checked: false },
        { label: "133.190.001 đ ~ up", count: cfg.products.filter((p) => parseInt(p.price.replace(/\D/g, "")) > 133190000).length, checked: false },
      ],
    },
    {
      title: "SERIES",
      open: true,
      items: [
        { label: "ROG Flow", checked: series === "flow" },
        { label: "ROG Zephyrus", checked: series === "zephyrus" },
        { label: "ROG Strix", checked: series === "strix" },
      ],
    },
    { title: "GPU", open: false },
    { title: "CPU", open: false },
    { title: "KÍCH THƯỚC MÀN HÌNH", open: false },
    { title: "CÔNG NGHỆ MÀN HÌNH", open: false },
    { title: "MEMORY", open: false },
    { title: "CÔNG NGHỆ BỘ NHỚ", open: false },
    { title: "KHẢ NĂNG KẾT NỐI", open: false },
    { title: "BATTERY", open: false },
    { title: "NETWORKING", open: false },
  ];

  return (
    <div className="rog-series">
      {/* hero banner */}
      <div className="rog-series-hero">
        <Link href={cfg.heroLink}>
          <img src={cfg.heroImg} alt={cfg.heroAlt} />
        </Link>
      </div>

      {/* title block */}
      <div className="rog-series-head">
        <div className="rog-series-head-left">
          <h1 className="rog-series-title">
            {cfg.title}{" "}
            <span className="rog-series-hatch" aria-hidden>
              {"///////////"}
            </span>
          </h1>
          <p className="rog-series-desc">{cfg.desc}</p>
        </div>
        <span className="rog-series-win11">
          ⊞ Tìm hiểu thiết bị chạy Windows 11
        </span>
      </div>
      <div className="rog-series-rule" aria-hidden />

      {/* count + sort row */}
      <div className="rog-series-toolbar">
        <div className="rog-series-count">
          <span>{cfg.products.length} Sản phẩm</span>
          <span className="rog-series-chip">{cfg.chip} ✕</span>
          <button type="button" className="rog-series-clear">Xóa tất cả</button>
        </div>
        <div className="rog-series-sort">
          Sắp xếp theo: <strong>Mới nhất</strong> <span aria-hidden>▾</span>
        </div>
      </div>

      <div className="rog-series-body">
        {/* filter sidebar */}
        <aside className="rog-series-filters">
          {filterGroups.map((g) => (
            <div className="rog-series-fgroup" key={g.title}>
              <div className="rog-series-fgroup-head">
                <span>{g.title}</span>
                <span className="rog-series-fgroup-toggle">{g.open ? "—" : "+"}</span>
              </div>
              {g.price && g.ranges ? (
                <div className="rog-series-fgroup-body">
                  {g.ranges.map((r) => (
                    <label className="rog-series-fitem" key={r.label}>
                      <input type="checkbox" defaultChecked={r.checked} />{" "}
                      <span>{r.label}</span>{" "}
                      <span className="rog-series-fcount">({r.count})</span>
                    </label>
                  ))}
                  <div className="rog-series-price-inputs">
                    <span>Nhỏ nhất</span>
                    <input type="text" defaultValue="0 đ" />
                    <span>Lớn nhất</span>
                    <input type="text" defaultValue="0 đ" />
                    <button type="button" className="rog-series-apply">ÁP DỤNG</button>
                  </div>
                </div>
              ) : (
                g.items && (
                  <div className="rog-series-fgroup-body">
                    {g.items.map((it) => (
                      <label
                        className={`rog-series-fitem${it.count === 0 ? " rog-series-fitem-disabled" : ""}`}
                        key={it.label}
                      >
                        <input
                          type="checkbox"
                          defaultChecked={it.checked}
                          disabled={it.count === 0}
                        />{" "}
                        <span>{it.label}</span>
                        {typeof it.count === "number" && (
                          <span className="rog-series-fcount">({it.count})</span>
                        )}
                      </label>
                    ))}
                  </div>
                )
              )}
            </div>
          ))}
        </aside>

        {/* product cards */}
        <div className="rog-series-cards">
          {cfg.products.map((p) => (
            <div className="rog-series-card" key={p.model}>
              <span className="rog-series-status">
                <span className={`rog-series-status-icon${p.status === "CÒN HÀNG" ? " rog-series-status-in" : " rog-series-status-out"}`} aria-hidden />
                {p.status}
              </span>
              {p.deal && <span className="rog-series-deal">DEAL</span>}
              <div className="rog-series-img">
                <img src={p.img} alt={p.name} />
              </div>
              <h2 className="rog-series-name">{p.name}</h2>
              <p className="rog-series-model">{p.model}</p>
              <ul className="rog-series-specs">
                {p.specs.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
              <button type="button" className="rog-series-collapse">RÚT GỌN ^</button>
              <div className="rog-series-price-wrap">
                <span className="rog-series-price-label">
                  {p.priceLabel} <span className="rog-hot-info">ⓘ</span>
                </span>
                <span className="rog-series-price">{p.price}</span>
                {p.save && (
                  <span className="rog-series-save">
                    <em className="rog-series-save-new">{p.save}</em>{" "}
                    <em className="rog-series-save-old">{p.oldPrice}</em>
                  </span>
                )}
              </div>
              <div className="rog-series-ctas">
                {p.href.startsWith("/") ? (
                  <Link className="rog-series-cta-main" href={p.href}>
                    {p.cta}
                  </Link>
                ) : (
                  <a className="rog-series-cta-main" href={p.href} target="_blank" rel="noreferrer">
                    {p.cta}
                  </a>
                )}
                {p.href.startsWith("/") ? (
                  <Link className="rog-series-cta-more" href={p.href}>
                    XEM THÊM
                  </Link>
                ) : (
                  <a className="rog-series-cta-more" href={p.href} target="_blank" rel="noreferrer">
                    XEM THÊM
                  </a>
                )}
              </div>
              <div className="rog-series-card-foot">
                <label className="rog-series-compare">
                  <input
                    type="checkbox"
                    checked={compare[p.model] || false}
                    onChange={(e) => setCompare((c) => ({ ...c, [p.model]: e.target.checked }))}
                  />
                  SO SÁNH
                </label>
                <span className="rog-series-buyloc">
                  <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden>
                    <path d="M12 2a7 7 0 00-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5.5z" fill="currentColor" />
                  </svg>
                  NƠI MUA
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* bottom breadcrumb */}
      <div className="rog-series-crumb">
        <svg viewBox="0 0 70 37" width="26" height="14" aria-hidden className="rog-series-crumb-eye">
          <path
            fill="currentColor"
            d="M22.2 29.1c.8.5 1.6 1 2.4 1.4 8.6 3.8 21.3 6.1 23.7 5.3C55 33.6 62.5 19.5 64.8 13c0 0-7 2.8-14.1 6.1-5.9 2.8-12.4 6-12.4 6l16.5-5s-4.4 10.4-10.2 11.6c-5.8 1.2-16-2.9-16-2.9.8-.7 11.6-8.6 36.8-18.9 1.1-.8 1.8-2.1 2-3.4-5.8.6-11.4 2.3-16.7 4.8-10.6 5-28.5 17.8-28.5 17.8zM3.8 24c1.8 2.3 9.2 4.2 10.2 4.4-4.6-3.2-14-12-14-12 1 2.7 2.3 5.2 3.8 7.6z"
          />
          <path
            fill="currentColor"
            d="M25.6 22.9C30.5 19.3 47.9 4.6 64.7.6c0 0-8.8-1.4-21.3 2.5-4.5 1.4-11 7.7-23.1 19.4-1.6.9-7.5-2.5-10.9-4.1 0 0 5.6 8.9 7.6 11.5 3 4.1 8.5 6.5 8.5 6.5-.5-.5-4.3-4.5-5.4-6.8-.7-1.1.1-2.7 5.5-6.7z"
          />
        </svg>
        <span>›</span>
        <Link href="/vn/laptops-group" className="rog-series-crumb-strong">
          GAMING LAPTOP GAMING ASUS ROG
        </Link>
        <span>›</span>
        <span>{cfg.crumb}</span>
      </div>
    </div>
  );
}
