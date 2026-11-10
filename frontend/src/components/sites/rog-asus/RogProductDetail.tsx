/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useState } from "react";
import "./RogProductDetail.css";
import {
  type DetailStory,
  type DetailQuote,
  type DetailFaq,
  type DetailProduct,
  generateDynamicDetailProduct,
} from "./rogDynamicProduct";

export type { DetailStory, DetailQuote, DetailFaq, DetailProduct };
export { generateDynamicDetailProduct };

const PG34WCDN: DetailProduct = {
  name: "ROG Swift OLED PG34WCDN",
  tagline: "Tầm Nhìn Sắc Bén. Chiến Thắng Nhanh Chóng.",
  modelCode: "PG34WCDN",
  price: "36.990.000 ₫",
  priceLabel: "Giá trên ASUS estore",
  storeUrl: "/vn/store",
  basePath: "/vn/monitors/32-to-34-inches/rog-swift-oled-pg34wcdn",
  thumbImg: "/sites/rog-asus/img/relprod/swift-oled-pg34wcdn.webp",
  kv: "/sites/rog-asus/img/detail/pg34wcdn-kv.jpg",
  breadcrumb: [{ label: "Gaming Màn hình", href: "/vn/monitors-group/" }],
  highlights: [
    "Công Nghệ Tandem RGB QD-OLED",
    "RGB STRIPE PIXEL — Độ Rõ Nét Văn Bản Được Cải Thiện",
    "360Hz — Tần số quét đỉnh cao",
    "TÙY CHỈNH TẢN NHIỆT VAPOR CHAMBER",
    "ASUS OLED Care Pro",
    "Neo Proximity Sensor",
    "Nhòe chuyển động cực thấp 0.03ms",
    "99% DCI-P3 · Delta E < 2",
    "HDR có thể điều chỉnh",
    "DisplayPort 2.1a 80Gbps",
    "USB Type-C (90W Power Delivery)",
    "Độ sáng đồng đều Uniform Brightness",
  ],
  stories: [
    {
      title: "Công Nghệ RGB Stripe Pixel OLED",
      text: "Công nghệ Tandem RGB QD-OLED với cấu trúc pixel RGB Stripe giúp tăng độ rõ nét của văn bản, mang lại chất lượng hình ảnh vượt trội cho cả giải đấu và công việc đồ họa chuyên nghiệp.",
    },
    {
      title: "Màng BlackShield™ Chống Chói",
      text: "Lớp màng chống phản chiếu BlackShield™ với khả năng chống trầy xước nâng cao và mức đen cảm nhận được sâu hơn, giữ hình ảnh sắc nét trong mọi điều kiện ánh sáng.",
    },
    {
      title: "Tốc Độ 360Hz Và Hình Ảnh Sống Động",
      text: "Tần số quét 360Hz kết hợp thời gian phản hồi siêu tốc 0.03ms mang lại chuyển động mượt mà tuyệt đối trong các trận đấu esports cạnh tranh khốc liệt nhất.",
    },
    {
      title: "ASUS OLED CARE PRO",
      text: "Bộ tính năng bảo vệ màn hình OLED toàn diện: Neo Proximity Sensor, làm sạch điểm ảnh, di chuyển màn hình và phát hiện ranh giới — kéo dài tuổi thọ tấm nền tối đa.",
    },
    {
      title: "Mở Khóa Tương Lai Với DisplayPort 2.1a",
      text: "DisplayPort 2.1a UHBR 20 băng thông 80Gbps sẵn sàng cho các thế hệ GPU tiếp theo, cùng USB Type-C 90W và hub USB 3.2 tích hợp.",
    },
  ],
  specs: [
    ["Panel Size (inch)", "34"],
    ["Aspect Ratio", "21:9"],
    ["Panel Type", "QD-OLED"],
    ["Panel Technology", "Tandem RGB QD-OLED"],
    ["Resolution", "3440x1440"],
    ["Display Surface", "Anti-Reflection (BlackShield Film)"],
    ["Brightness (HDR, Peak)*", "1,300 cd/㎡"],
    ["HDR (High Dynamic Range) Support", "HDR10"],
    ["Refresh Rate (Max)", "360Hz"],
    ["DisplayPort", "DisplayPort 2.1 — Yes, UHBR 20"],
    ["HDMI", "HDMI (v2.1) x 2 (FRL)"],
    ["USB-C Power Delivery", "90W"],
    ["Earphone jack", "Yes"],
    ["USB Hub", "3x USB 3.2 Gen 1 Type-A"],
  ],
  faq: [
    {
      q: "Màn hình OLED PG34WCDN có hỗ trợ chống lưu ảnh (burn-in) không?",
      a: "ROG Swift OLED PG34WCDN trang bị công nghệ ASUS OLED Care Pro độc quyền cùng bộ tản nhiệt buồng hơi tùy chỉnh, giúp hạn chế tối đa nguy cơ lưu ảnh và gia tăng độ bền tấm nền.",
    },
    {
      q: "Cổng DisplayPort 2.1a có tương thích với các card đồ họa hiện nay không?",
      a: "Có, chuẩn DisplayPort 2.1a hoàn toàn tương thích ngược với DisplayPort 1.4 và hỗ trợ băng thông đầy đủ UHBR20 cho các thế hệ card đồ họa mới nhất.",
    },
  ],
};

const SCAR18: DetailProduct = {
  name: "ROG Strix SCAR 18 (2026) G835",
  tagline: "Thống lĩnh chiến trường — Laptop Gaming Đỉnh Cao 320W",
  modelCode: "G835PY-SA001W",
  price: "139.990.000 ₫",
  priceLabel: "Giá trên ASUS estore",
  storeUrl: "/vn/store",
  basePath: "/vn/laptops/rog-strix/rog-strix-scar-18-2026",
  thumbImg: "/sites/rog-asus/img/hot/strix-scar-18.webp",
  kv: "/sites/rog-asus/img/detail/scar18-kv.webp",
  breadcrumb: [
    { label: "Laptop Gaming ASUS ROG", href: "/vn/laptops-group/" },
    { label: "ROG Strix", href: "/vn/laptops-group/" },
  ],
  highlights: [
    "Màn hình 18-inch 4K 240Hz ROG Nebula HDR Mini LED",
    "Hiệu suất khủng tổng công suất 320W",
    "Intel® Core™ Ultra 9 290HX Plus — 200W duy trì",
    "NVIDIA® GeForce RTX™ 5090 Laptop GPU — TGP 175W",
    "ROG Intelligent Cooling 2026 với 3 quạt Arc Flow",
    "RAM DDR5-6400 nâng cấp tối đa 128GB",
    "SSD PCIe® 5.0 lên đến 8TB (2 khe M.2)",
    "Nâng cấp không cần dụng cụ (Tool-free design)",
    "Bàn phím cơ Per-key RGB Aura Sync",
    "Pin 90Wh hỗ trợ sạc nhanh Type-C 100W",
  ],
  stories: [
    {
      title: "ROG STRIX SCAR 18 — Thống lĩnh chiến trường",
      text: "Màn hình 4K 240Hz với ROG Nebula ELMB và hiệu suất khủng 320W. Trang bị bộ xử lý lên đến Intel® Core™ Ultra 9 290HX Plus với mức công suất duy trì 200W, GPU lên đến NVIDIA® GeForce RTX™ 5090 Laptop GPU với TGP tối đa 175W và công nghệ tản nhiệt ROG Intelligent Cooling thế hệ mới.",
    },
    {
      title: "Đỉnh cao kiệt tác — Khả năng nâng cấp vượt trội",
      text: "Strix SCAR 18 mang đến trải nghiệm gaming Windows 11 Home đỉnh cao. Người dùng có thể tự nâng cấp cả bộ nhớ và lưu trữ dễ dàng với cơ chế tool-free, hỗ trợ tối đa RAM DDR5-6400 128GB (64+64) và SSD siêu tốc dung lượng 8TB (4+4).",
    },
    {
      title: "Tốc độ và màu sắc ấn tượng — Nebula HDR 4K 240Hz",
      img: "/sites/rog-asus/img/detail/story-toc-do.webp",
      text: "Màn hình ROG Nebula HDR 18-inch 4K (3840 x 2400) Mini LED với tần số quét 240Hz, độ phủ màu 100% DCI-P3 và độ sáng đỉnh 1100 nits — mọi khung hình đều sắc nét, sống động đến từng chi tiết.",
    },
    {
      title: "Dễ dàng sửa chữa và nâng cấp — Q-Latch",
      text: "M.2 SSD nhỏ và linh hoạt đáng kinh ngạc, nhưng hệ thống gắn truyền thống gồm nhiều ốc vít và góc chết nhỏ gây khó khăn cho việc thao tác. ROG đã giải quyết vấn đề này bằng Q-Latch, hệ thống vốn được áp dụng cho các bo mạch chủ máy tính để bàn đạt giải thưởng.",
    },
    {
      title: "Bàn phím chuẩn Esports — bề mặt IMR kết cấu nano",
      img: "/sites/rog-asus/img/detail/story-keyboard.webp",
      text: "Strix SCAR 18 2026 sở hữu bề mặt IMR kết cấu nano trên nắp máy và khu vực bàn phím, dễ lau sạch và chống bám vân tay. Các phím nóng chuyên dụng nằm ngay trên bàn phím giúp tiếp cận nhanh âm lượng, tắt mic, các chế độ hoạt động và Armoury Crate — có thể tùy chỉnh lập trình như macro.",
    },
    {
      title: "Kết nối toàn diện — Thunderbolt™ 5",
      text: "ROG Strix SCAR 18 sở hữu hai cổng Thunderbolt™ 5, công nghệ mới nhất đem lại khả năng kết nối băng thông rộng tốc độ cao gấp tới 3 lần so với Thunderbolt™ 4. Với hệ sinh thái thiết bị ngoại vi đa dạng tương thích qua cổng USB-C, bao gồm chuẩn sạc Power Delivery và đầu ra màn hình.",
    },
  ],
  specs: [
    ["Hệ điều hành", "Windows 11 Home Single Language"],
    ["Bộ vi xử lý", "Intel® Core™ Ultra 9 290HX Plus (24MB Cache, up to 5.4 GHz, 24 cores)"],
    ["Đồ họa", "NVIDIA® GeForce RTX™ 5090 Laptop GPU (TGP tối đa 175W, 16GB GDDR7)"],
    ["NPU", "Intel® NPU lên đến 13 TOPS"],
    ["Màn hình", "ROG Nebula HDR 18-inch 4K (3840 x 2400), Mini LED 240Hz, 100% DCI-P3, G-Sync"],
    ["Bộ nhớ", "64GB DDR5-6400 MT/s, nâng cấp tối đa 128GB (2× SO-DIMM)"],
    ["Ổ lưu trữ", "2TB PCIe® 4.0 NVMe™ M.2 SSD, mở rộng tối đa 8TB"],
    ["Hệ điều hành", "Windows 11 Home Single Language"],
    ["Tổng công suất", "320W (200W CPU + 175W GPU với Dynamic Boost)"],
    ["Trọng lượng", "3.10 Kg"],
  ],
  faq: [
    {
      q: "Điều gì khiến ROG Strix SCAR 18 trở thành laptop gaming flagship mạnh nhất?",
      a: "SCAR 18 sở hữu tổng công suất hệ thống lên tới 320W, kết hợp CPU Intel Core Ultra 9 290HX Plus và GPU RTX 5090 mạnh nhất hiện nay cùng tản nhiệt 3 quạt kim loại lỏng thế hệ mới.",
    },
    {
      q: "Máy có thể thay thế PC để bàn (Desktop replacement) không?",
      a: "Hoàn toàn có thể. Với màn hình 18-inch 4K Mini LED, khả năng nâng cấp 128GB RAM và 8TB SSD, máy đáp ứng trọn vẹn cả nhu cầu gaming 4K max setting lẫn render đồ họa 3D phức tạp.",
    },
  ],
  awards: [
    "/sites/rog-asus/img/detail/awards/award-1.png",
    "/sites/rog-asus/img/detail/awards/award-2.png",
    "/sites/rog-asus/img/detail/awards/award-3.png",
    "/sites/rog-asus/img/detail/awards/award-4.png",
    "/sites/rog-asus/img/detail/awards/award-5.png",
    "/sites/rog-asus/img/detail/awards/award-6.png",
    "/sites/rog-asus/img/detail/awards/award-7.png",
    "/sites/rog-asus/img/detail/awards/award-8.png",
  ],
  mediaReviews: [
    { img: "/sites/rog-asus/img/detail/awards/award-1.png", score: "95%", quote: "This super gaming laptop is the most powerful thing out there.", href: "https://computerhoy.20minutos.es/gaming/he-probado-rog-strix-scar-18-2026-este-superportatil-gaming-" },
    { img: "/sites/rog-asus/img/detail/awards/award-2.png", score: "90%", quote: "The ASUS ROG Strix Scar 18 2026 is the pinnacle of laptop performance, without question.", href: "https://www.hardwarepremium.com/reviews/46492/asus-rog-strix-scar-18-2026-review/" },
    { img: "/sites/rog-asus/img/detail/awards/award-3.png", score: "Nice choice", quote: "The ASUS ROG Strix SCAR 18 2026 has managed to meet all the most important objectives it had before it as a top-of-the-range gaming laptop.", href: "https://www.muycomputer.com/2026/06/10/asus-rog-strix-scar-18-2026-analisis-completo/" },
    { img: "/sites/rog-asus/img/detail/awards/award-4.png", score: "Performance", quote: "A perfect machine for demanding gamers or professionals in disciplines such as video game development or AI applications, content creation, multimedia editing.", href: "https://www.noticias3d.com/articulo/4084/Asus-ROG-Strix-Scar-18-2026-review-rtx-5090-mini-led-4k-320" },
    { img: "/sites/rog-asus/img/detail/awards/award-5.png", score: "Editor's favorite", quote: "The most powerful gaming laptop we've ever tested.", href: "https://www.geeknetic.es/Review/3582/ASUS-ROG-Strix-SCAR-18-2026-G835LXG-Review-El-Core-Ultra-9-290H" },
    { img: "/sites/rog-asus/img/detail/awards/award-6.png", score: "Gold", quote: "We review the most powerful laptop of the year.", href: "https://hardzone.es/reviews/portatiles/asus-rog-strix-scar-2026/" },
  ],
  videoReviews: [
    { img: "/sites/rog-asus/img/detail/awards/award-7.png", source: "The hikaku", quote: "ROG Strix SCAR 18 (2026) Review — The Ultimate Gaming Laptop That Handles 4K at Max Settings with Ease", href: "https://thehikaku.net/pc/asus/26ROG-Strix-SCAR-18.html" },
    { img: "/sites/rog-asus/img/detail/awards/award-8.png", source: "ASCII.jp", quote: "When you combine the fearsome HX Plus with the RTX 5090, you get the ultimate gaming laptop of today — here's our hands-on.", href: "https://ascii.jp/elem/000/004/414/4414506/" },
    { img: "/sites/rog-asus/img/detail/awards/video-1.png", source: "Notebookspec", quote: "Review ROG Strix SCAR 18 (G835LXG)", href: "https://notebookspec.com/web/880294-review-asus-rog-strix-scar-18-g835lxg" },
    { img: "/sites/rog-asus/img/detail/awards/video-2.png", source: "Sanook Hitech", quote: "Review ROG Strix SCAR 18 (G835LXG)", href: "https://www.sanook.com/hitech/1627162/" },
    { img: "/sites/rog-asus/img/detail/awards/video-3.png", source: "www.smartmania.cz", quote: "The Asus Strix SCAR 18 is a high-performance gaming laptop that can handle any task imaginable.", href: "https://smartmania.cz/asus-rog-strix-scar-18-pet-duvodu-proc-si-koupit-letosni-model/" },
  ],
  relatedArticles: [
    { img: "/sites/rog-asus/img/detail/awards/rel-scar-review.webp", title: "Đánh Giá ROG Strix Scar 18 2026: Laptop Gaming Flagship RTX 5090 Có Xứng Đáng Vị Trí Đầu Bảng?", href: "/vn/articles" },
    { img: "/sites/rog-asus/img/detail/awards/rel-scar-launch.webp", title: "ASUS Republic of Gamers ra mắt ROG Strix SCAR 18 2026 tại Việt Nam", href: "/vn/articles" },
  ],
};

