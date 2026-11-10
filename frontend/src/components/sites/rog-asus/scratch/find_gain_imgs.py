import re

with open("/tmp/ally-2023.html", "r", encoding="utf-8") as f:
    html = f.read()

imgs = re.findall(r'https://dlcdnwebimgs\.asus\.com/gain/[A-F0-9\-]+[^\s"\'<>]*', html)
print("Gain images found:", len(imgs))
for img in sorted(set(imgs))[:15]:
    print(" ", img)

