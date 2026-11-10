/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
/**
 * Official runtime initializer for ROG Strix SCAR 18 (2026) and Strix G18 (2025).
 * Loads jQuery, GSAP, ScrollTrigger, Webflow IX2, and Aura Engine in strict dependency order,
 * then binds all official scroll animations, video toggles, and performance bars.
 */

declare global {
  interface Window {
    jQuery?: any;
    $?: any;
    gsap?: any;
    ScrollTrigger?: any;
    Webflow?: any;
    featuresRun?: () => void;
    loaded?: boolean;
  }
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Avoid double loading
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = false;
    script.onload = () => resolve();
    script.onerror = (err) => {
      console.warn(`[ROG Scar18] Failed to load ${src}:`, err);
      resolve(); // proceed gracefully
    };
    document.body.appendChild(script);
  });
}

export async function initScar18Runtime(): Promise<() => void> {
  try {
    // 1. Load jQuery 3.7.1 first
    await loadScript("/sites/rog-asus/scar-18-2026/jquery-3.7.1.min.js");

    // 2. Load all.min.js (Bundles GSAP 3 + ScrollTrigger + Swiper)
    await loadScript("/sites/rog-asus/scar-18-2026/all.min.js");

    // 3. Load webflow_002.js (Webflow IX2 Engine)
    await loadScript("/sites/rog-asus/scar-18-2026/webflow_002.js");

    // 4. Load aura.js (Aura RGB & AniMe Vision)
    await loadScript("/sites/rog-asus/scar-18-2026/aura.js");

    window.loaded = true;
    if (typeof window.featuresRun === "function") {
      window.featuresRun();
    }

    // Trigger Webflow ready event
    if (window.Webflow && typeof window.Webflow.ready === "function") {
      window.Webflow.ready();
    }
    document.dispatchEvent(new CustomEvent("WebflowLoaded"));
    document.dispatchEvent(new Event("readystatechange"));
    document.dispatchEvent(new Event("DOMContentLoaded"));
    window.dispatchEvent(new Event("load"));

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;

    if (gsap && ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);

      // Animation 1: Display Zoom & Laser Mask Line Timeline
      const line1 = document.getElementById("zm-mask-line1");
      const line2 = document.getElementById("zm-mask-line2");
      const displayFrame = document.querySelector<HTMLElement>(".zm-display-frame");
      const displayBtn = document.querySelector<HTMLElement>(".ss-display-play-pause-button");
      const displayVideoWrapper = document.querySelector<HTMLElement>(".zm-display-video-wrapper");

      if (line1 && line2 && displayFrame) {
        gsap.set(line1, { opacity: 0 });
        gsap.set(line2, { opacity: 0 });
        gsap.set(displayFrame, { opacity: 0, "--scale-ratio": 8 });

        if (displayVideoWrapper) {
          gsap.set(displayVideoWrapper, { scale: 1, transformOrigin: "center center" });
        }
        if (displayBtn) {
          gsap.set(displayBtn, { opacity: 0 });
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".ss-clean-section",
            start: "top top",
            end: "+=3500",
            pin: ".zm-display-intro",
            scrub: 1,
          },
        });

        tl.set(displayFrame, { opacity: 1 }, 0);
        tl.to(
          displayFrame,
          {
            "--scale-ratio": window.innerWidth > 768 ? 0.82 : window.innerWidth > 480 ? 1.1 : 1.3,
            ease: "power2.out",
            duration: 1.6,
          },
          0
        );

        if (displayVideoWrapper) {
          tl.to(displayVideoWrapper, { scale: 0.8, ease: "power2.out", duration: 1.6 }, 1.4);
        }

        tl.to(line1, { opacity: 1, ease: "linear", duration: 0.4 }, 1.8);
        tl.to(line2, { opacity: 1, ease: "linear", duration: 0.4 }, 2.0);

        if (displayBtn) {
          tl.to(displayBtn, { opacity: 1, ease: "linear", duration: 0.4 }, 2.2);
        }
      }

      // Animation 2: Performance Progress Bars
      document.querySelectorAll<HTMLElement>("[data-percentage]").forEach((bar) => {
        const percentage = parseInt(bar.getAttribute("data-percentage") || "0", 10);
        if (percentage > 0) {
          ScrollTrigger.create({
            trigger: bar,
            start: "top 85%",
            once: true,
            onEnter: () => {
              gsap.fromTo(
                bar,
                { width: "0%" },
                { width: percentage + "%", duration: 1.8, ease: "power2.out" }
              );
            },
          });
        }
      });

      // Animation 3: Stagger cards [data-gsap='group-wait']
      document.querySelectorAll<HTMLElement>("[data-gsap='group-wait']").forEach((group) => {
        const items = group.children;
        if (items.length > 0) {
          gsap.fromTo(
            items,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.15,
              ease: "power2.out",
              scrollTrigger: {
                trigger: group,
                start: "top 80%",
                once: true,
              },
            }
          );
        }
      });

      // Refresh ScrollTrigger after initial mount
      setTimeout(() => {
        if (typeof ScrollTrigger !== "undefined" && typeof ScrollTrigger.refresh === "function") {
          ScrollTrigger.refresh();
        }
        window.dispatchEvent(new Event("resize"));
      }, 500);
      setTimeout(() => {
        if (typeof ScrollTrigger !== "undefined" && typeof ScrollTrigger.refresh === "function") {
          ScrollTrigger.refresh();
        }
      }, 1500);
    }

    // 5. Wire Toggle Buttons for Videos
    const bindToggle = (videoId: string) => {
      const video = document.getElementById(videoId) as HTMLVideoElement | null;
      if (!video) return;
      const container = video.closest(".div-block-8") || video.closest(".ss-filled-bg");
      const btn = container?.querySelector<HTMLButtonElement>(".c-btn-toggle");
      if (btn) {
        btn.onclick = () => {
          if (video.paused) {
            video.play().catch(() => {});
            btn.dataset.status = "pause";
            btn.setAttribute("aria-label", "Pause video");
          } else {
            video.pause();
            btn.dataset.status = "play";
            btn.setAttribute("aria-label", "Play video");
          }
        };
      }
    };

    bindToggle("ss-cooling-thermal-video");
    bindToggle("ss-performance-tagline-video");
    bindToggle("ss-unknown-bg-video");

  } catch (err) {
    console.error("[ROG Scar18 Runtime Error]:", err);
  }

  // Cleanup handler
  return () => {
    try {
      if (window.ScrollTrigger) {
        window.ScrollTrigger.getAll().forEach((t: any) => t.kill());
      }
    } catch {}
  };
}

