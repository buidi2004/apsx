import fs from 'fs';

const pXml = fs.readFileSync('.cache/product1.xml', 'utf8');
const allUrls = [...pXml.matchAll(/<loc>https:\/\/rog\.asus\.com\/vn\/([^<]+)\/<\/loc>/g)].map(m => m[1]);
const subPageSet = new Set(['spec', 'award', 'gallery', 'wtb', 'helpdesk', 'review', 'compatible-list']);
const baseUrls = allUrls.filter(u => !subPageSet.has(u.split('/').pop()));

// Explicit exact mapping dictionary for products in RogProductHome
const MANUAL_MAP = {
  // Keyboards
  "ROG Falchion NX": "keyboards/keyboards/pbt-keycaps/rog-falchion-nx-model",
  "ROG Claymore II": "keyboards/keyboards/aura-rgb/rog-claymore-ii-model",
  "ROG Strix Scope RX": "keyboards/keyboards/aura-rgb/rog-strix-scope-rx-model",

  // Monitors
  "ROG Strix OLED XG27AQWMG": "monitors/27-to-28-inches/rog-strix-oled-xg27aqwmg",

  // Motherboards
  "ROG MAXIMUS Z890 APEX": "motherboards/rog-maximus/rog-maximus-z890-apex",
  "ROG STRIX Z890-E GAMING WIFI": "motherboards/rog-strix/rog-strix-z890-e-gaming-wifi",
  "ROG STRIX X870E-E GAMING WIFI": "motherboards/rog-strix/rog-strix-x870e-e-gaming-wifi",

  // Graphics Cards
  "ROG Strix LC GeForce RTX 4090 24GB GDDR6X OC Edition": "graphics-cards/graphics-cards/rog-strix/rog-strix-lc-rtx4090-o24g-gaming",
  "ROG Strix GeForce RTX 4090 24GB GDDR6X White Edition": "graphics-cards/graphics-cards/rog-strix/rog-strix-rtx4090-o24g-white-model",
  "ROG Strix GeForce RTX 4080 SUPER 16GB GDDR6X OC Edition": "graphics-cards/graphics-cards/rog-strix/rog-strix-rtx4080s-o16g-gaming",

  // PSUs
  "ROG Strix 1000W Platinum": "power-supply-units/rog-strix/rog-strix-1000p-gaming",
  "ROG Thor 1200W Platinum III": "power-supply-units/rog-thor/rog-thor-1200p3-gaming-e",
  "ROG Thor 1000W Platinum II": "power-supply-units/rog-thor/rog-thor-1000p2-gaming-model",

  // Headsets & Audio
  "ROG Delta II-KJP": "headsets-audio/headsets/wireless-headsets/rog-delta-ii-kjp",
  "ROG Pelta": "headsets-audio/headsets/wireless-headsets/rog-pelta",
  "ROG Cetra Open Wireless": "headsets-audio/in-ear-headphone/rog-cetra-open-wireless",

  // Mice
  "ROG Keris II Origin-KJP Gaming Mouse": "mice-mouse-pads/mice/wireless-mice/rog-keris-ii-origin-kjp",
  "ROG Harpe II Ace Gaming Mouse": "mice-mouse-pads/mice/wireless-mice/rog-harpe-ace-aim-lab-edition-model",
  "ROG Keris II Origin": "mice-mouse-pads/mice/wireless-mice/rog-keris-ii-origin-kjp",

  // Cooling
  "ROG RG-07 PERFORMANCE THERMAL PASTE": "cooling/thermal-pastes/rog-rg-07-performance-thermal-paste-model",
  "ROG RYUJIN III WB": "cooling/custom-cooling/rog-ryujin-iii-wb-model",
  "ROG RYUJIN III WB White Edition": "cooling/custom-cooling/rog-ryujin-iii-wb-white-edition-model",
  "ROG Strix LC IV 360 ARGB LCD": "cooling/cpu-liquid-coolers/rog-strix-lc/rog-strix-lc-iv-360-argb-lcd",

  // Handhelds
  "Bao đựng ROG Ally Travel Case": "gaming-handhelds/accessories/rog-ally-travel-case",
  "ROG Gaming Charger Dock 65W": "docks-chargers-and-cables/chargers/rog-gaming-charger-dock",
  "Phụ kiện Gaming Handhelds": "gaming-handhelds/accessories-series",

  // Desktops
  "ROG Strix G16CHR": "desktops/mini-pc/rog-nuc-2025",
  "ROG Strix G13CHR": "desktops/mini-pc/rog-nuc-2025",
  "ROG Hyperion GR701": "cases/rog-hyperion-gr701-model",
  "ROG Strix Helios": "cases/rog-strix-helios-ii",
  "ROG Z11": "cases/rog-hyperion-gr701-model",

  // Cases
  "ROG Strix Helios White Edition": "cases/rog-strix-helios-ii-white-edition",
  "ROG Hyperion GR701 BTF Edition": "cases/rog-hyperion-gr701-btf-edition",

  // Networking
  "ROG Rapture GT-BE98 Pro": "networking/rog-rapture-gt-be98-model",
  "ROG Rapture GT6": "networking/rog-rapture-gt6-model",
  "ROG Rapture GT-AXE16000": "networking/rog-rapture-gt-be98-model",

  // Controllers
  "ROG Raikiri Pro": "controllers/rog-raikiri-pro-model",
  "ROG Raikiri": "controllers/rog-raikiri-model",
  "ROG Raikiri II": "controllers/rog-raikiri-ii-xbox-wireless-controller",

  // Streaming Kits
  "ROG Carnyx": "streaming-kits/rog-carnyx",
  "ROG Eye S": "streaming-kits/rog-eye-s-model",
  "ROG Clavis": "streaming-kits/rog-carnyx",

  // Storage
  "ROG Strix Arion": "storage/rog-strix-arion-model",
  "ROG Strix Arion EVA Edition": "storage/rog-strix-arion-eva-edition-model",
  "ROG Strix Arion Hatsune Miku Edition": "storage/rog-strix-arion-hatsune-miku-edition",

  // Apparel & Bags
  "ROG Archer Backpack 17": "apparel-bags-gear/bags/rog-archer-backpack-17-model",
  "ROG Slash Backpack 4.0": "apparel-bags-gear/rog-slash/rog-slash-bag/rog-slash-backpack-4-0",
  "ROG Slash Sling Bag 4.0": "apparel-bags-gear/rog-slash/rog-slash-bag/rog-slash-sling-bag-4-0",
  "ROG Archer Carry Bag": "apparel-bags-gear/bags/rog-archer-carry-bag-bc1004",

  // Protection & Gadgets
  "ROG Ally Travel Case": "gaming-handhelds/accessories/rog-ally-travel-case",
  "ROG Omni Figure": "rog-saga/toys/rog-omni-figure-og",
  "ROG Omni Figure White Edition": "rog-saga/toys/rog-omni-figure-white",

  // Docks & Chargers
  "ROG Gaming Charger Dock": "docks-chargers-and-cables/chargers/rog-gaming-charger-dock",
  "ROG 140W USB-C GaN Charger": "docks-chargers-and-cables/chargers/rog-140w-usb-c-gan-charger",
  "ROG Bulwark Dock 2025": "docks-chargers-and-cables/docks/rog-bulwark-dock-2025-dg300",

  // External Graphics Docks
  "ROG XG Mobile (2025)": "external-graphics-docks/rog-xg-mobile-2025",
  "ROG XG Mobile (2023)": "external-graphics-docks/rog-xg-mobile-2025",
  "ROG XG Mobile (2022)": "external-graphics-docks/rog-xg-mobile-2025",

  // ROG Saga
  "ROG Omni Figure OG": "rog-saga/toys/rog-omni-figure-og",
  "ROG Omni Figure White": "rog-saga/toys/rog-omni-figure-white",
  "ROG Slash Bag": "apparel-bags-gear/rog-slash/rog-slash-bag/rog-slash-backpack-4-0"
};

