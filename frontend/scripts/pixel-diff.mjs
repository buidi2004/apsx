#!/usr/bin/env node

/**
 * Visual Pixel Diff Utility using pixelmatch & pngjs
 * Compares two PNG screenshots and highlights mismatched pixels in red.
 *
 * Usage:
 *   node scripts/pixel-diff.mjs <img1.png> <img2.png> [diff-output.png] [threshold]
 */

import fs from 'fs';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const [,, imgPath1, imgPath2, diffPath = 'diff.png', thresholdArg = '0.1'] = process.argv;

if (!imgPath1 || !imgPath2) {
  console.log('Usage: node scripts/pixel-diff.mjs <img1.png> <img2.png> [output-diff.png] [threshold=0.1]');
  process.exit(1);
}

if (!fs.existsSync(imgPath1)) {
  console.error(`Error: File not found: ${imgPath1}`);
  process.exit(1);
}
if (!fs.existsSync(imgPath2)) {
  console.error(`Error: File not found: ${imgPath2}`);
  process.exit(1);
}

const threshold = parseFloat(thresholdArg);

function readPNG(path) {
  return new Promise((resolve, reject) => {
    const png = new PNG();
    fs.createReadStream(path)
      .pipe(png)
      .on('parsed', function () {
        resolve(this);
      })
      .on('error', reject);
  });
}

async function run() {
  const [img1, img2] = await Promise.all([readPNG(imgPath1), readPNG(imgPath2)]);

  const width = Math.max(img1.width, img2.width);
  const height = Math.max(img1.height, img2.height);

  // Normalize images to same size if dimensions differ
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
  const diffPercent = ((numDiffPixels / totalPixels) * 100).toFixed(2);
  const matchPercent = (100 - parseFloat(diffPercent)).toFixed(2);

  fs.writeFileSync(diffPath, PNG.sync.write(diff));

  console.log('====================================');
  console.log('  PIXEL-PERFECT VISUAL DIFF REPORT  ');
  console.log('====================================');
  console.log(`Dimensions:     ${width} x ${height} px`);
  console.log(`Mismatch Count: ${numDiffPixels.toLocaleString()} px`);
  console.log(`Mismatch Rate:  ${diffPercent}%`);
  console.log(`Match Accuracy: ${matchPercent}%`);
  console.log(`Diff Image:     ${diffPath}`);
  console.log('====================================');

  if (parseFloat(matchPercent) >= 99.0) {
    console.log('✅ Visual verification PASSED (>= 99% match)!');
  } else {
    console.log('⚠️ Visual differences detected. Inspect red pixels in ' + diffPath);
  }
}

run().catch((err) => {
  console.error('Diff error:', err);
  process.exit(1);
});

