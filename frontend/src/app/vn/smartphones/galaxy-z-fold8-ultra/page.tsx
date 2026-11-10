import type { Metadata } from "next";
import SamsungGalaxyZFold8UltraOverview from "@/components/sites/samsung/galaxy-z-fold8-ultra/SamsungGalaxyZFold8UltraOverview";

export const metadata: Metadata = {
  title: "Samsung Galaxy Z Fold 8 Ultra - Đa nhiệm Chia đôi màn hình & Galaxy AI | Samsung Việt Nam",
  description:
    "Samsung Galaxy Z Fold8 Ultra – Đa nhiệm dễ dàng với chế độ chia màn hình đôi và ba, màn hình Flex Titanium cùng tính năng Galaxy AI Now Nudge. Khám phá trọn bộ tính năng tại Samsung Việt Nam.",
  openGraph: {
    title: "Samsung Galaxy Z Fold 8 Ultra - Đa nhiệm Chia đôi màn hình & Galaxy AI | Samsung Việt Nam",
    description:
      "Samsung Galaxy Z Fold8 Ultra – Đa nhiệm dễ dàng với chế độ chia màn hình đôi và ba, màn hình Flex Titanium cùng tính năng Galaxy AI Now Nudge.",
    url: "https://www.samsung.com/vn/smartphones/galaxy-z-fold8-ultra/",
    siteName: "Samsung Việt Nam",
    type: "website",
  },
};

export default function Page() {
  return <SamsungGalaxyZFold8UltraOverview />;
}
