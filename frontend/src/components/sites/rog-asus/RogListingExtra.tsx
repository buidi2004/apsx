/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useRef } from "react";
import "./RogListingExtra.css";

/* ---------- Data scraped from rog.asus.com/vn/laptops-group/ ---------- */

const HOT_PRODUCTS = [
  {
    img: "/sites/rog-asus/img/hot/strix-scar-18.webp",
    name: "ROG Strix SCAR 18 (2026)",
    deal: false,
    priceLabel: "Giá khởi điểm trên ASUS estore là",
    price: "139.990.000 ₫",
    cta: "LỰA CHỌN",
    href: "/vn/store",
    specs: [
      "GPU lên đến NVIDIA® GeForce RTX™ 5090 Laptop GPU",
      "Lên tới Windows 11 Home Single Language",
      "Intel® NPU lên đến 13TOPS",
      "Intel Core® Ultra™ 290HX Plus",
      "Màn hình ROG Nebula HDR 18-inch, 4K (3840 x 2400, WQUXGA), Mini LED, tỷ lệ khung hình 16:10, tần số quét: 240Hz",
      "RAM 64GB DDR5-6400 MT/s, tối đa 128GB",
      "SSD 2TB PCIe® 4.0 NVMe™ M.2, tối đa 8TB",
    ],
  },
  {
    img: "/sites/rog-asus/img/hot/zephyrus-g14.webp",
    name: "ROG Zephyrus G14 (2026) GA403",
    deal: false,
    priceLabel: null,
    price: null,
    cta: null,
    href: "/vn/laptops-group",
    specs: [
      "NVIDIA® GeForce RTX™ 5060 Laptop GPU",
      "Hệ điều hành Windows 11 Home Single Language",
      "AMD XDNA™ NPU up to 50TOPS",
      "AMD Ryzen™ AI 9 465 Processor",
      "14-inch, 3K (2880 x 1800) OLED 16:10 , OLED, 120Hz, ROG Nebula Display",
      "RAM 32GB LPDDR5X 7500 MT/s onboard",
      "1TB PCIe® 4.0 NVMe™ M.2 SSD",
    ],
  },
  {
    img: "/sites/rog-asus/img/hot/zephyrus-g16.webp",
    name: "ROG Zephyrus G16 (2025) GU605",
    deal: false,
    priceLabel: "Giá khởi điểm trên ASUS estore là",
    price: "73.990.000 ₫",
    cta: "LỰA CHỌN",
    href: "/vn/laptops/rog-zephyrus/rog-zephyrus-g16-2025-gu605",
    specs: [
      "Windows 11 Home Single Language",
      "Lên đến NVIDIA® GeForce RTX™ 5090 Laptop GPU",
      "Intel® Core™ Ultra 9 Processor 386H",
      "Lên đến 64GB LPDDR5X 8533 trên board",
      "Lên đến 2TB PCIe® 4.0 NVMe™ M.2 SSD",
      "Màn hình ROG Nebula HDR với tấm nền OLED, 16-inch, 2.5K (2560 x 1600), WQXGA 240Hz, 0.2ms, độ sáng tối đa 1100 nits, 100% DCI-P3, G-Sync",
      "NPU Intel® AI Boost 50 TOPS",
    ],
  },
  {
    img: "/sites/rog-asus/img/hot/zephyrus-duo.webp",
    name: "ROG Zephyrus Duo (2026)",
    deal: true,
    priceLabel: "Giá trên ASUS estore",
    price: "189.990.000 ₫",
    cta: "CHI TIẾT",
    href: "/vn/laptops/rog-zephyrus/rog-zephyrus-duo-2026",
    specs: [
      "GPU laptop lên đến NVIDIA® GeForce RTX™ 5090",
      "Lên tới Windows 11 Pro",
      "Intel® NPU lên đến 50TOPS",
      "Bộ vi xử lý Intel® Core™ Ultra 9 386H",
      "Màn hình chính ROG Nebula HDR 16-inch, 3K (2880 x 1800) OLED, tỷ lệ khung hình 16:10, tần số quét 120Hz",
      "Lên đến 64GB LPDDR5X 8533 trên bo mạch",
      "Ổ SSD hiệu năng lên đến 2TB PCIe® 5.0 NVMe™ M.2",
    ],
  },
];