const ZEPHYRUS_G16_GU605: DetailProduct = {
  name: "ROG Zephyrus G16 (2025) GU605",
  tagline: "Hiệu năng giao thoa với sự chuẩn xác — GPU Laptop NVIDIA® GeForce RTX™ 5090 bên trong khung máy 1,49 cm",
  modelCode: "GU605CX-QR083W",
  price: "73.990.000 ₫",
  priceLabel: "Giá trên ASUS estore",
  storeUrl: "/vn/store",
  basePath: "/vn/laptops/rog-zephyrus/rog-zephyrus-g16-2025-gu605",
  thumbImg: "/sites/rog-asus/img/hot/zephyrus-g16.webp",
  kv: "/sites/rog-asus/img/detail/gu605-kv.webp",
  breadcrumb: [
    { label: "Laptop Gaming ASUS ROG", href: "/vn/laptops-group/" },
    { label: "ROG Zephyrus", href: "/vn/laptops-group/" },
  ],
  highlights: [
    "Khung nhôm CNC siêu mỏng 1,49 cm — Trọng lượng chỉ 1,85 kg",
    "Màn hình 16-inch ROG Nebula OLED 2.5K 240Hz 0.2ms",
    "NVIDIA® GeForce RTX™ 5090 / RTX™ 5070 Laptop GPU",
    "Intel® Core™ Ultra 9 285H / Ultra 7 Processor & Intel AI Boost",
    "Đường chéo Slash Lighting cá tính với 15 hiệu ứng LED",
    "100% DCI-P3 · Chuẩn màu Pantone® Validated · Delta E < 1",
    "Hệ thống 6 loa âm thanh nổi Dolby Atmos & Smart Amp",
    "Tản nhiệt buồng hơi Vapor Chamber & 3 quạt Arc Flow Fans 2.0",
    "RAM lên đến 64GB LPDDR5X 7467 MHz onboard",
    "SSD PCIe® 4.0 lên đến 2TB (2 khe cắm M.2 PCIe)",
    "Kết nối Wi-Fi 7 siêu tốc & Cổng Thunderbolt™ 4 40Gbps",
    "Bàn di chuột kính tỷ lệ 16:10 rộng hơn 37%",
  ],
  stories: [
    {
      title: "Hiệu năng — Kẻ thay đổi luật chơi với GeForce RTX 50 Series & Intel Core Ultra",
      text: "Được trang bị bộ vi xử lý lên đến Intel® Core™ Ultra 9 285H và GPU Laptop lên đến NVIDIA® GeForce RTX™ 5090, cỗ máy 16 inch này có thể dễ dàng xử lý các tựa game mới nhất cũng như các phần mềm sáng tạo tối tân. Nhờ NPU Intel® AI Boost chuyên dụng và MUX Switch tích hợp NVIDIA Advanced Optimus, hiệu năng gaming được gia tăng từ 5-10% mà không tiêu tốn thêm điện năng.",
      img: "/sites/rog-asus/img/detail/gu605-mux.webp",
    },
    {
      title: "Màn hình OLED 2.5K 240Hz đã ra mắt — G-SYNC & Độ tương phản 1.000.000:1",
      text: "Lần đầu tiên trên thế giới, màn hình OLED trên laptop gaming được tích hợp công nghệ NVIDIA® G-SYNC, đồng bộ khung hình mượt mà không rách hình. Với tần số quét 240Hz, thời gian đáp ứng cực ngắn 0.2ms, chuẩn màu Pantone® Validated và độ phủ màu 100% DCI-P3 (Delta E < 1), mọi khung hình đồ họa và game đều đạt chuẩn điện ảnh tuyệt mỹ.",
      img: "/sites/rog-asus/img/detail/gu605-display.webp",
    },
    {
      title: "Thiết kế tinh xảo — Gia công CNC hợp kim nhôm & Dải đèn Slash Lighting",
      text: "Được cắt gọt tỉ mỉ từ nhôm nguyên khối bằng máy CNC với độ chính xác cao, Zephyrus G16 sở hữu độ mỏng chỉ 1,49 cm và trọng lượng 1,85 kg. Mặt A nổi bật với dải đèn LED Slash Lighting gồm 7 dải đèn LED đơn sắc có thể cá nhân hóa 15 hoạt ảnh độc đáo thông qua Armoury Crate.",
      img: "/sites/rog-asus/img/detail/gu605-control.webp",
    },
    {
      title: "Tản nhiệt thông minh — ROG Intelligent Cooling với buồng hơi & 3 quạt Arc Flow",
      text: "Để duy trì hiệu năng đồ họa khủng trong thân máy siêu mỏng, ROG trang bị hệ thống tản nhiệt buồng hơi Vapor Chamber bao phủ diện tích rộng, kết hợp cùng 3 quạt Arc Flow Fans™ thế hệ 2 và keo kim loại lỏng Thermal Grizzly giúp giải nhiệt nhanh chóng và giữ độ ồn cực thấp dưới 0dB khi xử lý nhẹ.",
      img: "/sites/rog-asus/img/detail/gu605-cooling.webp",
    },
    {
      title: "Âm thanh sống động — Hệ thống 6 loa và công nghệ khử ồn 2 chiều AI",
      text: "Hệ thống âm thanh bao gồm 4 loa trầm lực kép và 2 loa tweeter với âm lượng tăng 47%, hỗ trợ chuẩn Dolby Atmos và Hi-Res Audio. Công nghệ khử ồn hai chiều AI giúp lọc sạch mọi tạp âm môi trường khi họp trực tuyến hoặc giao tiếp trong trận đấu.",
      img: "/sites/rog-asus/img/detail/gu605-audio.webp",
    },
  ],
  specs: [
    ["Hệ điều hành", "Windows 11 Home"],
    ["Bộ vi xử lý", "Intel® Core™ Ultra 9 Processor 285H / Ultra 7 255H 2.0 GHz (24MB Cache, up to 5.4 GHz, 16 cores); Intel® AI Boost NPU up to 13 TOPS"],
    ["Đồ họa", "Lên đến NVIDIA® GeForce RTX™ 5090 / RTX™ 5070 Laptop GPU (ROG Boost: 1595MHz* at 105W, GDDR7)"],
    ["NPU", "NPU Intel® AI Boost lên đến 13 TOPS"],
    ["Màn hình", "ROG Nebula Display, 16-inch, OLED 2.5K (2560 x 1600, WQXGA) tỷ lệ 16:10, AGLR, 100% DCI-P3, 240Hz, 0.2ms, G-Sync, Pantone Validated, MUX Switch + NVIDIA® Advanced Optimus"],
    ["Bộ nhớ", "32GB / 64GB LPDDR5X 7467 MHz on board (Hỗ trợ bộ nhớ kênh đôi)"],
    ["Ổ lưu trữ", "1TB / 2TB PCIe® 4.0 NVMe™ M.2 SSD (2 khe cắm nâng cấp M.2 PCIe)"],
    ["Cổng kết nối", "1x Thunderbolt™ 4 (DisplayPort™ / PD 40Gbps), 1x USB 3.2 Gen 2 Type-C (DP / PD / G-SYNC 10Gbps), 2x USB 3.2 Gen 2 Type-A, 1x HDMI 2.1 FRL, 1x khe đọc thẻ nhớ SD (UHS-II, 312MB/s), 1x Jack âm thanh combo 3.5mm"],
    ["Bàn phím & Touchpad", "Bàn phím RGB 1 vùng, hành trình phím 1.7 mm, phím Copilot; Touchpad kính tỷ lệ 16:10 siêu lớn"],
    ["Webcam", "1080P FHD IR Camera hỗ trợ mở khóa khuôn mặt Windows Hello"],
    ["Âm thanh", "Dolby Atmos, Smart Amp, Khử ồn AI 2 chiều, Hi-Res Audio, Hệ thống 6 loa (4 loa trầm lực kép + 2 loa tweeter)"],
    ["Kết nối không dây", "Wi-Fi 7 (802.11be) Triple band 2*2 Wireless Card, Bluetooth® 5.4"],
    ["Pin", "90WHrs, 4S1P, 4-cell Li-ion (Sạc nhanh 0-50% trong 30 phút)"],
    ["Bộ nguồn", "Bộ sạc Rectangle Conn 200W AC và hỗ trợ sạc Type-C 100W PD"],
    ["Đèn thiết bị", "Đường chéo Slash Lighting cá tính mặt lưng"],
    ["Trọng lượng", "1.85 Kg (4.08 lbs)"],
    ["Kích thước (W x D x H)", "35.4 x 24.6 x 1.49 ~ 1.64 cm"],
    ["Gói tặng kèm", "3 tháng Xbox Game Pass cho PC, 3 tháng Google AI Pro, 6 tháng Dropbox 500GB"],
  ],
  faq: [
    {
      q: "ROG Zephyrus G16 (2025) GU605 mỏng nhẹ bao nhiêu và thời lượng pin như thế nào?",
      a: "Máy sở hữu độ mỏng chỉ từ 1,49 cm và trọng lượng 1,85 kg cùng pin dung lượng lớn 90Whr, hỗ trợ sạc nhanh qua cổng USB Type-C 100W PD từ 0-50% chỉ trong 30 phút.",
    },
    {
      q: "Màn hình OLED trên Zephyrus G16 GU605 có bị hiện tượng lưu ảnh (burn-in) không?",
      a: "ROG tích hợp bộ giải pháp ASUS OLED Care độc quyền bao gồm làm sạch điểm ảnh (Pixel Refresh), tự động dịch chuyển màn hình và cảm biến ánh sáng để bảo vệ tấm nền OLED tối ưu.",
    },
    {
      q: "Dải đèn Slash Lighting ở mặt lưng có thể tùy biến hiệu ứng không?",
      a: "Có, dải Slash Lighting gồm 7 thanh LED có thể tùy biến 15 chế độ hiệu ứng ánh sáng thông qua phần mềm Armoury Crate hoặc đồng bộ nhịp nhàng theo âm nhạc và thông báo.",
    },
    {
      q: "Zephyrus G16 GU605 có thể nâng cấp RAM và SSD được không?",
      a: "RAM của máy được hàn trực tiếp (onboard LPDDR5X-7467) để đạt độ mỏng 1.49cm nên không thể thay thế. Về dung lượng ổ cứng, máy có sẵn 2 khe M.2 NVMe PCIe 4.0 cho phép nâng cấp tối đa 4TB.",
    },
  ],
};

const FLOW_Z13_KJP: DetailProduct = {
  name: "ROG Flow Z13-KJP",
  tagline: "REPUBLIC OF GAMERS x KOJIMA PRODUCTIONS — For Ludens Who Dare",
  modelCode: "GZ302EAC-RU184WS",
  price: "109.990.000 ₫",
  priceLabel: "Giá trên ASUS estore",
  storeUrl: "/vn/store",
  basePath: "/vn/laptops/rog-flow/rog-flow-z13-kjp",
  thumbImg: "/sites/rog-asus/img/detail/z13-kjp-front.webp",
  kv: "/sites/rog-asus/img/detail/z13-kjp-kv.webp",
  quote: {
    author: "Hideo Kojima & Yoji Shinkawa",
    role: "Đạo diễn & Giám đốc nghệ thuật, KOJIMA PRODUCTIONS",
    text: "“Tôi muốn tạo nên một trang bị thuộc về Ludens và tôi đã tích hợp nó vào thiết bị máy tính này. Các bộ phận và thiết kế của nó tạo cảm giác như một thiết bị phi hành gia tương lai — sẵn sàng cùng mọi Ludens đương đầu mọi thử thách mới.”",
  },
  breadcrumb: [
    { label: "Laptop Gaming ASUS ROG", href: "/vn/laptops-group/" },
    { label: "ROG Flow Series", href: "/vn/laptops/rog-flow-series" },
  ],
  highlights: [
    "Phiên bản giới hạn độc quyền hợp tác cùng KOJIMA PRODUCTIONS",
    "Bộ vi xử lý AI mạnh nhất AMD Ryzen™ AI MAX+ 395 (16 nhân, 32 luồng)",
    "Đồ họa tích hợp AMD Radeon™ 8060S (40 Compute Units RDNA 3.5)",
    "Bộ nhớ hợp nhất khổng lồ 128GB LPDDR5X-8000 Quad-Channel 256-bit",
    "NPU AMD XDNA™ 2 lên tới 50 TOPS — Tổng hiệu năng AI 126 TOPS",
    "Màn hình cảm ứng ROG Nebula 13.4-inch 2.5K 180Hz 3ms 100% DCI-P3",
    "Giải thưởng thiết kế quốc tế 2026 Red Dot Product Design",
    "Thiết kế 2-in-1 linh hoạt: Tablet gaming siêu di động + Laptop làm việc",
    "Khung nhôm cắt CNC độc quyền và mặt lưng phong cách phi thuyền Ludens",
    "Chân đế Kickstand kim loại tích hợp mở linh hoạt góc 170°",
    "Tản nhiệt buồng hơi kết hợp kim loại lỏng siêu êm ái 0dB",
    "Giao diện Armoury Crate độc quyền chủ đề Ludens Spacecraft",
  ],
  stories: [
    {
      title: "REPUBLIC OF GAMERS x KOJIMA PRODUCTIONS — Sự kết hợp của những triết lý chung",
      text: "Được thiết kế như một thiết bị dành cho Ludens — biểu tượng của “Người chơi”, ROG Flow Z13-KJP là người bạn đồng hành đáng tin cậy của tất cả game thủ trong cuộc phiêu lưu mới. Từ các họa tiết công nghiệp đến logo Ludens dập nổi trên khung nhôm và sợi carbon, từng đường nét đều thể hiện sự cẩn trọng tỉ mỉ của đạo diễn Yoji Shinkawa.",
      img: "/sites/rog-asus/img/detail/z13-kjp-front.webp",
    },
    {
      title: "Sức mạnh siêu máy trạm di động — AMD Ryzen™ AI MAX+ 395 & Radeon™ 8060S",
      text: "Trang bị bộ xử lý APU đột phá AMD Ryzen™ AI MAX+ 395 với 16 nhân Zen 5 hiệu năng cao và đồ họa tích hợp Radeon™ 8060S kiến trúc RDNA 3.5. Kết hợp cùng 128GB bộ nhớ hợp nhất cực nhanh LPDDR5X-8000 băng thông 256-bit, máy có khả năng chạy mượt các mô hình ngôn ngữ lớn (LLM) cục bộ và dựng hình 3D đồ họa nặng ngay trên một thiết bị tablet 13 inch.",
      img: "/sites/rog-asus/img/detail/z13-kjp-gallery2.webp",
    },
    {
      title: "Giao diện Armoury Crate độc quyền chủ đề Ludens",
      text: "ROG Flow Z13-KJP sở hữu bản phát hành Armoury Crate tùy chỉnh độc quyền với bảng màu Ludens, âm thanh khởi động đặc sắc và hiệu ứng hình ảnh lấy cảm hứng từ phòng điều khiển phi thuyền không gian.",
      img: "/sites/rog-asus/img/detail/z13-kjp-armoury.webp",
    },
    {
      title: "Màn hình cảm ứng ROG Nebula 2.5K 180Hz tuyệt mỹ & Bút Stylus",
      text: "Màn hình 13.4 inch tỷ lệ vàng 16:10, độ phân giải 2.5K (2560 x 1600), tần số quét 180Hz, độ phủ màu 100% DCI-P3 và độ sáng 500 nits. Hỗ trợ cảm ứng đa điểm và bút cảm ứng ASUS Pen 2.0 giúp các nghệ sĩ phác thảo ý tưởng bất cứ nơi đâu.",
      img: "/sites/rog-asus/img/detail/z13-kjp-gallery1.webp",
    },
    {
      title: "Bộ phụ kiện thiết kế riêng — Case đựng cao cấp & Hỗ trợ XG Mobile",
      text: "Mỗi chiếc ROG Flow Z13-KJP đi kèm case đựng máy được chế tác riêng, bàn phím tháo rời bọc da cao cấp. Cổng kết nối hỗ trợ trạm đồ họa ngoài ROG XG Mobile mở ra khả năng mở rộng sức mạnh vô hạn.",
      img: "/sites/rog-asus/img/detail/z13-kjp-gallery3.webp",
    },
  ],
  specs: [
    ["Hệ điều hành", "Windows 11 Home Single Language"],
    ["Bộ vi xử lý", "AMD Ryzen™ AI MAX+ 395 3.0GHz (Bộ nhớ đệm 80MB, lên tới 5.1GHz, 16 nhân, 32 luồng)"],
    ["Đồ họa", "AMD Radeon™ 8060S Graphics (40 Compute Units RDNA 3.5)"],
    ["NPU", "NPU AMD XDNA™ 2 lên tới 50 TOPS (Tổng hiệu năng AI nền tảng 126 TOPS)"],
    ["Màn hình", "ROG Nebula Display, 13.4-inch, Độ phân giải 2.5K (2560 x 1600, WQXGA) 16:10, Cảm ứng đa điểm, 180Hz, 3ms, 100% DCI-P3, 500 nits, Adaptive-Sync, Pantone Validated, Hỗ trợ bút Stylus"],
    ["Bộ nhớ", "128GB LPDDR5X 8000 MHz on board Quad-Channel 256-bit Unified Memory"],
    ["Ổ lưu trữ", "1TB PCIe® 4.0 NVMe™ M.2 SSD (2230)"],
    ["Cổng kết nối", "2x USB4 Type-C (40Gbps / DisplayPort™ / Power Delivery), 1x USB 3.2 Gen 2 Type-A, 1x HDMI 2.1 FRL, 1x đầu đọc thẻ microSD (UHS-II), 1x Jack âm thanh 3.5mm, Cổng hỗ trợ ROG XG Mobile GC34"],
    ["Bàn phím & Chuột", "Bàn phím tháo rời độc quyền KJP Edition, Led RGB 1 vùng Aura Sync, Phím Copilot"],
    ["Camera", "5MP IR Camera mở khóa Windows Hello + 13MP Camera sau"],
    ["Âm thanh", "Dolby Atmos, Smart Amp, Khử ồn AI, Hi-Res Audio, 2x Loa trầm triệt tiêu lực kép 2W"],
    ["Kết nối", "Wi-Fi 7 (802.11be) Triple band 2*2 Wireless Card, Bluetooth® 5.4"],
    ["Pin", "70WHrs, 4S1P, 4-cell Li-ion"],
    ["Bộ nguồn", "Bộ nguồn 200W AC chuyên dụng, hỗ trợ sạc Type-C PD"],
    ["Trọng lượng", "1.72 Kg (3.79 lbs)"],
    ["Kích thước (W x D x H)", "30.0 x 20.4 x 1.45 ~ 1.49 cm"],
    ["Phụ kiện tiêu chuẩn", "Case bảo vệ ROG Flow Z13 Case KJP Edition, Bàn phím KJP, Bộ sạc 200W"],
    ["Giải thưởng", "2026 Red Dot Product Design Award Winner"],
  ],
  faq: [
    {
      q: "ROG Flow Z13-KJP là gì và có điểm gì đặc biệt so với các laptop thông thường?",
      a: "Đây là phiên bản máy tính bảng gaming 2-trong-1 giới hạn cao cấp nhất của ROG, hợp tác thiết kế cùng hãng game huyền thoại KOJIMA PRODUCTIONS. Máy trang bị cấu hình khủng nhất dòng Flow: AMD Ryzen™ AI MAX+ 395, đồ họa Radeon 8060S, 128GB RAM hợp nhất và thiết kế vỏ nhôm vũ trụ Ludens độc quyền.",
    },
    {
      q: "128GB RAM trên Flow Z13-KJP có tác dụng gì trong thực tế?",
      a: "Khác với laptop thông thường, 128GB LPDDR5X trên Z13-KJP là kiến trúc Unified Memory chia sẻ chung tốc độ cao giữa CPU và GPU, cho phép chạy trực tiếp các mô hình AI/LLM lớn (như Llama 70B), render video 8K ProRes và dựng cảnh 3D mà không bị tràn VRAM.",
    },
    {
      q: "Máy có thể biến đổi các chế độ sử dụng nào?",
      a: "ROG Flow Z13-KJP có thể dùng như một chiếc máy tính bảng di động cảm ứng, hoặc gắn bàn phím nam châm đi kèm để trở thành laptop gaming hoàn chỉnh, hoặc kết hợp tay cầm ROG Raikiri và chân đế kickstand 170° để chơi game console.",
    },
    {
      q: "Trọng lượng và phụ kiện đi kèm máy bao gồm những gì?",
      a: "Máy nặng 1.72 kg, đi kèm case bảo vệ ROG Flow Z13 Case KJP Edition độc quyền, bộ sạc 200W AC và bàn phím chuyên dụng bọc da tích hợp đèn nền Aura Sync.",
    },
  ],
};

