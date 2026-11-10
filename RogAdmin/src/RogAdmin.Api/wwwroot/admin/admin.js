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
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
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

const PAGES = ["dashboard", "products", "articles", "hero-slides", "product-categories", "footer-links", "site-settings", "users"];

function navigate(page) {
  if (!PAGES.includes(page)) page = "dashboard";
  // Đặt hash sẽ kích hoạt hashchange → navigate lại một lần duy nhất;
  // nếu hash đã đúng thì vào thẳng render/load (tránh load 2 lần).
  if (location.hash !== `#${page}`) {
    location.hash = page;
    return;
  }

  document.querySelectorAll(".page").forEach((el) => el.classList.add("hidden"));
  $(`#page-${page}`).classList.remove("hidden");
  document.querySelectorAll(".sidebar nav a").forEach((a) =>
    a.classList.toggle("active", a.dataset.page === page));

  const loaders = {
    dashboard: loadDashboard,
    products: loadProducts,
    articles: loadArticles,
    "hero-slides": loadHeroSlides,
    "product-categories": loadProductCategories,
    "footer-links": loadFooterLinks,
    "site-settings": loadSettings,
    // Editor tự gõ #users → 403 → đưa về dashboard thay vì hiện trang rỗng
    users: () => loadUsers().catch((ex) => {
      toast(ex.message, true);
      navigate("dashboard");
    }),
  };
  loaders[page]().catch((ex) => toast(ex.message, true));
}

window.addEventListener("hashchange", () =>
  navigate(location.hash.replace("#", "") || "dashboard"));

/* ---------- dashboard ---------- */

async function loadDashboard() {
  const stats = await api("/api/admin/dashboard");
  const cards = [
    [stats.articlesTotal, "Bài viết", `${stats.articlesHighlights} highlights · ${stats.articlesListing} listing`],
    [stats.heroSlidesTotal, "Slide hero", `${stats.heroSlidesActive} đang bật`],
    [stats.productCategoriesTotal, "Danh mục sản phẩm", `${stats.productCategoriesActive} đang bật`],
    [stats.footerLinksTotal, "Link footer", "—"],
    [stats.siteSettingsTotal, "Cấu hình site", "—"],
    [stats.adminUsersTotal, "Tài khoản admin", "—"],
  ];
  $("#dashboard-stats").innerHTML = cards.map(([num, label, sub]) => `
    <div class="stat-card">
      <div class="num">${num}</div>
      <div class="label">${label}</div>
      <div class="sub">${sub}</div>
    </div>`).join("");
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
    field("Mô tả ngắn (excerpt — chỉ trang Listing)", textArea("excerpt", a.excerpt || "")),
    field("Chuyên mục/tag * (viết không cần prefix //)", textField("tag", (a.tag || "").replace(/^\/\/\s*/, ""))),
    field("Ảnh * (URL)", textField("imageUrl", a.imageUrl)),
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
    excerpt: String(fd.get("excerpt") || "").trim() || null,
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

/* ---------- boot ---------- */

if (getToken() && getUser()) {
  showApp();
} else {
  showLogin();
}