const VIDEOS = [
  {
    img: "/sites/rog-asus/img/videos/zephyrus-duo-big.webp",
    title:
      "ROG Zephyrus DUO 2026 – Siêu phẩm laptop gaming có 2 màn hình 16 inch đồng bộ tuyệt đối mọi thông số",
    big: true,
  },
  {
    img: "/sites/rog-asus/img/videos/zephyrus-g16.webp",
    title:
      "ROG Zephyrus G16 2026 – Laptop gaming 16 inch mỏng nhẹ, với màn hình chuẩn màu và tần số quét cao",
  },
  {
    img: "/sites/rog-asus/img/videos/zephyrus-g14-gu405.webp",
    title:
      "ROG Zephyrus G14 2026 (GU405) - Laptop Gaming RTX 5080 - Intel® Core™ Ultra 9 Processor 386H",
  },
  {
    img: "/sites/rog-asus/img/videos/flow-z13.webp",
    title: "ROG Flow Z13-KJP | For Ludens Who Dare | ROG x KOJIMA PRODUCTIONS",
  },
  {
    img: "/sites/rog-asus/img/videos/zephyrus-g14-ga403gm.webp",
    title: "Zephyrus G14 2026 (GA403GM) RTX 50 Series",
  },
];

const RELATED_ARTICLES = [
  {
    img: "/sites/rog-asus/img/related/ra-1.webp",
    title:
      "Hiện Tượng Xé Hình Trên Laptop: Không Chỉ Ảnh Hưởng Game — Cách Fix Cho Mọi Tác Vụ",
    excerpt:
      "Hiện tượng xé hình là hiện tượng khi xảy ra khi GPU xuất khung hình không đồng bộ với tần số quét của màn hình, khiến một lần làm bị vỡ tần số quét của hai khung hình khác nhau.",
    href: "/vn/articles/",
  },
  {
    img: "/sites/rog-asus/img/related/ra-2.webp",
    title: "4 cách dùng MUX Switch để tối ưu FPS, pin và hiệu năng laptop gaming",
    excerpt:
      "Cách dùng MUX Switch hiệu quả không phải là luôn bật dGPU Only. Bật dGPU Only khi chơi game cắm sạc, dùng Optimus cho tác vụ nhẹ, hạn chế dGPU Only khi dùng pin và kết hợp Scenario Profiles khi stream.",
    href: "/vn/articles/guides/cach-dung-mux-switch-laptop-rog",
  },
  {
    img: null,
    title:
      "7 cách stream game trên laptop không lag với OBS cho TikTok và YouTube",
    excerpt:
      "Cách stream game trên laptop không lag phụ thuộc vào bảy nhóm yếu tố: encoder, GPU, CPU, nhiệt độ, độ phân giải, bitrate và đường truyền.",
    href: "/vn/articles/guides/cach-stream-game-tren-laptop-gaming-rog/",
  },
  {
    img: "/sites/rog-asus/img/related/ra-3.webp",
    title:
      "ROG Strix G16 G614: Laptop Gaming Đa Nhiệm Có Thực Sự Làm Được Hết?",
    excerpt:
      "ROG Strix G16 G614 có thể xử lý 5 nhóm nhu cầu chính: chơi game AAA, thi đấu esports trên màn hình 2.5K 300Hz, dựng video, chỉnh ảnh và làm việc đa nhiệm.",
    href: "/vn/articles/rog-gaming-laptops/rog-strix-g16-g614-amd/",
  },
  {
    img: "/sites/rog-asus/img/related/ra-4.webp",
    title: "ROG Xbox Ally Có Chơi Được Game AAA Không?",
    excerpt:
      "ROG Xbox Ally hoàn toàn chơi được game AAA. Bạn có thể trải nghiệm Cyberpunk 2077, Elden Ring, Forza Horizon 5",
    href: "/vn/articles/rog-xbox-ally/rog-xbox-ally-choi-game-aaa/",
  },
  {
    img: "/sites/rog-asus/img/related/ra-5.webp",
    title: "Nâng Cấp Laptop Gaming: Hướng Dẫn Nâng RAM Và SSD Cho Laptop ROG Strix",
    excerpt:
      "Nâng cấp laptop gaming bằng RAM hoặc SSD là cách thực tế để xử lý tình trạng thiếu bộ nhớ, thiếu dung lượng và thời gian tải dài.",
    href: "/vn/articles/guides/nang-cap-laptop-gaming-rog-strix/",
  },
  {
    img: "/sites/rog-asus/img/related/ra-6.webp",
    title: "Mua Laptop ROG Tặng Google AI Pro: Ưu Đãi Chính Hãng Cho Gamer Và Nhà Sáng Tạo",
    excerpt:
      "Mua laptop ROG tặng Google AI Pro là chương trình chính thức từ ASUS và Google, chạy từ 10/8/2026 đến 9/8/2027, tặng 3 tháng Google AI Pro (5 TB đám mây) hoặc Google AI Plus (400 GB).",
    href: "/vn/articles/",
  },
  {
    img: "/sites/rog-asus/img/related/ra-7.webp",
    title: "Top Game Bắn Súng PC 2026: Từ Valorant Đến Escape From Tarkov",
    excerpt:
      "Game bắn súng PC năm 2026 vẫn thống trị thị trường với hơn 15 tựa game đỉnh cao, từ các game bắn súng miễn phí như Valorant, Counter-Strike 2 đến những bom tấn trả phí như Escape from Tarkov hay Helldivers 2.",
    href: "/vn/articles/",
  },
  {
    img: "/sites/rog-asus/img/related/ra-8.webp",
    title: "ROG Zephyrus G14 2026: Laptop Mỏng Nhẹ 14 Inch Duy Nhất Có RTX 5080",
    excerpt:
      "ROG Zephyrus G14 2026 là chiếc laptop gaming mỏng nhẹ 14 inch duy nhất hiện nay tích hợp RTX 5080, Core Ultra 9 386H, màn OLED 3K 120Hz và trọng lượng chỉ 1,58kg.",
    href: "/vn/articles/",
  },
  {
    img: "/sites/rog-asus/img/related/ra-9.webp",
    title: "Chọn Laptop RTX 50 Series: Độ Phân Giải Nào Phù Hợp Với GPU Của Bạn?",
    excerpt:
      "Khi chọn laptop RTX 50 series, GPU là yếu tố ảnh hưởng trực tiếp tới độ phân giải bạn chơi, mức thiết lập đồ họa, khả năng bật ray tracing và sử dụng DLSS 4.",
    href: "/vn/articles/",
  },
  {
    img: "/sites/rog-asus/img/related/ra-10.webp",
    title:
      "Điều Gì Tạo Nên Một Chiếc Laptop Gaming Tốt? Điểm Benchmark Không Nói Lên Toàn Bộ Câu Chuyện",
    excerpt:
      "Điểm benchmark chỉ là một phần — hệ thống tản nhiệt, TGP, màn hình và chất lượng hoàn thiện mới quyết định trải nghiệm thực tế của một chiếc laptop gaming tốt.",
    href: "/vn/articles/",
  },
  {
    img: "/sites/rog-asus/img/related/ra-11.webp",
    title: "Laptop Gaming Mạnh AMD: Ryzen AI 9, RTX 5070/5080 Và Tản Nhiệt Đỉnh Cao",
    excerpt:
      "Laptop gaming mạnh AMD là gì? Đó là những cỗ máy trang bị bộ xử lý AMD Ryzen AI 9 465 hoặc Ryzen 9 8940HX, GPU RTX 5070 và RTX 5080 với TGP lên đến 115W, hệ thống tản nhiệt Tri-Fan hoặc buồng hơi.",
    href: "/vn/articles/",
  },
];

