"use client";

import Link from "next/link";
import { useState } from "react";
import RogNavbar from "@/components/sites/rog-asus/RogNavbar";
import RogPromoBar from "@/components/sites/rog-asus/RogPromoBar";
import RogFooter from "@/components/sites/rog-asus/RogFooter";
import RogChatWidget from "@/components/sites/rog-asus/RogChatWidget";
import { RogApi } from "@/lib/api-client";

const CENTERS = [
  {
    city: "TP. HỒ CHÍ MINH",
    name: "Trung Tâm Dịch Vụ Khách Hàng ASUS ROG Sài Gòn",
    address: "285 Cách Mạng Tháng Tám, Phường 12, Quận 10, TP. Hồ Chí Minh",
    phone: "1800 65 88",
    time: "Thứ 2 - Thứ 7: 08:30 - 17:30 (Chủ nhật nghỉ)",
  },
  {
    city: "HÀ NỘI",
    name: "Trung Tâm Dịch Vụ Khách Hàng ASUS ROG Hà Nội",
    address: "Tầng 3, Tòa nhà Kinh Đô, 292 Tây Sơn, Phường Trung Liệt, Quận Đống Đa, Hà Nội",
    phone: "1800 65 88",
    time: "Thứ 2 - Thứ 7: 08:30 - 17:30 (Chủ nhật nghỉ)",
  },
  {
    city: "ĐÀ NẴNG",
    name: "Trung Tâm Dịch Vụ Khách Hàng ASUS ROG Đà Nẵng",
    address: "56 Hàm Nghi, Phường Thạc Gián, Quận Thanh Khê, TP. Đà Nẵng",
    phone: "1800 65 88",
    time: "Thứ 2 - Thứ 7: 08:30 - 17:30 (Chủ nhật nghỉ)",
  },
  {
    city: "CẦN THƠ",
    name: "Trung Tâm Dịch Vụ Khách Hàng ASUS ROG Cần Thơ",
    address: "131D Trần Hưng Đạo, Phường An Phú, Quận Ninh Kiều, TP. Cần Thơ",
    phone: "1800 65 88",
    time: "Thứ 2 - Thứ 7: 08:30 - 17:30 (Chủ nhật nghỉ)",
  },
];

const POLICIES = [
  {
    title: "BẢO HÀNH 2 NĂM QUỐC TẾ",
    desc: "Toàn bộ laptop gaming ASUS ROG đều được hưởng chế độ bảo hành chính hãng 2 năm tại hơn 80 quốc gia và vùng lãnh thổ trên toàn thế giới.",
  },
  {
    title: "DỊCH VỤ BẢO HÀNH TẬN NƠI (ON-SITE SERVICE)",
    desc: "Khách hàng sở hữu laptop ROG chỉ cần gọi tổng đài 1800 6588, kỹ thuật viên ASUS sẽ đến tận nhà hoặc văn phòng kiểm tra trong vòng 24–48h.",
  },
  {
    title: "BẢO HÀNH HƯ HỎNG DO TAI NẠN (PERFECT WARRANTY)",
    desc: "Trong năm đầu tiên, nếu máy bị rơi vỡ màn hình hoặc vô nước do sự cố bất cẩn của người dùng, ASUS hỗ trợ 80% chi phí linh kiện thay thế.",
  },
];

