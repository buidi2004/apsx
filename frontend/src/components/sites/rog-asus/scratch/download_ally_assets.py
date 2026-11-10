import os, urllib.request

out_dir = "ai-website-cloner-template/public/sites/rog-asus/rog-ally-2023"
os.makedirs(os.path.join(out_dir, "awards"), exist_ok=True)
os.makedirs(os.path.join(out_dir, "recommend"), exist_ok=True)

downloads = {
    # Subbar thumbnail
    "subbar-thumb.webp": "https://dlcdnwebimgs.asus.com/gain/E70351F2-3579-45FB-95AC-4D41DA42EF2C/w717/h525/fwebp",
    # Video cover
    "video-cover.jpg": "https://img.youtube.com/vi/xBU-Rs4LLTA/maxresdefault.jpg",
    # Awards
    "awards/award-nghenhin-2023.png": "https://www.asus.com/media/images/award_logo/1343/202401021226121020685.png",
    "awards/award-tgs-2023.png": "https://www.asus.com/media/images/award_logo/1343/202401021158320050351.png",
    "awards/award-tinhte-2023-1.png": "https://www.asus.com/media/images/award_logo/1343/202401051059017050722.png",
    "awards/award-tinhte-2023-2.png": "https://www.asus.com/media/images/award_logo/1343/202401051041460330003.png",
    "awards/award-genk-2023.png": "https://www.asus.com/media/images/award_logo/1343/202311011158035560495.png",
    # Media reviews
    "awards/media-baomoi.png": "https://www.asus.com/media/images/award_logo/1343/202305181638160850345.png",
    "awards/media-geekculture.png": "https://www.asus.com/media/images/award_logo/1332/202207081550250920985.png",
    "awards/media-xataka.png": "https://www.asus.com/media/images/award_logo/1337/202206291848194630131.png",
    # Recommended & Related products
    "recommend/ally-x-2025.webp": "https://dlcdnwebimgs.asus.com/gain/9F50BA7A-A491-4D84-B3B6-BD8B427B69B2/w260/fwebp",
    "recommend/ally-case-2in1.webp": "https://dlcdnwebimgs.asus.com/gain/C1CA88A3-6AF7-4567-AB25-879EDCD4339C/w260/fwebp",
    "recommend/ally-travel-case.webp": "https://dlcdnwebimgs.asus.com/gain/0F34A77C-0F26-4E0A-9B67-6143E5ADA4BB/w260/fwebp",
    "recommend/ally-2025-rc73ya.webp": "https://dlcdnwebimgs.asus.com/gain/A248E39D-5340-45CD-8613-21323A04B3D0/w260/fwebp",
    "recommend/ally-x-2024.webp": "https://dlcdnwebimgs.asus.com/gain/828CE44B-7B48-4F48-88F7-88BEA7D13C5D/w260/fwebp",
    "recommend/zephyrus-duo.webp": "https://dlcdnwebimgs.asus.com/gain/4C012B41-07B2-41FA-ACB6-B8CE5F049207/w260/fwebp",
    "recommend/raikiri.webp": "https://dlcdnwebimgs.asus.com/gain/4B194904-B3AE-4AED-9F43-2A229636FD53/w260/fwebp",
    "recommend/flow-z13.webp": "https://dlcdnwebimgs.asus.com/gain/D849A83F-693D-4F3F-BEF1-F443266F0351/w260/fwebp",
}

for name, url in downloads.items():
    dest = os.path.join(out_dir, name)
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req) as resp, open(dest, "wb") as f:
            f.write(resp.read())
        print(f"Downloaded {name}: {os.path.getsize(dest)} bytes")
    except Exception as e:
        print(f"Error {name}: {e}")

