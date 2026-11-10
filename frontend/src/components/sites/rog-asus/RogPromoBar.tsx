"use client";

import { useEffect, useState } from "react";
import { RogApi } from "@/lib/api-client";
import "./RogPromoBar.css";

const DEFAULT_PROMO = {
  text: "Mua Ngay Laptop Gaming AI ROG RTX 50 Series!",
  url: "/vn/store",
};

export default function RogPromoBar() {
  const [promo, setPromo] = useState(DEFAULT_PROMO);

  useEffect(() => {
    RogApi.getSiteConfig().then((cfg) => {
      if (cfg?.promoBar?.text) {
        setPromo({
          text: cfg.promoBar.text,
          url: cfg.promoBar.url || "/vn/store",
        });
      }
    });
  }, []);

  return (
    <a
      className="rog-promo"
      href={promo.url}
      target="_blank"
      rel="noreferrer"
    >
      {promo.text}
    </a>
  );
}