const ZEPHYRUS_G14_GA403: DetailProduct = {
  name: "ROG Zephyrus G14 (2025) GA403",
  tagline: "Siêu Mỏng Nhẹ. Đột Phá AI. Màn Hình OLED 3K 120Hz.",
  modelCode: "GA403WM-QS051WS",
  price: "54.990.000 ₫",
  priceLabel: "Giá trên ASUS estore",
  storeUrl: "/vn/store",
  basePath: "/vn/laptops/rog-zephyrus/rog-zephyrus-g14-2025-ga403",
  thumbImg: "/sites/rog-asus/img/series/zephyrus-ga403.webp",
  kv: "/sites/rog-asus/img/hero/zephyrus-g14.webp",
  breadcrumb: [
    { label: "Gaming Laptop Gaming ASUS ROG", href: "/vn/laptops-group" },
    { label: "ROG Zephyrus", href: "/vn/laptops/rog-zephyrus-series" },
  ],
  highlights: [
    "Vỏ nhôm CNC nguyên khối siêu mỏng 1.59cm, chỉ 1.50kg",
    "Dải đèn Slash Lighting độc bản 7 hiệu ứng",
    "AMD Ryzen™ AI 9 HX 370 Processor (NPU 50 TOPS)",
    "NVIDIA® GeForce RTX™ 5060 Laptop GPU",
    "Màn hình ROG Nebula OLED 14\" 3K 120Hz 0.2ms",
    "100% DCI-P3 · Delta E < 1 · G-SYNC",
    "Hệ thống tản nhiệt ROG Intelligent Cooling 3 quạt Arc Flow Fans 2.0",
    "Hệ thống âm thanh 6 loa tăng cường âm trầm 47%",
    "Bàn phím tràn viền kích thước lớn với bàn rê chuột kính 16:10",
    "Pin 73Wh cùng sạc nhanh 100W USB-C PD",
    "Wi-Fi 7 tốc độ cao & Bluetooth 5.4",
    "Được hỗ trợ đầy đủ bởi Windows Copilot+ PC",
  ],
  stories: [
    {
      title: "Vỏ Nhôm CNC Nguyên Khối Với Dải Đèn Slash Lighting",
      text: "Được chế tác tỉ mỉ từ hợp kim nhôm siêu nhẹ cao cấp qua quy trình cắt CNC tinh xảo, Zephyrus G14 sở hữu độ hoàn thiện tuyệt hảo với dải đèn Slash Lighting bắt chéo nắp máy, cho phép hiển thị các mẫu ánh sáng động độc bản tùy biến qua Armoury Crate.",
      img: "/sites/rog-asus/img/detail/gu605-control.webp",
    },
    {
      title: "Màn Hình ROG Nebula OLED 3K 120Hz",
      text: "Tận hưởng độ tương phản vô cực và màu đen sâu thẳm với tấm nền OLED 3K (2880 x 1800), tần số quét 120Hz, thời gian phản hồi siêu tốc 0.2ms và độ phủ màu 100% DCI-P3 đạt chuẩn điện ảnh.",
      img: "/sites/rog-asus/img/detail/gu605-display.webp",
    },
    {
      title: "Hiệu Năng AI Đột Phá Với Ryzen AI 9 & RTX 50 Series",
      text: "Bộ xử lý AMD Ryzen™ AI 9 HX 370 với NPU tích hợp đạt 50 TOPS kết hợp cùng card đồ họa NVIDIA® GeForce RTX™ 5060 mang đến khả năng tăng tốc mượt mà cho các tác vụ sáng tạo nội dung, lập trình mô hình AI và chiến mượt mọi tựa game AAA.",
      img: "/sites/rog-asus/img/detail/gu605-mux.webp",
    },
    {
      title: "Tản Nhiệt ROG Intelligent Cooling Tri-Fan",
      text: "Sự kết hợp của 3 quạt tản nhiệt Arc Flow Fans thế hệ thứ 2, ống dẫn nhiệt thế hệ mới và keo tản nhiệt kim loại lỏng Thermal Grizzly giúp duy trì hiệu năng bền bỉ trong thân máy 14 inch mỏng nhẹ nhất phân khúc.",
      img: "/sites/rog-asus/img/detail/gu605-cooling.webp",
    },
  ],
  specs: [
    ["Hệ điều hành", "Windows 11 Home bản quyền"],
    ["Bộ vi xử lý", "AMD Ryzen™ AI 9 HX 370 Processor 2.0GHz (36MB Cache, up to 5.1GHz, 12 cores, 24 Threads)"],
    ["Bộ xử lý AI (NPU)", "AMD XDNA™ NPU up to 50 TOPS"],
    ["Đồ họa", "NVIDIA® GeForce RTX™ 5060 Laptop GPU, ROG Boost: 1890MHz* at 100W, 8GB GDDR7"],
    ["Màn hình", "14-inch 3K (2880 x 1800) OLED 16:10, Tần số quét 120Hz, Thời gian phản hồi 0.2ms, Độ sáng 500 nits HDR, 100% DCI-P3, Pantone Validated, G-Sync, Dolby Vision"],
    ["Bộ nhớ RAM", "32GB LPDDR5X 7500 on board"],
    ["Lưu trữ", "1TB M.2 NVMe™ PCIe® 4.0 SSD"],
    ["Cổng kết nối", "1x Type C USB 4 hỗ trợ DisplayPort / Power Delivery, 1x USB 3.2 Gen 2 Type-C, 2x USB 3.2 Gen 2 Type-A, 1x HDMI 2.1 FRL, 1x khe thẻ MicroSD (UHS-II), 1x jack tai nghe 3.5mm"],
    ["Bàn phím & Touchpad", "Bàn phím Chiclet 1 vùng RGB, hành trình 1.7mm, Touchpad kính mở rộng 16:10"],
    ["Camera", "1080P FHD IR Camera cho Windows Hello"],
    ["Âm thanh", "Công nghệ khuếch đại thông minh Smart Amp, Dolby Atmos, Khử tiếng ồn 2 chiều bằng AI, 4 loa trầm + 2 loa tép"],
    ["Mạng và kết nối", "Wi-Fi 7(802.11be) (Triple band) 2*2 + Bluetooth® 5.4"],
    ["Pin", "73WHrs, 4S1P, 4-cell Li-ion"],
    ["Bộ nguồn", "Hình chữ nhật 180W AC Adapter, Output: 20V DC, 9A, 180W"],
    ["Trọng lượng", "1.50 Kg (3.31 lbs)"],
    ["Kích thước (R x D x C)", "31.1 x 22.0 x 1.59 ~ 1.63 cm"],
  ],
  faq: [
    {
      q: "ROG Zephyrus G14 (2025) GA403 phù hợp với đối tượng người dùng nào?",
      a: "Chiếc laptop này được thiết kế dành riêng cho game thủ và nhà sáng tạo nội dung cần một thiết bị siêu di động chỉ nặng 1.5kg nhưng sở hữu hiệu năng mạnh mẽ với Ryzen AI 9, RTX 5060 và màn hình 3K OLED chuyên nghiệp.",
    },
    {
      q: "Dải đèn Slash Lighting có tùy biến được không?",
      a: "Có, bạn hoàn toàn có thể tùy biến các hiệu ứng ánh sáng động, nhấp nháy theo nhạc hoặc cảnh báo thông báo trên dải đèn Slash Lighting thông qua phần mềm Armoury Crate.",
    },
    {
      q: "Màn hình OLED của Zephyrus G14 có bị burn-in không?",
      a: "ASUS trang bị gói bảo vệ toàn diện ASUS OLED Care độc quyền với các tính năng Pixel Refresh, Pixel Shift và tản nhiệt chuyên dụng giúp ngăn ngừa triệt để hiện tượng burn-in và bảo vệ tấm nền lâu dài.",
    },
  ],
};

