import fs from 'fs';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

function compare(p1, p2, name) {
  if (!fs.existsSync(p1) || !fs.existsSync(p2)) {
    console.log(name, ': file not found');
    return;
  }
  const img1 = PNG.sync.read(fs.readFileSync(p1));
  const img2 = PNG.sync.read(fs.readFileSync(p2));

  const w = Math.min(img1.width, img2.width);
  const h = Math.min(img1.height, img2.height);

  const c1 = new PNG({ width: w, height: h });
  const c2 = new PNG({ width: w, height: h });
  PNG.bitblt(img1, c1, 0, 0, w, h, 0, 0);
  PNG.bitblt(img2, c2, 0, 0, w, h, 0, 0);

  const diff = new PNG({ width: w, height: h });
  const mismatched = pixelmatch(c1.data, c2.data, diff.data, w, h, { threshold: 0.15 });

  const total = w * h;
  const matchPercent = ((total - mismatched) / total * 100).toFixed(2);
  console.log(`${name} Visual Match: ${matchPercent}% (${total - mismatched}/${total} px)`);
}

compare('.cache/visual-audit/card-remote.png', '.cache/visual-audit/card-local.png', 'Product Card');
compare('.cache/visual-audit/subbar-remote.png', '.cache/visual-audit/subbar-local.png', 'Sticky Subbar');
compare('.cache/visual-audit/catalog-remote.png', '.cache/visual-audit/catalog-local.png', 'Catalog Viewport');
