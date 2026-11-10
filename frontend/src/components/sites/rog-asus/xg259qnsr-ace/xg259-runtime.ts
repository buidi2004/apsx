/**
 * ROG Strix XG259QNSR Ace Official Runtime Logic
 * Replicates 100% of the live effects: Lenis smooth scroll, Splitting.js text scramble,
 * GSAP ScrollTrigger slide-in/scale-in, real-time cyberpunk HUD clock, FAQ accordion.
 * Synchronizes Lenis wheel scroll with GSAP ScrollTrigger ticker to prevent jitter and mouse scroll bugs.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

function loadScript(src: string): Promise<void> {
  return new Promise((resolve) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.async = false;
    s.onload = () => resolve();
    s.onerror = () => resolve(); // don't crash on network failure
    document.body.appendChild(s);
  });
}

export async function initXg259Runtime(): Promise<() => void> {
  if (typeof window === "undefined") return () => {};

  // Ensure scroll-behavior is auto on html to prevent browser fighting Lenis
  document.documentElement.style.scrollBehavior = "auto";

  // Set Webflow page attribute
  document.documentElement.setAttribute("data-wf-page", "658d2e9064467c5d8b53b867");

  // Load required dependencies sequentially
  await loadScript("https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=658d2e9064467c5d8b53b860");
  await loadScript("https://dlcdnwebimgs.asus.com/files/media/202607/ea798edb-b16b-4792-a7e3-71ec041b86e1/v2/js/gsap.min.js");
  await loadScript("https://dlcdnwebimgs.asus.com/files/media/202607/ea798edb-b16b-4792-a7e3-71ec041b86e1/v2/js/ScrollTrigger.min.js");
  await loadScript("https://dlcdnwebimgs.asus.com/files/media/202607/ea798edb-b16b-4792-a7e3-71ec041b86e1/v2/js/splitting.min.js");
  await loadScript("https://dlcdnwebimgs.asus.com/files/media/202607/ea798edb-b16b-4792-a7e3-71ec041b86e1/v2/js/lenis.min.js");
  await loadScript("https://dlcdnwebimgs.asus.com/files/media/202607/ea798edb-b16b-4792-a7e3-71ec041b86e1/v2/js/webflow.js");

  const anyWin = window as unknown as {
    Lenis?: any;
    Splitting?: () => void;
    gsap?: any;
    ScrollTrigger?: any;
    Webflow?: any;
  };

  let rafId: number | null = null;
  let localLenisInstance: any = null;
  let tickerFn: ((time: number) => void) | null = null;

  const gsap = anyWin.gsap;
  const ScrollTrigger = anyWin.ScrollTrigger;

  // 1. Lenis Smooth Scroll Engine (Reuses Global RogSmoothScrollProvider or fallback)
  try {
    const globalLenis = (window as any).__lenis;
    const lenis = globalLenis || (anyWin.Lenis ? new anyWin.Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false,
    }) : null);

    if (!globalLenis && lenis) {
      localLenisInstance = lenis;
      if (gsap && gsap.ticker) {
        tickerFn = (time: number) => {
          lenis.raf(time * 1000);
        };
        gsap.ticker.add(tickerFn);
        gsap.ticker.lagSmoothing(0);
      } else {
        const raf = (time: number) => {
          lenis.raf(time);
          rafId = requestAnimationFrame(raf);
        };
        rafId = requestAnimationFrame(raf);
      }
    }

    // Connect active Lenis to GSAP ScrollTrigger
    if (lenis && ScrollTrigger && typeof ScrollTrigger.update === "function") {
      lenis.on("scroll", () => {
        ScrollTrigger.update();
      });
    }
  } catch (err) {
    console.warn("Lenis init skipped", err);
  }

  // 2. Splitting.js for characters
  try {
    if (typeof anyWin.Splitting === "function") {
      anyWin.Splitting();
    }
  } catch (err) {
    console.warn("Splitting init skipped", err);
  }

  // 3. Webflow IX2 initialization
  try {
    if (anyWin.Webflow) {
      anyWin.Webflow.destroy?.();
      anyWin.Webflow.ready?.();
      anyWin.Webflow.require?.("ix2")?.init?.();
    }
    document.dispatchEvent(new Event("readystatechange"));
  } catch (err) {
    console.warn("Webflow init skipped", err);
  }

  // 4. GSAP animations & ScrollTrigger
  if (gsap && ScrollTrigger) {
    try {
      gsap.registerPlugin(ScrollTrigger);

      // Char animation
      gsap.utils.toArray("[data-gsap-list='char']").forEach((section: any) => {
        const chars = section.querySelectorAll(".char");
        if (chars.length > 0) {
          gsap.from(chars, {
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              toggleActions: "play none none none",
            },
            opacity: 0,
            duration: 0.1,
            stagger: {
              each: 0.02,
              from: "random",
            },
            ease: "power3.out",
          });
        }
      });

      // Slide-in animation for feature cards
      gsap.utils.toArray("[data-gsap-list='slide-in']").forEach((section: any) => {
        const items = section.querySelectorAll("[data-gsap]");
        if (items.length > 0) {
          gsap.to(items, {
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "play none none none",
            },
            opacity: 1,
            duration: 1.5,
            y: 0,
            stagger: 0.1,
            ease: "power3.out",
          });
        }
      });

      // Scale-in animation for top-ten icons
      gsap.utils.toArray("[data-gsap-list='scale-in']").forEach((section: any) => {
        const items = section.querySelectorAll("[data-gsap]");
        if (items.length > 0) {
          gsap.to(items, {
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "play none none none",
            },
            opacity: 1,
            duration: 1,
            scale: 1,
            stagger: {
              each: 0.1,
              from: "random",
            },
            delay: 0.2,
            ease: "power3.out",
          });
        }
      });

      // Auto-refresh triggers when images finish loading to prevent offset shifts
      const refreshTriggers = () => {
        ScrollTrigger.refresh();
      };
      setTimeout(refreshTriggers, 400);
      setTimeout(refreshTriggers, 1200);
      setTimeout(refreshTriggers, 3000);
      window.addEventListener("load", refreshTriggers);
    } catch (err) {
      console.warn("GSAP triggers init skipped", err);
    }
  }

  // 5. Matrix Character Scrambling Effect on Viewport Enter
  let scrambleTimeout: NodeJS.Timeout | null = null;
  let scrambleInterval: NodeJS.Timeout | null = null;
  let isScrambling = false;
  const scrambleTarget = document.querySelector("[data-gsap-list='char']");

  function scrambleText() {
    if (isScrambling) return;
    const charElements = document.querySelectorAll<HTMLElement>(".char");
    if (charElements.length === 0) return;
    isScrambling = true;

    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const originalContents = Array.from(charElements).map((el) => el.textContent || "");

    scrambleInterval = setInterval(() => {
      charElements.forEach((charElement) => {
        const randomIndex = Math.floor(Math.random() * alphabet.length);
        charElement.textContent = alphabet[randomIndex];
      });
    }, 50);

    scrambleTimeout = setTimeout(() => {
      if (scrambleInterval) clearInterval(scrambleInterval);
      charElements.forEach((charElement, index) => {
        charElement.textContent = originalContents[index];
      });
      isScrambling = false;
    }, 500);
  }

  let charObserver: IntersectionObserver | null = null;
  if (scrambleTarget && "IntersectionObserver" in window) {
    charObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0] && entries[0].intersectionRatio > 0) {
          scrambleText();
        }
      },
      { threshold: 0.2 }
    );
    charObserver.observe(scrambleTarget);
  }

  // 6. Section titles animated class on view
  const sectionTitleObservers: IntersectionObserver[] = [];
  const sectionTitles = document.querySelectorAll<HTMLElement>(".xg-heading");
  sectionTitles.forEach((element) => {
    if ("IntersectionObserver" in window) {
      const obs = new IntersectionObserver((entries) => {
        if (entries[0] && entries[0].intersectionRatio > 0) {
          element.classList.add("animated");
        }
      });
      obs.observe(element);
      sectionTitleObservers.push(obs);
    }
  });

  // 7. Real-time Cyberpunk Clock (Digital & Analog)
  let clockTimer: NodeJS.Timeout | null = null;

  function updateClock() {
    const now = new Date();
    const rawHours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const hours = rawHours < 10 ? "0" + rawHours : rawHours.toString();
    const mins = minutes < 10 ? "0" + minutes : minutes.toString();
    const timeString = `${hours}:${mins}`;

    const vgTime = document.querySelector(".vg-time");
    if (vgTime) {
      vgTime.innerHTML = timeString;
    }

    const hourHand = document.querySelector<HTMLElement>(".vg-hour");
    const minuteHand = document.querySelector<HTMLElement>(".vg-minute");
    const secondHand = document.querySelector<HTMLElement>(".vg-second");

    if (hourHand || minuteHand || secondHand) {
      const hours12 = rawHours % 12;
      const hourDeg = hours12 * 30 + 0.5 * minutes;
      const minuteDeg = minutes * 6 + 0.1 * seconds;
      const secondDeg = seconds * 6;

      if (hourHand) hourHand.style.transform = `rotate(${hourDeg}deg)`;
      if (minuteHand) minuteHand.style.transform = `rotate(${minuteDeg}deg)`;
      if (secondHand) secondHand.style.transform = `rotate(${secondDeg}deg)`;
    }

    clockTimer = setTimeout(updateClock, 1000);
  }
  updateClock();

  // 8. Interactive FAQ Accordion
  const faqButtons = document.querySelectorAll<HTMLButtonElement>("#pageContent-sec-faq button");
  const faqHandlers: { btn: HTMLButtonElement; fn: () => void }[] = [];

  faqButtons.forEach((btn) => {
    const fn = () => {
      const targetId = btn.getAttribute("aria-controls");
      if (!targetId) return;
      const targetAnswer = document.getElementById(targetId);
      const isExpanded = btn.getAttribute("aria-expanded") === "true";

      if (isExpanded) {
        btn.setAttribute("aria-expanded", "false");
        if (targetAnswer) targetAnswer.setAttribute("aria-current", "false");
      } else {
        faqButtons.forEach((otherBtn) => {
          if (otherBtn !== btn) {
            otherBtn.setAttribute("aria-expanded", "false");
            const otherId = otherBtn.getAttribute("aria-controls");
            if (otherId) {
              const otherAns = document.getElementById(otherId);
              if (otherAns) otherAns.setAttribute("aria-current", "false");
            }
          }
        });
        btn.setAttribute("aria-expanded", "true");
        if (targetAnswer) targetAnswer.setAttribute("aria-current", "true");
      }
    };

    btn.addEventListener("click", fn);
    faqHandlers.push({ btn, fn });
  });

  // Cleanup handler
  return () => {
    if (rafId !== null) cancelAnimationFrame(rafId);
    if (tickerFn && gsap?.ticker) gsap.ticker.remove(tickerFn);
    if (localLenisInstance?.destroy) localLenisInstance.destroy();
    if (scrambleInterval) clearInterval(scrambleInterval);
    if (scrambleTimeout) clearTimeout(scrambleTimeout);
    if (charObserver) charObserver.disconnect();
    sectionTitleObservers.forEach((obs) => obs.disconnect());
    if (clockTimer) clearTimeout(clockTimer);
    faqHandlers.forEach(({ btn, fn }) => btn.removeEventListener("click", fn));
  };
}
