import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import RogNavbar from "@/components/sites/rog-asus/RogNavbar";
import RogPromoBar from "@/components/sites/rog-asus/RogPromoBar";
import RogProductHome from "@/components/sites/rog-asus/RogProductHome";
import RogProductDetail from "@/components/sites/rog-asus/RogProductDetail";
import RogFlowZ13KjpOverview from "@/components/sites/rog-asus/flow-z13-kjp/RogFlowZ13KjpOverview";
import RogZephyrusG16Gu605Overview from "@/components/sites/rog-asus/zephyrus-g16/RogZephyrusG16Gu605Overview";
import RogZephyrusDuo2026Overview from "@/components/sites/rog-asus/zephyrus-duo-2026/RogZephyrusDuo2026Overview";
import RogZephyrusG16Gu605Gallery from "@/components/sites/rog-asus/zephyrus-g16/RogZephyrusG16Gu605Gallery";
import RogScar18Overview from "@/components/sites/rog-asus/scar-18-2026/RogScar18Overview";
import RogCardMatrix5090Overview from "@/components/sites/rog-asus/matrix-5090/RogCardMatrix5090Overview";
import RogPhone7Overview from "@/components/sites/rog-asus/rog-phone-7/RogPhone7Overview";
import RogXg259qnsrAceOverview from "@/components/sites/rog-asus/xg259qnsr-ace/RogXg259qnsrAceOverview";
import RogAlly2023Overview from "@/components/sites/rog-asus/rog-ally-2023/RogAlly2023Overview";
import RogSeriesPage, { SeriesType } from "@/components/sites/rog-asus/RogSeriesPage";
import RogFooter from "@/components/sites/rog-asus/RogFooter";
import RogChatWidget from "@/components/sites/rog-asus/RogChatWidget";
import RogUniversalProductOverview from "@/components/sites/rog-asus/universal/RogUniversalProductOverview";
import { RogApi } from "@/lib/api-client";

/* Product detail pages cloned locally (pathname → metadata) */
const PRODUCT_DETAILS: Record<
  string,
  { title: string; product: string; description: string }
