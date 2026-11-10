import type { Metadata } from "next";
import AppleIphoneDuoOverview from "@/components/sites/apple/iphone-duo/AppleIphoneDuoOverview";

export const metadata: Metadata = {
  title: "iPhone Duo - Apple (VN)",
  description:
    "Khám phá iPhone Duo với thiết kế màn hình kép đột phá, chip A19 Pro, hệ thống camera chuyên nghiệp và Apple Intelligence.",
  openGraph: {
    title: "iPhone Duo - Apple (VN)",
    description:
      "Khám phá iPhone Duo với thiết kế màn hình kép đột phá, chip A19 Pro, hệ thống camera chuyên nghiệp và Apple Intelligence.",
    url: "https://www.apple.com/vn/iphone-duo/",
    siteName: "Apple (Việt Nam)",
    type: "website",
  },
};

export default function Page() {
  return <AppleIphoneDuoOverview />;
}
