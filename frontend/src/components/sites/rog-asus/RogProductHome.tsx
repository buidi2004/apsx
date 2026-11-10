"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { VideoSection, RelatedArticles, RelatedProducts, Disclaimer } from "./RogListingExtra";
import "./RogProductHome.css";

/* Per-category data captured from rog.asus.com (SPA renders vary between loads;
   keyboards/monitors captured with their own products, other groups fall back to
   the shared laptop content that the source serves for them). */

type HotProduct = { img: string; name: string; desc: string; href: string };
type BigCard = { img: string };
type SeriesCard = { title: string; desc: string; href: string; img: string };

type GroupData = {
  hero: { src: string; alt: string }[];
  intro: { title: string; text: string; xemHref: string };
  bigCards?: BigCard[];
  seriesList?: SeriesCard[];
  hot: HotProduct[];
  rel: { img: string; name: string; href: string }[];
};

const LAPTOP_HOT_PRODUCTS: HotProduct[] = [
  {
    img: "/sites/rog-asus/img/hot/strix-scar-18.webp",
    name: "ROG Strix SCAR 18 (2026)",
    desc: "GPU lên đến NVIDIA® GeForce RTX™ 5090 Laptop GPU, Intel Core® Ultra™ 290HX Plus, màn hình ROG Nebula HDR 18-inch 4K Mini LED 240Hz, RAM 64GB DDR5-6400, SSD 2TB PCIe® 4.0.",
    href: "/vn/laptops/rog-strix/rog-strix-scar-18-2026",
  },
  {
    img: "/sites/rog-asus/img/hot/zephyrus-g14.webp",
    name: "ROG Zephyrus G14 (2025) GA403",
    desc: "NVIDIA® GeForce RTX™ 5060 Laptop GPU, AMD Ryzen™ AI 9 HX 370 Processor, màn hình 14-inch 3K OLED 120Hz ROG Nebula Display, RAM 32GB LPDDR5X 7500, SSD 1TB PCIe® 4.0.",
    href: "/vn/laptops/rog-zephyrus/rog-zephyrus-g14-2025-ga403",
  },
  {
    img: "/sites/rog-asus/img/hot/zephyrus-g16.webp",
    name: "ROG Zephyrus G16 (2025) GU605",
    desc: "Lên đến NVIDIA® GeForce RTX™ 5090 Laptop GPU, Intel® Core™ Ultra 9 Processor 285H, màn hình ROG Nebula OLED 16-inch 2.5K 240Hz G-Sync, NPU Intel® AI Boost.",
    href: "/vn/laptops/rog-zephyrus/rog-zephyrus-g16-2025-gu605",
  },
  {
    img: "/sites/rog-asus/img/hot/zephyrus-duo.webp",
    name: "ROG Zephyrus Duo (2026)",
    desc: "Laptop gaming 2 màn hình kép OLED 3K 120Hz cảm ứng, GPU lên đến NVIDIA® GeForce RTX™ 5090, Intel® Core™ Ultra 9 386H, bản lề AAS Ultra nâng công thái học.",
    href: "/vn/laptops/rog-zephyrus/rog-zephyrus-duo-2026",
  },
  {
    img: "/sites/rog-asus/img/series/hero-strix.webp",
    name: "ROG Strix G16 (2025)",
    desc: "Chiến thần eSports với Intel® Core™ i9-14900HX, NVIDIA® GeForce RTX™ 5070, màn hình ROG Nebula 16\" 2.5K 240Hz 3ms, tản nhiệt Tri-Fan và keo kim loại lỏng.",
    href: "/vn/laptops/rog-strix/rog-strix-g16-2025",
  },
];

