import re

path = "ai-website-cloner-template/src/components/sites/rog-asus/rog-ally-2023/ally-style.css"
with open(path, "r", encoding="utf-8") as f:
    css = f.read()

cdn_base = "https://dlcdnwebimgs.asus.com/files/media/92A296C4-BA56-40C2-A462-AE2729261A0B/main/v2/"

def repl(m):
    quote = m.group(1)
    rest = m.group(2)
    return f"url({quote}{cdn_base}{rest}"

new_css = re.sub(r'url\((["\']?)\.\./([^)]+)\)', repl, css)

with open(path, "w", encoding="utf-8") as f:
    f.write(new_css)

print("Rewrote ally-style.css, length:", len(new_css))

