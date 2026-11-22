/* RogAdmin — vanilla JS, gọi trực tiếp REST API của BE */
"use strict";

const API_BASE = ""; // cùng origin với trang admin
const TOKEN_KEY = "rogadmin_token";
const USER_KEY = "rogadmin_user";

const state = {
  articlesPage: 1,
  articlesPageSize: 10,
  productsPage: 1,
  productsPageSize: 10,
  dealersPage: 1,
  dealersPageSize: 15,
  warrantyPage: 1,
  warrantyPageSize: 15,
  reviewsPage: 1,
  reviewsPageSize: 15,
  customersPage: 1,
  customersPageSize: 15,
  newsletterPage: 1,
  newsletterPageSize: 20,
  ordersPage: 1,
  ordersPageSize: 15,
  auditLogsPage: 1,
  auditLogsPageSize: 20,
};

/* ---------- helpers ---------- */

const $ = (sel) => document.querySelector(sel);

function getToken() {
  return localStorage.getItem(TOKEN_KEY) || "";
}

function getUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null");
  } catch {
    return null;
  }
}

async function api(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  }
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  // 401 từ request thường = hết phiên → đăng xuất.
  // Riêng POST /api/auth/login trả 401 khi sai mật khẩu — giữ nguyên message từ server.
  if (res.status === 401 && path !== "/api/auth/login") {
    logout(true);
    throw new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
  }

  if (!res.ok) {
    let message = `Lỗi HTTP ${res.status}`;
    try {
      const body = await res.json();
      if (body && body.message) message = body.message;
    } catch { /* bỏ qua */ }
    throw new Error(message);
  }

  if (res.status === 204) return null;
  return res.json();
}

function toast(message, isError = false) {
  const el = $("#toast");
  el.textContent = message;
  el.classList.toggle("error", isError);
  el.classList.remove("hidden");
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.add("hidden"), 2600);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

// Ảnh lỗi (URL trỏ tới asset của FE, không có trên origin BE) — mờ đi thay vì hiện icon gãy
document.addEventListener("error", (e) => {
  if (e.target && e.target.tagName === "IMG") {
    e.target.style.opacity = "0.2";
  }
}, true);

function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return isNaN(d) ? "—" : d.toLocaleDateString("vi-VN");
}

function formatDateTime(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return isNaN(d) ? "—" : d.toLocaleString("vi-VN");
}

function formatVnd(val) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val || 0);
}

const SECTION_LABELS = { Highlights: "Highlights", Listing: "Listing" };
const GROUP_LABELS = { Footer: "Nhóm chính", Legal: "Pháp lý", Social: "Mạng xã hội" };

const SETTING_GROUP_LABELS = {
  promoBar: "Promo Bar (banner khuyến mãi)",
  joinRepublic: "Join the Republic (trang chủ)",
  company: "Thông tin công ty (footer)",
  newsletter: "Newsletter (footer)",
  badge: "Badge Bộ Công Thương (footer)",
  footer: "Dòng cuối footer",
};

/* ---------- auth ---------- */

function showLogin() {
  $("#login-screen").classList.remove("hidden");
  $("#app").classList.add("hidden");
}

function showApp() {
  const user = getUser();
  $("#login-screen").classList.add("hidden");
  $("#app").classList.remove("hidden");
  // Phân quyền UI: mục [data-admin-only] chỉ hiện với Admin
  const isAdmin = !!user && user.role === "Admin";
  document.querySelectorAll("[data-admin-only]").forEach((el) =>
    el.classList.toggle("hidden", !isAdmin));
  if (user) {
    $("#current-user").textContent = `${user.fullName} (${user.role})`;
  }
  navigate(location.hash.replace("#", "") || "dashboard");
}

function logout(expired = false) {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  showLogin();
  if (expired) {
    const err = $("#login-error");
    err.textContent = "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.";
    err.classList.remove("hidden");
  }
}

$("#login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const err = $("#login-error");
  err.classList.add("hidden");
  const username = $("#login-username").value.trim();
  const password = $("#login-password").value;

  try {
    const data = await api("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    toast(`Xin chào, ${data.user.fullName}!`);
    showApp();
  } catch (ex) {
    err.textContent = ex.message;
    err.classList.remove("hidden");
  }
});

$("#logout-btn").addEventListener("click", () => logout());

/* ---------- routing ---------- */

const PAGES = [
  "dashboard", "reports", "orders", "products", "dealers", "warranty", "reviews",
  "support-centers", "community", "campaigns", "downloads", "innovations",
  "wallpapers", "about-stories", "videos", "customers", "newsletter",
  "media", "articles", "hero-slides", "product-categories",
  "footer-links", "site-settings", "audit-logs", "users"
];

function navigate(page) {
  if (!PAGES.includes(page)) page = "dashboard";
  // Đặt hash sẽ kích hoạt hashchange → navigate lại một lần duy nhất;
  // nếu hash đã đúng thì vào thẳng render/load (tránh load 2 lần).
  if (location.hash !== `#${page}`) {
    location.hash = page;
    return;
  }

  document.querySelectorAll(".page").forEach((el) => el.classList.add("hidden"));
  const targetPage = $(`#page-${page}`);
  if (targetPage) targetPage.classList.remove("hidden");
  document.querySelectorAll(".sidebar nav a").forEach((a) =>
    a.classList.toggle("active", a.dataset.page === page));

  const loaders = {
    dashboard: loadDashboard,
    reports: loadReports,
    orders: loadOrders,
    products: loadProducts,
    dealers: loadDealers,
    warranty: loadWarranty,
    reviews: loadReviews,
    "support-centers": loadSupportCenters,
    community: loadCommunity,
    campaigns: loadCampaigns,
    downloads: loadDownloads,
    innovations: loadInnovations,
    wallpapers: loadWallpapers,
    "about-stories": loadAboutStories,
    videos: loadVideos,
    customers: loadCustomers,
    newsletter: loadNewsletter,
    media: loadMedia,
    articles: loadArticles,
    "hero-slides": loadHeroSlides,
    "product-categories": loadProductCategories,
    "footer-links": loadFooterLinks,
    "site-settings": loadSettings,
    "audit-logs": () => loadAuditLogs().catch((ex) => {
      toast(ex.message, true);
      navigate("dashboard");
    }),
    users: () => loadUsers().catch((ex) => {
      toast(ex.message, true);
      navigate("dashboard");
    }),
  };
  if (loaders[page]) {
    loaders[page]().catch((ex) => toast(ex.message, true));
  }
}

window.addEventListener("hashchange", () =>
  navigate(location.hash.replace("#", "") || "dashboard"));

/* ---------- dashboard ---------- */

async function loadDashboard() {
  const stats = await api("/api/admin/dashboard");

  // Alert Banners
  let alertsHtml = "";
  if (stats.pendingReviewsTotal > 0) {
    alertsHtml += `
      <div class="dashboard-alert alert-warning">
        <div>⚠️ <strong>CẢNH BÁO KIỂM DUYỆT:</strong> Có <strong>${stats.pendingReviewsTotal}</strong> đánh giá sản phẩm mới từ khách hàng đang chờ duyệt!</div>
        <a href="#reviews" class="alert-btn">Xem &amp; duyệt ngay →</a>
      </div>`;
  }
  if (stats.ordersPending > 0) {
    alertsHtml += `
      <div class="dashboard-alert alert-info">
        <div>📦 <strong>ĐƠN HÀNG MỚI:</strong> Có <strong>${stats.ordersPending}</strong> đơn hàng mới đang chờ xác nhận và đóng gói!</div>
        <a href="#orders" class="alert-btn">Xem danh sách đơn →</a>
      </div>`;
  }
  const alertEl = $("#dashboard-alerts");
  if (alertEl) alertEl.innerHTML = alertsHtml;

  const cards = [
    [stats.productsTotal ?? 0, "Sản phẩm & Máy", `${stats.productsInStock ?? 0} máy đang kinh doanh`],
    [stats.ordersTotal ?? 0, "Đơn hàng", `${stats.ordersPending ?? 0} đơn chờ xác nhận`],
    [stats.customersTotal ?? 0, "Khách hàng & Elite", "Hội viên toàn hệ thống"],
    [stats.dealersTotal ?? 0, "Đại lý phân phối", "Hệ thống toàn quốc"],
    [stats.warrantyRecordsTotal ?? 0, "Hồ sơ bảo hành", "Serial máy chính hãng"],
    [stats.pendingReviewsTotal ?? 0, "Đánh giá chờ duyệt", stats.pendingReviewsTotal > 0 ? "⚠️ Cần kiểm duyệt" : "Tất cả đã duyệt"],
    [stats.articlesTotal, "Bài viết", `${stats.articlesHighlights} highlights · ${stats.articlesListing} listing`],
    [stats.heroSlidesTotal, "Slide hero", `${stats.heroSlidesActive} đang bật`],
    [stats.productCategoriesTotal, "Danh mục sản phẩm", `${stats.productCategoriesActive} đang bật`],
    [stats.footerLinksTotal, "Link footer", "Pháp lý & Cộng đồng"],
    [stats.siteSettingsTotal, "Cấu hình site", "Dynamic key-value"],
    [stats.adminUsersTotal, "Tài khoản admin", "Admin & Editor"],
  ];
  $("#dashboard-stats").innerHTML = cards.map(([num, label, sub]) => `
    <div class="stat-card">
      <div class="num">${num}</div>
      <div class="label">${label}</div>
      <div class="sub">${sub}</div>
    </div>`).join("");
}

/* ---------- reports & analytics ---------- */

let reportFilters = {
  preset: "all",
  fromDate: null,
  toDate: null,
  activeTab: "top-products"
};

async function loadReports() {
  const params = new URLSearchParams();
  if (reportFilters.fromDate) params.set("fromDate", reportFilters.fromDate);
  if (reportFilters.toDate) params.set("toDate", reportFilters.toDate);
  const qs = params.toString() ? `?${params.toString()}` : "";

  // 1. Fetch sales summary
  const sales = await api(`/api/admin/reports/sales-summary${qs}`);

  // KPI cards
  const kpiEl = $("#report-kpi-cards");
  if (kpiEl) {
    kpiEl.innerHTML = `
      <div class="stat-card" style="border-left:3px solid #00f0ff">
        <div class="num" style="color:#00f0ff;font-size:24px">${formatVnd(sales.totalRevenue)}</div>
        <div class="label">Doanh thu Hợp lệ</div>
        <div class="sub">${sales.completedOrders + sales.confirmedOrders + sales.shippingOrders} đơn hợp lệ (${formatVnd(sales.completedRevenue)} đã xong)</div>
      </div>
      <div class="stat-card" style="border-left:3px solid #23c26a">
        <div class="num" style="color:#23c26a;font-size:24px">${sales.completedOrders} <span style="font-size:16px;color:#888">/ ${sales.totalOrders} đơn</span></div>
        <div class="label">Đơn hàng Hoàn tất</div>
        <div class="sub">Chờ xác nhận: ${sales.pendingOrders} · Đang giao: ${sales.shippingOrders}</div>
      </div>
      <div class="stat-card" style="border-left:3px solid #f5a524">
        <div class="num" style="color:#f5a524;font-size:24px">${formatVnd(sales.averageOrderValue)}</div>
        <div class="label">Giá trị Đơn Trung bình (AOV)</div>
        <div class="sub">Bình quân trên mỗi đơn hàng hợp lệ</div>
      </div>
      <div class="stat-card" style="border-left:3px solid #ff1a2e">
        <div class="num" style="color:#ff1a2e;font-size:24px">${sales.cancellationRate}%</div>
        <div class="label">Tỷ lệ Huỷ đơn</div>
        <div class="sub">${sales.cancelledOrders} đơn đã huỷ trong tổng số ${sales.totalOrders} đơn</div>
      </div>
    `;
  }

  // 2. Sales trend bar chart
  const chartEl = $("#report-sales-chart");
  if (chartEl) {
    if (!sales.dailyRevenue || sales.dailyRevenue.length === 0) {
      chartEl.innerHTML = `<div style="color:#888;margin:auto;text-align:center">Chưa có giao dịch phát sinh trong khoảng thời gian này.</div>`;
    } else {
      const maxRev = Math.max(...sales.dailyRevenue.map((d) => d.revenue), 1);
      chartEl.innerHTML = sales.dailyRevenue.map((d) => {
        const heightPct = Math.max(14, Math.round((d.revenue / maxRev) * 100));
        return `
          <div class="chart-bar-col">
            <div class="chart-bar" style="height:${heightPct}%">
              <div class="chart-bar-tooltip">
                <strong>${d.date}</strong><br/>
                Doanh thu: ${formatVnd(d.revenue)}<br/>
                Số đơn: ${d.orderCount}
              </div>
            </div>
            <div class="chart-bar-label">${d.date.length >= 10 ? d.date.slice(5) : d.date}</div>
          </div>
        `;
      }).join("");
    }
  }

  // 3. Status breakdown
  const statusEl = $("#report-status-breakdown");
  if (statusEl) {
    const statusColors = {
      Completed: "#23c26a",
      Confirmed: "#00f0ff",
      Shipping: "#f5a524",
      Pending: "#9aa0a8",
      Cancelled: "#ff1a2e"
    };
    statusEl.innerHTML = (sales.statusBreakdown || []).map((st) => {
      const color = statusColors[st.status] || "#9aa0a8";
      return `
        <div>
          <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px">
            <span><strong style="color:${color}">●</strong> ${st.statusText} (${st.count} đơn)</span>
            <span style="color:#aaa">${formatVnd(st.revenue)} · <strong>${st.percentage}%</strong></span>
          </div>
          <div style="background:#222;height:6px;border-radius:3px;overflow:hidden">
            <div style="background:${color};width:${Math.min(100, st.percentage)}%;height:100%"></div>
          </div>
        </div>
      `;
    }).join("");
  }

  // 4. Load current sub tab
  await loadReportTab(reportFilters.activeTab, qs);
}

async function loadReportTab(tabName, qs = "") {
  reportFilters.activeTab = tabName;

  // Toggle tab buttons
  document.querySelectorAll(".report-tabs-nav .tab-btn").forEach((b) => {
    b.classList.toggle("active", b.dataset.reportTab === tabName);
  });

  // Toggle tab panes
  document.querySelectorAll(".report-tab-pane").forEach((pane) => {
    pane.classList.toggle("hidden", pane.id !== `report-tab-${tabName}`);
  });

  if (tabName === "top-products") {
    const products = await api(`/api/admin/reports/top-products?limit=15${qs ? qs.replace("?", "&") : ""}`);
    const table = $("#report-top-products-table");
    if (!products || products.length === 0) {
      table.innerHTML = `<tr><td style="padding:20px;text-align:center;color:#888">Chưa có dữ liệu sản phẩm đã bán.</td></tr>`;
      return;
    }
    table.innerHTML = `
      <thead>
        <tr>
          <th>Hạng</th>
          <th>Tên sản phẩm</th>
          <th>Danh mục</th>
          <th style="text-align:right">Đơn giá niêm yết</th>
          <th style="text-align:center">Đã bán</th>
          <th style="text-align:right">Tổng doanh thu</th>
          <th>Tồn kho</th>
        </tr>
      </thead>
      <tbody>
        ${products.map((p, idx) => `
          <tr>
            <td style="font-weight:700;color:${idx === 0 ? '#ffea00' : idx === 1 ? '#c0c0c0' : idx === 2 ? '#cd7f32' : 'inherit'}">
              #${idx + 1}
            </td>
            <td><strong>${escapeHtml(p.name)}</strong><br/><span style="font-size:11px;color:#888">${escapeHtml(p.slug)}</span></td>
            <td><span style="font-size:11px;background:#222;padding:2px 6px;border-radius:3px">${escapeHtml(p.categorySlug || '—')}</span></td>
            <td style="text-align:right">${formatVnd(p.currentPrice)}</td>
            <td style="text-align:center"><strong style="color:#00f0ff;font-size:15px">${p.quantitySold}</strong></td>
            <td style="text-align:right;font-weight:700;color:#23c26a">${formatVnd(p.totalRevenue)}</td>
            <td><span class="status-pill ${p.stockStatus === 'InStock' ? 'completed' : 'cancelled'}">${p.stockStatus}</span></td>
          </tr>
        `).join("")}
      </tbody>
    `;
  } else if (tabName === "inventory") {
    const inv = await api("/api/admin/reports/inventory");
    const metricsEl = $("#report-inventory-metrics");
    metricsEl.innerHTML = `
      <div class="stat-card" style="padding:12px">
        <div class="num" style="font-size:20px">${inv.totalProducts}</div>
        <div class="label" style="font-size:11px">Tổng mặt hàng</div>
      </div>
      <div class="stat-card" style="padding:12px;border-color:rgba(35,194,106,0.3)">
        <div class="num" style="font-size:20px;color:#23c26a">${inv.inStockCount}</div>
        <div class="label" style="font-size:11px">Còn hàng (In Stock)</div>
      </div>
      <div class="stat-card" style="padding:12px;border-color:rgba(230,0,18,0.3)">
        <div class="num" style="font-size:20px;color:#ff1a2e">${inv.outOfStockCount}</div>
        <div class="label" style="font-size:11px">Hết hàng (Out of Stock)</div>
      </div>
      <div class="stat-card" style="padding:12px;border-color:rgba(245,165,36,0.3)">
        <div class="num" style="font-size:20px;color:#f5a524">${inv.preOrderCount}</div>
        <div class="label" style="font-size:11px">Đặt trước (Pre-Order)</div>
      </div>
      <div class="stat-card" style="padding:12px">
        <div class="num" style="font-size:20px;color:#888">${inv.inactiveCount}</div>
        <div class="label" style="font-size:11px">Ngừng kinh doanh</div>
      </div>
    `;

    const table = $("#report-inventory-table");
    if (!inv.outOfStockProducts || inv.outOfStockProducts.length === 0) {
      table.innerHTML = `<tr><td style="padding:20px;text-align:center;color:#23c26a">🎉 Toàn bộ sản phẩm đang có trạng thái tồn kho ổn định!</td></tr>`;
      return;
    }
    table.innerHTML = `
      <thead>
        <tr>
          <th>ID</th>
          <th>Tên sản phẩm</th>
          <th>Mã Model</th>
          <th style="text-align:right">Giá bán</th>
          <th>Tình trạng cảnh báo</th>
        </tr>
      </thead>
      <tbody>
        ${inv.outOfStockProducts.map((p) => `
          <tr>
            <td>${p.id}</td>
            <td><strong>${escapeHtml(p.name)}</strong><br/><span style="font-size:11px;color:#888">${escapeHtml(p.slug)}</span></td>
            <td><code>${escapeHtml(p.modelCode || '—')}</code></td>
            <td style="text-align:right">${formatVnd(p.price)}</td>
            <td><span class="status-pill cancelled">${escapeHtml(p.stockStatus)}</span></td>
          </tr>
        `).join("")}
      </tbody>
    `;
  } else if (tabName === "warranty") {
    const war = await api("/api/admin/reports/warranty");
    const metricsEl = $("#report-warranty-metrics");
    metricsEl.innerHTML = `
      <div class="stat-card" style="padding:12px">
        <div class="num" style="font-size:20px">${war.totalRecords}</div>
        <div class="label" style="font-size:11px">Tổng hồ sơ bảo hành</div>
      </div>
      <div class="stat-card" style="padding:12px;border-color:rgba(35,194,106,0.3)">
        <div class="num" style="font-size:20px;color:#23c26a">${war.activeCount}</div>
        <div class="label" style="font-size:11px">Còn hạn (Active)</div>
      </div>
      <div class="stat-card" style="padding:12px;border-color:rgba(230,0,18,0.3)">
        <div class="num" style="font-size:20px;color:#ff1a2e">${war.expiredCount}</div>
        <div class="label" style="font-size:11px">Đã hết hạn (Expired)</div>
      </div>
      <div class="stat-card" style="padding:12px;border-color:rgba(245,165,36,0.3)">
        <div class="num" style="font-size:20px;color:#f5a524">${war.expiringSoonCount}</div>
        <div class="label" style="font-size:11px">Sắp hết hạn (&lt;60 ngày)</div>
      </div>
    `;

    const table = $("#report-warranty-table");
    if (!war.expiringSoonList || war.expiringSoonList.length === 0) {
      table.innerHTML = `<tr><td style="padding:20px;text-align:center;color:#23c26a">Không có máy nào sắp hết hạn trong 60 ngày tới.</td></tr>`;
      return;
    }
    table.innerHTML = `
      <thead>
        <tr>
          <th>Số Serial</th>
          <th>Model máy</th>
          <th>Ngày mua</th>
          <th>Ngày hết hạn</th>
          <th>Còn lại</th>
          <th>Trung tâm phụ trách</th>
        </tr>
      </thead>
      <tbody>
        ${war.expiringSoonList.map((w) => `
          <tr>
            <td><strong style="color:#00f0ff">${escapeHtml(w.serialNumber)}</strong></td>
            <td>${escapeHtml(w.productModel)}</td>
            <td>${formatDate(w.purchaseDate)}</td>
            <td style="color:#ff1a2e;font-weight:700">${formatDate(w.expiryDate)}</td>
            <td><span class="status-pill shipping">${w.daysRemaining} ngày</span></td>
            <td><span style="font-size:12px;color:#aaa">${escapeHtml(w.serviceCenter)}</span></td>
          </tr>
        `).join("")}
      </tbody>
    `;
  } else if (tabName === "customers") {
    const cust = await api("/api/admin/reports/customers");
    const metricsEl = $("#report-customer-metrics");
    metricsEl.innerHTML = `
      <div class="stat-card" style="padding:12px">
        <div class="num" style="font-size:20px">${cust.totalCustomers}</div>
        <div class="label" style="font-size:11px">Tổng khách hàng</div>
      </div>
      <div class="stat-card" style="padding:12px;border-color:rgba(35,194,106,0.3)">
        <div class="num" style="font-size:20px;color:#23c26a">${cust.activeCustomers}</div>
        <div class="label" style="font-size:11px">Đang hoạt động</div>
      </div>
      <div class="stat-card" style="padding:12px;border-color:rgba(0,240,255,0.3)">
        <div class="num" style="font-size:20px;color:#00f0ff">${cust.totalPointsIssued.toLocaleString()}</div>
        <div class="label" style="font-size:11px">Tổng điểm ROG Elite tích luỹ</div>
      </div>
    `;

    const table = $("#report-customers-table");
    if (!cust.topCustomers || cust.topCustomers.length === 0) {
      table.innerHTML = `<tr><td style="padding:20px;text-align:center;color:#888">Chưa có lịch sử khách hàng mua sắm.</td></tr>`;
      return;
    }
    table.innerHTML = `
      <thead>
        <tr>
          <th>Hạng</th>
          <th>Khách hàng</th>
          <th>Email / SĐT</th>
          <th>Hạng thẻ</th>
          <th style="text-align:right">Điểm Elite</th>
          <th style="text-align:center">Số đơn</th>
          <th style="text-align:right">Tổng chi tiêu (VND)</th>
        </tr>
      </thead>
      <tbody>
        ${cust.topCustomers.map((c, idx) => `
          <tr>
            <td style="font-weight:700;color:${idx === 0 ? '#ffea00' : idx === 1 ? '#c0c0c0' : idx === 2 ? '#cd7f32' : 'inherit'}">
              #${idx + 1}
            </td>
            <td><strong>${escapeHtml(c.fullName)}</strong></td>
            <td>${escapeHtml(c.email)}<br/><span style="font-size:11px;color:#888">${escapeHtml(c.phoneNumber || '—')}</span></td>
            <td><span class="status-pill confirmed">${escapeHtml(c.tier)}</span></td>
            <td style="text-align:right;color:#00f0ff;font-weight:700">${c.points.toLocaleString()} pts</td>
            <td style="text-align:center"><strong>${c.orderCount}</strong></td>
            <td style="text-align:right;font-weight:700;color:#23c26a">${formatVnd(c.totalSpent)}</td>
          </tr>
        `).join("")}
      </tbody>
    `;
  }
}

