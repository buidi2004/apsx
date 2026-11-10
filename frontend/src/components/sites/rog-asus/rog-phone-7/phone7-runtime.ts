/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Official runtime initializer for ROG Phone 7
 * Loads jQuery and features_init.js, sets up 2x retina detection,
 * progressive image unblurring, GSAP ScrollTriggers, and rich interactive controls.
 */

declare global {
  interface Window {
    jQuery?: any;
    $?: any;
    gsap?: any;
    ScrollTrigger?: any;
    cmdLoaded?: boolean;
    cmdJSRwd?: string[];
    isFeaturesRun?: boolean;
    imageFormat?: string;
    featuresRun?: () => void;
  }
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve) => {
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
      console.warn(`[ROG Phone 7] Failed to load ${src}:`, err);
      resolve();
    };
    document.body.appendChild(script);
  });
}

export async function initPhone7Runtime(): Promise<() => void> {
  // 1. Enable 2x WebP retina mode on <html> for maximum sharpness
  if (typeof document !== "undefined") {
    document.documentElement.classList.add("image-webp");
    window.imageFormat = "image-webp";
    window.cmdJSRwd = ["/sites/rog-asus/rog-phone-7/features_async.js"];
  }

  // 2. Load jQuery first
  await loadScript("/sites/rog-asus/scar-18-2026/jquery-3.7.1.min.js");

  // 3. Load features_init.js
  await loadScript("/sites/rog-asus/rog-phone-7/features_init.js");

  // 4. Reveal #CMD and dispatch activation events
  const cmd = document.getElementById("CMD");
  if (cmd) {
    cmd.classList.remove("invisible");
  }
  document.body.dispatchEvent(new Event("cmd-show"));
  document.body.dispatchEvent(new Event("layout-change"));
  window.dispatchEvent(new Event("resize"));

  // Auto-refresh ScrollTrigger after DOM & image stabilization
  const refreshST = () => {
    if (window.ScrollTrigger && typeof window.ScrollTrigger.refresh === "function") {
      window.ScrollTrigger.refresh();
    }
  };
  setTimeout(refreshST, 500);
  setTimeout(refreshST, 1500);
  setTimeout(refreshST, 3500);

  // 5. Progressive Image Observer: ensure all 2x retina images are unblurred
  const progressiveImgs = document.querySelectorAll<HTMLElement>(".img.progressive-image");
  const imgObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove("progressive-image");
          imgObserver.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "600px 0px", threshold: 0 }
  );
  progressiveImgs.forEach((img) => imgObserver.observe(img));

  // 6. Sidenav smooth scroll & active section tracking
  const sidenavLinks = document.querySelectorAll<HTMLElement>(
    ".cmd-sidenav .container-items .item, .cmd-sidenav .item-dot"
  );
  const handleSidenavClick = (e: MouseEvent) => {
    e.preventDefault();
    const target = e.currentTarget as HTMLElement;
    const dot = target.classList.contains("item-dot")
      ? target
      : target.querySelector<HTMLElement>(".item-dot");
    const sectionId = dot?.getAttribute("data-sectionid");
    if (!sectionId) return;

    const el = document.querySelector(sectionId);
    if (el) {
      if ((window as any).__lenis) {
        (window as any).__lenis.scrollTo(el as HTMLElement, { offset: -60 });
      } else {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };
  sidenavLinks.forEach((link) => link.addEventListener("click", handleSidenavClick as any));

  // Sidenav collapse toggle
  const collapseOpen = document.querySelector<HTMLElement>(".cmd-sidenav .collapse-open");
  const collapseClose = document.querySelector<HTMLElement>(".cmd-sidenav .collapse-close");
  const sidenavContainer = document.querySelector<HTMLElement>(".cmd-sidenav .sidenav-container");

  const toggleSidenav = (e: MouseEvent) => {
    e.preventDefault();
    if (collapseOpen && collapseClose && sidenavContainer) {
      const isOpen = collapseOpen.classList.contains("active");
      if (isOpen) {
        collapseOpen.classList.remove("active");
        collapseClose.classList.add("active");
        sidenavContainer.classList.add("collapsed");
      } else {
        collapseOpen.classList.add("active");
        collapseClose.classList.remove("active");
        sidenavContainer.classList.remove("collapsed");
      }
    }
  };
  collapseOpen?.addEventListener("click", toggleSidenav as any);
  collapseClose?.addEventListener("click", toggleSidenav as any);

  // 7. Scroll-to-top button
  const toTopBtn = document.querySelector<HTMLElement>(".btn-to-top");
  const handleScroll = () => {
    if (toTopBtn) {
      if (window.scrollY > 500) {
        toTopBtn.style.opacity = "1";
        toTopBtn.style.pointerEvents = "auto";
      } else {
        toTopBtn.style.opacity = "0";
        toTopBtn.style.pointerEvents = "none";
      }
    }
  };
  window.addEventListener("scroll", handleScroll, { passive: true });
  toTopBtn?.addEventListener("click", () => {
    if ((window as any).__lenis) {
      (window as any).__lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  // 8. Interactive KSP buttons in Section 3
  const kspItems = document.querySelectorAll<HTMLElement>("#section__3 .item-container");
  const handleKspClick = (e: MouseEvent) => {
    const item = (e.currentTarget as HTMLElement);
    const targetId = item.getAttribute("data-target") || item.querySelector("a")?.getAttribute("href");
    if (targetId && targetId.startsWith("#")) {
      e.preventDefault();
      const el = document.querySelector(targetId);
      if (el) {
        if ((window as any).__lenis) {
          (window as any).__lenis.scrollTo(el as HTMLElement, { offset: -60 });
        } else {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }
  };
  kspItems.forEach((item) => item.addEventListener("click", handleKspClick as any));

  // 9. Interactive Section 18 Armoury Crate / Game Genie slider
  const s18Tabs = document.querySelectorAll<HTMLElement>("#section__18 .slick__nav .nav-item");
  const s18Slides = document.querySelectorAll<HTMLElement>("#section__18 .slick-info-container .info-item");
  s18Tabs.forEach((tab, idx) => {
    tab.addEventListener("click", () => {
      s18Tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      s18Slides.forEach((slide, sIdx) => {
        if (sIdx === idx) {
          slide.classList.add("active");
          slide.style.display = "block";
        } else {
          slide.classList.remove("active");
          slide.style.display = "none";
        }
      });
    });
  });

  // Cleanup handler
  return () => {
    window.removeEventListener("scroll", handleScroll);
    progressiveImgs.forEach((img) => imgObserver.unobserve(img));
  };
}
