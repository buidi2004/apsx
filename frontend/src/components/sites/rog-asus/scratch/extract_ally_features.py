import re

with open("/tmp/ally-2023.html", "r", encoding="utf-8") as f:
    html = f.read()

# Let find where ASUS-features starts and ends
start_pos = html.find('<div id="ASUS-features"')
if start_pos == -1:
    start_pos = html.find('id="ASUS-features"')

print("Start pos:", start_pos)

# Look for awards or articleClone or footer
end_pos = html.find('awardClone', start_pos)
if end_pos == -1:
    end_pos = html.find('ProductOverviewAwards', start_pos)

print("End pos (awards):", end_pos)

# What is right before end_pos?
slice_end = html[end_pos-400:end_pos+100]
print("Slice around end_pos:\n", slice_end)

feat_html = html[start_pos:end_pos]
print("Features HTML length:", len(feat_html))

