with open("/tmp/ally-2023.html", "r", encoding="utf-8") as f:
    html = f.read()

subbar_start = html.find('<div id="productTabBarContainer"')
subbar_end = html.find('id="ASUS-features"', subbar_start)
subbar = html[subbar_start:subbar_end]
print("Subbar length:", len(subbar))
print(subbar[:4000])