const RELATED_PRODUCTS = [
  {
    img: "/sites/rog-asus/img/vga/hot-matrix-5090.webp",
    name: "ROG Matrix GeForce RTX™ 5090 (30th Anniversary)",
    href: "/vn/graphics-cards/rog-matrix/rog-matrix-rtx5090-p32g-30th",
  },
  {
    img: "/sites/rog-asus/img/relprod/xg-mobile.webp",
    name: "ROG XG Mobile (2025)",
    href: "/vn/external-graphics-docks-group",
  },
  {
    img: "/sites/rog-asus/img/relprod/swift-oled-pg34wcdn.webp",
    name: "ROG Swift OLED PG34WCDN",
    href: "/vn/monitors/32-to-34-inches/rog-swift-oled-pg34wcdn",
  },
  {
    img: "/sites/rog-asus/img/relprod/kithara.webp",
    name: "ROG Kithara Gaming Headset",
    href: "/vn/headsets-audio-group",
  },
  {
    img: "/sites/rog-asus/img/relprod/falchion-ace-75.webp",
    name: "ROG Falchion Ace 75 HE Gaming Keyboard",
    href: "/vn/keyboards-group",
  },
];

const DISCLAIMER = [
  "¹Bản nâng cấp Windows 11 sẽ được cung cấp cho các thiết bị đủ điều kiện vào cuối năm 2021 đến năm 2022. Thời gian thay đổi tùy theo thiết bị. Một số tính năng yêu cầu phần cứng cụ thể (xem aka.ms/windows11-spec).",
  "Do các cấu phần gắn trên bề mặt gần khe cắm M.2 của bo mạch chủ, chỉ các ổ SSD một mặt mới được hỗ trợ.",
];

