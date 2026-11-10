import re

with open("/home/buidi/.gemini/antigravity/brain/865c703c-c369-4b68-8a79-9f187e68748c/scratch/matrix_5090_orig.html", "r", encoding="utf-8") as f:
    html = f.read()

award_idx = html.find('ProductOverviewAwards')
after_award = html[award_idx:]
print(f"After award length: {len(after_award)} chars")

# Find headings and sections after award
h2s = re.findall(r'<h[1-4][^>]*>(.*?)</h[1-4]>', after_award[:15000])
print("Headings after award:")
for h in h2s:
    print("  H:", re.sub(r'<[^>]+>', '', h).strip())

# Check for reviews, related, etc.
for kw in ["review", "award", "related", "spec", "disclaimer", "ProductRecommendRelated"]:
    m = re.findall(kw, after_award, re.I)
    print(f"Keyword {kw} count: {len(m)}")
