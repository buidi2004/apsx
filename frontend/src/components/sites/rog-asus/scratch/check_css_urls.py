import re

with open("ai-website-cloner-template/src/components/sites/rog-asus/rog-ally-2023/ally-style.css", "r", encoding="utf-8") as f:
    css = f.read()

urls = re.findall(r"url\(([^)]+)\)", css)
print("Total url() in css:", len(urls))
rel_urls = []
for u in set(urls):
    clean = u.strip("\"' \t\r\n")
    if not clean.startswith("http") and not clean.startswith("data:"):
        rel_urls.append(clean)

print("Relative URLs found:", len(rel_urls))
for r in sorted(rel_urls)[:20]:
    print("  REL:", r)

