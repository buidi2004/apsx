import re

path = "ai-website-cloner-template/public/sites/rog-asus/rog-ally-2023/ally-main.js"
with open(path, "r", encoding="utf-8") as f:
    js = f.read()

print("Length of ally-main.js:", len(js))
for kw in ["jQuery", "Waypoint", "Swiper", "gsap", "ScrollTrigger"]:
    print(kw, "in js:", kw in js)
