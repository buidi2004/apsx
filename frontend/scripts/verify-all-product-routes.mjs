import fs from "fs";
import path from "path";

const BASE_URL = "http://localhost:3000";

async function main() {
  const content = fs.readFileSync(
    path.join(process.cwd(), "src/components/sites/rog-asus/RogProductHome.tsx"),
    "utf8"
  );
  const hrefs = [...new Set([...content.matchAll(/href:\s*"(\/vn\/[^"]+)"/g)].map((m) => m[1]))];

  const productHrefs = hrefs.filter((h) => {
    if (h.includes("apple.com") || h.includes("samsung.com")) return false;
    if (h.includes("iphone") || h.includes("ipad") || h.includes("macbook") || h.includes("galaxy")) return false;
    if (h.includes("-group") || h.includes("-series")) return false;
    return true;
  });

  console.log(`Verifying ${productHrefs.length} products (both Overview + /spec) on ${BASE_URL}...`);

  let passed = 0;
  let failed = 0;
  const failures = [];

  for (const h of productHrefs) {
    const cleanPath = h.replace(/\/$/, "");
    const testUrls = [`${BASE_URL}${cleanPath}`, `${BASE_URL}${cleanPath}/spec`];

    for (const url of testUrls) {
      try {
        const res = await fetch(url);
        if (res.ok) {
          passed++;
          process.stdout.write(".");
        } else {
          failed++;
          failures.push({ url, status: res.status });
          process.stdout.write("F");
        }
      } catch (err) {
        failed++;
        failures.push({ url, error: err.message });
        process.stdout.write("E");
      }
    }
  }

  console.log(`\n\nResults: ${passed} passed, ${failed} failed out of ${productHrefs.length * 2} routes tested.`);
  if (failures.length > 0) {
    console.log("Failures:", failures);
  }
}

main();
