"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RogApi } from "@/lib/api-client";
import "./RogChatWidget.css";

export default function RogChatWidget({
  variant = "search",
}: {
  variant?: "search" | "greeting";
}) {
  const router = useRouter();
  const [pillVisible, setPillVisible] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [greetingText, setGreetingText] = useState("Xin chào! Bạn đang cần thông tin sản phẩm hoặc muốn so sánh sản phẩm?");

  useEffect(() => {
    RogApi.getSiteConfig()
      .then((cfg) => {
        const configRecord = cfg as Record<string, unknown> | undefined;
        if (configRecord && typeof configRecord.chatGreeting === "string") {
          setGreetingText(configRecord.chatGreeting);
        }
      })
      .catch(() => {});
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/vn/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="rog-chat">
      {pillVisible && (
        <div className="rog-chat-pill">
          {variant === "greeting" ? (
            <Link href="/vn/compare" style={{ textDecoration: "none", color: "inherit" }}>
              <span className="rog-chat-greeting" style={{ cursor: "pointer" }}>
                {greetingText}
              </span>
            </Link>
          ) : (
            <input
              type="text"
              placeholder="Bạn đang tìm kiếm gì? (Enter để tìm)"
              aria-label="Tìm kiếm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          )}
          <button
            type="button"
            className="rog-chat-close"
            aria-label="Đóng"
            onClick={() => setPillVisible(false)}
          >
            ✕
          </button>
        </div>
      )}
      <button
        type="button"
        className="rog-chat-avatar"
        aria-label="Trợ lý ROG Omni"
        onClick={() => setPillVisible((v) => !v)}
      >
        <img
          src="/sites/rog-asus/img/rog-omni-mascot.png"
          alt="Trợ lý ROG Omni"
          className="rog-chat-omni-img"
        />
      </button>
    </div>
  );
}
