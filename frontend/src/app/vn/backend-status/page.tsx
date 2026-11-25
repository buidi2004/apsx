import Link from "next/link";
import RogNavbar from "@/components/sites/rog-asus/RogNavbar";
import RogFooter from "@/components/sites/rog-asus/RogFooter";
import {
  checkBackendHealth,
  fetchSiteConfig,
  fetchHeroSlides,
  fetchProductCategories,
  fetchArticles,
  fetchArticleDetailProbe,
  fetchProducts,
  fetchDealers,
  fetchWarrantyProbe,
  fetchPricingProbe,
  fetchCompareProbe,
  fetchInnovationsProbe,
  fetchWallpapersProbe,
  fetchAboutRogProbe,
  fetchSupportInfoProbe,
  fetchCommunityInfoProbe,
  fetchDownloadsProbe,
  fetchCampaignsProbe,
  fetchVideosProbe,
} from "@/lib/rogBackend";

export const dynamic = "force-dynamic";

interface StatusItem {
  name: string;
  status: string;
  ok: boolean;
  latency: string;
  detail: string;
}

async function loadStatusData(): Promise<{ items: StatusItem[]; allOk: boolean }> {
  const t0 = Date.now();
  const health = await checkBackendHealth();
  const healthLatency = Date.now() - t0;

  const t1 = Date.now();
  const config = await fetchSiteConfig();
  const configLatency = Date.now() - t1;

  const t2 = Date.now();
  const slides = await fetchHeroSlides();
  const slidesLatency = Date.now() - t2;

  const t3 = Date.now();
  const categories = await fetchProductCategories();
  const categoriesLatency = Date.now() - t3;

  const t4 = Date.now();
  const articlesHighlights = await fetchArticles("highlights");
  const articlesListing = await fetchArticles("listing");
  const articlesLatency = Date.now() - t4;

  const tArticleDetail = Date.now();
  const articleDetail = await fetchArticleDetailProbe();
  const articleDetailLatency = Date.now() - tArticleDetail;

  const t5 = Date.now();
  const products = await fetchProducts();
  const productsLatency = Date.now() - t5;

  const t6 = Date.now();
  const dealers = await fetchDealers();
  const dealersLatency = Date.now() - t6;

  const t7 = Date.now();
  const warranty = await fetchWarrantyProbe();
  const warrantyLatency = Date.now() - t7;

  const t8 = Date.now();
  const pricing = await fetchPricingProbe();
  const pricingLatency = Date.now() - t8;

  const t9 = Date.now();
  const comparison = await fetchCompareProbe();
  const comparisonLatency = Date.now() - t9;

  const t10 = Date.now();
  const innovations = await fetchInnovationsProbe();
  const innovationsLatency = Date.now() - t10;

  const t11 = Date.now();
  const wallpapers = await fetchWallpapersProbe();
  const wallpapersLatency = Date.now() - t11;

  const t12 = Date.now();
  const aboutRog = await fetchAboutRogProbe();
  const aboutRogLatency = Date.now() - t12;

  const t13 = Date.now();
  const supportInfo = await fetchSupportInfoProbe();
  const supportInfoLatency = Date.now() - t13;

  const t14 = Date.now();
  const communityInfo = await fetchCommunityInfoProbe();
  const communityInfoLatency = Date.now() - t14;

  const t15 = Date.now();
  const downloads = await fetchDownloadsProbe();
  const downloadsLatency = Date.now() - t15;

  const t16 = Date.now();
  const campaigns = await fetchCampaignsProbe();
  const campaignsLatency = Date.now() - t16;

  const t17 = Date.now();
  const videos = await fetchVideosProbe();
  const videosLatency = Date.now() - t17;

  const items: StatusItem[] = [
    {
      name: "Sức khỏe hệ thống (/health)",
      status: health.healthy ? "ONLINE" : "OFFLINE",
      ok: health.healthy,
      latency: `${healthLatency}ms`,
      detail: health.detail || "Không có phản hồi",
    },
    {
      name: "Cấu hình Site (/api/public/site-config)",
      status: config ? "ĐỒNG BỘ" : "OFFLINE",
      ok: Boolean(config),
      latency: `${configLatency}ms`,
      detail: config
        ? `Promo: "${config.promoBar.text}" | Footer links: ${config.footer.links.length}`
        : "Không nhận được dữ liệu",
    },
    {
      name: "Hero Slides (/api/public/hero-slides)",
      status: slides ? "ĐỒNG BỘ" : "OFFLINE",
      ok: Boolean(slides && slides.length > 0),
      latency: `${slidesLatency}ms`,
      detail: slides ? `${slides.length} slides đang phát` : "Không có slides",
    },
    {
      name: "Danh mục sản phẩm (/api/public/product-categories)",
      status: categories ? "ĐỒNG BỘ" : "OFFLINE",
      ok: Boolean(categories && categories.length > 0),
      latency: `${categoriesLatency}ms`,
      detail: categories ? `${categories.length}/22 ngành hàng chuẩn` : "Không có danh mục",
    },
    {
      name: "Bài viết ROG (/api/public/articles)",
      status: articlesHighlights && articlesListing ? "ĐỒNG BỘ" : "OFFLINE",
      ok: Boolean(articlesHighlights && articlesListing),
      latency: `${articlesLatency}ms`,
      detail: `Highlights: ${articlesHighlights?.length ?? 0} bài | Listing: ${articlesListing?.length ?? 0} bài`,
    },
    {
      name: "Chi tiết bài viết (/api/public/articles/{slug})",
      status: articleDetail ? "ĐỒNG BỘ" : "OFFLINE",
      ok: Boolean(articleDetail),
      latency: `${articleDetailLatency}ms`,
      detail: articleDetail ? articleDetail.title : "Không tìm thấy bài viết mẫu trong BE",
    },
    {
      name: "Danh mục sản phẩm (/api/public/products)",
      status: products && products.totalCount > 0 ? "ĐỒNG BỘ" : "OFFLINE",
      ok: Boolean(products && products.totalCount > 0),
      latency: `${productsLatency}ms`,
      detail: products
        ? `${products.totalCount} sản phẩm, trang hiện tại ${products.items.length}`
        : "Không nhận được dữ liệu",
    },
    {
      name: "Đại lý và cửa hàng (/api/public/dealers)",
      status: dealers && dealers.length > 0 ? "ĐỒNG BỘ" : "OFFLINE",
      ok: Boolean(dealers && dealers.length > 0),
      latency: `${dealersLatency}ms`,
      detail: dealers ? `${dealers.length} đại lý đang đồng bộ` : "Không có dữ liệu đại lý",
    },
    {
      name: "Tra cứu bảo hành (/api/public/warranty/check)",
      status: warranty ? "ĐỒNG BỘ" : "OFFLINE",
      ok: Boolean(warranty),
      latency: `${warrantyLatency}ms`,
      detail: warranty ? "Serial mẫu R4NRCX0001 hợp lệ" : "Không tra cứu được dữ liệu mẫu",
    },
    {
      name: "Bảng giá hàng loạt (/api/public/pricing/batch)",
      status: pricing && pricing.length > 0 ? "ĐỒNG BỘ" : "OFFLINE",
      ok: Boolean(pricing && pricing.length > 0),
      latency: `${pricingLatency}ms`,
      detail: pricing ? `${pricing.length} mức giá đang đồng bộ` : "Không có dữ liệu giá",
    },
    {
      name: "So sánh sản phẩm (/api/public/products/compare)",
      status: comparison ? "ĐỒNG BỘ" : "OFFLINE",
      ok: Boolean(comparison),
      latency: `${comparisonLatency}ms`,
      detail: comparison ? "Ma trận thông số mẫu trả về hợp lệ" : "Không tạo được ma trận mẫu",
    },
    {
      name: "Sáng tạo & Công nghệ (/api/public/innovations)",
      status: innovations && innovations.length > 0 ? "ĐỒNG BỘ" : "OFFLINE",
      ok: Boolean(innovations && innovations.length > 0),
      latency: `${innovationsLatency}ms`,
      detail: innovations ? `${innovations.length} công nghệ đột phá đang đồng bộ` : "Không nhận được dữ liệu",
    },
    {
      name: "Hình nền 4K (/api/public/wallpapers)",
      status: wallpapers && wallpapers.length > 0 ? "ĐỒNG BỘ" : "OFFLINE",
      ok: Boolean(wallpapers && wallpapers.length > 0),
      latency: `${wallpapersLatency}ms`,
      detail: wallpapers ? `${wallpapers.length} hình nền 4K đang đồng bộ` : "Không nhận được dữ liệu",
    },
    {
      name: "Giới thiệu ROG (/api/public/about-rog)",
      status: aboutRog ? "ĐỒNG BỘ" : "OFFLINE",
      ok: Boolean(aboutRog),
      latency: `${aboutRogLatency}ms`,
      detail: aboutRog ? "Hero banner & cột mốc lịch sử đang đồng bộ" : "Không nhận được dữ liệu",
    },
    {
      name: "Trung tâm & CS Bảo hành (/api/public/support-info)",
      status: supportInfo ? "ĐỒNG BỘ" : "OFFLINE",
      ok: Boolean(supportInfo),
      latency: `${supportInfoLatency}ms`,
      detail: supportInfo ? "Trung tâm tiếp nhận & chính sách hậu mãi đang đồng bộ" : "Không nhận được dữ liệu",
    },
    {
      name: "Kênh MXH & ROG Elite (/api/public/community-info)",
      status: communityInfo ? "ĐỒNG BỘ" : "OFFLINE",
      ok: Boolean(communityInfo),
      latency: `${communityInfoLatency}ms`,
      detail: communityInfo ? "Kênh cộng đồng & hạng thành viên đang đồng bộ" : "Không nhận được dữ liệu",
    },
    {
      name: "Kho Phần mềm (/api/public/downloads)",
      status: downloads && downloads.length > 0 ? "ĐỒNG BỘ" : "OFFLINE",
      ok: Boolean(downloads && downloads.length > 0),
      latency: `${downloadsLatency}ms`,
      detail: downloads ? `${downloads.length} tiện ích & driver đang đồng bộ` : "Không nhận được dữ liệu",
    },
    {
      name: "Sự kiện & Khuyến mãi (/api/public/campaigns)",
      status: campaigns && campaigns.length > 0 ? "ĐỒNG BỘ" : "OFFLINE",
      ok: Boolean(campaigns && campaigns.length > 0),
      latency: `${campaignsLatency}ms`,
      detail: campaigns ? `${campaigns.length} chiến dịch ưu đãi đang đồng bộ` : "Không nhận được dữ liệu",
    },
    {
      name: "Video & Media (/api/public/videos)",
      status: videos && videos.length > 0 ? "ĐỒNG BỘ" : "OFFLINE",
      ok: Boolean(videos && videos.length > 0),
      latency: `${videosLatency}ms`,
      detail: videos ? `${videos.length} video sản phẩm đang đồng bộ` : "Không có video",
    },
  ];

  return { items, allOk: items.every((i) => i.ok) };
}

