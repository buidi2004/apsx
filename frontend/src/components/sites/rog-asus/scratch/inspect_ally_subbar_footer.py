import re, json

with open("/tmp/ally-2023.html", "r", encoding="utf-8") as f:
    html = f.read()

# Look for subbar information
subbar_pos = html.find('ProductTabBar')
print("Subbar pos:", subbar_pos)
print("Subbar snippet:\n", html[subbar_pos:subbar_pos+1500])

# Look for footnotes / disclaimers
footer_pos = html.find('ProductFooter__productFooterList')
print("\nFooter snippet:\n", html[footer_pos:footer_pos+1500])

