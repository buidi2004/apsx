import re

with open("/tmp/ally-2023.html", "r", encoding="utf-8") as f:
    html = f.read()

start_pos = html.find('<div id="ASUS-features"')
end_pos = html.find('awardClone', start_pos)
feat_html = html[start_pos:end_pos]

# Remove script tags from feat_html since we load scripts properly in React
feat_html_clean = re.sub(r'<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>', '', feat_html)

out_ts = "ai-website-cloner-template/src/components/sites/rog-asus/rog-ally-2023/ally-html.ts"
with open(out_ts, "w", encoding="utf-8") as f:
    f.write('/* eslint-disable max-len */\n')
    f.write('export const ALLY_FEATURES_HTML = ')
    # Using JSON dump to guarantee valid JS escaping
    import json
    f.write(json.dumps(feat_html_clean))
    f.write(';\n')

print("Wrote ally-html.ts, size:", len(feat_html_clean))

