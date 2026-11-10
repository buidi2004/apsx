import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./rog-asus.css";
import RogSmoothScrollProvider from "@/components/sites/rog-asus/RogSmoothScrollProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trang Chủ ASUS Republic Of Gamers | Thương Hiệu Gaming Cao Cấp Trên Thế Giới",
  description:
    "Chào mừng đến với website chính thức của ROG - Republic of Gamers. Tìm hiểu thêm về laptop gaming, màn hình, bo mạch chủ, card đồ họa và phụ kiện gaming ROG.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      dir="ltr"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="antialiased">
        <RogSmoothScrollProvider>{children}</RogSmoothScrollProvider>
      </body>
    </html>
  );
}