> = {
  "monitors/32-to-34-inches/rog-swift-oled-pg34wcdn": {
    title:
      "ROG Swift OLED PG34WCDN | 32 đến 34 Inches | Gaming Màn hình｜ROG - Republic of Gamers｜Việt Nam",
    product: "pg34wcdn",
    description:
      "ROG Swift OLED PG34WCDN — màn hình gaming QD-OLED 34-inch 360Hz của ROG.",
  },
  "monitors/23-to-24-5-inches/rog-strix-xg259qnsr-ace": {
    title:
      "ROG Strix XG259QNSR Ace | 23 đến 24.5 Inches | Gaming Màn hình｜ROG - Republic of Gamers｜ROG Việt Nam",
    product: "xg259qnsr_ace",
    description:
      "Màn hình chơi game ROG Strix XG259QNSR Ace ― 25 inch (24.5 inch hiển thị) FHD (1920 x 1080), 420 Hz (OC), Fast IPS, 1 ms GTG (0.3 ms tối thiểu), HDR, DisplayWidget Center.",
  },
  "laptops/rog-strix/rog-strix-scar-18-2026": {
    title: "ROG Strix SCAR 18 (2026) - Laptop Gaming Mạnh Nhất Của ROG",
    product: "scar18",
    description:
      "ROG Strix SCAR 18 2026 với Intel Core Ultra 9 290HX Plus, NVIDIA GeForce RTX 5090 và màn hình 4K 240Hz Nebula HDR.",
  },
  "laptops/rog-strix/rog-strix-g18-2025": {
    title: "ROG Strix G18 (2025) G815 | Laptop Gaming 18 inch ROG Nebula",
    product: "scar18",
    description:
      "ROG Strix G18 (2025) G815 với Intel Core Ultra 9, NVIDIA GeForce RTX 5080/5070 và màn hình 2.5K 240Hz ROG Nebula.",
  },
  "laptops/rog-zephyrus/rog-zephyrus-duo-2026": {
    title: "ROG Zephyrus Duo (2026) GX651 | Laptop Gaming 2 Màn Hình OLED 3K",
    product: "duo_2026",
    description:
      "ROG Zephyrus Duo (2026) GX651 — Laptop gaming hai màn hình 16 inch OLED 3K đầu tiên trên thế giới. Trang bị CPU AMD Ryzen AI, card đồ họa NVIDIA GeForce RTX 50 Series, hệ thống tản nhiệt buồng hơi AAS+.",
  },
  "laptops/rog-zephyrus/rog-zephyrus-g16-2025-gu605": {
    title: "ROG Zephyrus G16 (2025) GU605 | Laptop gaming AI｜ROG VN",
    product: "gu605",
    description:
      "ROG Zephyrus G16 2025 với Intel Core Ultra 9, NVIDIA GeForce RTX 5090, màn hình ROG Nebula OLED 2.5K/240Hz. Laptop gaming siêu mỏng nhẹ, mạnh mẽ, vượt giới hạn.",
  },
  "laptops/rog-zephyrus/rog-zephyrus-g14-2025-ga403": {
    title: "ROG Zephyrus G14 (2025) GA403 | Laptop Gaming Mỏng Nhẹ OLED｜ROG VN",
    product: "ga403",
    description:
      "ROG Zephyrus G14 2025 GA403 với AMD Ryzen AI 9 HX 370, NVIDIA GeForce RTX 5060, màn hình 3K OLED 120Hz, vỏ nhôm CNC dải đèn Slash Lighting.",
  },
  "laptops/rog-flow/rog-flow-z13-kjp": {
    title: "ROG Flow Z13-KJP | Laptop Gaming 2-in-1 | Ryzen AI MAX+ 395",
    product: "z13_kjp",
    description:
      "ROG Flow Z13 KJP (2026), Laptop gaming mạnh nhất thế giới hợp tác với KOJIMA PRODUCTIONS. AMD Ryzen™ AI MAX+ 395, Radeon 8060S, 128GB RAM. For Ludens Who Dare.",
  },
  "gaming-handhelds/rog-ally/rog-ally-2023": {
    title: "ROG Ally (2023) | Máy chơi game cầm tay｜#playALLYourgames ｜ROG VN",
    product: "ally_2023",
    description:
      "ROG Ally là máy chơi game cầm tay đầu tiên của ASUS với AMD Ryzen™ Z1 Extreme, màn hình 120Hz Full HD, tản nhiệt Zero Gravity và phần mềm Armoury Crate SE.",
  },
  "gaming-handhelds/rog-ally/rog-ally-x-2024": {
    title: "ROG Ally X (2024) | Máy Chơi Game Cầm Tay Windows 11 Pin 80Wh｜ROG VN",
    product: "ally_x",
    description:
      "ROG Ally X 2024 với pin 80Wh gấp đôi, RAM 24GB LPDDR5X-7500, SSD 1TB NVMe, AMD Ryzen Z1 Extreme, màn hình cảm ứng 120Hz FreeSync Premium.",
  },
  "phones/rog-phone-7": {
    title: "ROG Phone 7 | Điện thoại | ROG - Republic of Gamers | ROG VN",
    product: "rog_phone_7",
    description:
      "ROG Phone 7 trang bị Snapdragon 8 Gen 2, tản nhiệt GameCool 7, màn hình 165Hz AMOLED 1500 nits, nút siêu âm AirTrigger và pin 6000 mAh.",
  },
  "phones/rog-phone-8-pro": {
    title: "ROG Phone 8 Pro | Điện Thoại Gaming Snapdragon 8 Gen 3 | ROG VN",
    product: "rog_phone_8_pro",
    description:
      "ROG Phone 8 Pro với Snapdragon 8 Gen 3, AniMe Vision 341 LED, camera chống rung Gimbal OIS 50MP, chuẩn chống nước IP68 và màn hình AMOLED 165Hz.",
  },
  "laptops/rog-strix/rog-strix-g16-2025": {
    title: "ROG Strix G16 (2025) G614 | Laptop Gaming eSports Nebula 240Hz | ROG VN",
    product: "strix_g16",
    description:
      "ROG Strix G16 2025 với Intel Core i9 HX, NVIDIA GeForce RTX 5070, màn hình ROG Nebula 2.5K 240Hz và tản nhiệt Tri-Fan kim loại lỏng.",
  },
  "motherboards/rog-crosshair/rog-crosshair-x870e-hero": {
    title: "ROG Crosshair X870E Hero | Bo Mạch Chủ AM5 Flagship | ROG VN",
    product: "crosshair_x870e",
    description:
      "ROG Crosshair X870E Hero cho AMD Ryzen 9000, 18+2+2 pha 110A, hai cổng USB4 40Gbps, Wi-Fi 7, 5 khe M.2 PCIe 5.0 và PCIe Slot Q-Release Slim.",
  },
  "keyboards/keyboards/pbt-keycaps/rog-azoth-extreme-edition-20": {
    title: "ROG Azoth Extreme Edition 20 | Bàn Phím Cơ Custom Cao Cấp | ROG VN",
    product: "azoth_extreme",
    description:
      "Bàn phím cơ ROG Azoth Extreme Edition 20 với màn hình OLED full-color, tấm định vị sợi carbon, gasket mount điều chỉnh và switch ROG NX Pre-lubed.",
  },
  "controllers/rog-raikiri/rog-raikiri-pro": {
    title: "ROG Raikiri Pro | Tay Cầm Chơi Game OLED Không Dây | ROG VN",
    product: "raikiri_pro",
    description:
      "Tay cầm chơi game không dây ROG Raikiri Pro với màn hình OLED tích hợp, 4 nút macro phía sau, kết nối Tri-mode và DAC âm thanh ESS.",
  },
  "power-supply-units/rog-thor/rog-thor-1600t3-gaming": {
    title: "ROG Thor 1600W Titanium III | Nguồn Máy Tính 80 PLUS Titanium | ROG VN",
    product: "thor_1600t3",
    description:
      "Nguồn ROG Thor 1600W Titanium III với linh kiện GaN MOSFETs, màn hình OLED nam châm tháo rời và hỗ trợ 2 cổng PCIe 5.0 12V-2x6 600W.",
  },
  "networking/rog-rapture/rog-rapture-gt-be98-pro": {
    title: "ROG Rapture GT-BE98 Pro | Router WiFi 7 Bốn Băng Tần BE30000 | ROG VN",
    product: "rapture_gt_be98_pro",
    description:
      "Router WiFi 7 bốn băng tần ROG Rapture GT-BE98 Pro tốc độ 30,000 Mbps với 2 cổng 10G, băng tần kép 6GHz và Multi-Link Operation.",
  },
  "cases/rog-hyperion/rog-hyperion-gr701": {
    title: "ROG Hyperion GR701 | Vỏ Case E-ATX Flagship Tản Nhiệt Kép 420mm | ROG VN",
    product: "hyperion_gr701",
    description:
      "Vỏ máy tính E-ATX ROG Hyperion GR701 với khung nhôm X-Frame chịu lực 80kg, hỗ trợ 2 tản nhiệt 420mm và cổng sạc Type-C 60W phía trước.",
  },
  "mice-mouse-pads/mice/wireless-mice/rog-harpe-ace-extreme": {
    title: "ROG Harpe Ace Extreme | Chuột Gaming Sợi Carbon 47g 8000Hz | ROG VN",
    product: "harpe_ace_extreme",
    description:
      "Chuột gaming esports ROG Harpe Ace Extreme siêu nhẹ 47g bằng vỏ sợi carbon, cảm biến ROG AimPoint Pro 42,000 DPI và polling rate 8000Hz.",
  },
  "phones/rog-phone-9-pro": {
    title: "ROG Phone 9 Pro | Điện Thoại Gaming Snapdragon 8 Elite 185Hz | ROG VN",
    product: "phone9_pro",
    description:
      "ROG Phone 9 Pro với Snapdragon 8 Elite 3nm, màn hình AMOLED 185Hz, màn hình phụ AniMe Vision 648 LED, tản nhiệt GameCool 9 và camera Gimbal 50MP.",
  },
  "graphics-cards/rog-matrix/rog-matrix-rtx5090-p32g-30th": {
    title:
      "ROG Matrix Platinum GeForce RTX™ 5090 - 30th Anniversary Edition | ROG VN",
    product: "matrix5090",
    description:
      "ROG Matrix GeForce RTX 5090 phiên bản kỷ niệm 30 năm card đồ họa ASUS: hai đầu nguồn 800W, bốn quạt, buồng hơi đồng, keo kim loại lỏng và Memory Defroster cho ép xung LN2.",
  },
};

