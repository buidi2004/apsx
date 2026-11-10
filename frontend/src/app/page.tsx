import RogNavbar from "@/components/sites/rog-asus/RogNavbar";
import RogPromoBar from "@/components/sites/rog-asus/RogPromoBar";
import RogHeroCarousel from "@/components/sites/rog-asus/RogHeroCarousel";
import RogProductCategories from "@/components/sites/rog-asus/RogProductCategories";
import RogHighlights from "@/components/sites/rog-asus/RogHighlights";
import RogJoinRepublic from "@/components/sites/rog-asus/RogJoinRepublic";
import RogFooter from "@/components/sites/rog-asus/RogFooter";
import RogChatWidget from "@/components/sites/rog-asus/RogChatWidget";

export default function Home() {
  return (
    <div className="rog-page">
      <RogNavbar />
      <RogPromoBar />
      <main>
        <RogHeroCarousel />
        <RogProductCategories />
        <RogHighlights />
        <RogJoinRepublic />
      </main>
      <RogFooter />
      <RogChatWidget />
    </div>
  );
}