async function exportSalesReportCsv() {
  try {
    toast("Đang trích xuất báo cáo doanh thu...");
    const token = getToken();
    const params = new URLSearchParams();
    if (reportFilters.fromDate) params.set("fromDate", reportFilters.fromDate);
    if (reportFilters.toDate) params.set("toDate", reportFilters.toDate);
    const qs = params.toString() ? `?${params.toString()}` : "";
    const res = await fetch(`/api/admin/reports/export/sales-csv${qs}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error(`Lỗi tải file: HTTP ${res.status}`);
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rog_sales_report_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
    toast("Xuất báo cáo Doanh thu thành công!");
  } catch (ex) {
    toast(ex.message, true);
  }
}

async function exportInventoryReportCsv() {
  try {
    toast("Đang trích xuất báo cáo tồn kho...");
    const token = getToken();
    const res = await fetch("/api/admin/reports/export/inventory-csv", {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error(`Lỗi tải file: HTTP ${res.status}`);
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rog_inventory_report_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
    toast("Xuất báo cáo Tồn kho thành công!");
  } catch (ex) {
    toast(ex.message, true);
  }
}

async function exportWarrantyReportCsv() {
  try {
    toast("Đang trích xuất báo cáo bảo hành...");
    const token = getToken();
    const res = await fetch("/api/admin/reports/export/warranty-csv", {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error(`Lỗi tải file: HTTP ${res.status}`);
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rog_warranty_report_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
    toast("Xuất báo cáo Bảo hành thành công!");
  } catch (ex) {
    toast(ex.message, true);
  }
}

/* ---------- modal form (dùng chung) ---------- */

let modalSubmit = null;

function openModal(title, fieldsHtml, onSubmit) {
  $("#modal-title").textContent = title;
  $("#modal-form").innerHTML = fieldsHtml;
  modalSubmit = onSubmit;
  $("#modal").classList.remove("hidden");
}

function closeModal() {
  $("#modal").classList.add("hidden");
  modalSubmit = null;
}

$("#modal-close").addEventListener("click", closeModal);
$("#modal-cancel").addEventListener("click", closeModal);

// Nhấn Enter trong modal → save thay vì submit form gốc (tránh GET kèm dữ liệu lên URL)
$("#modal-form").addEventListener("submit", (e) => {
  e.preventDefault();
  $("#modal-save").click();
});

$("#modal-save").addEventListener("click", async () => {
  if (!modalSubmit) return;
  const form = $("#modal-form");
  if (!form.reportValidity()) return;
  const btn = $("#modal-save");
  btn.disabled = true; // chống double-click tạo trùng bản ghi
  try {
    // handler có thể return một string làm thông báo riêng
    const result = await modalSubmit(new FormData(form));
    closeModal();
    toast(typeof result === "string" && result ? result : "Đã lưu thành công.");
  } catch (ex) {
    toast(ex.message, true);
  } finally {
    btn.disabled = false;
  }
});

function field(label, inputHtml) {
  return `<label>${label}${inputHtml}</label>`;
}

function textField(name, value = "", required = true, type = "text") {
  return `<input name="${name}" type="${type}" value="${escapeHtml(value)}" ${required ? "required" : ""} />`;
}

function imageField(name, value = "", required = false) {
  const uid = Math.random().toString(36).slice(2, 7);
  const inputId = `img-in-${name}-${uid}`;
  const fileId = `file-in-${name}-${uid}`;
  setTimeout(() => {
    const fileEl = document.getElementById(fileId);
    const textEl = document.getElementById(inputId);
    if (fileEl && textEl) {
      fileEl.onchange = async () => {
        if (!fileEl.files || !fileEl.files[0]) return;
        const fd = new FormData();
        fd.append("file", fileEl.files[0]);
        try {
          toast("Đang tải ảnh lên server...");
          const res = await api("/api/admin/media/upload", { method: "POST", body: fd });
          textEl.value = res.url;
          toast("Tải ảnh lên thành công!");
        } catch (ex) {
          toast(ex.message, true);
        }
      };
    }
  }, 50);
  return `
    <div style="display:flex;gap:8px;align-items:center;margin-top:4px;">
      <input id="${inputId}" name="${name}" type="text" value="${escapeHtml(value)}" ${required ? "required" : ""} style="flex:1" placeholder="/sites/rog-asus/..." />
      <input id="${fileId}" type="file" accept="image/*" style="display:none" />
      <button type="button" class="btn btn-sm btn-ghost" style="border:1px solid #4a5568" onclick="document.getElementById('${fileId}').click()">📤 Tải ảnh</button>
    </div>`;
}

function textArea(name, value = "") {
  return `<textarea name="${name}">${escapeHtml(value)}</textarea>`;
}

function selectField(name, value, options) {
  return `<select name="${name}">${options
    .map(([val, label]) => `<option value="${val}" ${String(val) === String(value) ? "selected" : ""}>${label}</option>`)
    .join("")}</select>`;
}

function checkboxField(name, checked) {
  return `<div class="checkbox-row"><input name="${name}" type="checkbox" ${checked ? "checked" : ""} /><label>Bật</label></div>`;
}

function checkboxValue(formData, name) {
  return formData.get(name) === "on";
}

/* ---------- products & pricing ---------- */

async function loadProducts() {
  const q = ($("#product-search")?.value || "").trim();
  const url = `/api/admin/products?page=${state.productsPage}&pageSize=${state.productsPageSize}&search=${encodeURIComponent(q)}`;
  const result = await api(url);

  $("#products-table").innerHTML = `
    <thead><tr><th>#</th><th>Ảnh</th><th>Tên sản phẩm</th><th>Model / Danh mục</th><th>Giá bán</th><th>Giá cũ</th><th>Khuyến mãi</th><th>Kho</th><th>Thao tác</th></tr></thead>
    <tbody>${result.items.map((p) => {
      const priceText = p.price > 0 ? Number(p.price).toLocaleString("vi-VN") + " ₫" : "Liên hệ";
      const oldPriceText = p.oldPrice > 0 ? Number(p.oldPrice).toLocaleString("vi-VN") + " ₫" : "—";
      const stockBadge = p.stockStatus === "InStock" ? '<span class="badge-on">Còn hàng</span>' : (p.stockStatus === "PreOrder" ? '<span style="color:#f59e0b;font-weight:600">Đặt trước</span>' : '<span class="badge-off">Hết hàng</span>');
      return `
      <tr>
        <td>${p.id}</td>
        <td><img class="thumb" src="${escapeHtml(p.thumbnailUrl || '/sites/rog-asus/img/hero/gamescom.webp')}" alt="" loading="lazy" /></td>
        <td class="cell-title">
          <strong>${escapeHtml(p.name)}</strong>
          <div style="font-size:11px;color:#888;">${escapeHtml(p.slug)}</div>
        </td>
        <td><code>${escapeHtml(p.modelCode || "—")}</code><br/><span style="font-size:11px;color:#aaa;">${escapeHtml(p.categorySlug)}</span></td>
        <td style="color:#ef4444;font-weight:700;">${priceText}</td>
        <td style="color:#888;text-decoration:line-through;font-size:12px;">${oldPriceText}</td>
        <td><span style="font-size:11px;background:#331111;color:#ff4444;padding:2px 6px;border-radius:4px;">${escapeHtml(p.discountLabel || "—")}</span></td>
        <td>${stockBadge}</td>
        <td><div class="row-actions">
          <button class="btn btn-sm btn-primary" data-edit-product-price="${p.id}">💰 Sửa giá</button>
          <button class="btn btn-sm" data-edit-product="${p.id}">✏️ Chi tiết</button>
          <button class="btn btn-sm btn-ghost" style="border:1px solid #4a5568" data-manage-product-specs="${p.id}">⚙️ Specs</button>
          <button class="btn btn-sm btn-ghost" style="border:1px solid #3b82f6;color:#60a5fa" data-gallery-product="${p.id}">🖼️ Album</button>
          <button class="btn btn-sm btn-danger" data-delete-product="${p.id}">Xóa</button>
        </div></td>
      </tr>`;
    }).join("")}</tbody>`;

  const pager = $("#products-pager");
  pager.innerHTML = `
    <button class="btn btn-sm" id="products-prev" ${result.page <= 1 ? "disabled" : ""}>‹ Trước</button>
    <span>Trang ${result.page}/${result.totalPages || 1} · ${result.totalCount} sản phẩm</span>
    <button class="btn btn-sm" id="products-next" ${result.page >= result.totalPages ? "disabled" : ""}>Sau ›</button>`;
  $("#products-prev").onclick = () => { state.productsPage--; loadProducts(); };
  $("#products-next").onclick = () => { state.productsPage++; loadProducts(); };

  document.querySelectorAll("[data-edit-product-price]").forEach((btn) => {
    const id = Number(btn.dataset.editProductPrice);
    const item = result.items.find((p) => p.id === id);
    btn.onclick = () => openProductPriceForm(item);
  });

  document.querySelectorAll("[data-edit-product]").forEach((btn) => {
    const id = Number(btn.dataset.editProduct);
    const item = result.items.find((p) => p.id === id);
    btn.onclick = () => openProductForm(item);
  });

  document.querySelectorAll("[data-manage-product-specs]").forEach((btn) => {
    const id = Number(btn.dataset.manageProductSpecs);
    const item = result.items.find((p) => p.id === id);
    btn.onclick = () => openProductSpecsModal(item);
  });

  document.querySelectorAll("[data-gallery-product]").forEach((btn) => {
    const id = Number(btn.dataset.galleryProduct);
    const item = result.items.find((p) => p.id === id);
    btn.onclick = () => openGalleryModal(item);
  });

  document.querySelectorAll("[data-delete-product]").forEach((btn) => {
    btn.onclick = () => deleteEntity(`/api/admin/products/${btn.dataset.deleteProduct}`, "sản phẩm", loadProducts);
  });
}

function openProductPriceForm(p) {
  openModal(`Cập nhật Giá & Tồn kho — ${p.name}`, `
    <div style="margin-bottom:12px;font-size:13px;color:#aaa;">Sản phẩm: <strong>${escapeHtml(p.name)}</strong> (Slug: <code>${escapeHtml(p.slug)}</code>)</div>
    ${field("Giá bán chính thức (VNĐ) *", `<input name="price" type="number" step="1000" min="0" value="${p.price || 0}" required />`)}
    ${field("Giá niêm yết cũ (VNĐ)", `<input name="oldPrice" type="number" step="1000" min="0" value="${p.oldPrice || ''}" placeholder="Bỏ trống nếu không có giá cũ" />`)}
    ${field("Nhãn giảm giá / Khuyến mãi", textField("discountLabel", p.discountLabel || "", false))}
    ${field("Trạng thái kho *", selectField("stockStatus", p.stockStatus || "InStock", [["InStock", "Còn hàng"], ["OutOfStock", "Hết hàng"], ["PreOrder", "Đặt trước"]]))}
  `, async () => {
    const fd = new FormData($("#modal-form"));
    const price = Number(fd.get("price") || 0);
    const oldPriceStr = fd.get("oldPrice");
    const oldPrice = oldPriceStr ? Number(oldPriceStr) : null;
    const discountLabel = String(fd.get("discountLabel") || "").trim();
    const stockStatus = String(fd.get("stockStatus") || "InStock");

    await api(`/api/admin/products/${p.id}/price`, {
      method: "PUT",
      body: JSON.stringify({ price, oldPrice, discountLabel, stockStatus }),
    });
    loadProducts();
    return `Đã cập nhật giá sản phẩm ${p.name} thành công.`;
  });
}

function openProductForm(prod = null) {
  const p = prod || {};
  openModal(prod ? `Chi tiết sản phẩm #${p.id}` : "Thêm sản phẩm mới", `
    ${field("Tên sản phẩm *", textField("name", p.name || ""))}
    ${field("Đường dẫn (Slug) *", textField("slug", p.slug || "", !prod))}
    ${field("Mã danh mục (CategorySlug) *", textField("categorySlug", p.categorySlug || "laptops-group"))}
    ${field("Model Code", textField("modelCode", p.modelCode || "", false))}
    ${field("Tagline tóm tắt", textArea("tagline", p.tagline || ""))}
    ${field("URL ảnh Thumbnail", textField("thumbnailUrl", p.thumbnailUrl || "", false))}
    ${field("URL ảnh KeyVisual", textField("keyVisualUrl", p.keyVisualUrl || "", false))}
    ${!prod ? field("Giá bán khởi điểm (VNĐ)", `<input name="price" type="number" step="1000" min="0" value="0" />`) : ""}
    ${field("Nổi bật (IsFeatured)", checkboxField("isFeatured", !!p.isFeatured))}
    ${field("Bán chạy (IsHot)", checkboxField("isHot", !!p.isHot))}
    ${field("Kích hoạt (IsActive)", checkboxField("isActive", p.isActive !== false))}
  `, async () => {
    const fd = new FormData($("#modal-form"));
    if (prod) {
      const payload = {
        name: String(fd.get("name") || "").trim(),
        tagline: String(fd.get("tagline") || "").trim(),
        modelCode: String(fd.get("modelCode") || "").trim(),
        categorySlug: String(fd.get("categorySlug") || "").trim(),
        thumbnailUrl: String(fd.get("thumbnailUrl") || "").trim(),
        keyVisualUrl: String(fd.get("keyVisualUrl") || "").trim(),
        isFeatured: checkboxValue(fd, "isFeatured"),
        isHot: checkboxValue(fd, "isHot"),
        isActive: checkboxValue(fd, "isActive"),
      };
      await api(`/api/admin/products/${prod.id}`, { method: "PUT", body: JSON.stringify(payload) });
    } else {
      const payload = {
        slug: String(fd.get("slug") || "").trim(),
        name: String(fd.get("name") || "").trim(),
        categorySlug: String(fd.get("categorySlug") || "").trim(),
        modelCode: String(fd.get("modelCode") || "").trim(),
        tagline: String(fd.get("tagline") || "").trim(),
        thumbnailUrl: String(fd.get("thumbnailUrl") || "").trim(),
        keyVisualUrl: String(fd.get("keyVisualUrl") || "").trim(),
        price: Number(fd.get("price") || 0),
        discountLabel: "",
        stockStatus: "InStock",
      };
      await api("/api/admin/products", { method: "POST", body: JSON.stringify(payload) });
    }
    loadProducts();
  });
}

/* ---------- articles ---------- */

async function loadArticles() {
  const section = $("#article-section-filter").value;
  const tag = $("#article-tag-filter").value;
  const search = $("#article-search").value.trim();

  const params = new URLSearchParams({
    page: state.articlesPage,
    pageSize: state.articlesPageSize,
    includeInactive: "true",
  });
  if (section) params.set("section", section);
  if (tag) params.set("tag", tag);
  if (search) params.set("search", search);

  const result = await api(`/api/admin/articles?${params}`);

  // dropdown chuyên mục lấy từ API distinct-tags (đủ mọi trang, không lệ thuộc trang hiện tại)
  const tags = await api("/api/admin/articles/tags");
  const tagSelect = $("#article-tag-filter");
  const currentTag = tagSelect.value;
  tagSelect.innerHTML = '<option value="">Tất cả chuyên mục</option>' +
    tags.map((t) => `<option value="${escapeHtml(t)}">${escapeHtml(t)}</option>`).join("");
  if (currentTag && tags.some((t) => t === currentTag)) {
    tagSelect.value = currentTag;
  }

  $("#articles-table").innerHTML = `
    <thead><tr>
      <th>#</th><th>Ảnh</th><th>Tiêu đề</th><th>Chuyên mục</th><th>Khu vực</th>
      <th>Ngày</th><th>Thứ tự</th><th>Trạng thái</th><th>Thao tác</th>
    </tr></thead>
    <tbody>${result.items.map((a) => `
      <tr>
        <td>${a.id}</td>
        <td><img class="thumb" src="${escapeHtml(a.imageUrl)}" alt="" loading="lazy" /></td>
        <td class="cell-title">
          <strong>${escapeHtml(a.title)}</strong>
          ${a.href ? `<div class="cell-url">${escapeHtml(a.href)}</div>` : ""}
        </td>
        <td><span class="tag-chip">${escapeHtml(a.tag)}</span></td>
        <td>${SECTION_LABELS[a.section] || a.section}${a.isBig ? " (to)" : ""}</td>
        <td>${formatDate(a.publishedDate)}</td>
        <td>${a.sortOrder}</td>
        <td>${a.isActive ? '<span class="badge-on">Bật</span>' : '<span class="badge-off">Ẩn</span>'}</td>
        <td><div class="row-actions">
          <button class="btn btn-sm" data-edit-article="${a.id}">Sửa</button>
          <button class="btn btn-sm btn-danger" data-delete-article="${a.id}">Xóa</button>
        </div></td>
      </tr>`).join("")}</tbody>`;

  const pager = $("#articles-pager");
  pager.innerHTML = `
    <button class="btn btn-sm" id="articles-prev" ${result.page <= 1 ? "disabled" : ""}>‹ Trước</button>
    <span>Trang ${result.page}/${result.totalPages || 1} · ${result.totalCount} bài</span>
    <button class="btn btn-sm" id="articles-next" ${result.page >= result.totalPages ? "disabled" : ""}>Sau ›</button>`;
  $("#articles-prev").onclick = () => { state.articlesPage--; loadArticles(); };
  $("#articles-next").onclick = () => { state.articlesPage++; loadArticles(); };

  document.querySelectorAll("[data-edit-article]").forEach((btn) =>
    btn.onclick = () => openArticleForm(result.items.find((a) => a.id === Number(btn.dataset.editArticle))));
  document.querySelectorAll("[data-delete-article]").forEach((btn) =>
    btn.onclick = () => deleteArticle(Number(btn.dataset.deleteArticle)));
}

/* filter change => reset trang */
$("#article-section-filter").onchange = () => { state.articlesPage = 1; loadArticles(); };
$("#article-tag-filter").onchange = () => { state.articlesPage = 1; loadArticles(); };
$("#article-search").onchange = () => { state.articlesPage = 1; loadArticles(); };
if ($("#product-search")) {
  $("#product-search").onchange = () => { state.productsPage = 1; loadProducts(); };
}

function articleFormFields(a = {}) {
  return [
    field("Tiêu đề *", textField("title", a.title)),
    field("Tác giả bài viết", textField("author", a.author || "ROG Editor")),
    field("Mô tả ngắn (excerpt — chỉ trang Listing)", textArea("excerpt", a.excerpt || "")),
    field("Toàn văn nội dung bài viết (HTML / Rich Text)", `<textarea name="contentHtml" rows="8" style="font-family:monospace;font-size:13px;width:100%;box-sizing:border-box;" placeholder="<p>Nhập nội dung HTML hoặc các đoạn văn của bài viết...</p>">${escapeHtml(a.contentHtml || "")}</textarea>`),
    field("Chuyên mục/tag * (viết không cần prefix //)", textField("tag", (a.tag || "").replace(/^\/\/\s*/, ""))),
    field("Ảnh * (URL)", imageField("imageUrl", a.imageUrl)),
    field("Link *", textField("href", a.href)),
    field("Ngày đăng (Highlights)", `<input name="publishedDate" type="date" value="${a.publishedDate ? a.publishedDate.slice(0, 10) : ""}" />`),
    field("Khu vực *", selectField("section", a.section || "Listing", [["Highlights", "Highlights (trang chủ)"], ["Listing", "Listing (trang bài viết)"]])),
    field("Overlay text (FE chưa dùng — để trống)", textField("overlayText", a.overlayText || "", false)),
    field("Kích thước card (Highlights)", checkboxField("isBig", !!a.isBig)),
    field("Thứ tự", `<input name="sortOrder" type="number" value="${a.sortOrder ?? 0}" />`),
    field("Hiển thị", checkboxField("isActive", a.isActive !== false)),
  ].join("");
}

function articlePayload(form) {
  const fd = new FormData(form);
  const date = String(fd.get("publishedDate") || "");
  return {
    title: String(fd.get("title") || "").trim(),
    author: String(fd.get("author") || "").trim() || "ROG Editor",
    excerpt: String(fd.get("excerpt") || "").trim() || null,
    contentHtml: String(fd.get("contentHtml") || "").trim() || null,
    tag: String(fd.get("tag") || "").trim(),
    imageUrl: String(fd.get("imageUrl") || "").trim(),
    href: String(fd.get("href") || "").trim(),
    publishedDate: date || null,
    section: String(fd.get("section") || "Listing"),
    overlayText: String(fd.get("overlayText") || "").trim() || null,
    isBig: checkboxValue(fd, "isBig"),
    sortOrder: Number(fd.get("sortOrder") || 0),
    isActive: checkboxValue(fd, "isActive"),
  };
}

function openArticleForm(article = null) {
  openModal(article ? `Sửa bài viết #${article.id}` : "Thêm bài viết mới", articleFormFields(article || {}), async () => {
    const payload = articlePayload($("#modal-form"));
    if (article) {
      await api(`/api/admin/articles/${article.id}`, { method: "PUT", body: JSON.stringify(payload) });
    } else {
      await api("/api/admin/articles", { method: "POST", body: JSON.stringify(payload) });
    }
    loadArticles();
  });
}

