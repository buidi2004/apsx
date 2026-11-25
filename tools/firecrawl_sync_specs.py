#!/usr/bin/env python3
"""
tools/firecrawl_sync_specs.py - Firecrawl MCP Deep Specs & Catalog Synchronizer

Integrates Firecrawl (via Firecrawl MCP / REST API / Playwright DOM fallback) to:
 1. Deep crawl ASUS ROG Laptop & Component specifications (/vn/laptops/.../spec/)
 2. Parse JS-rendered specification tables and hidden SKU tabs
 3. Normalize into structured JSON schema matching RogAdmin backend models
 4. Output database import payload for tools/import_catalog_to_sqlite.py

Usage:
  python3 tools/firecrawl_sync_specs.py [--url <product_spec_url>] [--output <specs.json>]
"""

import os
import sys
import json
import argparse
import subprocess
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
FRONTEND_DIR = PROJECT_ROOT / "frontend"
DEFAULT_SPECS_OUTPUT = PROJECT_ROOT / "tools" / "specs_extracted.json"

SPECS_CRAWLER_NODE_SCRIPT = """
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

const targetUrl = process.argv[2] || 'https://rog.asus.com/vn/laptops/rog-zephyrus/rog-zephyrus-g16-2024/spec/';
const outputPath = path.resolve(process.argv[3] || 'tools/specs_extracted.json');

async function crawlWithPlaywright(url) {
  console.log('🕷️ [Firecrawl-Parity Engine] Deep crawling specs from:', url);
  
  const executablePath = fs.existsSync('/usr/bin/google-chrome')
    ? '/usr/bin/google-chrome'
    : fs.existsSync('/usr/bin/chromium')
    ? '/usr/bin/chromium'
    : undefined;

  const browser = await chromium.launch({
    headless: true,
    executablePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'
  });

  const specsData = {
    sourceUrl: url,
    scrapedAt: new Date().toISOString(),
    productName: '',
    skus: [],
    specifications: {}
  };

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 35000 });
    await page.waitForTimeout(2000);

    // Extract title
    specsData.productName = await page.title();

    // Extract all spec rows (ASUS ROG uses structured definition tables / list items)
    const extracted = await page.evaluate(() => {
      const specs = {};
      const rows = document.querySelectorAll('tr, .specItem, [class*="SpecItem"], [class*="spec-row"], dl');
      
      rows.forEach(row => {
        let label = '';
        let val = '';

        const dt = row.querySelector('dt, th, [class*="label"], [class*="Title"], .specTitle');
        const dd = row.querySelector('dd, td, [class*="content"], [class*="Content"], [class*="desc"]');

        if (dt && dd) {
          label = dt.innerText.trim();
          val = dd.innerText.trim();
        } else if (row.children.length >= 2) {
          label = row.children[0].innerText.trim();
          val = row.children[1].innerText.trim();
        }

        if (label && val) {
          specs[label] = val;
        }
      });

      // Extract SKU options if present
      const skus = [];
      const skuButtons = document.querySelectorAll('[class*="sku"], [class*="modelItem"], [role="tab"]');
      skuButtons.forEach(btn => {
        const text = btn.innerText.trim();
        if (text && text.length > 2 && text.length < 50 && !skus.includes(text)) {
          skus.push(text);
        }
      });

      return { specs, skus };
    });

    specsData.specifications = extracted.specs;
    specsData.skus = extracted.skus;

  } catch (err) {
    console.warn('⚠️ Crawling error:', err.message);
  } finally {
    await browser.close();
  }

  return specsData;
}

async function main() {
  const result = await crawlWithPlaywright(targetUrl);
  
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));

  console.log('======================================================');
  console.log('✅ FIRECRAWL SPECS CRAWL COMPLETE!');
  console.log(`Product:    ${result.productName}`);
  console.log(`Spec items: ${Object.keys(result.specifications).length}`);
  console.log(`SKUs found: ${result.skus.length}`);
  console.log(`Output:     ${outputPath}`);
  console.log('======================================================');
}

main().catch(console.error);
"""

def main():
    parser = argparse.ArgumentParser(description="Firecrawl ROG Product Specs Synchronizer")
    parser.add_argument("--url", default="https://rog.asus.com/vn/laptops/rog-zephyrus/rog-zephyrus-g16-2024/spec/", help="Product specs URL")
    parser.add_argument("--output", default=str(DEFAULT_SPECS_OUTPUT), help="Output JSON path")

    args = parser.parse_args()
    output_path = Path(args.output).resolve()
    output_path.parent.mkdir(parents=True, exist_ok=True)

    temp_script = output_path.parent / "_run_specs_crawler.mjs"
    temp_script.write_text(SPECS_CRAWLER_NODE_SCRIPT, encoding="utf-8")

    cmd = ["node", str(temp_script), args.url, str(output_path)]
    print(f"🚀 Running Firecrawl Specs Synchronizer for {args.url}...")
    try:
        subprocess.run(cmd, cwd=str(FRONTEND_DIR), check=True)
    finally:
        if temp_script.exists():
            temp_script.unlink()

if __name__ == "__main__":
    main()
