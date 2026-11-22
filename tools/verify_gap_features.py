import urllib.request
import urllib.parse
import json
import time
import sys

BASE_URL = "http://localhost:5161"

def req(url, method="GET", data=None, headers=None):
    if headers is None:
        headers = {}
    body = None
    if data is not None:
        body = json.dumps(data).encode("utf-8")
        headers["Content-Type"] = "application/json"
    r = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(r, timeout=10) as resp:
            content = resp.read().decode("utf-8")
            return resp.status, json.loads(content) if "application/json" in resp.headers.get("Content-Type", "") else content
    except urllib.error.HTTPError as e:
        content = e.read().decode("utf-8")
        try:
            return e.code, json.loads(content)
        except:
            return e.code, content

# Wait for server to be ready
print("Waiting for server...")
for i in range(15):
    try:
        status, _ = req(f"{BASE_URL}/api/public/site-config")
        if status == 200:
            print("Server is ready!")
            break
    except Exception:
        pass
    time.sleep(1)
else:
    print("Server failed to respond within 15s")
    sys.exit(1)

# Login as admin
status, auth_resp = req(f"{BASE_URL}/api/auth/login", method="POST", data={
    "username": "admin",
    "password": "Admin@123"
})
if status != 200 or "token" not in auth_resp:
    print(f"Login failed: {status} {auth_resp}")
    sys.exit(1)

token = auth_resp["token"]
auth_headers = {"Authorization": f"Bearer {token}"}
print(f"Logged in as admin successfully. Token length: {len(token)}")

passed = 0
failed = 0

def test(name, condition, details=""):
    global passed, failed
    if condition:
        print(f"  [PASS] {name}")
        passed += 1
    else:
        print(f"  [FAIL] {name}: {details}")
        failed += 1

print("\n--- 1. Testing Videos Showcase ---")
# Public API
s, pub_videos = req(f"{BASE_URL}/api/public/videos")
test("GET /api/public/videos returns 200", s == 200)
test("Public videos list has items", isinstance(pub_videos, list) and len(pub_videos) >= 3, f"Count: {len(pub_videos) if isinstance(pub_videos, list) else 0}")

# Admin CRUD
s, admin_videos = req(f"{BASE_URL}/api/admin/videos", headers=auth_headers)
test("GET /api/admin/videos returns 200", s == 200 and isinstance(admin_videos, list))

s, created_video = req(f"{BASE_URL}/api/admin/videos", method="POST", data={
    "title": "Test Review RTX 5090 ROG Strix",
    "videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "thumbnailUrl": "/sites/rog-asus/img/hero/test_vid.webp",
    "isBig": True,
    "sortOrder": 99,
    "isActive": True
}, headers=auth_headers)
test("POST /api/admin/videos creates video", s == 201 and "id" in created_video)
vid_id = created_video.get("id", 0)

if vid_id:
    s, updated_vid = req(f"{BASE_URL}/api/admin/videos/{vid_id}", method="PUT", data={
        "title": "Updated Test Review RTX 5090",
        "videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        "thumbnailUrl": "/sites/rog-asus/img/hero/test_vid_up.webp",
        "isBig": False,
        "sortOrder": 100,
        "isActive": True
    }, headers=auth_headers)
    test("PUT /api/admin/videos/{id} updates video", s == 200 and updated_vid.get("title") == "Updated Test Review RTX 5090")

    s, _ = req(f"{BASE_URL}/api/admin/videos/{vid_id}", method="DELETE", headers=auth_headers)
    test("DELETE /api/admin/videos/{id} deletes video", s == 204)

print("\n--- 2. Testing Product Gallery Albums ---")
# Get a product to test
s, prods = req(f"{BASE_URL}/api/admin/products?pageSize=1", headers=auth_headers)
test("GET /api/admin/products returns items", s == 200 and len(prods.get("items", [])) > 0)
test_prod = prods["items"][0]
prod_id = test_prod["id"]
prod_slug = test_prod["slug"]

s, images = req(f"{BASE_URL}/api/admin/products/{prod_id}/images", headers=auth_headers)
test("GET /api/admin/products/{id}/images returns 200", s == 200 and isinstance(images, list))

s, added_img = req(f"{BASE_URL}/api/admin/products/{prod_id}/images", method="POST", data={
    "imageUrl": "/uploads/products/test_gallery_1.webp",
    "caption": "Mặt trước máy kiểm thử",
    "sortOrder": 1
}, headers=auth_headers)
test("POST /api/admin/products/{id}/images adds image", s == 201 and "id" in added_img)
img_id = added_img.get("id", 0)

# Check public product detail includes galleryImages
encoded_slug = urllib.parse.quote(prod_slug)
s, pub_prod = req(f"{BASE_URL}/api/public/products/item?slug={encoded_slug}")
test("GET /api/public/products/item?slug=... returns 200", s == 200)
test("Public product detail includes galleryImages", "galleryImages" in pub_prod and isinstance(pub_prod["galleryImages"], list) and len(pub_prod["galleryImages"]) >= 1)