const ALLY_X: DetailProduct = {
  name: "ROG Ally X (2024)",
  tagline: "Chơi Mọi Tựa Game Của Bạn Mọi Lúc Mọi Nơi Với Pin 80Wh Khủng.",
  modelCode: "RC72LA-NH007W",
  price: "24.990.000 ₫",
  priceLabel: "Giá trên ASUS estore",
  storeUrl: "/vn/store",
  basePath: "/vn/gaming-handhelds/rog-ally/rog-ally-x-2024",
  thumbImg: "/sites/rog-asus/img/articles/ally-armoury-crate-se.webp",
  kv: "/sites/rog-asus/img/handheld/hero-1.webp",
  breadcrumb: [
    { label: "Gaming Handhelds", href: "/vn/gaming-handhelds-group" },
    { label: "ROG Ally", href: "/vn/gaming-handhelds-group" },
  ],
  highlights: [
    "Pin 80Wh khủng gấp đôi thế hệ trước",
    "RAM 24GB LPDDR5X-7500 siêu nhanh",
    "Bộ nhớ SSD 1TB M.2 2280 NVMe chuẩn thông dụng",
    "Bộ vi xử lý AMD Ryzen™ Z1 Extreme (8C/16T, 8.6 TFLOPS)",
    "Màn hình cảm ứng 7\" FHD 120Hz IPS 500 nits FreeSync Premium",
    "Thiết kế công thái học màu đen nhám cải tiến tay cầm",
    "Hai cổng USB-C (bao gồm 1 cổng USB4 40Gbps)",
    "Hệ thống tản nhiệt Zero Gravity Thermal System quạt mỏng hơn 50%",
    "Armoury Crate SE 1.5 với giao diện thư viện game tùy biến",
    "Hỗ trợ Windows 11 đầy đủ và Xbox Game Pass",
  ],
  stories: [
    {
      title: "Thời Lượng Pin Gấp Đôi Với Viên Pin 80Wh",
      text: "ROG Ally X được nâng cấp viên pin dung lượng lên tới 80Wh — gấp đôi so với thế hệ tiền nhiệm, cho phép game thủ thỏa sức cày các tựa game AAA nặng như Cyberpunk 2077 hay Black Myth: Wukong suốt nhiều giờ liên tục trên mọi chuyến hành trình.",
      img: "/sites/rog-asus/img/handheld/big-1.webp",
    },
    {
      title: "24GB RAM LPDDR5X-7500 & 1TB SSD 2280 Mới",
      text: "Bộ nhớ RAM được nâng lên 24GB LPDDR5X tốc độ cao 7500MHz giúp bạn thoải mái phân bổ tới 8GB VRAM chuyên dụng cho chip đồ họa RDNA 3 mà hệ thống vẫn còn 16GB RAM mượt mà. Ổ cứng SSD tiêu chuẩn 2280 dung lượng 1TB giúp dễ dàng nâng cấp lên tới 4TB.",
    },
    {
      title: "Thiết Kế Công Thái Học & Tay Cầm Cải Tiến",
      text: "Thân máy màu đen huyền bí với các đường vát tay cầm sâu hơn, các nút bấm macro phía sau được thu gọn tránh bấm nhầm, cụm D-Pad 8 hướng chính xác hơn và joystick có độ bền 5 triệu vòng quay.",
    },
    {
      title: "Kết Nối Đa Dạng Với Cổng USB4",
      text: "Trang bị 2 cổng USB-C tách biệt, trong đó có một cổng USB4 chuẩn 40Gbps hỗ trợ xuất hình Thunderbolt / DisplayPort 1.4 và gắn eGPU ngoài dễ dàng.",
    },
  ],
  specs: [
    ["Hệ điều hành", "Windows 11 Home bản quyền"],
    ["Bộ vi xử lý", "AMD Ryzen™ Z1 Extreme Processor ('Zen4' architecture with 4nm process, 8-core /16-threads, 24MB total cache, up to 5.10 Ghz boost)"],
    ["Đồ họa", "AMD Radeon™ Graphics (AMD RDNA™ 3, 12 CUs, up to 2.7 GHz, up to 8.6 Teraflops)"],
    ["Màn hình", "7-inch FHD (1920 x 1080) 16:9, Tần số quét 120Hz, Thời gian phản hồi 7ms, Độ sáng 500 nits, 100% sRGB, Gorilla® Glass Victus™, FreeSync Premium"],
    ["Bộ nhớ RAM", "24GB LPDDR5X 7500 on board (12GB*2 dual channel)"],
    ["Lưu trữ", "1TB PCIe® 4.0 NVMe™ M.2 SSD (2280)"],
    ["Cổng kết nối", "1x USB4 Type-C (hỗ trợ DisplayPort™ 1.4 và Power Delivery 3.0), 1x USB 3.2 Gen 2 Type-C (DisplayPort™ / PD 3.0), 1x khe đọc thẻ UHS-II microSD, 1x jack combo tai nghe/mic 3.5mm"],
    ["Điều khiển & Nút bấm", "2x Analog thumbsticks với RGB Aura Sync, cụm D-Pad 8 hướng, nút A B X Y, 2 nút Macro phía sau, nút Armoury Crate & Command Center"],
    ["Bảo mật", "Cảm biến vân tay tích hợp nút nguồn với Windows Hello"],
    ["Âm thanh", "2 loa stereo công nghệ Smart Amp, Dolby Atmos, Khử ồn AI, Hi-Res Audio"],
    ["Mạng và kết nối", "Wi-Fi 6E (802.11ax) Triple band 2*2 + Bluetooth® 5.2"],
    ["Pin", "80WHrs, 4S1P, 4-cell Li-ion"],
    ["Bộ nguồn", "TYPE-C, 65W AC Adapter, Output: 20V DC, 3.25A, 65W"],
    ["Trọng lượng", "678 g (1.49 lbs)"],
    ["Kích thước (R x D x C)", "28.0 x 11.1 x 2.47 ~ 3.69 cm"],
  ],
  faq: [
    {
      q: "ROG Ally X khác gì so với ROG Ally thế hệ đầu tiên?",
      a: "ROG Ally X nâng cấp dung lượng pin gấp đôi từ 40Wh lên 80Wh, tăng RAM từ 16GB lên 24GB LPDDR5X 7500MHz, đổi khe SSD sang chuẩn phổ thông M.2 2280 1TB, bổ sung cổng USB4 40Gbps và cải tiến phom cầm công thái học chắc chắn hơn.",
    },
    {
      q: "Máy có thể cài được những launcher game nào?",
      a: "Vì chạy hệ điều hành Windows 11 nguyên bản, ROG Ally X hỗ trợ 100% tất cả các launcher game trên PC gồm Steam, Xbox Game Pass, Epic Games Store, GOG, Battle.net và EA App.",
    },
  ],
};

const ROG_PHONE_7: DetailProduct = {
  name: "ROG Phone 7",
  tagline: "FOR THOSE WHO DARE. Điện Thoại Gaming Đỉnh Cao.",
  modelCode: "AI2205",
  price: "24.990.000 ₫",
  priceLabel: "Giá trên ASUS estore",
  storeUrl: "/vn/store",
  basePath: "/vn/phones/rog-phone-7",
  thumbImg: "/sites/rog-asus/img/detail/rog-phone-7-thumb.webp",
  kv: "https://dlcdnwebimgs.asus.com/files/media/2FB39932-532C-4338-B71B-8C0E3E9B7370/v1/features/images/large/2x/animation/kv/phone_right.webp",
  breadcrumb: [
    { label: "Điện thoại", href: "/vn/phones-group" },
    { label: "ROG Phone Series", href: "/vn/phones-group/allmodels" },
  ],
  highlights: [
    "Snapdragon® 8 Gen 2 Mobile Platform 3.2GHz với Ray Tracing tăng tốc phần cứng",
    "Màn hình 165Hz Samsung AMOLED 6.78\" đỉnh cao 1500 nits, tần số lấy mẫu cảm ứng 720Hz",
    "Thiết kế hai tông màu hoàn toàn mới với các chi tiết trong mờ tinh xảo",
    "Hệ thống tản nhiệt GameCool 7: Hợp chất Boron Nitride & Buồng hơi chu trình nhanh thế hệ mới",
    "Hỗ trợ quạt AeroActive Cooler 7 tích hợp loa siêu trầm biến thành dàn âm thanh 2.1",
    "Hệ thống loa kép Stereo mặt trước Dirac Virtuo™ đạt chuẩn Hi-Res Audio",
    "Nút điều khiển siêu âm AirTrigger độc quyền với đa dạng thao tác cử chỉ",
    "Pin khủng 6000 mAh (2x 3000 mAh) với sạc siêu nhanh 65W HyperCharge Adapter",
    "Hệ thống 3 camera sau: 50MP Sony IMX766 + 13MP Siêu rộng + Macro, Camera selfie 32MP",
    "Kháng nước chuẩn IP54 bền bỉ trong mọi điều kiện sử dụng",
    "Chuẩn kết nối không dây tương lai Wi-Fi 7 (802.11be) siêu tốc",
    "Phần mềm Armoury Crate & Game Genie tối ưu hiệu năng game đỉnh cao",
  ],
  stories: [
    {
      title: "Thiết Kế Hai Tông Màu Bắt Mắt",
      text: "Với các đường vát chéo táo bạo kết hợp các chi tiết trong mờ và hệ thống đèn Aura RGB cá tính, ROG Phone 7 tạo nên tuyên ngôn phong cách mạnh mẽ cho bất kỳ game thủ nào.",
      img: "https://dlcdnwebimgs.asus.com/files/media/2FB39932-532C-4338-B71B-8C0E3E9B7370/v1/features/images/large/2x/animation/s5/bg.webp",
    },
    {
      title: "Hiệu Năng Khủng Khiếp Snapdragon 8 Gen 2",
      text: "Trang bị nền tảng Snapdragon 8 Gen 2 xung nhịp 3.2GHz, nhanh hơn 15% về CPU và 20% về GPU so với thế hệ trước, kết hợp cùng RAM LPDDR5X 16GB và bộ nhớ lưu trữ siêu tốc UFS 4.0 512GB.",
      img: "https://dlcdnwebimgs.asus.com/files/media/2FB39932-532C-4338-B71B-8C0E3E9B7370/v1/features/images/large/2x/ksp/pd_2.webp",
    },
    {
      title: "Tản Nhiệt GameCool 7 Đột Phá",
      text: "Kiến trúc buồng hơi chu trình nhanh thế hệ mới với 6 kênh hồi lưu chất lỏng tăng 168% hiệu quả tản nhiệt, cùng quạt AeroActive Cooler 7 gia tăng 15% áp suất gió làm mát trực tiếp mặt lưng máy.",
      img: "https://dlcdnwebimgs.asus.com/files/media/2FB39932-532C-4338-B71B-8C0E3E9B7370/v1/features/images/large/2x/s8/bg.webp",
    },
    {
      title: "Màn Hình 165Hz AMOLED 1500 Nits",
      text: "Tấm nền Samsung AMOLED 6.78 inch với độ sáng tối đa 1500 nits, Delta-E < 1, tần số quét 165Hz và tần số lấy mẫu cảm ứng 720Hz mang lại hình ảnh siêu mượt và độ trễ phản hồi chỉ 23ms.",
      img: "https://dlcdnwebimgs.asus.com/files/media/2FB39932-532C-4338-B71B-8C0E3E9B7370/v1/features/images/large/2x/ksp/pd_5.webp",
    },
  ],
  specs: [
    ["Màu sắc", "Phantom Black (Đen Bóng Đêm) / Storm White (Trắng Bão Tố)"],
    ["Trọng lượng và kích thước", "239g, 173 x 77 x 10.3 mm"],
    ["Hệ điều hành", "Android 13 với giao diện ROG UI & Zen UI"],
    ["Bộ vi xử lý", "Qualcomm® Snapdragon® 8 Gen 2 Mobile Platform, SM8550 Octa-core CPU 3.2GHz, Adreno 740"],
    ["Bộ nhớ RAM", "16GB LPDDR5X tốc độ cao"],
    ["Bộ nhớ trong", "512GB UFS 4.0"],
    ["Màn hình", "6.78\" 20.4:9 (2448 x 1080) 165Hz Samsung AMOLED, 1500 nits peak, 720Hz touch sampling rate, 111.23% DCI-P3, Delta-E < 1, HDR10+, Corning® Gorilla® Glass Victus™"],
    ["Camera sau", "Cảm biến chính 50 MP Sony® IMX766 (1/1.56\", f/1.9), Camera góc siêu rộng 13 MP (120°), Camera macro 5 MP"],
    ["Camera trước", "32 MP (sử dụng công nghệ gộp điểm ảnh pixel binning cho ra ảnh 8 MP sắc nét)"],
    ["Quay video", "8K UHD (7680 x 4320) ở 24 fps, 4K UHD (3840 x 2160) ở 30/60 fps, chống rung điện tử EIS 3 trục"],
    ["Âm thanh", "Loa kép mặt trước đối xứng với Dirac HD Sound (5 nam châm), Cổng âm thanh 3.5mm với Qualcomm WCD9385 Hi-Res Audio 384kHz/32-bit, Dirac Virtuo™ không gian, 3 micro chống ồn"],
    ["Công nghệ không dây", "Wi-Fi 7 (802.11 be/ax/ac/a/b/g/n, 2.4GHz + 5GHz + 6GHz), Bluetooth® 5.3, NFC"],
    ["Định vị", "GPS (L1/L5), Glonass (L1), Galileo (E1/E5a), BeiDou (B1i/B1c/B2a), QZSS (L1/L5), NavIC"],
    ["Thẻ SIM", "2 khay Nano-SIM (Hỗ trợ 5G+5G Dual SIM Dual Standby)"],
    ["Cảm biến", "Cảm biến vân tay dưới màn hình, Nhận diện khuôn mặt, Gia tốc kế, La bàn số, Con quay hồi chuyển, Cảm biến tiệm cận, Cảm biến ánh sáng, Cảm biến siêu âm AirTrigger"],
    ["Pin", "Dung lượng khủng 6000 mAh (pin kép 2x 3000 mAh), sạc qua cổng cạnh bên hoặc cổng đáy"],
    ["Bộ nguồn sạc", "Sạc nhanh Quick Charge 5.0, PD 3.0, ROG HyperCharge 65W (sạc đầy 100% trong 42 phút)"],
    ["Chống nước & bụi", "Tiêu chuẩn IP54 kháng giọt bắn"],
  ],
  faq: [
    {
      q: "ROG Phone 7 có gì nổi bật so với thế hệ tiền nhiệm ROG Phone 6?",
      a: "ROG Phone 7 nâng cấp vi xử lý lên Snapdragon 8 Gen 2 mạnh mẽ và mát hơn đáng kể, độ sáng màn hình AMOLED tăng gấp đôi lên 1500 nits, tản nhiệt GameCool 7 với buồng hơi chu trình nhanh mới, và phụ kiện quạt tản nhiệt AeroActive Cooler 7 bổ sung loa siêu trầm biến điện thoại thành hệ thống âm thanh 2.1.",
    },
    {
      q: "Công nghệ AirTrigger trên ROG Phone 7 hoạt động như thế nào?",
      a: "AirTrigger sử dụng các cảm biến siêu âm ở cạnh máy, hỗ trợ đa dạng thao tác cử chỉ như Chạm kép, Nhấn giữ, Trượt, Vuốt và Nhắm bắn bằng con quay hồi chuyển, giúp game thủ điều khiển thoải mái như tay cầm chuyên nghiệp.",
    },
    {
      q: "Điện thoại có hỗ trợ sạc nhánh (Bypass Charging) khi đang chơi game không?",
      a: "Có, ROG Phone 7 hỗ trợ tính năng Bypass Charging thông qua Game Genie và cổng USB-C cạnh hông, cho phép cấp nguồn trực tiếp cho phần cứng mà không nạp qua pin, giúp máy mát hơn và kéo dài tuổi thọ pin tối đa.",
    },
  ],
};

