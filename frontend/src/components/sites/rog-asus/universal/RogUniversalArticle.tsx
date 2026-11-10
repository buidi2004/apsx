/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { redirect } from "next/navigation";
import { fetchArticleDetail } from "@/lib/rogBackend";
import "./RogUniversalArticle.css";

interface Props {
  slug: string[];
}

export interface CachedArticle {
  title: string;
  lead: string;
  date: string;
  image: string;
  category: string;
  contentHtml: string;
}

export async function fetchRogArticle(slugPath: string): Promise<CachedArticle | null> {
  const backendArticle = await fetchArticleDetail(slugPath);
  if (!backendArticle?.contentHtml) return null;
  return backendArticle;
}

export default async function RogUniversalArticle({ slug }: Props) {
  const slugPath = slug.join("/");
  const article = await fetchRogArticle(slugPath);

  if (!article) {
    redirect("/vn/articles");
  }

  return (
    <article className="rog-art-page">
      <div className="rog-art-breadcrumb">
        <Link href="/">Trang chủ</Link>
        <span>›</span>
        <Link href="/vn/articles">Bài viết</Link>
        <span>›</span>
        <span>{article.category}</span>
      </div>

      <div className="rog-art-container">
        <header className="rog-art-header">
          <div className="rog-art-tag">{"// "}{article.category}</div>
          <h1 className="rog-art-title">{article.title}</h1>
          <div className="rog-art-meta">
            <span className="rog-art-author">Tác giả: ROG Editor</span>
            <span>·</span>
            <span>{article.date}</span>
          </div>
        </header>

        {article.image && (
          <div className="rog-art-featured-media">
            <img src={article.image} alt={article.title} />
          </div>
        )}

        <div className="rog-art-body">
          {article.lead && (
            <p
              className="rog-art-lead"
              style={{
                fontSize: "19px",
                fontWeight: 500,
                color: "#fff",
                lineHeight: 1.7,
                marginBottom: "2rem",
              }}
            >
              {article.lead}
            </p>
          )}

          <div
            className="rog-universal-article-content"
            dangerouslySetInnerHTML={{ __html: article.contentHtml }}
          />
        </div>
      </div>
    </article>
  );
}
