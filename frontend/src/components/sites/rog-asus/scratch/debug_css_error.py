with open("ai-website-cloner-template/src/components/sites/rog-asus/rog-ally-2023/ally-style.css", "r", encoding="utf-8") as f:
    css = f.read()

pos = 6473
print("Around 6473 in ally-style.css:")
print(repr(css[max(0, pos-200):min(len(css), pos+200)]))