/* Dedicated Spec pages (pathname → metadata) */
const SPEC_PAGES: Record<
  string,
  { title: string; product: string; description: string }
> = {
  "laptops/rog-zephyrus/rog-zephyrus-duo-2026/spec": {
    title: "ROG Zephyrus Duo (2026) GX651 - Thông số kỹ thuật | Laptop Gaming ROG VN",
    product: "duo_2026",
    description:
      "Thông số kỹ thuật chi tiết của ROG Zephyrus Duo (2026) GX651 hai màn hình OLED 3K, AMD Ryzen AI và NVIDIA RTX 50 Series.",
  },
  "laptops/rog-flow/rog-flow-z13-kjp/spec": {
    title: "ROG Flow Z13-KJP - Thông số kỹ thuật | Laptop Gaming 2-in-1｜ROG VN",
    product: "z13_kjp",
    description:
      "Thông số kỹ thuật chi tiết của ROG Flow Z13-KJP với AMD Ryzen™ AI MAX+ 395, Radeon 8060S, 128GB LPDDR5X RAM, màn hình 2.5K 180Hz.",
  },
  "laptops/rog-zephyrus/rog-zephyrus-g16-2025-gu605/spec": {
    title: "ROG Zephyrus G16 (2025) GU605 - Thông số kỹ thuật | Laptop gaming AI｜ROG VN",
    product: "gu605",
    description:
      "Thông số kỹ thuật chi tiết của ROG Zephyrus G16 (2025) GU605 với Intel Core Ultra 9 285H, NVIDIA GeForce RTX 5090, màn hình OLED 2.5K 240Hz.",
  },
  "laptops/rog-zephyrus/rog-zephyrus-g14-2025-ga403/spec": {
    title: "ROG Zephyrus G14 (2025) GA403 - Thông số kỹ thuật | Laptop Gaming ROG VN",
    product: "ga403",
    description:
      "Thông số kỹ thuật chi tiết của ROG Zephyrus G14 (2025) GA403 với AMD Ryzen AI 9 HX 370, NVIDIA RTX 5060, màn hình OLED 3K 120Hz.",
  },
  "laptops/rog-strix/rog-strix-scar-18-2026/spec": {
    title: "ROG Strix SCAR 18 (2026) - Thông số kỹ thuật | Laptop Gaming ROG VN",
    product: "scar18",
    description:
      "Thông số kỹ thuật chi tiết của ROG Strix SCAR 18 2026 với Intel Core Ultra 9 290HX Plus, NVIDIA GeForce RTX 5090 và màn hình 4K 240Hz Nebula HDR.",
  },
  "laptops/rog-strix/rog-strix-g18-2025/spec": {
    title: "ROG Strix G18 (2025) G815 - Thông số kỹ thuật | Laptop Gaming ROG VN",
    product: "scar18",
    description:
      "Thông số kỹ thuật chi tiết của ROG Strix G18 (2025) G815 với Intel Core Ultra 9, RTX 5080 và màn hình 2.5K 240Hz Nebula HDR.",
  },
  "gaming-handhelds/rog-ally/rog-ally-2023/spec": {
    title: "ROG Ally (2023) RC71L - Thông số kỹ thuật | Máy Chơi Game Cầm Tay ROG VN",
    product: "ally_2023",
    description:
      "Thông số kỹ thuật chi tiết của máy chơi game ROG Ally 2023 với AMD Ryzen Z1 Extreme, màn hình 120Hz Full HD và tản nhiệt Zero Gravity.",
  },
  "gaming-handhelds/rog-ally/rog-ally-x-2024/spec": {
    title: "ROG Ally X (2024) - Thông số kỹ thuật | Máy Chơi Game Cầm Tay ROG VN",
    product: "ally_x",
    description:
      "Thông số kỹ thuật chi tiết của ROG Ally X (2024) với AMD Ryzen Z1 Extreme, RAM 24GB LPDDR5X-7500, SSD 1TB và pin 80Wh.",
  },
  "monitors/32-to-34-inches/rog-swift-oled-pg34wcdn/spec": {
    title: "ROG Swift OLED PG34WCDN - Thông số kỹ thuật | Gaming Màn hình ROG VN",
    product: "pg34wcdn",
    description:
      "Thông số kỹ thuật chi tiết của màn hình ROG Swift OLED PG34WCDN 34-inch 360Hz QD-OLED.",
  },
  "phones/rog-phone-7/spec": {
    title: "ROG Phone 7 - Thông số kỹ thuật | Điện thoại ROG VN",
    product: "rog_phone_7",
    description:
      "Thông số kỹ thuật chi tiết của ROG Phone 7 với Snapdragon 8 Gen 2, 16GB RAM, 512GB UFS 4.0, pin 6000 mAh và màn hình 165Hz.",
  },
  "phones/rog-phone-8-pro/spec": {
    title: "ROG Phone 8 Pro - Thông số kỹ thuật | Điện Thoại Gaming ROG VN",
    product: "rog_phone_8_pro",
    description:
      "Thông số kỹ thuật chi tiết của ROG Phone 8 Pro với Snapdragon 8 Gen 3, AniMe Vision, 16GB RAM, 512GB ROM và camera Gimbal 50MP.",
  },
  "laptops/rog-strix/rog-strix-g16-2025/spec": {
    title: "ROG Strix G16 (2025) G614 - Thông số kỹ thuật | Laptop Gaming ROG VN",
    product: "strix_g16",
    description:
      "Thông số kỹ thuật chi tiết của ROG Strix G16 2025 với Intel Core i9 HX, RTX 5070 và màn hình 240Hz Nebula.",
  },
  "motherboards/rog-crosshair/rog-crosshair-x870e-hero/spec": {
    title: "ROG Crosshair X870E Hero - Thông số kỹ thuật | Bo Mạch Chủ ROG VN",
    product: "crosshair_x870e",
    description:
      "Thông số kỹ thuật chi tiết của bo mạch chủ ROG Crosshair X870E Hero AM5, PCIe 5.0, Wi-Fi 7 và USB4 40Gbps.",
  },
  "monitors/23-to-24-5-inches/rog-strix-xg259qnsr-ace/spec": {
    title:
      "ROG Strix XG259QNSR Ace - Thông số kỹ thuật | 23 đến 24.5 Inches | Gaming Màn hình｜ROG VN",
    product: "xg259qnsr_ace",
    description:
      "Thông số kỹ thuật chi tiết của màn hình ROG Strix XG259QNSR Ace 420Hz Fast IPS 0.3ms HDR400.",
  },
  "keyboards/keyboards/pbt-keycaps/rog-azoth-extreme-edition-20/spec": {
    title: "ROG Azoth Extreme Edition 20 - Thông số kỹ thuật | Bàn Phím Cơ Custom ROG VN",
    product: "azoth_extreme",
    description: "Thông số kỹ thuật chi tiết của bàn phím cơ ROG Azoth Extreme Edition 20 với màn hình OLED, tấm sợi carbon và switch ROG NX.",
  },
  "controllers/rog-raikiri/rog-raikiri-pro/spec": {
    title: "ROG Raikiri Pro - Thông số kỹ thuật | Tay Cầm Chơi Game ROG VN",
    product: "raikiri_pro",
    description: "Thông số kỹ thuật chi tiết của tay cầm chơi game ROG Raikiri Pro OLED, Tri-mode và DAC âm thanh ESS.",
  },
  "power-supply-units/rog-thor/rog-thor-1600t3-gaming/spec": {
    title: "ROG Thor 1600W Titanium III - Thông số kỹ thuật | Nguồn Máy Tính ROG VN",
    product: "thor_1600t3",
    description: "Thông số kỹ thuật chi tiết của nguồn ROG Thor 1600W Titanium III GaN, màn hình OLED và PCIe 5.0 12V-2x6.",
  },
  "networking/rog-rapture/rog-rapture-gt-be98-pro/spec": {
    title: "ROG Rapture GT-BE98 Pro - Thông số kỹ thuật | Router WiFi 7 ROG VN",
    product: "rapture_gt_be98_pro",
    description: "Thông số kỹ thuật chi tiết của router gaming ROG Rapture GT-BE98 Pro Quad-band WiFi 7 và cổng mạng 10G.",
  },
  "cases/rog-hyperion/rog-hyperion-gr701/spec": {
    title: "ROG Hyperion GR701 - Thông số kỹ thuật | Vỏ Case Gaming ROG VN",
    product: "hyperion_gr701",
    description: "Thông số kỹ thuật chi tiết của vỏ case ROG Hyperion GR701 khung nhôm X-Frame và tản nhiệt kép 420mm.",
  },
  "mice-mouse-pads/mice/wireless-mice/rog-harpe-ace-extreme/spec": {
    title: "ROG Harpe Ace Extreme - Thông số kỹ thuật | Chuột Gaming ROG VN",
    product: "harpe_ace_extreme",
    description: "Thông số kỹ thuật chi tiết của chuột gaming ROG Harpe Ace Extreme sợi carbon 47g và polling rate 8000Hz.",
  },
  "phones/rog-phone-9-pro/spec": {
    title: "ROG Phone 9 Pro - Thông số kỹ thuật | Điện Thoại Gaming ROG VN",
    product: "phone9_pro",
    description: "Thông số kỹ thuật chi tiết của điện thoại gaming ROG Phone 9 Pro Snapdragon 8 Elite, màn hình 185Hz và AniMe Vision.",
  },
  "graphics-cards/rog-matrix/rog-matrix-rtx5090-p32g-30th/spec": {
    title: "ROG Matrix Platinum GeForce RTX™ 5090 30th Anniversary - Thông số kỹ thuật | ROG VN",
    product: "matrix5090",
    description: "Thông số kỹ thuật chi tiết của card đồ họa ROG Matrix Platinum GeForce RTX™ 5090 30th Anniversary Edition 32GB GDDR7, tản nhiệt kim loại lỏng và 800W.",
  },
};