async function deleteArticle(id) {
  if (!confirm(`Xóa bài viết #${id}?`)) return;
  try {
    await api(`/api/admin/articles/${id}`, { method: "DELETE" });
    toast("Đã xóa bài viết.");
    loadArticles();
  } catch (ex) {
    toast(ex.message, true);
  }
}

/* ---------- hero slides ---------- */

async function loadHeroSlides() {
  const slides = await api("/api/admin/hero-slides?includeInactive=true");
  $("#hero-slides-table").innerHTML = `
    <thead><tr><th>#</th><th>Ảnh</th><th>Alt</th><th>Link</th><th>Thứ tự</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
    <tbody>${slides.map((s) => `
      <tr>
        <td>${s.id}</td>
        <td><img class="thumb" src="${escapeHtml(s.imageUrl)}" alt="" loading="lazy" /></td>
        <td class="cell-title">${escapeHtml(s.altText)}</td>
        <td class="cell-url">${escapeHtml(s.href || "#")}</td>
        <td>${s.sortOrder}</td>
        <td>${s.isActive ? '<span class="badge-on">Bật</span>' : '<span class="badge-off">Ẩn</span>'}</td>
        <td><div class="row-actions">
          <button class="btn btn-sm" data-edit-hero="${s.id}">Sửa</button>
          <button class="btn btn-sm btn-danger" data-delete-hero="${s.id}">Xóa</button>
        </div></td>
      </tr>`).join("")}</tbody>`;

  document.querySelectorAll("[data-edit-hero]").forEach((btn) =>
    btn.onclick = () => openHeroSlideForm(slides.find((s) => s.id === Number(btn.dataset.editHero))));
  document.querySelectorAll("[data-delete-hero]").forEach((btn) =>
    btn.onclick = () => deleteEntity(
      `/api/admin/hero-slides/${btn.dataset.deleteHero}`, "slide", loadHeroSlides));
}

function openHeroSlideForm(slide = null) {
  const s = slide || {};
  openModal(slide ? `Sửa slide #${s.id}` : "Thêm slide hero", `
    ${field("Ảnh * (URL)", textField("imageUrl", s.imageUrl || ""))}
    ${field("Alt (chú thích) *", textField("altText", s.altText || ""))}
    ${field("Link (đang dùng # trên FE)", textField("href", s.href || "", false))}
    ${field("Thứ tự", `<input name="sortOrder" type="number" value="${s.sortOrder ?? 0}" />`)}
    ${field("Hiển thị", checkboxField("isActive", s.isActive !== false))}
  `, async (formData) => {
    const fd = new FormData($("#modal-form"));
    const payload = {
      imageUrl: String(fd.get("imageUrl") || "").trim(),
      altText: String(fd.get("altText") || "").trim(),
      href: String(fd.get("href") || "").trim() || null,
      sortOrder: Number(fd.get("sortOrder") || 0),
      isActive: checkboxValue(fd, "isActive"),
    };
    if (slide) {
      await api(`/api/admin/hero-slides/${slide.id}`, { method: "PUT", body: JSON.stringify(payload) });
    } else {
      await api("/api/admin/hero-slides", { method: "POST", body: JSON.stringify(payload) });
    }
    loadHeroSlides();
  });
}

/* ---------- product categories ---------- */

async function loadProductCategories() {
  const categories = await api("/api/admin/product-categories?includeInactive=true");
  $("#product-categories-table").innerHTML = `
    <thead><tr><th>#</th><th>Ảnh</th><th>Tên</th><th>Link</th><th>Thứ tự</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
    <tbody>${categories.map((c) => `
      <tr>
        <td>${c.id}</td>
        <td><img class="thumb" src="${escapeHtml(c.imageUrl)}" alt="" loading="lazy" /></td>
        <td class="cell-title">${escapeHtml(c.label)}</td>
        <td class="cell-url">${escapeHtml(c.href)}</td>
        <td>${c.sortOrder}</td>
        <td>${c.isActive ? '<span class="badge-on">Bật</span>' : '<span class="badge-off">Ẩn</span>'}</td>
        <td><div class="row-actions">
          <button class="btn btn-sm" data-edit-category="${c.id}">Sửa</button>
          <button class="btn btn-sm btn-danger" data-delete-category="${c.id}">Xóa</button>
        </div></td>
      </tr>`).join("")}</tbody>`;

  document.querySelectorAll("[data-edit-category]").forEach((btn) =>
    btn.onclick = () => openCategoryForm(categories.find((c) => c.id === Number(btn.dataset.editCategory))));
  document.querySelectorAll("[data-delete-category]").forEach((btn) =>
    btn.onclick = () => deleteEntity(
      `/api/admin/product-categories/${btn.dataset.deleteCategory}`, "danh mục", loadProductCategories));
}

function openCategoryForm(category = null) {
  const c = category || {};
  openModal(category ? `Sửa danh mục #${c.id}` : "Thêm danh mục sản phẩm", `
    ${field("Tên danh mục *", textField("label", c.label || ""))}
    ${field("Ảnh * (URL)", textField("imageUrl", c.imageUrl || ""))}
    ${field("Link *", textField("href", c.href || ""))}
    ${field("Thứ tự", `<input name="sortOrder" type="number" value="${c.sortOrder ?? 0}" />`)}
    ${field("Hiển thị", checkboxField("isActive", c.isActive !== false))}
  `, async () => {
    const fd = new FormData($("#modal-form"));
    const payload = {
      label: String(fd.get("label") || "").trim(),
      imageUrl: String(fd.get("imageUrl") || "").trim(),
      href: String(fd.get("href") || "").trim(),
      sortOrder: Number(fd.get("sortOrder") || 0),
      isActive: checkboxValue(fd, "isActive"),
    };
    if (category) {
      await api(`/api/admin/product-categories/${category.id}`, { method: "PUT", body: JSON.stringify(payload) });
    } else {
      await api("/api/admin/product-categories", { method: "POST", body: JSON.stringify(payload) });
    }
    loadProductCategories();
  });
}

/* ---------- footer links ---------- */

async function loadFooterLinks() {
  const links = await api("/api/admin/footer-links?includeInactive=true");
  $("#footer-links-table").innerHTML = `
    <thead><tr><th>#</th><th>Nhóm</th><th>Nhãn</th><th>Link</th><th>Thứ tự</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
    <tbody>${links.map((l) => `
      <tr>
        <td>${l.id}</td>
        <td>${GROUP_LABELS[l.group] || l.group}</td>
        <td class="cell-title">${escapeHtml(l.label)}</td>
        <td class="cell-url">${escapeHtml(l.href)}</td>
        <td>${l.sortOrder}</td>
        <td>${l.isActive ? '<span class="badge-on">Bật</span>' : '<span class="badge-off">Ẩn</span>'}</td>
        <td><div class="row-actions">
          <button class="btn btn-sm" data-edit-flink="${l.id}">Sửa</button>
          <button class="btn btn-sm btn-danger" data-delete-flink="${l.id}">Xóa</button>
        </div></td>
      </tr>`).join("")}</tbody>`;

  document.querySelectorAll("[data-edit-flink]").forEach((btn) =>
    btn.onclick = () => openFooterLinkForm(links.find((l) => l.id === Number(btn.dataset.editFlink))));
  document.querySelectorAll("[data-delete-flink]").forEach((btn) =>
    btn.onclick = () => deleteEntity(
      `/api/admin/footer-links/${btn.dataset.deleteFlink}`, "link", loadFooterLinks));
}

function openFooterLinkForm(link = null) {
  const l = link || {};
  openModal(link ? `Sửa link #${l.id}` : "Thêm link footer", `
    ${field("Nhãn *", textField("label", l.label || ""))}
    ${field("Link *", textField("href", l.href || ""))}
    ${field("Nhóm *", selectField("group", l.group || "Footer", [["Footer", "Nhóm chính"], ["Legal", "Pháp lý"], ["Social", "Mạng xã hội"]]))}
    ${field("Thứ tự", `<input name="sortOrder" type="number" value="${l.sortOrder ?? 0}" />`)}
    ${field("Hiển thị", checkboxField("isActive", l.isActive !== false))}
  `, async () => {
    const fd = new FormData($("#modal-form"));
    const payload = {
      label: String(fd.get("label") || "").trim(),
      href: String(fd.get("href") || "").trim(),
      group: String(fd.get("group") || "Footer"),
      sortOrder: Number(fd.get("sortOrder") || 0),
      isActive: checkboxValue(fd, "isActive"),
    };
    if (link) {
      await api(`/api/admin/footer-links/${link.id}`, { method: "PUT", body: JSON.stringify(payload) });
    } else {
      await api("/api/admin/footer-links", { method: "POST", body: JSON.stringify(payload) });
    }
    loadFooterLinks();
  });
}

/* ---------- site settings ---------- */

async function loadSettings() {
  const settings = await api("/api/admin/site-settings");
  const groups = {};
  for (const s of settings) {
    const prefix = Object.keys(SETTING_GROUP_LABELS).find((p) => s.key.startsWith(p)) || "footer";
    (groups[prefix] ||= []).push(s);
  }

  $("#settings-form").innerHTML = Object.entries(groups).map(([prefix, items]) => `
    <div class="settings-group">
      <h3>${SETTING_GROUP_LABELS[prefix]}</h3>
      ${items.map((s) => `
        <div class="settings-field">
          <label>${escapeHtml(s.key)}<br /><small>${escapeHtml(s.description || "")}</small></label>
          ${s.value.length > 80
            ? `<textarea data-setting-key="${escapeHtml(s.key)}">${escapeHtml(s.value)}</textarea>`
            : `<input data-setting-key="${escapeHtml(s.key)}" value="${escapeHtml(s.value)}" />`}
        </div>`).join("")}
    </div>`).join("");
}

$("#save-settings-btn").addEventListener("click", async () => {
  const inputs = document.querySelectorAll("[data-setting-key]");
  const settings = [...inputs].map((el) => ({ key: el.dataset.settingKey, value: el.value }));
  try {
    await api("/api/admin/site-settings", { method: "PUT", body: JSON.stringify({ settings }) });
    toast(`Đã lưu ${settings.length} cấu hình.`);
  } catch (ex) {
    toast(ex.message, true);
  }
});

/* ---------- shared delete + create buttons ---------- */

async function deleteEntity(url, what, reload) {
  if (!confirm(`Xóa ${what} này?`)) return;
  try {
    await api(url, { method: "DELETE" });
    toast("Đã xóa.");
    reload();
  } catch (ex) {
    toast(ex.message, true);
  }
}

document.querySelectorAll("[data-create]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const kind = btn.dataset.create;
    if (kind === "product") openProductForm();
    if (kind === "article") openArticleForm();
    if (kind === "hero-slide") openHeroSlideForm();
    if (kind === "category") openCategoryForm();
    if (kind === "footer-link") openFooterLinkForm();
    if (kind === "user") openUserForm();
  });
});

/* ---------- users (chỉ Admin) ---------- */

async function loadUsers() {
  const rows = await api("/api/admin/users");
  $("#users-table").innerHTML = `
    <thead><tr><th>#</th><th>Tên đăng nhập</th><th>Họ tên</th><th>Vai trò</th>
    <th>Trạng thái</th><th>Tạo lúc</th><th>Thao tác</th></tr></thead>
    <tbody>${rows.map((u) => `
      <tr>
        <td>${u.id}</td>
        <td class="cell-title"><strong>${escapeHtml(u.username)}</strong></td>
        <td>${escapeHtml(u.fullName)}</td>
        <td><span class="tag-chip">${escapeHtml(u.role)}</span></td>
        <td>${u.isActive ? '<span class="badge-on">Bật</span>' : '<span class="badge-off">Vô hiệu</span>'}</td>
        <td>${formatDate(u.createdAt)}</td>
        <td><div class="row-actions">
          <button class="btn btn-sm" data-edit-user="${u.id}">Sửa</button>
          <button class="btn btn-sm" data-reset-user="${u.id}">Đặt lại MK</button>
          <button class="btn btn-sm btn-danger" data-delete-user="${u.id}">Xóa</button>
        </div></td>
      </tr>`).join("")}</tbody>`;

  document.querySelectorAll("[data-edit-user]").forEach((btn) =>
    btn.onclick = () => openUserForm(rows.find((u) => u.id === Number(btn.dataset.editUser))));
  document.querySelectorAll("[data-reset-user]").forEach((btn) =>
    btn.onclick = () => openResetPasswordForm(rows.find((u) => u.id === Number(btn.dataset.resetUser))));
  document.querySelectorAll("[data-delete-user]").forEach((btn) =>
    btn.onclick = () => deleteUser(Number(btn.dataset.deleteUser)));
}

