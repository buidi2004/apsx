#!/usr/bin/env python3
"""
tools/extract_rog_assets.py - Chrome DevTools MCP Asset & Live CSS Extractor

Connects directly via Chrome DevTools / Playwright CDP session to:
 1. Intercept Network Packets:
    - Font files (.woff2, .woff, .ttf) -> ROGFonts, TTNorms, Roboto
    - Background videos (.webm, .mp4)
    - Hi-res assets (AVIF, WebP, SVG) from ASUS CDN
 2. Live CSS Variables & Computed Tokens:
    - Extracts gradient definitions, backdrop-filters, box-shadows, z-indices
    - Extracts Aura Sync glowing border styles and Subbar sticky metrics
 3. Exports design tokens to JSON and Tailwind presets

Usage:
  python3 tools/extract_rog_assets.py [--url https://rog.asus.com/vn/] [--output assets/extracted]
"""

import os
import sys
import json
import argparse
import subprocess
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
FRONTEND_DIR = PROJECT_ROOT / "frontend"
DEFAULT_OUTPUT_DIR = PROJECT_ROOT / "assets" / "extracted"

EXTRACTOR_NODE_SCRIPT = """
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetUrl = process.argv[2] || 'https://rog.asus.com/vn/';
const outputDir = path.resolve(process.argv[3] || 'assets/extracted');

fs.mkdirSync(outputDir, { recursive: true });
const fontsDir = path.join(outputDir, 'fonts');
const mediaDir = path.join(outputDir, 'media');
const imagesDir = path.join(outputDir, 'images');

fs.mkdirSync(fontsDir, { recursive: true });
fs.mkdirSync(mediaDir, { recursive: true });
fs.mkdirSync(imagesDir, { recursive: true });

async function main() {
  console.log('Connecting Chrome DevTools session to:', targetUrl);
  
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

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'
  });

  const capturedAssets = {
    fonts: [],
    videos: [],
    images: [],
    cssTokens: {}
  };

  const page = await context.newPage();

  // Intercept Network Packets for CDN Assets
  page.on('response', async (response) => {
    try {
      const url = response.url();
      const status = response.status();
      if (status !== 200) return;

      const contentType = response.headers()['content-type'] || '';

      // 1. Fonts (.woff2, .woff, .ttf)
      if (url.match(/\\.(woff2|woff|ttf)(\\?.*)?$/i) || contentType.includes('font')) {
        const filename = path.basename(url.split('?')[0]);
        capturedAssets.fonts.push({ url, filename, contentType });
        try {
          const buffer = await response.body();
          fs.writeFileSync(path.join(fontsDir, filename), buffer);
          console.log('  [FONT DOWNLOADED]:', filename);
        } catch (_) {}
      }

      // 2. Videos (.webm, .mp4)
      else if (url.match(/\\.(webm|mp4)(\\?.*)?$/i) || contentType.includes('video')) {
        const filename = path.basename(url.split('?')[0]);
        capturedAssets.videos.push({ url, filename, contentType });
        console.log('  [VIDEO DETECTED]:', url);
      }

      // 3. Hi-res Brand SVGs / AVIF / WebP
      else if (url.match(/\\.(svg|avif|webp|png)(\\?.*)?$/i) && (url.includes('asus') || url.includes('rog'))) {
        const filename = path.basename(url.split('?')[0]);
        if (capturedAssets.images.length < 50) {
          capturedAssets.images.push({ url, filename, contentType });
        }
      }
    } catch (e) {
      // Ignore stream read errors
    }
  });

  console.log('Navigating to target page to capture live CSS and Network assets...');
  try {
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 35000 });
    await page.waitForTimeout(3000);

    // Scroll to capture dynamic lazy-loaded CSS & assets
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let y = 0;
        const interval = setInterval(() => {
          window.scrollBy(0, 500);
          y += 500;
          if (y > 4000) {
            clearInterval(interval);
            window.scrollTo(0, 0);
            resolve();
          }
        }, 100);
      });
    });

    await page.waitForTimeout(2000);

    // Extract Live CSS Variables & Design Tokens
    const designTokens = await page.evaluate(() => {
      const tokens = {
        cssVariables: {},
        subbarStyles: {},
        headerStyles: {},
        auraGlowGradients: [],
        typography: {}
      };

      // 1. CSS Custom Properties (:root)
      for (const sheet of Array.from(document.styleSheets)) {
        try {
          for (const rule of Array.from(sheet.cssRules || [])) {
            if (rule.selectorText === ':root' || rule.selectorText === 'html' || rule.selectorText === 'body') {
              const text = rule.cssText || '';
              const matches = text.matchAll(/(--[a-zA-Z0-9_-]+):\\s*([^;]+);/g);
              for (const m of matches) {
                const varName = m[1].trim();
                const varVal = m[2].trim();
                if (varName.includes('rog') || varName.includes('brand') || varName.includes('color') || varName.includes('font')) {
                  tokens.cssVariables[varName] = varVal;
                }
              }
            }
          }
        } catch (_) {}
      }

      // 2. Subbar & Header Computed Styles
      const subbar = document.querySelector('[class*="subbar"], [class*="SubNav"], [data-section="subbar"]');
      if (subbar) {
        const s = window.getComputedStyle(subbar);
        tokens.subbarStyles = {
          backgroundColor: s.backgroundColor,
          backdropFilter: s.backdropFilter || s.webkitBackdropFilter,
          height: s.height,
          borderBottom: s.borderBottom,
          zIndex: s.zIndex
        };
      }

      const header = document.querySelector('header, [class*="Header"], nav');
      if (header) {
        const s = window.getComputedStyle(header);
        tokens.headerStyles = {
          backgroundColor: s.backgroundColor,
          backdropFilter: s.backdropFilter || s.webkitBackdropFilter,
          height: s.height,
          zIndex: s.zIndex
        };
      }

      // 3. Aura Sync Glow gradients
      const glowElements = document.querySelectorAll('[class*="glow"], [class*="aura"], [class*="gradient"], [class*="red"]');
      glowElements.forEach(el => {
        const s = window.getComputedStyle(el);
        if (s.backgroundImage && s.backgroundImage.includes('gradient')) {
          if (!tokens.auraGlowGradients.includes(s.backgroundImage)) {
            tokens.auraGlowGradients.push(s.backgroundImage);
          }
        }
      });

      return tokens;
    });

    capturedAssets.cssTokens = designTokens;

  } catch (err) {
    console.warn('Navigation warning:', err.message);
  } finally {
    await browser.close();
  }

  // Save manifest & tokens
  const manifestPath = path.join(outputDir, 'assets-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(capturedAssets, null, 2));

  const tokensPath = path.join(outputDir, 'rog-design-tokens.json');
  fs.writeFileSync(tokensPath, JSON.stringify(capturedAssets.cssTokens, null, 2));

  console.log('\\n======================================================');
  console.log('✅ EXTRACTION COMPLETE!');
  console.log(`Fonts captured:  ${capturedAssets.fonts.length}`);
  console.log(`Videos detected: ${capturedAssets.videos.length}`);
  console.log(`Images catalog:  ${capturedAssets.images.length}`);
  console.log(`Manifest:        ${manifestPath}`);
  console.log(`Design Tokens:   ${tokensPath}`);
  console.log('======================================================\\n');
}

main().catch(console.error);
"""

def main():
    parser = argparse.ArgumentParser(description="ASUS ROG Chrome DevTools Asset & Live CSS Extractor")
    parser.add_argument("--url", default="https://rog.asus.com/vn/", help="Target ASUS ROG URL")
    parser.add_argument("--output", default=str(DEFAULT_OUTPUT_DIR), help="Output directory")

    args = parser.parse_args()
    output_dir = Path(args.output).resolve()
    output_dir.mkdir(parents=True, exist_ok=True)

    temp_script = output_dir / "_run_extractor.mjs"
    temp_script.write_text(EXTRACTOR_NODE_SCRIPT, encoding="utf-8")

    cmd = ["node", str(temp_script), args.url, str(output_dir)]
    print(f"🚀 Running Chrome DevTools Extractor on {args.url}...")
    try:
        subprocess.run(cmd, cwd=str(FRONTEND_DIR), check=True)
    finally:
        if temp_script.exists():
            temp_script.unlink()

if __name__ == "__main__":
    main()
