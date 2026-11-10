# ROG ASUS VN — Homepage Clone Brief

Source: https://rog.asus.com/vn/ (title: "Trang Chủ ASUS Republic Of Gamers | Thương Hiệu Gaming Cao Cấp Trên Thế Giới")
Route map: `https://rog.asus.com/vn/` → local `/` (replaces template homepage).
Language: Vietnamese content. Reference screenshots: `docs/research/rog-asus/screenshots/` (desktop-00…06 at 1440px, mobile-00…04 at 390px).

## Design tokens (measured)

- ROG red (promo bar): `rgb(204,0,14)` = `#CC000E`. Article link red: same family `#E60012` looks right on dark bg.
- Body bg: black. Footer bg: `#0E0E0E`. Footer text: `#C6C6C6`.
- Article image overlay: `rgba(0,0,0,0.5)`.
- Fonts (downloaded in `public/sites/rog-asus/fonts/`):
  - `rogfonts-regular.otf` → family "ROGFonts-Regular" (special ROG glyphs)
  - `robotocondensed-regular.ttf` → "Roboto Condensed" (body/nav, 400)
  - `robotocondensed-bold.ttf` → family "condensed" (section headings, weight 700)
  - `tradegothicltpro.ttf` → "tradegothicltpro" (optional)
- Section heading (KHÁM PHÁ…): font "condensed" bold, 36px, black, centered.
- Nav links: Roboto Condensed 16px, white, uppercase, weight 400.
- Category label: 20px, `#202020`.
- AI button gradient: `linear-gradient(90deg, #4545ff, #8336b8, #c12871, #ff1a29, #c12871, #8336b8, #4545ff)` (animated shift), white text, 16px, padding 8px 16px.
- ROG Highlights bg: dark blue→purple gradient (approx `linear-gradient(115deg, #12144d 0%, #2a1b6e 45%, #5b2fa8 80%, #7a3fb5 100%)`) with `img/misc/home-grid.svg` overlay (1440×1243) + vertical "EST. 2006" rail on the left edge + decorative glyph row at the bottom of the section.

## Assets (already downloaded)

- Hero slides (1440×555, webp): `public/sites/rog-asus/img/hero/` — control-resonant (slide 1 desktop), gamescom, google-ai (slide 1 mobile), strix-scar-18, zephyrus-duo, zephyrus-g14.
- Product images (240×175): `public/sites/rog-asus/img/products/` — laptop-gaming, bo-mach-chu, card-do-hoa, man-hinh, phones, may-bo-pc-gaming, nguon-may-tinh, dock-vga, thiet-bi-mang, ban-phim, chuot-lot-chuot, tai-nghe-audio.
- Article images: `public/sites/rog-asus/img/articles/` — gta6 (592×333), scenario-profiles (592×333), aura-sync (369×208), tiet-kiem-pin (369×208), zephyrus-duo-2-man-hinh (369×208).
- Misc: `img/misc/home-grid.svg` (decorative grid), `img/misc/join-the-republic.webp` (1440×375 banner art incl. "JOIN THE REPUBLIC" logo), `img/misc/da-thong-bao-badge.png` (105×40).
- Header SVG logos extracted to `docs/research/rog-asus/svg/`:
  - `header-svg-0-vb0x0x200x37.svg` = ROG "REPUBLIC OF GAMERS" wordmark (red+white, used in navbar; also reusable in footer watermark tinted red)
  - `header-svg-8/9-vb0x0x71.418x15.556.svg` = ASUS wordmark (white)
  - others: 16×16/24×24 UI icons (search, bell, cart, hamburger, globe…)