function openUserForm(user = null) {
  const u = user || {};
  const fields = user
    ? `
      ${field("Họ tên *", textField("fullName", u.fullName || ""))}
      ${field("Vai trò *", selectField("role", u.role || "Editor", [["Admin", "Admin (toàn quyền)"], ["Editor", "Editor (không xóa, không quản lý user)"]]))}
      ${field("Trạng thái", checkboxField("isActive", u.isActive !== false))}`
    : `
      ${field("Tên đăng nhập *", textField("username", ""))}
      ${field("Mật khẩu * (tối thiểu 8 ký tự)", `<input name="password" type="password" required minlength="8" maxlength="128" />`)}
      ${field("Họ tên *", textField("fullName", ""))}
      ${field("Vai trò *", selectField("role", "Editor", [["Admin", "Admin (toàn quyền)"], ["Editor", "Editor (không xóa, không quản lý user)"]]))}
      ${field("Trạng thái", checkboxField("isActive", true))}`;

  openModal(user ? `Sửa tài khoản #${u.id}` : "Thêm tài khoản mới", fields, async () => {
    if (user) {
      const fd = new FormData($("#modal-form"));
      const payload = {
        fullName: String(fd.get("fullName") || "").trim(),
        role: String(fd.get("role") || "Editor"),
        isActive: checkboxValue(fd, "isActive"),
      };
      await api(`/api/admin/users/${user.id}`, { method: "PUT", body: JSON.stringify(payload) });
    } else {
      const fd = new FormData($("#modal-form"));
      const payload = {
        username: String(fd.get("username") || "").trim(),
        password: String(fd.get("password") || ""),
        fullName: String(fd.get("fullName") || "").trim(),
        role: String(fd.get("role") || "Editor"),
        isActive: checkboxValue(fd, "isActive"),
      };
      await api("/api/admin/users", { method: "POST", body: JSON.stringify(payload) });
    }
    loadUsers();
  });
}

function openResetPasswordForm(user) {
  openModal(`Đặt lại mật khẩu — ${user.username}`, `
    ${field("Mật khẩu mới * (tối thiểu 8 ký tự)",
      `<input name="newPassword" type="password" required minlength="8" maxlength="128" />`)}
  `, async () => {
    const fd = new FormData($("#modal-form"));
    await api(`/api/admin/users/${user.id}/password`, {
      method: "PUT",
      body: JSON.stringify({ newPassword: String(fd.get("newPassword") || "") }),
    });
    return `Đã đặt lại mật khẩu cho ${user.username}.`;
  });
}

async function deleteUser(id) {
  if (!confirm(`Xóa tài khoản #${id}?`)) return;
  try {
    await api(`/api/admin/users/${id}`, { method: "DELETE" });
    toast("Đã xóa tài khoản.");
    loadUsers();
  } catch (ex) {
    toast(ex.message, true);
  }
}

/* ---------- đổi mật khẩu của chính mình ---------- */

$("#change-password-btn").addEventListener("click", () => {
  openModal("Đổi mật khẩu", `
    ${field("Mật khẩu hiện tại *", `<input name="currentPassword" type="password" required />`)}
    ${field("Mật khẩu mới * (tối thiểu 8 ký tự)", `<input name="newPassword" type="password" required minlength="8" maxlength="128" />`)}
    ${field("Nhập lại mật khẩu mới *", `<input name="confirmPassword" type="password" required minlength="8" />`)}
  `, async () => {
    const fd = new FormData($("#modal-form"));
    const newPassword = String(fd.get("newPassword") || "");
    if (newPassword !== String(fd.get("confirmPassword") || "")) {
      throw new Error("Mật khẩu nhập lại không khớp.");
    }
    await api("/api/admin/account/password", {
      method: "PUT",
      body: JSON.stringify({
        currentPassword: String(fd.get("currentPassword") || ""),
        newPassword,
      }),
    });
    return "Đã đổi mật khẩu. Token cũ vẫn dùng được đến khi hết hạn.";
  });
});

/* ---------- Specs & Scraper Modal ---------- */

async function openProductSpecsModal(product) {
  async function renderSpecsList(specs) {
    if (!specs || specs.length === 0) {
      return `<div style="color:#888;font-size:13px;padding:12px;text-align:center;">Chưa có thông số kỹ thuật nào.</div>`;
    }
    return `
      <div class="spec-list">
        ${specs.map((s) => `
          <div class="spec-item">
            <div>
              <span class="spec-grp">[${escapeHtml(s.specGroup)}]</span>
              <span class="spec-k">${escapeHtml(s.specKey)}:</span>
              <span class="spec-v">${escapeHtml(s.specValue)}</span>
            </div>
            <button class="btn btn-sm btn-danger" style="padding:2px 6px;font-size:11px;" onclick="deleteSpecItem(${product.id}, ${s.id})">Xóa</button>
          </div>
        `).join("")}
      </div>`;
  }

  const specs = await api(`/api/admin/products/${product.id}/specs`);

  window.deleteSpecItem = async (prodId, specId) => {
    if (!confirm("Xóa thông số này?")) return;
    try {
      await api(`/api/admin/products/specs/${specId}`, { method: "DELETE" });
      toast("Đã xóa thông số.");
      const updated = await api(`/api/admin/products/${prodId}/specs`);
      const container = document.getElementById("specs-container");
      if (container) container.innerHTML = await renderSpecsList(updated);
    } catch (ex) {
      toast(ex.message, true);
    }
  };

  openModal(`Quản lý Thông số Kỹ thuật — ${product.name}`, `
    <div style="font-size:13px;color:#aaa;margin-bottom:8px;">Model: <strong>${escapeHtml(product.name)}</strong> (ID #${product.id})</div>
    <div id="specs-container">${await renderSpecsList(specs)}</div>
    <hr style="border:0;border-top:1px solid var(--border);margin:12px 0;" />
    <h4 style="margin:0 0 8px;font-size:13px;color:#fff;">+ Thêm thông số mới</h4>
    <div class="grid-2">
      ${field("Nhóm thông số *", `<select name="specGroup">
        <option value="Processor">Processor (CPU)</option>
        <option value="Graphics">Graphics (GPU)</option>
        <option value="Display">Display (Màn hình)</option>
        <option value="Memory">Memory (RAM)</option>
        <option value="Storage">Storage (Ổ cứng)</option>
        <option value="Battery">Battery (Pin & Sạc)</option>
        <option value="Network">Network (Mạng & Wifi)</option>
        <option value="Camera">Camera & Cảm biến</option>
        <option value="Dimensions">Dimensions (Trọng lượng)</option>
      </select>`)}
      ${field("Tên thông số *", textField("specKey", "", true))}
    </div>
    ${field("Giá trị thông số *", textField("specValue", "", true))}
    ${field("Thứ tự hiển thị", `<input name="orderIndex" type="number" value="0" />`)}
  `, async () => {
    const fd = new FormData($("#modal-form"));
    const specGroup = String(fd.get("specGroup") || "").trim();
    const specKey = String(fd.get("specKey") || "").trim();
    const specValue = String(fd.get("specValue") || "").trim();
    const orderIndex = Number(fd.get("orderIndex") || 0);

    if (!specKey || !specValue) throw new Error("Vui lòng điền đủ tên và giá trị thông số.");

    await api(`/api/admin/products/${product.id}/specs`, {
      method: "POST",
      body: JSON.stringify({ specGroup, specKey, specValue, orderIndex })
    });
    return `Đã thêm thông số ${specKey} thành công.`;
  });
}

async function openGalleryModal(product) {
  const modal = $("#gallery-modal");
  const title = $("#gallery-modal-title");
  const listEl = $("#gallery-images-list");
  const urlIn = $("#gallery-img-url");
  const captionIn = $("#gallery-img-caption");
  const fileIn = $("#gallery-file-input");
  const addBtn = $("#gallery-add-btn");
  const closeBtn = $("#gallery-modal-close");
  const doneBtn = $("#gallery-modal-done");

  title.textContent = `🖼️ Album Ảnh: ${product.name} (ID #${product.id})`;
  urlIn.value = "";
  captionIn.value = "";
  fileIn.value = "";
  modal.classList.remove("hidden");

  const close = () => modal.classList.add("hidden");
  closeBtn.onclick = close;
  doneBtn.onclick = close;

  async function renderGallery() {
    listEl.innerHTML = `<div style="color:#aaa;padding:15px;grid-column:1/-1;">Đang tải album ảnh...</div>`;
    try {
      const images = await api(`/api/admin/products/${product.id}/images`);
      if (!images.length) {
        listEl.innerHTML = `<div style="color:#888;padding:20px;grid-column:1/-1;text-align:center;">Sản phẩm chưa có ảnh album phụ nào. Hãy tải lên ảnh từ máy tính hoặc dán URL ở trên.</div>`;
        return;
      }
      listEl.innerHTML = images.map((img) => `
        <div style="background:#111;border:1px solid #2a2a38;border-radius:6px;overflow:hidden;display:flex;flex-direction:column;position:relative;">
          <img src="${escapeHtml(img.imageUrl)}" alt="${escapeHtml(img.caption || '')}" style="width:100%;height:130px;object-fit:cover;" />
          <div style="padding:8px;font-size:11px;color:#ccc;flex:1;">
            <div style="font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(img.caption || 'Không chú thích')}</div>
            <div style="color:#888;font-size:10px;">Thứ tự: ${img.sortOrder}</div>
          </div>
          <button class="btn btn-sm btn-danger" style="margin:4px 8px 8px;padding:3px 8px;font-size:11px;" data-del-img="${img.id}">Xóa ảnh</button>
        </div>
      `).join("");

      listEl.querySelectorAll("[data-del-img]").forEach((btn) => {
        const imgId = Number(btn.dataset.delImg);
        btn.onclick = async () => {
          if (!confirm("Xóa ảnh này khỏi album sản phẩm?")) return;
          try {
            await api(`/api/admin/products/${product.id}/images/${imgId}`, { method: "DELETE" });
            toast("Đã xóa ảnh khỏi album!");
            renderGallery();
          } catch (ex) {
            toast(ex.message, true);
          }
        };
      });
    } catch (ex) {
      listEl.innerHTML = `<div style="color:#f87171;padding:15px;grid-column:1/-1;">Lỗi tải ảnh: ${escapeHtml(ex.message)}</div>`;
    }
  }

  // Handle direct file upload
  fileIn.onchange = async () => {
    if (!fileIn.files || !fileIn.files[0]) return;
    const fd = new FormData();
    fd.append("file", fileIn.files[0]);
    try {
      toast("Đang tải ảnh lên máy chủ...");
      const res = await api("/api/admin/media/upload", { method: "POST", body: fd });
      urlIn.value = res.url;
      toast("Tải ảnh lên thành công! Nhấn 'Thêm' để lưu vào album.");
    } catch (ex) {
      toast(ex.message, true);
    }
  };

  addBtn.onclick = async () => {
    const imageUrl = urlIn.value.trim();
    if (!imageUrl) {
      alert("Vui lòng nhập URL ảnh hoặc chọn file ảnh từ máy!");
      return;
    }
    const caption = captionIn.value.trim();
    try {
      await api(`/api/admin/products/${product.id}/images`, {
        method: "POST",
        body: JSON.stringify({ imageUrl, caption, sortOrder: 0 })
      });
      toast("Đã thêm ảnh vào album thành công!");
      urlIn.value = "";
      captionIn.value = "";
      fileIn.value = "";
      renderGallery();
    } catch (ex) {
      toast(ex.message, true);
    }
  };

  renderGallery();
}

function openScraperModal() {
  openModal("Cào sản phẩm tự động từ ASUS ROG", `
    <p style="font-size:13px;color:#aaa;margin:0 0 12px;">Nhập đường dẫn trang sản phẩm chính thức trên ASUS ROG để tự động cào thông tin, hình ảnh và cấu hình máy vào hệ thống:</p>
    ${field("URL trang web ASUS *", `<input name="scrapeUrl" type="url" placeholder="https://rog.asus.com/vn/laptops/..." required />`)}
  `, async () => {
    const fd = new FormData($("#modal-form"));
    const url = String(fd.get("scrapeUrl") || "").trim();
    if (!url) throw new Error("Vui lòng nhập URL hợp lệ.");

    toast("Đang tiến hành cào dữ liệu từ ASUS ROG (có thể mất 5-15 giây)...");
    const result = await api("/api/admin/scraper/trigger", {
      method: "POST",
      body: JSON.stringify({ url })
    });

    loadProducts();
    return `Cào dữ liệu thành công: Đã nhập sản phẩm "${result.productName || 'mới'}"!`;
  });
}

/* ---------- 1. Dealers (Đại lý) ---------- */

async function loadDealers() {
  const city = ($("#dealer-city-filter")?.value || "all").trim();
  const search = ($("#dealer-search")?.value || "").trim();
  const url = `/api/admin/dealers?page=${state.dealersPage}&pageSize=${state.dealersPageSize}&city=${encodeURIComponent(city)}&search=${encodeURIComponent(search)}`;
  const result = await api(url);

  $("#dealers-table").innerHTML = `
    <thead><tr><th>#</th><th>Logo</th><th>Tên đại lý</th><th>Hotline</th><th>Khu vực phủ sóng</th><th>Số CH</th><th>Loại đại lý</th><th>Thao tác</th></tr></thead>
    <tbody>${result.items.map((d) => `
      <tr>
        <td>${d.id}</td>
        <td><img class="thumb" src="${escapeHtml(d.logoUrl || '/sites/rog-asus/img/hero/gamescom.webp')}" alt="" loading="lazy" /></td>
        <td class="cell-title">
          <strong>${escapeHtml(d.name)}</strong>
          <div style="font-size:11px;color:#888;"><a href="${escapeHtml(d.websiteUrl)}" target="_blank" style="color:#ff0033">${escapeHtml(d.websiteUrl)}</a></div>
        </td>
        <td><code>${escapeHtml(d.hotline || "—")}</code></td>
        <td>${escapeHtml(d.cityCoverage || "Toàn quốc")}</td>
        <td><strong>${d.storeCount}</strong></td>
        <td>${d.isOfficialPartner ? '<span class="badge-approved">Ủy quyền chính thức</span>' : '<span style="color:#aaa;">Bán lẻ</span>'}</td>
        <td><div class="row-actions">
          <button class="btn btn-sm" data-edit-dealer="${d.id}">✏️ Sửa</button>
          <button class="btn btn-sm btn-danger" data-delete-dealer="${d.id}">Xóa</button>
        </div></td>
      </tr>
    `).join("")}</tbody>`;

  const pager = $("#dealers-pager");
  pager.innerHTML = `
    <button class="btn btn-sm" id="dealers-prev" ${result.page <= 1 ? "disabled" : ""}>‹ Trước</button>
    <span>Trang ${result.page}/${result.totalPages || 1} · ${result.totalCount} đại lý</span>
    <button class="btn btn-sm" id="dealers-next" ${result.page >= result.totalPages ? "disabled" : ""}>Sau ›</button>`;
  $("#dealers-prev").onclick = () => { state.dealersPage--; loadDealers(); };
  $("#dealers-next").onclick = () => { state.dealersPage++; loadDealers(); };

  document.querySelectorAll("[data-edit-dealer]").forEach((btn) => {
    const id = Number(btn.dataset.editDealer);
    const item = result.items.find((d) => d.id === id);
    btn.onclick = () => openDealerForm(item);
  });

  document.querySelectorAll("[data-delete-dealer]").forEach((btn) => {
    btn.onclick = () => deleteEntity(`/api/admin/dealers/${btn.dataset.deleteDealer}`, "đại lý", loadDealers);
  });
}

function openDealerForm(dealer = null) {
  const d = dealer || {};
  openModal(dealer ? `Sửa đại lý #${d.id}` : "Thêm đại lý mới", `
    ${field("Tên đại lý *", textField("name", d.name || ""))}
    ${field("Đường dẫn (Slug)", textField("slug", d.slug || "", false))}
    ${field("Logo đại lý (URL)", imageField("logoUrl", d.logoUrl || ""))}
    ${field("Website chính thức", textField("websiteUrl", d.websiteUrl || "", false, "url"))}
    ${field("Hotline tổng đài", textField("hotline", d.hotline || "", false))}
    ${field("Số lượng cửa hàng", `<input name="storeCount" type="number" min="1" value="${d.storeCount || 1}" />`)}
    ${field("Khu vực phủ sóng (Tỉnh thành)", textField("cityCoverage", d.cityCoverage || "Hà Nội, TP.HCM, Toàn quốc"))}
    ${field("Đại lý ủy quyền chính thức", checkboxField("isOfficialPartner", d.isOfficialPartner !== false))}
  `, async () => {
    const fd = new FormData($("#modal-form"));
    const payload = {
      name: String(fd.get("name") || "").trim(),
      slug: String(fd.get("slug") || "").trim(),
      logoUrl: String(fd.get("logoUrl") || "").trim(),
      websiteUrl: String(fd.get("websiteUrl") || "").trim(),
      hotline: String(fd.get("hotline") || "").trim(),
      storeCount: Number(fd.get("storeCount") || 1),
      cityCoverage: String(fd.get("cityCoverage") || "Toàn quốc").trim(),
      isOfficialPartner: checkboxValue(fd, "isOfficialPartner")
    };

    if (dealer) {
      await api(`/api/admin/dealers/${dealer.id}`, { method: "PUT", body: JSON.stringify(payload) });
    } else {
      await api("/api/admin/dealers", { method: "POST", body: JSON.stringify(payload) });
    }
    loadDealers();
  });
}

/* ---------- 2. Warranty (Bảo hành & Serial) ---------- */

