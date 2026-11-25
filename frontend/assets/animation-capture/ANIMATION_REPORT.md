# ASUS ROG Deep Animation & Media Capture Report

> Target: `http://localhost:3000/vn` | Generated: 2026-11-23T03:10:00.673Z

## 📊 Overview

- **Captured <canvas> 3D Sequence Frames:** `0` frame(s)
- **Active Web Animations Detected:** `2`
- **Scroll Sampling Steps (0% -> 100%):** `11` intervals
- **Background Videos (.webm/.mp4):** `0` video(s)
- **Retina / Lazy High-Res Assets:** `6` item(s)

## ⏱️ Web Animations API Curves (Cubic-Bezier & Durations)

| Target | Duration | Easing | Delay |
| :--- | :--- | :--- | :--- |
| `span.rog-hero-fill rog-hero-fi` | 5000ms | `linear` | 0ms |
| `a.rog-ai-btn` | 6000ms | `linear` | 0ms |

## 💻 Generated React & GSAP Integration Code

### 1. Framer Motion (`useTransform`)

```tsx
// Generated from ASUS ROG Scroll-Keyframe Sampling (0% -> 100%)
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export function RogParallaxHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [1, 0.9, 0.5, 0.2, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [1, 1.05, 1.15, 1.25, 1.4]);

  return (
    <div ref={containerRef} className="relative h-[250vh] bg-black">
      <motion.div 
        style={{ opacity, scale }}
        className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden"
      >
        <h1 className="text-6xl font-black text-white uppercase tracking-widest">
          FOR THOSE WHO DARE
        </h1>
      </motion.div>
    </div>
  );
}
```

### 2. GSAP ScrollTrigger (`pin & scrub`)

```typescript
// Generated GSAP ScrollTrigger timeline matching ASUS ROG pinned sequence
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initRogScrollAnimation(triggerElement: HTMLElement, targetElement: HTMLElement) {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: triggerElement,
      start: 'top top',
      end: '+=150%',
      pin: true,
      scrub: 1, // Smooth inertia scrub
      anticipatePin: 1,
    }
  });

  tl.to(targetElement, {
    scale: 1.2,
    opacity: 0,
    ease: 'power2.out',
    duration: 1
  });

  return tl;
}
```

