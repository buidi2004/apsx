import re

with open("/tmp/ally-2023.html", "r", encoding="utf-8") as f:
    html = f.read()

matches = re.findall(r"https://dlcdnwebimgs\.asus\.com/files/media/92A296C4-BA56-40C2-A462-AE2729261A0B/[^\s\"\'<>]+", html)
print("Files under media folder:", len(matches))
for m in sorted(set(matches))[:30]:
    print(" ", m)

# Find sections inside ASUS-features or moduleArea
print("\n=== HEADINGS ===")
h2s = re.findall(r"<h[1-4][^>]*>(.*?)</h[1-4]>", html)
for h in h2s:
    clean = re.sub(r"<[^>]+>", "", h).strip()
    if clean:
        print("  H:", clean[:80])

