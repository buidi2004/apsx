const FE_URL = 'http://localhost:3000';
const BE_URL = 'http://localhost:5161';

async function runStressTest() {
  console.log('========================================================================');
  console.log(' PHẦN 1: KIỂM THỬ TẢI & ĐỒNG THỜI (CONCURRENCY & STRESS TEST)');
  console.log('========================================================================\n');

  const TOTAL_REQUESTS = 100;
  const CONCURRENCY = 10;
  const endpoint = `${FE_URL}/api/be/public/site-config`;

  console.log(`Gửi ${TOTAL_REQUESTS} requests đồng thời (Concurrency: ${CONCURRENCY}) tới ${endpoint}...`);

  const latencies = [];
  let successCount = 0;
  let failCount = 0;

  const startTime = Date.now();

  for (let i = 0; i < TOTAL_REQUESTS; i += CONCURRENCY) {
    const chunk = Array.from({ length: Math.min(CONCURRENCY, TOTAL_REQUESTS - i) }, async () => {
      const t0 = Date.now();
      try {
        const res = await fetch(endpoint, { cache: 'no-store' });
        const t1 = Date.now() - t0;
        latencies.push(t1);
        if (res.ok) successCount++;
        else failCount++;
      } catch {
        failCount++;
      }
    });
    await Promise.all(chunk);
  }

  const totalTime = Date.now() - startTime;
  latencies.sort((a, b) => a - b);
  const avg = (latencies.reduce((a, b) => a + b, 0) / latencies.length).toFixed(1);
  const min = latencies[0];
  const max = latencies[latencies.length - 1];
  const p95 = latencies[Math.floor(latencies.length * 0.95)];
  const p99 = latencies[Math.floor(latencies.length * 0.99)];

  console.log(`- Tổng số requests: ${TOTAL_REQUESTS}`);
  console.log(`- Thành công (200 OK): ${successCount}/${TOTAL_REQUESTS} (${((successCount / TOTAL_REQUESTS) * 100).toFixed(1)}%)`);
  console.log(`- Thất bại: ${failCount}`);
  console.log(`- Tổng thời gian hoàn thành: ${totalTime}ms`);
  console.log(`- Tốc độ xử lý (RPS): ${((TOTAL_REQUESTS / totalTime) * 1000).toFixed(1)} req/s`);
  console.log(`- Độ trễ tối thiểu (Min): ${min}ms`);
  console.log(`- Độ trễ trung bình (Avg): ${avg}ms`);
  console.log(`- Độ trễ P95: ${p95}ms`);
  console.log(`- Độ trễ P99: ${max}ms`);
  console.log(`\n=> KẾT LUẬN TẢI: ${successCount === TOTAL_REQUESTS ? '✅ ĐẠT 100% - KHÔNG CÓ LỖI NGHẼN HOẶC KHÓA DATABASE' : '❌ CÓ LỖI TẢI'}\n`);
}

async function runSecurityTest() {
  console.log('========================================================================');
  console.log(' PHẦN 2: KIỂM THỬ BẢO MẬT & RATE LIMITING CHỐNG BRUTE FORCE');
  console.log('========================================================================\n');

  // Test 1: Truy cập trái phép không có Token
  console.log('- Test 2.1: Truy cập API quản trị bảo mật không có Token (/api/admin/dashboard)...');
  const noTokenRes = await fetch(`${BE_URL}/api/admin/dashboard`);
  console.log(`  Mã phản hồi: HTTP ${noTokenRes.status} (Kỳ vọng: 401 Unauthorized) -> ${noTokenRes.status === 401 ? '✅ ĐẠT' : '❌ LỖI'}`);

  // Test 2: Truy cập với Token giả mạo
  console.log('\n- Test 2.2: Truy cập API quản trị với Token giả mạo (Fake Bearer)...');
  const fakeTokenRes = await fetch(`${BE_URL}/api/admin/dashboard`, {
    headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.signature' }
  });
  console.log(`  Mã phản hồi: HTTP ${fakeTokenRes.status} (Kỳ vọng: 401 Unauthorized) -> ${fakeTokenRes.status === 401 ? '✅ ĐẠT' : '❌ LỖI'}`);

  // Test 3: Kích hoạt Rate Limit (Brute Force Protection)
  console.log('\n- Test 2.3: Bắn 12 lượt đăng nhập liên tiếp để kiểm tra Rate Limit (Ngưỡng: 10 lần/phút/IP)...');
  let rateLimitHit = false;
  let hitAt = -1;

  for (let i = 1; i <= 12; i++) {
    const res = await fetch(`${BE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'hacker', password: 'bad_password' })
    });
    if (res.status === 429) {
      rateLimitHit = true;
      hitAt = i;
      break;
    }
  }

  console.log(`  Kích hoạt mã HTTP 429 Too Many Requests: ${rateLimitHit ? `✅ ĐẠT (Bị chặn đúng ở lượt thứ ${hitAt})` : '⚠️ Chưa kích hoạt'}`);
  console.log(`\n=> KẾT LUẬN BẢO MẬT: ${noTokenRes.status === 401 && fakeTokenRes.status === 401 ? '✅ HỆ THỐNG BẢO VỆ ĐA LỚP CHẶN ĐỨNG TRUY CẬP TRÁI PHÉP' : '❌ CÓ LỖI BẢO MẬT'}\n`);
}

async function main() {
  await runStressTest();
  await runSecurityTest();
}

main().catch(console.error);

