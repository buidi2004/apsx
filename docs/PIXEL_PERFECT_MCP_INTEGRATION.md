# 🎯 Cẩm Nang Toàn Diện: Clone ASUS ROG 100% Pixel-Perfect & Hiệu Ứng Chuyển Động Chuyên Sâu

Tài liệu này tổng hợp toàn bộ giải pháp từ **kiến trúc MCP tinh gọn**, **kỹ thuật bắt sống hiệu ứng (GSAP, Canvas 3D Sequence, Web Animations API)**, **bộ skill tự động hóa**, đến **cấu hình tương thích đa agent (Antigravity, Claude Code, Cursor, Codex)**.

---

## 🧭 1. Môi Trường Thực Thi Hiện Tại: Google Antigravity (AGY)

Hệ thống bạn đang chạy hiện tại là **Google Antigravity** (IDE & CLI `agy`). 
- **Cấu hình MCP:** Tự động đọc từ `mcp_config.json` (tại thư mục gốc dự án) và `~/.gemini/config/mcp_config.json`.
- **Hệ thống Skills:** Tự động phát hiện và tương thích với các skill chuẩn trong `frontend/.agents/skills/` (chung định dạng với Claude Code / Codex / OpenCode).

### Cấu hình cho các môi trường khác (nếu chuyển đổi):

#### A. Claude Code (`~/.claude.json` hoặc `.claude/config.json`)
```json
{
  "mcpServers": {
    "playwright": { "command": "npx", "args": ["-y", "@playwright/mcp@latest"] },
    "chrome-devtools": { "command": "npx", "args": ["-y", "chrome-devtools-mcp@latest"] },
    "context7": { "command": "npx", "args": ["-y", "@upstash/context7-mcp"] },
    "firecrawl": { "command": "npx", "args": ["-y", "firecrawl-mcp"], "env": { "FIRECRAWL_API_KEY": "YOUR_KEY" } },
    "magic": { "command": "npx", "args": ["-y", "@21st-dev/magic@latest"] }
  }
}
```

#### B. Cursor (`.cursor/mcp.json` hoặc `~/.cursor/mcp.json`)
```json
{
  "mcpServers": {
    "playwright": { "command": "npx", "args": ["-y", "@playwright/mcp@latest"] },
    "chrome-devtools": { "command": "npx", "args": ["-y", "chrome-devtools-mcp@latest"] },
    "context7": { "command": "npx", "args": ["-y", "@upstash/context7-mcp"] }
  }
}
```

---

## 🎯 2. Bộ 5 MCP Server Tối Thượng (Lean Stack - Không Gây Loãng Agent)

Theo nguyên tắc **"Chọn ít server thôi"** để tránh agent bị nhiễu công cụ:

| STT | MCP Server | Nhiệm vụ chính trong dự án ROG | Lý do không thể thiếu |
| :---: | :--- | :--- | :--- |
| **1** | **Playwright MCP** | Đối chiếu Visual Diff, quay video, xuất HAR và trace.zip | Bắt trọn trạng thái trình duyệt ở 3 viewport (`1920x1080`, `1440x900`, `390x844`). |
| **2** | **Chrome DevTools MCP** | Bắt asset gốc (`.woff2`, `.webm`, AVIF), live CSS, Coverage | Đọc chính xác CSS variables, gradients Aura Sync và lọc bỏ CSS/JS rác không dùng. |
| **3** | **Context7 MCP** (`@upstash/context7-mcp`) | Tra cứu tài liệu chính thức mới nhất | Ngăn chặn agent code nhầm cú pháp cũ của GSAP 3.15, Next.js 16, Lenis, Framer Motion. |
| **4** | **Firecrawl MCP** | Cào sâu toàn bộ cây danh mục và bảng thông số SKU | Bóc tách specs kỹ thuật sạch thành JSON nạp vào SQLite backend. |
| **5** | **Magic UI / 21st.dev Magic MCP** | Pattern React/Tailwind/Framer Motion sạch | Dựng component Bento Grid, Spotlight card, Aura glowing borders chuẩn. |

---

## 🎬 3. Bốn Kỹ Thuật Hook Runtime "Bắt Sống" Chuyển Động & 3D

