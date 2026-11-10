import urllib.request

url = "http://localhost:3000/vn/gaming-handhelds/rog-ally/rog-ally-2023"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
with urllib.request.urlopen(req) as resp:
    html = resp.read().decode("utf-8")

checks = {
    "Subbar thumb": "subbar-thumb.webp",
    "Subbar tabs": "Tính năng",
    "KV #playALLYourgames": "playALLYourgames",
    "Z1 Extreme": "Ryzen™ Z1 Extreme",
    "Me Time Scenario": "Me Time",
    "We Time Scenario": "We Time",
    "Pro Time Scenario": "Pro Time",
    "Armoury Crate SE": "Armoury Crate SE",
    "Benchmarks 1080P": "1080P",
    "Zero Gravity": "Zero Gravity",
    "608 grams": "608",
    "Awards header": "Giải thưởng",
    "Nghe Nhin Award": "EDITORS&#x27; CHOICE AWARDS 2023",
    "Video Review": "The best Handheld i have used till now",
    "Media Review": "BaoMoi",
    "Customer Reviews": "CUSTOMER REVIEWS",
    "Recommend Products": "Sản phẩm được đề xuất",
    "HDMI Logo": "HDMI_logo_R_Gray.png",
    "Disclaimers (7 notes)": "Các sản phẩm do Ủy ban Truyền thông Liên bang"
}

print("=== VERIFICATION RESULTS FOR ROG ALLY 2023 ===")
all_pass = True
for label, keyword in checks.items():
    found = keyword in html
    status = "PASS" if found else "FAIL"
    if not found:
        all_pass = False
    print(f"[{status}] {label}: {found}")

print("===============================================")
if all_pass:
    print("🎉 ALL 19 VERIFICATION CHECKS PASSED 100%!")
else:
    print("❌ Some checks failed.")

