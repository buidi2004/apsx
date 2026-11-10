export type DetailStory = {
  title: string;
  text: string;
  img?: string;
};

export type DetailQuote = {
  author: string;
  role: string;
  text: string;
};

export type DetailFaq = {
  q: string;
  a: string;
};

export type DetailProduct = {
  name: string;
  tagline: string;
  modelCode?: string;
  price?: string;
  priceLabel?: string;
  storeUrl?: string;
  basePath: string;
  thumbImg?: string;
  kv: string;
  quote?: DetailQuote;
  breadcrumb: { label: string; href: string }[];
  highlights: string[];
  stories: DetailStory[];
  specs: [string, string][];
  faq: DetailFaq[];
  awards?: string[];
  mediaReviews?: { img: string; score: string; quote: string; href: string }[];
  videoReviews?: { img: string; source: string; quote: string; href: string }[];
  relatedArticles?: { img: string; title: string; href: string }[];
};

export function generateDynamicDetailProduct(slug: string[]): DetailProduct {
  const isSpec = slug[slug.length - 1] === "spec";
  const cleanSlug = isSpec ? slug.slice(0, -1) : slug;
  const rawName = cleanSlug[cleanSlug.length - 1] || "rog-gaming-product";

  // Format slug to human readable product name
  const name = rawName
    .replace(/-model$/i, "")
    .replace(/^rog-/i, "ROG ")
    .split("-")
    .map((word) => {
      if (/^(rog|rtx|gtx|oled|qhd|fhd|uhd|wifi|rgb|btf|xdr|hdr|am5|intel|amd|nvme|pcie|ssd|ram|cpu|gpu|vga|m4|m5|pro|max|ultra|plus|ti|super)$/i.test(word)) {
        return word.toUpperCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");

  const categoryGroup = slug[0] || "laptops-group";
  const basePath = `/vn/${cleanSlug.join("/")}`;

  return {
    name,
    tagline: "Hiệu Năng Đỉnh Cao. Thiết Kế Đột Phá Chuẩn Gaming ROG.",
    modelCode: rawName.toUpperCase(),
    price: "Liên hệ đại lý ủy quyền",
    priceLabel: "Giá đề xuất bán lẻ",
    storeUrl: "/vn/where-to-buy",
    basePath,
    thumbImg: "/sites/rog-asus/img/hero/gamescom.webp",
    kv: "/sites/rog-asus/img/hero/control-resonant.webp",
    breadcrumb: [
      { label: "Trang chủ", href: "/vn" },
      { label: "Sản phẩm", href: `/vn/${categoryGroup}` },
      { label: name, href: basePath },
    ],
    highlights: [
      "Hiệu năng vượt bậc với kiến trúc phần cứng thế hệ mới nhất 2026",
      "Hệ thống tản nhiệt thông minh tối ưu ROG Intelligent Cooling",
      "Linh kiện cao cấp tiêu chuẩn gaming, độ bền bỉ dài lâu",
      "Đèn Aura Sync RGB tùy biến cá nhân hóa không giới hạn",
      "Chuẩn kết nối tốc độ cao thế hệ mới nhất cho trải nghiệm liền mạch",
    ],
    stories: [
      {
        title: "Sức Mạnh Gaming Đột Phá",
        text: `${name} được trang bị nền tảng phần cứng tối tân, đáp ứng hoàn hảo nhu cầu chiến các tựa game AAA đỉnh cao ở thiết lập đồ họa cao nhất và xử lý các tác vụ đồ họa chuyên nghiệp.`,
        img: "/sites/rog-asus/img/hero/strix-scar-18.webp",
      },
      {
        title: "Tản Nhiệt ROG Intelligent Cooling",
        text: "Công nghệ buồng hơi tối ưu cùng keo tản nhiệt kim loại lỏng thế hệ mới giúp duy trì nhiệt độ mát mẻ và vận hành êm ái dưới tải công việc nặng liên tục.",
        img: "/sites/rog-asus/img/hero/control-resonant.webp",
      },
      {
        title: "Đồng Bộ Aura Sync RGB",
        text: "Hòa mình vào không gian gaming sống động với hệ sinh thái ánh sáng Aura Sync, cho phép đồng bộ màu sắc và hiệu ứng ánh sáng trên toàn bộ dàn máy.",
        img: "/sites/rog-asus/img/hero/gamescom.webp",
      },
    ],
    specs: [
      ["Thương hiệu", "ASUS Republic of Gamers (ROG)"],
      ["Tên sản phẩm", name],
      ["Mã sản phẩm", rawName.toUpperCase()],
      ["Nền tảng", "Thế hệ mới nhất 2026"],
      ["Công nghệ độc quyền", "ROG Armoury Crate / Aura Sync RGB"],
      ["Chuẩn kết nối", "Tốc độ cao siêu tốc"],
      ["Bảo hành", "Chính hãng ASUS Việt Nam 24 - 36 tháng"],
    ],
    faq: [
      {
        q: `${name} có hỗ trợ bảo hành chính hãng tại Việt Nam không?`,
        a: "Có, toàn bộ sản phẩm ASUS ROG phân phối chính hãng đều được hưởng chế độ bảo hành và hỗ trợ kỹ thuật tại các Trung tâm Dịch vụ ASUS trên toàn quốc.",
      },
      {
        q: "Sản phẩm có thể đồng bộ với phần mềm Armoury Crate không?",
        a: "Có, bạn có thể dễ dàng quản lý hiệu năng, cập nhật driver và tinh chỉnh đèn Aura Sync thông qua ứng dụng Armoury Crate chuyên dụng.",
      },
    ],
    awards: [
      "/sites/rog-asus/img/relprod/kithara.webp",
      "/sites/rog-asus/img/relprod/swift-oled-pg34wcdn.webp",
    ],
    relatedArticles: [
      {
        img: "/sites/rog-asus/img/articles/art-1.webp",
        title: "ROG tại Gamescom 2026: Định hình tương lai gaming thế hệ mới",
        href: "/vn/articles",
      },
      {
        img: "/sites/rog-asus/img/hero/gamescom.webp",
        title: "Khám phá dải sản phẩm gaming đỉnh cao ROG 2026",
        href: "/vn/articles",
      },
    ],
  };
}
