import Link from "next/link";
import RogNavbar from "@/components/sites/rog-asus/RogNavbar";
import RogPromoBar from "@/components/sites/rog-asus/RogPromoBar";
import RogFooter from "@/components/sites/rog-asus/RogFooter";

export default function NotFound() {
  return (
    <div className="rog-page">
      <RogNavbar />
      <RogPromoBar />
      <main
        style={{
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "80px 24px",
          background: "radial-gradient(circle at center, #1a0005 0%, #080808 70%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glowing ROG Eye logo watermark */}
        <div
          style={{
            position: "absolute",
            width: "380px",
            height: "200px",
            opacity: 0.08,
            filter: "blur(2px)",
            pointerEvents: "none",
          }}
        >
          <svg viewBox="0 0 70 37" fill="#ff0036">
            <path d="M22.2 29.1c.8.5 1.6 1 2.4 1.4 8.6 3.8 21.3 6.1 23.7 5.3C55 33.6 62.5 19.5 64.8 13c0 0-7 2.8-14.1 6.1-5.9 2.8-12.4 6-12.4 6l16.5-5s-4.4 10.4-10.2 11.6c-5.8 1.2-16-2.9-16-2.9.8-.7 11.6-8.6 36.8-18.9 1.1-.8 1.8-2.1 2-3.4-5.8.6-11.4 2.3-16.7 4.8-10.6 5-28.5 17.8-28.5 17.8zM3.8 24c1.8 2.3 9.2 4.2 10.2 4.4-4.6-3.2-14-12-14-12 1 2.7 2.3 5.2 3.8 7.6z" />
            <path d="M25.6 22.9C30.5 19.3 47.9 4.6 64.7.6c0 0-8.8-1.4-21.3 2.5-4.5 1.4-11 7.7-23.1 19.4-1.6.9-7.5-2.5-10.9-4.1 0 0 5.6 8.9 7.6 11.5 3 4.1 8.5 6.5 8.5 6.5-.5-.5-4.3-4.5-5.4-6.8-.7-1.1.1-2.7 5.5-6.7z" />
          </svg>
        </div>

        <span
          style={{
            color: "#ff0036",
            fontSize: "14px",
            fontWeight: 800,
            letterSpacing: "4px",
            textTransform: "uppercase",
            marginBottom: "16px",
          }}
        >
          {"// ERROR 404 // REBEL PROTOCOL"}
        </span>

        <h1
          style={{
            color: "#ffffff",
            fontSize: "clamp(48px, 8vw, 96px)",
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: "-2px",
            margin: "0 0 16px 0",
            textShadow: "0 0 20px rgba(255, 0, 54, 0.4)",
          }}
        >
          404
        </h1>

        <h2
          style={{
            color: "#ffffff",
            fontSize: "clamp(18px, 3vw, 24px)",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "2px",
            marginBottom: "16px",
          }}
        >
          KHÔNG TÌM THẤY TRANG NÀY
        </h2>

        <p
          style={{
            color: "#999999",
            fontSize: "16px",
            maxWidth: "520px",
            lineHeight: 1.6,
            marginBottom: "36px",
          }}
        >
          Đường dẫn bạn yêu cầu không tồn tại hoặc đã được chuyển sang vũ trụ khác.
          Hãy quay lại trang chủ hoặc khám phá các cỗ máy chiến game mới nhất của ROG.
        </p>

        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#ff0036",
              color: "#ffffff",
              padding: "14px 32px",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              textDecoration: "none",
              borderRadius: "2px",
              boxShadow: "0 0 20px rgba(255, 0, 54, 0.3)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
          >
            VỀ TRANG CHỦ ROG
          </Link>

          <Link
            href="/vn/laptops-group"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              color: "#ffffff",
              padding: "14px 32px",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              textDecoration: "none",
              border: "1px solid #333333",
              borderRadius: "2px",
              transition: "border-color 0.2s, background 0.2s",
            }}
          >
            XEM LAPTOP GAMING
          </Link>
        </div>
      </main>
      <RogFooter />
    </div>
  );
}
