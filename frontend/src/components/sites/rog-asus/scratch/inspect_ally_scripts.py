import re

with open("/tmp/ally-2023.html", "r", encoding="utf-8") as f:
    html = f.read()

# Find scripts
scripts = re.findall(r'<script[^>]*src=[\"\x27]([^\"]+)[\"\x27]', html)
print("Scripts:")
for s in scripts:
    print(" ", s)

# Check inline scripts
inline_scripts = re.findall(r'<script(?![^>]*src=)[^>]*>(.*?)</script>', html, re.S)
print(f"Inline scripts: {len(inline_scripts)}")
for i, s in enumerate(inline_scripts):
    if len(s.strip()) > 50:
        print(f"--- Inline #{i} (len: {len(s)}) ---")
        print(s.strip()[:300])

# Find features container start and end
feat_start = html.find('id="ASUS-features"')
if feat_start == -1:
    feat_start = html.find('class="ASUS-importer"')
if feat_start == -1:
    feat_start = html.find('class="features_container"')
print("Features start at:", feat_start)

awards_pos = html.find('ProductOverviewAwards')
print("Awards pos:", awards_pos)

