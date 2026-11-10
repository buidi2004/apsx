import fs from "fs";
import path from "path";

// 1. Read product1.xml
const xml = fs.readFileSync(".cache/product1.xml", "utf8");
const allUrls = [...xml.matchAll(/<loc>https:\/\/rog\.asus\.com\/vn\/([^<]+)\/<\/loc>/g)].map(
  (m) => m[1]
);

const subPageSet = new Set([
  "spec",
  "award",
  "gallery",
  "wtb",
  "helpdesk",
  "review",
  "compatible-list",
]);

const baseProducts = allUrls.filter((u) => {
  const parts = u.split("/");
  return !subPageSet.has(parts[parts.length - 1]);
});

console.log("Total unique base products on official ROG VN sitemap:", baseProducts.length);

// 2. Check cached products
const cacheDir = path.join(process.cwd(), ".cache", "rog-catalog");
const cachedFiles = fs.existsSync(cacheDir) ? fs.readdirSync(cacheDir) : [];
const cachedKeys = new Set(cachedFiles.map((f) => f.replace(/\.json$/, "")));

console.log("Total cached files in .cache/rog-catalog:", cachedFiles.length);

// Check base products caching status
const cachedBaseProducts = [];
const missingBaseProducts = [];

for (const p of baseProducts) {
  const cleanKey = p.replace(/[^a-zA-Z0-9-_]/g, "_");
  if (cachedKeys.has(cleanKey)) {
    cachedBaseProducts.push(p);
  } else {
    missingBaseProducts.push(p);
  }
}

console.log(`\nBase Products: ${cachedBaseProducts.length} CACHED, ${missingBaseProducts.length} NOT YET CACHED locally.`);

// Group missing by category
const missingByCat = {};
for (const p of missingBaseProducts) {
  const cat = p.split("/")[0];
  missingByCat[cat] = (missingByCat[cat] || 0) + 1;
}

console.log("\nMissing Base Products by Category:");
console.table(missingByCat);

// 3. Check Navbar links
const navContent = fs.readFileSync("src/components/sites/rog-asus/RogNavbar.tsx", "utf8");
const navHrefs = [...new Set([...navContent.matchAll(/href=["'](\/vn\/[^"']+)["']/g)].map((m) => m[1]))];

console.log(`\nNavbar links count: ${navHrefs.length}`);
console.log("Navbar links:", navHrefs);