export default async function BackendStatusPage() {
  const { items, allOk } = await loadStatusData();

  return (
    <div className="rog-page">
      <RogNavbar />
      <main style={{ minHeight: "80vh", backgroundColor: "#0b0c10", color: "#fff", padding: "40px 20px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 30, flexWrap: "wrap", gap: 16 }}>
            <div>
              <span style={{ color: "#ff0036", textTransform: "uppercase", fontSize: 13, letterSpacing: 2, fontWeight: 700 }}>
                {"// HỆ THỐNG KẾT NỐI BACKEND (ROGADMIN)"}
              </span>
              <h1 style={{ fontSize: 32, margin: "8px 0 0", color: "#fff", fontFamily: "'Roboto Condensed', sans-serif" }}>
                TRẠNG THÁI KẾT NỐI FRONTEND & BACKEND
              </h1>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <a
                href="http://localhost:5161/admin"
                target="_blank"
                rel="noreferrer"
                style={{
                  backgroundColor: "#ff0036",
                  color: "#fff",
                  padding: "10px 18px",
                  borderRadius: 4,
                  textDecoration: "none",
                  fontWeight: 700,
                  fontSize: 13,
                }}
              >
                MỞ ADMIN PORTAL →
              </a>
              <a
                href="http://localhost:5161/swagger"
                target="_blank"
                rel="noreferrer"
                style={{
                  backgroundColor: "#20222a",
                  color: "#00f0ff",
                  border: "1px solid #00f0ff33",
                  padding: "10px 18px",
                  borderRadius: 4,
                  textDecoration: "none",
                  fontWeight: 700,
                  fontSize: 13,
                }}
              >
                SWAGGER API DOCS
              </a>
            </div>
          </div>

          <div
            style={{
              padding: "20px 24px",
              backgroundColor: allOk ? "rgba(0, 255, 128, 0.08)" : "rgba(255, 0, 54, 0.08)",
              border: `1px solid ${allOk ? "#00ff80" : "#ff0036"}`,
              borderRadius: 6,
              marginBottom: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: allOk ? "#00ff80" : "#ff0036" }}>
                {allOk ? "✅ KẾT NỐI BACKEND HOÀN TOÀN THÔNG SUỐT (100% OK)" : "⚠️ KẾT NỐI GẶP SỰ CỐ"}
              </div>
              <div style={{ color: "#aaa", fontSize: 14, marginTop: 4 }}>
                BE Port: <code style={{ color: "#00f0ff" }}>http://localhost:5161</code> | Reverse Proxy FE: <code style={{ color: "#00f0ff" }}>/api/be/*</code> | CORS Origin: <code style={{ color: "#00f0ff" }}>http://localhost:3000</code>
              </div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 900, color: allOk ? "#00ff80" : "#ff0036" }}>
              {allOk ? "ONLINE" : "ERROR"}
            </div>
          </div>

          <div style={{ backgroundColor: "#14161d", borderRadius: 6, overflow: "hidden", border: "1px solid #232734" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #232734", fontWeight: 700, fontSize: 14, textTransform: "uppercase", letterSpacing: 1, color: "#888" }}>
              Chi tiết các Endpoints kết nối
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #232734", color: "#666", fontSize: 12 }}>
                  <th style={{ padding: "14px 20px" }}>TÊN DỊCH VỤ / ENDPOINT</th>
                  <th style={{ padding: "14px 20px" }}>TRẠNG THÁI</th>
                  <th style={{ padding: "14px 20px" }}>ĐỘ TRỄ (LATENCY)</th>
                  <th style={{ padding: "14px 20px" }}>CHI TIẾT DỮ LIỆU ĐỒNG BỘ</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: idx < items.length - 1 ? "1px solid #1c202c" : "none" }}>
                    <td style={{ padding: "16px 20px", fontWeight: 600, color: "#fff", fontSize: 14 }}>
                      {item.name}
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <span
                        style={{
                          backgroundColor: item.ok ? "rgba(0, 255, 128, 0.15)" : "rgba(255, 0, 54, 0.15)",
                          color: item.ok ? "#00ff80" : "#ff0036",
                          padding: "4px 10px",
                          borderRadius: 4,
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td style={{ padding: "16px 20px", color: "#00f0ff", fontFamily: "monospace", fontSize: 13 }}>
                      {item.latency}
                    </td>
                    <td style={{ padding: "16px 20px", color: "#bbb", fontSize: 13 }}>
                      {item.detail}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: 32, padding: "20px", backgroundColor: "#14161d", borderRadius: 6, border: "1px solid #232734" }}>
            <h3 style={{ fontSize: 16, margin: "0 0 12px", color: "#fff" }}>Hướng Dẫn Quản Trị Viên:</h3>
            <ul style={{ color: "#aaa", fontSize: 14, lineHeight: 1.8, paddingLeft: 20, margin: 0 }}>
              <li>Để truy cập giao diện quản trị nội dung CMS: Mở <strong><a href="http://localhost:5161/admin" target="_blank" rel="noreferrer" style={{ color: "#ff0036" }}>http://localhost:5161/admin</a></strong> (Tài khoản: <code>admin</code> / Mật khẩu: <code>Admin@123</code>).</li>
              <li>Tất cả thay đổi nội dung trên Admin Portal (thêm/sửa Banner Hero, danh mục, bài viết, thông tin liên hệ...) sẽ phản ánh ngay lập tức qua API Backend và được Frontend đồng bộ tự động.</li>
              <li>Frontend chỉ hiển thị dữ liệu trả về từ Backend; không sinh dữ liệu giả hoặc thay thế nội dung bằng dữ liệu mẫu khi Backend bảo trì hoặc không khả dụng.</li>
            </ul>
          </div>

          <div style={{ marginTop: 24, textAlign: "center" }}>
            <Link href="/vn" style={{ color: "#888", textDecoration: "none", fontSize: 13 }}>
              ← Quay lại Trang Chủ ROG Việt Nam
            </Link>
          </div>
        </div>
      </main>
      <RogFooter />
    </div>
  );
}
