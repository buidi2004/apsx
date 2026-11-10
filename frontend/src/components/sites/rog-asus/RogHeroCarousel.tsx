"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { RogApi } from "@/lib/api-client";
import "./RogHeroCarousel.css";

type HeroSlide = {
  desktop: string;
  mobile: string;
  alt: string;
  href: string;
};

const SLIDES: HeroSlide[] = [
  {
    desktop: "https://dlcdnwebimgs.asus.com/gain/D586634C-6408-46BF-BB4B-AF06EDBF59BD/fwebp",
    mobile: "https://dlcdnwebimgs.asus.com/gain/99F76FA2-7E44-4CA8-9284-5EC89ED2E33C/fwebp",
    alt: "ROG GAMESCOM",
    href: "https://rog.asus.com/microsite/gamescom/",
  },
  {
    desktop: "https://dlcdnwebimgs.asus.com/gain/F894F260-5564-43AF-A33C-049D990D95F3/fwebp",
    mobile: "https://dlcdnwebimgs.asus.com/gain/9C20B34F-F2CF-4436-B9F2-3AFF10845635/fwebp",
    alt: "Mua laptop ROG nhận Google AI",
    href: "https://www.asus.com/vn/content/asus-googleai",
  },
  {
    desktop: "https://dlcdnwebimgs.asus.com/gain/7125B6F2-51B8-4BF8-AA63-3FED8B16C987/fwebp",
    mobile: "https://dlcdnwebimgs.asus.com/gain/EB6F5BAB-F386-4D5F-B97A-DE8D695F3AD7/fwebp",
    alt: "SỞ HỮU ROG & TUF GAMING RTX 50 SERIES – NHẬN NGAY TỰA GAME CONTROL RESONANT",
    href: "/vn/events",
  },
  {
    desktop: "https://dlcdnwebimgs.asus.com/gain/26203F8D-C9A9-488F-A58E-7DFDCB2F86BF/fwebp",
    mobile: "https://dlcdnwebimgs.asus.com/gain/840648D0-F438-4808-89B6-4D0FCE7981F5/fwebp",
    alt: "ROG Strix Scar 18 2026",
    href: "/vn/laptops/rog-strix/rog-strix-scar-18-2026",
  },
  {
    desktop: "https://dlcdnwebimgs.asus.com/gain/E8231247-2233-4821-8164-EAF843B875A2/fwebp",
    mobile: "https://dlcdnwebimgs.asus.com/gain/41BB5A2E-D630-488E-A40D-AFD684F77B25/fwebp",
    alt: "ROG Zephyru DUO 2026, laptop gaming 2 màn hình 16\" đầu tiên trên thế giới.",
    href: "/vn/laptops/rog-zephyrus/rog-zephyrus-duo-2026",
  },
  {
    desktop: "https://dlcdnwebimgs.asus.com/gain/BCC7AF59-1775-4DCD-942E-D08A181DC702/fwebp",
    mobile: "https://dlcdnwebimgs.asus.com/gain/63C21BAF-D0EA-45BD-AD91-EC7914CCB423/w430/fwebp",
    alt: "ROG Zephyrus G14 2026 GU405",
    href: "/vn/laptops/rog-zephyrus-series",
  },
];

const INTERVAL_MS = 5000;

export default function RogHeroCarousel() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    RogApi.getHeroSlides().then((data) => {
      if (data && data.length > 0) {
        const mapped = data.map((d): HeroSlide | null => {
          if (!d.src && !d.desktop && !d.mobile) return null;
          return {
            desktop: d.desktop || d.src || "",
            mobile: d.mobile || d.src || "",
            alt: d.alt || "",
            href: d.href || "",
          };
        }).filter((item): item is HeroSlide => item !== null);
        setSlides(mapped);
      }
    });
  }, []);

  const totalSlides = slides.length || 1;

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % totalSlides);
    }, INTERVAL_MS);
  }, [totalSlides]);

  useEffect(() => {
    if (playing) startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [playing, startTimer]);

  const goTo = (i: number) => {
    setActive(i % totalSlides);
    if (playing) startTimer();
  };

  return (
    <section className="rog-hero" aria-label="Banner khuyến mãi">
      {slides.map((slide, i) => (
        <Link
          key={`${slide.desktop}-${i}`}
          className={`rog-hero-slide${i === active ? " rog-hero-slide-active" : ""}`}
          href={slide.href}
          aria-hidden={i !== active}
          tabIndex={i === active ? 0 : -1}
        >
          <picture>
            <source media="(max-width: 768px)" srcSet={slide.mobile} />
            <img
              src={slide.desktop}
              alt={slide.alt}
              loading={i === 0 ? "eager" : "lazy"}
              draggable={false}
            />
          </picture>
        </Link>
      ))}

      <div className="rog-hero-indicators">
        {slides.map((slide, i) => (
          <button
            key={`${slide.desktop}-${i}`}
            type="button"
            aria-label={`Chuyển đến banner ${i + 1}`}
            className="rog-hero-bar"
            onClick={() => goTo(i)}
          >
            {/* red progress fill — animates scaleX 0→1 on the active bar like the source */}
            <span
              key={`${active === i}-${playing}`}
              className={`rog-hero-fill${i === active ? " rog-hero-fill-active" : ""}${
                i === active && !playing ? " rog-hero-fill-paused" : ""
              }`}
            />
          </button>
        ))}
        <button
          type="button"
          className="rog-hero-pause"
          aria-label={playing ? "Tạm dừng tự động chuyển" : "Tự động chuyển tiếp"}
          onClick={() => setPlaying((v) => !v)}
        >
          {playing ? (
            <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true" focusable="false">
              <rect x="3" y="2" width="3.4" height="12" fill="currentColor" />
              <rect x="9.6" y="2" width="3.4" height="12" fill="currentColor" />
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true" focusable="false">
              <path d="M4 2l10 6-10 6V2z" fill="currentColor" />
            </svg>
          )}
        </button>
      </div>
    </section>
  );
}