/* Dedicated Gallery pages (pathname → metadata) */
const GALLERY_PAGES: Record<
  string,
  { title: string; product: string; description: string }
> = {
  "laptops/rog-zephyrus/rog-zephyrus-g16-2025-gu605/gallery": {
    title: "ROG Zephyrus G16 (2025) GU605 - Thư viện ảnh | Laptop gaming AI｜ROG VN",
    product: "gu605",
    description:
      "Bộ sưu tập hình ảnh chi tiết mọi góc cạnh của laptop gaming ROG Zephyrus G16 (2025) GU605.",
  },
};

/* Laptop series shop-listing pages cloned locally */
const SERIES_PAGES: Record<string, { title: string; description: string; series: SeriesType }> = {
  "laptops/rog-flow-series": {
    title:
      "ROG Flow Laptop Gaming ASUS ROG | ROG Flow Series 2026 | Laptop Gaming",
    description:
      "Laptop gaming 2 trong 1 siêu di động ROG Flow Z13 với AMD Ryzen™ AI Max+ 395 — hiệu năng AAA trong thân máy 13 inch mỏng nhẹ nhất dòng ROG.",
    series: "flow",
  },
  "laptops/rog-zephyrus-series": {
    title:
      "ROG Zephyrus Laptop Gaming ASUS ROG | ASUS ROG Zephyrus - Laptop Gaming Mỏng Nhẹ Hàng Đầu Việt Nam",
    description:
      "Laptop gaming mỏng nhẹ cao cấp với vỏ nhôm CNC nguyên khối và màn hình ROG Nebula OLED. Zephyrus G14, G16 và Duo trang bị GPU NVIDIA® RTX™ 50 Series — hiệu năng đỉnh cao trong thân máy từ 1.5 kg.",
    series: "zephyrus",
  },
  "laptops/rog-strix-series": {
    title:
      "ROG Strix Laptop Gaming ASUS ROG | ASUS ROG Strix - Laptop Gaming Cấu Hình Khủng Cho Game Thủ Esports",
    description:
      "Laptop gaming mạnh nhất của ROG dành cho game thủ eSports và nhà sáng tạo chuyên nghiệp. ROG Strix G16, G18 và SCAR 18 với Intel® Core™ Ultra / RTX™ 5090, màn hình ROG Nebula HDR Mini LED 240Hz.",
    series: "strix",
  },
};

