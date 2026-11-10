import type { Metadata } from "next";
import AppleIphone18ProOverview from "@/components/sites/apple/iphone-18-pro/AppleIphone18ProOverview";

export const metadata: Metadata = {
  title: "iPhone 18 Pro and iPhone 18 Pro Max - Apple",
  description:
    "iPhone 18 Pro and iPhone 18 Pro Max. Built for Apple Intelligence. Featuring A19 Pro chip, Camera Control, 4K 120 fps Dolby Vision, and groundbreaking battery life.",
  openGraph: {
    title: "iPhone 18 Pro and iPhone 18 Pro Max - Apple",
    description:
      "iPhone 18 Pro and iPhone 18 Pro Max. Built for Apple Intelligence. Featuring A19 Pro chip, Camera Control, 4K 120 fps Dolby Vision, and groundbreaking battery life.",
    url: "https://www.apple.com/iphone-18-pro/",
    siteName: "Apple",
    type: "website",
  },
};

export default function Page() {
  return <AppleIphone18ProOverview />;
}