const GROUPS: Record<string, GroupData> = {
  "laptops-group": {
    hero: [
      { src: "/sites/rog-asus/img/hero/strix-scar-18.webp", alt: "ROG Strix SCAR 18" },
      { src: "/sites/rog-asus/img/hero/zephyrus-g14.webp", alt: "ROG Zephyrus G14" },
      { src: "/sites/rog-asus/img/hero/zephyrus-duo.webp", alt: "ROG Zephyrus Duo 16" },
    ],
    intro: {
      title: "LAPTOP GAMING ASUS ROG",
      text: "Laptop gaming ASUS ROG — Sức mạnh gaming đỉnh cao với các dòng ROG Strix, ROG Zephyrus và ROG Flow được trang bị vi xử lý Intel® Core™ Ultra / AMD Ryzen™ AI thế hệ mới, đồ họa NVIDIA® GeForce RTX™ 50 Series cùng công nghệ tản nhiệt buồng hơi ROG Intelligent Cooling.",
      xemHref: "/vn/laptops-group/allmodels",
    },
    seriesList: [
      {
        title: "ROG Strix",
        desc: "Laptop gaming mạnh nhất của ROG dành cho game thủ eSports và nhà sáng tạo chuyên nghiệp. ROG Strix G16, G18 và SCAR 18 với Intel® Core™ Ultra / RTX™ 5090, màn hình ROG Nebula HDR Mini LED 240Hz.",
        href: "/vn/laptops/rog-strix-series",
        img: "/sites/rog-asus/img/series/hero-strix.webp",
      },
      {
        title: "ROG Zephyrus",
        desc: "Laptop gaming mỏng nhẹ cao cấp với vỏ nhôm CNC nguyên khối và màn hình ROG Nebula OLED. Zephyrus G14, G16 và Duo trang bị GPU NVIDIA® RTX™ 50 Series — hiệu năng đỉnh cao trong thân máy từ 1.5 kg.",
        href: "/vn/laptops/rog-zephyrus-series",
        img: "/sites/rog-asus/img/series/hero-zephyrus.webp",
      },
      {
        title: "ROG Flow",
        desc: "Laptop gaming 2 trong 1 siêu di động — vừa là tablet, vừa là laptop gaming. ROG Flow Z13 với AMD Ryzen™ AI Max+ 395 mang hiệu năng AAA trong thân máy 13 inch mỏng nhẹ nhất dòng ROG.",
        href: "/vn/laptops/rog-flow-series",
        img: "/sites/rog-asus/img/flow/hero-kjp.webp",
      },
    ],
    hot: LAPTOP_HOT_PRODUCTS,
    rel: [
      { img: "/sites/rog-asus/img/relprod/xg-mobile.webp", name: "ROG XG Mobile (2025)", href: "/vn/external-graphics-docks/rog-xg-mobile-2025/" },
      { img: "/sites/rog-asus/img/relprod/swift-oled-pg34wcdn.webp", name: "ROG Swift OLED PG34WCDN", href: "/vn/monitors/32-to-34-inches/rog-swift-oled-pg34wcdn" },
      { img: "/sites/rog-asus/img/relprod/kithara.webp", name: "ROG Kithara Gaming Headset", href: "/vn/headsets-audio/headsets/3-5mm-headsets/rog-kithara/" },
    ],
  },
  "keyboards-group": {
    hero: [{ src: "/sites/rog-asus/img/kb/hero.webp", alt: "ROG Bàn phím gaming" }],
    intro: {
      title: "BÀN PHÍM GAMING ASUS ROG",
      text: "Bàn phím cơ gaming ASUS ROG với switch quang học ROG RX và switch ROG NX, kết nối không dây 2.4GHz/Bluetooth, đèn Aura Sync RGB và thời lượng pin lên đến 450 giờ — từ bản 65% ROG Falchion NX đến ROG Azoth Extreme với màn hình OLED.",
      xemHref: "/vn/keyboards/keyboards-series",
    },
    bigCards: [
      { img: "/sites/rog-asus/img/kb/big-1.webp" },
      { img: "/sites/rog-asus/img/kb/big-2.webp" },
      { img: "/sites/rog-asus/img/kb/big-3.webp" },
    ],
    hot: [
      {
        img: "/sites/rog-asus/img/kb/hot-falchion-nx.webp",
        name: "ROG Falchion NX",
        desc: "Bàn phím cơ chơi game không dây ROG Falchion NX 65% với 68 phím, đèn Aura Sync không dây, bảng điều khiển cảm ứng, ốp bảo vệ bàn phím, switch ROG NX và thời lượng pin lên đến 450 giờ.",
        href: "/vn/keyboards/keyboards/pbt-keycaps/rog-falchion-nx-model",
      },
      {
        img: "/sites/rog-asus/img/kb/hot-azoth-extreme.webp",
        name: "ROG Azoth Extreme Edition 20 Gaming Keyboard",
        desc: "Bàn phím cơ chơi game ROG Azoth Extreme Edition 20 có thể tùy biến, khung hợp kim nhôm, tấm định vị sợi carbon, gasket mount có thể điều chỉnh, màn hình cảm ứng OLED full-color với núm điều khiển ba chiều, kê tay mở rộng, chân đế nam châm, kết nối tri-mod.",
        href: "/vn/keyboards/keyboards/pbt-keycaps/rog-azoth-extreme-edition-20",
      },
      {
        img: "/sites/rog-asus/img/kb/hot-claymore-2.webp",
        name: "ROG Claymore II",
        desc: "Bàn phím cơ chơi game ROG Claymore II dạng mô-đun TKL 80%/100% với switch quang ROG RX, cụm phím số numpad có thể tháo rời & đệm kê cổ tay, chế độ kết nối dây & không dây chuẩn 2.4G, thêm các phím nóng clicky có thể điều chỉnh, thanh cuộn điều chỉnh âm lượng và đèn Aura Sync kết nối.",
        href: "/vn/keyboards/keyboards/aura-rgb/rog-claymore-ii-model",
      },
      {
        img: "/sites/rog-asus/img/kb/hot-strix-scope-rx.webp",
        name: "ROG Strix Scope RX",
        desc: "Bàn phím chơi game quang học ROG Strix Scope RX RGB dành cho game thủ FPS, với switch quang ROG RX, hệ thống đèn Aura Sync RGB toàn diện, khả năng chống nước và chống bụi chuẩn IP57, cổng USB 2.0 và mặt trên bàn phím làm bằng hợp kim.",
        href: "/vn/keyboards/keyboards/aura-rgb/rog-strix-scope-rx-model",
      },
    ],
    rel: [
      { img: "/sites/rog-asus/img/kb/rel-1.webp", name: "ROG Gaming Keyboard", href: "/vn/external-graphics-docks/rog-xg-mobile-2025" },
      { img: "/sites/rog-asus/img/kb/rel-2.webp", name: "ROG Gaming Keyboard", href: "/vn/keyboards/keyboards/pbt-keycaps/rog-falchion-ace-75-he" },
      { img: "/sites/rog-asus/img/kb/rel-3.webp", name: "ROG Gaming Keyboard", href: "/vn/keyboards/keyboards/pbt-keycaps/rog-falchion-ace-75-he" },
    ],
  },
  "monitors-group": {
    hero: [
      { src: "/sites/rog-asus/img/mon/hero-1.webp", alt: "ROG Màn hình gaming" },
      { src: "/sites/rog-asus/img/mon/hero-2.webp", alt: "ROG Màn hình gaming" },
    ],
    intro: {
      title: "MÀN HÌNH GAMING ASUS ROG",
      text: "Màn hình gaming ASUS ROG với tấm nền ROG Swift OLED và ROG Nebula HDR, tần số quét lên đến 420Hz, thời gian phản hồi 0.03ms, bao phủ 99% DCI-P3 — dành cho game thủ esports và nhà sáng tạo chuyên nghiệp.",
      xemHref: "/vn/monitors-group/allmodels",
    },
    hot: [
      {
        img: "/sites/rog-asus/img/mon/hot-1.webp",
        name: "ROG Strix OLED XG27AQWMG",
        desc: "Màn hình chơi game ROG Strix OLED XG27AQWMG ― 27 inch (26.5 inch hiển thị) Tandem OLED TrueBlack Glossy™ 1440p, 280 Hz, 0.03 ms, Neo Proximity Sensor, ASUS OLED Care Pro, ELMB, VESA DisplayHDR™ True Black 500, 99% DCI-P3, và DisplayWidget Center.",
        href: "/vn/monitors/27-to-28-inches/rog-strix-oled-xg27aqwmg",
      },
      {
        img: "https://dlcdnwebimgs.asus.com/gain/B276CBB3-24EB-4015-B005-87C455818976/w717/h525/fwebp",
        name: "ROG Strix XG259QNSR Ace",
        desc: "Màn hình chơi game ROG Strix XG259QNSR Ace ― 25 inch (24.5 inch hiển thị) FHD (1920 x 1080), 420 Hz (OC), Fast IPS, 1 ms GTG (0.3 ms tối thiểu), HDR, DisplayWidget Center.",
        href: "/vn/monitors/23-to-24-5-inches/rog-strix-xg259qnsr-ace",
      },
      {
        img: "/sites/rog-asus/img/relprod/swift-oled-pg34wcdn.webp",
        name: "ROG Swift OLED PG34WCDN",
        desc: "Màn hình gaming cong ROG Swift OLED PG34WCDN 34-inch UWQHD 175Hz với tấm OLED True Black 500, 99% DCI-P3, thời gian phản hồi 0.1ms và loa chống rung — trải nghiệm hình ảnh đỉnh cao.",
        href: "/vn/monitors/32-to-34-inches/rog-swift-oled-pg34wcdn/",
      },
      {
        img: "/sites/rog-asus/img/mon/hot-3.webp",
        name: "ROG Gaming Monitor",
        desc: "Màn hình gaming ROG với tần số quét cao, tấm nền nhanh và màu sắc chính xác dành cho trò chơi esports.",
        href: "/vn/monitors/32-to-34-inches/rog-swift-oled-pg34wcdn",
      },
    ],
    rel: [
      { img: "/sites/rog-asus/img/relprod/xg-mobile.webp", name: "ROG XG Mobile (2025)", href: "/vn/external-graphics-docks/rog-xg-mobile-2025/" },
      { img: "/sites/rog-asus/img/relprod/kithara.webp", name: "ROG Kithara Gaming Headset", href: "/vn/headsets-audio/headsets/3-5mm-headsets/rog-kithara/" },
      { img: "/sites/rog-asus/img/relprod/falchion-ace-75.webp", name: "ROG Falchion Ace 75 HE Gaming Keyboard", href: "/vn/keyboards/keyboards/pbt-keycaps/rog-falchion-ace-75-he/" },
    ],
  },

  "motherboards-group": {
    hero: [
      { src: "/sites/rog-asus/img/mb/hero-1.webp", alt: "ROG Bo mạch chủ gaming" },
      { src: "/sites/rog-asus/img/mb/hero-2.webp", alt: "ROG Bo mạch chủ gaming" },
    ],
    intro: {
      title: "BO MẠCH CHỦ GAMING ASUS ROG",
      text: "Bo mạch chủ gaming ASUS ROG — sẵn sàng cho AMD Ryzen™ 9000 và Intel® Core™ Ultra, BIOS AI overclocking, thiết kế tản nhiệt mở rộng và chuẩn cắm PCIe 5.0/DDR5 thế hệ mới.",
      xemHref: "/vn/motherboards-group/allmodels",
    },
    bigCards: [
      { img: "/sites/rog-asus/img/mb/big-1.webp" },
      { img: "/sites/rog-asus/img/mb/big-2.webp" },
      { img: "/sites/rog-asus/img/mb/big-3.webp" },
    ],
    hot: [
      {
        img: "/sites/rog-asus/img/mb/hot-crosshair-x870e.webp",
        name: "ROG Crosshair X870E Hero",
        desc: "Socket AM5 cho AMD Ryzen™ 9000, dàn cấp nguồn 18+2+2 pha 110A, hai cổng USB4® 40Gbps, Wi-Fi 7, 5 khe M.2 PCIe 5.0 và PCIe Slot Q-Release Slim.",
        href: "/vn/motherboards/rog-crosshair/rog-crosshair-x870e-hero",
      },
      { img: "/sites/rog-asus/img/mb/hot-strix-x870e-miku.webp", name: "ROG STRIX X870E-H GAMING WIFI7 HATSUNE MIKU EDITION", desc: "", href: "/vn/external-graphics-docks/rog-xg-mobile-2025" },
      { img: "/sites/rog-asus/img/mb/hot-strix-b860i.webp", name: "ROG STRIX B860-I GAMING WIFI", desc: "", href: "/vn/motherboards/rog-maximus/rog-maximus-z890-extreme" },
      { img: "/sites/rog-asus/img/mb/hot-strix-b860g.webp", name: "ROG STRIX B860-G GAMING WIFI", desc: "", href: "/vn/motherboards/rog-maximus/rog-maximus-z890-extreme" },
    ],
    rel: [
      { img: "/sites/rog-asus/img/relprod/xg-mobile.webp", name: "ROG XG Mobile (2025)", href: "/vn/external-graphics-docks/rog-xg-mobile-2025/" },
      { img: "/sites/rog-asus/img/relprod/kithara.webp", name: "ROG Kithara Gaming Headset", href: "/vn/headsets-audio/headsets/3-5mm-headsets/rog-kithara/" },
      { img: "/sites/rog-asus/img/relprod/falchion-ace-75.webp", name: "ROG Falchion Ace 75 HE Gaming Keyboard", href: "/vn/keyboards/keyboards/pbt-keycaps/rog-falchion-ace-75-he/" },
    ],
  },
  "graphics-cards-group": {
    hero: [
      { src: "/sites/rog-asus/img/vga/hero-1.webp", alt: "ROG Card đồ họa gaming" },
      { src: "/sites/rog-asus/img/vga/hero-2.webp", alt: "ROG Card đồ họa gaming" },
    ],
    intro: {
      title: "CARD ĐỒ HỌA GAMING ASUS ROG",
      text: "Card đồ họa gaming ASUS ROG — ROG Astral, ROG Strix và ROG Matrix với GPU NVIDIA® GeForce RTX™ 50 Series, tản nhiệt dẫn vapor và quạt Glyph Drive, sẵn sàng cho mọi trận chiến 4K.",
      xemHref: "/vn/graphics-cards/graphics-cards-series",
    },
    bigCards: [
      { img: "/sites/rog-asus/img/vga/big-1.webp" },
      { img: "/sites/rog-asus/img/vga/big-2.webp" },
      { img: "/sites/rog-asus/img/vga/big-3.webp" },
    ],
    hot: [
      { img: "/sites/rog-asus/img/vga/hot-strix-5070.webp", name: "ROG Strix GeForce RTX™ 5070 12GB GDDR7 OC Edition", desc: "ROG Strix GeForce RTX™ 5070 OC Edition phiên bản ép xung 12GB GDDR7 với hệ thống tản nhiệt tiên tiến mang lại khả năng cấp nguồn cao cấp cho bạn.", href: "/vn/external-graphics-docks/rog-xg-mobile-2025" },
      { img: "/sites/rog-asus/img/vga/hot-astral-5090-btf.webp", name: "ROG Astral GeForce RTX™ 5090 32GB GDDR7 BTF Edition", desc: "Card đồ họa ROG Astral GeForce RTX™ 5090 32GB GDDR7 BTF bốn quạt, với một bộ chuyển đổi GC-HPWR có thể tháo rời để tương thích với các bo mạch chủ tiêu chuẩn lẫn BTF.", href: "/vn/graphics-cards/rog-astral/rog-astral-rtx5090-o32g-gaming" },
      { img: "/sites/rog-asus/img/vga/hot-matrix-5090.webp", name: "ROG Matrix Platinum GeForce RTX™ 5090 - ASUS Graphics Cards 30th Anniversary Edition", desc: "Card đồ họa phiên bản kỷ niệm 30 năm ASUS: Song song BTF + 12V-2x6 cấp tới 800W, bốn quạt buồng hơi đồng, keo kim loại lỏng và Memory Defroster LN2.", href: "/vn/graphics-cards/rog-matrix/rog-matrix-rtx5090-p32g-30th" },
      { img: "/sites/rog-asus/img/vga/hot-strix-5070ti.webp", name: "ROG Strix GeForce RTX™ 5070 Ti 16GB GDDR7 OC Edition", desc: "ROG Strix GeForce RTX™ 5070 Ti OC Edition 16GB GDDR7 với hệ thống tản nhiệt tiên tiến cung cấp cho bạn khả năng cấp nguồn cao cấp.", href: "/vn/graphics-cards/rog-astral/rog-astral-rtx5090-o32g-gaming" },
    ],
    rel: [
      { img: "/sites/rog-asus/img/relprod/xg-mobile.webp", name: "ROG XG Mobile (2025)", href: "/vn/external-graphics-docks/rog-xg-mobile-2025/" },
      { img: "/sites/rog-asus/img/relprod/kithara.webp", name: "ROG Kithara Gaming Headset", href: "/vn/headsets-audio/headsets/3-5mm-headsets/rog-kithara/" },
      { img: "/sites/rog-asus/img/relprod/falchion-ace-75.webp", name: "ROG Falchion Ace 75 HE Gaming Keyboard", href: "/vn/keyboards/keyboards/pbt-keycaps/rog-falchion-ace-75-he/" },
    ],
  },
  "power-supply-units-group": {
    hero: [{ src: "/sites/rog-asus/img/psu/hero-1.webp", alt: "ROG Nguồn máy tính" }],
    intro: {
      title: "NGUỒN MÁY TÍNH GAMING ASUS ROG",
      text: "Nguồn máy tính ROG Thor với chứng nhận Platinum/Titanium, màn hình OLED magnetic, GPU-First intelligent voltage stabilizer — nguồn sạch và ổn định cho cấu hình đỉnh cao.",
      xemHref: "/vn/power-supply-units-group/allmodels",
    },
    hot: [
      { img: "/sites/rog-asus/img/psu/hot-thor-1200.webp", name: "ROG Thor 1200W Platinum III (ROG Equalizer)", desc: "", href: "/vn/external-graphics-docks/rog-xg-mobile-2025" },
      { img: "/sites/rog-asus/img/psu/hot-thor-1200-white.webp", name: "ROG Thor 1200W Platinum III White Edition (ROG Equalizer)", desc: "", href: "/vn/power-supply-units/rog-thor/rog-thor-1600t3-gaming" },
      { img: "/sites/rog-asus/img/psu/hot-thor-1600-evo.webp", name: "ROG Thor 1600W Titanium III EVO (ROG Equalizer)", desc: "", href: "/vn/power-supply-units/rog-thor/rog-thor-1600t3-gaming" },
      { img: "/sites/rog-asus/img/psu/hot-thor-3000.webp", name: "ROG Thor 3000W Titanium III Edition 20 (ROG Equalizer)", desc: "Delivers heavy-duty power, dual-voltage adaptability, along with GPU-First intelligent voltage stabilizer and a magnetic OLED display & extender for high-performance builds.", href: "/vn/power-supply-units/rog-thor/rog-thor-1600t3-gaming" },
    ],
    rel: [
      { img: "/sites/rog-asus/img/relprod/xg-mobile.webp", name: "ROG XG Mobile (2025)", href: "/vn/external-graphics-docks/rog-xg-mobile-2025/" },
      { img: "/sites/rog-asus/img/relprod/kithara.webp", name: "ROG Kithara Gaming Headset", href: "/vn/headsets-audio/headsets/3-5mm-headsets/rog-kithara/" },
      { img: "/sites/rog-asus/img/relprod/falchion-ace-75.webp", name: "ROG Falchion Ace 75 HE Gaming Keyboard", href: "/vn/keyboards/keyboards/pbt-keycaps/rog-falchion-ace-75-he/" },
    ],
  },
  "headsets-audio-group": {
    hero: [{ src: "/sites/rog-asus/img/audio/hero-1.webp", alt: "ROG Tai nghe & audio" }],
    intro: {
      title: "TAI NGHE & AUDIO GAMING ASUS ROG",
      text: "Tai nghe gaming ASUS ROG với công nghệ không dây ROG SpeedNova, driver planar magnetic 100mm do HIFIMAN sản xuất, màng loa 50mm phủ titanium và micro boom AI khử nhiễu.",
      xemHref: "/vn/headsets-audio/headsets-series",
    },
    hot: [
      { img: "/sites/rog-asus/img/audio/hot-kithara.webp", name: "ROG Kithara Gaming Headset", desc: "Tai nghe gaming ROG Kithara với driver từ phẳng (planar magnetic) 100mm do HIFIMAN sản xuất và ROG tinh chỉnh, cấu trúc mở, micrô boom MEMS toàn dải, đầu vào kép 3,5mm.", href: "/vn/headsets-audio/headsets/3-5mm-headsets/rog-kithara/" },
      { img: "/sites/rog-asus/img/audio/hot-delta-2-kjp.webp", name: "ROG Delta II-KJP Gaming Headset", desc: "Tai nghe gaming không dây ba chế độ kết nối với công nghệ ROG SpeedNova, màng loa 50 mm phủ titanium với cấu hình âm thanh không dây tinh chỉnh, micrô dạng boom với dải siêu rộng.", href: "/vn/external-graphics-docks/rog-xg-mobile-2025" },
      { img: "/sites/rog-asus/img/audio/hot-pelta.webp", name: "ROG Pelta Gaming Headset", desc: "Tai nghe gaming RGB ba chế độ với công nghệ không dây ROG SpeedNova, màng loa mạ titan ROG 50 mm, chất âm không dây tinh tế, micro boom siêu rộng 10 mm, thiết kế nhẹ chỉ 309 g.", href: "/vn/headsets-audio/headsets/wireless-headsets/rog-delta-ii-kjp" },
      { img: "/sites/rog-asus/img/audio/hot-delta-2.webp", name: "ROG Delta II", desc: "Tai nghe gaming kết nối không dây ba chế độ với công nghệ ROG SpeedNova, màng loa diaphragm phủ titanium 50 mm và âm thanh không dây được tinh chỉnh, microphone dạng boom siêu băng.", href: "/vn/headsets-audio/headsets/wireless-headsets/rog-delta-ii-kjp" },
    ],
    rel: [
      { img: "/sites/rog-asus/img/relprod/xg-mobile.webp", name: "ROG XG Mobile (2025)", href: "/vn/external-graphics-docks/rog-xg-mobile-2025/" },
      { img: "/sites/rog-asus/img/relprod/swift-oled-pg34wcdn.webp", name: "ROG Swift OLED PG34WCDN", href: "/vn/monitors/32-to-34-inches/rog-swift-oled-pg34wcdn/" },
      { img: "/sites/rog-asus/img/relprod/falchion-ace-75.webp", name: "ROG Falchion Ace 75 HE Gaming Keyboard", href: "/vn/keyboards/keyboards/pbt-keycaps/rog-falchion-ace-75-he/" },
    ],
  },
  "mice-mouse-pads-group": {
    hero: [{ src: "/sites/rog-asus/img/mice/hero-1.webp", alt: "ROG Chuột & lót chuột" }],
    intro: {
      title: "CHUỘT & LÓT CHUỘT GAMING ASUS ROG",
      text: "Chuột gaming ASUS ROG siêu nhẹ từ 48 gram với cảm biến quang học tinh chỉnh cùng các pro-player FPS, lót chuột ROG Hone và bộ keycap sưu tầm Edition 20.",
      xemHref: "/vn/mice-mouse-pads/mice-series",
    },
    bigCards: [
      { img: "/sites/rog-asus/img/mice/big-1.webp" },
      { img: "/sites/rog-asus/img/mice/big-2.webp" },
      { img: "/sites/rog-asus/img/mice/big-3.webp" },
    ],
    hot: [
      { img: "/sites/rog-asus/img/mice/hot-harpe-2-extreme.webp", name: "ROG Harpe II Extreme Edition 20 Gaming Mouse", desc: "ROG Keycap Mystery Box Edition 20 sở hữu các thiết kế độc đáo lấy cảm hứng từ ROG, mang đến trải nghiệm mở hộp đầy bất ngờ. Mỗi hộp chứa một keycap sưu tầm được chế tác tinh xảo.", href: "/vn/mice-mouse-pads/mice/wireless-mice/rog-harpe-ace-extreme" },
      { img: "/sites/rog-asus/img/mice/hot-keris-2-kjp.webp", name: "ROG Keris II Origin-KJP Gaming Mouse", desc: "ROG Keris II Origin-KJP là dòng chuột gaming công thái học siêu nhẹ chỉ 63 gram, với kiểu dáng đã được kiểm chứng bởi các tuyển thủ FPS chuyên nghiệp. Chuột sở hữu hệ thống đèn RGB.", href: "/vn/mice-mouse-pads/mice/wireless-mice/rog-keris-ii-origin-kjp" },
      { img: "/sites/rog-asus/img/mice/hot-harpe-2-ace.webp", name: "ROG Harpe II Ace Gaming Mouse", desc: "The ROG Harpe II Ace is an ultralight 48-gram semi-symmetrical gaming mouse with a shape developed with the help of esports professionals. It packs a raft of pro-approved technologies.", href: "/vn/mice-mouse-pads/mice/wireless-mice/rog-harpe-ace-aim-lab-edition-model" },
      { img: "/sites/rog-asus/img/mice/hot-keris-2-origin.webp", name: "ROG Keris II Origin", desc: "ROG Keris II Origin là chuột chơi game công thái học siêu nhẹ chỉ 65 gram, với phom dáng đã được các game thủ FPS chuyên nghiệp kiểm nghiệm. Chuột có đèn RGB 3 vùng rực rỡ.", href: "/vn/mice-mouse-pads/mice/wireless-mice/rog-keris-ii-origin-kjp" },
    ],
    rel: [
      { img: "/sites/rog-asus/img/relprod/xg-mobile.webp", name: "ROG XG Mobile (2025)", href: "/vn/external-graphics-docks/rog-xg-mobile-2025/" },
      { img: "/sites/rog-asus/img/relprod/kithara.webp", name: "ROG Kithara Gaming Headset", href: "/vn/headsets-audio/headsets/3-5mm-headsets/rog-kithara/" },
      { img: "/sites/rog-asus/img/relprod/swift-oled-pg34wcdn.webp", name: "ROG Swift OLED PG34WCDN", href: "/vn/monitors/32-to-34-inches/rog-swift-oled-pg34wcdn/" },
    ],
  },
  "cooling-group": {
    hero: [
      { src: "/sites/rog-asus/img/cool/hero-1.webp", alt: "ROG Làm mát" },
      { src: "/sites/rog-asus/img/cool/hero-2.webp", alt: "ROG Làm mát" },
    ],
    intro: {
      title: "LÀM MÁT GAMING ASUS ROG",
      text: "Giải pháp tản nhiệt ASUS ROG — AIO ROG Ryujin III với màn hình LCD 3.5 inch và bơm Asetek, ROG Strix LC IV ARGB, keo tản nhiệt Performance RG-07 cho hiệu năng nhiệt đỉnh cao.",
      xemHref: "/vn/cooling/cpu-liquid-coolers-series",
    },
    hot: [
      { img: "/sites/rog-asus/img/cool/hot-rg07.webp", name: "ROG RG-07 PERFORMANCE THERMAL PASTE", desc: "Keo tản nhiệt Performance ROG RG-07 có tính dẫn nhiệt tuyệt vời và công thức độ bền cao đặc biệt giúp dễ dàng thoa và trải đều.", href: "/vn/cooling/thermal-pastes/rog-rg-07-performance-thermal-paste-model" },
      { img: "/sites/rog-asus/img/cool/hot-ryujin-3.webp", name: "ROG RYUJIN III WB", desc: "Water block CPU ROG Ryujin III WB với màn hình LCD 3,5 inch đủ màu, quạt VRM nhúng, 178 cánh tản nhiệt vi mô và công nghệ làm mát tấm lạnh bằng hợp kim đồng của Asetek.", href: "/vn/cooling/custom-cooling/rog-ryujin-iii-wb-model" },
      { img: "/sites/rog-asus/img/cool/hot-ryujin-3-white.webp", name: "ROG RYUJIN III WB White Edition", desc: "Water block CPU ROG Ryujin III WB White Edition với màn hình LCD 3,5 inch đủ màu, quạt VRM nhúng, 178 cánh tản nhiệt vi mô và công nghệ làm mát tấm lạnh bằng hợp kim đồng của Asetek.", href: "/vn/cooling/custom-cooling/rog-ryujin-iii-wb-white-edition-model" },
      { img: "/sites/rog-asus/img/cool/hot-strix-lc-4.webp", name: "ROG Strix LC IV 360 ARGB LCD", desc: "ROG Strix LC IV 360 ARGB LCD với màn hình IPS 5.08 inch, AIO Q-Connector giúp lắp đặt gọn gàng không dây, bơm mạnh mẽ & bộ ba quạt ARGB tích hợp mang lại hiệu quả tản nhiệt đẳng cấp.", href: "/vn/cooling/cpu-liquid-coolers/rog-strix-lc/rog-strix-lc-iv-360-argb-lcd" },
    ],
    rel: [
      { img: "/sites/rog-asus/img/relprod/xg-mobile.webp", name: "ROG XG Mobile (2025)", href: "/vn/external-graphics-docks/rog-xg-mobile-2025/" },
      { img: "/sites/rog-asus/img/relprod/kithara.webp", name: "ROG Kithara Gaming Headset", href: "/vn/headsets-audio/headsets/3-5mm-headsets/rog-kithara/" },
      { img: "/sites/rog-asus/img/relprod/falchion-ace-75.webp", name: "ROG Falchion Ace 75 HE Gaming Keyboard", href: "/vn/keyboards/keyboards/pbt-keycaps/rog-falchion-ace-75-he/" },
    ],
  },
  "gaming-handhelds-group": {
    hero: [
      { src: "/sites/rog-asus/img/handheld/hero-1.webp", alt: "ROG Gaming Handhelds" },
      { src: "/sites/rog-asus/img/handheld/hero-2.webp", alt: "ROG Gaming Handhelds" },
    ],
    intro: {
      title: "MÁY CHƠI GAME CẦM TAY ASUS ROG ALLY",
      text: "ROG Ally và ROG Ally X — máy chơi game handheld chạy Windows 11 với vi xử lý AMD Ryzen™ Z1 Extreme, pin lên đến 80Wh, 24GB LPDDR5X RAM 7500MHz và màn hình FHD 120Hz 500 nits FreeSync Premium mang lại trải nghiệm game AAA mượt mà ở mọi nơi.",
      xemHref: "/vn/gaming-handhelds/accessories-series",
    },
    seriesList: [
      {
        title: "ROG Ally",
        desc: "Máy chơi game handheld chạy Windows 11 với AMD Ryzen™ Z1 Series, màn hình 7-inch FHD 120Hz 100% sRGB và thư viện game đa nền tảng Armoury Crate SE.",
        href: "/vn/gaming-handhelds/rog-ally/rog-ally-2023",
        img: "/sites/rog-asus/img/handheld/big-1.webp",
      },
      {
        title: "Phụ kiện Gaming Handhelds",
        desc: "Bộ phụ kiện chuẩn eSports gồm sạc nhanh ROG Gaming Charger Dock 65W, bao chống sốc chuẩn quân đội Travel Case và dock đồ họa ngoài XG Mobile.",
        href: "/vn/gaming-handhelds/accessories-series",
        img: "/sites/rog-asus/img/products/docks-chargers-cables.webp",
      },
    ],
    bigCards: [{ img: "/sites/rog-asus/img/handheld/big-1.webp" }],
    hot: [
      {
        img: "/sites/rog-asus/img/products/gaming-handhelds.webp",
        name: "ROG Ally X (2024) RC72LA",
        desc: "Vi xử lý AMD Ryzen™ Z1 Extreme, RAM 24GB LPDDR5X-7500, SSD 1TB M.2 2280 NVMe™, Pin khủng 80Wh, hai cổng USB-C (Thunderbolt 4), tản nhiệt Zero Gravity tối ưu luồng gió.",
        href: "/vn/gaming-handhelds/rog-ally/rog-ally-x-2024",
      },
      {
        img: "/sites/rog-asus/img/handheld/big-1.webp",
        name: "ROG Ally (2023) RC71L",
        desc: "Vi xử lý AMD Ryzen™ Z1 Extreme, RAM 16GB LPDDR5, SSD 512GB PCIe 4.0, màn hình 7-inch FHD 120Hz 100% sRGB, công nghệ quản lý thư viện game Armoury Crate SE.",
        href: "/vn/gaming-handhelds/rog-ally/rog-ally-2023",
      },
      {
        img: "/sites/rog-asus/img/products/docks-chargers-cables.webp",
        name: "ROG Gaming Charger Dock 65W",
        desc: "Củ sạc công suất 65W kiêm cổng xuất HDMI 2.0 và USB 2.0 Type-A hỗ trợ sạc nhanh và xuất hình ảnh độ phân giải 4K 60Hz lên TV/màn hình lớn.",
        href: "/vn/docks-chargers-and-cables/chargers/rog-gaming-charger-dock",
      },
      {
        img: "/sites/rog-asus/img/products/protection-gadgets.webp",
        name: "Bao đựng ROG Ally Travel Case",
        desc: "Bao chống nước, đệm mút chống sốc chuẩn quân đội, khay gập dựng máy linh hoạt khi chơi game ở mọi nơi cùng khe cắm thẻ microSD tiện lợi.",
        href: "/vn/gaming-handhelds/accessories/rog-ally-travel-case",
      },
    ],
    rel: [
      { img: "/sites/rog-asus/img/relprod/kithara.webp", name: "ROG Kithara Gaming Headset", href: "/vn/headsets-audio/headsets/3-5mm-headsets/rog-kithara/" },
      { img: "/sites/rog-asus/img/relprod/falchion-ace-75.webp", name: "ROG Falchion Ace 75 HE Gaming Keyboard", href: "/vn/keyboards/keyboards/pbt-keycaps/rog-falchion-ace-75-he/" },
      { img: "/sites/rog-asus/img/relprod/xg-mobile.webp", name: "ROG XG Mobile (2025)", href: "/vn/external-graphics-docks/rog-xg-mobile-2025/" },
    ],
  },
  "phones-group": {
    hero: [{ src: "/sites/rog-asus/img/hero/gamescom.webp", alt: "ROG Phone Gaming" }],
    intro: {
      title: "ĐIỆN THOẠI & THIẾT BỊ DI ĐỘNG CAO CẤP",
      text: "Bộ sưu tập điện thoại gaming ASUS ROG Phone đỉnh cao cùng các siêu phẩm công nghệ hàng đầu thế giới: Samsung Galaxy Z Fold8 Ultra màn hình gập titan, Apple iPhone Duo kép 360°, iPhone 18 Pro titan, iPad Pro Tandem OLED mỏng 5.1mm và MacBook Pro ProLED XDR Display siêu nét.",
      xemHref: "/vn/phones-group/allmodels",
    },
    bigCards: [{ img: "/sites/rog-asus/img/products/phones.webp" }],
    seriesList: [
      {
        title: "Samsung Galaxy Z Fold Series",
        desc: "Siêu phẩm flagship màn hình gập titan 8.0 inch QHD+ 120Hz không nếp gấp, chip Snapdragon® 8 Gen 5 for Galaxy, Galaxy AI Now Nudge thông minh và bút S-Pen chuyên dụng.",
        href: "/vn/smartphones/galaxy-z-fold8-ultra",
        img: "/sites/mobile/galaxy-z-fold8-ultra.jpg",
      },
      {
        title: "Apple iPhone Pro & Duo Series",
        desc: "Thế hệ iPhone đỉnh cao với iPhone 18 Pro khung titan hàng không vũ trụ và iPhone Duo màn hình kép Super Retina XDR OLED 120Hz, chip A20 Bionic 2nm siêu mạnh mẽ.",
        href: "/vn/iphone-18-pro",
        img: "/sites/mobile/iphone-18-pro.png",
      },
      {
        title: "Apple iPad Pro Series",
        desc: "Màn hình Ultra Retina XDR Tandem OLED tiên tiến nhất hành tinh, chip Apple M4 sức mạnh vượt trội, thân máy siêu mỏng chỉ 5.1mm mỏng nhất lịch sử Apple.",
        href: "/vn/ipad-pro",
        img: "/sites/mobile/ipad-pro.jpg",
      },
      {
        title: "Apple MacBook Pro Series",
        desc: "Màn hình ProLED XDR Display đột phá với độ sáng tối đa 1600 nits, chip Apple M4 Max chuyên xử lý render 3D nặng, thời lượng pin cả ngày lên tới 24 giờ.",
        href: "/vn/macbook-pro/proled-xdr-display",
        img: "/sites/mobile/macbook-pro.jpg",
      },
      {
        title: "ASUS ROG Phone Series",
        desc: "Dòng điện thoại gaming số 1 thế giới với chip Snapdragon® 8 Elite, tần số quét 185Hz siêu mượt, tản nhiệt GameCool 9 và hệ sinh thái phụ kiện eSports độc quyền.",
        href: "/vn/phones/rog-phone-7",
        img: "/sites/rog-asus/img/detail/rog-phone-7-thumb.webp",
      },
    ],
    hot: [
      {
        img: "/sites/mobile/galaxy-z-fold8-ultra.jpg",
        name: "Samsung Galaxy Z Fold8 Ultra",
        desc: "Siêu phẩm màn hình gập đôi và gập ba Flex Titanium 8.0 inch QHD+ 120Hz không nếp gấp, chip Snapdragon® 8 Gen 5 for Galaxy, Galaxy AI Now Nudge, bút S-Pen tích hợp và chống nước IP48.",
        href: "/vn/smartphones/galaxy-z-fold8-ultra",
      },
      {
        img: "/sites/mobile/iphone-duo.png",
        name: "Apple iPhone Duo (2026)",
        desc: "Thiết kế màn hình kép xoay lật 360° gốm titan siêu mỏng, chip Apple A19 Pro Bionic, màn hình Super Retina XDR Duo 120Hz ProMotion và Apple Intelligence đa luồng thế hệ mới.",
        href: "/vn/iphone-duo",
      },
      {
        img: "/sites/mobile/iphone-18-pro.png",
        name: "Apple iPhone 18 Pro",
        desc: "Khung titan cấp hàng không vũ trụ, chip Apple A20 Bionic tiến trình 2nm, camera Pro Fusion 48MP ống kính tiềm vọng zoom quang học 10X, quay phim 4K 120 fps Dolby Vision HDR.",
        href: "/vn/iphone-18-pro",
      },
      {
        img: "/sites/mobile/ipad-pro.jpg",
        name: "Apple iPad Pro M4",
        desc: "Màn hình Ultra Retina XDR Tandem OLED hai lớp đột phá, trang bị vi xử lý Apple M4 thế hệ mới, hỗ trợ bút Apple Pencil Pro, thân máy nhôm tái chế siêu mỏng chỉ 5.1 mm.",
        href: "/vn/ipad-pro",
      },
      {
        img: "/sites/mobile/macbook-pro.jpg",
        name: "Apple MacBook Pro ProLED XDR",
        desc: "Laptop đỉnh cao sáng tạo với màn hình ProLED XDR Display độ sáng 1600 nits đỉnh, vi xử lý Apple M4 Pro / M4 Max, 128GB RAM hợp nhất và thời lượng pin sử dụng liên tục đến 24 giờ.",
        href: "/vn/macbook-pro/proled-xdr-display",
      },
      {
        img: "/sites/rog-asus/img/detail/rog-phone-7-thumb.webp",
        name: "ROG Phone 7",
        desc: "Snapdragon® 8 Gen 2, màn hình 165Hz Samsung AMOLED 1500 nits, tản nhiệt GameCool 7 buồng hơi chu trình nhanh, nút siêu âm AirTrigger và pin khủng 6000 mAh 65W HyperCharge.",
        href: "/vn/phones/rog-phone-7",
      },
      {
        img: "/sites/rog-asus/img/products/phones.webp",
        name: "ROG Phone 9 Pro",
        desc: "Qualcomm® Snapdragon® 8 Elite 3nm, RAM lên đến 24GB LPDDR5X, ROM 1TB UFS 4.0, Màn hình AMOLED 6.78 inch 185Hz LTPO, Màn hình phụ AniMe Vision 648 đèn mini-LED, Pin 5800mAh sạc nhanh 65W HyperCharge.",
        href: "/vn/phones/rog-phone-9-pro",
      },
      {
        img: "/sites/rog-asus/img/products/phones.webp",
        name: "ROG Phone 8 Pro Edition",
        desc: "Snapdragon® 8 Gen 3, RAM 16GB, màn hình AniMe Vision mặt lưng, camera 50MP Gimbal OIS chống rung 6 trục, zoom quang học 3X sắc nét.",
        href: "/vn/phones/rog-phone-8-pro",
      },
      {
        img: "/sites/rog-asus/img/products/phones.webp",
        name: "Quạt tản nhiệt AeroActive Cooler X Pro",
        desc: "Tích hợp sò lạnh nhiệt điện TEC lớn hơn 2.6 lần, tăng 29% hiệu quả làm mát, bổ sung 2 nút bấm vật lý và loa siêu trầm subwoofer âm thanh 2.1 sống động.",
        href: "/vn/phones-group/allmodels",
      },
    ],
    rel: [
      { img: "/sites/mobile/iphone-duo.png", name: "Apple iPhone Duo (2026)", href: "/vn/iphone-duo" },
      { img: "/sites/mobile/galaxy-z-fold8-ultra.jpg", name: "Samsung Galaxy Z Fold8 Ultra", href: "/vn/smartphones/galaxy-z-fold8-ultra" },
      { img: "/sites/mobile/ipad-pro.jpg", name: "Apple iPad Pro M4", href: "/vn/ipad-pro" },
      { img: "/sites/mobile/macbook-pro.jpg", name: "Apple MacBook Pro ProLED XDR", href: "/vn/macbook-pro/proled-xdr-display" },
      { img: "/sites/rog-asus/img/detail/rog-phone-7-thumb.webp", name: "ROG Phone 7", href: "/vn/phones/rog-phone-7" },
    ],
  },
  "desktops-group": {
    hero: [{ src: "/sites/rog-asus/img/mb/hero-1.webp", alt: "ROG Máy Bộ PC Gaming" }],
    intro: {
      title: "MÁY BỘ PC GAMING ASUS ROG",
      text: "Máy bộ PC gaming ROG Strix và ROG Hyperion — hiệu năng đồ họa cực đại với Intel® Core™ Ultra / AMD Ryzen™ 9000 và card đồ họa ROG Strix NVIDIA® GeForce RTX™ 50 Series, thiết kế thùng máy tối ưu luồng gió và đèn Aura Sync RGB tùy biến.",
      xemHref: "/vn/desktops-group/allmodels",
    },
    bigCards: [{ img: "/sites/rog-asus/img/products/may-bo-pc-gaming.webp" }],
    hot: [
      {
        img: "/sites/rog-asus/img/products/may-bo-pc-gaming.webp",
        name: "ROG Strix G22CH (2025)",
        desc: "PC gaming kích thước nhỏ gọn 10L, trang bị Intel® Core™ i9-14900KF, NVIDIA® GeForce RTX™ 4070 Ti Super, tản nhiệt chất lỏng tùy chọn, thiết kế mở nắp không cần dụng cụ.",
        href: "/vn/external-graphics-docks/rog-xg-mobile-2025",
      },
      {
        img: "/sites/rog-asus/img/products/may-bo-pc-gaming.webp",
        name: "ROG Strix G16CHR",
        desc: "Thùng máy gaming mid-tower với Intel® Core™ Ultra 9, NVIDIA® GeForce RTX™ 5080, RAM 64GB DDR5, SSD 2TB NVMe PCIe 4.0, tay xách tiện lợi và quạt ARGB đồng bộ.",
        href: "/vn/desktops/mini-pc/rog-nuc-2025",
      },
      {
        img: "/sites/rog-asus/img/products/may-bo-pc-gaming.webp",
        name: "ROG Strix GT15 G15CF",
        desc: "PC gaming eSports với thiết kế quai cầm tiện lợi, khe cắm tai nghe tích hợp, luồng khí đa vùng Multi-zone Flow tản nhiệt êm ái.",
        href: "/vn/desktops/mini-pc/rog-nuc-2025",
      },
      {
        img: "/sites/rog-asus/img/products/may-bo-pc-gaming.webp",
        name: "ROG Hyperion Extreme Gaming PC",
        desc: "Cỗ máy PC đỉnh cao lắp ráp trong thùng case ROG Hyperion GR701, bo mạch chủ ROG Maximus Z890 Extreme và card đồ họa ROG Strix RTX 5090 32GB.",
        href: "/vn/desktops/mini-pc/rog-nuc-2025",
      },
    ],
    rel: [
      { img: "/sites/rog-asus/img/relprod/swift-oled-pg34wcdn.webp", name: "ROG Swift OLED PG34WCDN", href: "/vn/monitors/32-to-34-inches/rog-swift-oled-pg34wcdn" },
      { img: "/sites/rog-asus/img/relprod/falchion-ace-75.webp", name: "ROG Falchion Ace 75 HE Gaming Keyboard", href: "/vn/keyboards/keyboards/pbt-keycaps/rog-falchion-ace-75-he/" },
      { img: "/sites/rog-asus/img/relprod/kithara.webp", name: "ROG Kithara Gaming Headset", href: "/vn/headsets-audio/headsets/3-5mm-headsets/rog-kithara/" },
    ],
  },
  "cases-group": {
    hero: [{ src: "/sites/rog-asus/img/vga/hero-1.webp", alt: "ROG Vỏ Case Gaming" }],
    intro: {
      title: "VỎ CASE MÁY TÍNH ASUS ROG",
      text: "Vỏ case gaming ASUS ROG Hyperion và ROG Strix Helios — không gian lắp ráp rộng rãi, hỗ trợ radiator tản nhiệt nước kép 420mm, kính cường lực cánh bướm và khung nhôm đúc chịu lực chắc chắn.",
      xemHref: "/vn/cases-group/allmodels",
    },
    bigCards: [{ img: "/sites/rog-asus/img/products/cases.webp" }],
    hot: [
      {
        img: "/sites/rog-asus/img/products/cases.webp",
        name: "ROG Hyperion GR701",
        desc: "Vỏ case full-tower cao cấp hỗ trợ 2 radiator 420mm, card đồ họa dài 460mm, hub điều khiển quạt & ARGB tích hợp, cổng sạc Type-C 60W sạc nhanh PD.",
        href: "/vn/cases/rog-hyperion/rog-hyperion-gr701",
      },
      {
        img: "/sites/rog-asus/img/products/cases.webp",
        name: "ROG Hyperion GR701 BTF Edition",
        desc: "Phiên bản thiết kế chuyên biệt cho hệ sinh thái BTF giấu dây hoàn toàn, mang lại không gian nội thất thùng máy sạch sẽ tuyệt đối.",
        href: "/vn/cases/rog-hyperion-gr701-model",
      },
      {
        img: "/sites/rog-asus/img/products/cases.webp",
        name: "ROG Strix Helios RGB",
        desc: "Vỏ case mid-tower với 3 mặt kính cường lực màu khói, khung nhôm phay xước, quai xách công thái học tải trọng 50kg và đèn Aura Sync RGB mặt trước.",
        href: "/vn/cases/rog-hyperion-gr701-btf-edition",
      },
      {
        img: "/sites/rog-asus/img/products/cases.webp",
        name: "ROG Strix Helios White Edition",
        desc: "Phiên bản màu trắng bạc thanh lịch, phù hợp các cấu hình góc máy All-White tinh tế với 4 quạt 140mm đi kèm.",
        href: "/vn/cases/rog-strix-helios-ii-white-edition",
      },
    ],
    rel: [
      { img: "/sites/rog-asus/img/relprod/falchion-ace-75.webp", name: "ROG Falchion Ace 75 HE Gaming Keyboard", href: "/vn/keyboards/keyboards/pbt-keycaps/rog-falchion-ace-75-he/" },
      { img: "/sites/rog-asus/img/relprod/kithara.webp", name: "ROG Kithara Gaming Headset", href: "/vn/headsets-audio/headsets/3-5mm-headsets/rog-kithara/" },
      { img: "/sites/rog-asus/img/relprod/swift-oled-pg34wcdn.webp", name: "ROG Swift OLED PG34WCDN", href: "/vn/monitors/32-to-34-inches/rog-swift-oled-pg34wcdn" },
    ],
  },
  "networking-group": {
    hero: [{ src: "/sites/rog-asus/img/hero/google-ai.webp", alt: "ROG Thiết Bị Mạng" }],
    intro: {
      title: "THIẾT BỊ MẠNG GAMING ASUS ROG",
      text: "Router gaming ROG Rapture WiFi 7 và WiFi 6E — băng thông siêu tốc lên đến 30Gbps, công nghệ tăng tốc game 3 cấp độ Triple-level Game Acceleration, cổng mạng 10Gbps và bảo mật AiProtection Pro trọn đời.",
      xemHref: "/vn/networking-group/allmodels",
    },
    bigCards: [{ img: "/sites/rog-asus/img/products/thiet-bi-mang.webp" }],
    hot: [
      {
        img: "/sites/rog-asus/img/products/thiet-bi-mang.webp",
        name: "ROG Rapture GT-BE98 Pro",
        desc: "Router gaming WiFi 7 4 băng tần đầu tiên trên thế giới, tốc độ lên đến 30.000 Mbps, kênh truyền 320MHz, 2 cổng 10G và 4 cổng 2.5G.",
        href: "/vn/networking/rog-rapture/rog-rapture-gt-be98-pro",
      },
      {
        img: "/sites/rog-asus/img/products/thiet-bi-mang.webp",
        name: "ROG Rapture GT-BE19000",
        desc: "Router WiFi 7 3 băng tần hiệu năng cao, chip xử lý 4 nhân 2.6GHz, tính năng Smart AiMesh và cổng Gaming Port ưu tiên lưu lượng mạng.",
        href: "/vn/networking/rog-rapture-gt-be98-model",
      },
      {
        img: "/sites/rog-asus/img/products/thiet-bi-mang.webp",
        name: "ROG Rapture GT6 (Hệ thống Mesh Gaming)",
        desc: "Hệ thống WiFi Mesh chuyên biệt cho game thủ, vùng phủ sóng lên đến 540m², 9 ăng-ten ngầm định hướng thông minh, loại bỏ hoàn toàn điểm chết.",
        href: "/vn/networking/rog-rapture-gt-be98-model",
      },
      {
        img: "/sites/rog-asus/img/products/thiet-bi-mang.webp",
        name: "ROG Rapture GT-AX11000 Pro",
        desc: "Router WiFi 6 ba băng tần 11000 Mbps, cổng mạng 10Gbps + 2.5Gbps, chế độ Mobile Game Mode giảm giật lag trên smartphone chỉ với 1 chạm.",
        href: "/vn/networking/rog-rapture-gt-be98-model",
      },
    ],
    rel: [
      { img: "/sites/rog-asus/img/relprod/kithara.webp", name: "ROG Kithara Gaming Headset", href: "/vn/headsets-audio/headsets/3-5mm-headsets/rog-kithara/" },
      { img: "/sites/rog-asus/img/relprod/falchion-ace-75.webp", name: "ROG Falchion Ace 75 HE Gaming Keyboard", href: "/vn/keyboards/keyboards/pbt-keycaps/rog-falchion-ace-75-he/" },
      { img: "/sites/rog-asus/img/relprod/swift-oled-pg34wcdn.webp", name: "ROG Swift OLED PG34WCDN", href: "/vn/monitors/32-to-34-inches/rog-swift-oled-pg34wcdn" },
    ],
  },
  "external-graphics-docks-group": {
    hero: [{ src: "/sites/rog-asus/img/flow/hero-kjp.webp", alt: "ROG Dock VGA Gắn Ngoài" }],
    intro: {
      title: "DOCK VGA GẮN NGOÀI ASUS ROG XG MOBILE",
      text: "ROG XG Mobile — biến laptop di động ROG Flow hoặc ROG Ally thành cỗ máy chiến game đồ họa 4K đỉnh cao với GPU NVIDIA® GeForce RTX™ 50 Series hoặc RTX™ 4090, kết nối giao tiếp độc quyền PCIe x8 băng thông 63Gbps.",
      xemHref: "/vn/external-graphics-docks-group/allmodels",
    },
    bigCards: [{ img: "/sites/rog-asus/img/products/dock-vga.webp" }],
    hot: [
      {
        img: "/sites/rog-asus/img/relprod/xg-mobile.webp",
        name: "ROG XG Mobile (2025) GC34",
        desc: "Trang bị GPU NVIDIA® GeForce RTX™ 5090 Laptop TGP 175W, tích hợp cổng xuất hình HDMI 2.1, DisplayPort 2.1, cổng mạng LAN 2.5G và củ sạc 330W tích hợp.",
        href: "/vn/external-graphics-docks/rog-xg-mobile-2025",
      },
      {
        img: "/sites/rog-asus/img/products/dock-vga.webp",
        name: "ROG XG Mobile (2023) GC33",
        desc: "Trang bị NVIDIA® GeForce RTX™ 4090 Laptop GPU 16GB GDDR6, hệ thống tản nhiệt buồng hơi Vapor Chamber, trọng lượng chỉ 1.3 kg cực kỳ nhỏ gọn.",
        href: "/vn/external-graphics-docks/rog-xg-mobile-2025",
      },
      {
        img: "/sites/rog-asus/img/products/dock-vga.webp",
        name: "ROG XG Mobile AMD Radeon RX 6850M XT",
        desc: "Phiên bản trang bị đồ họa AMD RDNA 2, hỗ trợ xuất đa màn hình và hub kết nối USB 3.2 Gen 2 mở rộng.",
        href: "/vn/external-graphics-docks/rog-xg-mobile-2025",
      },
      {
        img: "/sites/rog-asus/img/products/dock-vga.webp",
        name: "Bộ chuyển đổi ROG XG Mobile Interface Cable",
        desc: "Cáp kết nối chuẩn giao tiếp độc quyền PCIe Direct kết hợp USB-C 10Gbps truyền tải tín hiệu không độ trễ.",
        href: "/vn/external-graphics-docks/rog-xg-mobile-2025",
      },
    ],
    rel: [
      { img: "/sites/rog-asus/img/relprod/swift-oled-pg34wcdn.webp", name: "ROG Swift OLED PG34WCDN", href: "/vn/monitors/32-to-34-inches/rog-swift-oled-pg34wcdn" },
      { img: "/sites/rog-asus/img/relprod/kithara.webp", name: "ROG Kithara Gaming Headset", href: "/vn/headsets-audio/headsets/3-5mm-headsets/rog-kithara/" },
      { img: "/sites/rog-asus/img/relprod/falchion-ace-75.webp", name: "ROG Falchion Ace 75 HE Gaming Keyboard", href: "/vn/keyboards/keyboards/pbt-keycaps/rog-falchion-ace-75-he/" },
    ],
  },
  "controllers-group": {
    hero: [{ src: "/sites/rog-asus/img/handheld/big-1.webp", alt: "ROG Tay Cầm Chơi Game" }],
    intro: {
      title: "TAY CẦM CHƠI GAME ASUS ROG",
      text: "Tay cầm chơi game ROG Raikiri và ROG Tessen — độ chính xác cao với cần analog chất lượng cao, màn hình OLED tích hợp tùy biến, phím bấm phía sau có thể gán macro và kết nối ba chế độ linh hoạt.",
      xemHref: "/vn/controllers-group/allmodels",
    },
    bigCards: [{ img: "/sites/rog-asus/img/products/tay-cam.webp" }],
    hot: [
      {
        img: "/sites/rog-asus/img/products/tay-cam.webp",
        name: "ROG Raikiri Pro",
        desc: "Tay cầm chơi game PC/Xbox có màn hình OLED tích hợp, kết nối Tri-Mode (Bluetooth, 2.4GHz RF, USB-C), 4 phím phụ phía sau, DAC ESS Sabre tích hợp.",
        href: "/vn/controllers/rog-raikiri/rog-raikiri-pro",
      },
      {
        img: "/sites/rog-asus/img/products/tay-cam.webp",
        name: "ROG Raikiri",
        desc: "Tay cầm có dây cho PC và Xbox Series X|S, 2 phím phụ sau lưng, cò bấm Trigger Stop 2 nấc hành trình tùy chỉnh, phần mềm Armoury Crate chuyên sâu.",
        href: "/vn/controllers/rog-raikiri-pro-model",
      },
      {
        img: "/sites/rog-asus/img/products/tay-cam.webp",
        name: "ROG Tessen Mobile Controller",
        desc: "Tay cầm chơi game gập gọn cho smartphone Android, kết nối USB-C không độ trễ, phím cơ xúc giác nảy và đèn RGB Aura cá tính.",
        href: "/vn/controllers/rog-raikiri-model",
      },
      {
        img: "/sites/rog-asus/img/products/tay-cam.webp",
        name: "Đế sạc nam châm ROG Controller Charging Stand",
        desc: "Đế sạc từ tính thông minh giữ tay cầm luôn đầy pin và hiển thị trạng thái sạc đẹp mắt trên bàn làm việc.",
        href: "/vn/controllers/rog-raikiri-pro-model",
      },
    ],
    rel: [
      { img: "/sites/rog-asus/img/relprod/kithara.webp", name: "ROG Kithara Gaming Headset", href: "/vn/headsets-audio/headsets/3-5mm-headsets/rog-kithara/" },
      { img: "/sites/rog-asus/img/relprod/swift-oled-pg34wcdn.webp", name: "ROG Swift OLED PG34WCDN", href: "/vn/monitors/32-to-34-inches/rog-swift-oled-pg34wcdn" },
      { img: "/sites/rog-asus/img/relprod/falchion-ace-75.webp", name: "ROG Falchion Ace 75 HE Gaming Keyboard", href: "/vn/keyboards/keyboards/pbt-keycaps/rog-falchion-ace-75-he/" },
    ],
  },
  storage: {
    hero: [{ src: "/sites/rog-asus/img/vga/hero-2.webp", alt: "ROG Ổ Lưu Trữ" }],
    intro: {
      title: "Ổ LƯU TRỮ DI ĐỘNG ASUS ROG",
      text: "Box ổ cứng di động ROG Strix Arion — tốc độ truyền tải thần tốc lên đến 10Gbps qua cổng USB-C 3.2 Gen 2x1, vỏ hợp kim nhôm tản nhiệt nguyên khối và đèn Aura Sync RGB chống va đập tiêu chuẩn.",
      xemHref: "/vn/storage/rog-strix-arion-model",
    },
    bigCards: [{ img: "/sites/rog-asus/img/products/o-luu-tru.webp" }],
    hot: [
      {
        img: "/sites/rog-asus/img/products/o-luu-tru.webp",
        name: "ROG Strix Arion S500",
        desc: "Ổ cứng SSD gắn ngoài 500GB NVMe PCIe chuẩn USB 3.2 Gen 2x1 tốc độ 1050 MB/s, mã hóa dữ liệu 256-bit AES, vỏ kim loại bảo vệ tản nhiệt tối ưu.",
        href: "/vn/storage/",
      },
      {
        img: "/sites/rog-asus/img/products/o-luu-tru.webp",
        name: "ROG Strix Arion (ESD-S1C)",
        desc: "Box đựng ổ cứng M.2 NVMe SSD hỗ trợ kích thước 2230/2242/2260/2280, cơ chế mở chốt gạt không cần tua-vít, móc treo chữ R tiện lợi.",
        href: "/vn/storage/",
      },
      {
        img: "/sites/rog-asus/img/products/o-luu-tru.webp",
        name: "ROG Strix Arion EVA Edition",
        desc: "Phiên bản giới hạn Evangelion hợp tác chính thức, màu sắc đặc trưng của robot EVA-01, đèn Aura RGB đồng bộ độc đáo.",
        href: "/vn/storage/",
      },
      {
        img: "/sites/rog-asus/img/products/o-luu-tru.webp",
        name: "Móc treo ROG Arion Protective Bumper",
        desc: "Ốp lưng silicon dẻo bảo vệ chống sốc toàn diện và móc khóa R-hook kim loại mang theo balo dễ dàng.",
        href: "/vn/storage/",
      },
    ],
    rel: [
      { img: "/sites/rog-asus/img/relprod/falchion-ace-75.webp", name: "ROG Falchion Ace 75 HE Gaming Keyboard", href: "/vn/keyboards/keyboards/pbt-keycaps/rog-falchion-ace-75-he/" },
      { img: "/sites/rog-asus/img/relprod/kithara.webp", name: "ROG Kithara Gaming Headset", href: "/vn/headsets-audio/headsets/3-5mm-headsets/rog-kithara/" },
      { img: "/sites/rog-asus/img/relprod/xg-mobile.webp", name: "ROG XG Mobile (2025)", href: "/vn/external-graphics-docks/rog-xg-mobile-2025/" },
    ],
  },
  "apparel-bags-gear-group": {
    hero: [{ src: "/sites/rog-asus/img/flow/hero-kjp.webp", alt: "ROG Thời Trang & Balo" }],
    intro: {
      title: "THỜI TRANG & BALO GAMING ASUS ROG",
      text: "Balo, túi đeo chéo và trang phục gaming ROG — thiết kế phong cách Cyberpunk hiện đại, chất liệu Cordura® siêu bền chống thấm nước, ngăn chứa bảo vệ laptop an toàn cho mọi chuyến đi.",
      xemHref: "/vn/apparel-bags-gear/bags-series",
    },
    bigCards: [{ img: "/sites/rog-asus/img/products/apparel-bags-gear.webp" }],
    hot: [
      {
        img: "/sites/rog-asus/img/products/apparel-bags-gear.webp",
        name: "Balo ROG Archer Backpack 15.6 / 17",
        desc: "Chất liệu vải Cordura 610D chống rách và chống nước, khóa kéo YKK bền bỉ, 3 ngăn đa năng chứa laptop 17 inch và máy ảnh chuyên nghiệp.",
        href: "/vn/storage/rog-strix-arion-eva-edition-model",
      },
      {
        img: "/sites/rog-asus/img/products/apparel-bags-gear.webp",
        name: "Balo ROG Ranger BP2701 Gaming",
        desc: "Thể tích chứa 22 lít, lớp đệm lưng êm ái thoáng khí, phản quang phản chiếu ban đêm phong cách stealth đậm chất ROG.",
        href: "/vn/external-graphics-docks/rog-xg-mobile-2025",
      },
      {
        img: "/sites/rog-asus/img/products/apparel-bags-gear.webp",
        name: "Túi đeo chéo ROG Slash Sling Bag",
        desc: "Thiết kế dây đai phong cách cyberpunk độc đáo, chống thấm nước IPX4, ngăn chống trầy chứa máy tính bảng hoặc Nintendo Switch / ROG Ally.",
        href: "/vn/apparel-bags-gear/bags/rog-archer-backpack-17-model",
      },
      {
        img: "/sites/rog-asus/img/products/apparel-bags-gear.webp",
        name: "Ghế gaming ROG Chariot Core",
        desc: "Khung thép chịu lực, đệm mút đúc mật độ cao, da PU cao cấp thoáng khí, tay vịn 4D điều chỉnh linh hoạt và ngả lưng 145 độ.",
        href: "/vn/apparel-bags-gear/bags/rog-archer-backpack-17-model",
      },
    ],
    rel: [
      { img: "/sites/rog-asus/img/relprod/kithara.webp", name: "ROG Kithara Gaming Headset", href: "/vn/headsets-audio/headsets/3-5mm-headsets/rog-kithara/" },
      { img: "/sites/rog-asus/img/relprod/falchion-ace-75.webp", name: "ROG Falchion Ace 75 HE Gaming Keyboard", href: "/vn/keyboards/keyboards/pbt-keycaps/rog-falchion-ace-75-he/" },
      { img: "/sites/rog-asus/img/relprod/swift-oled-pg34wcdn.webp", name: "ROG Swift OLED PG34WCDN", href: "/vn/monitors/32-to-34-inches/rog-swift-oled-pg34wcdn" },
    ],
  },
  "streaming-kits-group": {
    hero: [{ src: "/sites/rog-asus/img/audio/hero-1.webp", alt: "ROG Thiết Bị Streaming" }],
    intro: {
      title: "THIẾT BỊ STREAMING GAMING ASUS ROG",
      text: "Bộ thiết bị streamer chuyên nghiệp ROG — Microphone ROG Carnyx chuẩn phòng thu, webcam góc rộng Full HD 60fps và USB DAC khuếch đại âm thanh chất lượng cao.",
      xemHref: "/vn/streaming-kits-group/allmodels",
    },
    bigCards: [{ img: "/sites/rog-asus/img/products/streaming-kits.webp" }],
    hot: [
      {
        img: "/sites/rog-asus/img/products/streaming-kits.webp",
        name: "Microphone ROG Carnyx",
        desc: "Micro condenser màng thu lớn 25mm chuẩn phòng thu 192kHz/24-bit, màng lọc pop kim loại tích hợp, giá chống rung shock mount cao cấp và nút tắt mic 1 chạm.",
        href: "/vn/streaming-kits/rog-carnyx",
      },
      {
        img: "/sites/rog-asus/img/products/streaming-kits.webp",
        name: "Webcam ROG Eye S",
        desc: "Độ phân giải Full HD 1080p ở tốc độ 60fps mượt mà, micro kép khử ồn bằng AI thông minh, thiết kế gập siêu mỏng chỉ 17mm.",
        href: "/vn/streaming-kits/rog-carnyx",
      },
      {
        img: "/sites/rog-asus/img/products/streaming-kits.webp",
        name: "Bộ chuyển đổi âm thanh ROG Clavis",
        desc: "USB DAC di động trang bị chip ESS 9281 QUAD DAC™ với công nghệ render MQA, công nghệ AI Noise-Canceling Microphone độc quyền.",
        href: "/vn/streaming-kits/rog-carnyx",
      },
      {
        img: "/sites/rog-asus/img/products/streaming-kits.webp",
        name: "Đèn trợ sáng ROG Aura Light Bar",
        desc: "Đèn chiếu sáng chuyên dụng cho góc livestream, ánh sáng dịu mắt chống mỏi, điều khiển nhiệt độ màu và độ sáng không dây.",
        href: "/vn/streaming-kits/rog-carnyx",
      },
    ],
    rel: [
      { img: "/sites/rog-asus/img/relprod/kithara.webp", name: "ROG Kithara Gaming Headset", href: "/vn/headsets-audio/headsets/3-5mm-headsets/rog-kithara/" },
      { img: "/sites/rog-asus/img/relprod/swift-oled-pg34wcdn.webp", name: "ROG Swift OLED PG34WCDN", href: "/vn/monitors/32-to-34-inches/rog-swift-oled-pg34wcdn" },
      { img: "/sites/rog-asus/img/relprod/falchion-ace-75.webp", name: "ROG Falchion Ace 75 HE Gaming Keyboard", href: "/vn/keyboards/keyboards/pbt-keycaps/rog-falchion-ace-75-he/" },
    ],
  },
  "protection-and-gadgets-group": {
    hero: [{ src: "/sites/rog-asus/img/handheld/hero-1.webp", alt: "ROG Phụ Kiện Bảo Vệ" }],
    intro: {
      title: "PHỤ KIỆN BẢO VỆ & TIỆN ÍCH ASUS ROG",
      text: "Phụ kiện bảo vệ máy chơi game cầm tay và điện thoại ROG — ốp lưng chống sốc chuẩn quân đội Devilcase, kính cường lực bảo vệ mắt và bao chống sốc du lịch cao cấp.",
      xemHref: "/vn/protection-and-gadgets/cases-and-protection-series",
    },
    bigCards: [{ img: "/sites/rog-asus/img/products/protection-gadgets.webp" }],
    hot: [
      {
        img: "/sites/rog-asus/img/products/protection-gadgets.webp",
        name: "Bao đựng chống sốc ROG Ally Hard Case",
        desc: "Vỏ cứng EVA chống va đập, lớp nỉ lót bên trong bảo vệ màn hình không trầy xước, ngăn lưới phụ đựng thẻ nhớ microSD và tai nghe.",
        href: "/vn/gaming-handhelds/accessories/rog-ally-travel-case",
      },
      {
        img: "/sites/rog-asus/img/products/protection-gadgets.webp",
        name: "Ốp lưng ROG Phone 9 Devilcase Guardian",
        desc: "Hợp tác thương hiệu Devilcase với khung viền nhôm phay, mặt lưng trong suốt chống ố vàng và hỗ trợ tản nhiệt AeroActive Cooler hoàn hảo.",
        href: "/vn/gaming-handhelds/accessories/rog-ally-travel-case",
      },
      {
        img: "/sites/rog-asus/img/products/protection-gadgets.webp",
        name: "Miếng dán cường lực chống lóa ROG Ally Screen Protector",
        desc: "Độ cứng 9H chống trầy xước, lớp phủ chống chói và chống bám vân tay, giữ trọn độ nhạy cảm ứng 120Hz.",
        href: "/vn/gaming-handhelds/accessories/rog-ally-travel-case",
      },
      {
        img: "/sites/rog-asus/img/products/protection-gadgets.webp",
        name: "Kẹp giữ điện thoại ROG Clip Gaming Phone Holder",
        desc: "Gắn ROG Phone trực tiếp lên tay cầm Xbox hoặc ROG Raikiri, góc nghiêng tùy chỉnh công thái học không mỏi cổ tay.",
        href: "/vn/gaming-handhelds/accessories/rog-ally-travel-case",
      },
    ],
    rel: [
      { img: "/sites/rog-asus/img/relprod/kithara.webp", name: "ROG Kithara Gaming Headset", href: "/vn/headsets-audio/headsets/3-5mm-headsets/rog-kithara/" },
      { img: "/sites/rog-asus/img/relprod/falchion-ace-75.webp", name: "ROG Falchion Ace 75 HE Gaming Keyboard", href: "/vn/keyboards/keyboards/pbt-keycaps/rog-falchion-ace-75-he/" },
      { img: "/sites/rog-asus/img/relprod/xg-mobile.webp", name: "ROG XG Mobile (2025)", href: "/vn/external-graphics-docks/rog-xg-mobile-2025/" },
    ],
  },
  "docks-chargers-and-cables-group": {
    hero: [{ src: "/sites/rog-asus/img/cool/hero-1.webp", alt: "ROG Docks Sạc & Cáp" }],
    intro: {
      title: "DOCKS SẠC & CÁP KẾT NỐI ASUS ROG",
      text: "Củ sạc công nghệ GaN và dock mở rộng cổng kết nối ROG — sạc nhanh công suất cao lên đến 140W, tương thích chuẩn Power Delivery 3.0 và cáp bọc dù siêu bền chống rối.",
      xemHref: "/vn/docks-chargers-and-cables/chargers-series",
    },
    bigCards: [{ img: "/sites/rog-asus/img/products/docks-chargers-cables.webp" }],
    hot: [
      {
        img: "/sites/rog-asus/img/products/docks-chargers-cables.webp",
        name: "Củ sạc ROG 140W GaN Charger",
        desc: "Công nghệ bán dẫn GaN nhỏ hơn 30%, 3 cổng USB-C và 1 cổng USB-A, sạc cùng lúc laptop gaming ROG Zephyrus, điện thoại và máy chơi game.",
        href: "/vn/external-graphics-docks/rog-xg-mobile-2025",
      },
      {
        img: "/sites/rog-asus/img/products/docks-chargers-cables.webp",
        name: "Dock sạc kiêm cổng xuất hình ROG Gaming Charger Dock 65W",
        desc: "Vừa sạc nhanh 65W vừa xuất tín hiệu hình ảnh HDMI 2.0 4K 60Hz ra màn hình ngoài cho ROG Ally và laptop mỏng nhẹ.",
        href: "/vn/docks-chargers-and-cables/chargers/rog-gaming-charger-dock",
      },
      {
        img: "/sites/rog-asus/img/products/docks-chargers-cables.webp",
        name: "Cáp nối dài card đồ họa ROG Strix Riser Cable",
        desc: "Chuẩn PCI-E 4.0 x16 tốc độ cao, tấm chắn EMI bảo vệ chống nhiễu tín hiệu, bọc dây linh hoạt lắp dựng VGA theo chiều dọc.",
        href: "/vn/docks-chargers-and-cables/chargers/rog-gaming-charger-dock",
      },
      {
        img: "/sites/rog-asus/img/products/docks-chargers-cables.webp",
        name: "Cáp sạc bọc dù ROG Tangle-free USB-C to USB-C 100W",
        desc: "Lõi đồng nguyên chất dẫn điện tối ưu, vỏ bọc sợi dù Kevlar siêu bền uốn gập hơn 10.000 lần không gãy.",
        href: "/vn/docks-chargers-and-cables/chargers/rog-gaming-charger-dock",
      },
    ],
    rel: [
      { img: "/sites/rog-asus/img/relprod/kithara.webp", name: "ROG Kithara Gaming Headset", href: "/vn/headsets-audio/headsets/3-5mm-headsets/rog-kithara/" },
      { img: "/sites/rog-asus/img/relprod/falchion-ace-75.webp", name: "ROG Falchion Ace 75 HE Gaming Keyboard", href: "/vn/keyboards/keyboards/pbt-keycaps/rog-falchion-ace-75-he/" },
      { img: "/sites/rog-asus/img/relprod/swift-oled-pg34wcdn.webp", name: "ROG Swift OLED PG34WCDN", href: "/vn/monitors/32-to-34-inches/rog-swift-oled-pg34wcdn" },
    ],
  },
  "rog-saga-group": {
    hero: [{ src: "/sites/rog-asus/img/hero/control-resonant.webp", alt: "ROG SAGA Vũ Trụ Thương Hiệu" }],
    intro: {
      title: "VŨ TRỤ NGHỆ THUẬT THƯƠNG HIỆU ROG SAGA",
      text: "Khám phá vũ trụ ROG SAGA — thế giới khoa học viễn tưởng tương lai nơi những anh hùng OMNI, Seer và Achiever chiến đấu bảo vệ tự do. Bộ sưu tập truyện tranh kỹ thuật số, tranh minh họa và hình nền nghệ thuật 4K độc quyền cho game thủ.",
      xemHref: "/vn/rog-saga/toys/rog-omni-figure-og",
    },
    bigCards: [{ img: "/sites/rog-asus/img/products/rog-saga.webp" }],
    hot: [
      {
        img: "/sites/rog-asus/img/products/rog-saga.webp",
        name: "Mô hình nghệ thuật sưu tầm OMNI & Seer Art Toy",
        desc: "Tượng nhân vật biểu tượng của ROG SAGA được chế tác tinh xảo với các chi tiết giáp Cyberpunk và phụ kiện ánh sáng RGB độc bản.",
        href: "/vn/rog-saga/toys/rog-omni-figure-og",
      },
      {
        img: "/sites/rog-asus/img/products/rog-saga.webp",
        name: "Bộ sưu tập truyện tranh ROG SAGA Anthology Comic Book",
        desc: "Tập hợp các chương truyện tranh về nguồn gốc thành phố Neo-City và hành trình thức tỉnh sức mạnh công nghệ ROG.",
        href: "/vn/rog-saga/toys/rog-omni-figure-og",
      },
      {
        img: "/sites/rog-asus/img/products/rog-saga.webp",
        name: "Gói hình nền kỹ thuật số ROG SAGA 4K Ultra-HD Wallpapers",
        desc: "Hơn 50 bức tranh nền kỹ thuật số độ phân giải cao cho PC và smartphone với hiệu ứng chuyển động sống động.",
        href: "/vn/rog-saga/toys/rog-omni-figure-og",
      },
      {
        img: "/sites/rog-asus/img/products/rog-saga.webp",
        name: "Bộ huy hiệu & Phụ kiện sưu tầm ROG SAGA Exclusive Merch",
        desc: "Huy hiệu kim loại tráng men, dây đeo thẻ phản quang và thẻ thành viên kim loại giới hạn cho fan chân chính.",
        href: "/vn/rog-saga/toys/rog-omni-figure-og",
      },
    ],
    rel: [
      { img: "/sites/rog-asus/img/relprod/kithara.webp", name: "ROG Kithara Gaming Headset", href: "/vn/headsets-audio/headsets/3-5mm-headsets/rog-kithara/" },
      { img: "/sites/rog-asus/img/relprod/falchion-ace-75.webp", name: "ROG Falchion Ace 75 HE Gaming Keyboard", href: "/vn/keyboards/keyboards/pbt-keycaps/rog-falchion-ace-75-he/" },
      { img: "/sites/rog-asus/img/relprod/swift-oled-pg34wcdn.webp", name: "ROG Swift OLED PG34WCDN", href: "/vn/monitors/32-to-34-inches/rog-swift-oled-pg34wcdn" },
    ],
  },

};