if img_id:
    s, _ = req(f"{BASE_URL}/api/admin/products/{prod_id}/images/{img_id}", method="DELETE", headers=auth_headers)
    test("DELETE /api/admin/products/{id}/images/{imageId} removes image", s == 204)

print("\n--- 3. Testing ROG Elite Member Management ---")
# Get customers
s, cust_list = req(f"{BASE_URL}/api/admin/customers?pageSize=1", headers=auth_headers)
test("GET /api/admin/customers returns items", s == 200 and len(cust_list.get("items", [])) > 0)
test_cust = cust_list["items"][0]
cust_id = test_cust["id"]
old_points = test_cust["points"]

# Adjust points
s, adj_resp = req(f"{BASE_URL}/api/admin/customers/{cust_id}/adjust-points", method="POST", data={
    "deltaPoints": 150,
    "reason": "Thưởng E2E test điểm ROG Elite"
}, headers=auth_headers)
test("POST /api/admin/customers/{id}/adjust-points increases points", s == 200 and adj_resp.get("points") == old_points + 150, f"Expected {old_points+150}, got {adj_resp.get('points')}")

# Reset password
s, reset_resp = req(f"{BASE_URL}/api/admin/customers/{cust_id}/reset-password", method="POST", data={}, headers=auth_headers)
test("POST /api/admin/customers/{id}/reset-password generates new password", s == 200 and len(reset_resp.get("newPassword", "")) >= 10, f"Result: {reset_resp}")

print("\n--- 4. Testing Article HTML WYSIWYG & Full Body ---")
s, created_art = req(f"{BASE_URL}/api/admin/articles", method="POST", data={
    "title": "Đánh giá chi tiết ROG Zephyrus G16 E2E",
    "author": "Đội ngũ ROG Lab VN",
    "excerpt": "Bài viết thử nghiệm khả năng biên tập HTML toàn văn.",
    "contentHtml": "<p>Đây là bài viết đầy đủ với <strong>HTML formatting</strong>, bảng dữ liệu, và hình ảnh sắc nét.</p>",
    "tag": "Reviews",
    "imageUrl": "/sites/rog-asus/img/hero/g16_test.webp",
    "href": "/vn/articles/review-zephyrus-g16-e2e",
    "publishedDate": "2026-11-22",
    "section": "Listing",
    "overlayText": None,
    "isBig": False,
    "sortOrder": 100,
    "isActive": True
}, headers=auth_headers)
test("POST /api/admin/articles saves contentHtml and author", s == 201 and created_art.get("author") == "Đội ngũ ROG Lab VN")
art_id = created_art.get("id", 0)

# Check public API returns contentHtml
s, pub_art = req(f"{BASE_URL}/api/public/articles/review-zephyrus-g16-e2e")
test("GET /api/public/articles/{slug} returns contentHtml", s == 200 and "<strong>HTML formatting</strong>" in pub_art.get("contentHtml", ""))

if art_id:
    s, _ = req(f"{BASE_URL}/api/admin/articles/{art_id}", method="DELETE", headers=auth_headers)
    test("DELETE /api/admin/articles/{id} cleans up test article", s in (200, 204))

print("\n--- 5. Testing Dynamic Pricing Batch ---")
pricing_slugs = "phones%2Frog-phone-7"
s, batch_res = req(f"{BASE_URL}/api/public/pricing/batch?slugs={pricing_slugs}")
test("GET /api/public/pricing/batch returns 200", s == 200 and isinstance(batch_res, list) and len(batch_res) >= 1)

print("\n--- 6. Testing Admin UI Static Assets ---")
s, admin_html = req(f"{BASE_URL}/admin/index.html")
test("admin/index.html has #page-videos", s == 200 and 'id="page-videos"' in admin_html)
test("admin/index.html has #gallery-modal", s == 200 and 'id="gallery-modal"' in admin_html)
test("admin/index.html has #videos nav link", s == 200 and 'href="#videos"' in admin_html)

s, admin_js = req(f"{BASE_URL}/admin/admin.js")
test("admin/admin.js has openGalleryModal", s == 200 and "openGalleryModal" in admin_js)
test("admin/admin.js has loadVideos", s == 200 and "loadVideos" in admin_js)
test("admin/admin.js has adjustPoints handler", s == 200 and "data-adjust-points" in admin_js)
test("admin/admin.js has resetPassword handler", s == 200 and "data-reset-pwd" in admin_js)

print(f"\n==========================================")
print(f"TEST SUMMARY: {passed} PASSED, {failed} FAILED")
print(f"==========================================")
if failed > 0:
    sys.exit(1)