const XG259QNSR_ACE: DetailProduct = {
  name: "ROG Strix XG259QNSR Ace",
  tagline: "420Hz Fast IPS. Tiện Ích Được Định Nghĩa Lại.",
  modelCode: "XG259QNSR-Ace / 90LM0DD0-B01321",
  price: "14.990.000 ₫",
  priceLabel: "Giá đề xuất bán lẻ",
  storeUrl: "/vn/store",
  basePath: "/vn/monitors/23-to-24-5-inches/rog-strix-xg259qnsr-ace",
  thumbImg: "https://dlcdnwebimgs.asus.com/gain/B276CBB3-24EB-4015-B005-87C455818976/w717/h525/fwebp",
  kv: "https://dlcdnwebimgs.asus.com/gain/B276CBB3-24EB-4015-B005-87C455818976/w717/h525/fwebp",
  breadcrumb: [
    { label: "Gaming Màn hình", href: "/vn/monitors-group/" },
    { label: "23 đến 24.5 Inches", href: "/vn/monitors/23-to-24-5-inches-group/" },
  ],
  highlights: [
    "Màn hình chơi game Fast IPS FHD (1920 x 1080) 24.5 inch với tần số quét 420 Hz (OC)",
    "Thời gian phản hồi siêu tốc 0.3 ms (tối thiểu) / 1 ms (GTG) loại bỏ bóng mờ hoàn toàn",
    "Công nghệ ASUS ELMB Sync kết hợp khử bóng mờ và tần số quét biến đổi VRR không xé hình",
    "Không gian màu rộng 115% sRGB, 90% DCI-P3 và độ tương phản HDR với DisplayHDR 400",
    "Bộ công nghệ ROG Gaming AI: Dynamic Crosshair, Dynamic Shadow Boost, Variable OD 2.0",
    "Ứng dụng DisplayWidget Center điều chỉnh cài đặt OSD trực tiếp bằng chuột cực kỳ tiện lợi",
    "Cổng kết nối đa năng: DisplayPort 1.4 HBR3, 2x HDMI 2.0 (TMDS), USB 3.2 Hub và giắc cắm tai nghe",
    "Chân đế công thái học thông minh: Nghiêng +20°~-5°, Xoay +45°~-45°, Xoay dọc +90°~-90°, Nâng hạ 160mm",
    "Tích hợp lỗ cắm tripod 1/4 inch chuẩn trên đỉnh chân đế để gắn webcam hoặc micro tiện lợi",
    "Đạt chuẩn chứng nhận bảo vệ mắt TÜV Rheinland Flicker-Free và Low Blue Light",
  ],
  stories: [
    {
      title: "Tần Số Quét 420Hz & Phản Hồi 0.3ms Đỉnh Cao",
      text: "Được thiết kế dành riêng cho game thủ Esports chuyên nghiệp, tấm nền Fast IPS 24.5 inch đạt tần số quét ấn tượng 420 Hz kết hợp cùng thời gian phản hồi chỉ 0.3 ms tối thiểu, mang đến độ mượt mà tuyệt đối và lợi thế phản xạ từng mili-giây trong các trận đấu quyết định.",
      img: "https://dlcdnwebimgs.asus.com/files/media/202607/ea798edb-b16b-4792-a7e3-71ec041b86e1/v2/images/vlcsnap-2023-12-29-15h02m50s358.webp",
    },
    {
      title: "Công Nghệ ASUS ELMB Sync Độc Quyền",
      text: "Cho phép công nghệ Extreme Low Motion Blur (ELMB) hoạt động đồng thời cùng Variable Refresh Rate (VRR), triệt tiêu hoàn toàn hiện tượng bóng ma và xé hình ngay cả ở tốc độ khung hình cao nhất.",
      img: "https://dlcdnwebimgs.asus.com/files/media/202607/ea798edb-b16b-4792-a7e3-71ec041b86e1/v2/images/Tear-Free-Ghost-Free-Gaming.webp",
    },
    {
      title: "DisplayWidget Center Thông Minh",
      text: "Không cần bấm nút vật lý phía sau màn hình, bạn có thể dễ dàng tinh chỉnh mọi thông số hiển thị, màu sắc, chế độ GameVisual và phím tắt thông qua giao diện trực quan bằng chuột.",
      img: "https://dlcdnwebimgs.asus.com/files/media/202607/ea798edb-b16b-4792-a7e3-71ec041b86e1/v2/images/Frame-84.webp",
    },
    {
      title: "ROG Gaming AI Assistant",
      text: "Tích hợp công nghệ hỗ trợ game thủ với Dynamic Crosshair tự động đổi màu tâm ngắm tương phản với nền cảnh, Dynamic Shadow Boost làm sáng các vùng tối mà không cháy sáng các vùng sáng khác.",
      img: "https://dlcdnwebimgs.asus.com/files/media/202607/ea798edb-b16b-4792-a7e3-71ec041b86e1/v2/images/vlcsnap-2023-12-29-10h01m03s420.webp",
    },
  ],
  specs: [
    ["Kích thước màn hình", "24.5 inch (16:9)"],
    ["Khu vực hiển thị (H x V)", "543.744 x 302.616 mm"],
    ["Bề mặt hiển thị", "Anti-Glare chống lóa"],
    ["Kiểu Panel / Đèn nền", "Fast IPS / LED"],
    ["Độ phân giải", "FHD (1920 x 1080)"],
    ["Tần số quét", "420 Hz (Overclock)"],
    ["Thời gian phản hồi", "1ms (GTG), 0.3ms (tối thiểu)"],
    ["Góc nhìn (CR ≧ 10)", "178° (Ngang) / 178° (Dọc)"],
    ["Độ sáng", "400 cd/m² (Typ), 400 cd/m² (HDR Peak)"],
    ["Độ tương phản", "1000:1 (Typ)"],
    ["Không gian màu", "115% sRGB, 90% DCI-P3 (16.7 triệu màu)"],
    ["Chuẩn HDR", "VESA DisplayHDR™ 400, hỗ trợ HDR10"],
    ["Tính năng Video", "ELMB Sync, VRR (Adaptive-Sync / G-SYNC Compatible / FreeSync Premium), Trace Free, GameVisual (8 chế độ), GamePlus, AI Visual, Dynamic Crosshair, Dynamic Shadow Boost, Variable OD 2.0, DisplayWidget Center"],
    ["Cổng kết nối", "1x DisplayPort 1.4 (HBR3), 2x HDMI 2.0, 2x USB 3.2 Gen 1 Type-A, 1x USB 3.2 Type-B (Upstream), 1x Jack tai nghe 3.5mm"],
    ["Tần số tín hiệu Digital", "HDMI: 27~255 KHz (H) / 48~240 Hz (V), DisplayPort: 467~467 KHz (H) / 48~420 Hz (V)"],
    ["Điện năng tiêu thụ", "Tiêu chuẩn: 24W, Điện áp: 100-240V, 50/60Hz"],
    ["Điều chỉnh chân đế", "Nghiêng: +20° ~ -5°, Xoay: +45° ~ -45°, Quay dọc: +90° ~ -90°, Điều chỉnh độ cao: 0 ~ 160 mm"],
    ["Gắn tường VESA", "100 x 100 mm"],
    ["Tiện ích đặc biệt", "Lỗ cắm chân máy Tripod Socket 1/4\", Khóa Kensington"],
    ["Kích thước (R x C x S)", "Có chân đế: 55.77 x 51.48 x 18.82 cm; Không chân đế: 55.8 x 33.2 x 5.89 cm"],
    ["Trọng lượng", "Có chân đế: 5.6 kg (12.35 lbs); Không chân đế: 3.4 kg (7.50 lbs)"],
    ["Phụ kiện kèm theo", "Cáp DisplayPort, Dây nguồn, Cáp USB Type-B sang Type-A, Túi ROG, Bộ sticker ROG, Thẻ bảo hành và Hướng dẫn sử dụng nhanh"],
    ["Chứng nhận chất lượng", "TÜV Flicker-free, TÜV Low Blue Light, VESA AdaptiveSync Display 420Hz, VESA DisplayHDR 400, AMD FreeSync Premium, G-SYNC Compatible"],
  ],
  faq: [
    {
      q: "Độ phân giải và tần số quét: Yếu tố nào quan trọng hơn khi chơi game Esports?",
      a: "Đối với game bắn súng góc nhìn thứ nhất (FPS) và Esports đối kháng tốc độ cao, tần số quét 420Hz và thời gian phản hồi 0.3ms quan trọng vượt trội so với độ phân giải cao, vì nó mang lại độ trễ tín hiệu thấp nhất và hình ảnh chuyển động sắc nét nhất giúp theo dõi mục tiêu chuẩn xác.",
    },
    {
      q: "ELMB Sync là gì và có điểm gì vượt trội?",
      a: "ELMB Sync là công nghệ độc quyền của ASUS ROG cho phép bật đồng thời cả tính năng chèn khung đen khử bóng mờ (ELMB) cùng với công nghệ đồng bộ tần số quét biến đổi (VRR / FreeSync / G-SYNC), giải quyết hoàn toàn vấn đề bóng mờ mà không bị giật lag hay rách hình.",
    },
    {
      q: "Màn hình có hỗ trợ điều chỉnh cài đặt OSD bằng phần mềm không?",
      a: "Có, thông qua ứng dụng ASUS DisplayWidget Center, bạn có thể dùng chuột máy tính để tùy chỉnh độ sáng, chế độ màu, bật Dynamic Crosshair hoặc gán phím tắt nhanh chóng mà không cần sờ vào các nút bấm vật lý phía sau màn hình.",
    },
  ],
};

const ROG_PHONE_8_PRO: DetailProduct = {
  name: "ROG Phone 8 Pro",
  tagline: "Beyond Gaming. Đỉnh Cao Hiệu Năng Snapdragon 8 Gen 3 & Màn Hình AniMe Vision.",
  modelCode: "AI2401-16G512G",
  price: "29.990.000 ₫",
  priceLabel: "Giá trên ASUS estore",
  storeUrl: "/vn/store",
  basePath: "/vn/phones/rog-phone-8-pro",
  thumbImg: "/sites/rog-asus/img/detail/rog-phone-7-thumb.webp",
  kv: "/sites/rog-asus/img/products/phones.webp",
  breadcrumb: [
    { label: "Gaming Phones", href: "/vn/phones-group/" },
    { label: "ROG Phone Series", href: "/vn/phones-group/" },
  ],
  highlights: [
    "Vi xử lý Qualcomm® Snapdragon® 8 Gen 3 mạnh mẽ nhất thế giới",
    "Màn hình Samsung E6 AMOLED 6.78\" 165Hz LTPO 1~120Hz độ sáng 2500 nits",
    "Hệ thống tản nhiệt GameCool 8 dẫn truyền nhiệt nhanh hơn 22%",
    "Đèn LED ma trận AniMe Vision 341 bóng hiển thị hoạt ảnh độc quyền",
    "Hệ thống 3 camera 50MP Sony IMX890 chống rung Gimbal 6 trục OIS 3.0",
    "Camera tele 32MP zoom quang 3X với OIS tích hợp",
    "Chuẩn kháng nước và bụi bẩn IP68 đầu tiên trên gaming phone",
    "Nút cảm ứng siêu âm AirTrigger siêu nhạy thế hệ mới",
    "Pin kép 5500 mAh cùng sạc nhanh 65W HyperCharge và sạc không dây Qi 15W",
    "Âm thanh không gian Dirac Virtuo cùng jack tai nghe 3.5mm Hi-Res Audio",
  ],
  stories: [
    {
      title: "Thiết Kế Mỏng Nhẹ Mới Cùng AniMe Vision",
      text: "ROG Phone 8 Pro tái định nghĩa điện thoại gaming với thân máy mỏng chỉ 8.9mm, viền màn hình siêu mỏng 1.45mm và mặt lưng kính nhám tích hợp 341 đèn LED AniMe Vision độc đáo có thể tùy biến các hoạt cảnh hiển thị theo sở thích.",
      img: "/sites/rog-asus/img/products/phones.webp",
    },
    {
      title: "Hiệu Năng Vô Song Với Snapdragon 8 Gen 3",
      text: "Trang bị chip Qualcomm® Snapdragon® 8 Gen 3 tiến trình 4nm hàng đầu thế giới với tốc độ CPU lên đến 3.3 GHz, RAM 16GB LPDDR5X 8533Mbps và bộ nhớ trong 512GB UFS 4.0, xử lý mượt mà mọi tựa game AAA di động ở mức đồ họa cao nhất.",
      img: "/sites/rog-asus/img/detail/story-toc-do.webp",
    },
    {
      title: "Camera Chuyên Nghiệp 50MP Gimbal OIS 3.0",
      text: "Lần đầu tiên trên dòng máy ROG Phone, bạn sở hữu cụm 3 camera chuẩn flagship: cảm biến chính 50MP Sony IMX890 chống rung Gimbal 6 trục OIS, ống kính tele 32MP zoom 3X và camera góc siêu rộng 13MP Free-form khử méo hình ảnh.",
      img: "/sites/rog-asus/img/detail/story-keyboard.webp",
    },
  ],
  specs: [
    ["Hệ điều hành", "Android™ 14 với ROG UI bản quyền"],
    ["Bộ vi xử lý", "Qualcomm® Snapdragon® 8 Gen 3, SM8650, Qcta-core CPUs, 3.3GHz"],
    ["Đồ họa (GPU)", "Qualcomm® Adreno™ 750"],
    ["Bộ nhớ RAM", "16GB LPDDR5X"],
    ["Bộ nhớ trong", "512GB UFS 4.0 ROM"],
    ["Màn hình", "6.78\" 20.4:9 (2400 x 1080) Samsung Flexible AMOLED 165Hz LTPO, Gorilla Glass Victus 2, 2500 nits đỉnh"],
    ["Camera sau", "50 MP Sony IMX890 OIS + 32 MP Telephoto 3X OIS + 13 MP Ultra-wide"],
    ["Camera trước", "32 MP RGBW với góc rộng 90°"],
    ["Âm thanh", "Loa kép đối xứng stereo, Dirac Virtuo, Hi-Res Audio 384kHz/32-bit, jack cắm 3.5mm"],
    ["Kháng nước & bụi", "Chuẩn IP68"],
    ["Pin", "5500 mAh (pin kép 2750 mAh) hỗ trợ sạc nhanh 65W Quick Charge 5.0 và PD 3.0, sạc không dây 15W Qi"],
    ["Kích thước & Trọng lượng", "163.8 x 76.8 x 8.9 mm, 225g"],
  ],
  faq: [
    {
      q: "ROG Phone 8 Pro có chơi game liên tục không bị nóng không?",
      a: "ROG Phone 8 Pro được trang bị hệ thống tản nhiệt GameCool 8 với bộ tản nhiệt Boron Nitride dẫn nhiệt trực tiếp từ SoC ra mặt lưng, giúp duy trì FPS ổn định lâu dài mà không bị tụt xung.",
    },
    {
      q: "Máy có chống nước đi mưa được không?",
      a: "Có, ROG Phone 8 Pro đạt chuẩn chống nước và bụi bẩn IP68, an toàn tuyệt đối khi gặp mưa lớn hoặc rơi vào nước ngọt ở độ sâu tới 1.5 mét trong 30 phút.",
    },
  ],
};

const ROG_STRIX_G16_2025: DetailProduct = {
  name: "ROG Strix G16 (2025) G614",
  tagline: "Chiến Thần eSports. Đồ Họa RTX 50 Series & Màn Hình ROG Nebula 240Hz.",
  modelCode: "G614FR-N4056W",
  price: "48.990.000 ₫",
  priceLabel: "Giá trên ASUS estore",
  storeUrl: "/vn/store",
  basePath: "/vn/laptops/rog-strix/rog-strix-g16-2025",
  thumbImg: "/sites/rog-asus/img/hot/strix-scar-18.webp",
  kv: "/sites/rog-asus/img/series/hero-strix.webp",
  breadcrumb: [
    { label: "Gaming Laptop Gaming ASUS ROG", href: "/vn/laptops-group" },
    { label: "ROG Strix", href: "/vn/laptops/rog-strix-series" },
  ],
  highlights: [
    "Vi xử lý Intel® Core™ i9-14900HX hoặc Intel® Core™ Ultra thế hệ mới",
    "Card đồ họa NVIDIA® GeForce RTX™ 5070 Laptop GPU 8GB GDDR7",
    "Màn hình ROG Nebula 16\" 2.5K (2560x1600) 240Hz 3ms 100% DCI-P3 G-Sync",
    "Hệ thống tản nhiệt thông minh ROG Tri-Fan với khe thoát nhiệt toàn diện",
    "Keo tản nhiệt kim loại lỏng Conductonaut Extreme giảm tới 15°C cho CPU & GPU",
    "Công nghệ MUX Switch kết hợp NVIDIA Advanced Optimus tự động kích hoạt card rời",
    "Âm thanh Dolby Atmos hai loa đạt chuẩn Hi-Res Audio",
    "Bàn phím RGB từng phím Per-Key Aura Sync cùng phím nóng chuyên game",
    "Pin dung lượng lớn 90Wh hỗ trợ sạc nhanh Type-C 100W PD",
    "Cổng mạng LAN 2.5G cùng Wi-Fi 6E/7 siêu tốc giảm độ trễ ping",
  ],
  stories: [
    {
      title: "Hiệu Năng Khủng Khiếp Cho Game Thủ eSports",
      text: "Được xây dựng cho những chiến thắng đỉnh cao, Strix G16 kết hợp CPU Intel Core HX hiệu năng cao và GPU NVIDIA GeForce RTX 50 Series với TGP tối đa 140W, mang lại tốc độ khung hình vượt trội trên mọi tựa game bắn súng cạnh tranh.",
      img: "/sites/rog-asus/img/hot/strix-scar-18.webp",
    },
    {
      title: "Màn Hình ROG Nebula 2.5K 240Hz Siêu Mượt",
      text: "Trải nghiệm hình ảnh chuẩn thi đấu với tỷ lệ 16:10 mở rộng, tần số quét 240Hz, thời gian phản hồi 3ms và độ phủ màu 100% DCI-P3, cho phép phát hiện kẻ địch nhanh hơn trong mọi góc nhìn.",
      img: "/sites/rog-asus/img/detail/gu605-display.webp",
    },
    {
      title: "Tản Nhiệt 3 Quạt Tri-Fan & Keo Kim Loại Lỏng",
      text: "Hệ thống làm mát 3 quạt Arc Flow kết hợp cùng keo tản nhiệt kim loại lỏng Conductonaut Extreme giúp CPU mát hơn 15°C, giữ cho máy luôn êm ái và mát mẻ kể cả trong các trận chiến kéo dài thâu đêm.",
      img: "/sites/rog-asus/img/detail/gu605-cooling.webp",
    },
  ],
  specs: [
    ["Hệ điều hành", "Windows 11 Home bản quyền"],
    ["Bộ vi xử lý", "Intel® Core™ i9-14900HX Processor 2.2 GHz (36MB Cache, up to 5.8 GHz, 24 cores, 32 Threads)"],
    ["Đồ họa", "NVIDIA® GeForce RTX™ 5070 Laptop GPU, ROG Boost: 2225MHz* at 140W, 8GB GDDR7"],
    ["Màn hình", "16-inch QHD+ 16:10 (2560 x 1600, WQXGA) 240Hz, 3ms, IPS-level, 500 nits, 100% DCI-P3, G-Sync, Dolby Vision"],
    ["Bộ nhớ RAM", "32GB DDR5-5600 SO-DIMM (hỗ trợ nâng cấp tối đa 64GB)"],
    ["Lưu trữ", "1TB PCIe® 4.0 NVMe™ M.2 Performance SSD (2 khe M.2)"],
    ["Cổng kết nối", "1x Thunderbolt™ 4, 1x USB 3.2 Gen 2 Type-C, 2x USB 3.2 Gen 2 Type-A, 1x 2.5G LAN port, 1x HDMI 2.1 FRL, 1x 3.5mm Combo Audio Jack"],
    ["Bàn phím & Touchpad", "Bàn phím Backlit Chiclet Per-Key RGB Aura Sync, Touchpad kích thước lớn"],
    ["Âm thanh", "Hệ thống 2 loa Smart Amp, Dolby Atmos, Khử tiếng ồn AI 2 chiều, Hi-Res certification"],
    ["Pin", "90WHrs, 4S1P, 4-cell Li-ion"],
    ["Bộ nguồn", "280W AC Adapter"],
    ["Trọng lượng", "2.50 Kg"],
  ],
  faq: [
    {
      q: "ROG Strix G16 có nâng cấp được RAM và ổ cứng SSD không?",
      a: "Có, Strix G16 sở hữu 2 khe RAM DDR5 cho phép nâng cấp tối đa 64GB và 2 khe cắm SSD NVMe PCIe 4.0 dễ dàng mở rộng dung lượng qua nắp đáy pop-up screw tiện dụng.",
    },
    {
      q: "Máy có hỗ trợ MUX Switch và NVIDIA Advanced Optimus không?",
      a: "Có, máy tích hợp đầy đủ MUX Switch và Advanced Optimus giúp tối ưu hóa xuất hình trực tiếp từ GPU rời lên màn hình, tăng tới 10-15% FPS trong game mà không cần phải khởi động lại máy.",
    },
  ],
};

