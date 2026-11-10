import type { Metadata } from "next";
import RogNavbar from "@/components/sites/rog-asus/RogNavbar";
import RogPromoBar from "@/components/sites/rog-asus/RogPromoBar";
import RogArticleListing from "@/components/sites/rog-asus/RogArticleListing";
import RogListingExtra from "@/components/sites/rog-asus/RogListingExtra";
import RogFooter from "@/components/sites/rog-asus/RogFooter";
import RogChatWidget from "@/components/sites/rog-asus/RogChatWidget";

export const metadata: Metadata = {
  title: "Bài viết | Trang Chủ ASUS Republic Of Gamers | Thương Hiệu Gaming Cao Cấp Trên Thế Giới",
  description:
    "Tin tức về phần cứng chơi game ROG mới nhất, cùng với các mẹo và hướng dẫn để tối ưu hóa thiết bị lập PC hoặc máy tính xách tay chơi game của bạn.",
};

export default function ArticlesPage() {
  return (
    <div className="rog-page">
      <RogNavbar />
      <RogPromoBar />
      <main>
        <RogArticleListing />
        <RogListingExtra />
      </main>
      <RogFooter />
      <RogChatWidget variant="greeting" />
    </div>
  );
}