export function getGroupData(slug: string): GroupData {
  const group = GROUPS[slug];
  if (!group) throw new Error(`Unknown product group: ${slug}`);
  return group;
}

const INTERVAL_MS = 5000;

export default function RogProductHome({ group }: { group: string }) {
  const data = getGroupData(group);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((p) => (p + 1) % data.hero.length);
    }, INTERVAL_MS);
  }, [data.hero.length]);

  useEffect(() => {
    if (playing) startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [playing, startTimer]);

  const goTo = (i: number) => {
    setActive(((i % data.hero.length) + data.hero.length) % data.hero.length);
    if (playing) startTimer();
  };

  return (
    <>
      {/* product hero slideshow */}
      <section className="rog-ph-hero">
        {data.hero.map((s, i) => (
          <a
            key={s.src}
            className={`rog-ph-slide${i === active ? " rog-ph-slide-active" : ""}`}
            href="#"
            aria-hidden={i !== active}
            tabIndex={i === active ? 0 : -1}
          >
            <img src={s.src} alt={s.alt} draggable={false} />
          </a>
        ))}
        <div className="rog-ph-indicators">
          {data.hero.map((s, i) => (
            <button
              key={s.src}
              type="button"
              aria-label={`Chuyển đến banner ${i + 1}`}
              className="rog-ph-bar"
              onClick={() => goTo(i)}
            >
              <span
                key={`${active === i}-${playing}`}
                className={`rog-ph-fill${i === active ? " rog-ph-fill-active" : ""}${i === active && !playing ? " rog-ph-fill-paused" : ""
                  }`}
              />
            </button>
          ))}
          <button
            type="button"
            className="rog-ph-pause"
            aria-label={playing ? "Tạm dừng tự động chuyển" : "Tự động chuyển tiếp"}
            onClick={() => setPlaying((v) => !v)}
          >
            {playing ? (
              <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
                <rect x="3" y="2" width="3.4" height="12" fill="currentColor" />
                <rect x="9.6" y="2" width="3.4" height="12" fill="currentColor" />
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
                <path d="M4 2l10 6-10 6V2z" fill="currentColor" />
              </svg>
            )}
          </button>
        </div>
      </section>

      {/* intro */}
      <section className="rog-ph-intro">
        <h2 className="rog-ph-intro-title">{data.intro.title}</h2>
        <p className="rog-ph-intro-text">{data.intro.text}</p>
        {data.intro.xemHref.startsWith("/") ? (
          <Link className="rog-ph-xemtatca" href={data.intro.xemHref}>
            XEM TẤT CẢ <span className="rog-hot-chev">›</span>
          </Link>
        ) : (
          <a className="rog-ph-xemtatca" href={data.intro.xemHref} target="_blank" rel="noreferrer">
            XEM TẤT CẢ <span className="rog-hot-chev">›</span>
          </a>
        )}
        <div className="rog-ph-intro-btn-row">
          <a className="rog-ai-btn" href="/vn/" target="_blank" rel="noreferrer">
            ✦ AI Series Comparison
          </a>
        </div>
        {data.bigCards && (
          <div className="rog-ph-bigcards">
            {data.bigCards.map((c, i) => (
              <div className="rog-ph-bigcard" key={c.img}>
                <img src={c.img} alt={`${data.intro.title} ${i + 1}`} />
              </div>
            ))}
          </div>
        )}
        <div className="rog-ph-find">
          <h3 className="rog-ph-find-title">TÌM SẢN PHẨM PHÙ HỢP</h3>
          <p className="rog-ph-find-text">
            Hãy cho chúng tôi biết bạn đang cần gì. Chúng tôi sẽ giúp bạn chọn
            sản phẩm phù hợp.
          </p>
        </div>
      </section>

      {/* series cards (Flow / Zephyrus / Strix) */}
      {data.seriesList && (
        <section className="rog-ph-series-section">
          <div className="rog-ph-series-grid">
            {data.seriesList.map((s) => (
              <div className="rog-ph-series-card" key={s.title}>
                <div className="rog-ph-series-img-wrap">
                  <img src={s.img} alt={s.title} />
                </div>
                <div className="rog-ph-series-body">
                  <h3 className="rog-ph-series-title">{s.title}</h3>
                  <p className="rog-ph-series-desc">{s.desc}</p>
                  <Link href={s.href} className="rog-ph-series-link">
                    TÌM HIỂU THÊM <span>→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* hot products */}
      <section className="rog-ph-hot">
        <h2 className="rog-ph-hot-title">Sản phẩm bán chạy</h2>
        <div className="rog-ph-hot-ai-row">
          <a className="rog-ai-btn" href="/vn/" target="_blank" rel="noreferrer">
            ✦ AI Recommendations
          </a>
        </div>
        <div className="rog-ph-hot-grid">
          {data.hot.map((p) => (
            <div className="rog-ph-hot-card" key={p.name}>
              {p.href.startsWith("/") ? (
                <Link href={p.href}>
                  <div className="rog-ph-hot-img">
                    <img src={p.img} alt={p.name} />
                  </div>
                  <h3 className="rog-ph-hot-name">{p.name}</h3>
                  <p className="rog-ph-hot-desc">{p.desc}</p>
                  <div className="rog-ph-card-actions">
                    <span className="rog-hot-more">
                      TÌM HIỂU THÊM <span className="rog-hot-chev">›</span>
                    </span>
                    <span className="rog-hot-detail-badge">CHI TIẾT</span>
                  </div>
                </Link>
              ) : (
                <a href={p.href} target="_blank" rel="noreferrer">
                  <div className="rog-ph-hot-img">
                    <img src={p.img} alt={p.name} />
                  </div>
                  <h3 className="rog-ph-hot-name">{p.name}</h3>
                  <p className="rog-ph-hot-desc">{p.desc}</p>
                  <div className="rog-ph-card-actions">
                    <span className="rog-hot-more">
                      TÌM HIỂU THÊM <span className="rog-hot-chev">›</span>
                    </span>
                    <span className="rog-hot-detail-badge">CHI TIẾT</span>
                  </div>
                </a>
              )}
            </div>
          ))}
        </div>
        <div className="rog-ph-view-all-wrap">
          <Link href={data.intro.xemHref} className="rog-ph-btn-view-all">
            XEM THÊM VÀ TẤT CẢ CHI TIẾT SẢN PHẨM <span className="rog-hot-chev">›</span>
          </Link>
        </div>
      </section>

      {/* shared tail sections */}
      <VideoSection />
      <RelatedArticles />
      <RelatedProducts />
      <Disclaimer />
    </>
  );
}