const ROG_CROSSHAIR_X870E_HERO: DetailProduct = {
  name: "ROG Crosshair X870E Hero",
  tagline: "Đỉnh Cao Bo Mạch Chủ AM5. Sẵn Sàng Cho AMD Ryzen™ 9000 Series, PCIe 5.0 & Wi-Fi 7.",
  modelCode: "ROG-CROSSHAIR-X870E-HERO",
  price: "18.990.000 ₫",
  priceLabel: "Giá trên ASUS estore",
  storeUrl: "/vn/store",
  basePath: "/vn/motherboards/rog-crosshair/rog-crosshair-x870e-hero",
  thumbImg: "/sites/rog-asus/img/mb/hot-crosshair-x870e.webp",
  kv: "/sites/rog-asus/img/mb/hero-1.webp",
  breadcrumb: [
    { label: "Bo mạch chủ", href: "/vn/motherboards-group/" },
    { label: "ROG Crosshair", href: "/vn/motherboards-group/" },
  ],
  highlights: [
    "Socket AMD AM5 sẵn sàng cho bộ vi xử lý AMD Ryzen™ 9000, 8000 & 7000 Series",
    "Hệ thống cấp nguồn khủng 18+2+2 pha nguồn công suất 110A mỗi pha",
    "Hai cổng USB4® Type-C tốc độ 40Gbps và xuất hình DisplayPort™",
    "Kết nối Wi-Fi 7 thế hệ mới cùng cổng mạng LAN 5Gbps Realtek & 2.5Gbps Intel",
    "Tổng cộng 5 khe M.2 tích hợp, trong đó có 3 khe đạt chuẩn PCIe 5.0 tốc độ cao",
    "Công nghệ ép xung thông minh AI Overclocking, Dynamic OC Switcher và Core Flex",
    "Khe cắm card đồ họa PCIe 5.0 x16 hỗ trợ tính năng PCIe Slot Q-Release Slim",
    "Màn hình Polymo Lighting II rực rỡ hiển thị logo ROG trên nắp I/O",
    "Giải pháp âm thanh ROG SupremeFX ALC4082 cùng ESS® ES9219 QUAD DAC",
    "Hệ thống tản nhiệt VRM khổng lồ cùng tấm ốp lưng kim loại bảo vệ",
  ],
  stories: [
    {
      title: "Hệ Thống Cấp Nguồn Cực Khủng 18+2+2 Pha 110A",
      text: "Cung cấp nguồn điện ổn định tuyệt đối cho các CPU đa nhân mạnh nhất của AMD với dàn VRM 18+2+2 pha nguồn công suất 110A, cuộn cảm hợp kim MicroFine và tụ điện kim loại đen 10K Nhật Bản.",
      img: "/sites/rog-asus/img/mb/big-1.webp",
    },
    {
      title: "Kết Nối Đỉnh Cao: USB4® 40Gbps & Wi-Fi 7",
      text: "Được trang bị 2 cổng USB4® Type-C 40Gbps cho phép truyền tệp dung lượng cực lớn và xuất màn hình rời 8K, cùng module Wi-Fi 7 băng tần 320MHz với ăng-ten ASUS WiFi Q-Antenna siêu định hướng.",
      img: "/sites/rog-asus/img/mb/big-2.webp",
    },
    {
      title: "Tháo Lắp Thông Minh: PCIe Q-Release Slim & M.2 Q-Latch",
      text: "Nâng cấp card đồ họa và SSD trong nháy mắt mà không cần tua-vít nhờ cơ chế mở khóa tự động PCIe Slot Q-Release Slim chỉ bằng một thao tác kéo nhẹ và lẫy khóa M.2 Q-Latch không cần ốc.",
      img: "/sites/rog-asus/img/mb/big-3.webp",
    },
  ],
  specs: [
    ["Socket CPU", "AMD Socket AM5 cho AMD Ryzen™ 9000, 8000 & 7000 Series Desktop Processors"],
    ["Chipset", "AMD X870E Chipset"],
    ["Bộ nhớ RAM", "4 x DIMM, Max. 192GB, DDR5 8400+(OC), ECC and Non-ECC, Dual Channel, AMD EXPO™"],
    ["Đồ họa tích hợp", "2 x USB4® Type-C ports hỗ trợ DisplayPort 1.4 và xuất hình tối đa 4K@60Hz / 8K"],
    ["Khe cắm mở rộng", "1 x PCIe 5.0 x16 slot (hỗ trợ x16 hoặc x8/x8), 1 x PCIe 4.0 x16 slot"],
    ["Lưu trữ", "5 x M.2 slots (3 x PCIe 5.0 x4 + 2 x PCIe 4.0 x4) và 4 x cổng SATA 6Gb/s"],
    ["Mạng LAN", "1 x Realtek 5Gb Ethernet + 1 x Intel® 2.5Gb Ethernet"],
    ["Mạng không dây", "Wi-Fi 7 (802.11be) 2x2 320MHz + Bluetooth® 5.4"],
    ["Âm thanh", "ROG SupremeFX ALC4082 7.1 Surround Sound High Definition Audio CODEC + ESS® ES9219 QUAD DAC"],
    ["Cổng I/O phía sau", "2 x USB4® (40Gbps), 8 x USB 3.2 Gen 2 Type-A, 1 x USB 3.2 Gen 2 Type-C, 1 x HDMI, 2 x LAN, 2 x Audio jacks, 1 x Optical S/PDIF out, BIOS FlashBack™ button, Clear CMOS button"],
    ["Kích thước chuẩn", "ATX Form Factor (30.5 cm x 24.4 cm)"],
  ],
  faq: [
    {
      q: "Bo mạch chủ ROG Crosshair X870E Hero có hỗ trợ CPU Ryzen 9000 mới nhất không?",
      a: "Có, Crosshair X870E Hero được thiết kế tối ưu hóa 100% cho toàn bộ dòng vi xử lý AMD Ryzen™ 9000 Series và tương thích ngược với Ryzen 7000/8000 trên nền tảng socket AM5.",
    },
    {
      q: "PCIe Slot Q-Release Slim hoạt động như thế nào?",
      a: "Với PCIe Slot Q-Release Slim mới, bạn không cần phải cố thọc ngón tay hay que ấn lẫy khóa như trước: chỉ cần nghiêng nhẹ chiếc card đồ họa từ bên trái sang phải là chốt khóa sẽ tự động mở ra một cách nhẹ nhàng và an toàn.",
    },
  ],
};

const AZOTH_EXTREME: DetailProduct = {
  name: "ROG Azoth Extreme Edition 20",
  tagline: "Đỉnh Cao Bàn Phím Custom 75% Hợp Kim Nhôm & Sợi Carbon",
  modelCode: "ROG Azoth Extreme",
  price: "12.990.000 ₫",
  priceLabel: "Giá trên ASUS estore",
  storeUrl: "/vn/store",
  basePath: "/vn/keyboards/keyboards/pbt-keycaps/rog-azoth-extreme-edition-20",
  thumbImg: "/sites/rog-asus/img/kb/hot-azoth-extreme.webp",
  kv: "/sites/rog-asus/img/kb/hero.webp",
  breadcrumb: [{ label: "Gaming Bàn phím", href: "/vn/keyboards-group/" }],
  highlights: [
    "Màn hình OLED Full-color cảm ứng kèm núm xoay ba chiều",
    "Tấm định vị Switch bằng sợi Carbon cao cấp",
    "Khung nhôm CNC nguyên khối với 12 quy trình hoàn thiện",
    "Gasket Mount có thể điều chỉnh 2 mức độ gõ (Cứng / Mềm)",
    "Switch cơ học ROG NX Pre-lubed Hot-swap",
    "Polling rate 8000Hz với ROG Polling Rate Booster",
    "Thời lượng pin lên tới 1600 giờ sử dụng",
    "Tri-mode: Bluetooth, ROG SpeedNova 2.4GHz & USB Type-C",
  ],
  stories: [
    {
      title: "Chế Tác Thủ Công Hợp Kim Nhôm & Sợi Carbon",
      text: "Khung máy bằng hợp kim nhôm cao cấp kết hợp tấm định vị sợi carbon mang lại âm gõ đầm chắc, triệt tiêu rung động và nâng tầm trải nghiệm gõ phím custom lên mức độ nghệ thuật.",
      img: "/sites/rog-asus/img/kb/big-1.webp",
    },
    {
      title: "Màn Hình OLED Màu Cảm Ứng Đa Năng",
      text: "Màn hình OLED 1.47 inch full-color hiển thị thông số phần cứng, trạng thái kết nối, pin, tùy chỉnh hoạt ảnh gif và điều hướng nhanh hệ thống bằng núm xoay đa chiều.",
      img: "/sites/rog-asus/img/kb/big-2.webp",
    },
    {
      title: "Cơ Chế Gasket Mount Điều Chỉnh Cấp Độ",
      text: "Cho phép người dùng gạt cần chuyển đổi tức thì giữa chế độ gõ Đầm Cứng (Hard) cho thi đấu thể thao điện tử và chế độ Êm Nảy (Soft) cho công việc gõ văn bản hàng ngày.",
      img: "/sites/rog-asus/img/kb/big-3.webp",
    },
  ],
  specs: [
    ["Kích thước layout", "75% (81 phím)"],
    ["Kết nối", "USB 2.0 (TypeC to TypeA), Bluetooth 5.1, RF 2.4GHz SpeedNova"],
    ["Tấm định vị (Plate)", "Sợi Carbon Fiber cao cấp"],
    ["Switch", "ROG NX Mechanical Switches (Pre-lubed)"],
    ["Màn hình hiển thị", "OLED 1.47 inch Full-Color Touchscreen"],
    ["Polling Rate", "Lên đến 8000Hz (khi sử dụng ROG Polling Rate Booster)"],
    ["Hệ thống đèn LED", "RGB từng phím Aura Sync"],
    ["Thời lượng pin", "Lên tới 1600 giờ (chế độ 2.4GHz tắt đèn và OLED)"],
    ["Trọng lượng", "2200g (kèm kê tay hợp kim nhôm và silicone)"],
    ["Tương thích", "Windows 11, macOS, Armoury Crate"],
  ],
  faq: [
    {
      q: "Bàn phím ROG Azoth Extreme có hỗ trợ thay switch (Hot-swap) không?",
      a: "Có, toàn bộ switch trên ROG Azoth Extreme đều sử dụng socket hot-swap 5-pin tiêu chuẩn, cho phép bạn dễ dàng thay đổi và trải nghiệm các loại switch cơ học khác nhau.",
    },
    {
      q: "Cần gạt điều chỉnh Gasket Mount nằm ở vị trí nào?",
      a: "Cần gạt điều chỉnh độ cứng mềm của Gasket Mount được bố trí tinh tế ở mặt đáy bàn phím, cho phép thay đổi cảm giác gõ tức thì mà không cần tháo rời bàn phím.",
    },
  ],
};

const RAIKIRI_PRO: DetailProduct = {
  name: "ROG Raikiri Pro",
  tagline: "Tay Cầm Chơi Game Không Dây Có Màn Hình OLED Tích Hợp",
  modelCode: "ROG Raikiri Pro",
  price: "3.990.000 ₫",
  priceLabel: "Giá trên ASUS estore",
  storeUrl: "/vn/store",
  basePath: "/vn/controllers/rog-raikiri/rog-raikiri-pro",
  thumbImg: "/sites/rog-asus/img/products/tay-cam.webp",
  kv: "/sites/rog-asus/img/products/tay-cam.webp",
  breadcrumb: [{ label: "Gaming Tay cầm", href: "/vn/controllers-group/" }],
  highlights: [
    "Màn hình OLED 1.3-inch tích hợp hiển thị hoạt ảnh & cấu hình",
    "Tri-mode: Bluetooth, 2.4GHz RF độ trễ thấp & USB-C",
    "4 nút gán macro chuyên nghiệp phía sau (Rear Buttons)",
    "Nút cò Trigger tùy chỉnh 2 hành trình (Ngắn cho FPS, Dài cho Đua xe)",
    "DAC âm thanh cao cấp ESS tích hợp cho âm thanh 3.5mm trung thực",
    "Tùy biến Deadzone, độ nhạy và rung phản hồi trong Armoury Crate",
  ],
  stories: [
    {
      title: "Màn Hình OLED Trực Quan",
      text: "Màn hình OLED 1.3 inch tích hợp hiển thị hình ảnh động tùy chỉnh, kiểm tra pin, micrô, trạng thái kết nối và chuyển đổi nhanh các cấu hình hồ sơ người dùng.",
    },
    {
      title: "Tri-Mode Đa Nền Tảng",
      text: "Kết nối linh hoạt qua Bluetooth® độ tương thích cao, 2.4GHz RF độ trễ siêu thấp cho PC/Laptop gaming, hoặc cắm dây USB-C cho Xbox Series X|S và Xbox One.",
    },
  ],
  specs: [
    ["Khả năng tương thích", "Windows 10/11, Xbox Series X|S, Xbox One"],
    ["Kết nối", "Bluetooth 5.0, 2.4GHz RF, USB-C (Dây 3m bọc dù)"],
    ["Màn hình hiển thị", "OLED 1.3-inch độ phân giải 128 x 40"],
    ["Cổng âm thanh", "Jack 3.5mm tích hợp chip DAC ESS Sabre cao cấp"],
    ["Nút phía sau", "4 nút Macro tùy biến đa năng"],
    ["Thời lượng pin", "Lên đến 48 giờ sử dụng liên tục (tắt đèn & OLED)"],
    ["Trọng lượng", "330g (bao gồm pin)"],
  ],
  faq: [
    {
      q: "ROG Raikiri Pro có sử dụng được cho máy console Xbox không?",
      a: "Có, ROG Raikiri Pro được chứng nhận chính thức từ Xbox và hỗ trợ kết nối có dây USB-C đầy đủ chức năng trên Xbox Series X|S và Xbox One.",
    },
  ],
};

