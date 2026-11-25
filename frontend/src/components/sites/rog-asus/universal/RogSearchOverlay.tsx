"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import productIndex from "./all-products-search-index.json";
import { ROG_ARTICLES } from "@/components/sites/rog-asus/articles-data";

interface SearchProduct {
  id: number;
  partNo: string;
  title: string;
  subName: string;
  img: string;
  link: string;
  price: string;
  specs: string;
}

interface RogSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RogSearchOverlay({ isOpen, onClose }: RogSearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [matchedProducts, setMatchedProducts] = useState<SearchProduct[]>([]);
  const [matchedArticles, setMatchedArticles] = useState<typeof ROG_ARTICLES>([]);
  const [onlineFaqs, setOnlineFaqs] = useState<{ id: number; name: string; url: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setMatchedProducts([]);
      setMatchedArticles([]);
      setOnlineFaqs([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Instant local search + debounced remote search
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      setMatchedProducts([]);
      setMatchedArticles([]);
      setOnlineFaqs([]);
      return;
    }

    // Local instant filtering across 434 products
    const prods = (productIndex as SearchProduct[]).filter((p) => {
      const fullText = `${p.title} ${p.subName} ${p.specs} ${p.partNo}`.toLowerCase();
      return fullText.includes(q);
    }).slice(0, 8);
    setMatchedProducts(prods);

    // Local instant filtering across articles
    const arts = ROG_ARTICLES.filter((a) => {
      const fullText = `${a.title} ${a.excerpt} ${a.category}`.toLowerCase();
      return fullText.includes(q);
    }).slice(0, 5);
    setMatchedArticles(arts);

    // Deep online search call via server API proxy for FAQs & campaigns
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/rog-search-suggest?q=${encodeURIComponent(q)}`
        );
        if (res.ok) {
          const json = await res.json();
          const obj = json.result?.obj || [];
          const faqBlock = obj.find((x: { type: string }) => x.type === "faq");
          if (faqBlock && Array.isArray(faqBlock.items)) {
            setOnlineFaqs(faqBlock.items.slice(0, 4));
          }
        }
      } catch {
        // Fallback gracefully
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      router.push(`/vn/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const highlightMatch = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const parts = text.split(new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={i} className="highlightText" style={{ color: "#ff0036", fontWeight: "bold" }}>
              {part}
            </span>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search, type and press enter to search"
      className="searchHeaderPanel SearchHeaderPanel__searchHeaderPanel__WSEdM"
      id="searchHeaderPanel"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        zIndex: 99999,
        backgroundColor: "rgba(0, 0, 0, 0.95)",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        className="SearchHeaderPanel__panelContainer__ReqkH"
        style={{
          width: "100%",
          maxWidth: "1200px",
          padding: "32px 24px 60px",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Top Input Bar */}
        <form onSubmit={handleSubmit} style={{ width: "100%", marginBottom: "32px" }}>
          <div
            className="SearchHeaderPanel__container__2QudB SearchHeaderPanel__searchInputContainer__scpcF SearchHeaderPanel__fadeIn__SejVW"
            style={{
              display: "flex",
              alignItems: "center",
              borderBottom: "2px solid #ff0036",
              paddingBottom: "12px",
            }}
          >
            <div
              className="SearchHeaderPanel__inputWrapper__4HU1Q"
              style={{
                display: "flex",
                alignItems: "center",
                flex: 1,
                gap: "16px",
              }}
            >
              <div className="SearchHeaderPanel__searchIcon__DrTZg">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  role="presentation"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M16.045 16.645a7.5 7.5 0 11.707-.707l4.254 4.254-.707.707-4.254-4.254zm-.342-1.049A6.5 6.5 0 106.51 6.404a6.5 6.5 0 009.193 9.192z"
                    fill="#ff0036"
                  />
                </svg>
              </div>
              <input
                ref={inputRef}
                name="search"
                id="search"
                type="text"
                role="combobox"
                aria-expanded={matchedProducts.length > 0 || matchedArticles.length > 0}
                autoComplete="off"
                placeholder="Tìm kiếm laptop, màn hình, card đồ họa, phụ kiện ROG..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#ffffff",
                  fontSize: "22px",
                  fontWeight: 600,
                  fontFamily: "'Roboto Condensed', sans-serif",
                }}
              />
            </div>
            <button
              tabIndex={0}
              type="button"
              aria-label="Cancel Search"
              className="SearchHeaderPanel__closeButton__7XL2B"
              onClick={onClose}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4.647 5.353l.707-.707L12 11.293l6.646-6.647.708.707L12.708 12l6.647 6.647-.708.707-6.646-6.647-6.647 6.647-.707-.707L11.293 12 4.647 5.353z"
                  fill="#c0c0c0"
                />
              </svg>
            </button>
          </div>
        </form>

        {/* Suggestion & Results Container */}
        <div id="headerSearchSuggestionPanel" className="SearchHeaderPanel__container__2QudB">
          {query.trim().length === 0 ? (
            /* Quick Trending Searches */
            <div style={{ color: "#888", fontSize: "14px" }}>
              <p style={{ textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px", color: "#666" }}>
                Gợi ý tìm kiếm phổ biến
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {[
                  "ROG Zephyrus G16",
                  "ROG Strix SCAR 18",
                  "ROG Ally",
                  "RTX 5090",
                  "ROG Maximus",
                  "Màn hình OLED 240Hz",
                  "Bàn phím ROG Azoth",
                  "ROG Phone",
                ].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    style={{
                      background: "#181818",
                      border: "1px solid #333",
                      color: "#ddd",
                      padding: "8px 16px",
                      borderRadius: "0px",
                      cursor: "pointer",
                      fontSize: "13px",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#ff0036";
                      e.currentTarget.style.color = "#ff0036";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#333";
                      e.currentTarget.style.color = "#ddd";
                    }}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              {/* Product Section */}
              {matchedProducts.length > 0 && (
                <div role="listbox" aria-label="product" className="SearchHeaderPanel__exploreResultBlock__gLg9J">
                  <p
                    role="presentation"
                    className="SearchHeaderPanel__title__wb2c2"
                    style={{
                      color: "#ff0036",
                      fontSize: "12px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "1.5px",
                      marginBottom: "16px",
                      borderBottom: "1px solid #222",
                      paddingBottom: "8px",
                    }}
                  >
                    SẢN PHẨM ({matchedProducts.length})
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                      gap: "16px",
                    }}
                  >
                    {matchedProducts.map((p) => (
                      <Link
                        key={p.partNo || p.title}
                        role="option"
                        aria-label={p.title}
                        href={p.link}
                        onClick={onClose}
                        className="SearchHeaderPanel__searchResultItem__wTTlb"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "16px",
                          padding: "12px",
                          background: "#111",
                          border: "1px solid #222",
                          textDecoration: "none",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "#ff0036";
                          e.currentTarget.style.background = "#181818";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "#222";
                          e.currentTarget.style.background = "#111";
                        }}
                      >
                        {p.img && (
                          <img
                            src={p.img}
                            alt={p.title}
                            style={{ width: "64px", height: "48px", objectFit: "contain", flexShrink: 0 }}
                          />
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              color: "#fff",
                              fontSize: "14px",
                              fontWeight: 600,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {highlightMatch(p.title, query)}
                          </div>
                          {p.subName && (
                            <div style={{ color: "#888", fontSize: "12px", marginTop: "2px" }}>{p.subName}</div>
                          )}
                          {p.price && (
                            <div style={{ color: "#ff0036", fontSize: "12px", fontWeight: 700, marginTop: "4px" }}>
                              {p.price}
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Articles Section */}
              {matchedArticles.length > 0 && (
                <div role="listbox" aria-label="articles" className="SearchHeaderPanel__exploreResultBlock__gLg9J">
                  <p
                    role="presentation"
                    className="SearchHeaderPanel__title__wb2c2"
                    style={{
                      color: "#ff0036",
                      fontSize: "12px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "1.5px",
                      marginBottom: "16px",
                      borderBottom: "1px solid #222",
                      paddingBottom: "8px",
                    }}
                  >
                    BÀI VIẾT & TIN TỨC ({matchedArticles.length})
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {matchedArticles.map((a) => (
                      <Link
                        key={a.slug}
                        role="option"
                        aria-label={a.title}
                        href={`/vn/articles/${a.slug}`}
                        onClick={onClose}
                        className="SearchHeaderPanel__searchResultItem__wTTlb"
                        style={{
                          color: "#ccc",
                          fontSize: "14px",
                          textDecoration: "none",
                          padding: "10px 14px",
                          background: "#111",
                          border: "1px solid #222",
                          transition: "all 0.2s ease",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "#ff0036";
                          e.currentTarget.style.color = "#fff";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "#222";
                          e.currentTarget.style.color = "#ccc";
                        }}
                      >
                        <span>{highlightMatch(a.title, query)}</span>
                        <span style={{ color: "#666", fontSize: "11px", textTransform: "uppercase" }}>
                          {a.category}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Online FAQ Section */}
              {onlineFaqs.length > 0 && (
                <div role="listbox" aria-label="faq" className="SearchHeaderPanel__exploreResultBlock__gLg9J">
                  <p
                    role="presentation"
                    className="SearchHeaderPanel__title__wb2c2"
                    style={{
                      color: "#ff0036",
                      fontSize: "12px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "1.5px",
                      marginBottom: "16px",
                      borderBottom: "1px solid #222",
                      paddingBottom: "8px",
                    }}
                  >
                    HỖ TRỢ / FAQ
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {onlineFaqs.map((faq) => (
                      <a
                        key={faq.id}
                        role="option"
                        aria-label={faq.name}
                        href={faq.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="SearchHeaderPanel__searchResultItem__wTTlb"
                        style={{
                          color: "#aaa",
                          fontSize: "13px",
                          textDecoration: "none",
                          padding: "8px 12px",
                          background: "#111",
                          border: "1px solid #1a1a1a",
                          transition: "color 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "#ff0036";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "#aaa";
                        }}
                      >
                        {highlightMatch(faq.name, query)}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* View all button */}
              <div style={{ textAlign: "center", marginTop: "16px" }}>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="btn ButtonRed__btnRed__SXGza"
                  style={{
                    background: "#ff0036",
                    color: "#fff",
                    border: "none",
                    padding: "12px 36px",
                    cursor: "pointer",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    fontSize: "13px",
                    letterSpacing: "1px",
                  }}
                >
                  Xem tất cả kết quả cho &quot;{query}&quot;
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dark backdrop click to close */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className="SearchHeaderPanel__mask__x2kfj"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
          background: "transparent",
        }}
      />
    </div>
  );
}
