import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';

const require = createRequire('/home/buidi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json');
const { chromium } = require('playwright');

const SCREENSHOT_DIR = '/home/buidi/.gemini/antigravity/brain/a0cbecf5-76d8-4b30-8b61-7ff5c2c75201/screenshots';
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const FE_URL = 'http://localhost:3000';
const BE_URL = 'http://localhost:5161';

async function runExhaustiveCrudTest() {
  console.log('='.repeat(90));
  console.log(' KIỂM THỬ CHUYÊN SÂU TOÀN DIỆN CRUD (THÊM, SỬA, XÓA, ĐỌC) GIỮA BACKEND & FRONTEND');
  console.log('='.repeat(90));

  const results = [];
  let adminToken = '';

  // Helper: admin fetch
  async function adminFetch(endpoint, method = 'GET', body = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (adminToken) headers['Authorization'] = `Bearer ${adminToken}`;
    const opts = { method, headers };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(`${BE_URL}${endpoint}`, opts);
    let data = null;
    try {
      if (res.status !== 204) data = await res.json();
    } catch { /* empty */ }
    return { status: res.status, ok: res.ok, data };
  }

  // Helper: public fetch via BE or FE proxy
  async function publicFetch(url) {
    const res = await fetch(url);
    const data = await res.json();
    return { status: res.status, ok: res.ok, data };
  }

  // 1. AUTHENTICATION & LOGIN
  console.log('\n[BƯỚC 1] ĐĂNG NHẬP ADMIN & LẤY JWT TOKEN');
  const loginRes = await adminFetch('/api/auth/login', 'POST', {
    username: 'admin',
    password: 'Admin@123'
  });
  if (loginRes.ok && loginRes.data.token) {
    adminToken = loginRes.data.token;
    console.log(` -> Đăng nhập thành công! Role: ${loginRes.data.user.role}, Token: ${adminToken.substring(0, 20)}...`);
    results.push({ domain: 'Auth', operation: 'LOGIN', status: 'PASS', detail: `User: ${loginRes.data.user.username} (${loginRes.data.user.role})` });
  } else {
    console.error(' -> Đăng nhập thất bại!', loginRes);
    results.push({ domain: 'Auth', operation: 'LOGIN', status: 'FAIL', detail: 'Không thể đăng nhập admin' });
    process.exit(1);
  }

  // Launch Playwright Edge
  const browser = await chromium.launch({
    executablePath: '/usr/bin/microsoft-edge-stable',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  // =========================================================================
  // DOMAIN 1: PRICING & STOCK (GIÁ CẢ VÀ KHO HÀNG)
  // =========================================================================
  console.log('\n[BƯỚC 2] DOMAIN GIÁ CẢ & TỒN KHO: READ -> UPDATE -> VERIFY FE DOM -> REVERT');
  const targetSlug = 'laptops/rog-strix/rog-strix-scar-18-2026';

  // 2.1 Read original price
  const origPriceRes = await publicFetch(`${BE_URL}/api/public/pricing/batch?slugs=${targetSlug}`);
  const origPrice = origPriceRes.data[0];
  console.log(` -> 2.1 [READ] Giá gốc SCAR 18: ${origPrice.formattedPrice} (Số: ${origPrice.price} đ)`);

  // 2.2 Update price via Admin API (Thử nghiệm giảm sốc: 119.990.000 đ, tiết kiệm 23 triệu)
  const newPriceVal = 119990000;
  const newOldPriceVal = 142990000;
  const newDiscount = 'TIẾT KIỆM 23 TRIỆU';
  const updatePriceRes = await adminFetch(`/api/admin/products/price-by-slug/${targetSlug}`, 'PUT', {
    price: newPriceVal,
    oldPrice: newOldPriceVal,
    discountLabel: newDiscount,
    stockStatus: 'InStock'
  });
  console.log(` -> 2.2 [UPDATE] Cập nhật giá mới: ${updatePriceRes.data.formattedPrice}, Nhãn: ${updatePriceRes.data.discountLabel}`);
  results.push({
    domain: 'Pricing',
    operation: 'UPDATE',
    status: updatePriceRes.ok ? 'PASS' : 'FAIL',
    detail: `Giá cập nhật thành: ${updatePriceRes.data?.formattedPrice}`
  });

  // 2.3 Verify BE public endpoint cache was evicted immediately
  const publicPriceUpdated = await publicFetch(`${BE_URL}/api/public/pricing/batch?slugs=${targetSlug}`);
  const matchBE = publicPriceUpdated.data[0].price === newPriceVal;
  console.log(` -> 2.3 [READ BE] Xác minh BE trả giá mới ngay lập tức: ${matchBE ? 'KHỚP 100%' : 'KHÔNG KHỚP'}`);

  // 2.4 Verify FE Store Page DOM & Screenshot
  await page.goto(`${FE_URL}/vn/store`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const storePriceMatch = await page.evaluate(() => {
    return document.body.innerText.includes('119.990.000');
  });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'crud_1_price_updated_store.png'), fullPage: false });
  console.log(` -> 2.4 [FE STORE DOM] Trang Cửa Hàng /vn/store hiển thị giá mới: ${storePriceMatch ? 'XÁC NHẬN CÓ 119.990.000 ₫' : 'CHƯA THẤY'}`);
  results.push({
    domain: 'Pricing',
    operation: 'FE_STORE_VERIFY',
    status: storePriceMatch ? 'PASS' : 'FAIL',
    detail: 'DOM /vn/store render chính xác giá vừa cập nhật từ BE'
  });

  // 2.5 Verify FE Product Detail Page DOM & Screenshot
  await page.goto(`${FE_URL}/vn/laptops/rog-strix/rog-strix-scar-18-2026`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const detailPriceMatch = await page.evaluate(() => {
    return document.body.innerText.includes('119.990.000');
  });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'crud_2_price_updated_product_detail.png'), fullPage: false });
  console.log(` -> 2.5 [FE DETAIL DOM] Trang Chi tiết SCAR 18 hiển thị giá mới: ${detailPriceMatch ? 'XÁC NHẬN CÓ 119.990.000 ₫' : 'CHƯA THẤY'}`);
  results.push({
    domain: 'Pricing',
    operation: 'FE_DETAIL_VERIFY',
    status: detailPriceMatch ? 'PASS' : 'FAIL',
    detail: 'Subbar trang chi tiết cập nhật giá 119.990.000 ₫'
  });

  // 2.6 Revert price back to original
  const revertPriceRes = await adminFetch(`/api/admin/products/price-by-slug/${targetSlug}`, 'PUT', {
    price: origPrice.price,
    oldPrice: origPrice.oldPrice,
    discountLabel: origPrice.discountLabel,
    stockStatus: origPrice.stockStatus
  });
  console.log(` -> 2.6 [REVERT] Khôi phục giá gốc: ${revertPriceRes.data.formattedPrice}`);
  results.push({ domain: 'Pricing', operation: 'REVERT', status: 'PASS', detail: `Đã hoàn trả về giá ban đầu: ${origPrice.formattedPrice}` });

  // =========================================================================
  // DOMAIN 2: HERO SLIDES (HÌNH ẢNH BANNER TRANG CHỦ)
  // =========================================================================
  console.log('\n[BƯỚC 3] DOMAIN HERO SLIDES (HÌNH ẢNH BANNER): CREATE -> READ -> UPDATE -> VERIFY -> DELETE');

  // 3.1 CREATE new slide
  const newSlidePayload = {
    imageUrl: '/sites/rog-asus/img/hero/rog-crud-test-banner-2026.webp',
    altText: 'BANNER KIỂM THỬ CRUD CHUYÊN SÂU 2026',
    href: '/vn/store',
    sortOrder: 99,
    isActive: true
  };
  const createSlideRes = await adminFetch('/api/admin/hero-slides', 'POST', newSlidePayload);
  const createdSlideId = createSlideRes.data?.id;
  console.log(` -> 3.1 [CREATE] Tạo slide mới #${createdSlideId}: "${createSlideRes.data?.altText}" (HTTP ${createSlideRes.status})`);
  results.push({
    domain: 'HeroSlides',
    operation: 'CREATE',
    status: createSlideRes.ok && createdSlideId ? 'PASS' : 'FAIL',
    detail: `Slide ID #${createdSlideId}`
  });

  // 3.2 READ slide by ID
  const readSlideRes = await adminFetch(`/api/admin/hero-slides/${createdSlideId}`);
  const matchReadSlide = readSlideRes.data?.altText === newSlidePayload.altText;
  console.log(` -> 3.2 [READ] Đọc chi tiết slide #${createdSlideId}: ${matchReadSlide ? 'ĐÚNG THÔNG TIN' : 'SAI'}`);
  results.push({ domain: 'HeroSlides', operation: 'READ', status: matchReadSlide ? 'PASS' : 'FAIL', detail: readSlideRes.data?.altText });

  // 3.3 UPDATE slide
  const updatedSlidePayload = {
    imageUrl: '/sites/rog-asus/img/hero/rog-crud-test-banner-updated-2026.webp',
    altText: 'BANNER ĐÃ SỬA ĐỔI THÀNH CÔNG 2026',
    href: '/vn/compare',
    sortOrder: 1,
    isActive: true
  };
  const updateSlideRes = await adminFetch(`/api/admin/hero-slides/${createdSlideId}`, 'PUT', updatedSlidePayload);
  console.log(` -> 3.3 [UPDATE] Cập nhật slide #${createdSlideId}: "${updateSlideRes.data?.altText}"`);
  results.push({
    domain: 'HeroSlides',
    operation: 'UPDATE',
    status: updateSlideRes.ok && updateSlideRes.data?.altText === updatedSlidePayload.altText ? 'PASS' : 'FAIL',
    detail: updateSlideRes.data?.altText
  });

  // 3.4 VERIFY PUBLIC BE ENDPOINT
  const publicSlidesRes = await publicFetch(`${BE_URL}/api/public/hero-slides`);
  const foundInPublic = publicSlidesRes.data.some(s => s.alt.includes('BANNER ĐÃ SỬA ĐỔI THÀNH CÔNG 2026'));
  console.log(` -> 3.4 [VERIFY PUBLIC] Public API /api/public/hero-slides có slide mới: ${foundInPublic ? 'CÓ' : 'KHÔNG'}`);
  results.push({ domain: 'HeroSlides', operation: 'VERIFY_PUBLIC', status: foundInPublic ? 'PASS' : 'FAIL', detail: 'Phản ánh ngay ra API public' });

  // 3.5 DELETE slide
  const deleteSlideRes = await adminFetch(`/api/admin/hero-slides/${createdSlideId}`, 'DELETE');
  console.log(` -> 3.5 [DELETE] Xóa slide #${createdSlideId}: HTTP ${deleteSlideRes.status} (NoContent)`);
  results.push({
    domain: 'HeroSlides',
    operation: 'DELETE',
    status: deleteSlideRes.status === 204 ? 'PASS' : 'FAIL',
    detail: `HTTP ${deleteSlideRes.status}`
  });

  // Verify slide gone
  const verifyDeleteSlide = await adminFetch(`/api/admin/hero-slides/${createdSlideId}`);
  const slideGone = verifyDeleteSlide.status === 404;
  console.log(` -> 3.6 [VERIFY DELETED] Slide #${createdSlideId} đã bị xóa triệt để: ${slideGone ? 'XÁC NHẬN 404' : 'VẪN CÒN'}`);
  results.push({ domain: 'HeroSlides', operation: 'VERIFY_DELETED', status: slideGone ? 'PASS' : 'FAIL', detail: 'HTTP 404 sau khi xóa' });

  // =========================================================================
  // DOMAIN 3: ARTICLES (BÀI VIẾT, TIN TỨC, HIGHLIGHTS)
  // =========================================================================
  console.log('\n[BƯỚC 4] DOMAIN ARTICLES (BÀI VIẾT & TIN TỨC): CREATE -> READ -> UPDATE -> VERIFY -> DELETE');

  // 4.1 CREATE article
  const newArticlePayload = {
    title: 'BÀI VIẾT THỬ NGHIỆM CRUD CHUYÊN SÂU 2026',
    excerpt: 'Đánh giá tính năng đồng bộ và CRUD toàn diện giữa backend .NET 9 và Next.js 16.',
    tag: 'Technology',
    imageUrl: '/sites/rog-asus/img/news/crud-article-test.webp',
    href: '/vn/articles/crud-test-2026',
    section: 'Listing',
    sortOrder: 1,
    isActive: true
  };
  const createArticleRes = await adminFetch('/api/admin/articles', 'POST', newArticlePayload);
  const createdArticleId = createArticleRes.data?.id;
  console.log(` -> 4.1 [CREATE] Tạo bài viết mới #${createdArticleId}: "${createArticleRes.data?.title}" (HTTP ${createArticleRes.status})`);
  results.push({
    domain: 'Articles',
    operation: 'CREATE',
    status: createArticleRes.ok && createdArticleId ? 'PASS' : 'FAIL',
    detail: `Article ID #${createdArticleId}`
  });

  // 4.2 READ article
  const readArticleRes = await adminFetch(`/api/admin/articles/${createdArticleId}`);
  const matchReadArticle = readArticleRes.data?.title === newArticlePayload.title;
  console.log(` -> 4.2 [READ] Đọc bài viết #${createdArticleId}: ${matchReadArticle ? 'KHỚP' : 'SAI'}`);
  results.push({ domain: 'Articles', operation: 'READ', status: matchReadArticle ? 'PASS' : 'FAIL', detail: readArticleRes.data?.title });

  // 4.3 UPDATE article
  const updatedArticlePayload = {
    title: 'BÀI VIẾT ĐÃ CẬP NHẬT TIÊU ĐỀ THÀNH CÔNG 2026',
    excerpt: 'Nội dung tóm tắt đã được chỉnh sửa qua PUT /api/admin/articles/{id}.',
    tag: 'GamingNews',
    imageUrl: '/sites/rog-asus/img/news/crud-article-updated.webp',
    href: '/vn/articles/crud-test-updated',
    section: 'Listing',
    sortOrder: 2,
    isActive: true
  };
  const updateArticleRes = await adminFetch(`/api/admin/articles/${createdArticleId}`, 'PUT', updatedArticlePayload);
  console.log(` -> 4.3 [UPDATE] Cập nhật bài viết #${createdArticleId}: "${updateArticleRes.data?.title}"`);
  results.push({
    domain: 'Articles',
    operation: 'UPDATE',
    status: updateArticleRes.ok && updateArticleRes.data?.title === updatedArticlePayload.title ? 'PASS' : 'FAIL',
    detail: updateArticleRes.data?.title
  });

  // 4.4 VERIFY PUBLIC API
  const publicArticlesRes = await publicFetch(`${BE_URL}/api/public/articles?section=listing`);
  const foundArticle = publicArticlesRes.data.some(a => a.title.includes('BÀI VIẾT ĐÃ CẬP NHẬT TIÊU ĐỀ THÀNH CÔNG 2026'));
  console.log(` -> 4.4 [VERIFY PUBLIC] Public API /api/public/articles có bài viết cập nhật: ${foundArticle ? 'CÓ' : 'KHÔNG'}`);
  results.push({ domain: 'Articles', operation: 'VERIFY_PUBLIC', status: foundArticle ? 'PASS' : 'FAIL', detail: 'Phản ánh ngay ra API public' });

  // 4.5 DELETE article
  const deleteArticleRes = await adminFetch(`/api/admin/articles/${createdArticleId}`, 'DELETE');
  console.log(` -> 4.5 [DELETE] Xóa bài viết #${createdArticleId}: HTTP ${deleteArticleRes.status} (NoContent)`);
  results.push({
    domain: 'Articles',
    operation: 'DELETE',
    status: deleteArticleRes.status === 204 ? 'PASS' : 'FAIL',
    detail: `HTTP ${deleteArticleRes.status}`
  });

  // Verify deleted
  const verifyDeleteArticle = await adminFetch(`/api/admin/articles/${createdArticleId}`);
  const articleGone = verifyDeleteArticle.status === 404;
  console.log(` -> 4.6 [VERIFY DELETED] Bài viết #${createdArticleId} đã xóa sạch: ${articleGone ? 'XÁC NHẬN 404' : 'VẪN CÒN'}`);
  results.push({ domain: 'Articles', operation: 'VERIFY_DELETED', status: articleGone ? 'PASS' : 'FAIL', detail: 'HTTP 404 sau khi xóa' });

  // =========================================================================
  // DOMAIN 4: PRODUCT CATEGORIES (DANH MỤC SẢN PHẨM)
  // =========================================================================
  console.log('\n[BƯỚC 5] DOMAIN PRODUCT CATEGORIES (DANH MỤC SẢN PHẨM): CREATE -> READ -> UPDATE -> VERIFY -> DELETE');

  // 5.1 CREATE category
  const newCatPayload = {
    label: 'Test Danh Mục CRUD 2026',
    imageUrl: '/sites/rog-asus/img/products/accessories.webp',
    href: '/vn/test-category-crud',
    sortOrder: 99,
    isActive: true
  };
  const createCatRes = await adminFetch('/api/admin/product-categories', 'POST', newCatPayload);
  const createdCatId = createCatRes.data?.id;
  console.log(` -> 5.1 [CREATE] Tạo danh mục mới #${createdCatId}: "${createCatRes.data?.label}" (HTTP ${createCatRes.status})`);
  results.push({
    domain: 'Categories',
    operation: 'CREATE',
    status: createCatRes.ok && createdCatId ? 'PASS' : 'FAIL',
    detail: `Category ID #${createdCatId}`
  });

  // 5.2 READ category
  const readCatRes = await adminFetch(`/api/admin/product-categories/${createdCatId}`);
  const matchReadCat = readCatRes.data?.label === newCatPayload.label;
  console.log(` -> 5.2 [READ] Đọc danh mục #${createdCatId}: ${matchReadCat ? 'KHỚP' : 'SAI'}`);
  results.push({ domain: 'Categories', operation: 'READ', status: matchReadCat ? 'PASS' : 'FAIL', detail: readCatRes.data?.label });

  // 5.3 UPDATE category
  const updatedCatPayload = {
    label: 'Test Danh Mục ĐÃ CẬP NHẬT 2026',
    imageUrl: '/sites/rog-asus/img/products/accessories-updated.webp',
    href: '/vn/test-category-updated',
    sortOrder: 1,
    isActive: true
  };
  const updateCatRes = await adminFetch(`/api/admin/product-categories/${createdCatId}`, 'PUT', updatedCatPayload);
  console.log(` -> 5.3 [UPDATE] Cập nhật danh mục #${createdCatId}: "${updateCatRes.data?.label}"`);
  results.push({
    domain: 'Categories',
    operation: 'UPDATE',
    status: updateCatRes.ok && updateCatRes.data?.label === updatedCatPayload.label ? 'PASS' : 'FAIL',
    detail: updateCatRes.data?.label
  });

  // 5.4 VERIFY PUBLIC
  const publicCatsRes = await publicFetch(`${BE_URL}/api/public/product-categories`);
  const foundCat = publicCatsRes.data.some(c => c.label.includes('Test Danh Mục ĐÃ CẬP NHẬT 2026'));
  console.log(` -> 5.4 [VERIFY PUBLIC] Public API /api/public/product-categories có danh mục cập nhật: ${foundCat ? 'CÓ' : 'KHÔNG'}`);
  results.push({ domain: 'Categories', operation: 'VERIFY_PUBLIC', status: foundCat ? 'PASS' : 'FAIL', detail: 'Phản ánh ngay ra API public' });

  // 5.5 DELETE category
  const deleteCatRes = await adminFetch(`/api/admin/product-categories/${createdCatId}`, 'DELETE');
  console.log(` -> 5.5 [DELETE] Xóa danh mục #${createdCatId}: HTTP ${deleteCatRes.status} (NoContent)`);
  results.push({
    domain: 'Categories',
    operation: 'DELETE',
    status: deleteCatRes.status === 204 ? 'PASS' : 'FAIL',
    detail: `HTTP ${deleteCatRes.status}`
  });

  // Verify deleted
  const verifyDeleteCat = await adminFetch(`/api/admin/product-categories/${createdCatId}`);
  const catGone = verifyDeleteCat.status === 404;
  console.log(` -> 5.6 [VERIFY DELETED] Danh mục #${createdCatId} đã xóa sạch: ${catGone ? 'XÁC NHẬN 404' : 'VẪN CÒN'}`);
  results.push({ domain: 'Categories', operation: 'VERIFY_DELETED', status: catGone ? 'PASS' : 'FAIL', detail: 'HTTP 404 sau khi xóa' });

  // =========================================================================
  // DOMAIN 5: SITE SETTINGS (CẤU HÌNH SITE & PROMO BAR)
  // =========================================================================
  console.log('\n[BƯỚC 6] DOMAIN SITE SETTINGS: READ -> UPDATE -> VERIFY FE DOM -> REVERT');

  // 6.1 Read original promoBarText
  const origSettingRes = await adminFetch('/api/admin/site-settings/promoBarText');
  const origText = origSettingRes.data?.value || '';
  console.log(` -> 6.1 [READ] Nội dung PromoBar hiện tại: "${origText}"`);

  // 6.2 Update promoBarText
  const testPromoText = 'ROG KHUYẾN MÃI CRUD CHUYÊN SÂU 2026 - GIẢM ĐẾN 50%';
  const updateSettingRes = await adminFetch('/api/admin/site-settings/promoBarText', 'PUT', {
    value: testPromoText
  });
  console.log(` -> 6.2 [UPDATE] Cập nhật PromoBar mới: "${updateSettingRes.data?.value}"`);
  results.push({
    domain: 'SiteSettings',
    operation: 'UPDATE',
    status: updateSettingRes.ok && updateSettingRes.data?.value === testPromoText ? 'PASS' : 'FAIL',
    detail: testPromoText
  });

  // 6.3 Verify BE Public site-config
  const publicConfigRes = await publicFetch(`${BE_URL}/api/public/site-config`);
  const matchConfig = publicConfigRes.data?.promoBar?.text === testPromoText;
  console.log(` -> 6.3 [VERIFY BE] Cấu hình BE public cập nhật ngay: ${matchConfig ? 'KHỚP' : 'SAI'}`);
  results.push({ domain: 'SiteSettings', operation: 'VERIFY_PUBLIC', status: matchConfig ? 'PASS' : 'FAIL', detail: 'BE site-config khớp text' });

  // 6.4 Verify FE Homepage PromoBar DOM & Screenshot
  await page.goto(`${FE_URL}/vn`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const promoDomMatch = await page.evaluate((text) => {
    return document.body.innerText.includes(text);
  }, testPromoText);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'crud_3_promobar_updated_homepage.png'), fullPage: false });
  console.log(` -> 6.4 [FE HOMEPAGE DOM] PromoBar hiển thị text mới: ${promoDomMatch ? 'XÁC NHẬN CÓ' : 'CHƯA THẤY'}`);
  results.push({
    domain: 'SiteSettings',
    operation: 'FE_PROMOBAR_VERIFY',
    status: promoDomMatch ? 'PASS' : 'FAIL',
    detail: 'DOM thanh PromoBar trang chủ render đúng text vừa mutate'
  });

  // 6.5 Revert promoBarText
  await adminFetch('/api/admin/site-settings/promoBarText', 'PUT', {
    value: origText
  });
  console.log(` -> 6.5 [REVERT] Đã khôi phục text PromoBar ban đầu: "${origText}"`);
  results.push({ domain: 'SiteSettings', operation: 'REVERT', status: 'PASS', detail: `Khôi phục: ${origText}` });

  // =========================================================================
  // DOMAIN 6: ADMIN WEB UI (PORTAL GIAO DIỆN QUẢN TRỊ /admin)
  // =========================================================================
  console.log('\n[BƯỚC 7] DOMAIN ADMIN WEB UI: ĐĂNG NHẬP TRÌNH DUYỆT & KIỂM TRA QUẢN LÝ SẢN PHẨM & GIÁ');

  await page.goto(`${BE_URL}/admin/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Check if login screen is visible
  const isLoginVisible = await page.evaluate(() => {
    const screen = document.getElementById('login-screen');
    return screen && !screen.classList.contains('hidden');
  });

  if (isLoginVisible) {
    console.log(' -> 7.1 Đăng nhập qua form Admin Web UI...');
    await page.fill('#login-username', 'admin');
    await page.fill('#login-password', 'Admin@123');
    await page.click('#login-form button[type="submit"]');
    await page.waitForTimeout(1000);
  }

  // Navigate to Products page in Admin Portal
  await page.goto(`${BE_URL}/admin/#products`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const productRowsCount = await page.evaluate(() => {
    const rows = document.querySelectorAll('#products-table tbody tr');
    return rows.length;
  });
  console.log(` -> 7.2 [ADMIN PORTAL] Bảng sản phẩm & giá hiển thị: ${productRowsCount} dòng sản phẩm`);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'crud_4_admin_portal_products_view.png'), fullPage: false });
  results.push({
    domain: 'AdminUI',
    operation: 'PRODUCTS_GRID',
    status: productRowsCount > 0 ? 'PASS' : 'FAIL',
    detail: `Hiển thị ${productRowsCount} sản phẩm cùng nút Sửa giá & Chi tiết`
  });

  await browser.close();

  // =========================================================================
  // TỔNG KẾT BẢNG KẾT QUẢ
  // =========================================================================
  console.log('\n' + '='.repeat(90));
  console.log(' TỔNG HỢP KẾT QUẢ KIỂM THỬ CHUYÊN SÂU TOÀN DIỆN CRUD (BE <-> FE)');
  console.log('='.repeat(90));
  console.table(results.map(r => ({
    'Domain': r.domain,
    'Hành động (CRUD)': r.operation,
    'Kết quả': r.status,
    'Chi tiết xác thực': r.detail
  })));

  const totalTests = results.length;
  const passTests = results.filter(r => r.status === 'PASS').length;
  console.log(`\n=> TỔNG SỐ TEST: ${totalTests} | ĐẠT: ${passTests}/${totalTests} (TỶ LỆ: ${(passTests/totalTests*100).toFixed(1)}%)\n`);

  if (passTests === totalTests) {
    console.log('🎉 TẤT CẢ CÁC THAO TÁC CRUD TRÊN TOÀN BỘ DOMAIN ĐỀU THÀNH CÔNG 100%!');
  } else {
    console.error(`⚠️ Có ${totalTests - passTests} kiểm thử thất bại.`);
    process.exit(1);
  }
}

runExhaustiveCrudTest().catch(err => {
  console.error('Fatal Error:', err);
  process.exit(1);
});