export default function SupportPage() {
  const [serial, setSerial] = useState("");
  const [result, setResult] = useState<{
    model: string;
    status: string;
    expiry: string;
    type: string;
  } | null>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serial.trim()) return;

    try {
      const data = await RogApi.checkWarranty(serial.trim());
      if (data) {
        const expDate = new Date(data.expiryDate).toLocaleDateString("vi-VN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        setResult({
          model: data.productModel,
          status: data.statusText.toUpperCase(),
          expiry: `${expDate} (${data.serviceCenter})`,
          type: "Bảo hành VIP On-site tận nơi & Bảo hành toàn cầu",
        });
        return;
      }
    } catch {
      // Backend errors are handled by the same user-facing no-data state below.
    }

    setResult(null);
    window.alert("Không tìm thấy thông tin bảo hành cho số serial này hoặc máy chủ bảo hành không khả dụng.");
  };

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
            {"// ASUS ROG CUSTOMER SUPPORT // VIETNAM"}
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
            TRUNG TÂM HỖ TRỢ & BẢO HÀNH ROG
          </h1>
          <p style={{ fontSize: "16px", color: "#aaa", maxWidth: "720px", margin: "0 auto", lineHeight: 1.6 }}>
            Tra cứu thông tin bảo hành thiết bị, tìm kiếm trung tâm dịch vụ khách hàng
            và tìm hiểu các chính sách hậu mãi VIP hàng đầu của ASUS ROG.
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
            <span style={{ color: "#ff0036" }}>Hỗ trợ</span>
          </div>
        </section>

        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "60px 24px 0" }}>
          {/* Warranty Lookup Form */}
          <div
            style={{
              background: "#121216",
              border: "1px solid #282830",
              borderRadius: "8px",
              padding: "40px",
              marginBottom: "60px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            }}
          >
            <span style={{ color: "#ff0036", fontSize: "12px", fontWeight: 800, letterSpacing: "2px" }}>
              {"// TRA CỨU ĐIỆN TỬ"}
            </span>
            <h2 style={{ fontSize: "24px", fontWeight: 800, margin: "10px 0 16px" }}>
              KIỂM TRA TÌNH TRẠNG BẢO HÀNH ROG
            </h2>
            <p style={{ color: "#aaa", fontSize: "14px", marginBottom: "24px" }}>
              Nhập số Sê-ri (Serial Number gồm 15 ký tự in ở mặt dưới máy hoặc trên vỏ hộp) để kiểm tra:
            </p>

            <form onSubmit={handleCheck} style={{ display: "flex", gap: "12px", flexWrap: "wrap", maxWidth: "600px" }}>
              <input
                type="text"
                placeholder="Ví dụ: R4NRCX012345678"
                value={serial}
                onChange={(e) => setSerial(e.target.value)}
                style={{
                  flex: "1 1 280px",
                  background: "#08080a",
                  border: "1px solid #333",
                  color: "#fff",
                  padding: "14px 18px",
                  borderRadius: "2px",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
              <button
                type="submit"
                style={{
                  background: "#ff0036",
                  color: "#fff",
                  border: "none",
                  padding: "14px 28px",
                  fontWeight: 700,
                  fontSize: "13px",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  borderRadius: "2px",
                  cursor: "pointer",
                }}
              >
                TRA CỨU NGAY
              </button>
            </form>

            {result && (
              <div
                style={{
                  marginTop: "28px",
                  padding: "24px",
                  background: "#181820",
                  border: "1px solid #ff0036",
                  borderRadius: "4px",
                }}
              >
                <div style={{ color: "#00e676", fontWeight: 700, fontSize: "14px", marginBottom: "8px" }}>
                  ✓ {result.status}
                </div>
                <div style={{ fontSize: "18px", fontWeight: 800, marginBottom: "8px" }}>{result.model}</div>
                <div style={{ color: "#aaa", fontSize: "14px", marginBottom: "4px" }}>
                  Hạn bảo hành: <strong style={{ color: "#fff" }}>{result.expiry}</strong>
                </div>
                <div style={{ color: "#aaa", fontSize: "14px" }}>
                  Gói dịch vụ: <strong style={{ color: "#fff" }}>{result.type}</strong>
                </div>
              </div>
            )}
          </div>

          {/* VIP Policies */}
          <h2
            style={{
              fontSize: "24px",
              fontWeight: 800,
              letterSpacing: "1px",
              textTransform: "uppercase",
              marginBottom: "28px",
              borderLeft: "4px solid #ff0036",
              paddingLeft: "16px",
            }}
          >
            ĐẶC QUYỀN DỊCH VỤ HẬU MÃI VIP
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "24px",
              marginBottom: "60px",
            }}
          >
            {POLICIES.map((p) => (
              <div
                key={p.title}
                style={{
                  background: "#121216",
                  border: "1px solid #222",
                  borderRadius: "6px",
                  padding: "28px",
                }}
              >
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#ff0036", margin: "0 0 12px 0" }}>
                  {p.title}
                </h3>
                <p style={{ color: "#aaa", fontSize: "14px", lineHeight: 1.6, margin: 0 }}>
                  {p.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Service Centers */}
          <h2
            style={{
              fontSize: "24px",
              fontWeight: 800,
              letterSpacing: "1px",
              textTransform: "uppercase",
              marginBottom: "28px",
              borderLeft: "4px solid #ff0036",
              paddingLeft: "16px",
            }}
          >
            DANH SÁCH TRUNG TÂM BẢO HÀNH CHÍNH HÃNG
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "24px",
            }}
          >
            {CENTERS.map((c) => (
              <div
                key={c.city}
                style={{
                  background: "#121216",
                  border: "1px solid #222",
                  borderRadius: "6px",
                  padding: "24px",
                }}
              >
                <span style={{ color: "#ff0036", fontSize: "12px", fontWeight: 800, letterSpacing: "1px" }}>
                  {c.city}
                </span>
                <h3 style={{ fontSize: "16px", fontWeight: 700, margin: "8px 0 10px 0" }}>
                  {c.name}
                </h3>
                <p style={{ color: "#aaa", fontSize: "13px", lineHeight: 1.5, margin: "0 0 8px 0" }}>
                  Địa chỉ: {c.address}
                </p>
                <p style={{ color: "#aaa", fontSize: "13px", margin: "0 0 8px 0" }}>
                  Hotline miễn phí: <strong style={{ color: "#ff0036" }}>{c.phone}</strong>
                </p>
                <p style={{ color: "#777", fontSize: "12px", margin: 0 }}>
                  Giờ làm việc: {c.time}
                </p>
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