/* Category slugs from rog.asus.com/vn homepage product carousel */
const CATEGORY_LABELS: Record<string, string> = {
  "laptops-group": "Laptop Gaming ASUS ROG",
  "motherboards-group": "Bo mạch chủ",
  "graphics-cards-group": "Card Đồ họa",
  "monitors-group": "Màn hình",
  "phones-group": "Điện thoại & Thiết bị di động",
  phones: "Điện thoại & Thiết bị di động",
  smartphones: "Điện thoại & Thiết bị di động",
  "desktops-group": "Máy Bộ PC Gaming",
  "power-supply-units-group": "Nguồn máy tính",
  "external-graphics-docks-group": "Dock VGA gắn ngoài",
  "networking-group": "Thiết bị mạng",
  "keyboards-group": "Bàn phím",
  "mice-mouse-pads-group": "Chuột & Lót chuột",
  "headsets-audio-group": "Tai nghe & audio",
  "cases-group": "Cases",
  "apparel-bags-gear-group": "Apparel, Bags, & Gear",
  "streaming-kits-group": "Streaming Kits",
  "controllers-group": "Tay cầm",
  storage: "Ổ lưu trữ",
  "protection-and-gadgets-group": "Protection and Gadgets",
  "cooling-group": "Làm mát",
  "gaming-handhelds-group": "Gaming Handhelds",
  "rog-saga-group": "ROG SAGA",
  "docks-chargers-and-cables-group": "Docks, Chargers and Cables",
};