async function loadWarranty() {
  const search = ($("#warranty-search")?.value || "").trim();
  const url = `/api/admin/warranty?page=${state.warrantyPage}&pageSize=${state.warrantyPageSize}&search=${encodeURIComponent(search)}`;
  const result = await api(url);

  $("#warranty-table").innerHTML = `
    <thead><tr><th>#</th><th>Số Serial</th><th>Dòng máy (Model)</th><th>Ngày mua</th><th>Hạn bảo hành</th><th>Trạng thái</th><th>Trung tâm bảo hành</th><th>Thao tác</th></tr></thead>
    <tbody>${result.items.map((w) => {
      const isExpired = new Date(w.expiryDate) < new Date();
      const badge = w.status === "InService"
        ? '<span class="badge-pending">Đang tiếp nhận TTBH</span>'
        : (isExpired ? '<span class="badge-off">Hết hạn</span>' : '<span class="badge-approved">Chính hãng (Active)</span>');
      return `
      <tr>
        <td>${w.id}</td>
        <td><code><strong>${escapeHtml(w.serialNumber)}</strong></code></td>
        <td class="cell-title"><strong>${escapeHtml(w.productModel)}</strong></td>
        <td>${formatDate(w.purchaseDate)}</td>
        <td style="${isExpired ? 'color:#ef4444' : 'color:#10b981'}">${formatDate(w.expiryDate)}</td>
        <td>${badge}</td>
        <td><span style="font-size:12px;color:#aaa;">${escapeHtml(w.serviceCenter || 'ASUS Center')}</span></td>
        <td><div class="row-actions">
          <button class="btn btn-sm" data-edit-warranty="${w.id}">✏️ Sửa</button>
          <button class="btn btn-sm btn-danger" data-delete-warranty="${w.id}">Xóa</button>
        </div></td>
      </tr>`;
    }).join("")}</tbody>`;

  const pager = $("#warranty-pager");
  pager.innerHTML = `
    <button class="btn btn-sm" id="warranty-prev" ${result.page <= 1 ? "disabled" : ""}>‹ Trước</button>
    <span>Trang ${result.page}/${result.totalPages || 1} · ${result.totalCount} hồ sơ</span>
    <button class="btn btn-sm" id="warranty-next" ${result.page >= result.totalPages ? "disabled" : ""}>Sau ›</button>`;
  $("#warranty-prev").onclick = () => { state.warrantyPage--; loadWarranty(); };
  $("#warranty-next").onclick = () => { state.warrantyPage++; loadWarranty(); };

  document.querySelectorAll("[data-edit-warranty]").forEach((btn) => {
    const id = Number(btn.dataset.editWarranty);
    const item = result.items.find((w) => w.id === id);
    btn.onclick = () => openWarrantyForm(item);
  });

  document.querySelectorAll("[data-delete-warranty]").forEach((btn) => {
    btn.onclick = () => deleteEntity(`/api/admin/warranty/${btn.dataset.deleteWarranty}`, "hồ sơ bảo hành", loadWarranty);
  });
}

function openWarrantyForm(record = null) {
  const w = record || {};
  const purchaseDefault = w.purchaseDate ? w.purchaseDate.split("T")[0] : new Date().toISOString().split("T")[0];
  const expiryDefault = w.expiryDate ? w.expiryDate.split("T")[0] : new Date(Date.now() + 2 * 365 * 86400000).toISOString().split("T")[0];

  openModal(record ? `Sửa hồ sơ bảo hành #${w.id}` : "Thêm hồ sơ máy/serial mới", `
    ${field("Số Serial máy * (In hoa)", `<input name="serialNumber" type="text" value="${escapeHtml(w.serialNumber || '')}" placeholder="R4NRCX0001" required style="text-transform:uppercase" />`)}
    ${field("Dòng máy (Model) *", textField("productModel", w.productModel || "ROG Zephyrus G16 GU605"))}
    <div class="grid-2">
      ${field("Ngày kích hoạt mua *", `<input name="purchaseDate" type="date" value="${purchaseDefault}" required />`)}
      ${field("Ngày hết hạn bảo hành *", `<input name="expiryDate" type="date" value="${expiryDefault}" required />`)}
    </div>
    ${field("Trạng thái hồ sơ", selectField("status", w.status || "Active", [
      ["Active", "Active — Còn hạn chính hãng"],
      ["InService", "InService — Đang tiếp nhận xử lý"],
      ["Expired", "Expired — Hết hạn bảo hành"]
    ]))}
    ${field("Trung tâm bảo hành tiếp nhận", textField("serviceCenter", w.serviceCenter || "ASUS Service Center TP.HCM - 285 CMT8"))}
  `, async () => {
    const fd = new FormData($("#modal-form"));
    const payload = {
      serialNumber: String(fd.get("serialNumber") || "").trim().toUpperCase(),
      productModel: String(fd.get("productModel") || "").trim(),
      purchaseDate: new Date(String(fd.get("purchaseDate"))).toISOString(),
      expiryDate: new Date(String(fd.get("expiryDate"))).toISOString(),
      status: String(fd.get("status") || "Active"),
      serviceCenter: String(fd.get("serviceCenter") || "").trim()
    };

    if (record) {
      await api(`/api/admin/warranty/${record.id}`, { method: "PUT", body: JSON.stringify(payload) });
    } else {
      await api("/api/admin/warranty", { method: "POST", body: JSON.stringify(payload) });
    }
    loadWarranty();
  });
}

/* ---------- 3. Reviews (Kiểm duyệt đánh giá) ---------- */

async function loadReviews() {
  const approved = ($("#review-status-filter")?.value || "").trim();
  const search = ($("#review-search")?.value || "").trim();
  let url = `/api/admin/reviews?page=${state.reviewsPage}&pageSize=${state.reviewsPageSize}&search=${encodeURIComponent(search)}`;
  if (approved !== "") url += `&approved=${approved}`;

  const result = await api(url);

  $("#reviews-table").innerHTML = `
    <thead><tr><th>Slug máy</th><th>Tên khách</th><th>Điểm sao</th><th>Nội dung nhận xét</th><th>Ngày gửi</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
    <tbody>${result.items.map((r) => {
      const stars = "⭐".repeat(r.rating || 5);
      return `
      <tr>
        <td><code>${escapeHtml(r.productSlug)}</code></td>
        <td><strong>${escapeHtml(r.authorName || 'Khách ROG')}</strong></td>
        <td>${stars}</td>
        <td style="max-width:320px;">
          ${r.title ? `<strong style="display:block;margin-bottom:2px;">${escapeHtml(r.title)}</strong>` : ''}
          <span style="font-size:12px;color:#ccc;">${escapeHtml(r.content)}</span>
        </td>
        <td>${formatDate(r.createdAtUtc)}</td>
        <td>${r.isApproved ? '<span class="badge-approved">Đã duyệt</span>' : '<span class="badge-pending">Chờ duyệt</span>'}</td>
        <td><div class="row-actions">
          ${!r.isApproved ? `<button class="btn btn-sm btn-primary" data-approve-review="${r.id}">✅ Duyệt</button>` : `<button class="btn btn-sm btn-ghost" data-reject-review="${r.id}">❌ Hạ</button>`}
          <button class="btn btn-sm btn-danger" data-delete-review="${r.id}">Xóa</button>
        </div></td>
      </tr>`;
    }).join("")}</tbody>`;

  const pager = $("#reviews-pager");
  pager.innerHTML = `
    <button class="btn btn-sm" id="reviews-prev" ${result.page <= 1 ? "disabled" : ""}>‹ Trước</button>
    <span>Trang ${result.page}/${result.totalPages || 1} · ${result.totalCount} đánh giá</span>
    <button class="btn btn-sm" id="reviews-next" ${result.page >= result.totalPages ? "disabled" : ""}>Sau ›</button>`;
  $("#reviews-prev").onclick = () => { state.reviewsPage--; loadReviews(); };
  $("#reviews-next").onclick = () => { state.reviewsPage++; loadReviews(); };

  document.querySelectorAll("[data-approve-review]").forEach((btn) => {
    btn.onclick = async () => {
      try {
        await api(`/api/admin/reviews/${btn.dataset.approveReview}/approve`, { method: "PUT" });
        toast("Đã duyệt đánh giá!");
        loadReviews();
      } catch (ex) {
        toast(ex.message, true);
      }
    };
  });

  document.querySelectorAll("[data-reject-review]").forEach((btn) => {
    btn.onclick = async () => {
      try {
        await api(`/api/admin/reviews/${btn.dataset.rejectReview}/reject`, { method: "PUT" });
        toast("Đã chuyển về trạng thái chờ duyệt.");
        loadReviews();
      } catch (ex) {
        toast(ex.message, true);
      }
    };
  });

  document.querySelectorAll("[data-delete-review]").forEach((btn) => {
    btn.onclick = () => deleteEntity(`/api/admin/reviews/${btn.dataset.deleteReview}`, "đánh giá", loadReviews);
  });
}

/* ---------- 4. Campaigns (Sự kiện & Khuyến mãi) ---------- */

async function loadCampaigns() {
  const result = await api("/api/admin/campaigns");

  $("#campaigns-table").innerHTML = `
    <thead><tr><th>Ảnh</th><th>Badge</th><th>Tiêu đề chiến dịch</th><th>Thời gian</th><th>Nút bấm / Link</th><th>Thứ tự</th><th>Bật</th><th>Thao tác</th></tr></thead>
    <tbody>${result.map((c) => `
      <tr>
        <td><img class="thumb" src="${escapeHtml(c.img || '/sites/rog-asus/img/hero/gamescom.webp')}" alt="" loading="lazy" /></td>
        <td><span class="badge-approved" style="background:#4a151b;color:#ff4466;">${escapeHtml(c.badge)}</span></td>
        <td class="cell-title">
          <strong>${escapeHtml(c.title)}</strong>
          <div style="font-size:11px;color:#888;max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(c.desc)}</div>
        </td>
        <td>${escapeHtml(c.period)}</td>
        <td><code>${escapeHtml(c.ctaText)}</code><br/><span style="font-size:11px;color:#aaa;">${escapeHtml(c.ctaLink)}</span></td>
        <td>${c.sortOrder}</td>
        <td>${c.isActive ? '<span class="badge-on">Bật</span>' : '<span class="badge-off">Tắt</span>'}</td>
        <td><div class="row-actions">
          <button class="btn btn-sm" data-edit-campaign="${c.id}">✏️ Sửa</button>
          <button class="btn btn-sm btn-danger" data-delete-campaign="${c.id}">Xóa</button>
        </div></td>
      </tr>
    `).join("")}</tbody>`;

  document.querySelectorAll("[data-edit-campaign]").forEach((btn) => {
    const id = Number(btn.dataset.editCampaign);
    const item = result.find((c) => c.id === id);
    btn.onclick = () => openCampaignForm(item);
  });

  document.querySelectorAll("[data-delete-campaign]").forEach((btn) => {
    btn.onclick = () => deleteEntity(`/api/admin/campaigns/${btn.dataset.deleteCampaign}`, "chiến dịch", loadCampaigns);
  });
}

function openCampaignForm(camp = null) {
  const c = camp || {};
  openModal(camp ? `Sửa sự kiện #${c.id}` : "Thêm sự kiện / khuyến mãi mới", `
    ${field("Huy hiệu (Badge) *", textField("badge", c.badge || "ƯU ĐÃI NỔI BẬT"))}
    ${field("Tiêu đề chiến dịch *", textField("title", c.title || ""))}
    ${field("Thời gian áp dụng *", textField("period", c.period || "Áp dụng từ 01/01/2026 đến khi hết quà"))}
    ${field("Mô tả chi tiết thể lệ *", textArea("desc", c.desc || ""))}
    ${field("Link hình ảnh Banner (URL)", imageField("img", c.img || "/sites/rog-asus/img/hero/gamescom.webp"))}
    <div class="grid-2">
      ${field("Chữ hiển thị trên nút CTA", textField("ctaText", c.ctaText || "XEM CHI TIẾT"))}
      ${field("Đường dẫn liên kết (CTA Link)", textField("ctaLink", c.ctaLink || "/vn/laptops-group"))}
    </div>
    <div class="grid-2">
      ${field("Thứ tự hiển thị", `<input name="sortOrder" type="number" value="${c.sortOrder || 0}" />`)}
      ${field("Kích hoạt hiển thị", checkboxField("isActive", c.isActive !== false))}
    </div>
  `, async () => {
    const fd = new FormData($("#modal-form"));
    const payload = {
      badge: String(fd.get("badge") || "").trim(),
      title: String(fd.get("title") || "").trim(),
      period: String(fd.get("period") || "").trim(),
      desc: String(fd.get("desc") || "").trim(),
      img: String(fd.get("img") || "").trim(),
      ctaText: String(fd.get("ctaText") || "").trim(),
      ctaLink: String(fd.get("ctaLink") || "").trim(),
      sortOrder: Number(fd.get("sortOrder") || 0),
      isActive: checkboxValue(fd, "isActive")
    };

    if (camp) {
      await api(`/api/admin/campaigns/${camp.id}`, { method: "PUT", body: JSON.stringify(payload) });
    } else {
      await api("/api/admin/campaigns", { method: "POST", body: JSON.stringify(payload) });
    }
    loadCampaigns();
  });
}

/* ---------- 5. Downloads (Kho phần mềm & Driver) ---------- */

async function loadDownloads() {
  const result = await api("/api/admin/downloads");

  $("#downloads-table").innerHTML = `
    <thead><tr><th>Phần mềm</th><th>Phiên bản</th><th>Dung lượng</th><th>Hệ điều hành</th><th>Huy hiệu</th><th>Thứ tự</th><th>Bật</th><th>Thao tác</th></tr></thead>
    <tbody>${result.map((d) => `
      <tr>
        <td class="cell-title">
          <strong>${escapeHtml(d.name)}</strong>
          <div style="font-size:11px;color:#888;max-width:280px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(d.desc)}</div>
        </td>
        <td><code>${escapeHtml(d.version)}</code></td>
        <td>${escapeHtml(d.size)}</td>
        <td>${escapeHtml(d.os)}</td>
        <td><span class="badge-approved" style="background:#1e1e24;color:#aaa;">${escapeHtml(d.badge || '—')}</span></td>
        <td>${d.sortOrder}</td>
        <td>${d.isActive ? '<span class="badge-on">Bật</span>' : '<span class="badge-off">Tắt</span>'}</td>
        <td><div class="row-actions">
          <button class="btn btn-sm" data-edit-download="${d.id}">✏️ Sửa</button>
          <button class="btn btn-sm btn-danger" data-delete-download="${d.id}">Xóa</button>
        </div></td>
      </tr>
    `).join("")}</tbody>`;

  document.querySelectorAll("[data-edit-download]").forEach((btn) => {
    const id = Number(btn.dataset.editDownload);
    const item = result.find((d) => d.id === id);
    btn.onclick = () => openDownloadForm(item);
  });

  document.querySelectorAll("[data-delete-download]").forEach((btn) => {
    btn.onclick = () => deleteEntity(`/api/admin/downloads/${btn.dataset.deleteDownload}`, "phần mềm", loadDownloads);
  });
}

function openDownloadForm(item = null) {
  const d = item || {};
  let featuresText = "";
  try {
    const parsed = JSON.parse(d.featuresJson || "[]");
    featuresText = Array.isArray(parsed) ? parsed.join("\n") : "";
  } catch {}

  openModal(item ? `Sửa phần mềm #${d.id}` : "Thêm phần mềm mới", `
    ${field("Tên phần mềm *", textField("name", d.name || ""))}
    <div class="grid-2">
      ${field("Phiên bản (Version) *", textField("version", d.version || "v1.0.0"))}
      ${field("Dung lượng file *", textField("size", d.size || "10 MB"))}
    </div>
    ${field("Mô tả ngắn *", textArea("desc", d.desc || ""))}
    ${field("Các tính năng nổi bật (Mỗi dòng 1 tính năng)", `<textarea name="features" rows="4">${escapeHtml(featuresText)}</textarea>`)}
    <div class="grid-2">
      ${field("Hệ điều hành tương thích", textField("os", d.os || "Windows 11 / 10 64-bit"))}
      ${field("Huy hiệu (Badge)", textField("badge", d.badge || "PHẦN MỀM CHỦ LỰC", false))}
    </div>
    ${field("Đường dẫn tải về chính thức (Download URL) *", textField("downloadUrl", d.downloadUrl || "", true, "url"))}
    <div class="grid-2">
      ${field("Thứ tự hiển thị", `<input name="sortOrder" type="number" value="${d.sortOrder || 0}" />`)}
      ${field("Kích hoạt hiển thị", checkboxField("isActive", d.isActive !== false))}
    </div>
  `, async () => {
    const fd = new FormData($("#modal-form"));
    const featuresLines = String(fd.get("features") || "").split("\n").map(l => l.trim()).filter(Boolean);
    const payload = {
      name: String(fd.get("name") || "").trim(),
      version: String(fd.get("version") || "").trim(),
      size: String(fd.get("size") || "").trim(),
      desc: String(fd.get("desc") || "").trim(),
      featuresJson: JSON.stringify(featuresLines),
      os: String(fd.get("os") || "").trim(),
      badge: String(fd.get("badge") || "").trim(),
      downloadUrl: String(fd.get("downloadUrl") || "").trim(),
      sortOrder: Number(fd.get("sortOrder") || 0),
      isActive: checkboxValue(fd, "isActive")
    };

    if (item) {
      await api(`/api/admin/downloads/${item.id}`, { method: "PUT", body: JSON.stringify(payload) });
    } else {
      await api("/api/admin/downloads", { method: "POST", body: JSON.stringify(payload) });
    }
    loadDownloads();
  });
}

/* ---------- Innovations (Sáng tạo & Công nghệ) ---------- */

async function loadInnovations() {
  const result = await api("/api/admin/innovations");

  $("#innovations-table").innerHTML = `
    <thead><tr><th>Ảnh</th><th>Tag</th><th>Tiêu đề</th><th>Mô tả</th><th>Điểm nhấn</th><th>Thứ tự</th><th>Bật</th><th>Thao tác</th></tr></thead>
    <tbody>${result.map((i) => {
      let hlCount = 0;
      try { hlCount = JSON.parse(i.highlightsJson || "[]").length; } catch {}
      return `
      <tr>
        <td><img class="thumb" src="${escapeHtml(i.imageUrl || '/sites/rog-asus/img/detail/gu605-cooling.webp')}" alt="" loading="lazy" /></td>
        <td><span class="badge-approved" style="background:#26050b;color:#ff4466;">${escapeHtml(i.tag)}</span></td>
        <td class="cell-title"><strong>${escapeHtml(i.title)}</strong></td>
        <td><div style="font-size:12px;color:#aaa;max-width:280px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${escapeHtml(i.description)}</div></td>
        <td><span class="badge-approved" style="background:#1e1e24;color:#aaa;">${hlCount} điểm</span></td>
        <td>${i.sortOrder}</td>
        <td>${i.isActive ? '<span class="badge-on">Bật</span>' : '<span class="badge-off">Tắt</span>'}</td>
        <td><div class="row-actions">
          <button class="btn btn-sm" data-edit-innovation="${i.id}">✏️ Sửa</button>
          <button class="btn btn-sm btn-danger" data-delete-innovation="${i.id}">Xóa</button>
        </div></td>
      </tr>
    `}).join("")}</tbody>`;

  document.querySelectorAll("[data-edit-innovation]").forEach((btn) => {
    const id = Number(btn.dataset.editInnovation);
    const item = result.find((x) => x.id === id);
    btn.onclick = () => openInnovationForm(item);
  });

  document.querySelectorAll("[data-delete-innovation]").forEach((btn) => {
    btn.onclick = () => deleteEntity(`/api/admin/innovations/${btn.dataset.deleteInnovation}`, "công nghệ", loadInnovations);
  });
}

