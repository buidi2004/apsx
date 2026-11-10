import type { Metadata } from "next";
import SamsungGalaxyZFold8UltraOverview from "@/components/sites/samsung/galaxy-z-fold8-ultra/SamsungGalaxyZFold8UltraOverview";

export const metadata: Metadata = {
  title: "Samsung Galaxy Z Fold 8 Ultra - Multitasking & Galaxy AI | Samsung",
  description:
    "Samsung Galaxy Z Fold8 Ultra – Seamless multitasking with Split Screen, Flex Titanium display, and Galaxy AI Now Nudge.",
  openGraph: {
    title: "Samsung Galaxy Z Fold 8 Ultra - Multitasking & Galaxy AI | Samsung",
    description:
      "Samsung Galaxy Z Fold8 Ultra – Seamless multitasking with Split Screen, Flex Titanium display, and Galaxy AI Now Nudge.",
    url: "https://www.samsung.com/smartphones/galaxy-z-fold8-ultra/",
    siteName: "Samsung",
    type: "website",
  },
};

export default function Page() {
  return <SamsungGalaxyZFold8UltraOverview />;
}
