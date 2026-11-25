import type { GalleryItem } from "./RogProductGallery";

export interface ProductGalleryConfig {
  productName: string;
  basePath: string;
  price: string;
  thumbImg: string;
  breadcrumb: { label: string; href: string }[];
  images: GalleryItem[];
}

export const PRODUCT_GALLERIES: Record<string, ProductGalleryConfig> = {
  "laptops/rog-strix/rog-strix-scar-18-2026/gallery": {
    productName: "ROG Strix SCAR 18 (2026) G835",
    basePath: "/vn/laptops/rog-strix/rog-strix-scar-18-2026",
    price: "139.990.000 ₫",
    thumbImg: "/sites/rog-asus/img/hot/strix-scar-18.webp",
    breadcrumb: [
      { label: "Laptop Gaming ASUS ROG", href: "/vn/laptops-group/" },
      { label: "ROG Strix", href: "/vn/laptops/rog-strix-series" },
    ],
    images: [
      {
        id: "s1",
        title: "ROG Strix SCAR 18 (2026) Trực diện mở máy",
        desc: "Màn hình 18-inch 4K 240Hz ROG Nebula HDR Mini LED độ sáng 1100 nits đỉnh cao.",
        category: "overview",
        src: "/sites/rog-asus/img/detail/scar18-kv.webp",
        tag: "Mặt trước 18\"",
      },
      {
        id: "s2",
        title: "Thiết kế hầm hố mặt lưng & Đèn LED RGB Armor Cap",
        desc: "Mặt A dập nổi logo ROG rực sáng Aura Sync và miếng ốp Armor Cap có thể tháo rời tùy biến.",
        category: "overview",
        src: "/sites/rog-asus/img/hot/strix-scar-18.webp",
        tag: "Armor Cap",
      },
      {
        id: "s3",
        title: "Tốc độ và màu sắc ấn tượng — Nebula HDR 4K 240Hz",
        desc: "Độ phủ màu 100% DCI-P3 chuẩn điện ảnh, thời gian phản hồi 3ms và hỗ trợ NVIDIA G-SYNC.",
        category: "details",
        src: "/sites/rog-asus/img/detail/story-toc-do.webp",
        tag: "Nebula HDR",
      },
      {
        id: "s4",
        title: "Bàn phím chuẩn Esports bề mặt IMR kết cấu nano",
        desc: "Hành trình phím 2.0mm, công nghệ Overstroke nhận phím sớm hơn và độ bền 20 triệu lần nhấn.",
        category: "details",
        src: "/sites/rog-asus/img/detail/story-keyboard.webp",
        tag: "Bàn phím Per-Key RGB",
      },
      {
        id: "s5",
        title: "Góc nghiêng 45 độ thân máy SCAR 18 Flagship",
        desc: "Dải đèn LED RGB U-Glow bao quanh đáy máy tạo vầng sáng huyền ảo trên mặt bàn thi đấu.",
        category: "overview",
        src: "/sites/rog-asus/img/hero/strix-scar-18.webp",
        tag: "U-Glow RGB",
      },
    ],
  },
  "laptops/rog-zephyrus/rog-zephyrus-duo-2026/gallery": {
    productName: "ROG Zephyrus Duo (2026) GX651",
    basePath: "/vn/laptops/rog-zephyrus/rog-zephyrus-duo-2026",
    price: "129.990.000 ₫",
    thumbImg: "/sites/rog-asus/img/hot/zephyrus-duo.webp",
    breadcrumb: [
      { label: "Laptop Gaming ASUS ROG", href: "/vn/laptops-group/" },
      { label: "ROG Zephyrus", href: "/vn/laptops/rog-zephyrus-series" },
    ],
    images: [
      {
        id: "d1",
        title: "ROG Zephyrus Duo (2026) Hai Màn Hình Đỉnh Cao",
        desc: "Màn hình kép cảm ứng OLED 3K kết hợp cơ chế nâng nghiêng màn hình phụ AAS+ 13 độ.",
        category: "overview",
        src: "/sites/rog-asus/img/hot/zephyrus-duo.webp",
        tag: "Màn hình kép",
      },
      {
        id: "d2",
        title: "Góc nhìn nghiêng tuyệt mỹ màn hình phụ ScreenPad Plus",
        desc: "Hỗ trợ đa nhiệm không giới hạn: hiển thị bản đồ game, chat stream hoặc timeline dựng phim 4K.",
        category: "details",
        src: "/sites/rog-asus/img/hero/zephyrus-duo.webp",
        tag: "ScreenPad Plus",
      },
      {
        id: "d3",
        title: "Vỏ nhôm CNC nguyên khối và logo ROG dập nổi",
        desc: "Độ hoàn thiện tinh xảo hàng đầu thế giới với mặt lưng cắt kim cương và khe thoát khí khí động học.",
        category: "overview",
        src: "/sites/rog-asus/img/articles/zephyrus-duo-2-man-hinh.webp",
        tag: "Vỏ nhôm CNC",
      },
    ],
  },
  "gaming-handhelds/rog-ally/rog-ally-2023/gallery": {
    productName: "ROG Ally (2023) RC71L",
    basePath: "/vn/gaming-handhelds/rog-ally/rog-ally-2023",
    price: "17.990.000 ₫",
    thumbImg: "/sites/rog-asus/rog-ally-2023/subbar-thumb.webp",
    breadcrumb: [
      { label: "Gaming Handhelds", href: "/vn/gaming-handhelds-group/" },
      { label: "ROG Ally", href: "/vn/gaming-handhelds-group/" },
    ],
    images: [
      {
        id: "a1",
        title: "Máy chơi game cầm tay ROG Ally (2023) trực diện",
        desc: "Màn hình cảm ứng 7 inch FHD 120Hz sRGB 100% độ sáng 500 nits kính cường lực Gorilla Glass Victus.",
        category: "overview",
        src: "/sites/rog-asus/img/articles/ally-armoury-crate-se.webp",
        tag: "Trực diện 7\"",
      },
      {
        id: "a2",
        title: "Cụm Joystick RGB và phím bấm công thái học",
        desc: "Cần xoay tương tự tay cầm console với vòng đèn LED RGB Aura Sync tùy biến và phím D-Pad 8 hướng.",
        category: "details",
        src: "/sites/rog-asus/rog-ally-2023/subbar-thumb.webp",
        tag: "Công thái học",
      },
      {
        id: "a3",
        title: "Mặt sau máy với khe thoát nhiệt Zero Gravity",
        desc: "Hệ thống tản nhiệt 2 quạt với ổ bi chất lỏng hoạt động ổn định ở bất kỳ tư thế cầm nắm nào.",
        category: "details",
        src: "/sites/rog-asus/img/hero/zephyrus-duo.webp",
        tag: "Tản nhiệt Zero Gravity",
      },
    ],
  },
  "laptops/rog-flow/rog-flow-z13-kjp/gallery": {
    productName: "ROG Flow Z13-KJP",
    basePath: "/vn/laptops/rog-flow/rog-flow-z13-kjp",
    price: "109.990.000 ₫",
    thumbImg: "/sites/rog-asus/img/detail/z13-kjp-front.webp",
    breadcrumb: [
      { label: "Laptop Gaming ASUS ROG", href: "/vn/laptops-group/" },
      { label: "ROG Flow", href: "/vn/laptops/rog-flow-series" },
    ],
    images: [
      {
        id: "z1",
        title: "Phiên bản hợp tác độc quyền KOJIMA PRODUCTIONS",
        desc: "Thiết kế lấy cảm hứng từ biểu tượng phi hành gia Ludens với các họa tiết công nghiệp tinh xảo.",
        category: "overview",
        src: "/sites/rog-asus/img/detail/z13-kjp-front.webp",
        tag: "Ludens Design",
      },
      {
        id: "z2",
        title: "Mặt lưng nhôm nguyên khối và chân đế Kickstand 170°",
        desc: "Cửa sổ kính nhìn vào bo mạch chủ tích hợp đèn nền Aura RGB độc đáo.",
        category: "details",
        src: "/sites/rog-asus/img/detail/z13-kjp-gallery2.webp",
        tag: "Chân đế 170°",
      },
      {
        id: "z3",
        title: "Màn hình ROG Nebula 13.4\" 2.5K 180Hz hỗ trợ bút Stylus",
        desc: "Cảm ứng đa điểm mượt mà, độ phủ màu 100% DCI-P3 và độ chuẩn màu Pantone Validated.",
        category: "overview",
        src: "/sites/rog-asus/img/detail/z13-kjp-gallery1.webp",
        tag: "Nebula 2.5K 180Hz",
      },
      {
        id: "z4",
        title: "Phụ kiện độc quyền: Case bảo vệ & Bàn phím KJP Edition",
        desc: "Túi đựng chuyên dụng bọc da cao cấp và bàn phím dập nổi dòng chữ For Ludens Who Dare.",
        category: "details",
        src: "/sites/rog-asus/img/detail/z13-kjp-gallery3.webp",
        tag: "Phụ kiện độc quyền",
      },
    ],
  },
  "monitors/32-to-34-inches/rog-swift-oled-pg34wcdn/gallery": {
    productName: "ROG Swift OLED PG34WCDN",
    basePath: "/vn/monitors/32-to-34-inches/rog-swift-oled-pg34wcdn",
    price: "36.990.000 ₫",
    thumbImg: "/sites/rog-asus/img/relprod/swift-oled-pg34wcdn.webp",
    breadcrumb: [
      { label: "Màn hình Gaming ROG", href: "/vn/monitors-group/" },
    ],
    images: [
      {
        id: "p1",
        title: "Màn hình cong 34 inch tỷ lệ 21:9 siêu rộng QD-OLED",
        desc: "Tần số quét đỉnh cao 360Hz thời gian phản hồi siêu tốc 0.03ms mang lại lợi thế chiến thắng.",
        category: "overview",
        src: "/sites/rog-asus/img/detail/pg34wcdn-kv.jpg",
        tag: "QD-OLED 360Hz",
      },
      {
        id: "p2",
        title: "Thiết kế viền siêu mỏng và logo ROG rực sáng",
        desc: "Màng chống chói BlackShield Film và công nghệ ASUS OLED Care Pro bảo vệ màn hình toàn diện.",
        category: "overview",
        src: "/sites/rog-asus/img/relprod/swift-oled-pg34wcdn.webp",
        tag: "BlackShield Film",
      },
    ],
  },
  "gaming-handhelds/rog-ally/rog-ally-x-2024/gallery": {
    productName: "ROG Ally X (2024) RC72LA",
    basePath: "/vn/gaming-handhelds/rog-ally/rog-ally-x-2024",
    price: "24.990.000 ₫",
    thumbImg: "/sites/rog-asus/img/articles/ally-armoury-crate-se.webp",
    breadcrumb: [
      { label: "Gaming Handhelds", href: "/vn/gaming-handhelds-group/" },
      { label: "ROG Ally", href: "/vn/gaming-handhelds-group/" },
    ],
    images: [
      {
        id: "ax1",
        title: "ROG Ally X (2024) Màu đen huyền bí nâng cấp tay cầm",
        desc: "Pin khủng 80Wh gấp đôi thời lượng, RAM 24GB LPDDR5X-7500 và SSD 1TB chuẩn 2280.",
        category: "overview",
        src: "/sites/rog-asus/img/handheld/hero-1.webp",
        tag: "Pin 80Wh",
      },
      {
        id: "ax2",
        title: "Cụm nút macro phía sau thu gọn chống bấm nhầm",
        desc: "Thiết kế phom cầm công thái học vát cạnh sâu hơn, bám chắc tay khi chơi game nhiều giờ.",
        category: "details",
        src: "/sites/rog-asus/img/handheld/big-1.webp",
        tag: "Công thái học",
      },
    ],
  },
  "laptops/rog-zephyrus/rog-zephyrus-g14-2025-ga403/gallery": {
    productName: "ROG Zephyrus G14 (2025) GA403",
    basePath: "/vn/laptops/rog-zephyrus/rog-zephyrus-g14-2025-ga403",
    price: "54.990.000 ₫",
    thumbImg: "/sites/rog-asus/img/series/zephyrus-ga403.webp",
    breadcrumb: [
      { label: "Laptop Gaming ASUS ROG", href: "/vn/laptops-group/" },
      { label: "ROG Zephyrus", href: "/vn/laptops/rog-zephyrus-series" },
    ],
    images: [
      {
        id: "g14-1",
        title: "Vỏ nhôm CNC nguyên khối với dải đèn Slash Lighting",
        desc: "Độ dày chỉ 1.59cm và trọng lượng siêu nhẹ 1.50kg mang theo khắp nơi.",
        category: "overview",
        src: "/sites/rog-asus/img/series/zephyrus-ga403.webp",
        tag: "1.50 Kg Mỏng Nhẹ",
      },
      {
        id: "g14-2",
        title: "Màn hình ROG Nebula OLED 3K 120Hz siêu sắc nét",
        desc: "Màu đen vô cực, chuẩn màu 100% DCI-P3 và độ tương phản 1.000.000:1.",
        category: "details",
        src: "/sites/rog-asus/img/hero/zephyrus-g14.webp",
        tag: "Nebula 3K OLED",
      },
    ],
  },
  "phones/rog-phone-7/gallery": {
    productName: "ROG Phone 7",
    basePath: "/vn/phones/rog-phone-7",
    price: "24.990.000 ₫",
    thumbImg: "/sites/rog-asus/img/detail/rog-phone-7-thumb.webp",
    breadcrumb: [
      { label: "Điện thoại ROG Phone", href: "/vn/phones-group/" },
    ],
    images: [
      {
        id: "p7-1",
        title: "ROG Phone 7 Gaming Phone Flagship",
        desc: "Snapdragon 8 Gen 2, tản nhiệt GameCool 7 và màn hình AMOLED 165Hz 1500 nits.",
        category: "overview",
        src: "/sites/rog-asus/img/detail/rog-phone-7-thumb.webp",
        tag: "165Hz AMOLED",
      },
      {
        id: "p7-2",
        title: "Nút siêu âm AirTrigger & Cổng sạc Type-C cạnh bên",
        desc: "Điều khiển thao tác như tay cầm console chuyên nghiệp, cắm sạc không vướng tay khi chơi.",
        category: "details",
        src: "/sites/rog-asus/img/products/dien-thoai.webp",
        tag: "AirTrigger",
      },
    ],
  },
  "monitors/23-to-24-5-inches/rog-strix-xg259qnsr-ace/gallery": {
    productName: "ROG Strix XG259QNSR Ace",
    basePath: "/vn/monitors/23-to-24-5-inches/rog-strix-xg259qnsr-ace",
    price: "14.990.000 ₫",
    thumbImg: "https://dlcdnwebimgs.asus.com/gain/B276CBB3-24EB-4015-B005-87C455818976/w717/h525/fwebp",
    breadcrumb: [
      { label: "Gaming Màn hình", href: "/vn/monitors-group/" },
    ],
    images: [
      {
        id: "xg1",
        title: "Màn hình Esports 420Hz Fast IPS 0.3ms",
        desc: "Tốc độ làm tươi siêu việt 420Hz (OC) cho các tựa game bắn súng FPS cạnh tranh đỉnh cao.",
        category: "overview",
        src: "https://dlcdnwebimgs.asus.com/gain/B276CBB3-24EB-4015-B005-87C455818976/w717/h525/fwebp",
        tag: "420Hz Esports",
      },
    ],
  },
  "graphics-cards/rog-matrix/rog-matrix-rtx5090-p32g-30th/gallery": {
    productName: "ROG Matrix Platinum GeForce RTX™ 5090 30th Anniversary",
    basePath: "/vn/graphics-cards/rog-matrix/rog-matrix-rtx5090-p32g-30th",
    price: "99.990.000 ₫",
    thumbImg: "/sites/rog-asus/matrix-5090/matrix-thumb.webp",
    breadcrumb: [
      { label: "Card Đồ họa ROG", href: "/vn/graphics-cards-group/" },
    ],
    images: [
      {
        id: "mx1",
        title: "Phiên bản kỷ niệm 30 năm card đồ họa ASUS ROG Matrix",
        desc: "Khung hợp kim nhôm nguyên khối, buồng hơi đồng kết hợp keo kim loại lỏng chịu tải 800W.",
        category: "overview",
        src: "/sites/rog-asus/matrix-5090/matrix-thumb.webp",
        tag: "30th Anniversary",
      },
    ],
  },
  "laptops/rog-strix/rog-strix-g16-2025/gallery": {
    productName: "ROG Strix G16 (2025) G614",
    basePath: "/vn/laptops/rog-strix/rog-strix-g16-2025",
    price: "84.990.000 ₫",
    thumbImg: "/sites/rog-asus/img/series/strix-g614.webp",
    breadcrumb: [
      { label: "Laptop Gaming ASUS ROG", href: "/vn/laptops-group/" },
      { label: "ROG Strix", href: "/vn/laptops/rog-strix-series" },
    ],
    images: [
      {
        id: "g16-1",
        title: "ROG Strix G16 (2025) Trực diện mở máy 16:10",
        desc: "Màn hình 16 inch 2.5K 240Hz ROG Nebula Display viền siêu mỏng tỉ lệ hiển thị lên tới 90%.",
        category: "overview",
        src: "/sites/rog-asus/img/series/strix-g614.webp",
        tag: "Mặt trước 16\"",
      },
      {
        id: "g16-2",
        title: "Bàn phím eSports Per-Key RGB & Phím nóng chuyên dụng",
        desc: "Hành trình phím 2.0mm sâu và đầm tay, cụm 5 phím nóng tiện lợi cùng công nghệ Aura Sync rực rỡ.",
        category: "details",
        src: "/sites/rog-asus/img/detail/story-keyboard.webp",
        tag: "Bàn phím Per-Key RGB",
      },
      {
        id: "g16-3",
        title: "Nebula Display 240Hz 3ms tốc độ thần tốc",
        desc: "Chuẩn màu 100% DCI-P3, độ sáng 500 nits và chứng nhận Pantone Validated cho cả gaming lẫn đồ họa.",
        category: "details",
        src: "/sites/rog-asus/img/detail/story-toc-do.webp",
        tag: "Nebula 240Hz",
      },
      {
        id: "g16-4",
        title: "Phong cách thiết kế Strix Esports và dải LED gầm máy",
        desc: "Họa tiết Pixel Art đặc trưng dòng ROG Strix cùng dải đèn LED RGB chiếu sáng gầm máy ấn tượng.",
        category: "overview",
        src: "/sites/rog-asus/img/series/hero-strix.webp",
        tag: "Strix Design",
      },
    ],
  },
  "laptops/rog-strix/rog-strix-g18-2025/gallery": {
    productName: "ROG Strix G18 (2025) G815",
    basePath: "/vn/laptops/rog-strix/rog-strix-g18-2025",
    price: "62.990.000 ₫",
    thumbImg: "/sites/rog-asus/img/series/strix-g815.webp",
    breadcrumb: [
      { label: "Laptop Gaming ASUS ROG", href: "/vn/laptops-group/" },
      { label: "ROG Strix", href: "/vn/laptops/rog-strix-series" },
    ],
    images: [
      {
        id: "g18-1",
        title: "ROG Strix G18 (2025) Màn hình khủng 18 inch mở rộng tầm nhìn",
        desc: "Không gian quan sát bao quát chiến trường với màn hình 18-inch 2.5K 240Hz ROG Nebula Display.",
        category: "overview",
        src: "/sites/rog-asus/img/series/strix-g815.webp",
        tag: "Màn hình 18\"",
      },
      {
        id: "g18-2",
        title: "Hệ thống tản nhiệt Tri-Fan và keo kim loại lỏng Conductonaut Extreme",
        desc: "3 quạt tản nhiệt kết hợp 7 ống đồng dẫn nhiệt giúp máy luôn mát mẻ kể cả trong các trận đấu kéo dài.",
        category: "details",
        src: "/sites/rog-asus/img/detail/story-toc-do.webp",
        tag: "Tri-Fan Cooling",
      },
      {
        id: "g18-3",
        title: "Bàn phím kích thước lớn tích hợp phím số Numpad tiện lợi",
        desc: "Công nghệ Overstroke nhận lệnh tức thì, bố cục phím rộng rãi tối ưu cho cả làm việc và chiến game.",
        category: "details",
        src: "/sites/rog-asus/img/detail/story-keyboard.webp",
        tag: "Full-Size Keyboard",
      },
    ],
  },
};