const THOR_1600T3: DetailProduct = {
  name: "ROG Thor 1600W Titanium III",
  tagline: "Nguồn Điện Cực Đại 1600W Chuẩn 80 PLUS Titanium & Màn Hình OLED Tách Rời",
  modelCode: "ROG-THOR-1600T3-GAMING",
  price: "18.990.000 ₫",
  priceLabel: "Giá trên ASUS estore",
  storeUrl: "/vn/store",
  basePath: "/vn/power-supply-units/rog-thor/rog-thor-1600t3-gaming",
  thumbImg: "/sites/rog-asus/img/psu/hot-thor-1600-evo.webp",
  kv: "/sites/rog-asus/img/psu/hero-1.webp",
  breadcrumb: [{ label: "Gaming Nguồn máy tính", href: "/vn/power-supply-units-group/" }],
  highlights: [
    "Chứng nhận hiệu suất siêu đẳng 80 PLUS Titanium",
    "Màn hình OLED Magnetic Detachable đo công suất thời gian thực",
    "Sử dụng MOSFET công nghệ GaN thế hệ mới tăng hiệu suất 30%",
    "Bộ ổn định điện áp thông minh GPU-First Voltage Stabilizer",
    "Cáp nguồn PCIe 5.0 12V-2x6 600W nguyên bản cho card RTX 50 Series",
    "Cụm tản nhiệt ROG Heatsinks khối lượng lớn vận hành 0dB không tiếng ồn",
  ],
  stories: [
    {
      title: "Hiệu Quả Năng Lượng Đỉnh Cao 80 PLUS Titanium",
      text: "Với các linh kiện bán dẫn GaN MOSFET tiên tiến và tụ điện 100% Nhật Bản, ROG Thor 1600W Titanium III đạt hiệu suất vượt ngưỡng 94%, sinh nhiệt tối thiểu và tiết kiệm năng lượng tối đa.",
    },
    {
      title: "Màn Hình OLED Đo Công Suất Thời Gian Thực",
      text: "Màn hình OLED gắn nam châm có thể xoay và tháo rời linh hoạt theo vị trí lắp đặt nguồn trong case, hiển thị tức thời tổng công suất tiêu thụ watt của hệ thống.",
    },
  ],
  specs: [
    ["Chuẩn công suất", "Intel ATX 3.1 & PCIe 5.1 Ready"],
    ["Hiệu suất", "80 PLUS Titanium & Cybenetics Titanium"],
    ["Công suất liên tục", "1600W"],
    ["Quạt làm mát", "135mm Dual Ball Bearing với công nghệ 0dB"],
    ["Cổng PCIe 16-pin", "2 x PCIe Gen 5 12V-2x6 (600W)"],
    ["Kích thước", "190 x 150 x 86 mm"],
    ["Bảo hành", "10 năm chính hãng quốc tế (Màn hình OLED bảo hành 3 năm)"],
  ],
  faq: [
    {
      q: "Nguồn ROG Thor 1600W Titanium III có chạy được 2 card đồ họa RTX 5090 cùng lúc không?",
      a: "Có, nguồn trang bị sẵn 2 đầu cấp nguồn PCIe 5.0 12V-2x6 riêng biệt và công suất liên tục 1600W đủ sức cung cấp điện áp ổn định tuyệt đối cho cấu hình dual RTX 5090.",
    },
  ],
};

const RAPTURE_GT_BE98_PRO: DetailProduct = {
  name: "ROG Rapture GT-BE98 Pro",
  tagline: "Router WiFi 7 Quad-Band Gaming 30,000 Mbps Đầu Tiên Thế Giới",
  modelCode: "GT-BE98 Pro",
  price: "19.990.000 ₫",
  priceLabel: "Giá trên ASUS estore",
  storeUrl: "/vn/store",
  basePath: "/vn/networking/rog-rapture/rog-rapture-gt-be98-pro",
  thumbImg: "/sites/rog-asus/img/products/thiet-bi-mang.webp",
  kv: "/sites/rog-asus/img/products/thiet-bi-mang.webp",
  breadcrumb: [{ label: "Thiết bị mạng", href: "/vn/networking-group/" }],
  highlights: [
    "Tốc độ WiFi 7 bốn băng tần (Quad-Band) lên đến 30,000 Mbps",
    "Băng tần kép 6GHz cực thông thoáng với độ rộng kênh 320MHz",
    "2 cổng 10 Gigabit WAN/LAN + 4 cổng 2.5 Gigabit Ethernet",
    "Multi-Link Operation (MLO) truyền tải đồng thời đa băng tần triệt tiêu giật lag",
    "Hệ thống tản nhiệt nhôm lớn tăng diện tích tiếp xúc thêm 18%",
    "Bảo mật mạng AiProtection Pro độc quyền bảo vệ trọn đời",
  ],
  stories: [
    {
      title: "Chuẩn WiFi 7 Bốn Băng Tần Quad-Band Đột Phá",
      text: "Kết hợp 2 băng tần 6GHz, 1 băng tần 5GHz và 1 băng tần 2.4GHz cùng công nghệ 4096-QAM, GT-BE98 Pro mang lại thông lượng dữ liệu cao hơn 160% so với thế hệ WiFi 6E.",
    },
  ],
  specs: [
    ["Tiêu chuẩn mạng", "IEEE 802.11be WiFi 7 (Quad-Band BE30000)"],
    ["Tốc độ tối đa", "Kép 6GHz: 11,529 Mbps x 2 · 5GHz: 5,764 Mbps · 2.4GHz: 1,376 Mbps"],
    ["Cổng mạng", "2 x 10G Ports, 4 x 2.5G Gaming Ports, 1 x 1G Port, 2 x USB"],
    ["Vi xử lý CPU", "Quad-core 2.6 GHz 64-bit Processor"],
    ["Bộ nhớ RAM", "2GB DDR4 RAM + 256MB Flash"],
  ],
  faq: [
    {
      q: "Tính năng Multi-Link Operation (MLO) trên WiFi 7 đem lại lợi ích gì?",
      a: "MLO cho phép thiết bị kết nối và gửi/nhận dữ liệu trên nhiều băng tần (như 5GHz và 6GHz) cùng một lúc, giảm thiểu độ trễ xuống mức cận 0ms và loại bỏ hoàn toàn hiện tượng nghẽn sóng khi chơi game.",
    },
  ],
};

const HYPERION_GR701: DetailProduct = {
  name: "ROG Hyperion GR701",
  tagline: "Vỏ Case E-ATX Flagship Tản Nhiệt Đỉnh Cao Khung Nhôm X-Frame",
  modelCode: "GR701",
  price: "12.490.000 ₫",
  priceLabel: "Giá trên ASUS estore",
  storeUrl: "/vn/store",
  basePath: "/vn/cases/rog-hyperion/rog-hyperion-gr701",
  thumbImg: "/sites/rog-asus/img/products/cases.webp",
  kv: "/sites/rog-asus/img/products/cases.webp",
  breadcrumb: [{ label: "Cases", href: "/vn/cases-group/" }],
  highlights: [
    "Hỗ trợ lắp đặt đồng thời hai két nước làm mát 420mm",
    "Khung nhôm đúc X-Frame cứng cáp chịu tải trọng di chuyển lên đến 80kg",
    "Tích hợp sẵn giá đỡ card đồ họa GPU Holder xoay 2 hướng linh hoạt",
    "Mặt trước trang bị 2 cổng USB-C 20Gbps hỗ trợ sạc nhanh 60W Quick Charge 4+",
    "Ngăn kéo chứa phụ kiện Tool-free giấu kín thông minh",
    "Đi kèm 4 quạt tản nhiệt ROG 140mm PWM cho luồng gió đối lưu cực đại",
  ],
  stories: [
    {
      title: "Thiết Kế Khung X-Frame Hầm Hố Đẳng Cấp",
      text: "Được chế tác từ hợp kim nhôm dày dặn tạo thành bộ khung chữ X đặc trưng của ROG, Hyperion GR701 không chỉ là một vỏ máy tính mà còn là tác phẩm điêu khắc cơ khí ấn tượng.",
    },
  ],
  specs: [
    ["Kích thước case", "E-ATX (Hỗ trợ mainboard lên tới 12\" x 10.9\")"],
    ["Kích thước tổng thể", "268 x 639 x 659 mm"],
    ["Khả năng tản nhiệt nước", "Trên: 420mm, Trước: 420mm, Bên hông: 360mm"],
    ["Chiều dài tối đa GPU", "460 mm (Hỗ trợ RTX 5090 thoải mái)"],
    ["Chiều cao tối đa tản nhiệt CPU", "190 mm"],
  ],
  faq: [
    {
      q: "Vỏ case Hyperion GR701 có lắp vừa card đồ họa RTX 5090 không?",
      a: "Hoàn toàn vừa vặn. Case hỗ trợ card đồ họa dài tới 460mm cùng giá đỡ GPU chịu lực chống xệ chuyên dụng đi kèm.",
    },
  ],
};

const HARPE_ACE_EXTREME: DetailProduct = {
  name: "ROG Harpe Ace Extreme",
  tagline: "Chuột Gaming Esports Siêu Nhẹ 47g Vỏ Sợi Carbon Siêu Bền",
  modelCode: "Harpe Ace Extreme",
  price: "5.990.000 ₫",
  priceLabel: "Giá trên ASUS estore",
  storeUrl: "/vn/store",
  basePath: "/vn/mice-mouse-pads/mice/wireless-mice/rog-harpe-ace-extreme",
  thumbImg: "/sites/rog-asus/img/mice/hot-harpe-2-extreme.webp",
  kv: "/sites/rog-asus/img/mice/hero-1.webp",
  breadcrumb: [{ label: "Chuột & Lót chuột", href: "/vn/mice-mouse-pads-group/" }],
  highlights: [
    "Lớp vỏ sợi carbon composite siêu nhẹ chỉ 47 gram",
    "Cảm biến quang học ROG AimPoint Pro 42,000 DPI siêu chính xác",
    "Tần số phản hồi không dây lên đến 8000Hz với ROG Polling Rate Booster",
    "Switch quang học ROG Optical Micro Switches tuổi thọ 100 triệu lần nhấn",
    "Chân đế chuột Corning® Gorilla® Glass 3 lướt êm ái trên lót chuột vải",
    "Thời lượng pin lên đến 100 giờ ở chế độ không dây SpeedNova",
  ],
  stories: [
    {
      title: "Chế Tác Vỏ Sợi Carbon Tiêu Chuẩn Hàng Không",
      text: "Sử dụng vật liệu sợi carbon dệt mật độ cao giúp tối ưu hóa trọng lượng chuột xuống mức 47g kỷ lục mà vẫn giữ độ cứng cáp hoàn hảo không bị uốn cong khi cầm nắm mạnh.",
    },
  ],
  specs: [
    ["Trọng lượng", "47 gram (không bao gồm cáp và dongle)"],
    ["Cảm biến", "ROG AimPoint Pro Optical Sensor (42,000 DPI, 750 IPS, 50G)"],
    ["Polling Rate", "Lên đến 8000Hz"],
    ["Kết nối", "ROG SpeedNova 2.4GHz RF, Bluetooth 5.1, USB-C có dây"],
    ["Switch", "ROG 100M Optical Micro Switches"],
  ],
  faq: [
    {
      q: "Chân đế Gorilla Glass 3 có gì khác so với chân PTFE thông thường?",
      a: "Chân đế kính cường lực Gorilla Glass 3 mang lại cảm giác lướt chuột mượt mà hơn, giảm tối đa ma sát khởi động (static friction), thích hợp nhất khi kết hợp với lót chuột vải bề mặt mịn.",
    },
  ],
};

const ROG_PHONE_9_PRO: DetailProduct = {
  name: "ROG Phone 9 Pro",
  tagline: "Đỉnh Cao Điện Thoại Gaming Snapdragon 8 Elite & Màn Hình 185Hz AniMe Vision",
  modelCode: "AI2501",
  price: "34.990.000 ₫",
  priceLabel: "Giá trên ASUS estore",
  storeUrl: "/vn/store",
  basePath: "/vn/phones/rog-phone-9-pro",
  thumbImg: "/sites/rog-asus/img/products/phones.webp",
  kv: "/sites/rog-asus/img/hero/gamescom.webp",
  breadcrumb: [{ label: "Điện thoại ROG Phone", href: "/vn/phones-group/" }],
  highlights: [
    "Vi xử lý Qualcomm Snapdragon® 8 Elite 3nm hiệu năng đỉnh nóc",
    "Màn hình Samsung E6 AMOLED LTPO 185Hz 2500 nits đỉnh cao",
    "Mặt lưng phụ AniMe Vision 648 đèn Mini-LED có thể chơi game retro",
    "Hệ thống tản nhiệt GameCool 9 với tấm tản nhiệt graphite lớn hơn 57%",
    "Phím cảm ứng siêu âm AirTrigger thế hệ mới cho trải nghiệm như tay cầm console",
    "Camera chính 50MP Sony Lytia-700 chống rung Gimbal OIS 6 trục",
    "Pin 5800 mAh hai cell, sạc nhanh HyperCharge 65W & sạc không dây Qi",
  ],
  stories: [
    {
      title: "Sức Mạnh Snapdragon 8 Elite Vượt Giới Hạn",
      text: "Trang bị thế hệ CPU Oryon độc quyền từ Qualcomm mang lại hiệu năng CPU tăng 45% và GPU tăng 40%, chơi mượt mà mọi tựa game di động nặng nhất thế giới ở mức 185 FPS ổn định.",
    },
    {
      title: "Màn Hình Phụ AniMe Vision 648 Đèn LED",
      text: "Mặt sau của ROG Phone 9 Pro được trang bị 648 bóng đèn Mini-LED ma trận cho phép hiển thị đồng hồ, thông báo, thời tiết và đặc biệt có thể chơi các tựa game arcade cổ điển trực tiếp.",
    },
  ],
  specs: [
    ["Vi xử lý", "Qualcomm Snapdragon® 8 Elite (3nm, xung nhịp lên đến 4.32GHz)"],
    ["Bộ nhớ", "16GB / 24GB LPDDR5X (9600 Mbps) · 512GB / 1TB UFS 4.0 ROM"],
    ["Màn hình", "6.78-inch FHD+ (2400 x 1080) AMOLED LTPO 1-185Hz, 2500 nits"],
    ["Camera sau", "50MP (Gimbal OIS) + 13MP (Góc siêu rộng) + 32MP (Tele 3X OIS)"],
    ["Camera trước", "32MP RGBW Sensor"],
    ["Dung lượng pin", "5800 mAh (Hỗ trợ Quick Charge 5.0, PD 3.0 65W)"],
    ["Chống nước bụi", "Chuẩn IP68"],
    ["Trọng lượng", "227 gram"],
  ],
  faq: [
    {
      q: "Màn hình AniMe Play trên ROG Phone 9 Pro chơi được những game nào?",
      a: "AniMe Play cho phép bạn chơi 4 tựa game retro tích hợp sẵn thông qua phím cảm ứng AirTrigger gồm: Snake, Space Invaders, Brick Breaker và Flappy Birds.",
    },
  ],
};