Engine [capture-scroll-animations.mjs](file:///home/buidi/Documents/apsx/frontend/scripts/capture-scroll-animations.mjs) đã tích hợp đầy đủ 4 hook:

```
  ┌─────────────────────────────────────────────────────────────┐
  │  Hook A: <canvas> Frame Sequence Interceptor                │
  │  Móc vào CanvasRenderingContext2D.prototype.drawImage       │
  │  để bắt toàn bộ 100-300 link ảnh 3D mở nắp laptop.          │
  └──────────────────────────────┬──────────────────────────────┘
                                 │
  ┌──────────────────────────────▼──────────────────────────────┐
  │  Hook B: Web Animations API Extractor                        │
  │  Đọc document.getAnimations() trích xuất cubic-bezier       │
  │  chuẩn từng mili-giây cho đèn Aura Sync và micro-motion.    │
  └──────────────────────────────┬──────────────────────────────┘
                                 │
  ┌──────────────────────────────▼──────────────────────────────┐
  │  Hook C: Scroll-Keyframe Sampling (0% -> 100% bước 2%)      │
  │  Ghi nhận matrix3d, transform, opacity, filter tại mỗi mốc; │
  │  tự xuất mã nguồn Framer Motion & GSAP ScrollTrigger.       │
  └──────────────────────────────┬──────────────────────────────┘
                                 │
  ┌──────────────────────────────▼──────────────────────────────┐
  │  Hook D: Retina 2K/4K, Video CDN & 3D Vector Detector       │
  │  deviceScaleFactor: 2 ép CDN trả ảnh gốc nét nhất;           │
  │  tự động phát hiện .splinecode, .riv, .lottie và video .webm│
  └─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ 4. Skills Đã Tích Hợp Sẵn Trong Dự Án

### A. Skill chuyên biệt mới tạo: `rog-motion-clone`
Nằm tại [frontend/.agents/skills/rog-motion-clone/SKILL.md](file:///home/buidi/Documents/apsx/frontend/.agents/skills/rog-motion-clone/SKILL.md):
- Chuẩn hóa sẵn thứ tự 4 bước: **`inject hook` $\to$ `cuộn lấy mẫu` $\to$ `xuất bảng keyframe` $\to$ `dựng bằng GSAP & Canvas Player`**.
- Agent tự động nạp skill này mỗi khi bạn yêu cầu clone hoặc sửa đổi animation.

### B. GSAP Skills chính thức từ GreenSock
Để agent code GSAP chuẩn phiên bản mới nhất với `useGSAP` hook:
```bash
npx -y skills add https://github.com/greensock/gsap-skills
```
Bộ skill này gồm các module: `gsap-core`, `gsap-react`, `gsap-plugins` (ScrollTrigger, Flip, SplitText) và `gsap-performance`.

### C. Các skills có sẵn trong dự án:
- `clone-website` ([frontend/.agents/skills/clone-website/SKILL.md](file:///home/buidi/Documents/apsx/frontend/.agents/skills/clone-website/SKILL.md))
- `playwright-skill` ([frontend/.agents/skills/playwright-skill/SKILL.md](file:///home/buidi/Documents/apsx/frontend/.agents/skills/playwright-skill/SKILL.md))
- `skill-tailwind` ([frontend/.agents/skills/skill-tailwind/SKILL.md](file:///home/buidi/Documents/apsx/frontend/.agents/skills/skill-tailwind/SKILL.md))

---

## ⚡ 5. Công Cụ Bổ Trợ Ngoài MCP

1. **Wappalyzer / BuiltWith:**
   Đã phân tích trang ROG gốc: Sử dụng **GSAP 3.12**, **ScrollTrigger**, **Lenis (smooth scroll)**, **lazysizes**, và thẻ **`<canvas>` rendering**.
2. **Lighthouse CLI (Kiểm tra hiệu năng):**
   ```bash
   npx lighthouse http://localhost:3000/vn --only-categories=performance --view
   ```
   Đảm bảo việc tải 100-300 ảnh WebP không làm nghẽn Main Thread hoặc tụt chỉ số LCP.
3. **Phát hiện 3D chuyên sâu (.splinecode, .riv, .lottie):**
   Script `capture-scroll-animations.mjs` tự động lọc Network để phát hiện nếu trang sản phẩm có dùng Spline 3D hoặc Rive runtime thay vì Canvas thuần.

---

## ⚖️ 6. Lưu Ý Về Bản Quyền

- **Học tập & R&D:** Việc cào asset gốc, phân tích CSS token và trích xuất timing chuyển động là hoàn toàn phù hợp để học hỏi kiến trúc frontend đỉnh cao và đo đạc độ chính xác pixel-perfect.
- **Triển khai Production / Thương mại:** Khi đưa trang web vào vận hành thực tế, cần thay thế toàn bộ hình ảnh sản phẩm, logo ASUS ROG, video nền và font chữ thương mại bằng bộ nhận diện thương hiệu và asset bản quyền của bạn.

---

## 🚀 7. Bảng Lệnh Nhanh

```bash
# 1. Bắt chuỗi ảnh Canvas 3D + Ghi HAR + Trace:
cd frontend
npm run capture-animations -- --url https://rog.asus.com/vn/ --record-har --trace

# 2. Tối ưu ảnh sang .webp bằng Sharp:
npm run optimize-sequence -- --format webp --quality 80

# 3. Chạy Visual Diff Loop ép độ chuẩn pixel:
npm run visual-diff -- --viewports desktop-wide,laptop,mobile

# 4. Trích xuất Font .woff2 & Live CSS Variables:
python3 tools/extract_rog_assets.py --url https://rog.asus.com/vn/
```
