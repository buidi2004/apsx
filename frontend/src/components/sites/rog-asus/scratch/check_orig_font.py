import urllib.request

url = "https://dlcdnwebimgs.asus.com/files/media/92A296C4-BA56-40C2-A462-AE2729261A0B/main/v2/css/index.css"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
with urllib.request.urlopen(req) as resp:
    orig_css = resp.read().decode("utf-8")

ff = orig_css.find("@font-face")
print("Original @font-face:")
print(orig_css[ff:ff+600])

