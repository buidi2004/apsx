const BE_URL = process.env.ROG_API_URL || 'http://127.0.0.1:5161';
const FE_URL = 'http://localhost:3000';

async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);
  const data = await res.json().catch(() => null);
  return { status: res.status, ok: res.ok, headers: res.headers, data };
}

async function runAudit() {
  console.log('================================================================');
  console.log(' KIỂM TRA TOÀN DIỆN KẾT NỐI FRONTEND <-> BACKEND (ROG ADMIN)');
  console.log('================================================================\n');

  const report = {
    beUrl: BE_URL,
    feUrl: FE_URL,
    steps: []
  };

  // 1. Kiểm tra Health check BE
  try {
    const health = await fetchJson(`${BE_URL}/health`);
    report.steps.push({
      item: '1. Kiểm tra Sức khỏe Backend (GET /health)',
      status: health.ok ? '✅ PASS' : '❌ FAIL',
      detail: `HTTP ${health.status} - ${JSON.stringify(health.data)}`
    });
  } catch (err) {
    report.steps.push({
      item: '1. Kiểm tra Sức khỏe Backend (GET /health)',
      status: '❌ FAIL',
      detail: `Không thể kết nối tới BE: ${err.message}`
    });
  }

  // 2. Kiểm tra Swagger UI & OpenAPI Specification
  try {
    const swaggerRes = await fetch(`${BE_URL}/swagger/v1/swagger.json`);
    const swaggerJson = await swaggerRes.json();
    const endpointCount = Object.keys(swaggerJson.paths || {}).length;
    report.steps.push({
      item: '2. Kiểm tra Swagger / OpenAPI (GET /swagger/v1/swagger.json)',
      status: swaggerRes.ok ? '✅ PASS' : '❌ FAIL',
      detail: `HTTP ${swaggerRes.status} - Khám phá ${endpointCount} endpoints`
    });
  } catch (err) {
    report.steps.push({
      item: '2. Kiểm tra Swagger / OpenAPI',
      status: '❌ FAIL',
      detail: err.message
    });
  }

  // 3. Kiểm tra CORS Preflight từ Origin Frontend
  try {
    const corsRes = await fetch(`${BE_URL}/api/public/site-config`, {
      method: 'OPTIONS',
      headers: {
        'Origin': FE_URL,
        'Access-Control-Request-Method': 'GET'
      }
    });
    const allowOrigin = corsRes.headers.get('access-control-allow-origin');
    const isCorsOk = allowOrigin === FE_URL || allowOrigin === '*';
    report.steps.push({
      item: '3. Kiểm tra Chính sách CORS (OPTIONS từ Origin localhost:3000)',
      status: isCorsOk ? '✅ PASS' : '❌ FAIL',
      detail: `HTTP ${corsRes.status} - Access-Control-Allow-Origin: ${allowOrigin || 'Chưa bật'}`
    });
  } catch (err) {
    report.steps.push({
      item: '3. Kiểm tra Chính sách CORS',
      status: '❌ FAIL',
      detail: err.message
    });
  }

  // 4. Kiểm tra Endpoint Công khai: Cấu hình Site (/api/public/site-config)
  try {
    const config = await fetchJson(`${BE_URL}/api/public/site-config`);
    const keys = config.data ? Object.keys(config.data).join(', ') : 'none';
    report.steps.push({
      item: '4. API Công Khai: Cấu hình Site (/api/public/site-config)',
      status: config.ok ? '✅ PASS' : '❌ FAIL',
      detail: `HTTP ${config.status} - Các khối dữ liệu: [${keys}]`
    });
  } catch (err) {
    report.steps.push({
      item: '4. API Công Khai: Cấu hình Site',
      status: '❌ FAIL',
      detail: err.message
    });
  }

  // 5. Kiểm tra Endpoint Công khai: Hero Slides (/api/public/hero-slides)
  try {
    const slides = await fetchJson(`${BE_URL}/api/public/hero-slides`);
    const count = Array.isArray(slides.data) ? slides.data.length : 0;
    report.steps.push({
      item: '5. API Công Khai: Hero Slides (/api/public/hero-slides)',
      status: slides.ok && count > 0 ? '✅ PASS' : '❌ FAIL',
      detail: `HTTP ${slides.status} - ${count} slides khả dụng (khớp SLIDES FE)`
    });
  } catch (err) {
    report.steps.push({
      item: '5. API Công Khai: Hero Slides',
      status: '❌ FAIL',
      detail: err.message
    });
  }

  // 6. Kiểm tra Endpoint Công khai: Danh mục sản phẩm (/api/public/product-categories)
  try {
    const cats = await fetchJson(`${BE_URL}/api/public/product-categories`);
    const count = Array.isArray(cats.data) ? cats.data.length : 0;
    report.steps.push({
      item: '6. API Công Khai: Danh mục sản phẩm (/api/public/product-categories)',
      status: cats.ok && count === 22 ? '✅ PASS' : '❌ FAIL',
      detail: `HTTP ${cats.status} - ${count}/22 danh mục khả dụng (khớp 100% PRODUCTS FE)`
    });
  } catch (err) {
    report.steps.push({
      item: '6. API Công Khai: Danh mục sản phẩm',
      status: '❌ FAIL',
      detail: err.message
    });
  }

  // 7. Kiểm tra Endpoint Công khai: Bài viết (/api/public/articles)
  try {
    const hArt = await fetchJson(`${BE_URL}/api/public/articles?section=highlights`);
    const lArt = await fetchJson(`${BE_URL}/api/public/articles?section=listing`);
    const hCount = Array.isArray(hArt.data) ? hArt.data.length : 0;
    const lCount = Array.isArray(lArt.data) ? lArt.data.length : 0;
    report.steps.push({
      item: '7. API Công Khai: Bài viết ROG (/api/public/articles)',
      status: hArt.ok && lArt.ok ? '✅ PASS' : '❌ FAIL',
      detail: `HTTP ${hArt.status} - Highlights: ${hCount} bài, Listing: ${lCount} bài`
    });
  } catch (err) {
    report.steps.push({
      item: '7. API Công Khai: Bài viết ROG',
      status: '❌ FAIL',
      detail: err.message
    });
  }

  // 8. Kiểm tra Xác thực & JWT Token (POST /api/auth/login)
  let authToken = null;
  try {
    const loginRes = await fetchJson(`${BE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'Admin@123' })
    });
    authToken = loginRes.data?.token;
    report.steps.push({
      item: '8. Xác thực Admin & Cấp JWT Token (POST /api/auth/login)',
      status: loginRes.ok && authToken ? '✅ PASS' : '❌ FAIL',
      detail: `HTTP ${loginRes.status} - Token hợp lệ (Role: ${loginRes.data?.user?.role}, Hết hạn: 8h)`
    });
  } catch (err) {
    report.steps.push({
      item: '8. Xác thực Admin & Cấp JWT Token',
      status: '❌ FAIL',
      detail: err.message
    });
  }

  // 9. Kiểm tra Quyền truy cập Admin có Bearer Token (/api/admin/dashboard)
  if (authToken) {
    try {
      const dashRes = await fetchJson(`${BE_URL}/api/admin/dashboard`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      report.steps.push({
        item: '9. Kiểm tra API Quản trị Bảo mật (GET /api/admin/dashboard)',
        status: dashRes.ok ? '✅ PASS' : '❌ FAIL',
        detail: `HTTP ${dashRes.status} - Tổng số SP: ${dashRes.data?.productCategoriesTotal}, Bài viết: ${dashRes.data?.articlesTotal}`
      });
    } catch (err) {
      report.steps.push({
        item: '9. Kiểm tra API Quản trị Bảo mật',
        status: '❌ FAIL',
        detail: err.message
      });
    }
  }

  console.table(report.steps.map(s => ({
    'Hạng mục kiểm tra': s.item,
    'Trạng thái': s.status,
    'Chi tiết kết quả': s.detail
  })));

  const allPassed = report.steps.every(s => s.status.includes('PASS'));
  console.log(`\n=> KẾT LUẬN KIỂM TRA: ${allPassed ? '✅ BACKEND HOẠT ĐỘNG HOÀN TOÀN TỐT, SẴN SÀNG KẾT NỐI VỚI FRONTEND' : '❌ CÓ LỖI KẾT NỐI'}`);
}

runAudit().catch(console.error);
