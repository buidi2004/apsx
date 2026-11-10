import type { Metadata } from "next";
import AppleIpadProOverview from "@/components/sites/apple/ipad-pro/AppleIpadProOverview";

export const metadata: Metadata = {
  title: "iPad Pro - Apple (VN)",
  description:
    "iPad Pro sở hữu chip M5 với Apple Intelligence, pin dùng cả ngày, màn hình 11 inch hoặc 13 inch, Wi-Fi 7, 5G và hỗ trợ Apple Pencil Pro.",
  openGraph: {
    title: "iPad Pro - Apple (VN)",
    description:
      "iPad Pro sở hữu chip M5 với Apple Intelligence, pin dùng cả ngày, màn hình 11 inch hoặc 13 inch, Wi-Fi 7, 5G và hỗ trợ Apple Pencil Pro.",
    url: "https://www.apple.com/vn/ipad-pro/",
    siteName: "Apple (Việt Nam)",
    type: "website",
  },
};

export default function Page() {
  return <AppleIpadProOverview />;
}