function openInnovationForm(item = null) {
  const i = item || {};
  let hlText = "";
  try {
    const parsed = JSON.parse(i.highlightsJson || "[]");
    hlText = Array.isArray(parsed) ? parsed.join("\n") : "";
  } catch {}

  openModal(item ? `Sửa công nghệ #${i.id}` : "Thêm công nghệ mới", `
    ${field("Tag / Phân loại *", textField("tag", i.tag || "// TẢN NHIỆT ĐỈNH CAO"))}
    ${field("Tiêu đề công nghệ *", textField("title", i.title || ""))}
    ${field("Mô tả chi tiết *", textArea("description", i.description || ""))}
    ${field("Các điểm nhấn nổi bật (Mỗi dòng 1 ý)", `<textarea name="highlights" rows="4">${escapeHtml(hlText)}</textarea>`)}
    ${field("Hình ảnh minh họa", imageField("imageUrl", i.imageUrl || "/sites/rog-asus/img/detail/gu605-cooling.webp"))}
    <div class="grid-2">
      ${field("Thứ tự hiển thị", `<input name="sortOrder" type="number" value="${i.sortOrder || 0}" />`)}
      ${field("Kích hoạt hiển thị", checkboxField("isActive", i.isActive !== false))}
    </div>
  `, async () => {
    const fd = new FormData($("#modal-form"));
    const hlLines = String(fd.get("highlights") || "").split("\n").map(l => l.trim()).filter(Boolean);
    const payload = {
      tag: String(fd.get("tag") || "").trim(),
      title: String(fd.get("title") || "").trim(),
      description: String(fd.get("description") || "").trim(),
      highlightsJson: JSON.stringify(hlLines),
      imageUrl: String(fd.get("imageUrl") || "").trim(),
      sortOrder: Number(fd.get("sortOrder") || 0),
      isActive: checkboxValue(fd, "isActive")
    };

    if (item) {
      await api(`/api/admin/innovations/${item.id}`, { method: "PUT", body: JSON.stringify(payload) });
    } else {
      await api("/api/admin/innovations", { method: "POST", body: JSON.stringify(payload) });
    }
    loadInnovations();
  });
}

/* ---------- Wallpapers (Hình nền 4K) ---------- */

async function loadWallpapers() {
  const result = await api("/api/admin/wallpapers");

  $("#wallpapers-table").innerHTML = `
    <thead><tr><th>Ảnh xem trước</th><th>Tiêu đề hình nền</th><th>Độ phân giải</th><th>Link tải</th><th>Thứ tự</th><th>Bật</th><th>Thao tác</th></tr></thead>
    <tbody>${result.map((w) => `
      <tr>
        <td><img class="thumb" style="width:100px;height:56px;object-fit:cover;" src="${escapeHtml(w.imageUrl || '/sites/rog-asus/img/hero/gamescom.webp')}" alt="" loading="lazy" /></td>
        <td class="cell-title"><strong>${escapeHtml(w.title)}</strong></td>
        <td><code>${escapeHtml(w.resolution)}</code></td>
        <td><a href="${escapeHtml(w.downloadUrl || w.imageUrl)}" target="_blank" rel="noreferrer" style="font-size:12px;color:#ff4466;">Tải về ↗</a></td>
        <td>${w.sortOrder}</td>
        <td>${w.isActive ? '<span class="badge-on">Bật</span>' : '<span class="badge-off">Tắt</span>'}</td>
        <td><div class="row-actions">
          <button class="btn btn-sm" data-edit-wallpaper="${w.id}">✏️ Sửa</button>
          <button class="btn btn-sm btn-danger" data-delete-wallpaper="${w.id}">Xóa</button>
        </div></td>
      </tr>
    `).join("")}</tbody>`;

  document.querySelectorAll("[data-edit-wallpaper]").forEach((btn) => {
    const id = Number(btn.dataset.editWallpaper);
    const item = result.find((x) => x.id === id);
    btn.onclick = () => openWallpaperForm(item);
  });

  document.querySelectorAll("[data-delete-wallpaper]").forEach((btn) => {
    btn.onclick = () => deleteEntity(`/api/admin/wallpapers/${btn.dataset.deleteWallpaper}`, "hình nền", loadWallpapers);
  });
}

function openWallpaperForm(item = null) {
  const w = item || {};
  openModal(item ? `Sửa hình nền #${w.id}` : "Thêm hình nền 4K mới", `
    ${field("Tiêu đề hình nền *", textField("title", w.title || ""))}
    ${field("Độ phân giải *", textField("resolution", w.resolution || "3840 x 2160 (4K)"))}
    ${field("Link ảnh Wallpaper (URL)", imageField("imageUrl", w.imageUrl || "/sites/rog-asus/img/hero/gamescom.webp"))}
    ${field("Link tải trực tiếp (Download URL)", textField("downloadUrl", w.downloadUrl || ""))}
    <div class="grid-2">
      ${field("Thứ tự hiển thị", `<input name="sortOrder" type="number" value="${w.sortOrder || 0}" />`)}
      ${field("Kích hoạt hiển thị", checkboxField("isActive", w.isActive !== false))}
    </div>
  `, async () => {
    const fd = new FormData($("#modal-form"));
    const payload = {
      title: String(fd.get("title") || "").trim(),
      resolution: String(fd.get("resolution") || "").trim(),
      imageUrl: String(fd.get("imageUrl") || "").trim(),
      downloadUrl: String(fd.get("downloadUrl") || "").trim(),
      sortOrder: Number(fd.get("sortOrder") || 0),
      isActive: checkboxValue(fd, "isActive")
    };

    if (item) {
      await api(`/api/admin/wallpapers/${item.id}`, { method: "PUT", body: JSON.stringify(payload) });
    } else {
      await api("/api/admin/wallpapers", { method: "POST", body: JSON.stringify(payload) });
    }
    loadWallpapers();
  });
}

/* ---------- About Stories (Cột mốc lịch sử ROG) ---------- */

async function loadAboutStories() {
  const result = await api("/api/admin/about-stories");

  $("#about-stories-table").innerHTML = `
    <thead><tr><th>Ảnh</th><th>Năm / Thời kỳ</th><th>Tiêu đề câu chuyện</th><th>Nội dung</th><th>Thứ tự</th><th>Bật</th><th>Thao tác</th></tr></thead>
    <tbody>${result.map((s) => `
      <tr>
        <td><img class="thumb" src="${escapeHtml(s.imageUrl || '/sites/rog-asus/img/mb/hot-crosshair-x870e.webp')}" alt="" loading="lazy" /></td>
        <td><span class="badge-approved" style="background:#26050b;color:#ff4466;">${escapeHtml(s.yearTag)}</span></td>
        <td class="cell-title"><strong>${escapeHtml(s.heading)}</strong></td>
        <td><div style="font-size:12px;color:#aaa;max-width:320px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${escapeHtml(s.content)}</div></td>
        <td>${s.sortOrder}</td>
        <td>${s.isActive ? '<span class="badge-on">Bật</span>' : '<span class="badge-off">Tắt</span>'}</td>
        <td><div class="row-actions">
          <button class="btn btn-sm" data-edit-about-story="${s.id}">✏️ Sửa</button>
          <button class="btn btn-sm btn-danger" data-delete-about-story="${s.id}">Xóa</button>
        </div></td>
      </tr>
    `).join("")}</tbody>`;

  document.querySelectorAll("[data-edit-about-story]").forEach((btn) => {
    const id = Number(btn.dataset.editAboutStory);
    const item = result.find((x) => x.id === id);
    btn.onclick = () => openAboutStoryForm(item);
  });

  document.querySelectorAll("[data-delete-about-story]").forEach((btn) => {
    btn.onclick = () => deleteEntity(`/api/admin/about-stories/${btn.dataset.deleteAboutStory}`, "cột mốc lịch sử", loadAboutStories);
  });
}

function openAboutStoryForm(item = null) {
  const s = item || {};
  openModal(item ? `Sửa cột mốc lịch sử #${s.id}` : "Thêm cột mốc lịch sử mới", `
    ${field("Năm / Thời kỳ (YearTag) *", textField("yearTag", s.yearTag || "NĂM 2006 // SỰ KHỞI ĐẦU"))}
    ${field("Tiêu đề câu chuyện *", textField("heading", s.heading || ""))}
    ${field("Nội dung chi tiết *", textArea("content", s.content || ""))}
    ${field("Hình ảnh minh họa", imageField("imageUrl", s.imageUrl || "/sites/rog-asus/img/mb/hot-crosshair-x870e.webp"))}
    <div class="grid-2">
      ${field("Thứ tự hiển thị", `<input name="sortOrder" type="number" value="${s.sortOrder || 0}" />`)}
      ${field("Kích hoạt hiển thị", checkboxField("isActive", s.isActive !== false))}
    </div>
  `, async () => {
    const fd = new FormData($("#modal-form"));
    const payload = {
      yearTag: String(fd.get("yearTag") || "").trim(),
      heading: String(fd.get("heading") || "").trim(),
      content: String(fd.get("content") || "").trim(),
      imageUrl: String(fd.get("imageUrl") || "").trim(),
      sortOrder: Number(fd.get("sortOrder") || 0),
      isActive: checkboxValue(fd, "isActive")
    };

    if (item) {
      await api(`/api/admin/about-stories/${item.id}`, { method: "PUT", body: JSON.stringify(payload) });
    } else {
      await api("/api/admin/about-stories", { method: "POST", body: JSON.stringify(payload) });
    }
    loadAboutStories();
  });
}

/* ---------- Videos Showcase (Video Review) ---------- */

async function loadVideos() {
  const list = await api("/api/admin/videos");
  const table = $("#videos-table");
  if (!list.length) {
    table.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:32px;color:#888;">Chưa có video review nào. Nhấn "+ Thêm video review" để bắt đầu.</td></tr>`;
    return;
  }

  table.innerHTML = `
    <thead>
      <tr>
        <th>#</th>
        <th>Thumbnail</th>
        <th>Tiêu đề video</th>
        <th>URL Video</th>
        <th>Kích thước</th>
        <th>Thứ tự</th>
        <th>Trạng thái</th>
        <th>Thao tác</th>
      </tr>
    </thead>
    <tbody>${list.map((v) => `
      <tr>
        <td>${v.id}</td>
        <td><img class="thumb" src="${escapeHtml(v.thumbnailUrl)}" alt="" loading="lazy" style="width:72px;height:45px;object-fit:cover;border-radius:4px;" /></td>
        <td class="cell-title"><strong>${escapeHtml(v.title)}</strong></td>
        <td><a href="${escapeHtml(v.videoUrl)}" target="_blank" rel="noopener" style="color:#60a5fa;font-size:12px;text-decoration:underline;">${escapeHtml(v.videoUrl ? (v.videoUrl.length > 35 ? v.videoUrl.slice(0, 35) + '...' : v.videoUrl) : '—')}</a></td>
        <td>${v.isBig ? '<span style="font-size:11px;background:#3b1e1e;color:#f87171;padding:2px 6px;border-radius:4px;font-weight:700;">Lớn (Hero)</span>' : '<span style="font-size:11px;background:#1e293b;color:#94a3b8;padding:2px 6px;border-radius:4px;">Tiêu chuẩn</span>'}</td>
        <td>${v.sortOrder}</td>
        <td>${v.isActive ? '<span class="badge-on">Bật</span>' : '<span class="badge-off">Ẩn</span>'}</td>
        <td><div class="row-actions">
          <button class="btn btn-sm" data-edit-video="${v.id}">✏️ Sửa</button>
          <button class="btn btn-sm btn-danger" data-delete-video="${v.id}">Xóa</button>
        </div></td>
      </tr>
    `).join("")}</tbody>`;

  document.querySelectorAll("[data-edit-video]").forEach((btn) => {
    const id = Number(btn.dataset.editVideo);
    const item = list.find((v) => v.id === id);
    btn.onclick = () => openVideoForm(item);
  });

  document.querySelectorAll("[data-delete-video]").forEach((btn) => {
    btn.onclick = () => deleteEntity(`/api/admin/videos/${btn.dataset.deleteVideo}`, "video review", loadVideos);
  });
}

function openVideoForm(item = null) {
  const isEdit = !!item;
  const fields = [
    field("Tiêu đề video *", textField("title", item?.title || "", true)),
    field("Link Video (YouTube/Vimeo/MP4)", textField("videoUrl", item?.videoUrl || "", false)),
    field("Ảnh Thumbnail (URL) *", imageField("thumbnailUrl", item?.thumbnailUrl || "")),
    field("Hiển thị dạng Card lớn (Hero)", checkboxField("isBig", !!item?.isBig)),
    field("Thứ tự hiển thị", textField("sortOrder", item?.sortOrder ?? 1, true, "number")),
    field("Trạng thái", `<select name="isActive">
      <option value="true" ${item?.isActive !== false ? "selected" : ""}>Hiển thị</option>
      <option value="false" ${item?.isActive === false ? "selected" : ""}>Ẩn</option>
    </select>`),
  ].join("");

  openModal(isEdit ? `Sửa video review #${item.id}` : "Thêm video review mới", fields, async () => {
    const fd = new FormData($("#modal-form"));
    const payload = {
      title: String(fd.get("title") || "").trim(),
      videoUrl: String(fd.get("videoUrl") || "").trim(),
      thumbnailUrl: String(fd.get("thumbnailUrl") || "").trim(),
      isBig: checkboxValue(fd, "isBig"),
      sortOrder: Number(fd.get("sortOrder") || 1),
      isActive: fd.get("isActive") === "true",
    };
    if (isEdit) {
      await api(`/api/admin/videos/${item.id}`, { method: "PUT", body: JSON.stringify(payload) });
    } else {
      await api("/api/admin/videos", { method: "POST", body: JSON.stringify(payload) });
    }
    loadVideos();
  });
}

/* ---------- 6. Customers (Khách hàng & ROG Elite) ---------- */

async function loadCustomers() {
  const search = ($("#customer-search")?.value || "").trim();
  const url = `/api/admin/customers?page=${state.customersPage}&pageSize=${state.customersPageSize}&search=${encodeURIComponent(search)}`;
  const result = await api(url);

  $("#customers-table").innerHTML = `
    <thead><tr><th>#</th><th>Email</th><th>Họ tên</th><th>SĐT</th><th>Hạng ROG Elite</th><th>Điểm</th><th>Món trong giỏ</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
    <tbody>${result.items.map((c) => {
      let tierBadge = '<span class="badge-tier-bronze">BRONZE</span>';
      if (c.tierName === "Master") tierBadge = '<span class="badge-tier-gold">GOLD / MASTER</span>';
      else if (c.tierName === "Champion") tierBadge = '<span class="badge-tier-diamond">DIAMOND</span>';
      else if (c.tierName === "Silver") tierBadge = '<span class="badge-tier-silver">SILVER</span>';

      return `
      <tr>
        <td>${c.id}</td>
        <td><code>${escapeHtml(c.email)}</code></td>
        <td class="cell-title"><strong>${escapeHtml(c.fullName || 'Khách ROG')}</strong></td>
        <td>${escapeHtml(c.phoneNumber || '—')}</td>
        <td>${tierBadge}</td>
        <td style="color:#fbbf24;font-weight:700;">${c.points} pts</td>
        <td><strong>${c.cartItemCount}</strong> món</td>
        <td>${c.isActive ? '<span class="badge-on">Hoạt động</span>' : '<span class="badge-off">Khóa</span>'}</td>
        <td><div class="row-actions">
          <button class="btn btn-sm" data-edit-customer="${c.id}">✏️ Sửa</button>
          <button class="btn btn-sm" style="border:1px solid #eab308;color:#fde047" data-adjust-points="${c.id}" data-email="${escapeHtml(c.email)}" data-points="${c.points}">⭐ Điểm</button>
          <button class="btn btn-sm" style="border:1px solid #3b82f6;color:#93c5fd" data-reset-pwd="${c.id}" data-email="${escapeHtml(c.email)}">🔑 Reset MK</button>
          <button class="btn btn-sm btn-danger" data-delete-customer="${c.id}">Xóa</button>
        </div></td>
      </tr>`;
    }).join("")}</tbody>`;

  const pager = $("#customers-pager");
  pager.innerHTML = `
    <button class="btn btn-sm" id="customers-prev" ${result.page <= 1 ? "disabled" : ""}>‹ Trước</button>
    <span>Trang ${result.page}/${result.totalPages || 1} · ${result.totalCount} khách hàng</span>
    <button class="btn btn-sm" id="customers-next" ${result.page >= result.totalPages ? "disabled" : ""}>Sau ›</button>`;
  $("#customers-prev").onclick = () => { state.customersPage--; loadCustomers(); };
  $("#customers-next").onclick = () => { state.customersPage++; loadCustomers(); };

  document.querySelectorAll("[data-edit-customer]").forEach((btn) => {
    const id = Number(btn.dataset.editCustomer);
    const item = result.items.find((c) => c.id === id);
    btn.onclick = () => openCustomerForm(item);
  });

  document.querySelectorAll("[data-adjust-points]").forEach((btn) => {
    const id = Number(btn.dataset.adjustPoints);
    const email = btn.dataset.email;
    const currentPoints = Number(btn.dataset.points) || 0;
    btn.onclick = async () => {
      const deltaStr = prompt(`Cộng/trừ điểm cho ${email} (Hiện có: ${currentPoints} pts).\nNhập số điểm cần cộng (hoặc số âm để trừ):`, "100");
      if (deltaStr === null) return;
      const delta = parseInt(deltaStr, 10);
      if (isNaN(delta) || delta === 0) {
        alert("Vui lòng nhập một số điểm hợp lệ khác 0!");
        return;
      }
      const reason = prompt("Lý do điều chỉnh điểm:", "Admin thưởng điểm ROG Elite") || "Điều chỉnh thủ công từ Admin";
      try {
        const res = await api(`/api/admin/customers/${id}/adjust-points`, {
          method: "POST",
          body: JSON.stringify({ deltaPoints: delta, reason })
        });
        toast(res.message || "Đã cập nhật điểm thành công!");
        loadCustomers();
      } catch (ex) {
        toast(ex.message, true);
      }
    };
  });

  document.querySelectorAll("[data-reset-pwd]").forEach((btn) => {
    const id = Number(btn.dataset.resetPwd);
    const email = btn.dataset.email;
    btn.onclick = async () => {
      if (!confirm(`Bạn có chắc chắn muốn đặt lại mật khẩu cho tài khoản ${email} không?\nMật khẩu ngẫu nhiên mới sẽ được tạo.`)) return;
      try {
        const res = await api(`/api/admin/customers/${id}/reset-password`, {
          method: "POST",
          body: JSON.stringify({})
        });
        prompt(`Mật khẩu mới cho ${email} đã được tạo thành công! Hãy copy gửi cho khách:`, res.newPassword);
        toast("Đặt lại mật khẩu thành công!");
      } catch (ex) {
        toast(ex.message, true);
      }
    };
  });

  document.querySelectorAll("[data-delete-customer]").forEach((btn) => {
    btn.onclick = () => deleteEntity(`/api/admin/customers/${btn.dataset.deleteCustomer}`, "khách hàng", loadCustomers);
  });
}

