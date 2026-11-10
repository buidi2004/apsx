const fs = require('fs');
const path = require('path');

const allyHtmlPath = path.resolve(__dirname, '../rog-ally-2023/ally-html.ts');
const { ALLY_FEATURES_HTML } = require(allyHtmlPath);

console.log('Original length:', ALLY_FEATURES_HTML.length);

let html = ALLY_FEATURES_HTML;

// 1. Fix relative /images/medium/1x/pic_kv.jpg
html = html.replace(
  /\/images\/medium\/1x\/pic_kv\.jpg/g,
  'https://dlcdnwebimgs.asus.com/files/media/92A296C4-BA56-40C2-A462-AE2729261A0B/main/v2/images/medium/1x/pic_kv.jpg'
);

// 2. Hydrate all <img> tags that have data-src but no real src attribute
let hydratedImgs = 0;
html = html.replace(/<img\b([^>]*?)>/gi, (match, attrs) => {
  const dataSrcMatch = attrs.match(/\bdata-src=[\"\']([^\"\']+)[\"\']/);
  const hasSrc = /\s+src=[\"\'][^\"\']*[\"\']/.test(attrs);
  
  if (dataSrcMatch && !hasSrc) {
    hydratedImgs++;
    return `<img src="${dataSrcMatch[1]}"${attrs}>`;
  }
  return match;
});
console.log('Hydrated images with src:', hydratedImgs);

// 3. Hydrate any img data-srcset without real srcset
let hydratedSrcsets = 0;
html = html.replace(/<img\b([^>]*?)>/gi, (match, attrs) => {
  const dataSrcsetMatch = attrs.match(/\bdata-srcset=[\"\']([^\"\']+)[\"\']/);
  const hasSrcset = /\s+srcset=[\"\'][^\"\']*[\"\']/.test(attrs);
  
  if (dataSrcsetMatch && !hasSrcset) {
    hydratedSrcsets++;
    return `<img srcset="${dataSrcsetMatch[1]}"${attrs}>`;
  }
  return match;
});
console.log('Hydrated img srcsets:', hydratedSrcsets);

// 4. Split into ALLY_TOP_HTML and ALLY_BOTTOM_HTML around section__pd beforeAward
const splitMarker = '<div class="section__pd">';
const splitIdx = html.indexOf(splitMarker);
if (splitIdx === -1) {
  throw new Error('Could not find ' + splitMarker);
}

const multiUsesMarker = '<section class="section__base section__multi-uses';
const multiUsesIdx = html.indexOf(multiUsesMarker);
if (multiUsesIdx === -1) {
  throw new Error('Could not find ' + multiUsesMarker);
}

const topHtml = html.substring(0, splitIdx).trim();
const bottomHtml = html.substring(multiUsesIdx).trim();

console.log('Top HTML length:', topHtml.length);
console.log('Bottom HTML length:', bottomHtml.length);

// Generate new ally-html.ts
const fileContent = `// Auto-generated & optimized for 100% pixel-perfect render with 0 black gaps
export const ALLY_TOP_HTML: string = ${JSON.stringify(topHtml)};

export const ALLY_BOTTOM_HTML: string = ${JSON.stringify(bottomHtml)};

export const ALLY_FEATURES_HTML: string = ${JSON.stringify(html)};
`;

fs.writeFileSync(allyHtmlPath, fileContent, 'utf8');
console.log('Successfully wrote updated ally-html.ts!');
