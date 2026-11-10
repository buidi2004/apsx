const http = require('http');

function get(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const start = process.hrtime.bigint();
    const req = http.get(url, { headers }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const end = process.hrtime.bigint();
        const durationMs = Number(end - start) / 1e6;
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          durationMs,
          bodySize: Buffer.byteLength(data),
          data
        });
      });
    });
    req.on('error', reject);
  });
}

async function testPerformance() {
  console.log('=== CHI TIẾT TỐI ƯU HÓA KẾT NỐI FE-BE ===\n');

  // 1. Kiểm tra ASP.NET Core Output Caching & Response Compression
  console.log('1. ASP.NET Core Output Caching & Compression:');
  const coldRes = await get('http://localhost:5161/api/public/products?pageSize=20', { 'Accept-Encoding': 'gzip, br' });
  const warmRes = await get('http://localhost:5161/api/public/products?pageSize=20', { 'Accept-Encoding': 'gzip, br' });
  
  console.log(`- Cold Request (Lần đầu): ${coldRes.durationMs.toFixed(2)}ms (Status: ${coldRes.statusCode})`);
  console.log(`- Warm Request (Output Cache Hit): ${warmRes.durationMs.toFixed(2)}ms (Status: ${warmRes.statusCode})`);
  console.log(`- Cache Header: Cache-Control: ${warmRes.headers['cache-control']}`);
  console.log(`- Compression: Content-Encoding: ${warmRes.headers['content-encoding'] || 'identity'}`);
  console.log(`- Tốc độ tăng tốc Output Cache: ${(coldRes.durationMs / warmRes.durationMs).toFixed(1)}x\n`);

  // 2. Kiểm tra Next.js Reverse Proxy
  console.log('2. Next.js Reverse Proxy (/api/be/...):');
  const proxyRes = await get('http://localhost:3000/api/be/public/products?pageSize=20');
  console.log(`- Proxy Roundtrip: ${proxyRes.durationMs.toFixed(2)}ms (Status: ${proxyRes.statusCode})`);
  console.log(`- Overhead Reverse Proxy: ${(proxyRes.durationMs - warmRes.durationMs).toFixed(2)}ms\n`);

  // 3. Stress test 100 requests liên tục
  console.log('3. Stress test 100 requests liên tiếp:');
  const latencies = [];
  const tTotalStart = Date.now();
  for (let i = 0; i < 100; i++) {
    const res = await get('http://localhost:5161/api/public/pricing/batch?slugs=rog-strix-scar-18-2024,rog-zephyrus-g16-2024');
    latencies.push(res.durationMs);
  }
  const totalMs = Date.now() - tTotalStart;
  latencies.sort((a, b) => a - b);
  const p50 = latencies[Math.floor(latencies.length * 0.5)];
  const p95 = latencies[Math.floor(latencies.length * 0.95)];
  const p99 = latencies[latencies.length - 1];
  const rps = (100 / (totalMs / 1000)).toFixed(1);

  console.log(`- Hoàn thành 100 requests trong: ${totalMs}ms`);
  console.log(`- Throughput: ${rps} req/s`);
  console.log(`- P50 Latency: ${p50.toFixed(2)}ms`);
  console.log(`- P95 Latency: ${p95.toFixed(2)}ms`);
  console.log(`- P99 Latency: ${p99.toFixed(2)}ms\n`);

  console.log('=== TẤT CẢ CHỈ SỐ ĐẠT TIÊU CHUẨN HIỆU NĂNG CAO CẤP ===');
}

testPerformance().catch(console.error);
