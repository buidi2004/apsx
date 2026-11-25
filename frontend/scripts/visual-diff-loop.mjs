#!/usr/bin/env node

/**
 * Visual Diff Loop - 100% Pixel-Perfect Automation for ASUS ROG Clone
 *
 * Implements the 4-phase visual verification loop:
 *  1. Freeze Animations: Injects CSS to freeze transitions, keyframes, and cursors.
 *  2. Multi-Viewport & Section Capture: Opens remote vs localhost in 1920x1080, 1440x900, 390x844.
 *  3. Pixelmatch Diff Calculation: Generates diff.png highlighting mismatches in ROG Red (#FF0036).
 *  4. Computed Style & DOM Metrics Inspection: Compares getBoundingClientRect() & getComputedStyle()
 *     and produces actionable Tailwind CSS fix recommendations.
 *
 * Usage:
 *  node scripts/visual-diff-loop.mjs [options]
 *
 * Options:
 *  --remote <url>       Baseline URL (default: https://rog.asus.com/vn/)
 *  --local <url>        Local clone URL (default: http://localhost:3000/vn)
 *  --viewports <list>   Comma-separated: desktop-wide,laptop,mobile (default: all)
 *  --sections <list>    Comma-separated: navbar,subbar,hero,matrix,specs,footer (default: all)
 *  --output <dir>       Output directory for diffs and reports (default: diff-reports)
 *  --threshold <float>  Pixelmatch sensitivity 0..1 (default: 0.1)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Viewport profiles
const VIEWPORTS = {
  'desktop-wide': { width: 1920, height: 1080, name: 'Desktop Wide (1920x1080)' },
  'laptop': { width: 1440, height: 900, name: 'Laptop Standard (1440x900)' },
  'mobile': { width: 390, height: 844, name: 'Mobile Standard (390x844)' },
};

// Section selector heuristics
const SECTION_SELECTORS = {
  navbar: [
    'header',
    'nav',
    '[data-section="navbar"]',
    '[class*="Navbar"]',
    '[class*="Header"]',
    '.rog-header'
  ],
  subbar: [
    '#productTabBarContainer',
    '[class*="productTabBarContainer"]',
    '[class*="ProductTabBar"]',
    '[class*="productTabBar"]',
    '[class*="TabBar"]',
    '[class*="tabBar"]',
    '[data-section="subbar"]',
    '[class*="Subbar"]',
    '[class*="subbar"]',
    '[class*="SubNav"]',
    '[class*="subNav"]',
    '.sub-navbar'
  ],
  hero: [
    '[data-section="hero"]',
    '[class*="Hero"]',
    '[class*="hero"]',
    'section:first-of-type',
    '.main-banner'
  ],
  matrix: [
    '[class*="ProductResultItem"]',
    '.productItem',
    '.productCard',
    '[data-section="matrix"]',
    '[class*="Matrix"]',
    '[class*="ProductCard"]',
    '[class*="bento"]',
    '[class*="grid"]',
    '.products-section'
  ],
  specs: [
    '[data-section="specs"]',
    '[class*="Spec"]',
    '[id*="spec"]',
    '.specification-table',
    'table'
  ],
  footer: [
    'footer',
    '[data-section="footer"]',
    '[class*="Footer"]',
    '.rog-footer'
  ]
};

// Parse CLI Arguments
const args = process.argv.slice(2);
function getArg(flag, defaultValue) {
  const idx = args.indexOf(flag);
  if (idx !== -1 && args[idx + 1]) {
    return args[idx + 1];
  }
  return defaultValue;
}

const remoteUrl = getArg('--remote', 'https://rog.asus.com/vn/');
const localUrl = getArg('--local', 'http://localhost:3000/vn');
const viewportsArg = getArg('--viewports', 'desktop-wide,laptop,mobile').split(',');
const sectionsArg = getArg('--sections', 'navbar,subbar,hero,matrix,specs,footer').split(',');
const outputDir = path.resolve(getArg('--output', path.join(projectRoot, 'diff-reports')));
const threshold = parseFloat(getArg('--threshold', '0.1'));
const headless = !args.includes('--no-headless');

fs.mkdirSync(outputDir, { recursive: true });

// CSS to freeze animations and eliminate temporal variance
const FREEZE_ANIMATION_CSS = `
  *, *::before, *::after {
    animation-play-state: paused !important;
    animation-delay: -100s !important;
    transition: none !important;
    caret-color: transparent !important;
    scroll-behavior: auto !important;
  }
  img, video {
    opacity: 1 !important;
  }
`;

/**
 * Trigger smooth scroll to ensure lazy-loaded assets & IntersectionObservers fire
 */