const LEGACY_ALIASES: string[] = [
  "gaming-handhelds",
  "gaming-handhelds/rog-ally-series",
  "gaming-handhelds/accessories-series",
  "keyboards-group/allmodels",
  "mice-mouse-pads-group/allmodels",
  "cooling-group/allmodels",
  "headsets-audio-group/allmodels",
  "apparel-bags-gear-group/allmodels",
  "docks-chargers-and-cables-group/allmodels",
  "protection-and-gadgets-group/allmodels",
  "storage-group/allmodels",
  "rog-saga-group/allmodels",
  "phones-group/allmodels",
  "cases-group/allmodels",
  "networking-group/allmodels",
  "controllers-group/allmodels",
  "streaming-kits-group/allmodels",
  "external-graphics-docks-group/allmodels",
  "storage/rog-strix-arion-model",
  "terms-of-notice/privacy_policy",
  "terms-of-notice/official_site",
];

const KNOWN_SLUGS = [
  ...Object.keys(CATEGORY_LABELS),
  ...Object.keys(PRODUCT_DETAILS),
  ...Object.keys(SPEC_PAGES),
  ...Object.keys(GALLERY_PAGES),
  ...Object.keys(SERIES_PAGES),
  ...LEGACY_ALIASES,
].map((s) => s.split("/"));

