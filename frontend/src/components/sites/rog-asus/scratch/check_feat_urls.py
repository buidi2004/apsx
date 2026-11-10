import re

with open("/tmp/ally-2023.html", "r", encoding="utf-8") as f:
    html = f.read()

start_pos = html.find('<div id="ASUS-features"')
end_pos = html.find('awardClone', start_pos)
feat_html = html[start_pos:end_pos]

# Look for src or href or data-src that are relative
sources = re.findall(r'(?:src|data-src|href)=["\'](\.\./[^"\']+)["\']', feat_html)
print("Relative sources in feat_html:", len(sources))
for s in sorted(set(sources))[:15]:
    print(" ", s)

