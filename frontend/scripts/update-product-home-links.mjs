import fs from "fs";
import path from "path";

const targetFile = path.join(
  process.cwd(),
  "src",
  "components",
  "sites",
  "rog-asus",
  "RogProductHome.tsx"
);

let content = fs.readFileSync(targetFile, "utf8");

const REPLACEMENTS = [
  // keyboards-group
  {
    target: `        name: "ROG Falchion NX",\n        desc: "Bàn phím cơ chơi game không dây ROG Falchion NX 65% với 68 phím, đèn Aura Sync không dây, bảng điều khiển cảm ứng, ốp bảo vệ bàn phím, switch ROG NX và thời lượng pin lên đến 450 giờ.",\n        href: "/vn/keyboards-group/",`,
    replacement: `        name: "ROG Falchion NX",\n        desc: "Bàn phím cơ chơi game không dây ROG Falchion NX 65% với 68 phím, đèn Aura Sync không dây, bảng điều khiển cảm ứng, ốp bảo vệ bàn phím, switch ROG NX và thời lượng pin lên đến 450 giờ.",\n        href: "/vn/keyboards/keyboards/pbt-keycaps/rog-falchion-nx-model",`,
  },
  {
    target: `        name: "ROG Claymore II",\n        desc: "Bàn phím cơ chơi game ROG Claymore II tháo rời cụm phím số numpad, switch quang-cơ học ROG RX, kết nối kép có dây/2.4GHz RF, thời lượng pin 43 giờ, cổng USB passthrough.",\n        href: "/vn/keyboards-group/",`,
    replacement: `        name: "ROG Claymore II",\n        desc: "Bàn phím cơ chơi game ROG Claymore II tháo rời cụm phím số numpad, switch quang-cơ học ROG RX, kết nối kép có dây/2.4GHz RF, thời lượng pin 43 giờ, cổng USB passthrough.",\n        href: "/vn/keyboards/keyboards/aura-rgb/rog-claymore-ii-model",`,
  },
  {
    target: `        name: "ROG Strix Scope RX",\n        desc: "Bàn phím cơ chơi game ROG Strix Scope RX với switch quang-cơ học ROG RX, chống nước bụi IP57, cổng USB 2.0 passthrough, khung hợp kim nhôm và đèn Aura Sync RGB.",\n        href: "/vn/keyboards-group/",`,
    replacement: `        name: "ROG Strix Scope RX",\n        desc: "Bàn phím cơ chơi game ROG Strix Scope RX với switch quang-cơ học ROG RX, chống nước bụi IP57, cổng USB 2.0 passthrough, khung hợp kim nhôm và đèn Aura Sync RGB.",\n        href: "/vn/keyboards/keyboards/aura-rgb/rog-strix-scope-rx-model",`,
  },
  {
    target: `      { img: "/sites/rog-asus/img/kb/rel-1.webp", name: "ROG Gaming Keyboard", href: "/vn/keyboards-group/" },\n      { img: "/sites/rog-asus/img/kb/rel-2.webp", name: "ROG Gaming Keyboard", href: "/vn/keyboards-group/" },\n      { img: "/sites/rog-asus/img/kb/rel-3.webp", name: "ROG Gaming Keyboard", href: "/vn/keyboards-group/" },`,
    replacement: `      { img: "/sites/rog-asus/img/kb/rel-1.webp", name: "ROG Strix Scope NX Deluxe", href: "/vn/keyboards/keyboards/aura-rgb/rog-strix-scope-nx-deluxe-model" },\n      { img: "/sites/rog-asus/img/kb/rel-2.webp", name: "ROG Falchion Ace 75 HE", href: "/vn/keyboards/keyboards/pbt-keycaps/rog-falchion-ace-75-he" },\n      { img: "/sites/rog-asus/img/kb/rel-3.webp", name: "ROG Azoth Extreme Edition 20", href: "/vn/keyboards/keyboards/pbt-keycaps/rog-azoth-extreme-edition-20" },`,
  },

  // monitors-group
  {
    target: `        name: "ROG Strix OLED XG27AQWMG",\n        desc: "Màn hình gaming OLED 27 inch 1440p 280Hz, thời gian phản hồi 0.03ms, công nghệ tản nhiệt tùy chỉnh graphene và tính năng bảo vệ OLED Care.",\n        href: "/vn/monitors-group/",`,
    replacement: `        name: "ROG Strix OLED XG27AQWMG",\n        desc: "Màn hình gaming OLED 27 inch 1440p 280Hz, thời gian phản hồi 0.03ms, công nghệ tản nhiệt tùy chỉnh graphene và tính năng bảo vệ OLED Care.",\n        href: "/vn/monitors/27-to-31-5-inches/rog-strix-oled-xg27aqwmg",`,
  },
  {
    target: `      { img: "/sites/rog-asus/img/mon/hot-xg27aq.webp", name: "ROG Gaming Monitor", href: "/vn/monitors-group/" },`,
    replacement: `      { img: "/sites/rog-asus/img/mon/hot-xg27aq.webp", name: "ROG Strix XG258Q Gaming Monitor", href: "/vn/monitors/23-to-24-5-inches/rog-strix-xg258q-model" },`,
  },

  // motherboards-group
  {
    target: `      { img: "/sites/rog-asus/img/mb/hot-strix-x870e-miku.webp", name: "ROG STRIX X870E-H GAMING WIFI7 HATSUNE MIKU EDITION", desc: "", href: "/vn/motherboards-group/" },\n      { img: "/sites/rog-asus/img/mb/hot-strix-b860i.webp", name: "ROG STRIX B860-I GAMING WIFI", desc: "", href: "/vn/motherboards-group/" },\n      { img: "/sites/rog-asus/img/mb/hot-strix-b860g.webp", name: "ROG STRIX B860-G GAMING WIFI", desc: "", href: "/vn/motherboards-group/" },`,
    replacement: `      { img: "/sites/rog-asus/img/mb/hot-strix-x870e-miku.webp", name: "ROG STRIX X870E-H GAMING WIFI7 HATSUNE MIKU EDITION", desc: "Phiên bản hợp tác Hatsune Miku đặc biệt với Wi-Fi 7, thiết kế tản nhiệt độc bản và cổng USB4 40Gbps.", href: "/vn/motherboards/rog-strix/rog-strix-x870e-h-gaming-wifi7-hatsune-miku-edition" },\n      { img: "/sites/rog-asus/img/mb/hot-strix-b860i.webp", name: "ROG STRIX B860-I GAMING WIFI", desc: "Bo mạch chủ Mini-ITX Intel B860 với PCIe 5.0, Wi-Fi 7 và giải pháp tản nhiệt M.2 đa tầng cho máy SFF.", href: "/vn/motherboards/rog-strix/rog-strix-b860-i-gaming-wifi" },\n      { img: "/sites/rog-asus/img/mb/hot-strix-b860g.webp", name: "ROG STRIX B860-G GAMING WIFI", desc: "Bo mạch chủ Micro-ATX Intel B860 tông trắng bạc thanh lịch, cấp nguồn mạnh mẽ và hỗ trợ DDR5 ép xung.", href: "/vn/motherboards/rog-strix/rog-strix-b860-g-gaming-wifi" },`,
  },

  // graphics-cards-group
  {
    target: `      { img: "/sites/rog-asus/img/vga/hot-strix-5070.webp", name: "ROG Strix GeForce RTX™ 5070 12GB GDDR7 OC Edition", desc: "ROG Strix GeForce RTX™ 5070 OC Edition phiên bản ép xung 12GB GDDR7 với hệ thống tản nhiệt tiên tiến mang lại khả năng cấp nguồn cao cấp cho bạn.", href: "/vn/graphics-cards-group/" },\n      { img: "/sites/rog-asus/img/vga/hot-astral-5090-btf.webp", name: "ROG Astral GeForce RTX™ 5090 32GB GDDR7 BTF Edition", desc: "Card đồ họa ROG Astral GeForce RTX™ 5090 32GB GDDR7 BTF bốn quạt, với một bộ chuyển đổi GC-HPWR có thể tháo rời để tương thích với các bo mạch chủ tiêu chuẩn lẫn BTF.", href: "/vn/graphics-cards-group/" },`,
    replacement: `      { img: "/sites/rog-asus/img/vga/hot-strix-5070.webp", name: "ROG Strix GeForce RTX™ 5070 12GB GDDR7 OC Edition", desc: "ROG Strix GeForce RTX™ 5070 OC Edition phiên bản ép xung 12GB GDDR7 với hệ thống tản nhiệt tiên tiến mang lại khả năng cấp nguồn cao cấp cho bạn.", href: "/vn/graphics-cards/graphics-cards/rog-strix/rog-strix-rtx5070-o12g-gaming" },\n      { img: "/sites/rog-asus/img/vga/hot-astral-5090-btf.webp", name: "ROG Astral GeForce RTX™ 5090 32GB GDDR7 BTF Edition", desc: "Card đồ họa ROG Astral GeForce RTX™ 5090 32GB GDDR7 BTF bốn quạt, với một bộ chuyển đổi GC-HPWR có thể tháo rời để tương thích với các bo mạch chủ tiêu chuẩn lẫn BTF.", href: "/vn/graphics-cards/graphics-cards/rog-strix/rog-strix-rtx3090-o24g-gaming-model" },`,
  },
  {
    target: `      { img: "/sites/rog-asus/img/vga/hot-strix-5070ti.webp", name: "ROG Strix GeForce RTX™ 5070 Ti 16GB GDDR7 OC Edition", desc: "ROG Strix GeForce RTX™ 5070 Ti OC Edition 16GB GDDR7 với hệ thống tản nhiệt tiên tiến mang lại khả năng cấp nguồn cao cấp cho bạn.", href: "/vn/graphics-cards-group/" },`,
    replacement: `      { img: "/sites/rog-asus/img/vga/hot-strix-5070ti.webp", name: "ROG Strix GeForce RTX™ 5070 Ti 16GB GDDR7 OC Edition", desc: "ROG Strix GeForce RTX™ 5070 Ti OC Edition 16GB GDDR7 với hệ thống tản nhiệt tiên tiến mang lại khả năng cấp nguồn cao cấp cho bạn.", href: "/vn/graphics-cards/graphics-cards/rog-strix/rog-strix-rtx5070ti-o16g-gaming" },`,
  },

  // power-supply-units-group
  {
    target: `      { img: "/sites/rog-asus/img/psu/hot-thor-1200.webp", name: "ROG Thor 1200W Platinum III (ROG Equalizer)", desc: "", href: "/vn/power-supply-units-group/" },\n      { img: "/sites/rog-asus/img/psu/hot-thor-1200-white.webp", name: "ROG Thor 1200W Platinum III White Edition (ROG Equalizer)", desc: "", href: "/vn/power-supply-units-group/" },\n      { img: "/sites/rog-asus/img/psu/hot-thor-1600.webp", name: "ROG Thor 1600W Titanium III", desc: "Nguồn máy tính ROG Thor 1600W Titanium III với MOSFET GaN, màn hình OLED tháo rời nam châm, hỗ trợ 2 cổng PCIe 5.0 12V-2x6 cấp điện ổn định.", href: "/vn/power-supply-units/rog-thor/rog-thor-1600t3-gaming" },\n      { img: "/sites/rog-asus/img/psu/hot-thor-3000.webp", name: "ROG Thor 3000W Titanium III Edition 20 (ROG Equalizer)", desc: "", href: "/vn/power-supply-units-group/" },`,
    replacement: `      { img: "/sites/rog-asus/img/psu/hot-thor-1200.webp", name: "ROG Thor 1200W Platinum III (ROG Equalizer)", desc: "Nguồn máy tính ROG Thor 1200W Platinum III GaN MOSFETs với màn hình OLED nam châm hiển thị công suất.", href: "/vn/power-supply-units/rog-thor/rog-thor-1200p3-gaming-e" },\n      { img: "/sites/rog-asus/img/psu/hot-thor-1200-white.webp", name: "ROG Thor 1200W Platinum III White Edition (ROG Equalizer)", desc: "Phiên bản trắng All-White của nguồn ROG Thor 1200W Platinum III chuẩn ATX 3.1 và PCIe 5.0.", href: "/vn/power-supply-units/rog-thor/rog-thor-1200p3-white-gaming-e" },\n      { img: "/sites/rog-asus/img/psu/hot-thor-1600.webp", name: "ROG Thor 1600W Titanium III", desc: "Nguồn máy tính ROG Thor 1600W Titanium III với MOSFET GaN, màn hình OLED tháo rời nam châm, hỗ trợ 2 cổng PCIe 5.0 12V-2x6 cấp điện ổn định.", href: "/vn/power-supply-units/rog-thor/rog-thor-1600t3-gaming" },\n      { img: "/sites/rog-asus/img/psu/hot-thor-3000.webp", name: "ROG Thor 3000W Titanium III Edition 20 (ROG Equalizer)", desc: "Siêu nguồn quái vật 3000W chuẩn Titanium hiệu suất đỉnh cao cho hệ thống đa GPU AI và ép xung cực hạn.", href: "/vn/power-supply-units/rog-thor/ROG-THOR-3000T3-GAMING-EDITION-20" },`,
  },

  // headsets-audio-group
  {
    target: `      { img: "/sites/rog-asus/img/audio/hot-delta-ii-kjp.webp", name: "ROG Delta II-KJP Gaming Headset", desc: "", href: "/vn/headsets-audio-group/" },\n      { img: "/sites/rog-asus/img/audio/hot-pelta.webp", name: "ROG Pelta Gaming Headset", desc: "", href: "/vn/headsets-audio-group/" },\n      { img: "/sites/rog-asus/img/audio/hot-delta-ii.webp", name: "ROG Delta II", desc: "", href: "/vn/headsets-audio-group/" },`,
    replacement: `      { img: "/sites/rog-asus/img/audio/hot-delta-ii-kjp.webp", name: "ROG Delta II-KJP Gaming Headset", desc: "Tai nghe gaming không dây ROG Delta II phiên bản hợp tác KOJIMA PRODUCTIONS với màng loa mạ titan 50mm.", href: "/vn/headsets-audio/headsets/3-5mm-headsets/rog-delta-ii-kjp" },\n      { img: "/sites/rog-asus/img/audio/hot-pelta.webp", name: "ROG Pelta Gaming Headset", desc: "Tai nghe gaming siêu nhẹ ROG Pelta kết nối Tri-mode (Bluetooth, 2.4GHz không độ trễ ROG SpeedNova và USB-C).", href: "/vn/headsets-audio/headsets/wireless-headsets/rog-pelta" },\n      { img: "/sites/rog-asus/img/audio/hot-delta-ii.webp", name: "ROG Delta II", desc: "Tai nghe gaming ROG Delta II với công nghệ DualFlow Audio cho phép nghe đồng thời 2 nguồn phát 2.4GHz và Bluetooth.", href: "/vn/headsets-audio/headsets/wireless-headsets/rog-delta-ii" },`,
  },

  // mice-mouse-pads-group
  {
    target: `      { img: "/sites/rog-asus/img/mouse/hot-keris-ii-kjp.webp", name: "ROG Keris II Origin-KJP Gaming Mouse", desc: "", href: "/vn/mice-mouse-pads-group/" },\n      { img: "/sites/rog-asus/img/mouse/hot-harpe-ace.webp", name: "ROG Harpe II Ace Gaming Mouse", desc: "", href: "/vn/mice-mouse-pads-group/" },\n      { img: "/sites/rog-asus/img/mouse/hot-keris-ii.webp", name: "ROG Keris II Origin", desc: "", href: "/vn/mice-mouse-pads-group/" },`,
    replacement: `      { img: "/sites/rog-asus/img/mouse/hot-keris-ii-kjp.webp", name: "ROG Keris II Origin-KJP Gaming Mouse", desc: "Chuột gaming công thái học ROG Keris II Origin phiên bản hợp tác KOJIMA PRODUCTIONS siêu nhẹ 65g.", href: "/vn/mice-mouse-pads/mice/ergonomic-right-handed/rog-keris-ii-origin-kjp" },\n      { img: "/sites/rog-asus/img/mouse/hot-harpe-ace.webp", name: "ROG Harpe II Ace Gaming Mouse", desc: "Chuột gaming thi đấu eSports cảm biến ROG AimPoint Pro 42,000 DPI và công nghệ không dây ROG SpeedNova.", href: "/vn/mice-mouse-pads/mice/ambidextrous/rog-harpe-ace-extreme" },\n      { img: "/sites/rog-asus/img/mouse/hot-keris-ii.webp", name: "ROG Keris II Origin", desc: "Chuột gaming công thái học thuận tay phải 65g, switch quang học ROG 100M nhấp chuột và polling rate 8000Hz.", href: "/vn/mice-mouse-pads/mice/wireless/rog-keris-ii-origin" },`,
  },

  // cooling-group
  {
    target: `      { img: "/sites/rog-asus/img/cool/hot-rg-07.webp", name: "ROG RG-07 PERFORMANCE THERMAL PASTE", desc: "", href: "/vn/cooling-group/" },\n      { img: "/sites/rog-asus/img/cool/hot-ryujin-iii-wb.webp", name: "ROG RYUJIN III WB", desc: "", href: "/vn/cooling-group/" },\n      { img: "/sites/rog-asus/img/cool/hot-ryujin-iii-wb-white.webp", name: "ROG RYUJIN III WB White Edition", desc: "", href: "/vn/cooling-group/" },\n      { img: "/sites/rog-asus/img/cool/hot-strix-lc-iv.webp", name: "ROG Strix LC IV 360 ARGB LCD", desc: "", href: "/vn/cooling-group/" },`,
    replacement: `      { img: "/sites/rog-asus/img/cool/hot-rg-07.webp", name: "ROG RG-07 PERFORMANCE THERMAL PASTE", desc: "Keo tản nhiệt hiệu năng cao ROG RG-07 dẫn nhiệt vượt trội cho CPU/GPU kèm bộ công cụ bôi keo chuyên nghiệp.", href: "/vn/cooling/thermal-pastes/rog-rg-07-performance-thermal-paste" },\n      { img: "/sites/rog-asus/img/cool/hot-ryujin-iii-wb.webp", name: "ROG RYUJIN III WB", desc: "Khối block tản nhiệt nước custom ROG RYUJIN III WB tích hợp màn hình LCD 3.5 inch và bơm nước cao cấp.", href: "/vn/cooling/custom-cooling/ryujin/rog-ryujin-iii-wb" },\n      { img: "/sites/rog-asus/img/cool/hot-ryujin-iii-wb-white.webp", name: "ROG RYUJIN III WB White Edition", desc: "Phiên bản trắng All-White của block tản nước custom ROG RYUJIN III WB với màn hình LCD hiển thị thông số hệ thống.", href: "/vn/cooling/custom-cooling/ryujin/rog-ryujin-iii-wb-white-edition" },\n      { img: "/sites/rog-asus/img/cool/hot-strix-lc-iv.webp", name: "ROG Strix LC IV 360 ARGB LCD", desc: "Tản nhiệt nước AIO ROG Strix LC IV 360 với màn hình LCD sống động, quạt ARGB cánh tĩnh áp cao và bơm Asetek thế hệ mới.", href: "/vn/cooling/cpu-liquid-coolers/rog-strix-lc/rog-strix-lc-iv-360-argb-lcd" },`,
  },

  // gaming-handhelds-group
  {
    target: `        name: "ROG Gaming Charger Dock 65W",\n        desc: "Củ sạc công suất 65W kiêm cổng xuất HDMI 2.0 và USB 2.0 Type-A hỗ trợ sạc nhanh và xuất hình ảnh độ phân giải 4K 60Hz lên TV/màn hình lớn.",\n        href: "/vn/gaming-handhelds-group/",`,
    replacement: `        name: "ROG Gaming Charger Dock 65W",\n        desc: "Củ sạc công suất 65W kiêm cổng xuất HDMI 2.0 và USB 2.0 Type-A hỗ trợ sạc nhanh và xuất hình ảnh độ phân giải 4K 60Hz lên TV/màn hình lớn.",\n        href: "/vn/docks-chargers-and-cables/chargers/rog-gaming-charger-dock",`,
  },
  {
    target: `        name: "Bao đựng ROG Ally Travel Case",\n        desc: "Bao chống nước, đệm mút chống sốc chuẩn quân đội, khay gập dựng máy linh hoạt khi chơi game ở mọi nơi cùng khe cắm thẻ microSD tiện lợi.",\n        href: "/vn/gaming-handhelds-group/",`,
    replacement: `        name: "Bao đựng ROG Ally Travel Case",\n        desc: "Bao chống nước, đệm mút chống sốc chuẩn quân đội, khay gập dựng máy linh hoạt khi chơi game ở mọi nơi cùng khe cắm thẻ microSD tiện lợi.",\n        href: "/vn/gaming-handhelds/accessories/rog-ally-travel-case",`,
  },
  {
    target: `        title: "Phụ kiện Gaming Handhelds",\n        desc: "Bộ phụ kiện chuẩn eSports gồm sạc nhanh ROG Gaming Charger Dock 65W, bao chống sốc chuẩn quân đội Travel Case và dock đồ họa ngoài XG Mobile.",\n        href: "/vn/gaming-handhelds-group/",`,
    replacement: `        title: "Phụ kiện Gaming Handhelds",\n        desc: "Bộ phụ kiện chuẩn eSports gồm sạc nhanh ROG Gaming Charger Dock 65W, bao chống sốc chuẩn quân đội Travel Case và dock đồ họa ngoài XG Mobile.",\n        href: "/vn/gaming-handhelds/accessories/rog-ally-travel-case",`,
  },

  // phones-group
  {
    target: `        name: "Quạt tản nhiệt AeroActive Cooler X Pro",\n        desc: "Tích hợp sò lạnh nhiệt điện TEC lớn hơn 2.6 lần, tăng 29% hiệu quả làm mát, bổ sung 2 nút bấm vật lý và loa siêu trầm subwoofer âm thanh 2.1 sống động.",\n        href: "/vn/phones-group/allmodels",`,
    replacement: `        name: "Quạt tản nhiệt AeroActive Cooler X Pro",\n        desc: "Tích hợp sò lạnh nhiệt điện TEC lớn hơn 2.6 lần, tăng 29% hiệu quả làm mát, bổ sung 2 nút bấm vật lý và loa siêu trầm subwoofer âm thanh 2.1 sống động.",\n        href: "/vn/protection-and-gadgets/cooler/aeroactive-cooler-6-for-rog-phone-5-5s-series-model",`,
  },

  // desktops-group
  {
    target: `        name: "ROG Strix G22CH (2025)",\n        desc: "PC gaming kích thước nhỏ gọn 10L, trang bị Intel® Core™ i9-14900KF, NVIDIA® GeForce RTX™ 4070 Ti Super, tản nhiệt chất lỏng tùy chọn, thiết kế mở nắp không cần dụng cụ.",\n        href: "/vn/desktops-group/",`,
    replacement: `        name: "ROG Strix G22CH (2025)",\n        desc: "PC gaming kích thước nhỏ gọn 10L, trang bị Intel® Core™ i9-14900KF, NVIDIA® GeForce RTX™ 4070 Ti Super, tản nhiệt chất lỏng tùy chọn, thiết kế mở nắp không cần dụng cụ.",\n        href: "/vn/desktops/mini-pc/rog-nuc-2025",`,
  },
  {
    target: `        name: "ROG Strix G16CHR",\n        desc: "Thùng máy gaming mid-tower với Intel® Core™ Ultra 9, NVIDIA® GeForce RTX™ 5080, RAM 64GB DDR5, SSD 2TB NVMe PCIe 4.0, tay xách tiện lợi và quạt ARGB đồng bộ.",\n        href: "/vn/desktops-group/",`,
    replacement: `        name: "ROG Strix G16CHR",\n        desc: "Thùng máy gaming mid-tower với Intel® Core™ Ultra 9, NVIDIA® GeForce RTX™ 5080, RAM 64GB DDR5, SSD 2TB NVMe PCIe 4.0, tay xách tiện lợi và quạt ARGB đồng bộ.",\n        href: "/vn/desktops/mini-pc/rog-nuc-2025",`,
  },
  {
    target: `        name: "ROG Strix GT15 G15CF",\n        desc: "PC gaming eSports với thiết kế quai cầm tiện lợi, khe cắm tai nghe tích hợp, luồng khí đa vùng Multi-zone Flow tản nhiệt êm ái.",\n        href: "/vn/desktops-group/",`,
    replacement: `        name: "ROG Strix GT15 G15CF",\n        desc: "PC gaming eSports với thiết kế quai cầm tiện lợi, khe cắm tai nghe tích hợp, luồng khí đa vùng Multi-zone Flow tản nhiệt êm ái.",\n        href: "/vn/desktops/mini-pc/rog-nuc-2025",`,
  },
  {
    target: `        name: "ROG Hyperion Extreme Gaming PC",\n        desc: "Cỗ máy PC đỉnh cao lắp ráp trong thùng case ROG Hyperion GR701, bo mạch chủ ROG Maximus Z890 Extreme và card đồ họa ROG Strix RTX 5090 32GB.",\n        href: "/vn/desktops-group/",`,
    replacement: `        name: "ROG Hyperion Extreme Gaming PC",\n        desc: "Cỗ máy PC đỉnh cao lắp ráp trong thùng case ROG Hyperion GR701, bo mạch chủ ROG Maximus Z890 Extreme và card đồ họa ROG Strix RTX 5090 32GB.",\n        href: "/vn/desktops/mini-pc/rog-nuc-2025",`,
  },

  // cases-group
  {
    target: `        name: "ROG Hyperion GR701 BTF Edition",\n        desc: "Phiên bản thiết kế chuyên biệt cho hệ sinh thái BTF giấu dây hoàn toàn, mang lại không gian nội thất thùng máy sạch sẽ tuyệt đối.",\n        href: "/vn/cases-group/",`,
    replacement: `        name: "ROG Hyperion GR701 BTF Edition",\n        desc: "Phiên bản thiết kế chuyên biệt cho hệ sinh thái BTF giấu dây hoàn toàn, mang lại không gian nội thất thùng máy sạch sẽ tuyệt đối.",\n        href: "/vn/cases/rog-hyperion-gr701-btf-edition",`,
  },
  {
    target: `        name: "ROG Strix Helios RGB",\n        desc: "Vỏ case mid-tower với 3 mặt kính cường lực màu khói, khung nhôm phay xước, quai xách công thái học tải trọng 50kg và đèn Aura Sync RGB mặt trước.",\n        href: "/vn/cases-group/",`,
    replacement: `        name: "ROG Strix Helios RGB",\n        desc: "Vỏ case mid-tower với 3 mặt kính cường lực màu khói, khung nhôm phay xước, quai xách công thái học tải trọng 50kg và đèn Aura Sync RGB mặt trước.",\n        href: "/vn/cases/rog-strix-helios-ii",`,
  },
  {
    target: `        name: "ROG Strix Helios White Edition",\n        desc: "Phiên bản màu trắng bạc thanh lịch, phù hợp các cấu hình góc máy All-White tinh tế với 4 quạt 140mm đi kèm.",\n        href: "/vn/cases-group/",`,
    replacement: `        name: "ROG Strix Helios White Edition",\n        desc: "Phiên bản màu trắng bạc thanh lịch, phù hợp các cấu hình góc máy All-White tinh tế với 4 quạt 140mm đi kèm.",\n        href: "/vn/cases/rog-strix-helios-ii-white-edition",`,
  },

  // networking-group
  {
    target: `        name: "ROG Rapture GT-BE19000",\n        desc: "Router WiFi 7 3 băng tần hiệu năng cao, chip xử lý 4 nhân 2.6GHz, tính năng Smart AiMesh và cổng Gaming Port ưu tiên lưu lượng mạng.",\n        href: "/vn/networking-group/",`,
    replacement: `        name: "ROG Rapture GT-BE19000",\n        desc: "Router WiFi 7 3 băng tần hiệu năng cao, chip xử lý 4 nhân 2.6GHz, tính năng Smart AiMesh và cổng Gaming Port ưu tiên lưu lượng mạng.",\n        href: "/vn/networking/rog-strix-gs-be18000",`,
  },
  {
    target: `        name: "ROG Rapture GT6 (Hệ thống Mesh Gaming)",\n        desc: "Hệ thống WiFi Mesh chuyên biệt cho game thủ, vùng phủ sóng lên đến 540m², 9 ăng-ten ngầm định hướng thông minh, loại bỏ hoàn toàn điểm chết.",\n        href: "/vn/networking-group/",`,
    replacement: `        name: "ROG Rapture GT6 (Hệ thống Mesh Gaming)",\n        desc: "Hệ thống WiFi Mesh chuyên biệt cho game thủ, vùng phủ sóng lên đến 540m², 9 ăng-ten ngầm định hướng thông minh, loại bỏ hoàn toàn điểm chết.",\n        href: "/vn/networking/rog-rapture-gt6-model",`,
  },
  {
    target: `        name: "ROG Rapture GT-AX11000 Pro",\n        desc: "Router WiFi 6 ba băng tần 11000 Mbps, cổng mạng 10Gbps + 2.5Gbps, chế độ Mobile Game Mode giảm giật lag trên smartphone chỉ với 1 chạm.",\n        href: "/vn/networking-group/",`,
    replacement: `        name: "ROG Rapture GT-AX11000 Pro",\n        desc: "Router WiFi 6 ba băng tần 11000 Mbps, cổng mạng 10Gbps + 2.5Gbps, chế độ Mobile Game Mode giảm giật lag trên smartphone chỉ với 1 chạm.",\n        href: "/vn/networking/rog-rapture-gt-axe16000-model",`,
  },

  // external-graphics-docks-group
  {
    target: `        name: "ROG XG Mobile (2025) GC34",\n        desc: "Trang bị GPU NVIDIA® GeForce RTX™ 5090 Laptop TGP 175W, tích hợp cổng xuất hình HDMI 2.1, DisplayPort 2.1, cổng mạng LAN 2.5G và củ sạc 330W tích hợp.",\n        href: "/vn/external-graphics-docks-group/",`,
    replacement: `        name: "ROG XG Mobile (2025) GC34",\n        desc: "Trang bị GPU NVIDIA® GeForce RTX™ 5090 Laptop TGP 175W, tích hợp cổng xuất hình HDMI 2.1, DisplayPort 2.1, cổng mạng LAN 2.5G và củ sạc 330W tích hợp.",\n        href: "/vn/external-graphics-docks/rog-xg-mobile-2025",`,
  },
  {
    target: `        name: "ROG XG Mobile (2023) GC33",\n        desc: "Trang bị NVIDIA® GeForce RTX™ 4090 Laptop GPU 16GB GDDR6, hệ thống tản nhiệt buồng hơi Vapor Chamber, trọng lượng chỉ 1.3 kg cực kỳ nhỏ gọn.",\n        href: "/vn/external-graphics-docks-group/",`,
    replacement: `        name: "ROG XG Mobile (2023) GC33",\n        desc: "Trang bị NVIDIA® GeForce RTX™ 4090 Laptop GPU 16GB GDDR6, hệ thống tản nhiệt buồng hơi Vapor Chamber, trọng lượng chỉ 1.3 kg cực kỳ nhỏ gọn.",\n        href: "/vn/external-graphics-docks/rog-xg-mobile-2025",`,
  },
  {
    target: `        name: "ROG XG Mobile AMD Radeon RX 6850M XT",\n        desc: "Phiên bản trang bị đồ họa AMD RDNA 2, hỗ trợ xuất đa màn hình và hub kết nối USB 3.2 Gen 2 mở rộng.",\n        href: "/vn/external-graphics-docks-group/",`,
    replacement: `        name: "ROG XG Mobile AMD Radeon RX 6850M XT",\n        desc: "Phiên bản trang bị đồ họa AMD RDNA 2, hỗ trợ xuất đa màn hình và hub kết nối USB 3.2 Gen 2 mở rộng.",\n        href: "/vn/external-graphics-docks/rog-xg-mobile-2025",`,
  },
  {
    target: `        name: "Bộ chuyển đổi ROG XG Mobile Interface Cable",\n        desc: "Cáp kết nối chuẩn giao tiếp độc quyền PCIe Direct kết hợp USB-C 10Gbps truyền tải tín hiệu không độ trễ.",\n        href: "/vn/external-graphics-docks-group/",`,
    replacement: `        name: "Bộ chuyển đổi ROG XG Mobile Interface Cable",\n        desc: "Cáp kết nối chuẩn giao tiếp độc quyền PCIe Direct kết hợp USB-C 10Gbps truyền tải tín hiệu không độ trễ.",\n        href: "/vn/external-graphics-docks/rog-xg-mobile-2025",`,
  },

  // controllers-group
  {
    target: `        name: "ROG Raikiri",\n        desc: "Tay cầm có dây cho PC và Xbox Series X|S, 2 phím phụ sau lưng, cò bấm Trigger Stop 2 nấc hành trình tùy chỉnh, phần mềm Armoury Crate chuyên sâu.",\n        href: "/vn/controllers-group/",`,
    replacement: `        name: "ROG Raikiri",\n        desc: "Tay cầm có dây cho PC và Xbox Series X|S, 2 phím phụ sau lưng, cò bấm Trigger Stop 2 nấc hành trình tùy chỉnh, phần mềm Armoury Crate chuyên sâu.",\n        href: "/vn/controllers/rog-raikiri-model",`,
  },
  {
    target: `        name: "ROG Tessen Mobile Controller",\n        desc: "Tay cầm chơi game gập gọn cho smartphone Android, kết nối USB-C không độ trễ, phím cơ xúc giác nảy và đèn RGB Aura cá tính.",\n        href: "/vn/controllers-group/",`,
    replacement: `        name: "ROG Tessen Mobile Controller",\n        desc: "Tay cầm chơi game gập gọn cho smartphone Android, kết nối USB-C không độ trễ, phím cơ xúc giác nảy và đèn RGB Aura cá tính.",\n        href: "/vn/controllers/rog-tessen-mobile-controller",`,
  },
  {
    target: `        name: "Đế sạc nam châm ROG Controller Charging Stand",\n        desc: "Đế sạc từ tính thông minh giữ tay cầm luôn đầy pin và hiển thị trạng thái sạc đẹp mắt trên bàn làm việc.",\n        href: "/vn/controllers-group/",`,
    replacement: `        name: "Đế sạc nam châm ROG Controller Charging Stand",\n        desc: "Đế sạc từ tính thông minh giữ tay cầm luôn đầy pin và hiển thị trạng thái sạc đẹp mắt trên bàn làm việc.",\n        href: "/vn/controllers/rog-raikiri-ii-xbox-wireless-controller",`,
  },

  // storage
  {
    target: `        name: "ROG Strix Arion S500",\n        desc: "Ổ cứng SSD gắn ngoài 500GB NVMe PCIe chuẩn USB 3.2 Gen 2x1 tốc độ 1050 MB/s, mã hóa dữ liệu 256-bit AES, vỏ kim loại bảo vệ tản nhiệt tối ưu.",\n        href: "/vn/storage/",`,
    replacement: `        name: "ROG Strix Arion S500",\n        desc: "Ổ cứng SSD gắn ngoài 500GB NVMe PCIe chuẩn USB 3.2 Gen 2x1 tốc độ 1050 MB/s, mã hóa dữ liệu 256-bit AES, vỏ kim loại bảo vệ tản nhiệt tối ưu.",\n        href: "/vn/storage/rog-strix-arion-model",`,
  },
  {
    target: `        name: "ROG Strix Arion (ESD-S1C)",\n        desc: "Box đựng ổ cứng M.2 NVMe SSD hỗ trợ kích thước 2230/2242/2260/2280, cơ chế mở chốt gạt không cần tua-vít, móc treo chữ R tiện lợi.",\n        href: "/vn/storage/",`,
    replacement: `        name: "ROG Strix Arion (ESD-S1C)",\n        desc: "Box đựng ổ cứng M.2 NVMe SSD hỗ trợ kích thước 2230/2242/2260/2280, cơ chế mở chốt gạt không cần tua-vít, móc treo chữ R tiện lợi.",\n        href: "/vn/storage/rog-strix-arion-model",`,
  },
  {
    target: `        name: "ROG Strix Arion EVA Edition",\n        desc: "Phiên bản giới hạn Evangelion hợp tác chính thức, màu sắc đặc trưng của robot EVA-01, đèn Aura RGB đồng bộ độc đáo.",\n        href: "/vn/storage/",`,
    replacement: `        name: "ROG Strix Arion EVA Edition",\n        desc: "Phiên bản giới hạn Evangelion hợp tác chính thức, màu sắc đặc trưng của robot EVA-01, đèn Aura RGB đồng bộ độc đáo.",\n        href: "/vn/storage/rog-strix-arion-eva-edition-model",`,
  },
  {
    target: `        name: "Móc treo ROG Arion Protective Bumper",\n        desc: "Ốp lưng silicon dẻo bảo vệ chống sốc toàn diện và móc khóa R-hook kim loại mang theo balo dễ dàng.",\n        href: "/vn/storage/",`,
    replacement: `        name: "Móc treo ROG Arion Protective Bumper",\n        desc: "Ốp lưng silicon dẻo bảo vệ chống sốc toàn diện và móc khóa R-hook kim loại mang theo balo dễ dàng.",\n        href: "/vn/storage/rog-strix-arion-hatsune-miku-edition",`,
  },

  // apparel-bags-gear-group
  {
    target: `        name: "Balo ROG Archer Backpack 15.6 / 17",\n        desc: "Chất liệu vải Cordura 610D chống rách và chống nước, khóa kéo YKK bền bỉ, 3 ngăn đa năng chứa laptop 17 inch và máy ảnh chuyên nghiệp.",\n        href: "/vn/apparel-bags-gear-group/",`,
    replacement: `        name: "Balo ROG Archer Backpack 15.6 / 17",\n        desc: "Chất liệu vải Cordura 610D chống rách và chống nước, khóa kéo YKK bền bỉ, 3 ngăn đa năng chứa laptop 17 inch và máy ảnh chuyên nghiệp.",\n        href: "/vn/apparel-bags-gear/bags/rog-archer-backpack-15-6-model",`,
  },
  {
    target: `        name: "Balo ROG Ranger BP2701 Gaming",\n        desc: "Thể tích chứa 22 lít, lớp đệm lưng êm ái thoáng khí, phản quang phản chiếu ban đêm phong cách stealth đậm chất ROG.",\n        href: "/vn/apparel-bags-gear-group/",`,
    replacement: `        name: "Balo ROG Ranger BP2701 Gaming",\n        desc: "Thể tích chứa 22 lít, lớp đệm lưng êm ái thoáng khí, phản quang phản chiếu ban đêm phong cách stealth đậm chất ROG.",\n        href: "/vn/apparel-bags-gear/bags/rog-ranger-bp2701-gaming-backpack-model",`,
  },
  {
    target: `        name: "Túi đeo chéo ROG Slash Sling Bag",\n        desc: "Thiết kế dây đai phong cách cyberpunk độc đáo, chống thấm nước IPX4, ngăn chống trầy chứa máy tính bảng hoặc Nintendo Switch / ROG Ally.",\n        href: "/vn/apparel-bags-gear-group/",`,
    replacement: `        name: "Túi đeo chéo ROG Slash Sling Bag",\n        desc: "Thiết kế dây đai phong cách cyberpunk độc đáo, chống thấm nước IPX4, ngăn chống trầy chứa máy tính bảng hoặc Nintendo Switch / ROG Ally.",\n        href: "/vn/apparel-bags-gear/rog-slash/rog-slash-bag/rog-slash-sling-bag-4-0",`,
  },
  {
    target: `        name: "Ghế gaming ROG Chariot Core",\n        desc: "Khung thép chịu lực, đệm mút đúc mật độ cao, da PU cao cấp thoáng khí, tay vịn 4D điều chỉnh linh hoạt và ngả lưng 145 độ.",\n        href: "/vn/apparel-bags-gear-group/",`,
    replacement: `        name: "Ghế gaming ROG Chariot Core",\n        desc: "Khung thép chịu lực, đệm mút đúc mật độ cao, da PU cao cấp thoáng khí, tay vịn 4D điều chỉnh linh hoạt và ngả lưng 145 độ.",\n        href: "/vn/apparel-bags-gear/gear/rog-chariot-core-gaming-chair-model",`,
  },

  // streaming-kits-group
  {
    target: `        name: "Microphone ROG Carnyx",\n        desc: "Micro condenser màng thu lớn 25mm chuẩn phòng thu 192kHz/24-bit, màng lọc pop kim loại tích hợp, giá chống rung shock mount cao cấp và nút tắt mic 1 chạm.",\n        href: "/vn/streaming-kits-group/",`,
    replacement: `        name: "Microphone ROG Carnyx",\n        desc: "Micro condenser màng thu lớn 25mm chuẩn phòng thu 192kHz/24-bit, màng lọc pop kim loại tích hợp, giá chống rung shock mount cao cấp và nút tắt mic 1 chạm.",\n        href: "/vn/streaming-kits/rog-carnyx",`,
  },
  {
    target: `        name: "Webcam ROG Eye S",\n        desc: "Độ phân giải Full HD 1080p ở tốc độ 60fps mượt mà, micro kép khử ồn bằng AI thông minh, thiết kế gập siêu mỏng chỉ 17mm.",\n        href: "/vn/streaming-kits-group/",`,
    replacement: `        name: "Webcam ROG Eye S",\n        desc: "Độ phân giải Full HD 1080p ở tốc độ 60fps mượt mà, micro kép khử ồn bằng AI thông minh, thiết kế gập siêu mỏng chỉ 17mm.",\n        href: "/vn/streaming-kits/rog-eye-s-model",`,
  },
  {
    target: `        name: "Bộ chuyển đổi âm thanh ROG Clavis",\n        desc: "USB DAC di động trang bị chip ESS 9281 QUAD DAC™ với công nghệ render MQA, công nghệ AI Noise-Canceling Microphone độc quyền.",\n        href: "/vn/streaming-kits-group/",`,
    replacement: `        name: "Bộ chuyển đổi âm thanh ROG Clavis",\n        desc: "USB DAC di động trang bị chip ESS 9281 QUAD DAC™ với công nghệ render MQA, công nghệ AI Noise-Canceling Microphone độc quyền.",\n        href: "/vn/streaming-kits/rog-eye-model",`,
  },
  {
    target: `        name: "Đèn trợ sáng ROG Aura Light Bar",\n        desc: "Đèn chiếu sáng chuyên dụng cho góc livestream, ánh sáng dịu mắt chống mỏi, điều khiển nhiệt độ màu và độ sáng không dây.",\n        href: "/vn/streaming-kits-group/",`,
    replacement: `        name: "Đèn trợ sáng ROG Aura Light Bar",\n        desc: "Đèn chiếu sáng chuyên dụng cho góc livestream, ánh sáng dịu mắt chống mỏi, điều khiển nhiệt độ màu và độ sáng không dây.",\n        href: "/vn/streaming-kits/rog-carnyx",`,
  },

  // protection-and-gadgets-group
  {
    target: `        name: "Bao đựng chống sốc ROG Ally Hard Case",\n        desc: "Vỏ cứng EVA chống va đập, lớp nỉ lót bên trong bảo vệ màn hình không trầy xước, ngăn lưới phụ đựng thẻ nhớ microSD và tai nghe.",\n        href: "/vn/protection-and-gadgets-group/",`,
    replacement: `        name: "Bao đựng chống sốc ROG Ally Hard Case",\n        desc: "Vỏ cứng EVA chống va đập, lớp nỉ lót bên trong bảo vệ màn hình không trầy xước, ngăn lưới phụ đựng thẻ nhớ microSD và tai nghe.",\n        href: "/vn/gaming-handhelds/accessories/rog-ally-travel-case",`,
  },
  {
    target: `        name: "Ốp lưng ROG Phone 9 Devilcase Guardian",\n        desc: "Hợp tác thương hiệu Devilcase với khung viền nhôm phay, mặt lưng trong suốt chống ố vàng và hỗ trợ tản nhiệt AeroActive Cooler hoàn hảo.",\n        href: "/vn/protection-and-gadgets-group/",`,
    replacement: `        name: "Ốp lưng ROG Phone 9 Devilcase Guardian",\n        desc: "Hợp tác thương hiệu Devilcase với khung viền nhôm phay, mặt lưng trong suốt chống ố vàng và hỗ trợ tản nhiệt AeroActive Cooler hoàn hảo.",\n        href: "/vn/protection-and-gadgets/cases-and-protection/rog-phone-6-devilcase-guardian-lite-plus-model",`,
  },
  {
    target: `        name: "Miếng dán cường lực chống lóa ROG Ally Screen Protector",\n        desc: "Độ cứng 9H chống trầy xước, lớp phủ chống chói và chống bám vân tay, giữ trọn độ nhạy cảm ứng 120Hz.",\n        href: "/vn/protection-and-gadgets-group/",`,
    replacement: `        name: "Miếng dán cường lực chống lóa ROG Ally Screen Protector",\n        desc: "Độ cứng 9H chống trầy xước, lớp phủ chống chói và chống bám vân tay, giữ trọn độ nhạy cảm ứng 120Hz.",\n        href: "/vn/protection-and-gadgets/cases-and-protection/rog-phone-6-glass-screen-protector-model",`,
  },
  {
    target: `        name: "Kẹp giữ điện thoại ROG Clip Gaming Phone Holder",\n        desc: "Gắn ROG Phone trực tiếp lên tay cầm Xbox hoặc ROG Raikiri, góc nghiêng tùy chỉnh công thái học không mỏi cổ tay.",\n        href: "/vn/protection-and-gadgets-group/",`,
    replacement: `        name: "Kẹp giữ điện thoại ROG Clip Gaming Phone Holder",\n        desc: "Gắn ROG Phone trực tiếp lên tay cầm Xbox hoặc ROG Raikiri, góc nghiêng tùy chỉnh công thái học không mỏi cổ tay.",\n        href: "/vn/protection-and-gadgets/cooler/aeroactive-cooler-6-for-rog-phone-5-5s-series-model",`,
  },

  // docks-chargers-and-cables-group
  {
    target: `        name: "Củ sạc ROG 140W GaN Charger",\n        desc: "Công nghệ bán dẫn GaN nhỏ hơn 30%, 3 cổng USB-C và 1 cổng USB-A, sạc cùng lúc laptop gaming ROG Zephyrus, điện thoại và máy chơi game.",\n        href: "/vn/docks-chargers-and-cables-group/",`,
    replacement: `        name: "Củ sạc ROG 140W GaN Charger",\n        desc: "Công nghệ bán dẫn GaN nhỏ hơn 30%, 3 cổng USB-C và 1 cổng USB-A, sạc cùng lúc laptop gaming ROG Zephyrus, điện thoại và máy chơi game.",\n        href: "/vn/docks-chargers-and-cables/chargers/rog-140w-usb-c-gan-charger",`,
  },
  {
    target: `        name: "Dock sạc kiêm cổng xuất hình ROG Gaming Charger Dock 65W",\n        desc: "Vừa sạc nhanh 65W vừa xuất tín hiệu hình ảnh HDMI 2.0 4K 60Hz ra màn hình ngoài cho ROG Ally và laptop mỏng nhẹ.",\n        href: "/vn/docks-chargers-and-cables-group/",`,
    replacement: `        name: "Dock sạc kiêm cổng xuất hình ROG Gaming Charger Dock 65W",\n        desc: "Vừa sạc nhanh 65W vừa xuất tín hiệu hình ảnh HDMI 2.0 4K 60Hz ra màn hình ngoài cho ROG Ally và laptop mỏng nhẹ.",\n        href: "/vn/docks-chargers-and-cables/chargers/rog-gaming-charger-dock",`,
  },
  {
    target: `        name: "Cáp nối dài card đồ họa ROG Strix Riser Cable",\n        desc: "Chuẩn PCI-E 4.0 x16 tốc độ cao, tấm chắn EMI bảo vệ chống nhiễu tín hiệu, bọc dây linh hoạt lắp dựng VGA theo chiều dọc.",\n        href: "/vn/docks-chargers-and-cables-group/",`,
    replacement: `        name: "Cáp nối dài card đồ họa ROG Strix Riser Cable",\n        desc: "Chuẩn PCI-E 4.0 x16 tốc độ cao, tấm chắn EMI bảo vệ chống nhiễu tín hiệu, bọc dây linh hoạt lắp dựng VGA theo chiều dọc.",\n        href: "/vn/cases/rog-strix-riser-cable-model",`,
  },
  {
    target: `        name: "Cáp sạc bọc dù ROG Tangle-free USB-C to USB-C 100W",\n        desc: "Lõi đồng nguyên chất dẫn điện tối ưu, vỏ bọc sợi dù Kevlar siêu bền uốn gập hơn 10.000 lần không gãy.",\n        href: "/vn/docks-chargers-and-cables-group/",`,
    replacement: `        name: "Cáp sạc bọc dù ROG Tangle-free USB-C to USB-C 100W",\n        desc: "Lõi đồng nguyên chất dẫn điện tối ưu, vỏ bọc sợi dù Kevlar siêu bền uốn gập hơn 10.000 lần không gãy.",\n        href: "/vn/docks-chargers-and-cables/chargers/rog-100w-gaming-charger-dock",`,
  },

  // rog-saga-group
  {
    target: `        name: "Mô hình nghệ thuật sưu tầm OMNI & Seer Art Toy",\n        desc: "Tượng nhân vật biểu tượng của ROG SAGA được chế tác tinh xảo với các chi tiết giáp Cyberpunk và phụ kiện ánh sáng RGB độc bản.",\n        href: "/vn/rog-saga-group/",`,
    replacement: `        name: "Mô hình nghệ thuật sưu tầm OMNI & Seer Art Toy",\n        desc: "Tượng nhân vật biểu tượng của ROG SAGA được chế tác tinh xảo với các chi tiết giáp Cyberpunk và phụ kiện ánh sáng RGB độc bản.",\n        href: "/vn/rog-saga/toys/rog-omni-figure-og",`,
  },
  {
    target: `        name: "Bộ sưu tập truyện tranh ROG SAGA Anthology Comic Book",\n        desc: "Tập hợp các chương truyện tranh về nguồn gốc thành phố Neo-City và hành trình thức tỉnh sức mạnh công nghệ ROG.",\n        href: "/vn/rog-saga-group/",`,
    replacement: `        name: "Bộ sưu tập truyện tranh ROG SAGA Anthology Comic Book",\n        desc: "Tập hợp các chương truyện tranh về nguồn gốc thành phố Neo-City và hành trình thức tỉnh sức mạnh công nghệ ROG.",\n        href: "/vn/rog-saga/toys/rog-omni-figure-white",`,
  },
  {
    target: `        name: "Gói hình nền kỹ thuật số ROG SAGA 4K Ultra-HD Wallpapers",\n        desc: "Hơn 50 bức tranh nền kỹ thuật số độ phân giải cao cho PC và smartphone với hiệu ứng chuyển động sống động.",\n        href: "/vn/rog-saga-group/",`,
    replacement: `        name: "Gói hình nền kỹ thuật số ROG SAGA 4K Ultra-HD Wallpapers",\n        desc: "Hơn 50 bức tranh nền kỹ thuật số độ phân giải cao cho PC và smartphone với hiệu ứng chuyển động sống động.",\n        href: "/vn/rog-saga/toys/rog-omni-figure-og",`,
  },
  {
    target: `        name: "Bộ huy hiệu & Phụ kiện sưu tầm ROG SAGA Exclusive Merch",\n        desc: "Huy hiệu kim loại tráng men, dây đeo thẻ phản quang và thẻ thành viên kim loại giới hạn cho fan chân chính.",\n        href: "/vn/rog-saga-group/",`,
    replacement: `        name: "Bộ huy hiệu & Phụ kiện sưu tầm ROG SAGA Exclusive Merch",\n        desc: "Huy hiệu kim loại tráng men, dây đeo thẻ phản quang và thẻ thành viên kim loại giới hạn cho fan chân chính.",\n        href: "/vn/rog-saga/toys/rog-omni-figure-white",`,
  },
];

let replacedCount = 0;
for (const rep of REPLACEMENTS) {
  if (content.includes(rep.target)) {
    content = content.replace(rep.target, rep.replacement);
    replacedCount++;
  } else {
    console.warn("Could not find exact target:", rep.target.slice(0, 40) + "...");
  }
}

fs.writeFileSync(targetFile, content);
console.log(`Successfully replaced ${replacedCount}/${REPLACEMENTS.length} link blocks!`);

