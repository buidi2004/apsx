import type { Metadata } from "next";
import AppleIphoneDuoOverview from "@/components/sites/apple/iphone-duo/AppleIphoneDuoOverview";

export const metadata: Metadata = {
  title: "iPhone Duo - Apple",
  description:
    "Explore iPhone Duo featuring a revolutionary dual-screen design, A19 Pro chip, advanced camera system, and Apple Intelligence.",
  openGraph: {
    title: "iPhone Duo - Apple",
    description:
      "Explore iPhone Duo featuring a revolutionary dual-screen design, A19 Pro chip, advanced camera system, and Apple Intelligence.",
    url: "https://www.apple.com/iphone-duo/",
    siteName: "Apple",
    type: "website",
  },
};

export default function Page() {
  return <AppleIphoneDuoOverview />;
}
