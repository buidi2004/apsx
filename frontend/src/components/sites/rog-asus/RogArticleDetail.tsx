/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import "./RogArticleDetail.css";
import { ARTICLES_DATABASE, type ArticleData } from "./articles-data";


export default function RogArticleDetail({ article }: { article: ArticleData }) {
  const otherArticles = Object.values(ARTICLES_DATABASE).filter(
    (a) => a.slug !== article.slug
  ).slice(0, 3);

  return (
    <article className="rog-art-page">
      {/* breadcrumb */}
      <div className="rog-art-breadcrumb">
        <Link href="/">Trang chủ</Link>
        <span>›</span>
        <Link href="/vn/articles">Bài viết</Link>
        <span>›</span>
        <span>{article.categoryLabel.replace("// ", "")}</span>
      </div>

      <div className="rog-art-container">
        {/* article header */}
        <header className="rog-art-header">
          <div className="rog-art-tag">{article.categoryLabel}</div>
          <h1 className="rog-art-title">{article.title}</h1>
          <div className="rog-art-meta">
            <span className="rog-art-author">Tác giả: ROG Editor</span>
            <span>·</span>
            <span>{article.date}</span>
            <span>·</span>
            <span>{article.readTime}</span>
          </div>
        </header>

        {/* featured image */}
        <div className="rog-art-featured-media">
          <img src={article.image} alt={article.title} />
        </div>

        {/* article body */}
        <div className="rog-art-body">
          <p className="rog-art-lead" style={{ fontSize: "19px", fontWeight: 500, color: "#fff", lineHeight: 1.7 }}>
            {article.lead}
          </p>

          {article.sections.map((sec, idx) => (
            <section key={idx}>
              {sec.heading && <h2>{sec.heading}</h2>}
              {sec.subheading && <h3>{sec.subheading}</h3>}
              {sec.paragraphs.map((p, pIdx) => (
                <p key={pIdx}>{p}</p>
              ))}
              {sec.callout && (
                <div className="rog-art-callout">
                  <p>{sec.callout}</p>
                </div>
              )}
              {sec.bullets && (
                <ul>
                  {sec.bullets.map((b, bIdx) => (
                    <li key={bIdx}>{b}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        {/* related articles */}
        {otherArticles.length > 0 && (
          <section className="rog-art-related" style={{ marginTop: "48px", borderTop: "1px solid #222", paddingTop: "32px" }}>
            <h3 style={{ color: "#fff", fontSize: "20px", fontWeight: 700, marginBottom: "20px", textTransform: "uppercase", letterSpacing: "1px" }}>
              BÀI VIẾT LIÊN QUAN
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
              {otherArticles.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/vn/articles/${rel.slug}`}
                  style={{
                    display: "block",
                    background: "#111",
                    border: "1px solid #222",
                    borderRadius: "4px",
                    overflow: "hidden",
                    textDecoration: "none",
                    transition: "transform 0.2s, border-color 0.2s",
                  }}
                >
                  <img
                    src={rel.image}
                    alt={rel.title}
                    style={{ width: "100%", height: "160px", objectFit: "cover" }}
                  />
                  <div style={{ padding: "16px" }}>
                    <span style={{ color: "#ff0036", fontSize: "12px", fontWeight: 700, textTransform: "uppercase" }}>
                      {rel.categoryLabel}
                    </span>
                    <h4
                      style={{
                        color: "#fff",
                        fontSize: "14px",
                        fontWeight: 600,
                        marginTop: "8px",
                        lineHeight: 1.4,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {rel.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* footer nav */}
        <div className="rog-art-footer-nav">
          <Link href="/vn/articles" className="rog-art-back-btn">
            ← TẤT CẢ BÀI VIẾT
          </Link>
          <Link href="/" className="rog-art-back-btn">
            VỀ TRANG CHỦ ROG
          </Link>
        </div>
      </div>
    </article>
  );
}
