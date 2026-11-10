import os, glob, json, re, sqlite3
from datetime import datetime
from html.parser import HTMLParser

class TextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.texts = []
        self.imgs = []
        self.links = []

    def handle_starttag(self, tag, attrs):
        attr_dict = dict(attrs)
        if tag == "img" and "src" in attr_dict:
            src = attr_dict["src"]
            if "dlcdn" in src or "asus.com" in src or "/sites/" in src:
                self.imgs.append(src)
        if tag == "a" and "href" in attr_dict:
            href = attr_dict["href"]
            if "store.asus.com" in href:
                self.links.append(href)

    def handle_data(self, data):
        d = data.strip()
        if d:
            self.texts.append(d)

def clean_title(title):
    if not title:
        return ""
    # Split by pipes or dashes
    parts = re.split(r"\s*[|｜]\s*", title)
    name = parts[0].strip()
    return name

def determine_category(slug):
    slug_lower = slug.lower()
    mapping = [
        ("laptop", "laptops-group"),
        ("motherboard", "motherboards-group"),
        ("graphics-card", "graphics-cards-group"),
        ("monitor", "monitors-group"),
        ("phone", "phones-group"),
        ("desktop", "desktops-group"),
        ("power-supply", "power-supply-units-group"),
        ("case", "cases-group"),
        ("cooling", "cooling-group"),
        ("keyboard", "keyboards-group"),
        ("mice", "mice-mouse-pads-group"),
        ("headset", "headsets-audio-group"),
        ("gaming-handheld", "gaming-handhelds-group"),
        ("external-graphics", "external-graphics-docks-group"),
        ("streaming", "streaming-kits-group"),
        ("controller", "controllers-group"),
        ("storage", "storage-group"),
        ("apparel", "apparel-bags-gear-group"),
        ("protection", "protection-and-gadgets-group"),
        ("dock", "docks-chargers-and-cables-group"),
        ("rog-saga", "rog-saga-group"),
        ("networking", "networking-group"),
    ]
    for key, cat in mapping:
        if key in slug_lower:
            return cat
    return "laptops-group"

def main():
    db_path = "RogAdmin/src/RogAdmin.Api/rogadmin-dev.db"
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()

    # Get existing slugs
    cur.execute("SELECT Slug FROM Products;")
    existing_slugs = set(row[0] for row in cur.fetchall())
    print(f"Existing products in DB: {len(existing_slugs)}")

    files = glob.glob("ai-website-cloner-template/.cache/rog-catalog/*.json")
    products_map = {}

    for f in files:
        fname = os.path.basename(f)
        if any(x in fname for x in ["tag_", "articles.json", "content", "support", "rog-intelligent-cooling", "rog-nebula-display-hdr"]):
            continue

        is_spec = "_spec.json" in fname
        clean_name = fname.replace("_spec.json", "").replace("_helpdesk.json", "").replace("_award.json", "").replace("_gallery.json", "").replace("_wtb.json", "").replace(".json", "")
        slug = clean_name.replace("_", "/")

        if slug not in products_map:
            products_map[slug] = {}

        if is_spec:
            products_map[slug]["spec"] = f
        elif not any(x in fname for x in ["_helpdesk", "_award", "_gallery", "_wtb"]):
            products_map[slug]["overview"] = f

    print(f"Discovered unique catalog items: {len(products_map)}")

    imported_count = 0
    specs_count = 0
    now_str = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")

    for slug, paths in products_map.items():
        if slug in existing_slugs:
            continue

        overview_path = paths.get("overview")
        spec_path = paths.get("spec")
        if not overview_path and not spec_path:
            continue

        title = ""
        main_html = ""
        target_path = overview_path or spec_path
        try:
            with open(target_path, "r", encoding="utf-8") as fp:
                data = json.load(fp)
                title = data.get("title", "")
                main_html = data.get("mainHtml", "")
        except Exception:
            continue

        product_name = clean_title(title)
        if not product_name or len(product_name) < 3:
            # Fallback from slug
            raw = slug.split("/")[-1]
            product_name = raw.replace("-model", "").replace("-", " ").title()

        extractor = TextExtractor()
        extractor.feed(main_html)

        # Extract price
        price = 0.0
        old_price = None
        discount_label = ""
        for t in extractor.texts:
            m = re.search(r"(\d{1,3}(?:\.\d{3})+)\s*₫", t)
            if m:
                p_val = float(m.group(1).replace(".", ""))
                if p_val > 50000: # reasonable VND price
                    price = p_val
                    break

        thumbnail = extractor.imgs[0] if extractor.imgs else "/sites/rog-asus/img/products/laptop-gaming.webp"
        store_url = extractor.links[0] if extractor.links else "/vn/where-to-buy"
        cat_slug = determine_category(slug)
        base_path = f"/vn/{slug}"
        model_code = slug.split("/")[-1].upper()
        tagline = f"Sản phẩm gaming cao cấp chính hãng Republic of Gamers — {product_name}"

        # Insert Product
        cur.execute("""
            INSERT INTO Products (Slug, Name, CategorySlug, ModelCode, Tagline, ThumbnailUrl, KeyVisualUrl, BasePath, SubBarType, IsHot, IsFeatured, IsActive, CreatedAt, UpdatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, (slug, product_name, cat_slug, model_code, tagline, thumbnail, thumbnail, base_path, "standard", 0, 0, 1, now_str, None))
        
        prod_id = cur.lastrowid
        imported_count += 1

        # Insert Price
        stock_status = 0 # InStock
        cur.execute("""
            INSERT INTO ProductPrices (ProductId, Price, OldPrice, Currency, DiscountLabel, StockStatus, StoreUrl, LastCheckedAt, CreatedAt, UpdatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, (prod_id, str(price), str(old_price) if old_price else None, "VND", discount_label, stock_status, store_url, now_str, now_str, None))

        # Specs extraction
        # If spec file available, parse specs
        if spec_path:
            try:
                with open(spec_path, "r", encoding="utf-8") as sfp:
                    sdata = json.load(sfp)
                    shtml = sdata.get("mainHtml", "")
                    sextractor = TextExtractor()
                    sextractor.feed(shtml)
                    # pair consecutive non-empty texts as spec key-value if plausible
                    order = 1
                    for idx in range(len(sextractor.texts) - 1):
                        k = sextractor.texts[idx]
                        v = sextractor.texts[idx + 1]
                        if 2 < len(k) < 50 and 2 < len(v) < 200 and not any(skip in k.lower() for skip in ["menu", "giá", "thông số", "tính năng", "bộ lọc", "đóng"]):
                            cur.execute("""
                                INSERT INTO ProductSpecs (ProductId, SpecGroup, SpecKey, SpecValue, OrderIndex, CreatedAt, UpdatedAt)
                                VALUES (?, ?, ?, ?, ?, ?, ?);
                            """, (prod_id, "Thông số kỹ thuật", k, v, order, now_str, None))
                            specs_count += 1
                            order += 1
                            if order > 8: # keep top 8 specs
                                break
            except Exception:
                pass

        if imported_count % 100 == 0:
            conn.commit()
            print(f"Imported {imported_count} products so far...")

    conn.commit()
    print(f"SUCCESS! Finished importing {imported_count} products and {specs_count} specs into SQLite!")

    cur.execute("SELECT COUNT(*) FROM Products;")
    total_p = cur.fetchone()[0]
    cur.execute("SELECT COUNT(*) FROM ProductSpecs;")
    total_s = cur.fetchone()[0]
    print(f"Total Products in DB now: {total_p}, Total Specs: {total_s}")

    conn.close()

if __name__ == "__main__":
    main()