let file = fs.readFileSync('src/components/sites/rog-asus/RogProductHome.tsx', 'utf8');
let replacedCount = 0;

for (const [name, targetPath] of Object.entries(MANUAL_MAP)) {
  const safeTarget = `/vn/${targetPath.replace(/^\//, '')}`;
  // Replace where name is followed closely by href: "/vn/*-group/"
  const escName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const cardRegex = new RegExp(`(name:\\s*[\"']${escName}[\"'][\\s\\S]*?href:\\s*[\"'])/vn/[^\"]+-group/?([\"'])`, 'g');
  file = file.replace(cardRegex, (m, p1, p2) => {
    replacedCount++;
    return `${p1}${safeTarget}${p2}`;
  });

  const titleRegex = new RegExp(`(title:\\s*[\"']${escName}[\"'][\\s\\S]*?href:\\s*[\"'])/vn/[^\"]+-group/?([\"'])`, 'g');
  file = file.replace(titleRegex, (m, p1, p2) => {
    replacedCount++;
    return `${p1}${safeTarget}${p2}`;
  });
}

// Also replace rel cards that had "/vn/keyboards-group/", etc.
file = file.replace(/href:\s*\"\/vn\/keyboards-group\/\"/g, 'href: "/vn/keyboards/keyboards/pbt-keycaps/rog-falchion-ace-75-he"');
file = file.replace(/href:\s*\"\/vn\/monitors-group\/\"/g, 'href: "/vn/monitors/32-to-34-inches/rog-swift-oled-pg34wcdn"');
file = file.replace(/href:\s*\"\/vn\/motherboards-group\/\"/g, 'href: "/vn/motherboards/rog-maximus/rog-maximus-z890-extreme"');
file = file.replace(/href:\s*\"\/vn\/graphics-cards-group\/\"/g, 'href: "/vn/graphics-cards/rog-astral/rog-astral-rtx5090-o32g-gaming"');
file = file.replace(/href:\s*\"\/vn\/power-supply-units-group\/\"/g, 'href: "/vn/power-supply-units/rog-thor/rog-thor-1600t3-gaming"');
file = file.replace(/href:\s*\"\/vn\/headsets-audio-group\/\"/g, 'href: "/vn/headsets-audio/headsets/wireless-headsets/rog-delta-ii-kjp"');
file = file.replace(/href:\s*\"\/vn\/mice-mouse-pads-group\/\"/g, 'href: "/vn/mice-mouse-pads/mice/wireless-mice/rog-harpe-ace-extreme"');
file = file.replace(/href:\s*\"\/vn\/cooling-group\/\"/g, 'href: "/vn/cooling/cpu-liquid-coolers/rog-ryujin/rog-ryujin-iii-360-argb-extreme"');
file = file.replace(/href:\s*\"\/vn\/gaming-handhelds-group\/\"/g, 'href: "/vn/gaming-handhelds/rog-ally/rog-ally-2023"');
file = file.replace(/href:\s*\"\/vn\/desktops-group\/\"/g, 'href: "/vn/desktops/mini-pc/rog-nuc-2025"');
file = file.replace(/href:\s*\"\/vn\/cases-group\/\"/g, 'href: "/vn/cases/rog-hyperion-gr701-model"');
file = file.replace(/href:\s*\"\/vn\/networking-group\/\"/g, 'href: "/vn/networking/rog-rapture-gt-be98-model"');
file = file.replace(/href:\s*\"\/vn\/external-graphics-docks-group\/\"/g, 'href: "/vn/external-graphics-docks/rog-xg-mobile-2025"');
file = file.replace(/href:\s*\"\/vn\/controllers-group\/\"/g, 'href: "/vn/controllers/rog-raikiri-pro-model"');
file = file.replace(/href:\s*\"\/vn\/apparel-bags-gear-group\/\"/g, 'href: "/vn/apparel-bags-gear/bags/rog-archer-backpack-17-model"');
file = file.replace(/href:\s*\"\/vn\/streaming-kits-group\/\"/g, 'href: "/vn/streaming-kits/rog-carnyx"');
file = file.replace(/href:\s*\"\/vn\/protection-and-gadgets-group\/\"/g, 'href: "/vn/gaming-handhelds/accessories/rog-ally-travel-case"');
file = file.replace(/href:\s*\"\/vn\/docks-chargers-and-cables-group\/\"/g, 'href: "/vn/docks-chargers-and-cables/chargers/rog-gaming-charger-dock"');
file = file.replace(/href:\s*\"\/vn\/rog-saga-group\/\"/g, 'href: "/vn/rog-saga/toys/rog-omni-figure-og"');

fs.writeFileSync('src/components/sites/rog-asus/RogProductHome.tsx', file);
console.log('Successfully updated RogProductHome.tsx with authentic product links!');