- Font CSS reference: `public/sites/rog-asus/fonts/fontHQ.css` (source site's @font-face list).

## Section order (desktop, 1440px)

1. **Navbar** — black, 50px, sticky. Left: ROG logo svg (~150px wide). Center-left menu: MUA HÀNG · SẢN PHẨM · SÁNG TẠO · TẢI XUỐNG · CỘNG ĐỒNG · NỔI BẬT · HỖ TRỢ · ĐẠI LÝ (uppercase white 16px, ~28px gap). Right: ASUS wordmark svg (white, ~90px), thin divider, search icon, bell icon, cart icon (white, ~20px). Mobile: hamburger left, ROG logo center, search + cart right.
   Outbound hrefs: MUA HÀNG → https://www.asus.com/vn/store/ , HỖ TRỢ → https://rog.asus.com/vn/support , ĐẠI LÝ → https://www.asus.com/vn/content/buy/ , ASUS logo → https://www.asus.com/vn/ ; other menu items → their rog.asus.com sections (keep source URLs).
2. **PromoBar** — `#CC000E`, ~40px, centered white 16px link: "Mua Ngay Laptop Gaming AI ROG RTX 50 Series!"
3. **HeroCarousel** — 555px tall desktop (image object-cover). 6 slides using hero images in DOM order: control-resonant → gamescom → google-ai → strix-scar-18 → zephyrus-duo → zephyrus-g14. Auto-advance ~5s. Bottom-center indicator bars (thin white rounded bars ~60×3px, active = red, ~6 bars) + small pause/play button right of them. Slides are links (keep href="#"). Mobile: taller (~600px) same images, dash indicators at bottom.
4. **ProductCategories** — white bg, centered, py ~64px.
   - H2 "KHÁM PHÁ SẢN PHẨM CỦA CHÚNG TÔI" (36px, condensed bold)
   - Sub-heading "Unsure which product fits you?" (~24px bold, condensed)
   - p "Share your needs with AI and get tailored suggestions instantly." (16px #444)
   - Button "✦ AI Recommendations" (gradient above, white text, rounded 4px)
   - Carousel: 5 visible items, 12 products total (order): Laptop Gaming ASUS ROG, Bo mạch chủ, Card Đồ họa, Màn hình, Phones, MÁY BỘ PC GAMING, Nguồn máy tính, Dock VGA gắn ngoài, Thiết bị mạng, Bàn phím, Chuột & Lót chuột, Tai nghe & audio. Image (240×175) above label (20px #202020). Item click → source category URLs (rog.asus.com/vn category pages, keep outbound).
   - Red chevron arrows ‹ › at both edges; 5 dot indicators below (active red, others #999). Advancing pages scrolls the strip.
5. **ROG Highlights** — gradient bg (tokens above) + home-grid.svg overlay (absolute, full-width, opacity ~0.9, object right), py ~56px.
   - H2 "ROG HIGHLIGHTS" white ~32px condensed bold, centered, mb ~40px.
   - Left rail (desktop only): vertical text "EST. 2006" + dotted decorations (subtle white 30% opacity).

---

# ROG Matrix GeForce RTX 5090 30th Anniversary Edition Brief

- **Source URL:** https://rog.asus.com/vn/graphics-cards/graphics-cards/rog-matrix/rog-matrix-rtx5090-p32g-30th/
- **Local Route:** `/vn/graphics-cards/rog-matrix/rog-matrix-rtx5090-p32g-30th`
- **Component Path:** `src/components/sites/rog-asus/matrix-5090/`
  - `RogCardMatrix5090Overview.tsx` (Client component, subbar, hydration container, post-features)
  - `matrix-html.ts` (18 official interactive sections in `#hd`)
  - `matrix-style.css` (GPU layer acceleration, Retina image rendering, overflow control)
  - `RogCardMatrix5090PostFeatures.tsx` (Awards, Video Reviews modal, Media Reviews, Ecosystem, Disclaimers)
- **Local Assets Path:** `public/sites/rog-asus/matrix-5090/`
  - `video/`: 5 original MP4 videos (`product.mp4`, `copper.mp4`, `liquid-metal-gpu-cooling.mp4`, `memory-defrost.mp4`, `auto-extreme.mp4`) + VTT subtitles + poster JPGs.
  - `img/`: 78+ HD images/vectors for KV, KSP, cooling, dual-power, game, psu, software, nvidia.
  - `fonts/`: `ROGFonts-Regular_ES` (.woff2, .woff, .ttf, .otf, .eot).
  - `lib/swiper/`: `swiper-bundle.min.css`.
  - `css/`: `hd-style.css` (107 KB official styles).
  - `js/`: `matrix-main.js` (Unified jQuery 3.6 + GSAP 3.11 + ScrollTrigger + Swiper + ScrollReveal + Lity bundle).
- **Screenshots:**
  - `matrix-top-fixed.png` (Desktop 1440px top hero)
  - `matrix-cooling-fixed.png` (Desktop 1440px copper cooling section)
  - `matrix-bottom-fixed.png` (Desktop 1440px post-features & footer)
  - `matrix-mobile-top.png` (Mobile 390px top hero)
  - `matrix-mobile-bottom.png` (Mobile 390px footer)
- **Resolved Diagnostics (Deep Dive):**
  1. *ScrollReveal Element ID Collision:* Fixed `(p && O.store.elements && O.store.elements[p])` guard in `matrix-main.js` preventing fatal `TypeError: Cannot read properties of undefined (reading 'config')` when React StrictMode mounts/re-mounts.
  2. *GSAP Pinning Fix:* Removed `contain: paint` and `overflow: hidden` on `.matrix-overview-container` and `#hd` which clipped fixed-position pinned triggers during scroll.
  3. *Viewport Black Void Elimination:* Added passive scroll safety listener ensuring all reveal elements smoothly animate to `opacity: 1` as soon as they enter viewport proximity.
  4. *Font CORS Fallback:* Replaced remote `https://dlcdnrog.asus.com/rog/font/` references with local `/sites/rog-asus/fonts/` fonts.

   - Grid: 2 big cards (row 1, ~614px wide each, gap ~24px), 3 small cards (row 2, ~369px each). Card = image (w full, h auto) with centered-bottom white uppercase title overlay on image (16-18px bold, over rgba(0,0,0,.5) gradient) → below image: red tag "// GAMING" / "// GUIDES" / "// ROG GAMING LAPTOPS" (14px), title white condensed bold uppercase ~20px (2-line clamp), byline "ROG" + date (gray #aaa 16px), thin white underline bar (~280px, 2px).
   - Content:
     1. gta6.webp — // GAMING — "TỔNG HỢP THÔNG TIN GTA 6: GTA 6 RA MẮT KHI NÀO, CẤU HÌNH YÊU CẦU RA SAO?" — ROG · Jun 30, 2026 — overlay teaser "TỔNG HỢP TIN TỨC GTA 6 MỚI NHẤT: GTA 6 RA MẮT KHI NÀO VÀ CẤU HÌNH CHI TIẾT" — https://rog.asus.com/vn/articles/gaming/thong-tin-gta-6-moi-cau-hinh-yeu-cau/
     2. scenario-profiles.webp — // GUIDES — "TẤT TẦN TẬT CÁCH SỬ DỤNG SCENARIO PROFILES TRONG ARMOURY CRATE ĐỂ TỐI ƯU LAPTOP GAMING ROG" — ROG · Jun 28, 2026 — overlay "TẤT TẦN TẬT CÁCH SỬ DỤNG SCENARIO PROFILES TRONG ARMOURY CRATE ĐỂ TỐI ƯU LAPTOP ASUS" — https://rog.asus.com/vn/articles/guides/su-dung-scenario-profiles-trong-armoury-crate/
     3. aura-sync.webp — // GUIDES — "HƯỚNG DẪN SỬ DỤNG AURA SYNC TRONG ARMOURY CRATE ĐỂ ĐỒNG BỘ ĐÈN LED LAPTOP GAMING ROG" — ROG · Jun 28, 2026 — overlay "Hướng dẫn sử dụng Aura Sync trong Armoury Crate để đồng bộ đèn LED laptop ASUS" — https://rog.asus.com/vn/articles/guides/su-dung-aura-sync-trong-armoury-crate/
     4. tiet-kiem-pin.webp — // GUIDES — "CÁCH TĂNG THỜI LƯỢNG PIN LAPTOP GAMING ROG VỚI ARMOURY CRATE" — ROG · Jun 28, 2026 — overlay "CÁCH TỐI ƯU ARMOURY CRATE GIÚP LAPTOP ROG PIN TRÂU CÁ NGÀY TRÊN GIẢNG ĐƯỜNG" — https://rog.asus.com/vn/articles/guides/tang-thoi-luong-pin-laptop-gaming-asus-rog/
     5. zephyrus-duo-2-man-hinh.webp — // ROG GAMING LAPTOPS — "LAPTOP GAMING 2 MÀN HÌNH MỎNG NHẸ CÓ MẠNH KHÔNG? THỰC TẾ DÙNG ROG ZEPHYRUS DUO 2026 LÀM ĐỒ HỌA" — ROG · Jun 22, 2026 — https://rog.asus.com/vn/articles/rog-gaming-laptops/laptop-gaming-2-man-hinh-16-inch/
   - Below grid: "VIEW ALL ARTICLES ›" red 18px centered → https://rog.asus.com/vn/articles/
   - Bottom decorative glyph row (desktop, subtle white/gray ~20px icons spread across width: `0>>>1`, sun/gear, network node, stacked layers, envelope, half-moon, dashed grid, crosshair, database, plus small squares/triangles). Approximate with inline SVGs/unicode, low priority.
   - Mobile: cards in horizontal swipe carousel (1 per view) with 5 dot indicators (active red) + VIEW ALL below.
6. **JoinRepublic** — black bg. Desktop: banner image `join-the-republic.webp` full-width (1440×375) as background/left art with text block on the right half: H2 "THE ART OF THE ROG UNIVERSE" (white condensed bold ~32px) + paragraph (white 16px, lh 1.5): "Technology never sleeps, nor should the action. For those keen on winning power, the Republic of Gamers awaits. Driven by relentless innovation, ROG is committed to producing out-of-this-world experiences for gamers and enthusiasts everywhere."
   Mobile: text block on top, image below (stacked).
7. **Footer** — bg `#0E0E0E`, text `#C6C6C6` 16px, py ~40px.
   - Top-right: label "NHẬN CÁC ƯU ĐÃI MỚI NHẤT VÀ NHIỀU HƠN NỮA" (white 14px bold) + form row: email input (placeholder "Nhập địa chỉ email", dark bg, 1px white/40 border, ~220px) + red button "ĐĂNG KÝ" (#CC000E, white, px 16).
   - Links row (left): GIỚI THIỆU VỀ ROG · PRODUCT GUIDE · HỖ TRỢ · TRANG CHỦ · NEWSROOM (white uppercase 15px, gap ~28px). Right: social icons Facebook, TikTok, YouTube, Instagram, X (white ~22px, gap ~20px).
   - Company block (left, ~4 lines):
     "Công Ty TNHH Công Nghệ Asus (Việt Nam)"
     "Địa chỉ: 285 Cách Mạng Tháng Tám, Phường 12, Quận 10, Thành phố Hồ Chí Minh, Việt Nam"
     "Giấy chứng nhận đăng ký doanh nghiệp số 0304965680 do Sở Kế hoạch và Đầu tư và Thành phố Hồ Chí Minh cấp ngày 03/05/2007."
     "Điện thoại: 1800 65 88"
     "Giấy phép kinh doanh hoạt động mua bán hàng hóa và các hoạt động liên quan trực tiếp đến mua bán hàng hóa, số 0304965680/KD-0321, do Sở Công thương TP. Hồ Chí Minh cấp lần đầu ngày 24/01/2019."
   - Badge img `da-thong-bao-badge.png` (~105×40).
   - Big ROG eye watermark: red logo svg (~300px wide, opacity ~0.9, center, partially clipped by divider line).
   - Bottom row (below divider): globe icon + "Vietnam/Việt Nam" left; center-right: QUI CHẾ PHÁP LÝ · THÔNG TIN HỢP PHÁP (uppercase white/gray) + "©ASUSTEK COMPUTER INC. ALL RIGHTS RESERVED." (gray).
8. **ChatWidget** — fixed bottom-right (both desktop & mobile): white rounded-pill input "Bạn đang tìm kiếm gì?" (~260px, close ✕ icon inside right) + circular dark mascot button (~64px, ROG eye red glowing) overlapping to the right. Simplified: static input + mascot button (build mascot from ROG eye svg in a dark circle). Disclose as approximation.

## Notes / conventions

- Next.js 16 App Router, React 19, TypeScript strict, Tailwind v4 (oklch tokens in globals.css), shadcn/ui primitives available. Use `cn()` from `@/lib/utils`.
- All clone styles go in `src/app/rog-asus.css` (imported by the page), class prefix `rog-` to stay scoped; keep template globals intact.
- Components in `src/components/sites/rog-asus/`; assets referenced as `/sites/rog-asus/img/...` and fonts `/sites/rog-asus/fonts/...`.
- Font-faces declared in `src/app/rog-asus.css` (families: "ROGFonts-Regular", "Roboto Condensed", "condensed", "tradegothicltpro").
- Preserve outbound links to rog.asus.com/asus.com; do not invent local routes for unbuilt pages.
- Interactions in scope: hero auto-advance + indicators + pause, product carousel pages + arrows, mobile hamburger menu (simple slide-down), hover states on nav/cards, newsletter form visual only.
- Out of scope (disclose as gaps): mega-menu dropdown contents, search overlay, login/cart flows, chat bot behavior, cookie banner.

## Known gaps to disclose

- Chat mascot avatar approximated with ROG eye svg.
- Highlights bg gradient approximated from screenshots (source uses layered images + grid svg).
- Mobile hero uses same image set as desktop (source serves mobile-specific crops).
- Hero slide 1 (CONTROL Resonant) is composed by the source from layered images/text; we use the flattened 1440×555 art (already looks identical at rest).
