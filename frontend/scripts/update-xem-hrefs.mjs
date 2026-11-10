import fs from "fs";
import path from "path";

const targetFile = path.join(
  process.cwd(),
  "src",
  "components",
  "sites",
  "rog-asus",
  "RogProductHome.tsx"
);

let content = fs.readFileSync(targetFile, "utf8");

const XEM_HREFS = {
  "laptops-group": "/vn/laptops-group/allmodels",
  "keyboards-group": "/vn/keyboards/keyboards-series",
  "monitors-group": "/vn/monitors-group/allmodels",
  "motherboards-group": "/vn/motherboards-group/allmodels",
  "graphics-cards-group": "/vn/graphics-cards/graphics-cards-series",
  "power-supply-units-group": "/vn/power-supply-units-group/allmodels",
  "headsets-audio-group": "/vn/headsets-audio/headsets-series",
  "mice-mouse-pads-group": "/vn/mice-mouse-pads/mice-series",
  "cooling-group": "/vn/cooling/cpu-liquid-coolers-series",
  "gaming-handhelds-group": "/vn/gaming-handhelds/accessories-series",
  "phones-group": "/vn/phones-group/allmodels",
  "desktops-group": "/vn/desktops-group/allmodels",
  "cases-group": "/vn/cases-group/allmodels",
  "networking-group": "/vn/networking-group/allmodels",
  "external-graphics-docks-group": "/vn/external-graphics-docks-group/allmodels",
  "controllers-group": "/vn/controllers-group/allmodels",
  storage: "/vn/storage/rog-strix-arion-model",
  "apparel-bags-gear-group": "/vn/apparel-bags-gear/bags-series",
  "streaming-kits-group": "/vn/streaming-kits-group/allmodels",
  "protection-and-gadgets-group": "/vn/protection-and-gadgets/cases-and-protection-series",
  "docks-chargers-and-cables-group": "/vn/docks-chargers-and-cables/chargers-series",
  "rog-saga-group": "/vn/rog-saga/toys/rog-omni-figure-og",
};

let count = 0;
for (const [group, targetHref] of Object.entries(XEM_HREFS)) {
  const groupBlockRegex = new RegExp(
    `("${group}":\\s*\\{[\\s\\S]*?intro:\\s*\\{[\\s\\S]*?xemHref:\\s*")([^"]+)(")`,
    "g"
  );
  if (group === "storage") {
    const storageRegex = /(storage:\s*\{[\s\S]*?intro:\s*\{[\s\S]*?xemHref:\s*")([^"]+)(")/g;
    content = content.replace(storageRegex, (match, prefix, oldHref, suffix) => {
      count++;
      console.log(`Updated [storage] xemHref: ${oldHref} -> ${targetHref}`);
      return `${prefix}${targetHref}${suffix}`;
    });
  } else {
    content = content.replace(groupBlockRegex, (match, prefix, oldHref, suffix) => {
      count++;
      console.log(`Updated [${group}] xemHref: ${oldHref} -> ${targetHref}`);
      return `${prefix}${targetHref}${suffix}`;
    });
  }
}

fs.writeFileSync(targetFile, content);
console.log(`Updated ${count} xemHref links!`);

