import type { Metadata } from "next";
import AppleMacbookProProledOverview from "@/components/sites/apple/macbook-pro-proled/AppleMacbookProProledOverview";

export const metadata: Metadata = {
  title: "MacBook Pro with PROLED XDR Display - Apple",
  description:
    "MacBook Pro with PROLED XDR Display has the world’s best laptop display. Featuring the M5 Pro or M5 Max chip, it’s a powerful platform for AI.",
  openGraph: {
    title: "MacBook Pro with PROLED XDR Display - Apple",
    description:
      "MacBook Pro with PROLED XDR Display has the world’s best laptop display. Featuring the M5 Pro or M5 Max chip, it’s a powerful platform for AI.",
    url: "https://www.apple.com/macbook-pro/proled-xdr-display/",
    siteName: "Apple",
    images: [
      {
        url: "https://www.apple.com/v/macbook-pro/proled-xdr-display/a/images/meta/mbp_proled_xdr__f7755bx607yq_og.png",
        width: 1200,
        height: 630,
        alt: "MacBook Pro with PROLED XDR Display",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MacBook Pro with PROLED XDR Display - Apple",
    description:
      "MacBook Pro with PROLED XDR Display has the world’s best laptop display. Featuring the M5 Pro or M5 Max chip, it’s a powerful platform for AI.",
    images: [
      "https://www.apple.com/v/macbook-pro/proled-xdr-display/a/images/meta/mbp_proled_xdr__f7755bx607yq_og.png",
    ],
  },
};

export default function Page() {
  return <AppleMacbookProProledOverview />;
}
