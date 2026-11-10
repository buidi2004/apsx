import re

with open("/tmp/ally-2023.html", "r", encoding="utf-8") as f:
    html = f.read()

post_html = html[432464:]

# Extract first few awards
print("=== AWARDS ===")
awards = re.findall(r'<div class="ProductOverviewAwardsItem__rewardItem__Pqq8U[^"]*">(.*?)</div>\s*(?=<div class="ProductOverviewAwardsItem__rewardItem|</div>\s*</div>)', post_html, re.S)
print(f"Total award items: {len(awards)}")
for i, a in enumerate(awards[:5]):
    link = re.search(r'href="([^"]+)"', a)
    img = re.search(r'src="([^"]+)"', a)
    ps = re.findall(r'<p[^>]*>(.*?)</p>', a, re.S)
    clean_ps = [re.sub(r'<[^>]+>', '', p).strip() for p in ps if re.sub(r'<[^>]+>', '', p).strip()]
    print(f"Award #{i+1}:")
    print("  Link:", link.group(1) if link else None)
    print("  Img:", img.group(1) if img else None)
    print("  Text:", clean_ps)

# Extract videos
print("\n=== VIDEOS ===")
vids = re.findall(r'<div[^>]*AwardVideo__actionVideoContent[^>]*>(.*?)</div>\s*</div>\s*</div>', post_html, re.S)
print(f"Total video items: {len(vids)}")
for i, v in enumerate(vids[:4]):
    title = re.search(r'ProductAwardVideoContent__actionTitle[^>]*>(.*?)</p>', v, re.S)
    clean_t = re.sub(r'<[^>]+>', '', title.group(1)).strip() if title else "No title"
    print(f"Video #{i+1}:", clean_t)

# Extract media reviews
print("\n=== MEDIA REVIEWS ===")
medias = re.findall(r'<div class="ProductOverviewMediaItem__mediaItem__AT0ID[^"]*">(.*?)</div>\s*(?=<div class="ProductOverviewMediaItem__mediaItem|</div>\s*</div>)', post_html, re.S)
print(f"Total media items: {len(medias)}")
for i, m in enumerate(medias[:4]):
    link = re.search(r'href="([^"]+)"', m)
    img = re.search(r'src="([^"]+)"', m)
    ps = re.findall(r'<p[^>]*>(.*?)</p>', m, re.S)
    clean_ps = [re.sub(r'<[^>]+>', '', p).strip() for p in ps if re.sub(r'<[^>]+>', '', p).strip()]
    print(f"Media #{i+1}:")
    print("  Link:", link.group(1) if link else None)
    print("  Img:", img.group(1) if img else None)
    print("  Text:", clean_ps)

# Extract recommend & related
print("\n=== RECOMMEND & RELATED ===")
recs = re.findall(r'class="RecommendRelatedItem__recommendRelatedItem__Yue-5[^"]*">(.*?)</div>\s*</div>\s*</div>', post_html, re.S)
print(f"Total recommend/related items: {len(recs)}")
for i, r in enumerate(recs):
    h3 = re.search(r'<h3[^>]*>(.*?)</h3>', r, re.S)
    img = re.search(r'src="([^"]+)"', r, re.S)
    link = re.search(r'href="([^"]+)"', r, re.S)
    print(f"Item #{i+1}:", h3.group(1).strip() if h3 else "No H3", "| Link:", link.group(1) if link else None)

