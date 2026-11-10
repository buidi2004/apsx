"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import "./RogChatWidget.css";

export default function RogChatWidget({
  variant = "search",
}: {
  variant?: "search" | "greeting";
}) {
  const [pillVisible, setPillVisible] = useState(true);

  return (
    <div className="rog-chat">
      {pillVisible && (
        <div className="rog-chat-pill">
          {variant === "greeting" ? (
            <span className="rog-chat-greeting">
              Xin chào! Bạn đang cần thông tin sản phẩm hoặc muốn so sánh sản
              phẩm?
            </span>
          ) : (
            <input
              type="text"
              placeholder="Bạn đang tìm kiếm gì?"
              aria-label="Tìm kiếm"
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
      <button type="button" className="rog-chat-avatar" aria-label="Trợ lý ROG">
        <img
          src="/sites/rog-asus/img/rog-omni-mascot.png"
          alt="Trợ lý ROG Omni"
          className="rog-chat-omni-img"
        />
      </button>
    </div>
  );
}