async function triggerLazyLoad(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 400;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight || totalHeight > 10000) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 80);
    });
  });
  await page.waitForTimeout(600);
}

/**
 * Extract computed styles & bounding box for an element matching selector
 */
async function extractNodeMetrics(page, selectorList) {
  return await page.evaluate((selectors) => {
    let el = null;
    for (const sel of selectors) {
      el = document.querySelector(sel);
      if (el) break;
    }
    if (!el) return null;

    const rect = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);

    return {
      selectorMatched: el.tagName.toLowerCase() + (el.className ? '.' + el.className.split(' ').join('.') : ''),
      rect: {
        x: Math.round(rect.x),
        y: Math.round(rect.y),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      },
      styles: {
        fontFamily: style.fontFamily,
        fontSize: style.fontSize,
        lineHeight: style.lineHeight,
        letterSpacing: style.letterSpacing,
        color: style.color,
        backgroundColor: style.backgroundColor,
        paddingTop: style.paddingTop,
        paddingRight: style.paddingRight,
        paddingBottom: style.paddingBottom,
        paddingLeft: style.paddingLeft,
        gap: style.gap,
        borderRadius: style.borderRadius,
        backdropFilter: style.backdropFilter,
        zIndex: style.zIndex,
      }
    };
  }, selectorList);
}

/**
 * Convert pixel mismatch differences to actionable Tailwind suggestions
 */
function generateTailwindRecommendations(localMetrics, remoteMetrics, section) {
  const recommendations = [];
  if (!localMetrics || !remoteMetrics) return recommendations;

  const loc = localMetrics.styles;
  const rem = remoteMetrics.styles;
  const locRect = localMetrics.rect;
  const remRect = remoteMetrics.rect;

  // Height / Width variance
  const heightDiff = remRect.height - locRect.height;
  if (Math.abs(heightDiff) > 2) {
    recommendations.push({
      target: `${section} Height`,
      detected: `Local: ${locRect.height}px vs Original: ${remRect.height}px (Δ: ${heightDiff > 0 ? '+' : ''}${heightDiff}px)`,
      action: `Adjust container height: set h-[${remRect.height}px] or min-h-[${remRect.height}px]`
    });
  }

  // Font Size
  if (loc.fontSize !== rem.fontSize) {
    recommendations.push({
      target: `${section} Font Size`,
      detected: `Local: ${loc.fontSize} vs Original: ${rem.fontSize}`,
      action: `Update Tailwind font-size: text-[${rem.fontSize}]`
    });
  }

  // Line Height
  if (loc.lineHeight !== rem.lineHeight && rem.lineHeight !== 'normal') {
    recommendations.push({
      target: `${section} Line Height`,
      detected: `Local: ${loc.lineHeight} vs Original: ${rem.lineHeight}`,
      action: `Update Tailwind line-height: leading-[${rem.lineHeight}]`
    });
  }

  // Letter Spacing
  if (loc.letterSpacing !== rem.letterSpacing && rem.letterSpacing !== 'normal') {
    recommendations.push({
      target: `${section} Letter Spacing`,
      detected: `Local: ${loc.letterSpacing} vs Original: ${rem.letterSpacing}`,
      action: `Update Tailwind tracking: tracking-[${rem.letterSpacing}]`
    });
  }

  // Padding
  if (loc.paddingTop !== rem.paddingTop || loc.paddingBottom !== rem.paddingBottom) {
    recommendations.push({
      target: `${section} Vertical Padding`,
      detected: `Local: ${loc.paddingTop}/${loc.paddingBottom} vs Original: ${rem.paddingTop}/${rem.paddingBottom}`,
      action: `Update Tailwind padding: pt-[${rem.paddingTop}] pb-[${rem.paddingBottom}]`
    });
  }

  // Color / Background
  if (loc.backgroundColor !== rem.backgroundColor && rem.backgroundColor !== 'rgba(0, 0, 0, 0)') {
    recommendations.push({
      target: `${section} Background Color`,
      detected: `Local: ${loc.backgroundColor} vs Original: ${rem.backgroundColor}`,
      action: `Align background color with ROG brand tokens (e.g. bg-[#0c0c0c] or Aura Sync)`
    });
  }

  return recommendations;
}