function openCustomerForm(customer) {
  openModal(`Khách hàng #${customer.id} — ${customer.email}`, `
    ${field("Họ và tên", textField("fullName", customer.fullName || ""))}
    ${field("Số điện thoại", textField("phoneNumber", customer.phoneNumber || "", false))}
    <div class="grid-2">
      ${field("Hạng thành viên ROG Elite", selectField("tier", customer.tier, [
        ["0", "Elite (Bronze)"],
        ["1", "Master (Gold)"],
        ["2", "Champion (Diamond)"]
      ]))}
      ${field("Điểm thưởng tích lũy", `<input name="points" type="number" min="0" value="${customer.points || 0}" />`)}
    </div>
    ${field("Trạng thái tài khoản", checkboxField("isActive", customer.isActive !== false))}
  `, async () => {
    const fd = new FormData($("#modal-form"));
    const payload = {
      fullName: String(fd.get("fullName") || "").trim(),
      phoneNumber: String(fd.get("phoneNumber") || "").trim(),
      tier: Number(fd.get("tier") || 0),
      points: Number(fd.get("points") || 0),
      isActive: checkboxValue(fd, "isActive")
    };

    await api(`/api/admin/customers/${customer.id}`, { method: "PUT", body: JSON.stringify(payload) });
    loadCustomers();
  });
}

/* ---------- 7. Newsletter (Đăng ký nhận tin) ---------- */

async function loadNewsletter() {
  const search = ($("#newsletter-search")?.value || "").trim();
  const url = `/api/admin/newsletter?page=${state.newsletterPage}&pageSize=${state.newsletterPageSize}&search=${encodeURIComponent(search)}`;
  const result = await api(url);

  $("#newsletter-table").innerHTML = `
    <thead><tr><th>ID</th><th>Email khách hàng</th><th>Thời gian đăng ký</th><th>Thao tác</th></tr></thead>
    <tbody>${result.items.map((n) => `
      <tr>
        <td><code>${n.id}</code></td>
        <td class="cell-title"><strong>${escapeHtml(n.email)}</strong></td>
        <td>${formatDate(n.createdAtUtc)}</td>
        <td><button class="btn btn-sm btn-danger" data-delete-newsletter="${n.id}">Xóa</button></td>
      </tr>
    `).join("")}</tbody>`;

  const pager = $("#newsletter-pager");
  pager.innerHTML = `
    <button class="btn btn-sm" id="newsletter-prev" ${result.page <= 1 ? "disabled" : ""}>‹ Trước</button>
    <span>Trang ${result.page}/${result.totalPages || 1} · ${result.totalCount} lượt đăng ký</span>
    <button class="btn btn-sm" id="newsletter-next" ${result.page >= result.totalPages ? "disabled" : ""}>Sau ›</button>`;
  $("#newsletter-prev").onclick = () => { state.newsletterPage--; loadNewsletter(); };
  $("#newsletter-next").onclick = () => { state.newsletterPage++; loadNewsletter(); };

  document.querySelectorAll("[data-delete-newsletter]").forEach((btn) => {
    btn.onclick = () => deleteEntity(`/api/admin/newsletter/${btn.dataset.deleteNewsletter}`, "email nhận tin", loadNewsletter);
  });
}

