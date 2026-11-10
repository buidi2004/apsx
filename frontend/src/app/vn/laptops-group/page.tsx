import type { Metadata } from "next";
import RogNavbar from "@/components/sites/rog-asus/RogNavbar";
import RogPromoBar from "@/components/sites/rog-asus/RogPromoBar";
import RogProductHome from "@/components/sites/rog-asus/RogProductHome";
import RogFooter from "@/components/sites/rog-asus/RogFooter";
import RogChatWidget from "@/components/sites/rog-asus/RogChatWidget";

export const metadata: Metadata = {
  title: "Gaming Laptop Gaming ASUS ROG｜ROG - Republic of Gamers｜Việt Nam",
  description:
    "Khám phá các dòng Laptop Gaming ASUS ROG đỉnh cao: ROG Strix, ROG Zephyrus, ROG Flow trang bị RTX 50 Series, Intel Core Ultra và AMD Ryzen AI.",
};

export default function LaptopsGroupPage() {
  return (
    <div className="rog-page">
      <RogNavbar />
      <RogPromoBar />
      <main>
        <RogProductHome group="laptops-group" />
      </main>
      <RogFooter />
      <RogChatWidget variant="greeting" />
    </div>
  );
}
