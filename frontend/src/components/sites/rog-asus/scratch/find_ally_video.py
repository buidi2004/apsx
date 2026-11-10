import re

with open("/tmp/ally-2023.html", "r", encoding="utf-8") as f:
    html = f.read()

pos = html.find("The best Handheld i have used till now")
print("Pos in html:", pos)
if pos != -1:
    print(html[pos-300:pos+500])

# Search in Nuxt state for youtube or youtu.be
m = re.findall(r'videoUrl:"([^"]+)"', html)
print("Video URLs found:", m)

