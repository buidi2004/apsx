import re

with open("/tmp/ally-2023.html", "r", encoding="utf-8") as f:
    html = f.read()

post_html = html[432464:]
print("Post HTML length:", len(post_html))

# Find awards
awards = re.findall(r'ProductOverviewAwardsItem__rewardItem', post_html)
print("Awards count:", len(awards))

# Find videos
videos = re.findall(r'AwardVideo__actionVideoContent', post_html)
print("Videos count:", len(videos))

# Find media
medias = re.findall(r'ProductOverviewMediaItem__mediaItem', post_html)
print("Media reviews count:", len(medias))

# Find reviews
reviews = re.findall(r'CUSTOMER REVIEWS', post_html)
print("Customer reviews found:", len(reviews))

# Find articles
articles = re.findall(r'ProductOverviewArticle__articleTitle', post_html)
print("Related articles found:", len(articles))

# Find recommend
recommend = re.findall(r'RecommendRelatedBox__recommendRelateTitle', post_html)
print("Recommend related found:", len(recommend))

# Find footer
footers = re.findall(r'ProductFooter__productFooterContainer', post_html)
print("Product footer found:", len(footers))

