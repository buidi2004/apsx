import type { Metadata } from "next";
import AppleIphone18ProOverview from "@/components/sites/apple/iphone-18-pro/AppleIphone18ProOverview";

export const metadata: Metadata = {
  title: "iPhone 18 Pro và iPhone 18 Pro Max - Apple (VN)",
  description:
    "iPhone 18 Pro và iPhone 18 Pro Max. Thiết kế cho Apple Intelligence. Trang bị chip A19 Pro, Điều Khiển Camera, 4K 120 fps Dolby Vision và thời lượng pin đột phá.",
  openGraph: {
    title: "iPhone 18 Pro và iPhone 18 Pro Max - Apple (VN)",
    description:
      "iPhone 18 Pro và iPhone 18 Pro Max. Thiết kế cho Apple Intelligence. Trang bị chip A19 Pro, Điều Khiển Camera, 4K 120 fps Dolby Vision và thời lượng pin đột phá.",
    url: "https://www.apple.com/vn/iphone-18-pro/",
    siteName: "Apple (Việt Nam)",
    type: "website",
  },
};

export default function Page() {
  return <AppleIphone18ProOverview />;
}
