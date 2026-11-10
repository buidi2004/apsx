import type { Metadata } from "next";
import AppleMacbookProProledOverview from "@/components/sites/apple/macbook-pro-proled/AppleMacbookProProledOverview";

export const metadata: Metadata = {
  title: "MacBook Pro với Màn hình PROLED XDR - Apple (VN)",
  description:
    "MacBook Pro với Màn hình PROLED XDR sở hữu màn hình máy tính xách tay tốt nhất thế giới. Trang bị chip M5 Pro hoặc M5 Max, đây là nền tảng mạnh mẽ cho AI.",
  openGraph: {
    title: "MacBook Pro với Màn hình PROLED XDR - Apple (VN)",
    description:
      "MacBook Pro với Màn hình PROLED XDR sở hữu màn hình máy tính xách tay tốt nhất thế giới. Trang bị chip M5 Pro hoặc M5 Max, đây là nền tảng mạnh mẽ cho AI.",
    url: "https://www.apple.com/vn/macbook-pro/proled-xdr-display/",
    siteName: "Apple (Việt Nam)",
    type: "website",
  },
};

export default function Page() {
  return <AppleMacbookProProledOverview />;
}