export function generateStaticParams() {
  return KNOWN_SLUGS.map((slug) => ({ slug }));
}

function groupKey(slug: string[]): string {
  return slug[0];
}

function categoryLabel(slug: string[]): string {
  return CATEGORY_LABELS[groupKey(slug)] ?? "Sản phẩm";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const key = slug.join("/");
  const gallery = GALLERY_PAGES[key];
  if (gallery) {
    return {
      title: gallery.title,
      description: gallery.description,
    };
  }
  const spec = SPEC_PAGES[key];
  if (spec) {
    return {
      title: spec.title,
      description: spec.description,
    };
  }
  const detail = PRODUCT_DETAILS[key];
  if (detail) {
    return {
      title: detail.title,
      description: detail.description,
    };
  }
  const series = SERIES_PAGES[key];
  if (series) {
    return {
      title: series.title,
      description: series.description,
    };
  }
  if (
    key === "gaming-handhelds" ||
    key === "gaming-handhelds/rog-ally-series" ||
    key === "gaming-handhelds/accessories-series" ||
    groupKey(slug) === "gaming-handhelds-group"
  ) {
    return {
      title: "Gaming Handhelds｜ROG - Republic of Gamers｜ROG Việt Nam",
      description:
        "Khám phá các sản phẩm Gaming Handhelds của ROG - Republic of Gamers Việt Nam.",
    };
  }
  if (key === "terms-of-notice/privacy_policy") {
    return {
      title: "Quy Chế Pháp Lý & Chính Sách Bảo Mật｜ROG - Republic of Gamers｜Việt Nam",
      description: "Quy chế pháp lý và chính sách bảo mật chính thức của ASUS ROG Việt Nam.",
    };
  }
  if (key === "terms-of-notice/official_site") {
    return {
      title: "Thông Tin Hợp Pháp & Điều Khoản Sử Dụng｜ROG - Republic of Gamers｜Việt Nam",
      description: "Thông tin hợp pháp và điều khoản sử dụng trang web chính thức của ASUS ROG Việt Nam.",
    };
  }
  if (slug.length > 1) {
    const cleanSlug = slug[slug.length - 1] === "spec" ? slug.slice(0, -1).join("/") : key;
    const product = await RogApi.getProductItem(cleanSlug);
    if (!product) return {};
    return {
      title: `${product.name}${slug[slug.length - 1] === "spec" ? " - Thông số kỹ thuật" : ""} | ROG - Republic of Gamers Việt Nam`,
      description: product.tagline || product.name,
    };
  }

  const label = categoryLabel(slug);
  return {
    title: `Gaming ${label}｜ROG - Republic of Gamers｜Việt Nam`,
    description: `Khám phá các sản phẩm Gaming ${label} của ROG - Republic of Gamers Việt Nam.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const key = slug.join("/");

  if (
    key === "gaming-handhelds" ||
    key === "gaming-handhelds/rog-ally-series"
  ) {
    redirect("/vn/gaming-handhelds-group");
  }

  // Canonical redirects for "Xem thêm" catalog hubs that use *-series on ASUS ROG VN
  if (key === "keyboards-group/allmodels") {
    redirect("/vn/keyboards/keyboards-series");
  }
  if (key === "mice-mouse-pads-group/allmodels") {
    redirect("/vn/mice-mouse-pads/mice-series");
  }
  if (key === "cooling-group/allmodels") {
    redirect("/vn/cooling/cpu-liquid-coolers-series");
  }
  if (key === "headsets-audio-group/allmodels") {
    redirect("/vn/headsets-audio/headsets-series");
  }
  if (key === "apparel-bags-gear-group/allmodels") {
    redirect("/vn/apparel-bags-gear/bags-series");
  }
  if (key === "docks-chargers-and-cables-group/allmodels") {
    redirect("/vn/docks-chargers-and-cables/chargers-series");
  }
  if (key === "protection-and-gadgets-group/allmodels") {
    redirect("/vn/protection-and-gadgets/cases-and-protection-series");
  }
  if (key === "storage-group/allmodels") {
    redirect("/vn/storage/rog-strix-arion-model");
  }
  if (key === "rog-saga-group/allmodels") {
    redirect("/vn/rog-saga/toys/rog-omni-figure-og");
  }

  if (key === "phones" || key === "smartphones") {
    redirect("/vn/phones-group");
  }

  if (key === "phones/allmodels" || key === "smartphones/allmodels") {
    redirect("/vn/phones-group/allmodels");
  }

  if (key === "terms-of-notice/privacy_policy") {
    redirect("/vn/terms-of-notice/privacy-policy");
  }

  if (key === "terms-of-notice/official_site") {
    redirect("/vn/terms-of-notice/official-site");
  }

  const isGallery = Boolean(GALLERY_PAGES[key]);
  const isSpec = Boolean(SPEC_PAGES[key]);
  const isDetail = Boolean(PRODUCT_DETAILS[key]);
  const isSeries = Boolean(SERIES_PAGES[key]);
  const group = groupKey(slug);
  const isCategory = Boolean(CATEGORY_LABELS[group]) && slug.length === 1;

  if (!isGallery && !isSpec && !isDetail && !isSeries && !isCategory) {
    return <RogUniversalProductOverview slug={slug} />;
  }

  return (
    <div className="rog-page">
      <RogNavbar />
      {/* Nguồn không hiển thị promo bar trên trang chi tiết/spec/gallery sản phẩm */}
      {!isDetail && !isSpec && !isGallery && <RogPromoBar />}
      <main>
        {isGallery ? (
          key === "laptops/rog-zephyrus/rog-zephyrus-g16-2025-gu605/gallery" ? (
            <RogZephyrusG16Gu605Gallery />
          ) : (
            notFound()
          )
        ) : isSpec ? (
          <RogProductDetail product={SPEC_PAGES[key].product} mode="spec" />
        ) : isDetail ? (
          key === "laptops/rog-zephyrus/rog-zephyrus-duo-2026" ? (
            <RogZephyrusDuo2026Overview />
          ) : key === "laptops/rog-flow/rog-flow-z13-kjp" ? (
            <RogFlowZ13KjpOverview />
          ) : key === "laptops/rog-zephyrus/rog-zephyrus-g16-2025-gu605" ? (
            <RogZephyrusG16Gu605Overview />
          ) : key === "laptops/rog-strix/rog-strix-scar-18-2026" ? (
            <RogScar18Overview
              productName="ROG Strix SCAR 18 (2026) G835"
              price="139.990.000 ₫"
              basePath="/vn/laptops/rog-strix/rog-strix-scar-18-2026"
            />
          ) : key === "laptops/rog-strix/rog-strix-g18-2025" ? (
            <RogScar18Overview
              productName="ROG Strix G18 (2025) G815"
              price="65.990.000 ₫"
              basePath="/vn/laptops/rog-strix/rog-strix-g18-2025"
            />
          ) : key === "graphics-cards/rog-matrix/rog-matrix-rtx5090-p32g-30th" ? (
            <RogCardMatrix5090Overview />
          ) : key === "phones/rog-phone-7" ? (
            <RogPhone7Overview
              productName="ROG Phone 7"
              price="24.990.000 ₫"
              basePath="/vn/phones/rog-phone-7"
            />
          ) : key === "monitors/23-to-24-5-inches/rog-strix-xg259qnsr-ace" ? (
            <RogXg259qnsrAceOverview
              productName="ROG Strix XG259QNSR Ace"
              price="14.990.000 ₫"
              basePath="/vn/monitors/23-to-24-5-inches/rog-strix-xg259qnsr-ace"
            />
          ) : key === "gaming-handhelds/rog-ally/rog-ally-2023" ? (
            <RogAlly2023Overview />
          ) : (
            <RogProductDetail product={PRODUCT_DETAILS[key].product} mode="overview" />
          )
        ) : isSeries ? (
          <RogSeriesPage series={SERIES_PAGES[key].series} />
        ) : (
          <RogProductHome group={group} />
        )}
      </main>
      <RogFooter />
      <RogChatWidget variant={isSeries || isDetail || isSpec || isGallery ? "greeting" : "search"} />
    </div>
  );
}