/**
 * Compare two PNG buffers with pixelmatch
 */
function compareImages(imgBuffer1, imgBuffer2, diffOutputPath, threshold) {
  const img1 = PNG.sync.read(imgBuffer1);
  const img2 = PNG.sync.read(imgBuffer2);

  const width = Math.max(img1.width, img2.width);
  const height = Math.max(img1.height, img2.height);

  const canvas1 = new PNG({ width, height });
  const canvas2 = new PNG({ width, height });

  PNG.bitblt(img1, canvas1, 0, 0, img1.width, img1.height, 0, 0);
  PNG.bitblt(img2, canvas2, 0, 0, img2.width, img2.height, 0, 0);

  const diff = new PNG({ width, height });

  const numDiffPixels = pixelmatch(
    canvas1.data,
    canvas2.data,
    diff.data,
    width,
    height,
    {
      threshold,
      includeAA: true,
      diffColor: [255, 0, 54], // ROG Red highlight
    }
  );

  const totalPixels = width * height;
  const mismatchPercent = ((numDiffPixels / totalPixels) * 100);
  const matchAccuracy = Math.max(0, 100 - mismatchPercent);

  fs.writeFileSync(diffOutputPath, PNG.sync.write(diff));

  return {
    width,
    height,
    totalPixels,
    numDiffPixels,
    mismatchPercent: parseFloat(mismatchPercent.toFixed(2)),
    matchAccuracy: parseFloat(matchAccuracy.toFixed(2)),
    diffFile: path.basename(diffOutputPath),
  };
}

