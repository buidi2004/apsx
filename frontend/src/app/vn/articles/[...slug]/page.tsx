import type { Metadata } from "next";
import RogNavbar from "@/components/sites/rog-asus/RogNavbar";
import RogPromoBar from "@/components/sites/rog-asus/RogPromoBar";
import RogArticleDetail from "@/components/sites/rog-asus/RogArticleDetail";
import RogUniversalArticle, {
  fetchRogArticle,
} from "@/components/sites/rog-asus/universal/RogUniversalArticle";
import {
  ARTICLES_DATABASE,
} from "@/components/sites/rog-asus/articles-data";
import RogFooter from "@/components/sites/rog-asus/RogFooter";
import RogChatWidget from "@/components/sites/rog-asus/RogChatWidget";

export function generateStaticParams() {
  return Object.keys(ARTICLES_DATABASE).map((slug) => ({
    slug: slug.split("/"),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const key = slug.join("/");
  const article = ARTICLES_DATABASE[key];

  if (article) {
    return {
      title: `${article.title} | ROG - Republic of Gamers Việt Nam`,
      description: article.lead,
    };
  }

  const online = await fetchRogArticle(key);
  if (online) {
    return {
      title: `${online.title} | ROG - Republic of Gamers Việt Nam`,
      description: online.lead,
    };
  }

  return {
    title: "Bài viết ROG - Republic of Gamers Việt Nam",
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const key = slug.join("/");
  const article = ARTICLES_DATABASE[key];

  return (
    <div className="rog-page">
      <RogNavbar />
      <RogPromoBar />
      <main>
        {article ? (
          <RogArticleDetail article={article} />
        ) : (
          <RogUniversalArticle slug={slug} />
        )}
      </main>
      <RogFooter />
      <RogChatWidget variant="greeting" />
    </div>
  );
}