const MATRIX_5090: DetailProduct = {
  name: "ROG Matrix Platinum GeForce RTX™ 5090 - ASUS Graphics Cards 30th Anniversary Edition",
  tagline: "Đỉnh Cao 30 Năm Card Đồ Họa ASUS. Huyền Thoại Tái Sinh.",
  modelCode: "ROG-MATRIX-RTX5090-P32G-GAMING-30TH",
  price: "109.990.000 ₫",
  priceLabel: "Giá bán lẻ đề xuất",
  basePath: "/vn/graphics-cards/rog-matrix/rog-matrix-rtx5090-p32g-30th",
  kv: "/sites/rog-asus/img/vga/hot-matrix-5090.webp",
  thumbImg: "/sites/rog-asus/img/vga/hot-matrix-5090.webp",
  breadcrumb: [
    { label: "Trang chủ", href: "/vn" },
    { label: "Card Đồ họa", href: "/vn/graphics-cards-group" },
    { label: "ROG Matrix RTX 5090 30th", href: "/vn/graphics-cards/rog-matrix/rog-matrix-rtx5090-p32g-30th" },
  ],
  highlights: [
    "GPU NVIDIA® GeForce RTX™ 5090 32GB GDDR7 thế hệ mới nhất",
    "Phiên bản kỷ niệm 30 năm card đồ họa ASUS với thiết kế buồng hơi đồng & kim loại lỏng Liquid Metal",
    "Hệ thống cấp nguồn cực đại kép 800W với cổng GC-HPWR BTF và 12V-2x6",
    "Tính năng Memory Defroster độc quyền hỗ trợ ép xung nitơ lỏng (LN2)",
    "Hệ thống 4 quạt Axial-tech với khung nhôm nguyên khối liền mạch",
  ],
  stories: [
    {
      title: "Kỷ Niệm 30 Năm Đột Phá Công Nghệ Card Đồ Họa",
      text: "Từ card đồ họa ASUS đầu tiên năm 1996 đến huyền thoại ROG Matrix hôm nay, kiệt tác RTX 5090 30th Anniversary đại diện cho đỉnh cao công nghệ tản nhiệt và sức mạnh xử lý đồ họa nhân loại.",
    },
    {
      title: "Hệ Thống Tản Nhiệt Buồng Hơi & Keo Kim Loại Lỏng",
      text: "Sự kết hợp giữa buồng hơi bằng đồng nguyên chất 3D Vapor Chamber và keo kim loại lỏng dẫn nhiệt cao cấp giữ cho GPU luôn mát mẻ dưới mức công suất tối đa 800W.",
    },
  ],
  specs: [
    ["Graphic Engine", "NVIDIA® GeForce RTX™ 5090"],
    ["Bus Standard", "PCI Express 5.0"],
    ["OpenGL", "OpenGL® 4.6"],
    ["Video Memory", "32GB GDDR7 (512-bit, 28 Gbps)"],
    ["CUDA Cores", "21,760 Cores"],
    ["Engine Clock", "OC Mode: 2610 MHz · Default Mode: 2580 MHz (Boost Clock)"],
    ["Độ phân giải tối đa", "Digital Max Resolution 7680 x 4320 (8K HDR)"],
    ["Cổng xuất hình", "2x Native HDMI 2.1b · 3x Native DisplayPort 2.1b"],
    ["Hỗ trợ màn hình tối đa", "4 màn hình cùng lúc"],
    ["Cổng nguồn phụ", "2x 16-pin 12V-2x6 (hoặc chuẩn khe cắm BTF GC-HPWR lên đến 800W)"],
    ["Nguồn khuyến nghị", "1200W - 1600W (ROG Thor Platinum/Titanium)"],
    ["Kích thước", "357.6 x 149.3 x 72.5 mm (3.6-Slot)"],
    ["Trọng lượng", "2850 gram"],
  ],
  faq: [
    {
      q: "ROG Matrix RTX 5090 30th Anniversary Edition có hỗ trợ hệ sinh thái BTF không?",
      a: "Có, card đồ họa đi kèm đầu nối nguồn BTF GC-HPWR có thể tháo rời, cho phép cắm trực tiếp vào bo mạch chủ BTF giấu dây hoàn toàn hoặc sử dụng hai đầu cấp nguồn 12V-2x6 truyền thống.",
    },
  ],
};

export const DETAIL_PRODUCTS: Record<string, DetailProduct> = {
  matrix5090: MATRIX_5090,
  pg34wcdn: PG34WCDN,
  scar18: SCAR18,
  gu605: ZEPHYRUS_G16_GU605,
  g16_2025: ZEPHYRUS_G16_GU605,
  z13_kjp: FLOW_Z13_KJP,
  ga403: ZEPHYRUS_G14_GA403,
  zephyrus_g14: ZEPHYRUS_G14_GA403,
  ally_x: ALLY_X,
  rog_phone_7: ROG_PHONE_7,
  phone7: ROG_PHONE_7,
  rog_phone_8_pro: ROG_PHONE_8_PRO,
  phone8_pro: ROG_PHONE_8_PRO,
  phone9_pro: ROG_PHONE_9_PRO,
  rog_phone_9_pro: ROG_PHONE_9_PRO,
  strix_g16: ROG_STRIX_G16_2025,
  g16_strix: ROG_STRIX_G16_2025,
  crosshair_x870e: ROG_CROSSHAIR_X870E_HERO,
  xg259qnsr_ace: XG259QNSR_ACE,
  xg259: XG259QNSR_ACE,
  azoth_extreme: AZOTH_EXTREME,
  azoth: AZOTH_EXTREME,
  raikiri_pro: RAIKIRI_PRO,
  raikiri: RAIKIRI_PRO,
  thor_1600t3: THOR_1600T3,
  thor1600: THOR_1600T3,
  rapture_gt_be98_pro: RAPTURE_GT_BE98_PRO,
  rapture_be98: RAPTURE_GT_BE98_PRO,
  hyperion_gr701: HYPERION_GR701,
  hyperion: HYPERION_GR701,
  harpe_ace_extreme: HARPE_ACE_EXTREME,
  harpe_extreme: HARPE_ACE_EXTREME,
};

export default function RogProductDetail({
  product = "pg34wcdn",
  mode = "overview",
  customProduct,
}: {
  product?: string;
  mode?: "overview" | "spec";
  customProduct?: DetailProduct;
}) {
  const p = customProduct ?? DETAIL_PRODUCTS[product] ?? FLOW_Z13_KJP;
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="rog-pd">
      {/* breadcrumb */}
      <div className="rog-pd-breadcrumb">
        {p.breadcrumb.map((b) => (
          <Link key={b.label} href={b.href}>
            {b.label}
          </Link>
        ))}
        <span>›</span>
        <Link href={p.basePath}>{p.name}</Link>
        {mode === "spec" && (
          <>
            <span>›</span>
            <span>Thông số kỹ thuật</span>
          </>
        )}
      </div>

      {/* sticky subbar with tabs */}
      <div className="rog-pd-subbar">
        <div className="rog-pd-subbar-inner">
          <div className="rog-pd-subbar-left">
            {p.thumbImg && (
              <img
                src={p.thumbImg}
                alt={p.name}
                className="rog-pd-subbar-thumb"
              />
            )}
            <div className="rog-pd-subbar-title">{p.name}</div>
          </div>

          <nav className="rog-pd-subbar-tabs" aria-label="Tabs sản phẩm">
            <Link
              href={p.basePath}
              className={`rog-pd-tab-link${mode === "overview" ? " is-active" : ""}`}
            >
              {p.modelCode?.startsWith("GU605") ? "Tính năng (Xem thêm)" : "Tổng quan (Xem thêm)"}
            </Link>
            <Link
              href={`${p.basePath}/spec`}
              className={`rog-pd-tab-link${mode === "spec" ? " is-active" : ""}`}
            >
              Chi tiết / Thông số kỹ thuật
            </Link>
            {p.modelCode?.startsWith("GU605") ? (
              <>
                <Link
                  href={`${p.basePath}#awards`}
                  className="rog-pd-tab-link"
                >
                  Giải thưởng
                </Link>
                <Link
                  href={`${p.basePath}/gallery`}
                  className="rog-pd-tab-link"
                >
                  Thư viện
                </Link>
                <Link
                  href="/vn/where-to-buy"
                  className="rog-pd-tab-link"
                >
                  Nơi mua
                </Link>
              </>
            ) : (
              <>
                <a href="#awards" className="rog-pd-tab-link">
                  Giải thưởng
                </a>
                <a href="#gallery" className="rog-pd-tab-link">
                  Thư viện ảnh
                </a>
              </>
            )}
            <Link
              href="/vn/support"
              className="rog-pd-tab-link"
            >
              Hỗ trợ
            </Link>
          </nav>

          <div className="rog-pd-subbar-actions">
            {p.price && (
              <div className="rog-pd-subbar-price-wrap">
                <span className="rog-pd-subbar-price-label">{p.priceLabel ?? "Giá trên ASUS estore"}</span>
                <span className="rog-pd-subbar-price">{p.price}</span>
              </div>
            )}
            <Link
              href={p.storeUrl ?? "/vn/store"}
              className="rog-pd-buy-btn"
            >
              MUA NGAY
            </Link>
          </div>
        </div>
      </div>

      {mode === "spec" ? (
        /* DEDICATED SPEC VIEW */
        <div className="rog-spec-container">
          <section className="rog-spec-hero">
            <div className="rog-spec-hero-info">
              <div className="rog-spec-hero-subtitle">THÔNG SỐ KỸ THUẬT</div>
              <h1>{p.name}</h1>
              {p.modelCode && (
                <div className="rog-spec-hero-model">Model: {p.modelCode}</div>
              )}
              {p.price && (
                <div className="rog-spec-hero-pricing">
                  <span className="rog-spec-hero-price-label">{p.priceLabel ?? "Giá trên ASUS estore"}</span>
                  <span className="rog-spec-hero-price">{p.price}</span>
                </div>
              )}
              <div className="rog-spec-hero-cta" style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                <Link
                  href={p.storeUrl ?? "/vn/store"}
                  className="rog-pd-buy-btn"
                >
                  MUA NGAY TẠI ASUS STORE
                </Link>
                <Link
                  href={p.basePath}
                  className="rog-pd-specs-anchor-btn"
                >
                  ← XEM THÊM (TỔNG QUAN SẢN PHẨM)
                </Link>
              </div>
            </div>

            {p.thumbImg && (
              <div className="rog-spec-hero-media">
                <img src={p.thumbImg} alt={p.name} />
              </div>
            )}
          </section>

          {/* Full specs table */}
          <section className="rog-pd-specs">
            <h2 className="rog-pd-specs-title">Tất cả thông số kỹ thuật</h2>
            <table className="rog-pd-spec-table">
              <tbody>
                {p.specs.map(([k, v], i) => (
                  <tr key={`${k}-${i}`}>
                    <th scope="row">{k}</th>
                    <td>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="rog-pd-spec-note">
              *Thông số kỹ thuật có thể thay đổi tùy cấu hình và khu vực phân phối. Vui lòng kiểm tra lại
              với đại lý phân phối chính thức của ASUS ROG Việt Nam để có thông tin chính xác nhất.
            </p>
          </section>
        </div>
      ) : (
        /* OVERVIEW VIEW */
        <>
          {/* hero */}
          <section className="rog-pd-hero">
            <img className="rog-pd-kv" src={p.kv} alt={`${p.name} Key Visual`} />
            <div className="rog-pd-hero-text">
              <h1>{p.name}</h1>
              <p className="rog-pd-tagline">{p.tagline}</p>
              <div className="rog-pd-hero-cta">
                <Link
                  href={p.storeUrl ?? "/vn/store"}
                  className="rog-pd-buy-btn"
                >
                  MUA NGAY {p.price ? `(${p.price})` : ""}
                </Link>
                <Link href={`${p.basePath}/spec`} className="rog-pd-specs-anchor-btn">
                  CHI TIẾT & THÔNG SỐ KỸ THUẬT →
                </Link>
              </div>
            </div>
          </section>

          {/* Quote section (Ludens / Kojima Productions) */}
          {p.quote && (
            <section className="rog-pd-quote-section" id="awards">
              <div className="rog-pd-quote-inner">
                <blockquote className="rog-pd-quote-text">{p.quote.text}</blockquote>
                <div className="rog-pd-quote-author">{p.quote.author}</div>
                <div className="rog-pd-quote-role">{p.quote.role}</div>
              </div>
            </section>
          )}

          {/* highlight tiles */}
          <section className="rog-pd-highlights">
            {p.highlights.map((h) => (
              <div className="rog-pd-tile" key={h}>
                {h}
              </div>
            ))}
          </section>

          {/* feature stories */}
          <section className="rog-pd-stories" id="gallery">
            {p.stories.map((f) => (
              <article className={`rog-pd-story${f.img ? " has-media" : ""}`} key={f.title}>
                {f.img && (
                  <div className="rog-pd-story-media">
                    <img src={f.img} alt={f.title} loading="lazy" />
                  </div>
                )}
                <div className="rog-pd-story-body">
                  <h2>{f.title}</h2>
                  <p>{f.text}</p>
                </div>
              </article>
            ))}
          </section>

          {/* FAQ */}
          {p.faq.length > 0 && (
            <section className="rog-pd-faq">
              <h2 className="rog-pd-faq-title">Câu hỏi thường gặp về {p.name.replace(/ \(202[0-9]\).*/, "")}</h2>
              <div className="rog-pd-faq-list">
                {p.faq.map((item, i) => (
                  <div className={`rog-pd-faq-item${openFaq === i ? " rog-pd-faq-open" : ""}`} key={item.q}>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    >
                      {item.q}
                      <span aria-hidden>{openFaq === i ? "−" : "+"}</span>
                    </button>
                    {openFaq === i && (
                      <div className="rog-pd-faq-answer">
                        <p>{item.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* specs table preview */}
          <section className="rog-pd-specs">
            <h2 className="rog-pd-specs-title">Thông Số Kỹ Thuật Chính</h2>
            <table className="rog-pd-spec-table">
              <tbody>
                {p.specs.slice(0, 10).map(([k, v], i) => (
                  <tr key={`${k}-${i}`}>
                    <th scope="row">{k}</th>
                    <td>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ textAlign: "center", marginTop: "24px" }}>
              <Link href={`${p.basePath}/spec`} className="rog-pd-buy-btn">
                XEM ĐẦY ĐỦ TẤT CẢ THÔNG SỐ KỸ THUẬT
              </Link>
            </div>
          </section>
        </>
      )}

      {/* awards */}
      {p.awards && p.awards.length > 0 && (
        <section className="rog-pd-awards">
          <h2 className="rog-pd-sec-title">GIẢI THƯỞNG</h2>
          <div className="rog-pd-awards-row">
            {p.awards.map((a) => (
              <div className="rog-pd-award" key={a}>
                <img src={a} alt="Giải thưởng ROG" loading="lazy" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* media reviews */}
      {p.mediaReviews && p.mediaReviews.length > 0 && (
        <section className="rog-pd-media">
          <h2 className="rog-pd-sec-title">MEDIA REVIEW</h2>
          <div className="rog-pd-media-grid">
            {p.mediaReviews.map((m) => (
              <a className="rog-pd-media-card" key={m.href} href={m.href} target="_blank" rel="noreferrer">
                <div className="rog-pd-media-logo">
                  <img src={m.img} alt={m.score} loading="lazy" />
                </div>
                <span className="rog-pd-media-score">{m.score}</span>
                <p className="rog-pd-media-quote">“{m.quote}”</p>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* video reviews */}
      {p.videoReviews && p.videoReviews.length > 0 && (
        <section className="rog-pd-videoreviews">
          <h2 className="rog-pd-sec-title">VIDEO REVIEW</h2>
          <div className="rog-pd-videoreviews-grid">
            {p.videoReviews.map((v) => (
              <a className="rog-pd-videoreview-card" key={v.href} href={v.href} target="_blank" rel="noreferrer">
                <div className="rog-pd-media-logo">
                  <img src={v.img} alt={v.source} loading="lazy" />
                </div>
                <span className="rog-pd-videoreview-source">{v.source}</span>
                <p className="rog-pd-videoreview-quote">{v.quote}</p>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* customer reviews — source renders an empty widget */}
      <section className="rog-pd-custreviews">
        <h2 className="rog-pd-sec-title">CUSTOMER REVIEWS</h2>
        <div className="rog-pd-custreviews-empty">
          <div className="rog-pd-custreviews-stars" aria-hidden>★★★★★</div>
          <p>Chưa có đánh giá nào từ khách hàng cho sản phẩm này.</p>
        </div>
      </section>

      {/* related articles */}
      {p.relatedArticles && p.relatedArticles.length > 0 && (
        <section className="rog-pd-relarticles">
          <h2 className="rog-pd-sec-title">BÀI VIẾT LIÊN QUAN</h2>
          <div className="rog-pd-relarticles-grid">
            {p.relatedArticles.map((a) => (
              <a className="rog-pd-relarticle" key={a.href} href={a.href} target="_blank" rel="noreferrer">
                <div className="rog-pd-relarticle-img">
                  <img src={a.img} alt={a.title} loading="lazy" />
                </div>
                <span className="rog-rel-tag">{"// POST"}</span>
                <h3>{a.title}</h3>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
