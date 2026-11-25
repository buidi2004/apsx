---
name: rog-motion-clone
description: Chuẩn hóa quy trình 4 bước clone hiệu ứng cuộn và đồ họa 3D phức tạp (GSAP ScrollTrigger, Canvas 3D frame sequence, Web Animations API, Retina CDN) cho các trang flagship như ASUS ROG.
---

# ASUS ROG Motion & Animation Clone Workflow

Kỹ thuật clone các trang flagship sử dụng hiệu ứng chuyển động phức tạp thay vì CSS tĩnh, bao gồm chuỗi ảnh 3D mở nắp laptop (`<canvas>`), ghim màn hình (`ScrollTrigger pin`), và độ mượt quán tính (`Lenis`).

## Quy trình 4 bước chuẩn hóa

```
  ┌─────────────────────────────────────────────────────────────┐
  │  Bước 1: Inject Hook                                        │
  │  Tiêm hook vào CanvasRenderingContext2D.prototype.drawImage │
  │  trước khi DOM load để đón bắt chuỗi ảnh frame sequence.    │
  └──────────────────────────────┬──────────────────────────────┘
                                 │
  ┌──────────────────────────────▼──────────────────────────────┐
  │  Bước 2: Cuộn lấy mẫu (Scroll-Keyframe Sampling)             │
  │  Mở browser Retina (deviceScaleFactor: 2), bật ghi HAR/trace.│
  │  Cuộn từng bước 2% (0% -> 100%) lấy mẫu transform/opacity.  │
  └──────────────────────────────┬──────────────────────────────┘
                                 │
  ┌──────────────────────────────▼──────────────────────────────┐
  │  Bước 3: Xuất bảng Keyframe & Cubic-Bezier                  │
  │  Đọc document.getAnimations() trích xuất đường cong vật lý, │
  │  quét các định dạng 3D đặc thù (.splinecode, .riv, .lottie).│
  └──────────────────────────────┬──────────────────────────────┘
                                 │
  ┌──────────────────────────────▼──────────────────────────────┐
  │  Bước 4: Dựng bằng GSAP ScrollTrigger & Canvas Player        │
  │  Dùng sharp nén ảnh sang .webp; đưa vào RogCanvasSequence-  │
  │  Player với pin: true, scrub: 0.5; bọc Lenis smooth scroll. │
  └─────────────────────────────────────────────────────────────┘
```

---

### Bước 1: Inject Hook (Đón bắt chuỗi ảnh Canvas 3D)
Chạy script:
```bash
npm run capture-animations -- --url <URL_TRANG_GOC>
```
Hook sẽ đón bắt mảng `window.__CAPTURED_FRAMES__` khi các thư viện như GSAP hoặc vanilla JS vẽ ảnh lên thẻ `<canvas>`.

### Bước 2: Cuộn lấy mẫu & Phân tích Network
Lệnh trên tự động:
- Đặt `deviceScaleFactor: 2` để buộc CDN ASUS (`dlcdnwebimgs.asus.com`) trả về ảnh phân giải cao nhất (`@2x`, `w_1920`).
- Cuộn từ 0% đến 100% theo bước `2%`, ghi nhận `transform` (`matrix3d`), `opacity`, `clip-path`, `filter`.
- Tùy chọn `--record-har` để lưu toàn bộ request headers, và `--record-video` để làm visual baseline.

### Bước 3: Xuất bảng Keyframe & Curve chuyển động
Script xuất ra:
- `animation-telemetry.json`: Toàn bộ mảng timing, duration, easing curve (`cubic-bezier`).
- `framer-motion-generated.tsx`: Template `useTransform(scrollYProgress, [...], [...])`.
- `gsap-scrolltrigger-generated.ts`: Template GSAP Timeline có `pin` và `scrub`.

### Bước 4: Tối ưu và Dựng trên Next.js
1. **Nén chuỗi ảnh bằng Sharp:**
   ```bash
   npm run optimize-sequence -- --format webp --quality 80
   ```
2. **Nhúng vào component Next.js:**
   Sử dụng component `<RogCanvasSequencePlayer />`:
   ```tsx
   import { RogCanvasSequencePlayer } from '@/components/sites/rog-asus/universal/RogCanvasSequencePlayer';

   export default function ProductHeroSection() {
     return (
       <RogCanvasSequencePlayer
         manifestUrl="/sequences/laptop-3d/sequence-manifest.json"
         containerHeight="300vh"
         title="ROG ZEPHYRUS G16 3D EXPLODED ARCHITECTURE"
         subtitle="Cuộn chuột để khám phá hệ thống tản nhiệt 3 quạt và buồng hơi buồng lạnh"
       />
     );
   }
   ```
3. **Đồng bộ quán tính cuộn với Lenis:**
   Đảm bảo trang được bọc trong `<RogSmoothScrollProvider />` để triệt tiêu hiện tượng giật khi cuộn trackpad/chuột bánh xe.

---

## Kiểm tra và Xác minh chất lượng
- Chạy Visual Diff Loop để kiểm chứng độ khớp từng pixel:
  ```bash
  npm run visual-diff -- --sections hero,matrix,specs
  ```
- Kiểm tra Lighthouse CLI đảm bảo 60FPS không bị nghẽn CPU:
  ```bash
  npx lighthouse http://localhost:3000/vn --only-categories=performance --view
  ```
