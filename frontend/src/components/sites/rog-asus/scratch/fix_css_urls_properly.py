import urllib.request, re

url = "https://dlcdnwebimgs.asus.com/files/media/92A296C4-BA56-40C2-A462-AE2729261A0B/main/v2/css/index.css"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
with urllib.request.urlopen(req) as resp:
    orig_css = resp.read().decode("utf-8")

cdn_base = "https://dlcdnwebimgs.asus.com/files/media/92A296C4-BA56-40C2-A462-AE2729261A0B/main/v2/"

# Replace url(../ with url(https://...
# Simply replace all occurrences of `url(../` with `url(https://.../`
new_css = orig_css.replace("url(../", f"url({cdn_base}")
new_css = new_css.replace("url(\"../", f"url(\"{cdn_base}")
new_css = new_css.replace("url('../", f"url('{cdn_base}")

path = "ai-website-cloner-template/src/components/sites/rog-asus/rog-ally-2023/ally-style.css"
with open(path, "w", encoding="utf-8") as f:
    f.write(new_css)

print("Properly replaced all relative URLs in ally-style.css, length:", len(new_css))

