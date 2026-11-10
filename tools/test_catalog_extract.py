import os, glob, json, re, sqlite3

files = glob.glob("ai-website-cloner-template/.cache/rog-catalog/*.json")
print(f"Total files in cache: {len(files)}")

# Map base slug -> { "overview": path, "spec": path }
products_map = {}

for f in files:
    fname = os.path.basename(f)
    if any(x in fname for x in ["tag_", "articles.json", "content", "support", "rog-intelligent-cooling", "rog-nebula-display-hdr"]):
        continue
    
    is_spec = "_spec.json" in fname
    is_helpdesk = "_helpdesk.json" in fname
    is_award = "_award.json" in fname
    is_gallery = "_gallery.json" in fname
    is_wtb = fname.endswith("_wtb.json") or "/wtb" in fname
    
    clean_name = fname.replace("_spec.json", "").replace("_helpdesk.json", "").replace("_award.json", "").replace("_gallery.json", "").replace("_wtb.json", "").replace(".json", "")
    slug = clean_name.replace("_", "/")
    
    if slug not in products_map:
        products_map[slug] = {}
        
    if is_spec:
        products_map[slug]["spec"] = f
    elif not (is_helpdesk or is_award or is_gallery or is_wtb):
        products_map[slug]["overview"] = f

print(f"Unique product slugs identified: {len(products_map)}")