async function exportNewsletterCsv() {
  try {
    toast("Đang chuẩn bị file CSV...");
    const token = getToken();
    const res = await fetch("/api/admin/newsletter/export-csv", {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error(`Lỗi tải file: HTTP ${res.status}`);
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rog_newsletter_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
    toast("Xuất CSV thành công!");
  } catch (ex) {
    toast(ex.message, true);
  }
}

/* ---------- 8. Media (Thư viện media & upload) ---------- */

async function loadMedia() {
  const items = await api("/api/admin/media");
  const container = $("#media-grid");
  if (!items || items.length === 0) {
    container.innerHTML = `<div style="grid-column:1/-1;color:#888;text-align:center;padding:40px;">Chưa có tệp hình ảnh nào được tải lên.</div>`;
    return;
  }

  container.innerHTML = items.map((f) => {
    const sizeKb = (f.size / 1024).toFixed(1) + " KB";
    return `
      <div class="media-card">
        <img src="${escapeHtml(f.url)}" alt="${escapeHtml(f.fileName)}" loading="lazy" />
        <div class="media-card-body">
          <div class="file-name" title="${escapeHtml(f.fileName)}">${escapeHtml(f.fileName)}</div>
          <div class="file-meta">${sizeKb} · ${formatDate(f.createdAt)}</div>
          <div class="media-card-actions">
            <button class="btn btn-sm btn-ghost" style="flex:1;border:1px solid #4a5568;" onclick="copyMediaUrl('${escapeHtml(f.url)}')">📋 Copy</button>
            <button class="btn btn-sm btn-danger" onclick="deleteMediaFile('${escapeHtml(f.fileName)}')">🗑️</button>
          </div>
        </div>
      </div>`;
  }).join("");

  window.copyMediaUrl = (url) => {
    navigator.clipboard.writeText(url).then(() => toast(`Đã copy link: ${url}`)).catch(() => toast("Không thể copy.", true));
  };

  window.deleteMediaFile = async (name) => {
    if (!confirm(`Xóa ảnh ${name}?`)) return;
    try {
      await api(`/api/admin/media/${encodeURIComponent(name)}`, { method: "DELETE" });
      toast("Đã xóa ảnh.");
      loadMedia();
    } catch (ex) {
      toast(ex.message, true);
    }
  };
}

/* ---------- orders ---------- */

function getOrderStatusBadge(status) {
  switch (status) {
    case "Pending":
      return '<span class="badge-order-pending">Chờ xác nhận</span>';
    case "Confirmed":
      return '<span class="badge-order-confirmed">Đã xác nhận</span>';
    case "Shipping":
      return '<span class="badge-order-shipping">Đang giao hàng</span>';
    case "Completed":
      return '<span class="badge-order-completed">Hoàn tất</span>';
    case "Cancelled":
      return '<span class="badge-order-cancelled">Đã hủy</span>';
    default:
      return `<span class="badge-order-pending">${escapeHtml(status)}</span>`;
  }
}

async function loadOrders() {
  const status = $("#order-status-filter")?.value || "";
  const search = $("#order-search")?.value.trim() || "";
  const params = new URLSearchParams({
    page: String(state.ordersPage),
    pageSize: String(state.ordersPageSize),
  });
  if (status) params.set("status", status);
  if (search) params.set("search", search);

  const result = await api(`/api/admin/orders?${params}`);
  const table = $("#orders-table");
  if (!result.items.length) {
    table.innerHTML = `<tr><td colspan="9" style="text-align:center;padding:32px;color:#888;">Không tìm thấy đơn hàng nào.</td></tr>`;
    $("#orders-pager").innerHTML = "";
    return;
  }

  table.innerHTML = `
    <thead>
      <tr>
        <th>Mã đơn hàng</th>
        <th>Khách hàng</th>
        <th>Số điện thoại</th>
        <th>Địa chỉ giao hàng</th>
        <th>Số SP</th>
        <th>Tổng tiền</th>
        <th>Trạng thái</th>
        <th>Ngày đặt</th>
        <th>Thao tác</th>
      </tr>
    </thead>
    <tbody>${result.items.map((o) => `
      <tr>
        <td><code><strong>${escapeHtml(o.orderCode)}</strong></code></td>
        <td class="cell-title"><strong>${escapeHtml(o.customerName)}</strong><br/><small style="color:#888">${escapeHtml(o.email)}</small></td>
        <td>${escapeHtml(o.phone)}</td>
        <td style="max-width:200px;font-size:12px;color:#aaa;">${escapeHtml(o.address)}</td>
        <td><strong>${o.itemsCount}</strong></td>
        <td><strong style="color:#ff0033">${formatVnd(o.total)}</strong></td>
        <td>${getOrderStatusBadge(o.status)}</td>
        <td>${formatDate(o.createdAt)}</td>
        <td>
          <div class="row-actions">
            <button class="btn btn-sm btn-ghost" style="border:1px solid #4a5568;" data-view-order="${o.id}">👁️ Chi tiết</button>
            <button class="btn btn-sm btn-danger" data-delete-order="${o.id}">Xóa</button>
          </div>
        </td>
      </tr>
    `).join("")}</tbody>`;

  const pager = $("#orders-pager");
  pager.innerHTML = `
    <button class="btn btn-sm" id="orders-prev" ${result.page <= 1 ? "disabled" : ""}>‹ Trước</button>
    <span>Trang ${result.page}/${result.totalPages || 1} · ${result.totalCount} đơn hàng</span>
    <button class="btn btn-sm" id="orders-next" ${result.page >= result.totalPages ? "disabled" : ""}>Sau ›</button>`;
  $("#orders-prev").onclick = () => { state.ordersPage--; loadOrders(); };
  $("#orders-next").onclick = () => { state.ordersPage++; loadOrders(); };

  document.querySelectorAll("[data-view-order]").forEach((btn) => {
    btn.onclick = () => openOrderDetailModal(Number(btn.dataset.viewOrder));
  });

  document.querySelectorAll("[data-delete-order]").forEach((btn) => {
    btn.onclick = async () => {
      const id = Number(btn.dataset.deleteOrder);
      if (!confirm(`Bạn có chắc chắn muốn xóa đơn hàng #${id}?`)) return;
      try {
        await api(`/api/admin/orders/${id}`, { method: "DELETE" });
        toast("Đã xóa đơn hàng thành công.");
        loadOrders();
      } catch (ex) {
        toast(ex.message, true);
      }
    };
  });
}

async function openOrderDetailModal(id) {
  try {
    const o = await api(`/api/admin/orders/${id}`);
    const itemsHtml = o.items.map((i) => `
      <tr style="border-bottom:1px solid #282830">
        <td style="padding:8px 4px;">
          <strong>${escapeHtml(i.productName)}</strong>
          ${i.selectedSpecs ? `<br/><small style="color:#888;">${escapeHtml(i.selectedSpecs)}</small>` : ""}
        </td>
        <td style="padding:8px 4px;text-align:right;">${formatVnd(i.unitPrice)}</td>
        <td style="padding:8px 4px;text-align:center;"><strong>x${i.quantity}</strong></td>
        <td style="padding:8px 4px;text-align:right;color:#ff0033;"><strong>${formatVnd(i.lineTotal)}</strong></td>
      </tr>
    `).join("");

    const bodyHtml = `
      <div style="font-size:13px;display:flex;flex-direction:column;gap:12px;">
        <div style="display:flex;justify-content:space-between;border-bottom:1px solid #333;padding-bottom:10px;">
          <div>Mã đơn: <code><strong>${escapeHtml(o.orderCode)}</strong></code></div>
          <div>Ngày đặt: <strong>${formatDateTime(o.createdAt)}</strong></div>
        </div>

        <div style="background:rgba(255,255,255,0.02);padding:10px;border-radius:6px;border:1px solid #282830;">
          <div><strong>Người nhận:</strong> ${escapeHtml(o.customerName)} (${escapeHtml(o.phone)})</div>
          <div><strong>Email:</strong> ${escapeHtml(o.email)}</div>
          <div><strong>Địa chỉ:</strong> ${escapeHtml(o.address)}</div>
          ${o.note ? `<div><strong>Ghi chú:</strong> <em>${escapeHtml(o.note)}</em></div>` : ""}
        </div>

        <div>
          <strong>Chi tiết sản phẩm đã đặt:</strong>
          <table style="width:100%;margin-top:6px;border-collapse:collapse;font-size:12px;">
            <thead>
              <tr style="border-bottom:1px solid #444;color:#888;">
                <th style="text-align:left;padding:4px;">Sản phẩm</th>
                <th style="text-align:right;padding:4px;">Đơn giá</th>
                <th style="text-align:center;padding:4px;">SL</th>
                <th style="text-align:right;padding:4px;">Thành tiền</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>
        </div>

        <div style="text-align:right;font-size:14px;border-top:1px solid #333;padding-top:8px;">
          Tổng thanh toán: <strong style="color:#ff0033;font-size:16px;">${formatVnd(o.total)}</strong>
        </div>

        <div style="background:#111;padding:12px;border-radius:6px;border:1px solid #333;margin-top:4px;">
          <div style="margin-bottom:8px;">Trạng thái hiện tại: ${getOrderStatusBadge(o.status)}</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <button type="button" class="btn btn-sm btn-ghost" style="border:1px solid #60a5fa;color:#60a5fa" onclick="changeOrderStatus(${o.id}, 'Confirmed')">✅ Xác nhận</button>
            <button type="button" class="btn btn-sm btn-ghost" style="border:1px solid #c084fc;color:#c084fc" onclick="changeOrderStatus(${o.id}, 'Shipping')">🚚 Đang giao</button>
            <button type="button" class="btn btn-sm btn-primary" onclick="changeOrderStatus(${o.id}, 'Completed')">🎉 Hoàn tất</button>
            <button type="button" class="btn btn-sm btn-danger" onclick="changeOrderStatus(${o.id}, 'Cancelled')">❌ Hủy đơn</button>
          </div>
        </div>
      </div>
    `;

    openModal(`Chi tiết đơn hàng #${o.orderCode}`, bodyHtml, async () => true);
  } catch (ex) {
    toast(ex.message, true);
  }
}

window.changeOrderStatus = async function (id, newStatus) {
  try {
    await api(`/api/admin/orders/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status: newStatus }),
    });
    closeModal();
    toast(`Đã cập nhật trạng thái đơn sang: ${newStatus}`);
    loadOrders();
  } catch (ex) {
    toast(ex.message, true);
  }
};

/* ---------- support centers & policies ---------- */

async function loadSupportCenters() {
  const [centers, policies] = await Promise.all([
    api("/api/admin/service-centers"),
    api("/api/admin/warranty-policies"),
  ]);

  // Centers Table
  const centersTable = $("#service-centers-table");
  centersTable.innerHTML = `
    <thead>
      <tr>
        <th>Thứ tự</th>
        <th>Tỉnh / Thành</th>
        <th>Tên trung tâm</th>
        <th>Địa chỉ</th>
        <th>Hotline</th>
        <th>Giờ làm việc</th>
        <th>Trạng thái</th>
        <th>Thao tác</th>
      </tr>
    </thead>
    <tbody>${centers.map((c) => `
      <tr>
        <td>${c.sortOrder}</td>
        <td><strong style="color:#ff0033">${escapeHtml(c.city)}</strong></td>
        <td class="cell-title"><strong>${escapeHtml(c.name)}</strong></td>
        <td style="max-width:240px;font-size:12px;color:#aaa;">${escapeHtml(c.address)}</td>
        <td><strong>${escapeHtml(c.phone)}</strong></td>
        <td style="font-size:12px;color:#888;">${escapeHtml(c.operatingHours)}</td>
        <td>${c.isActive ? '<span class="badge-on">Bật</span>' : '<span class="badge-off">Tắt</span>'}</td>
        <td>
          <div class="row-actions">
            <button class="btn btn-sm" data-edit-center="${c.id}">✏️ Sửa</button>
            <button class="btn btn-sm btn-danger" data-delete-center="${c.id}">Xóa</button>
          </div>
        </td>
      </tr>
    `).join("")}</tbody>`;

  // Policies Table
  const policiesTable = $("#warranty-policies-table");
  policiesTable.innerHTML = `
    <thead>
      <tr>
        <th>Thứ tự</th>
        <th>Tiêu đề chính sách</th>
        <th>Mô tả chi tiết</th>
        <th>Trạng thái</th>
        <th>Thao tác</th>
      </tr>
    </thead>
    <tbody>${policies.map((p) => `
      <tr>
        <td>${p.sortOrder}</td>
        <td class="cell-title"><strong style="color:#ff0033">${escapeHtml(p.title)}</strong></td>
        <td style="font-size:13px;color:#ccc;max-width:400px;">${escapeHtml(p.description)}</td>
        <td>${p.isActive ? '<span class="badge-on">Bật</span>' : '<span class="badge-off">Tắt</span>'}</td>
        <td>
          <div class="row-actions">
            <button class="btn btn-sm" data-edit-policy="${p.id}">✏️ Sửa</button>
            <button class="btn btn-sm btn-danger" data-delete-policy="${p.id}">Xóa</button>
          </div>
        </td>
      </tr>
    `).join("")}</tbody>`;

  // Actions
  document.querySelectorAll("[data-edit-center]").forEach((btn) => {
    const id = Number(btn.dataset.editCenter);
    const item = centers.find((c) => c.id === id);
    btn.onclick = () => openServiceCenterForm(item);
  });
  document.querySelectorAll("[data-delete-center]").forEach((btn) => {
    btn.onclick = async () => {
      const id = Number(btn.dataset.deleteCenter);
      if (!confirm("Bạn có chắc chắn muốn xóa trung tâm bảo hành này?")) return;
      try {
        await api(`/api/admin/service-centers/${id}`, { method: "DELETE" });
        toast("Đã xóa trung tâm bảo hành.");
        loadSupportCenters();
      } catch (ex) {
        toast(ex.message, true);
      }
    };
  });

  document.querySelectorAll("[data-edit-policy]").forEach((btn) => {
    const id = Number(btn.dataset.editPolicy);
    const item = policies.find((p) => p.id === id);
    btn.onclick = () => openWarrantyPolicyForm(item);
  });
  document.querySelectorAll("[data-delete-policy]").forEach((btn) => {
    btn.onclick = async () => {
      const id = Number(btn.dataset.deletePolicy);
      if (!confirm("Bạn có chắc chắn muốn xóa chính sách này?")) return;
      try {
        await api(`/api/admin/warranty-policies/${id}`, { method: "DELETE" });
        toast("Đã xóa chính sách.");
        loadSupportCenters();
      } catch (ex) {
        toast(ex.message, true);
      }
    };
  });
}

function openServiceCenterForm(item = null) {
  const isEdit = !!item;
  const fields = [
    field("Tên trung tâm", textField("name", item?.name || "", true)),
    field("Tỉnh / Thành phố", textField("city", item?.city || "TP. HỒ CHÍ MINH", true)),
    field("Địa chỉ chi tiết", textField("address", item?.address || "", true)),
    field("Hotline điện thoại", textField("phone", item?.phone || "1800 65 88", true)),
    field("Thời gian làm việc", textField("operatingHours", item?.operatingHours || "Thứ 2 - Thứ 7: 08:30 - 17:30 (Chủ nhật nghỉ)", true)),
    field("Thứ tự sắp xếp", textField("sortOrder", item?.sortOrder ?? 1, true, "number")),
    field("Trạng thái", `<select name="isActive">
      <option value="true" ${item?.isActive !== false ? "selected" : ""}>Bật (Hiển thị)</option>
      <option value="false" ${item?.isActive === false ? "selected" : ""}>Ẩn</option>
    </select>`),
  ].join("");

  openModal(isEdit ? "Sửa trung tâm bảo hành" : "Thêm trung tâm bảo hành mới", fields, async (fd) => {
    const payload = {
      name: fd.get("name"),
      city: fd.get("city"),
      address: fd.get("address"),
      phone: fd.get("phone"),
      operatingHours: fd.get("operatingHours"),
      sortOrder: Number(fd.get("sortOrder")) || 1,
      isActive: fd.get("isActive") === "true",
    };
    if (isEdit) {
      await api(`/api/admin/service-centers/${item.id}`, { method: "PUT", body: JSON.stringify(payload) });
    } else {
      await api("/api/admin/service-centers", { method: "POST", body: JSON.stringify(payload) });
    }
    loadSupportCenters();
    return isEdit ? "Đã cập nhật trung tâm." : "Đã tạo trung tâm mới.";
  });
}

function openWarrantyPolicyForm(item = null) {
  const isEdit = !!item;
  const fields = [
    field("Tiêu đề chính sách", textField("title", item?.title || "", true)),
    field("Mô tả chi tiết", `<textarea name="description" rows="4" required style="width:100%;background:#0d0d11;color:#fff;border:1px solid var(--border);border-radius:4px;padding:8px;">${escapeHtml(item?.description || "")}</textarea>`),
    field("Thứ tự sắp xếp", textField("sortOrder", item?.sortOrder ?? 1, true, "number")),
    field("Trạng thái", `<select name="isActive">
      <option value="true" ${item?.isActive !== false ? "selected" : ""}>Bật</option>
      <option value="false" ${item?.isActive === false ? "selected" : ""}>Ẩn</option>
    </select>`),
  ].join("");

  openModal(isEdit ? "Sửa chính sách bảo hành" : "Thêm chính sách bảo hành", fields, async (fd) => {
    const payload = {
      title: fd.get("title"),
      description: fd.get("description"),
      sortOrder: Number(fd.get("sortOrder")) || 1,
      isActive: fd.get("isActive") === "true",
    };
    if (isEdit) {
      await api(`/api/admin/warranty-policies/${item.id}`, { method: "PUT", body: JSON.stringify(payload) });
    } else {
      await api("/api/admin/warranty-policies", { method: "POST", body: JSON.stringify(payload) });
    }
    loadSupportCenters();
    return isEdit ? "Đã cập nhật chính sách." : "Đã tạo chính sách mới.";
  });
}

/* ---------- community & elite tiers ---------- */

async function loadCommunity() {
  const [channels, tiers] = await Promise.all([
    api("/api/admin/community/channels"),
    api("/api/admin/community/tiers"),
  ]);

  // Channels Table
  const channelsTable = $("#social-channels-table");
  channelsTable.innerHTML = `
    <thead>
      <tr>
        <th>Thứ tự</th>
        <th>Tên kênh kết nối</th>
        <th>Số thành viên</th>
        <th>Mô tả</th>
        <th>Liên kết</th>
        <th>Nút CTA</th>
        <th>Trạng thái</th>
        <th>Thao tác</th>
      </tr>
    </thead>
    <tbody>${channels.map((c) => `
      <tr>
        <td>${c.sortOrder}</td>
        <td class="cell-title"><strong>${escapeHtml(c.name)}</strong></td>
        <td><span style="color:#ff0033;font-weight:600;">${escapeHtml(c.membersCount)}</span></td>
        <td style="max-width:240px;font-size:12px;color:#aaa;">${escapeHtml(c.description)}</td>
        <td><a href="${escapeHtml(c.link)}" target="_blank" class="cell-url">${escapeHtml(c.link)}</a></td>
        <td><code>${escapeHtml(c.buttonText)}</code></td>
        <td>${c.isActive ? '<span class="badge-on">Bật</span>' : '<span class="badge-off">Ẩn</span>'}</td>
        <td>
          <div class="row-actions">
            <button class="btn btn-sm" data-edit-channel="${c.id}">✏️ Sửa</button>
            <button class="btn btn-sm btn-danger" data-delete-channel="${c.id}">Xóa</button>
          </div>
        </td>
      </tr>
    `).join("")}</tbody>`;

  // Tiers Table
  const tiersTable = $("#elite-tiers-table");
  tiersTable.innerHTML = `
    <thead>
      <tr>
        <th>Thứ tự</th>
        <th>Hạng ROG Elite</th>
        <th>Khung điểm yêu cầu</th>
        <th>Đặc quyền được hưởng</th>
        <th>Trạng thái</th>
        <th>Thao tác</th>
      </tr>
    </thead>
    <tbody>${tiers.map((t) => {
      const tierLower = (t.tier || "").toLowerCase();
      const badgeClass = `badge-tier-${tierLower}`;
      return `
        <tr>
          <td>${t.sortOrder}</td>
          <td><span class="${badgeClass}">${escapeHtml(t.tier)}</span></td>
          <td><strong>${escapeHtml(t.pointsRange)}</strong></td>
          <td style="font-size:13px;color:#ccc;max-width:360px;">${escapeHtml(t.perk)}</td>
          <td>${t.isActive ? '<span class="badge-on">Bật</span>' : '<span class="badge-off">Ẩn</span>'}</td>
          <td>
            <div class="row-actions">
              <button class="btn btn-sm" data-edit-tier="${t.id}">✏️ Sửa</button>
              <button class="btn btn-sm btn-danger" data-delete-tier="${t.id}">Xóa</button>
            </div>
          </td>
        </tr>`;
    }).join("")}</tbody>`;

  // Handlers
  document.querySelectorAll("[data-edit-channel]").forEach((btn) => {
    const id = Number(btn.dataset.editChannel);
    const item = channels.find((c) => c.id === id);
    btn.onclick = () => openSocialChannelForm(item);
  });
  document.querySelectorAll("[data-delete-channel]").forEach((btn) => {
    btn.onclick = async () => {
      const id = Number(btn.dataset.deleteChannel);
      if (!confirm("Bạn có chắc chắn muốn xóa kênh này?")) return;
      try {
        await api(`/api/admin/community/channels/${id}`, { method: "DELETE" });
        toast("Đã xóa kênh mạng xã hội.");
        loadCommunity();
      } catch (ex) {
        toast(ex.message, true);
      }
    };
  });

  document.querySelectorAll("[data-edit-tier]").forEach((btn) => {
    const id = Number(btn.dataset.editTier);
    const item = tiers.find((t) => t.id === id);
    btn.onclick = () => openEliteTierForm(item);
  });
  document.querySelectorAll("[data-delete-tier]").forEach((btn) => {
    btn.onclick = async () => {
      const id = Number(btn.dataset.deleteTier);
      if (!confirm("Bạn có chắc chắn muốn xóa hạng này?")) return;
      try {
        await api(`/api/admin/community/tiers/${id}`, { method: "DELETE" });
        toast("Đã xóa hạng ROG Elite.");
        loadCommunity();
      } catch (ex) {
        toast(ex.message, true);
      }
    };
  });
}

function openSocialChannelForm(item = null) {
  const isEdit = !!item;
  const fields = [
    field("Tên kênh", textField("name", item?.name || "", true)),
    field("Số lượng thành viên", textField("membersCount", item?.membersCount || "100.000+ Thành viên", true)),
    field("Mô tả kênh", textField("description", item?.description || "", true)),
    field("Đường dẫn (URL)", textField("link", item?.link || "", true)),
    field("Chữ hiển thị trên nút CTA", textField("buttonText", item?.buttonText || "THAM GIA NGAY ↗", true)),
    field("Thứ tự sắp xếp", textField("sortOrder", item?.sortOrder ?? 1, true, "number")),
    field("Trạng thái", `<select name="isActive">
      <option value="true" ${item?.isActive !== false ? "selected" : ""}>Bật</option>
      <option value="false" ${item?.isActive === false ? "selected" : ""}>Ẩn</option>
    </select>`),
  ].join("");

  openModal(isEdit ? "Sửa kênh mạng xã hội" : "Thêm kênh mạng xã hội", fields, async (fd) => {
    const payload = {
      name: fd.get("name"),
      membersCount: fd.get("membersCount"),
      description: fd.get("description"),
      link: fd.get("link"),
      buttonText: fd.get("buttonText"),
      sortOrder: Number(fd.get("sortOrder")) || 1,
      isActive: fd.get("isActive") === "true",
    };
    if (isEdit) {
      await api(`/api/admin/community/channels/${item.id}`, { method: "PUT", body: JSON.stringify(payload) });
    } else {
      await api("/api/admin/community/channels", { method: "POST", body: JSON.stringify(payload) });
    }
    loadCommunity();
    return isEdit ? "Đã cập nhật kênh." : "Đã tạo kênh mới.";
  });
}

function openEliteTierForm(item = null) {
  const isEdit = !!item;
  const fields = [
    field("Tên hạng (BRONZE, SILVER, GOLD, DIAMOND...)", textField("tier", item?.tier || "", true)),
    field("Khung điểm yêu cầu", textField("pointsRange", item?.pointsRange || "", true)),
    field("Mô tả đặc quyền", textField("perk", item?.perk || "", true)),
    field("Thứ tự sắp xếp", textField("sortOrder", item?.sortOrder ?? 1, true, "number")),
    field("Trạng thái", `<select name="isActive">
      <option value="true" ${item?.isActive !== false ? "selected" : ""}>Bật</option>
      <option value="false" ${item?.isActive === false ? "selected" : ""}>Ẩn</option>
    </select>`),
  ].join("");

  openModal(isEdit ? "Sửa hạng ROG Elite" : "Thêm hạng ROG Elite", fields, async (fd) => {
    const payload = {
      tier: fd.get("tier"),
      pointsRange: fd.get("pointsRange"),
      perk: fd.get("perk"),
      sortOrder: Number(fd.get("sortOrder")) || 1,
      isActive: fd.get("isActive") === "true",
    };
    if (isEdit) {
      await api(`/api/admin/community/tiers/${item.id}`, { method: "PUT", body: JSON.stringify(payload) });
    } else {
      await api("/api/admin/community/tiers", { method: "POST", body: JSON.stringify(payload) });
    }
    loadCommunity();
    return isEdit ? "Đã cập nhật hạng." : "Đã tạo hạng mới.";
  });
}

/* ---------- audit logs ---------- */

function getAuditBadge(action) {
  const act = (action || "").toUpperCase();
  let cls = "audit-default";
  if (act.includes("PRICE")) cls = "audit-price";
  else if (act.includes("ORDER")) cls = "audit-order";
  else if (act.includes("REVIEW")) cls = "audit-review";
  else if (act.includes("DELETE")) cls = "audit-danger";
  else if (act.includes("BACKUP")) cls = "audit-backup";

  return `<span class="badge-audit ${cls}">${escapeHtml(act)}</span>`;
}

async function loadAuditLogs() {
  const action = $("#audit-action-filter")?.value || "";
  const search = $("#audit-search")?.value.trim() || "";
  const params = new URLSearchParams({
    page: String(state.auditLogsPage),
    pageSize: String(state.auditLogsPageSize),
  });
  if (action) params.set("action", action);
  if (search) params.set("search", search);

  const result = await api(`/api/admin/audit-logs?${params}`);
  const table = $("#audit-logs-table");
  if (!result.items.length) {
    table.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:32px;color:#888;">Chưa có nhật ký hoạt động nào.</td></tr>`;
    $("#audit-logs-pager").innerHTML = "";
    return;
  }

  table.innerHTML = `
    <thead>
      <tr>
        <th>Thời gian</th>
        <th>Người thực hiện</th>
        <th>Hành động</th>
        <th>Đối tượng</th>
        <th>Chi tiết thay đổi</th>
        <th>Địa chỉ IP</th>
      </tr>
    </thead>
    <tbody>${result.items.map((l) => `
      <tr>
        <td style="font-size:12px;color:#aaa;">${formatDateTime(l.createdAt)}</td>
        <td><strong>${escapeHtml(l.username)}</strong></td>
        <td>${getAuditBadge(l.action)}</td>
        <td><code>${escapeHtml(l.entityName)}${l.entityId ? ` #${escapeHtml(l.entityId)}` : ""}</code></td>
        <td style="max-width:360px;font-size:13px;color:#ccc;">${escapeHtml(l.details)}</td>
        <td style="font-size:11px;color:#888;">${escapeHtml(l.ipAddress || "—")}</td>
      </tr>
    `).join("")}</tbody>`;

  const pager = $("#audit-logs-pager");
  pager.innerHTML = `
    <button class="btn btn-sm" id="audit-prev" ${result.page <= 1 ? "disabled" : ""}>‹ Trước</button>
    <span>Trang ${result.page}/${result.totalPages || 1} · ${result.totalCount} bản ghi</span>
    <button class="btn btn-sm" id="audit-next" ${result.page >= result.totalPages ? "disabled" : ""}>Sau ›</button>`;
  $("#audit-prev").onclick = () => { state.auditLogsPage--; loadAuditLogs(); };
  $("#audit-next").onclick = () => { state.auditLogsPage++; loadAuditLogs(); };
}

/* ---------- backup csdl ---------- */

async function backupDatabase() {
  try {
    toast("Đang tạo bản sao lưu toàn diện CSDL...");
    const token = getToken();
    const res = await fetch(`${API_BASE}/api/admin/backup/export`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`Lỗi xuất backup: HTTP ${res.status}`);

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rogadmin_backup_${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast("Đã tải bản sao lưu CSDL thành công!");
  } catch (ex) {
    toast(ex.message, true);
  }
}

/* ---------- Global Handlers for New Features ---------- */

setTimeout(() => {
  // Scraper button
  const scrapeBtn = $("#product-scrape-btn");
  if (scrapeBtn) scrapeBtn.onclick = openScraperModal;

  // Create buttons
  document.querySelectorAll("[data-create]").forEach((btn) => {
    const type = btn.dataset.create;
    if (type === "dealer") btn.onclick = () => openDealerForm();
    else if (type === "warranty") btn.onclick = () => openWarrantyForm();
    else if (type === "campaign") btn.onclick = () => openCampaignForm();
    else if (type === "download") btn.onclick = () => openDownloadForm();
    else if (type === "innovation") btn.onclick = () => openInnovationForm();
    else if (type === "wallpaper") btn.onclick = () => openWallpaperForm();
    else if (type === "about-story") btn.onclick = () => openAboutStoryForm();
    else if (type === "service-center") btn.onclick = () => openServiceCenterForm();
    else if (type === "warranty-policy") btn.onclick = () => openWarrantyPolicyForm();
    else if (type === "social-channel") btn.onclick = () => openSocialChannelForm();
    else if (type === "elite-tier") btn.onclick = () => openEliteTierForm();
    else if (type === "video") btn.onclick = () => openVideoForm();
  });

  // Backup button
  const backupBtn = $("#backup-db-btn");
  if (backupBtn) backupBtn.onclick = backupDatabase;

  // Order filters
  const orderStatus = $("#order-status-filter");
  if (orderStatus) orderStatus.onchange = () => { state.ordersPage = 1; loadOrders(); };
  const orderSearch = $("#order-search");
  if (orderSearch) orderSearch.oninput = () => { state.ordersPage = 1; loadOrders(); };

  // Audit Log filters
  const auditAction = $("#audit-action-filter");
  if (auditAction) auditAction.onchange = () => { state.auditLogsPage = 1; loadAuditLogs(); };
  const auditSearch = $("#audit-search");
  if (auditSearch) auditSearch.oninput = () => { state.auditLogsPage = 1; loadAuditLogs(); };

  // Filter inputs
  const dealerCity = $("#dealer-city-filter");
  if (dealerCity) dealerCity.onchange = () => { state.dealersPage = 1; loadDealers(); };
  const dealerSearch = $("#dealer-search");
  if (dealerSearch) dealerSearch.oninput = () => { state.dealersPage = 1; loadDealers(); };

  const warrantySearch = $("#warranty-search");
  if (warrantySearch) warrantySearch.oninput = () => { state.warrantyPage = 1; loadWarranty(); };

  const reviewStatus = $("#review-status-filter");
  if (reviewStatus) reviewStatus.onchange = () => { state.reviewsPage = 1; loadReviews(); };
  const reviewSearch = $("#review-search");
  if (reviewSearch) reviewSearch.oninput = () => { state.reviewsPage = 1; loadReviews(); };

  const customerSearch = $("#customer-search");
  if (customerSearch) customerSearch.oninput = () => { state.customersPage = 1; loadCustomers(); };

  const newsletterSearch = $("#newsletter-search");
  if (newsletterSearch) newsletterSearch.oninput = () => { state.newsletterPage = 1; loadNewsletter(); };
  const newsletterExport = $("#newsletter-export-btn");
  if (newsletterExport) newsletterExport.onclick = exportNewsletterCsv;

  // Report filters & actions
  document.querySelectorAll(".report-filters .btn-preset").forEach((btn) => {
    btn.onclick = () => {
      document.querySelectorAll(".report-filters .btn-preset").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const preset = btn.dataset.preset;
      reportFilters.preset = preset;
      const today = new Date();
      const fmt = (d) => d.toISOString().slice(0, 10);

      if (preset === "all") {
        reportFilters.fromDate = null;
        reportFilters.toDate = null;
      } else if (preset === "7d") {
        const past = new Date();
        past.setDate(today.getDate() - 7);
        reportFilters.fromDate = fmt(past);
        reportFilters.toDate = fmt(today);
      } else if (preset === "30d") {
        const past = new Date();
        past.setDate(today.getDate() - 30);
        reportFilters.fromDate = fmt(past);
        reportFilters.toDate = fmt(today);
      } else if (preset === "month") {
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        reportFilters.fromDate = fmt(firstDay);
        reportFilters.toDate = fmt(today);
      }
      $("#report-from-date").value = reportFilters.fromDate || "";
      $("#report-to-date").value = reportFilters.toDate || "";
      loadReports();
    };
  });

  const reportApply = $("#report-apply-btn");
  if (reportApply) {
    reportApply.onclick = () => {
      const from = $("#report-from-date").value;
      const to = $("#report-to-date").value;
      reportFilters.fromDate = from || null;
      reportFilters.toDate = to || null;
      document.querySelectorAll(".report-filters .btn-preset").forEach((b) => b.classList.remove("active"));
      loadReports();
    };
  }

  // Report tabs
  document.querySelectorAll(".report-tabs-nav .tab-btn").forEach((btn) => {
    btn.onclick = () => {
      loadReportTab(btn.dataset.reportTab);
    };
  });

  // Report exports
  const salesExport = $("#export-sales-report-btn");
  if (salesExport) salesExport.onclick = exportSalesReportCsv;
  const invExport = $("#export-inventory-report-btn");
  if (invExport) invExport.onclick = exportInventoryReportCsv;
  const warExport = $("#export-warranty-report-btn");
  if (warExport) warExport.onclick = exportWarrantyReportCsv;

  // Media upload
  const mediaTrigger = $("#media-upload-trigger-btn");
  const mediaFileIn = $("#media-file-input");
  if (mediaTrigger && mediaFileIn) {
    mediaTrigger.onclick = () => mediaFileIn.click();
    mediaFileIn.onchange = async () => {
      if (!mediaFileIn.files || !mediaFileIn.files[0]) return;
      const fd = new FormData();
      fd.append("file", mediaFileIn.files[0]);
      try {
        toast("Đang tải ảnh lên thư viện...");
        await api("/api/admin/media/upload", { method: "POST", body: fd });
        toast("Tải ảnh lên thành công!");
        mediaFileIn.value = "";
        loadMedia();
      } catch (ex) {
        toast(ex.message, true);
      }
    };
  }
}, 100);

/* ---------- boot ---------- */

if (getToken() && getUser()) {
  showApp();
} else {
  showLogin();
}
