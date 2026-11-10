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

const NAME_TO_HREF = {
  "ROG Claymore II": "/vn/keyboards/keyboards/aura-rgb/rog-claymore-ii-model",
  "ROG Strix Scope RX": "/vn/keyboards/keyboards/aura-rgb/rog-strix-scope-rx-model",
  "ROG Strix OLED XG27AQWMG": "/vn/monitors/27-to-31-5-inches/rog-strix-oled-xg27aqwmg",
  "ROG Gaming Monitor": "/vn/monitors/23-to-24-5-inches/rog-strix-xg258q-model",
  "ROG Strix GeForce RTX™ 5070 Ti 16GB GDDR7 OC Edition": "/vn/graphics-cards/graphics-cards/rog-strix/rog-strix-rtx5070ti-o16g-gaming",
  "ROG Thor 1200W Platinum III (ROG Equalizer)": "/vn/power-supply-units/rog-thor/rog-thor-1200p3-gaming-e",
  "ROG Thor 1200W Platinum III White Edition (ROG Equalizer)": "/vn/power-supply-units/rog-thor/rog-thor-1200p3-white-gaming-e",
  "ROG Thor 3000W Titanium III Edition 20 (ROG Equalizer)": "/vn/power-supply-units/rog-thor/ROG-THOR-3000T3-GAMING-EDITION-20",
  "ROG Delta II-KJP Gaming Headset": "/vn/headsets-audio/headsets/3-5mm-headsets/rog-delta-ii-kjp",
  "ROG Pelta Gaming Headset": "/vn/headsets-audio/headsets/wireless-headsets/rog-pelta",
  "ROG Delta II": "/vn/headsets-audio/headsets/wireless-headsets/rog-delta-ii",
  "ROG Keris II Origin-KJP Gaming Mouse": "/vn/mice-mouse-pads/mice/ergonomic-right-handed/rog-keris-ii-origin-kjp",
  "ROG Harpe II Ace Gaming Mouse": "/vn/mice-mouse-pads/mice/ambidextrous/rog-harpe-ace-extreme",
  "ROG Keris II Origin": "/vn/mice-mouse-pads/mice/wireless/rog-keris-ii-origin",
  "ROG RG-07 PERFORMANCE THERMAL PASTE": "/vn/cooling/thermal-pastes/rog-rg-07-performance-thermal-paste",
  "ROG RYUJIN III WB": "/vn/cooling/custom-cooling/ryujin/rog-ryujin-iii-wb",
  "ROG RYUJIN III WB White Edition": "/vn/cooling/custom-cooling/ryujin/rog-ryujin-iii-wb-white-edition",
  "ROG Strix LC IV 360 ARGB LCD": "/vn/cooling/cpu-liquid-coolers/rog-strix-lc/rog-strix-lc-iv-360-argb-lcd",
};

let count = 0;
for (const [name, newHref] of Object.entries(NAME_TO_HREF)) {
  const regex = new RegExp(`(name:\\s*"${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[\\s\\S]*?href:\\s*")(\\/vn\\/[^"]+)(")`, "g");
  content = content.replace(regex, (match, prefix, oldHref, suffix) => {
    count++;
    console.log(`Updated [${name}]: ${oldHref} -> ${newHref}`);
    return `${prefix}${newHref}${suffix}`;
  });
}

fs.writeFileSync(targetFile, content);
console.log(`Updated ${count} links!`);

