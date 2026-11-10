"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import RogNavbar from "@/components/sites/rog-asus/RogNavbar";
import RogPromoBar from "@/components/sites/rog-asus/RogPromoBar";
import RogFooter from "@/components/sites/rog-asus/RogFooter";
import RogChatWidget from "@/components/sites/rog-asus/RogChatWidget";
import { RogApi } from "@/lib/api-client";

type Dealer = {
  name: string;
  type: string;
  city: "hcm" | "hn" | "danang" | "all";
  cityLabel: string;
  address: string;
  hotline: string;
  website: string;
  badge?: string;
};

export default function WhereToBuyPage() {
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [filterCity, setFilterCity] = useState<string>("all");

  useEffect(() => {
    RogApi.getDealers().then((beDealers) => {
      if (beDealers && beDealers.length > 0) {
        // Merge BE dealers
        const mapped: Dealer[] = beDealers.map((d) => {
          return {
            name: d.name.toUpperCase(),
            type: d.isOfficialPartner ? "Đại Lý Ủy Quyền Chính Thức ROG" : "Đại Lý Bán Lẻ Công Nghệ",
            city: d.cityCoverage.toLowerCase().includes("hà nội") && !d.cityCoverage.toLowerCase().includes("hcm") ? "hn" : (d.cityCoverage.toLowerCase().includes("đà nẵng") && !d.cityCoverage.toLowerCase().includes("hcm") ? "danang" : "hcm"),
            cityLabel: d.cityCoverage,
            address: d.cityCoverage,
            hotline: d.hotline,
            website: d.websiteUrl,
            badge: d.isOfficialPartner ? "ROG AUTHORIZED PARTNER" : "CHIẾN LƯỢC",
          };
        });
        setDealers(mapped);
      }
    });
  }, []);

  const filteredDealers =
    filterCity === "all"
      ? dealers
      : dealers.filter((d) => d.city === filterCity || d.city === "all");

  return (
    <div className="rog-page">
      <RogNavbar />
      <RogPromoBar />

      <main style={{ background: "#0a0a0c", color: "#fff", paddingBottom: "80px" }}>
        {/* Header */}
        <section
          style={{
            padding: "100px 24px 60px",
            textAlign: "center",
            background: "radial-gradient(ellipse at top, #20040a 0%, #0a0a0c 70%)",
            borderBottom: "1px solid #1f1f23",
          }}
        >
          <span
            style={{
              color: "#ff0036",
              fontSize: "13px",
              fontWeight: 800,
              letterSpacing: "3px",
              textTransform: "uppercase",
            }}
          >
            {"// WHERE TO BUY // ROG AUTHORIZED RESELLERS"}
          </span>
          <h1
            style={{
              fontSize: "clamp(32px, 5vw, 52px)",
              fontWeight: 900,
              letterSpacing: "1px",
              margin: "16px 0",
              textTransform: "uppercase",
            }}
          >
            HỆ THỐNG ĐẠI LÝ ỦY QUYỀN CHÍNH HÃNG
          </h1>
          <p style={{ fontSize: "16px", color: "#aaa", maxWidth: "720px", margin: "0 auto", lineHeight: 1.6 }}>
            Tìm kiếm các cửa hàng và chuỗi bán lẻ đối tác chính thức của ASUS ROG Việt Nam
            để trải nghiệm máy trực tiếp và nhận bảo hành 2 năm quốc tế chính hãng.
          </p>

          <div
            style={{
              marginTop: "24px",
              display: "flex",
              justifyContent: "center",
              gap: "12px",
              fontSize: "13px",
              color: "#888",
            }}
          >
            <Link href="/" style={{ color: "#aaa", textDecoration: "none" }}>Trang chủ</Link>
            <span>›</span>
            <span style={{ color: "#ff0036" }}>Đại lý</span>
          </div>
        </section>

        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px 0" }}>
          {/* City Filter Pills */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              justifyContent: "center",
              marginBottom: "48px",
            }}
          >
            {[
              { id: "all", label: "TẤT CẢ KHU VỰC" },
              { id: "hcm", label: "TP. HỒ CHÍ MINH" },
              { id: "hn", label: "HÀ NỘI" },
              { id: "danang", label: "ĐÀ NẴNG" },
            ].map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => setFilterCity(btn.id)}
                style={{
                  background: filterCity === btn.id ? "#ff0036" : "#141418",
                  color: "#fff",
                  border: filterCity === btn.id ? "1px solid #ff0036" : "1px solid #282830",
                  padding: "10px 24px",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  borderRadius: "2px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Dealers Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "24px",
            }}
          >
            {filteredDealers.map((d) => (
              <div
                key={d.name}
                style={{
                  background: "#121216",
                  border: "1px solid #222",
                  borderRadius: "6px",
                  padding: "28px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ color: "#ff0036", fontSize: "11px", fontWeight: 800, letterSpacing: "1px" }}>
                      {d.badge}
                    </span>
                    <span style={{ color: "#888", fontSize: "12px" }}>{d.cityLabel}</span>
                  </div>
                  <h3 style={{ fontSize: "20px", fontWeight: 800, margin: "0 0 4px 0", color: "#fff" }}>
                    {d.name}
                  </h3>
                  <div style={{ color: "#aaa", fontSize: "13px", marginBottom: "16px" }}>{d.type}</div>
                  <p style={{ color: "#bbb", fontSize: "13px", lineHeight: 1.5, margin: "0 0 10px 0" }}>
                    📍 {d.address}
                  </p>
                  <p style={{ color: "#bbb", fontSize: "13px", margin: "0 0 20px 0" }}>
                    📞 Hotline: <strong style={{ color: "#fff" }}>{d.hotline}</strong>
                  </p>
                </div>

                <a
                  href={d.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "block",
                    textAlign: "center",
                    padding: "10px 16px",
                    background: "#181824",
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    borderRadius: "2px",
                    border: "1px solid #333",
                  }}
                >
                  TRUY CẬP WEBSITE ĐẠI LÝ ↗
                </a>
              </div>
            ))}
          </div>
        </div>
      </main>

      <RogFooter />
      <RogChatWidget variant="greeting" />
    </div>
  );
}
