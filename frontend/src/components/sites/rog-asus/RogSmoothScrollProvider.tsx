"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

/* eslint-disable @typescript-eslint/no-explicit-any */

declare global {
  interface Window {
    __lenis?: Lenis;
    ScrollTrigger?: any;
    gsap?: any;
  }
}

/**
 * Global Smooth Scroll Provider for 100% of pages
 * Delivers ASUS ROG authentic inertial smooth mouse scrolling across the entire site.
 */
export default function RogSmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Respect user's accessibility preferences
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    // Ensure browser smooth-scroll does not fight Lenis
    document.documentElement.style.scrollBehavior = "auto";

    // Initialize unified single instance of Lenis with ROG tuned parameters
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false,
    });

    lenisRef.current = lenis;
    window.__lenis = lenis;

    // Connect Lenis to GSAP ScrollTrigger if ScrollTrigger is active
    lenis.on("scroll", () => {
      if (window.ScrollTrigger?.update) {
        window.ScrollTrigger.update();
      }
    });

    // Sync RAF loop with GSAP ticker if available, or fall back to requestAnimationFrame
    let rafId: number | null = null;
    let tickerFn: ((time: number) => void) | null = null;

    if (window.gsap?.ticker) {
      tickerFn = (time: number) => {
        lenis.raf(time * 1000);
      };
      window.gsap.ticker.add(tickerFn);
      window.gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (time: number) => {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    }

    // Intercept internal anchor clicks to smooth-scroll via Lenis
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (href && href.startsWith("#") && href.length > 1) {
        const dest = document.querySelector(href);
        if (dest) {
          e.preventDefault();
          lenis.scrollTo(dest as HTMLElement, { offset: -60 });
        }
      }
    };
    document.addEventListener("click", handleAnchorClick);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      if (tickerFn && window.gsap?.ticker) {
        window.gsap.ticker.remove(tickerFn);
      }
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      lenis.destroy();
      lenisRef.current = null;
      if (window.__lenis === lenis) {
        delete window.__lenis;
      }
    };
  }, []);

  // When pathname changes (Next.js navigation), reset scroll cleanly to top
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return <>{children}</>;
}
