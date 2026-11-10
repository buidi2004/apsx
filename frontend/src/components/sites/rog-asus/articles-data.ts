export type ArticleData = {
  slug: string;
  category: string;
  categoryLabel: string;
  title: string;
  date: string;
  readTime: string;
  image: string;
  lead: string;
  sections: {
    heading?: string;
    subheading?: string;
    paragraphs: string[];
    callout?: string;
    bullets?: string[];
  }[];
};

export const ARTICLES_DATABASE: Record<string, ArticleData> = {
  "gaming/thong-tin-gta-6-moi-cau-hinh-yeu-cau": {
    slug: "gaming/thong-tin-gta-6-moi-cau-hinh-yeu-cau",
    category: "gaming",
    categoryLabel: "// GAMING",
    title: "TỔNG HỢP THÔNG TIN GTA 6: GTA 6 RA MẮT KHI NÀO, CẤU HÌNH YÊU CẦU RA SAO?",
    date: "30 Tháng 6, 2026",
    readTime: "6 phút đọc",
    image: "/sites/rog-asus/img/articles/gta6.webp",
    lead: "Grand Theft Auto VI (GTA 6) là tựa game thế giới mở được mong đợi nhất trong lịch sử ngành công nghiệp game. Dưới đây là toàn bộ thông tin đã được Rockstar Games xác nhận về ngày ra mắt, bối cảnh thành phố Vice City, nhân vật chính và yêu cầu cấu hình phần cứng laptop gaming để trải nghiệm mượt mà nhất.",
    sections: [
      {
        heading: "1. GTA 6 khi nào ra mắt?",
        paragraphs: [
          "Rockstar Games đã chính thức xác nhận GTA 6 sẽ phát hành vào mùa thu năm 2026 trên các hệ máy console thế hệ mới, sau đó phiên bản PC sẽ chính thức cập bến. Đây là bước đi quen thuộc của Rockstar nhằm tối ưu hóa đồ họa ở mức cao nhất trước khi đưa tựa game lên máy tính.",
          "Bối cảnh lần này đưa người chơi trở lại thành phố Vice City ngập tràn ánh đèn neon cùng toàn bộ bang Leonida hư cấu, với quy mô bản đồ rộng lớn gấp 2.5 lần so với bản đồ Los Santos trong GTA V.",
        ],
        callout: "GTA 6 sở hữu hệ thống vật lý nước, AI người đi bộ và ánh sáng Ray Tracing thời gian thực vượt trội hơn bất kỳ tựa game nào trước đây.",
      },
      {
        heading: "2. Cấu hình yêu cầu dự kiến cho GTA 6 trên PC & Laptop Gaming",
        paragraphs: [
          "Để chơi mượt mà GTA 6 ở độ phân giải 2K và 4K với công nghệ dò tia Ray Tracing và DLSS 4, game thủ cần trang bị những cỗ máy có sức mạnh xử lý hàng đầu.",
        ],
        bullets: [
          "Cấu hình tối thiểu: Intel Core i7-10700K / AMD Ryzen 7 5700X, 16GB RAM, NVIDIA GeForce RTX 3060 12GB hoặc RTX 4050 Laptop.",
          "Cấu hình khuyến nghị: Intel Core Ultra 7 / Ultra 9 hoặc AMD Ryzen AI 9, 32GB RAM DDR5, NVIDIA GeForce RTX 4080 / RTX 5070 Laptop trở lên.",
          "Cấu hình Ultra 4K Max Setting: NVIDIA GeForce RTX 5080 / RTX 5090 Laptop GPU, 64GB RAM, SSD NVMe PCIe 4.0 với ít nhất 200GB dung lượng trống.",
        ],
      },
      {
        heading: "3. Các dòng Laptop ROG sẵn sàng chinh chiến GTA 6",
        paragraphs: [
          "Các dòng laptop ROG Zephyrus G16 (2025), ROG Strix SCAR 18 (2026) với GPU GeForce RTX 50 Series và màn hình ROG Nebula OLED 240Hz sẽ là vũ khí hoàn hảo giúp bạn thưởng thức từng thước phim sống động của Vice City.",
        ],
      },
    ],
  },

  "guides/su-dung-scenario-profiles-trong-armoury-crate": {
    slug: "guides/su-dung-scenario-profiles-trong-armoury-crate",
    category: "guides",
    categoryLabel: "// GUIDES",
    title: "TẤT TẦN TẬT CÁCH SỬ DỤNG SCENARIO PROFILES TRONG ARMOURY CRATE ĐỂ TỐI ƯU LAPTOP GAMING ROG",
    date: "28 Tháng 6, 2026",
    readTime: "5 phút đọc",
    image: "/sites/rog-asus/img/articles/scenario-profiles.webp",
    lead: "Bạn muốn laptop tự động chuyển sang chế độ Turbo và bật đèn LED Aura Sync rực rỡ khi mở game, nhưng lại tự động chuyển sang chế độ Silent yên tĩnh và tiết kiệm pin khi mở trình duyệt làm việc? Tính năng Scenario Profiles trong Armoury Crate sinh ra để làm điều đó.",
    sections: [
      {
        heading: "Scenario Profiles là gì?",
        paragraphs: [
          "Scenario Profiles là công cụ tự động hóa thông minh tích hợp sẵn trong phần mềm điều khiển Armoury Crate của ASUS ROG. Nó cho phép bạn liên kết từng ứng dụng hoặc tựa game cụ thể với một tập hợp các thiết lập hệ thống định sẵn.",
          "Khi một ứng dụng được khởi chạy, laptop ROG sẽ ngay lập tức áp dụng chế độ quạt, xung nhịp CPU/GPU, chế độ hiển thị màn hình GameVisual và hiệu ứng đèn bàn phím tương ứng.",
        ],
      },
      {
        heading: "Cách thiết lập Scenario Profile chỉ với 3 bước",
        paragraphs: [
          "Bước 1: Mở phần mềm Armoury Crate trên laptop ROG của bạn bằng phím nóng ROG hoặc tìm kiếm trong Start Menu.",
          "Bước 2: Chọn mục Device > System > Scenario Profiles ở thanh menu bên trái.",
          "Bước 3: Bấm vào biểu tượng dấu cộng (+) để tạo cấu hình mới, sau đó liên kết với tệp thực thi (.exe) của trò chơi hoặc ứng dụng mong muốn.",
        ],
        bullets: [
          "Operating Mode: Chọn Silent cho làm việc văn phòng, Performance cho game nhẹ, và Turbo khi cắm sạc chơi game nặng.",
          "GameVisual: Chọn Racing cho đua xe, FPS cho bắn súng, hoặc sRGB cho chỉnh sửa hình ảnh.",
          "Aura Sync: Chọn các hiệu ứng ánh sáng phù hợp tâm trạng chiến game.",
        ],
      },
    ],
  },

  "guides/su-dung-aura-sync-trong-armoury-crate": {
    slug: "guides/su-dung-aura-sync-trong-armoury-crate",
    category: "guides",
    categoryLabel: "// GUIDES",
    title: "HƯỚNG DẪN SỬ DỤNG AURA SYNC TRONG ARMOURY CRATE ĐỂ ĐỒNG BỘ ĐÈN LED LAPTOP GAMING ROG",
    date: "28 Tháng 6, 2026",
    readTime: "4 phút đọc",
    image: "/sites/rog-asus/img/articles/aura-sync.webp",
    lead: "Hệ sinh thái đèn RGB Aura Sync của ROG cho phép người dùng đồng bộ ánh sáng trên bàn phím laptop, dải đèn gầm Light Bar, chuột, tai nghe và bàn phím rời một cách liền mạch.",
    sections: [
      {
        heading: "Khai phá sức mạnh hệ sinh thái Aura Sync",
        paragraphs: [
          "Aura Sync không chỉ đơn thuần là đổi màu đèn led. Nó cho phép bạn biến toàn bộ góc máy chơi game thành một sân khấu ánh sáng sống động theo nhịp nhạc, nhiệt độ phần cứng hoặc sự kiện trong game.",
          "Các hiệu ứng tích hợp sẵn bao gồm: Static (Tĩnh), Breathing (Nhịp thở), Strobing (Chớp nháy), Color Cycle (Vòng tròn màu), Rainbow (Cầu vồng), Starry Night (Bầu trời sao), Music (Nhịp điệu âm thanh), và Smart (Đổi màu theo nhiệt độ CPU/GPU).",
        ],
      },
    ],
  },

  "guides/tang-thoi-luong-pin-laptop-gaming-asus-rog": {
    slug: "guides/tang-thoi-luong-pin-laptop-gaming-asus-rog",
    category: "guides",
    categoryLabel: "// GUIDES",
    title: "CÁCH TĂNG THỜI LƯỢNG PIN LAPTOP GAMING ROG VỚI ARMOURY CRATE",
    date: "28 Tháng 6, 2026",
    readTime: "5 phút đọc",
    image: "/sites/rog-asus/img/articles/tiet-kiem-pin.webp",
    lead: "Ai bảo laptop gaming thì pin chỉ dùng được 2 tiếng? Với các dòng máy ROG Zephyrus và ROG Strix đời mới, bạn hoàn toàn có thể đạt 7-10 tiếng làm việc văn phòng liên tục nếu biết tận dụng các tính năng quản lý điện năng trong Armoury Crate.",
    sections: [
      {
        heading: "1. Kích hoạt GPU Eco Mode (Tắt hoàn toàn card đồ họa rời)",
        paragraphs: [
          "Card đồ họa rời NVIDIA tiêu thụ rất nhiều năng lượng ngay cả khi chạy ở chế độ chờ. Khi rút sạc mang máy đi học hoặc đi cà phê, hãy mở Armoury Crate và chuyển GPU Mode sang 'Eco Mode'.",
          "Thao tác này sẽ ngắt điện hoàn toàn GPU rời và chỉ dùng đồ họa tích hợp Intel Iris Xe / AMD Radeon, giúp tiết kiệm tới 50% lượng pin tiêu thụ.",
        ],
      },
      {
        heading: "2. Bật chế độ tự động giảm tần số quét màn hình (Panel Power Saver)",
        paragraphs: [
          "Màn hình 240Hz hay 180Hz tiêu tốn nhiều điện năng hơn so với 60Hz. Tính năng Panel Power Saver sẽ tự động giảm màn hình về 60Hz khi rút sạc và khôi phục lại 240Hz ngay khi cắm sạc trở lại.",
        ],
      },
    ],
  },

  "rog-gaming-laptops/laptop-gaming-2-man-hinh-16-inch": {
    slug: "rog-gaming-laptops/laptop-gaming-2-man-hinh-16-inch",
    category: "rog-gaming-laptops",
    categoryLabel: "// ROG GAMING LAPTOPS",
    title: "LAPTOP GAMING 2 MÀN HÌNH MỎNG NHẸ CÓ MẠNH KHÔNG? THỰC TẾ DÙNG ROG ZEPHYRUS DUO 2026 LÀM ĐỒ HỌA",
    date: "22 Tháng 6, 2026",
    readTime: "7 phút đọc",
    image: "/sites/rog-asus/img/articles/zephyrus-duo-2-man-hinh.webp",
    lead: "Trải nghiệm thực tế ROG Zephyrus Duo 16 với màn hình phụ ScreenPad Plus cảm ứng 4K nghiêng tự động, kết hợp cấu hình đỉnh cao Intel Core Ultra 9 và GPU NVIDIA GeForce RTX 5090 trong các tác vụ render video 8K và dựng đồ họa 3D.",
    sections: [
      {
        heading: "Thiết kế đột phá với màn hình ScreenPad Plus góc nghiêng 13 độ",
        paragraphs: [
          "Màn hình phụ ROG ScreenPad Plus kích thước 14 inch độ phân giải 4K không chỉ là không gian hiển thị mở rộng mà còn hoạt động như một cửa hút gió khổng lồ AAS Plus 2.0, giúp tăng lượng khí lưu thông vào hệ thống tản nhiệt thêm 30%.",
          "Đối với các nhà sáng tạo nội dung, đây là nơi hoàn hảo để đặt timeline dựng phim Premiere Pro, mixer âm thanh, hoặc bảng màu Photoshop mà không che khuất màn hình chính.",
        ],
      },
    ],
  },

  "guides/cach-dung-mux-switch-laptop-rog": {
    slug: "guides/cach-dung-mux-switch-laptop-rog",
    category: "guides",
    categoryLabel: "// GUIDES",
    title: "CÁCH DÙNG MUX SWITCH TRÊN LAPTOP GAMING ROG ĐỂ TĂNG TỐI ĐA HIỆU NĂNG",
    date: "20 Tháng 6, 2026",
    readTime: "4 phút đọc",
    image: "/sites/rog-asus/img/articles/mo-khoa-tgp.webp",
    lead: "Tìm hiểu cơ chế hoạt động của MUX Switch và NVIDIA Advanced Optimus trên laptop ROG giúp tăng từ 5% đến 15% FPS trong các tựa game bắn súng cạnh tranh như CS2 và Valorant.",
    sections: [
      {
        heading: "MUX Switch hoạt động như thế nào?",
        paragraphs: [
          "Trên các laptop thông thường, khung hình từ GPU rời phải đi qua GPU tích hợp của CPU trước khi xuất ra màn hình, gây ra hiện tượng nghẽn cổ chai và độ trễ tín hiệu. MUX Switch là một công tắc vi mạch cho phép xuất hình trực tiếp từ GPU rời lên màn hình, giải phóng 100% sức mạnh phần cứng.",
        ],
      },
    ],
  },

  "rog-xbox-ally/14069929-a664-4cb5-b0a0-aeeee0c6c32f": {
    slug: "rog-xbox-ally/14069929-a664-4cb5-b0a0-aeeee0c6c32f",
    category: "rog-xbox-ally",
    categoryLabel: "// ROG XBOX ALLY",
    title: "ROG Ally Cập Nhật Armoury Crate SE: Tùy Biến Nút Bấm, Travel Mode và Remote Play",
    date: "18 Tháng 6, 2026",
    readTime: "5 phút đọc",
    image: "/sites/rog-asus/img/articles/ally-armoury-crate-se.webp",
    lead: "ROG Ally vừa nhận bản cập nhật Armoury Crate SE quan trọng với 3 nhóm tính năng chính: tùy biến nút Command Center, Library và Action; Travel Mode giới hạn công suất sạc ở 65W; cùng Remote Play beta để chơi game PC từ xa mượt mà.",
    sections: [
      {
        heading: "1. Tùy biến sâu hệ thống điều khiển",
        paragraphs: [
          "Bản cập nhật mới nhất cho phép người dùng tự do gán lại chức năng cho các nút Macro phía sau và phím tắt mở Command Center theo từng profile tựa game.",
        ],
      },
      {
        heading: "2. Travel Mode và Remote Play",
        paragraphs: [
          "Travel Mode hỗ trợ sạc an toàn trên các chuyến bay và nguồn điện giới hạn, trong khi tính năng Remote Play tối ưu độ trễ truyền tải hình ảnh không dây từ dàn PC chính.",
        ],
      },
    ],
  },

  "technologies/man-hinh-chong-phan-chieu-laptop-gaming-rog": {
    slug: "technologies/man-hinh-chong-phan-chieu-laptop-gaming-rog",
    category: "technologies",
    categoryLabel: "// TECHNOLOGIES",
    title: "SCI vs SCE: Màn Hình Chống Phản Chiếu Có Ý Nghĩa Gì Với Người Dùng Laptop Gaming?",
    date: "15 Tháng 6, 2026",
    readTime: "6 phút đọc",
    image: "/sites/rog-asus/img/articles/sci-vs-sce.webp",
    lead: "Màn hình chống phản chiếu giúp giảm lượng ánh sáng môi trường phản ngược về mắt, nhờ đó hình ảnh giữ được độ tương phản, màu sắc và độ rõ nét ngay cả khi bạn làm việc hoặc chơi game gần cửa sổ.",
    sections: [
      {
        heading: "SCI (Specular Component Included) và SCE (Specular Component Excluded)",
        paragraphs: [
          "Hiểu rõ sự khác biệt giữa hai chuẩn đo lường quang học này giúp bạn chọn được màn hình laptop gaming phù hợp nhất cho không gian làm việc ngoài trời hoặc phòng studio nhiều nguồn sáng.",
        ],
      },
    ],
  },

  "guides/laptop-gaming-tan-nhiet-tot-em-ai": {
    slug: "guides/laptop-gaming-tan-nhiet-tot-em-ai",
    category: "guides",
    categoryLabel: "// GUIDES",
    title: "Laptop Gaming Tản Nhiệt Tốt: Chọn ROG Nào Để Chơi Game Mát Và Êm?",
    date: "12 Tháng 6, 2026",
    readTime: "5 phút đọc",
    image: "/sites/rog-asus/img/articles/tan-nhiet-tot.webp",
    lead: "Laptop gaming tản nhiệt tốt là laptop giữ được CPU và GPU ở ngưỡng nhiệt an toàn, hạn chế thermal throttling và duy trì hiệu năng ổn định trong các phiên chơi dài.",
    sections: [
      {
        heading: "Hệ thống tản nhiệt thông minh ROG Intelligent Cooling",
        paragraphs: [
          "Từ keo tản nhiệt kim loại lỏng Thermal Grizzly Conductonaut Extreme đến buồng hơi Vapor Chamber mở rộng và quạt Arc Flow Fans 2.0, các laptop ROG luôn dẫn đầu về hiệu quả tản nhiệt yên tĩnh.",
        ],
      },
    ],
  },

  "guides/chon-laptop-gaming-oled-hay-mini-led": {
    slug: "guides/chon-laptop-gaming-oled-hay-mini-led",
    category: "guides",
    categoryLabel: "// GUIDES",
    title: "Mini LED hay OLED: Chọn Laptop Gaming OLED Hay Laptop Gaming Mini LED Cho Trải Nghiệm HDR Tốt Nhất?",
    date: "10 Tháng 6, 2026",
    readTime: "6 phút đọc",
    image: "/sites/rog-asus/img/articles/oled-hay-mini-led.webp",
    lead: "Laptop gaming OLED là lựa chọn tốt hơn nếu bạn ưu tiên độ tương phản, màu đen tuyệt đối, thời gian phản hồi nhanh và trải nghiệm HDR trong không gian thiếu sáng; laptop gaming Mini LED là lựa chọn tốt cho độ sáng và tuổi thọ pin.",
    sections: [
      {
        heading: "So sánh trực tiếp ROG Nebula OLED và ROG Nebula HDR Mini LED",
        paragraphs: [
          "Màn hình OLED mang đến thời gian phản hồi siêu tốc 0.2ms và màu đen sâu vô cực, trong khi Mini LED trên SCAR 18 đạt độ sáng cực đại 1100 nits với 2000+ vùng local dimming rực rỡ.",
        ],
      },
    ],
  },

  "guides/mo-khoa-tgp-laptop-gaming-rog": {
    slug: "guides/mo-khoa-tgp-laptop-gaming-rog",
    category: "guides",
    categoryLabel: "// GUIDES",
    title: "Cách Mở Khóa TGP Tối Đa Trên Laptop Gaming ROG Bằng Manual Mode Trong Armoury Crate",
    date: "8 Tháng 6, 2026",
    readTime: "4 phút đọc",
    image: "/sites/rog-asus/img/articles/mo-khoa-tgp.webp",
    lead: "Manual Mode trong Armoury Crate là cách chính thức để mở khóa TGP tối đa trên laptop gaming ROG.",
    sections: [
      {
        heading: "Tối ưu đường cong quạt và đẩy công suất Dynamic Boost",
        paragraphs: [
          "Manual Mode cho phép bạn tùy chỉnh đường cong tốc độ quạt theo nhiệt độ và đẩy công suất GPU lên mức TGP tối đa được nhà sản xuất chứng nhận an toàn.",
        ],
      },
    ],
  },

  "rog-gaming-laptops/hieu-nang-laptop-rtx-50-series-rog": {
    slug: "rog-gaming-laptops/hieu-nang-laptop-rtx-50-series-rog",
    category: "rog-gaming-laptops",
    categoryLabel: "// ROG GAMING LAPTOPS",
    title: "Laptop RTX 5050: Không Chỉ Để Chơi Game, Hiệu Năng Thực Tế Cho Công Việc, Sáng Tạo Và Học Tập",
    date: "5 Tháng 6, 2026",
    readTime: "5 phút đọc",
    image: "/sites/rog-asus/img/articles/rtx-5050.webp",
    lead: "Laptop RTX 5050 là lựa chọn đa năng cho người dùng cần một chiếc máy vừa học tập, làm việc sáng tạo vừa chơi game.",
    sections: [
      {
        heading: "Đồ họa Blackwell thế hệ mới và tính năng DLSS 4",
        paragraphs: [
          "Với kiến trúc đồ họa tiên tiến, RTX 5050 mang đến hiệu năng vượt trội trong tầm giá, tối ưu điện năng tiêu thụ và hỗ trợ các công cụ tăng tốc AI trong Adobe Premiere và Photoshop.",
        ],
      },
    ],
  },

  "rog-gaming-laptops/laptop-rtx-50-series-rog": {
    slug: "rog-gaming-laptops/laptop-rtx-50-series-rog",
    category: "rog-gaming-laptops",
    categoryLabel: "// ROG GAMING LAPTOPS",
    title: "Laptop RTX 50 Series: Thế Hệ GPU Mới Thay Đổi Gì Cho Người Dùng Không Chỉ Chơi Game?",
    date: "3 Tháng 6, 2026",
    readTime: "6 phút đọc",
    image: "/sites/rog-asus/img/articles/rtx-50-series.webp",
    lead: "Nếu bạn cần một chiếc laptop RTX 50 series cho học tập, sáng tạo và giải trí, hãy ưu tiên ba yếu tố: GPU phù hợp workload, công suất TGP đủ cao và hệ thống tản nhiệt giữ được hiệu năng trong thời gian dài.",
    sections: [
      {
        heading: "Sức mạnh AI và kiến trúc Blackwell trên laptop ROG",
        paragraphs: [
          "Các dòng GPU RTX 50 Series trên ROG Zephyrus và Strix mang đến bước nhảy vọt về khả năng tính toán Tensor AI, xử lý đồ họa Ray Tracing và hiệu suất dựng hình 3D vượt trội.",
        ],
      },
    ],
  },

  "rog-gaming-laptops/hieu-nang-laptop-gaming-rtx-50-series": {
    slug: "rog-gaming-laptops/hieu-nang-laptop-gaming-rtx-50-series",
    category: "rog-gaming-laptops",
    categoryLabel: "// ROG GAMING LAPTOPS",
    title: "Laptop Gaming RTX 50 Series: Hiệu Năng Cao Cho Game, Công Việc Nặng Và Sáng Tạo Nội Dung",
    date: "1 Tháng 6, 2026",
    readTime: "7 phút đọc",
    image: "/sites/rog-asus/img/articles/rtx-50-hieu-nang.webp",
    lead: "Một chiếc laptop gaming RTX 50 Series tốt không chỉ được quyết định bởi tên GPU. Người mua cần xem đồng thời TGP của GPU, CPU, RAM, VRAM, SSD, màn hình, hệ thống tản nhiệt, chế độ hiệu năng và khả năng nâng cấp.",
    sections: [
      {
        heading: "Đánh giá chi tiết các phân khúc RTX 5060, 5070, 5080 và 5090",
        paragraphs: [
          "Lựa chọn GPU phù hợp với nhu cầu và ngân sách để đạt được trải nghiệm mượt mà từ độ phân giải Full HD đến 4K max setting trên các tựa game nặng nhất.",
        ],
      },
    ],
  },

  "rog-gaming-laptops/hieu-nang-laptop-rtx-5060": {
    slug: "rog-gaming-laptops/hieu-nang-laptop-rtx-5060",
    category: "rog-gaming-laptops",
    categoryLabel: "// ROG GAMING LAPTOPS",
    title: "Laptop RTX 5060: GPU Tầm Trung Đủ Mạnh Cho Content Creator, Kỹ Sư Và Người Dùng Cần Laptop Hiệu Năng Cao",
    date: "28 Tháng 5, 2026",
    readTime: "5 phút đọc",
    image: "/sites/rog-asus/img/articles/rtx-5060.webp",
    lead: "Laptop RTX 5060 là lựa chọn hợp lý cho content creator, designer, kỹ sư và game developer cần GPU rời để dựng video 4K, làm đồ họa, render 3D hoặc chơi game.",
    sections: [
      {
        heading: "Điểm ngọt hiệu năng trên giá thành",
        paragraphs: [
          "NVIDIA GeForce RTX 5060 Laptop GPU là lựa chọn cân bằng hoàn hảo giữa sức mạnh xử lý, điện năng tiêu thụ và độ mỏng nhẹ của các dòng máy như ROG Zephyrus G14 hay ROG Strix G16.",
        ],
      },
    ],
  },
};