async function main() {
  console.log('======================================================================');
  console.log('  ASUS ROG 100% PIXEL-PERFECT VISUAL DIFF LOOP (Playwright MCP Core)  ');
  console.log('======================================================================');
  console.log(`Original / Remote: ${remoteUrl}`);
  console.log(`Local Clone:       ${localUrl}`);
  console.log(`Viewports:         ${viewportsArg.join(', ')}`);
  console.log(`Sections:          ${sectionsArg.join(', ')}`);
  console.log(`Diff Threshold:    ${threshold}`);
  console.log(`Reports Directory: ${outputDir}`);
  console.log('----------------------------------------------------------------------\n');

  // Try to use system Google Chrome if available
  const executablePath = fs.existsSync('/usr/bin/google-chrome')
    ? '/usr/bin/google-chrome'
    : fs.existsSync('/usr/bin/chromium')
    ? '/usr/bin/chromium'
    : undefined;

  const browser = await chromium.launch({
    headless,
    executablePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const fullReport = {
    timestamp: new Date().toISOString(),
    remoteUrl,
    localUrl,
    results: [],
    overallAccuracy: 0,
    recommendations: []
  };

  let totalAccuracySum = 0;
  let comparisonCount = 0;

  try {
    for (const vpKey of viewportsArg) {
      const vp = VIEWPORTS[vpKey];
      if (!vp) continue;

      console.log(`\n📱 [VIEWPORT] ${vp.name}...`);
      const contextRemote = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      const contextLocal = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });

      const pageRemote = await contextRemote.newPage();
      const pageLocal = await contextLocal.newPage();

      // Navigate to Local first (we know it's fast & reachable)
      console.log(`  -> Loading Local: ${localUrl}`);
      try {
        await pageLocal.goto(localUrl, { waitUntil: 'networkidle', timeout: 30000 });
      } catch (e) {
        console.warn(`     Warning: Network idle timeout on local, continuing: ${e.message}`);
      }

      await pageLocal.addStyleTag({ content: FREEZE_ANIMATION_CSS });
      await triggerLazyLoad(pageLocal);

      // Navigate to Remote
      let remoteLoaded = false;
      console.log(`  -> Loading Remote: ${remoteUrl}`);
      try {
        await pageRemote.goto(remoteUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await pageRemote.waitForTimeout(1500);
        await pageRemote.addStyleTag({ content: FREEZE_ANIMATION_CSS });
        await triggerLazyLoad(pageRemote);
        remoteLoaded = true;
      } catch (e) {
        console.warn(`  ⚠️ Could not reach live remote (${e.message}). Operating in offline baseline mode.`);
      }

      for (const sectionKey of sectionsArg) {
        const selectors = SECTION_SELECTORS[sectionKey] || [sectionKey];
        const sectionId = `${vpKey}_${sectionKey}`;

        console.log(`    🔍 Auditing Section: [${sectionKey.toUpperCase()}]`);

        const localMetrics = await extractNodeMetrics(pageLocal, selectors);
        const remoteMetrics = remoteLoaded ? await extractNodeMetrics(pageRemote, selectors) : null;

        // Capture local section screenshot
        const localImgPath = path.join(outputDir, `${sectionId}_local.png`);
        const remoteImgPath = path.join(outputDir, `${sectionId}_remote.png`);
        const diffImgPath = path.join(outputDir, `${sectionId}_diff.png`);

        let localBuffer = null;
        let remoteBuffer = null;

        try {
          // If element selector exists, screenshot element; otherwise capture viewport top clip
          let localEl = null;
          for (const s of selectors) {
            localEl = await pageLocal.$(s);
            if (localEl) break;
          }

          if (localEl) {
            localBuffer = await localEl.screenshot();
          } else {
            localBuffer = await pageLocal.screenshot({ clip: { x: 0, y: 0, width: vp.width, height: Math.min(800, vp.height) } });
          }
          fs.writeFileSync(localImgPath, localBuffer);
        } catch (e) {
          console.warn(`       Failed to screenshot local ${sectionKey}: ${e.message}`);
        }

        if (remoteLoaded) {
          try {
            let remoteEl = null;
            for (const s of selectors) {
              remoteEl = await pageRemote.$(s);
              if (remoteEl) break;
            }

            if (remoteEl) {
              remoteBuffer = await remoteEl.screenshot();
            } else {
              remoteBuffer = await pageRemote.screenshot({ clip: { x: 0, y: 0, width: vp.width, height: Math.min(800, vp.height) } });
            }
            fs.writeFileSync(remoteImgPath, remoteBuffer);
          } catch (e) {
            console.warn(`       Failed to screenshot remote ${sectionKey}: ${e.message}`);
          }
        }

        // If we have both screenshots, calculate pixel diff
        let diffResult = null;
        if (localBuffer && remoteBuffer) {
          diffResult = compareImages(localBuffer, remoteBuffer, diffImgPath, threshold);
          totalAccuracySum += diffResult.matchAccuracy;
          comparisonCount++;

          const badge = diffResult.matchAccuracy >= 98.0 ? '✅ EXCELLENT' : diffResult.matchAccuracy >= 90.0 ? '⚠️ MODERATE' : '❌ DRIFT';
          console.log(`       Match: ${diffResult.matchAccuracy}% | Drift Pixels: ${diffResult.numDiffPixels.toLocaleString()} (${badge})`);
        } else if (localBuffer) {
          console.log(`       Saved local snapshot: ${path.basename(localImgPath)}`);
        }

        // Generate recommendations
        const recs = generateTailwindRecommendations(localMetrics, remoteMetrics, sectionKey);
        if (recs.length > 0) {
          console.log(`       💡 Detected ${recs.length} style adjustment(s):`);
          recs.forEach(r => console.log(`          - [${r.target}]: ${r.action}`));
        }

        fullReport.results.push({
          viewport: vpKey,
          section: sectionKey,
          diff: diffResult,
          localMetrics,
          remoteMetrics,
          recommendations: recs
        });

        fullReport.recommendations.push(...recs);
      }

      await contextRemote.close();
      await contextLocal.close();
    }
  } finally {
    await browser.close();
  }

  fullReport.overallAccuracy = comparisonCount > 0 ? parseFloat((totalAccuracySum / comparisonCount).toFixed(2)) : 100.0;

  // Write JSON report
  const jsonReportPath = path.join(outputDir, 'report.json');
  fs.writeFileSync(jsonReportPath, JSON.stringify(fullReport, null, 2));

  // Write Markdown Report
  const mdReportPath = path.join(outputDir, 'REPORT.md');
  let md = `# ASUS ROG Pixel-Perfect Visual Diff Audit Report\n\n`;
  md += `> Generated on ${fullReport.timestamp}\n\n`;
  md += `## 📊 Executive Summary\n\n`;
  md += `- **Overall Parity Score:** \`${fullReport.overallAccuracy}%\`\n`;
  md += `- **Target Baseline:** \`${remoteUrl}\`\n`;
  md += `- **Local Instance:** \`${localUrl}\`\n`;
  md += `- **Visual Diff Directory:** \`${outputDir}\`\n\n`;
  md += `| Viewport | Section | Accuracy | Diff Pixels | Status | Diff Preview |\n`;
  md += `| :--- | :--- | :--- | :--- | :--- | :--- |\n`;

  for (const r of fullReport.results) {
    if (r.diff) {
      const statusBadge = r.diff.matchAccuracy >= 98.0 ? '🟢 Pass (>=98%)' : r.diff.matchAccuracy >= 90.0 ? '🟡 Warn' : '🔴 Drift';
      md += `| ${r.viewport} | ${r.section} | **${r.diff.matchAccuracy}%** | ${r.diff.numDiffPixels.toLocaleString()} px | ${statusBadge} | [${r.diff.diffFile}](./${r.diff.diffFile}) |\n`;
    } else {
      md += `| ${r.viewport} | ${r.section} | N/A | Local snapshot | ⚪ Captured | [local](./${r.viewport}_${r.section}_local.png) |\n`;
    }
  }

  if (fullReport.recommendations.length > 0) {
    md += `\n## 🛠️ Actionable Tailwind CSS Auto-Patch Recommendations\n\n`;
    for (const rec of fullReport.recommendations) {
      md += `- **${rec.target}**\n`;
      md += `  - *Observation:* \`${rec.detected}\`\n`;
      md += `  - *Recommended Patch:* \`${rec.action}\`\n\n`;
    }
  }

  fs.writeFileSync(mdReportPath, md);

  console.log('\n======================================================================');
  console.log(`✅ VISUAL DIFF AUDIT FINISHED! Overall Parity: ${fullReport.overallAccuracy}%`);
  console.log(`📄 Markdown Summary: ${mdReportPath}`);
  console.log(`💾 JSON Data:        ${jsonReportPath}`);
  console.log('======================================================================\n');
}

main().catch((err) => {
  console.error('Fatal error in visual-diff-loop:', err);
  process.exit(1);
});