/* ---------- Sections ---------- */

function HotProducts() {
  return (
    <section className="rog-hot">
      <div className="rog-hot-head">
        <h2 className="rog-hot-title">Laptop Gaming ASUS ROG</h2>
        <a
          className="rog-ai-btn rog-hot-ai"
          href="/vn/"
          target="_blank"
          rel="noreferrer"
        >
          ✦ AI Recommendations
        </a>
      </div>
      <div className="rog-hot-grid">
        {HOT_PRODUCTS.map((p) => (
          <div className="rog-hot-card" key={p.name}>
            {p.deal && <span className="rog-hot-deal">DEAL</span>}
            {p.href.startsWith("/") ? (
              <Link href={p.href} className="rog-hot-card-link">
                <div className="rog-hot-img">
                  <img src={p.img} alt={p.name} />
                </div>
                <h3 className="rog-hot-name">{p.name}</h3>
                <ul className="rog-hot-specs">
                  {p.specs.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
                {p.price && (
                  <div className="rog-hot-price-wrap">
                    <span className="rog-hot-price-label">
                      {p.priceLabel} <span className="rog-hot-info">ⓘ</span>
                    </span>
                    <span className="rog-hot-price">{p.price}</span>
                  </div>
                )}
                <div className="rog-hot-actions">
                  {p.cta && (
                    <span className="rog-hot-cta">
                      {p.cta}
                    </span>
                  )}
                  <span className="rog-hot-more">
                    TÌM HIỂU THÊM <span className="rog-hot-chev">›</span>
                  </span>
                </div>
              </Link>
            ) : (
              <a href={p.href} target="_blank" rel="noreferrer" className="rog-hot-card-link">
                <div className="rog-hot-img">
                  <img src={p.img} alt={p.name} />
                </div>
                <h3 className="rog-hot-name">{p.name}</h3>
                <ul className="rog-hot-specs">
                  {p.specs.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
                {p.price && (
                  <div className="rog-hot-price-wrap">
                    <span className="rog-hot-price-label">
                      {p.priceLabel} <span className="rog-hot-info">ⓘ</span>
                    </span>
                    <span className="rog-hot-price">{p.price}</span>
                  </div>
                )}
                <div className="rog-hot-actions">
                  {p.cta && (
                    <span className="rog-hot-cta">
                      {p.cta}
                    </span>
                  )}
                  <span className="rog-hot-more">
                    TÌM HIỂU THÊM <span className="rog-hot-chev">›</span>
                  </span>
                </div>
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

 export function VideoSection() {
  const [big, ...rest] = VIDEOS;
  return (
    <section className="rog-vids">
      <h2 className="rog-vids-title">VIDEO</h2>
      <div className="rog-vids-layout">
        <a
          className={`rog-vid${big.big ? " rog-vid-big" : ""}`}
          href="https://www.youtube.com/@asusrogvietnam"
          target="_blank"
          rel="noreferrer"
        >
          <img src={big.img} alt={big.title} />
          <span className="rog-vid-play" aria-hidden>
            <svg viewBox="0 0 24 24" width="26" height="26">
              <path d="M8 5l11 7-11 7V5z" fill="currentColor" />
            </svg>
          </span>
          <span className="rog-vid-title">{big.title}</span>
        </a>
        <div className="rog-vids-small">
          {rest.map((v) => (
            <a
              className="rog-vid"
              key={v.img}
              href="https://www.youtube.com/@asusrogvietnam"
              target="_blank"
              rel="noreferrer"
            >
              <img src={v.img} alt={v.title} />
              <span className="rog-vid-play" aria-hidden>
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path d="M8 5l11 7-11 7V5z" fill="currentColor" />
                </svg>
              </span>
              <span className="rog-vid-title">{v.title}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

 export function RelatedArticles() {
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: number) => {
    trackRef.current?.scrollBy({ left: dir * 640, behavior: "smooth" });
  };
  return (
    <section className="rog-rel">
      <h2 className="rog-rel-title">BÀI VIẾT LIÊN QUAN</h2>
      <div className="rog-rel-wrap">
        <div className="rog-rel-track" ref={trackRef}>
          {RELATED_ARTICLES.map((a) => (
            <a className="rog-rel-card" key={a.title} href={a.href} target="_blank" rel="noreferrer">
              <div className="rog-rel-img">
                {a.img ? <img src={a.img} alt={a.title} /> : <span className="rog-rel-img-empty" aria-hidden />}
              </div>
              <div className="rog-rel-body">
                <span className="rog-rel-tag">{"// POST"}</span>
                <h3 className="rog-rel-card-title">{a.title}</h3>
                <p className="rog-rel-excerpt">{a.excerpt}</p>
              </div>
            </a>
          ))}
        </div>
        <button
          type="button"
          className="rog-rel-arrow"
          aria-label="Xem thêm bài viết"
          onClick={() => scrollBy(1)}
        >
          <svg viewBox="0 0 24 24" width="44" height="44" aria-hidden>
            <path d="M9 4l8 8-8 8" fill="none" stroke="currentColor" strokeWidth="2.4" />
          </svg>
        </button>
      </div>
    </section>
  );
}

 export function RelatedProducts() {
  return (
    <section className="rog-relprod">
      <h2 className="rog-relprod-title">SẢN PHẨM LIÊN QUAN</h2>
      <div className="rog-relprod-grid">
        {RELATED_PRODUCTS.map((p) =>
          p.href.startsWith("/") ? (
            <Link className="rog-relprod-card" key={p.name} href={p.href}>
              <div className="rog-relprod-img">
                <img src={p.img} alt={p.name} />
              </div>
              <span className="rog-relprod-name">{p.name}</span>
              <span className="rog-relprod-more">TÌM HIỂU THÊM <span className="rog-hot-chev">›</span></span>
            </Link>
          ) : (
            <a className="rog-relprod-card" key={p.name} href={p.href} target="_blank" rel="noreferrer">
              <div className="rog-relprod-img">
                <img src={p.img} alt={p.name} />
              </div>
              <span className="rog-relprod-name">{p.name}</span>
              <span className="rog-relprod-more">TÌM HIỂU THÊM <span className="rog-hot-chev">›</span></span>
            </a>
          )
        )}
      </div>
    </section>
  );
}

 export function Disclaimer() {
  return (
    <div className="rog-disclaimer">
      {DISCLAIMER.map((d, i) => (
        <p key={i}>{d}</p>
      ))}
    </div>
  );
}

export default function RogListingExtra() {
  return (
    <>
      <HotProducts />
      <VideoSection />
      <RelatedArticles />
      <RelatedProducts />
      <Disclaimer />
    </>
  );
}
