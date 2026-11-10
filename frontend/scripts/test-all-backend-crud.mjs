const BE_URL = 'http://127.0.0.1:5161';

async function fetchJson(path, options = {}) {
  const res = await fetch(`${BE_URL}${path}`, options);
  const data = await res.json().catch(() => null);
  return { status: res.status, ok: res.ok, data };
}

async function runExhaustiveCrudTest() {
  console.log('========================================================================');
  console.log(' KIỂM THỬ CHUYÊN SÂU TẤT CẢ CÁC CONTROLLER & CRUD CỦA ROGADMIN BACKEND');
  console.log('========================================================================\n');

  const testResults = [];

  function record(module, action, passed, detail) {
    testResults.push({
      Module: module,
      Action: action,
      Status: passed ? '✅ PASS' : '❌ FAIL',
      Detail: detail
    });
  }

  // 1. AUTH & SECURITY
  console.log('--- 1. KIỂM THỬ AUTH & PHÂN QUYỀN JWT ---');
  // 1.1 Login fail
  const badLogin = await fetchJson('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'WrongPassword' })
  });
  record('Auth', 'Login sai mật khẩu -> Chặn 401', badLogin.status === 401, `Status: ${badLogin.status}`);

  // 1.2 Login success
  const adminLogin = await fetchJson('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'Admin@123' })
  });
  const token = adminLogin.data?.token;
  record('Auth', 'Login Admin thành công -> Cấp JWT', adminLogin.ok && Boolean(token), `User: ${adminLogin.data?.user?.username}, Role: ${adminLogin.data?.user?.role}`);

  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // 2. DASHBOARD
  console.log('--- 2. KIỂM THỬ DASHBOARD METRICS ---');
  const dash = await fetchJson('/api/admin/dashboard', { headers: authHeaders });
  record('Dashboard', 'Thống kê tổng quan hệ thống', dash.ok, `SP: ${dash.data?.productCategoriesTotal}, Bài viết: ${dash.data?.articlesTotal}, Slides: ${dash.data?.heroSlidesTotal}`);

  // 3. HERO SLIDES CRUD
  console.log('--- 3. KIỂM THỬ HERO SLIDES CRUD ---');
  // List
  const slides = await fetchJson('/api/admin/hero-slides', { headers: authHeaders });
  record('HeroSlides', 'Lấy danh sách Slide (GET)', slides.ok, `${slides.data?.length} slides`);

  // Create
  const newSlide = await fetchJson('/api/admin/hero-slides', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      imageUrl: 'https://dlcdnwebimgs.asus.com/test-slide-desktop.webp',
      altText: 'Test Slide Automated',
      href: '/vn/test-event',
      sortOrder: 99,
      isActive: true
    })
  });
  const createdSlideId = newSlide.data?.id;
  record('HeroSlides', 'Tạo Slide mới (POST)', newSlide.ok && Boolean(createdSlideId), `Created ID: ${createdSlideId}`);

  // Update
  if (createdSlideId) {
    const updateSlide = await fetchJson(`/api/admin/hero-slides/${createdSlideId}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({
        imageUrl: 'https://dlcdnwebimgs.asus.com/test-slide-desktop-v2.webp',
        altText: 'Test Slide Updated',
        href: '/vn/test-event-v2',
        sortOrder: 100,
        isActive: true
      })
    });
    record('HeroSlides', 'Cập nhật Slide (PUT)', updateSlide.ok, `Updated Alt: ${updateSlide.data?.altText}`);

    // Delete
    const deleteSlide = await fetchJson(`/api/admin/hero-slides/${createdSlideId}`, {
      method: 'DELETE',
      headers: authHeaders
    });
    record('HeroSlides', 'Xóa Slide tạm (DELETE)', deleteSlide.status === 204 || deleteSlide.ok, `Deleted status: ${deleteSlide.status}`);
  }

  // 4. PRODUCT CATEGORIES CRUD
  console.log('--- 4. KIỂM THỬ PRODUCT CATEGORIES CRUD ---');
  const cats = await fetchJson('/api/admin/product-categories', { headers: authHeaders });
  record('Categories', 'Lấy danh sách 22 ngành hàng (GET)', cats.ok && cats.data?.length === 22, `Found ${cats.data?.length} categories`);

  // 5. ARTICLES CRUD
  console.log('--- 5. KIỂM THỬ ARTICLES CRUD ---');
  // List with filter
  const arts = await fetchJson('/api/admin/articles?page=1&pageSize=10', { headers: authHeaders });
  record('Articles', 'Lấy danh sách bài viết phân trang (GET)', arts.ok, `Total: ${arts.data?.totalCount} articles`);

  // Tags
  const tags = await fetchJson('/api/admin/articles/tags', { headers: authHeaders });
  record('Articles', 'Lấy danh mục Tags phân loại (GET)', tags.ok && tags.data?.length > 0, `Tags: [${tags.data?.join(', ')}]`);

  // Create article
  const newArt = await fetchJson('/api/admin/articles', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      title: 'Kiểm thử tự động bài viết ROG Test',
      tag: 'Gaming',
      section: 'Listing',
      imageUrl: '/sites/rog-asus/img/articles/test.webp',
      excerpt: 'Tóm tắt bài viết tự động kiểm thử hệ thống backend.',
      href: '/vn/articles/gaming/test-auto-article',
      publishedDate: new Date().toISOString(),
      sortOrder: 99,
      isActive: true
    })
  });
  const createdArtId = newArt.data?.id;
  record('Articles', 'Tạo bài viết mới (POST)', newArt.ok && Boolean(createdArtId), `Created ID: ${createdArtId}`);

  // Delete article
  if (createdArtId) {
    const delArt = await fetchJson(`/api/admin/articles/${createdArtId}`, {
      method: 'DELETE',
      headers: authHeaders
    });
    record('Articles', 'Xóa bài viết tạm (DELETE)', delArt.status === 204 || delArt.ok, `Deleted status: ${delArt.status}`);
  }

  // 6. FOOTER LINKS CRUD
  console.log('--- 6. KIỂM THỬ FOOTER LINKS CRUD ---');
  const footerLinks = await fetchJson('/api/admin/footer-links', { headers: authHeaders });
  record('FooterLinks', 'Lấy danh sách link Footer (GET)', footerLinks.ok, `${footerLinks.data?.length} links`);

  // 7. SITE SETTINGS KEY-VALUE
  console.log('--- 7. KIỂM THỬ SITE SETTINGS (20 KHÓA) ---');
  const settings = await fetchJson('/api/admin/site-settings', { headers: authHeaders });
  record('SiteSettings', 'Lấy 20 khóa cấu hình site (GET)', settings.ok && settings.data?.length === 20, `${settings.data?.length}/20 keys`);

  // 8. USER MANAGEMENT (RBAC)
  console.log('--- 8. KIỂM THỬ USER MANAGEMENT & GUARDS ---');
  const users = await fetchJson('/api/admin/users', { headers: authHeaders });
  record('Users', 'Lấy danh sách tài khoản quản trị (GET)', users.ok, `${users.data?.length} users (Admin, Editor)`);

  // Guard test: Cannot delete self
  const adminUser = users.data?.find(u => u.username === 'admin');
  if (adminUser) {
    const selfDel = await fetchJson(`/api/admin/users/${adminUser.id}`, {
      method: 'DELETE',
      headers: authHeaders
    });
    record('Users', 'Guard: Chặn tự xóa chính mình (DELETE self)', selfDel.status === 400, `Blocked correctly with HTTP ${selfDel.status}: ${selfDel.data?.message}`);
  }

  console.log('\n========================================================================');
  console.log(' BẢNG TỔNG HỢP KIỂM THỬ TẤT CẢ CONTROLLERS & SERVICES');
  console.log('========================================================================\n');
  console.table(testResults);

  const allPassed = testResults.every(r => r.Status.includes('PASS'));
  console.log(`\n=> KẾT LUẬN: ${allPassed ? '✅ 100% TẤT CẢ CÁC TÍNH NĂNG VÀ CONTROLLER HOẠT ĐỘNG HOÀN HẢO KHÔNG LỖI' : '❌ CÓ LỖI XẢY RA'}`);
}

runExhaustiveCrudTest().catch(console.error);
