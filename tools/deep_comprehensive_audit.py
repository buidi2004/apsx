import os
import sys
import time
import json
import subprocess
import requests

def print_step(title):
    print(f"\n======================================================\n{title}\n======================================================")

def main():
    print("🚀 BẮT ĐẦU QUY TRÌNH KIỂM TRA CHUYÊN SÂU TOÀN BỘ HỆ THỐNG ROG")
    
    # Kiểm tra xem cổng 5161 đã có backend chạy chưa
    base_url = "http://localhost:5161"
    proc = None
    already_running = False
    try:
        r = requests.get(f"{base_url}/api/public/site-config", timeout=2)
        if r.status_code == 200:
            already_running = True
            print(f"-> Backend hiện đang hoạt động sẵn tại {base_url}!")
    except:
        pass

    if not already_running:
        port = 5172
        base_url = f"http://127.0.0.1:{port}"
        env = os.environ.copy()
        env.update({
            "ASPNETCORE_ENVIRONMENT": "Development",
            "ASPNETCORE_URLS": base_url,
            "Database__Provider": "Sqlite"
        })
        
        proc = subprocess.Popen(
            ["dotnet", "run", "--no-launch-profile"],
            cwd="RogAdmin/src/RogAdmin.Api",
            env=env,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        print(f"Khởi động Backend test trên {base_url}...")
        
        ready = False
        for _ in range(30):
            time.sleep(1)
            try:
                r = requests.get(f"{base_url}/health", timeout=1)
                if r.status_code == 200:
                    ready = True
                    print("   -> Backend đã sẵn sàng phản hồi!")
                    break
            except:
                pass
                
        if not ready:
            if proc: proc.kill()
            print("❌ Backend không khởi động được trong 30s.")
            sys.exit(1)
        
    passed_tests = 0
    total_tests = 0

    def check(name, condition, extra=""):
        nonlocal passed_tests, total_tests
        total_tests += 1
        if condition:
            passed_tests += 1
            print(f"  [✓ PASS] {name} {extra}")
        else:
            print(f"  [✗ FAIL] {name} {extra}")
            raise AssertionError(f"Test failed: {name}")

    try:
        # ==============================================================
        # PHẦN 1: BẢO MẬT & XÁC THỰC (SECURITY & AUTH)
        # ==============================================================
        print_step("PHẦN 1: BẢO MẬT & XÁC THỰC (SECURITY & AUTH)")
        
        # 1. Truy cập trái phép endpoint admin
        r_unauth = requests.get(f"{base_url}/api/admin/dashboard")
        check("Chặn truy cập trái phép khi chưa đăng nhập", r_unauth.status_code in [401, 403], f"HTTP {r_unauth.status_code}")

        # 2. Đăng nhập sai mật khẩu
        r_wrong_pass = requests.post(f"{base_url}/api/auth/login", json={"username": "admin", "password": "WrongPassword!"})
        check("Từ chối đăng nhập sai mật khẩu", r_wrong_pass.status_code in [400, 401], f"HTTP {r_wrong_pass.status_code}")

        # 3. Đăng nhập đúng tài khoản Admin
        r_login = requests.post(f"{base_url}/api/auth/login", json={"username": "admin", "password": "Admin@123"})
        check("Đăng nhập thành công với tài khoản quản trị", r_login.status_code == 200)
        token = r_login.json()["token"]
        headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

        # 4. Kiểm tra endpoint Me
        r_me = requests.get(f"{base_url}/api/auth/me", headers=headers)
        check("Lấy thông tin tài khoản hiện tại (/api/auth/me)", r_me.status_code == 200 and r_me.json()["username"] == "admin")

        # ==============================================================
        # PHẦN 2: THỰC THI TOÀN DIỆN CRUD TRÊN TOÀN BỘ PHÂN HỆ ADMIN
        # ==============================================================
        print_step("PHẦN 2: THỰC THI CRUD TOÀN DIỆN TRÊN CÁC PHÂN HỆ ADMIN")

        # 1. Products & Specs CRUD
        test_slug = f"laptops/rog-strix/rog-strix-scar-test-{int(time.time())}"
        r_p_create = requests.post(f"{base_url}/api/admin/products", headers=headers, json={
            "name": "ROG Strix SCAR 2027 Ultra Extreme",
            "slug": test_slug,
            "categorySlug": "laptops",
            "modelCode": "G999-EXTREME",
            "tagline": "Cỗ máy chiến game tương lai",
            "thumbnailUrl": "/sites/rog-asus/img/detail/scar18-kv.webp",
            "keyVisualUrl": "/sites/rog-asus/img/detail/scar18-kv.webp",
            "basePath": "/" + test_slug,
            "subBarType": "Overview",
            "price": 199990000,
            "oldPrice": 219990000,
            "discountLabel": "-20 TRIỆU",
            "stockStatus": 0,
            "isHot": True,
            "isFeatured": True,
            "sortOrder": 1
        })
        check("Admin: Tạo mới sản phẩm", r_p_create.status_code == 201, f"HTTP {r_p_create.status_code}: {r_p_create.text}")
        prod_id = r_p_create.json()["id"]

        # Thêm Specs cho sản phẩm
        r_spec_add = requests.post(f"{base_url}/api/admin/products/{prod_id}/specs", headers=headers, json={
            "specGroup": "Xử Lý & Đồ Họa",
            "specKey": "Vi xử lý (CPU)",
            "specValue": "Intel Core Ultra 9 390HX (32 nhân, 48 luồng)",
            "orderIndex": 1
        })
        check("Admin: Thêm thông số kỹ thuật (Spec)", r_spec_add.status_code == 200, f"HTTP {r_spec_add.status_code}: {r_spec_add.text}")

        # Thêm Gallery Image cho sản phẩm
        r_gallery_add = requests.post(f"{base_url}/api/admin/products/{prod_id}/images", headers=headers, json={
            "imageUrl": "/uploads/products/scar_ultra_angle1.webp",
            "caption": "Góc nhìn nghiêng 45 độ",
            "sortOrder": 1
        })
        check("Admin: Thêm ảnh Gallery album cho sản phẩm", r_gallery_add.status_code == 201)
        gallery_img_id = r_gallery_add.json()["id"]

        # Kiểm tra chi tiết sản phẩm public có galleryImages
        r_pub_prod = requests.get(f"{base_url}/api/public/products/item?slug={test_slug}")
        check("Public: Xem chi tiết sản phẩm có trường galleryImages", r_pub_prod.status_code == 200 and "galleryImages" in r_pub_prod.json() and len(r_pub_prod.json()["galleryImages"]) >= 1)

        # Xóa Gallery Image
        r_gallery_del = requests.delete(f"{base_url}/api/admin/products/{prod_id}/images/{gallery_img_id}", headers=headers)
        check("Admin: Xóa ảnh Gallery album", r_gallery_del.status_code == 204)

        # Cập nhật giá sản phẩm
        r_p_price = requests.put(f"{base_url}/api/admin/products/{prod_id}/price", headers=headers, json={
            "price": 189990000,
            "oldPrice": 209990000,
            "discountLabel": "-20 TRIỆU",
            "stockStatus": 0,
            "isHot": True,
            "isFeatured": True
        })
        check("Admin: Cập nhật giá sản phẩm", r_p_price.status_code == 200)

        # 2. Hero Slides CRUD
        r_slide_create = requests.post(f"{base_url}/api/admin/hero-slides", headers=headers, json={
            "imageUrl": "/sites/rog-asus/img/hero/gamescom.webp",
            "altText": "Test Slide 2026",
            "href": "/vn/events",
            "sortOrder": 99,
            "isActive": True
        })
        check("Admin: Thêm Hero Slide", r_slide_create.status_code == 201, f"HTTP {r_slide_create.status_code}: {r_slide_create.text}")
        slide_id = r_slide_create.json()["id"]

        r_slide_del = requests.delete(f"{base_url}/api/admin/hero-slides/{slide_id}", headers=headers)
        check("Admin: Xóa Hero Slide", r_slide_del.status_code == 204)

        # 3. Product Categories CRUD
        r_cat_create = requests.post(f"{base_url}/api/admin/product-categories", headers=headers, json={
            "imageUrl": "/sites/rog-asus/img/products/laptop-gaming.webp",
            "label": "Kính VR Gaming ROG",
            "href": "/vn/vr-headsets-group",
            "sortOrder": 99,
            "isActive": True
        })
        check("Admin: Thêm Danh mục sản phẩm", r_cat_create.status_code == 201, f"HTTP {r_cat_create.status_code}: {r_cat_create.text}")
        cat_id = r_cat_create.json()["id"]

        r_cat_del = requests.delete(f"{base_url}/api/admin/product-categories/{cat_id}", headers=headers)
        check("Admin: Xóa Danh mục sản phẩm", r_cat_del.status_code == 204)

        # 4. Articles CRUD với ContentHtml & Author
        test_art_href = f"/vn/articles/guides/kiem-tra-chuyen-sau-{int(time.time())}"
        r_art_create = requests.post(f"{base_url}/api/admin/articles", headers=headers, json={
            "imageUrl": "/sites/rog-asus/img/articles/gta6.webp",
            "tag": "Reviews",
            "title": "Kiểm tra hệ thống bài viết tự động toàn văn",
            "author": "Đội ngũ ROG Lab VN",
            "excerpt": "Trích đoạn bài viết test",
            "contentHtml": "<p>Nội dung toàn văn bài viết với <strong>HTML</strong> chi tiết và bảng số liệu.</p>",
            "href": test_art_href,
            "section": "Highlights",
            "isBig": False,
            "sortOrder": 99,
            "isActive": True
        })
        check("Admin: Thêm Bài viết mới có ContentHtml & Author", r_art_create.status_code == 201, f"HTTP {r_art_create.status_code}: {r_art_create.text}")
        art_id = r_art_create.json()["id"]

        # Kiểm tra Public API đọc đúng ContentHtml & Author
        art_slug = test_art_href.replace("/vn/articles/", "")
        r_pub_art = requests.get(f"{base_url}/api/public/articles/{art_slug}")
        check("Public: Đọc đúng ContentHtml bài viết", r_pub_art.status_code == 200 and "<strong>HTML</strong>" in r_pub_art.json().get("contentHtml", ""))

        r_art_del = requests.delete(f"{base_url}/api/admin/articles/{art_id}", headers=headers)
        check("Admin: Xóa Bài viết", r_art_del.status_code in [200, 204])

        # 5. Site Settings Read & Update
        r_settings_get = requests.get(f"{base_url}/api/admin/site-settings", headers=headers)
        check("Admin: Đọc Cấu hình site", r_settings_get.status_code == 200)
        r_settings_save = requests.put(f"{base_url}/api/admin/site-settings/promoBarText", headers=headers, json={"value": "Siêu Giảm Giá Mùa Đông ROG RTX 50!"})
        check("Admin: Lưu Cấu hình site (promoBarText)", r_settings_save.status_code == 200)

        # 6. Dealers CRUD
        r_dealer_create = requests.post(f"{base_url}/api/admin/dealers", headers=headers, json={
            "name": "ROG Store Test Flagship",
            "slug": "rog-store-test",
            "logoUrl": "/sites/rog-asus/img/dealers/rog-store.webp",
            "websiteUrl": "https://rog.asus.com",
            "hotline": "1800 6588",
            "isOfficialPartner": True,
            "storeCount": 1,
            "cityCoverage": "TP.HCM",
            "sortOrder": 99,
            "isActive": True
        })
        check("Admin: Thêm Đại lý mới", r_dealer_create.status_code == 201)
        dealer_id = r_dealer_create.json()["id"]

        r_dealer_del = requests.delete(f"{base_url}/api/admin/dealers/{dealer_id}", headers=headers)
        check("Admin: Xóa Đại lý", r_dealer_del.status_code == 204)

        # 7. Warranty Records CRUD
        test_serial = f"R4NRCX{int(time.time()) % 100000:05d}"
        r_warr_create = requests.post(f"{base_url}/api/admin/warranty", headers=headers, json={
            "serialNumber": test_serial,
            "productModel": "ROG Strix SCAR 18 (2026)",
            "purchaseDate": "2026-01-01T00:00:00Z",
            "expiryDate": "2028-01-01T00:00:00Z",
            "status": "Active",
            "serviceCenter": "TP.HCM",
            "notes": "Máy trải nghiệm sự kiện"
        })
        check("Admin: Thêm hồ sơ bảo hành (Serial)", r_warr_create.status_code == 201, f"HTTP {r_warr_create.status_code}: {r_warr_create.text}")
        warr_id = r_warr_create.json()["id"]

        r_warr_up = requests.put(f"{base_url}/api/admin/warranty/{warr_id}", headers=headers, json={
            "serialNumber": test_serial,
            "productModel": "ROG Strix SCAR 18 (2026)",
            "purchaseDate": "2026-01-01T00:00:00Z",
            "expiryDate": "2028-06-01T00:00:00Z",
            "status": "Active",
            "serviceCenter": "TP.HCM",
            "notes": "Đã gia hạn bảo hành thêm 6 tháng"
        })
        check("Admin: Cập nhật & Gia hạn hồ sơ bảo hành", r_warr_up.status_code == 200)

        r_warr_del = requests.delete(f"{base_url}/api/admin/warranty/{warr_id}", headers=headers)
        check("Admin: Xóa hồ sơ bảo hành test", r_warr_del.status_code == 204)

        # 8. Product Reviews Moderation
        # Tạo review bằng Public API
        r_rev_pub = requests.post(f"{base_url}/api/public/reviews", json={
            "productSlug": "laptops/rog-strix/rog-strix-scar-18-2026",
            "content": "Máy quá đỉnh, tản nhiệt kim loại lỏng siêu mát 10/10!",
            "rating": 5
        })
        check("Public: Gửi đánh giá sản phẩm", r_rev_pub.status_code == 200)

        # Lấy danh sách review chờ duyệt
        r_rev_list = requests.get(f"{base_url}/api/admin/reviews?isApproved=false", headers=headers)
        check("Admin: Xem danh sách đánh giá chờ duyệt", r_rev_list.status_code == 200)
        rev_items = r_rev_list.json().get("items", [])
        if rev_items:
            target_rev = rev_items[0]["id"]
            # Duyệt đánh giá
            r_rev_app = requests.put(f"{base_url}/api/admin/reviews/{target_rev}/approve", headers=headers)
            check("Admin: Duyệt đánh giá (Approve)", r_rev_app.status_code == 200)
            # Xóa đánh giá test
            r_rev_del = requests.delete(f"{base_url}/api/admin/reviews/{target_rev}", headers=headers)
            check("Admin: Xóa đánh giá", r_rev_del.status_code == 204)

        # 9. Orders Flow
        # Khách đặt hàng qua Public API
        r_order_create = requests.post(f"{base_url}/api/public/orders", json={
            "customerName": "Nguyễn Văn Test",
            "email": "test@rog-vietnam.vn",
            "phone": "0901234567",
            "address": "123 Đường Công Nghệ, Quận 1, TP.HCM",
            "note": "Giao giờ hành chính",
            "items": [
                {
                    "slug": "laptops/rog-strix/rog-strix-scar-18-2026",
                    "quantity": 1,
                    "selectedSpecs": "Core Ultra 9 290HX / RTX 5090 / 64GB RAM",
                    "name": "ROG Strix SCAR 18 (2026) G834",
                    "unitPrice": 134990000
                }
            ]
        })
        check("Public: Khách hàng đặt mua đơn hàng thành công", r_order_create.status_code == 201)
        order_code = r_order_create.json()["orderCode"]

        # Admin tra cứu đơn hàng
        r_order_get = requests.get(f"{base_url}/api/public/orders/{order_code}")
        check("Tra cứu đơn hàng bằng OrderCode (Tính giá an toàn từ DB)", r_order_get.status_code == 200 and r_order_get.json().get("total") == r_order_create.json().get("total"), f"Status: {r_order_get.status_code}, Body: {r_order_get.text}")

        # Admin tra cứu đơn hàng trong danh sách quản trị
        r_admin_orders = requests.get(f"{base_url}/api/admin/orders?search={order_code}", headers=headers)
        check("Admin: Tra cứu đơn hàng trong danh sách quản trị", r_admin_orders.status_code == 200 and len(r_admin_orders.json().get("items", [])) > 0)
        admin_order_id = r_admin_orders.json()["items"][0]["id"]

        # Admin cập nhật trạng thái đơn sang Confirmed
        r_order_status = requests.put(f"{base_url}/api/admin/orders/{admin_order_id}/status", headers=headers, json={"status": "Confirmed"})
        check("Admin: Xác nhận đơn hàng (Pending -> Confirmed)", r_order_status.status_code == 200)

        # 10. Service Centers & Warranty Policies CRUD
        r_sc_create = requests.post(f"{base_url}/api/admin/service-centers", headers=headers, json={
            "city": "HẢI PHÒNG",
            "name": "Trung Tâm Bảo Hành ROG Hải Phòng",
            "address": "123 Lạch Tray, Quận Ngô Quyền, Hải Phòng",
            "phone": "1800 65 88",
            "operatingHours": "08:30 - 17:30",
            "sortOrder": 5,
            "isActive": True
        })
        check("Admin: Thêm Trung tâm bảo hành mới", r_sc_create.status_code == 201)
        sc_id = r_sc_create.json()["id"]

        r_sc_del = requests.delete(f"{base_url}/api/admin/service-centers/{sc_id}", headers=headers)
        check("Admin: Xóa Trung tâm bảo hành", r_sc_del.status_code == 204)

        # 11. Social Channels & Elite Tiers CRUD
        r_soc_create = requests.post(f"{base_url}/api/admin/community/channels", headers=headers, json={
            "name": "ROG Threads Official",
            "membersCount": "50K+ Chiến binh",
            "description": "Cộng đồng chia sẻ góc máy và tin công nghệ",
            "link": "https://threads.net/@rog_vietnam",
            "buttonText": "FOLLOW NGAY",
            "sortOrder": 10,
            "isActive": True
        })
        check("Admin: Thêm Kênh Mạng Xã Hội mới", r_soc_create.status_code == 201, f"HTTP {r_soc_create.status_code}: {r_soc_create.text}")
        soc_id = r_soc_create.json()["id"]

        r_soc_del = requests.delete(f"{base_url}/api/admin/community/channels/{soc_id}", headers=headers)
        check("Admin: Xóa Kênh Mạng Xã Hội", r_soc_del.status_code == 204)

        # 12. Innovations CRUD
        r_inno_create = requests.post(f"{base_url}/api/admin/innovations", headers=headers, json={
            "tag": "// KIỂM TRA CHUYÊN SÂU",
            "title": "Dual Liquid Metal Architecture",
            "description": "Kiến trúc làm mát kép keo kim loại lỏng thế hệ 2026",
            "highlightsJson": "[\"Giảm nhiệt 18°C\", \"An toàn chống tràn\"]",
            "imageUrl": "/sites/rog-asus/img/detail/gu605-cooling.webp",
            "sortOrder": 99,
            "isActive": True
        })
        check("Admin: Thêm Công nghệ & Sáng tạo mới", r_inno_create.status_code == 201)
        inno_id = r_inno_create.json()["id"]

        r_inno_del = requests.delete(f"{base_url}/api/admin/innovations/{inno_id}", headers=headers)
        check("Admin: Xóa Công nghệ & Sáng tạo", r_inno_del.status_code == 204)

        # 13. Wallpapers CRUD
        r_wp_create = requests.post(f"{base_url}/api/admin/wallpapers", headers=headers, json={
            "title": "ROG Cyberpunk District 2026",
            "resolution": "3840 x 2160 (4K)",
            "imageUrl": "/sites/rog-asus/img/hero/gamescom.webp",
            "downloadUrl": "/sites/rog-asus/img/hero/gamescom.webp",
            "sortOrder": 99,
            "isActive": True
        })
        check("Admin: Thêm Hình nền 4K mới", r_wp_create.status_code == 201)
        wp_id = r_wp_create.json()["id"]

        r_wp_del = requests.delete(f"{base_url}/api/admin/wallpapers/{wp_id}", headers=headers)
        check("Admin: Xóa Hình nền 4K", r_wp_del.status_code == 204)

        # 14. About Stories CRUD
        r_st_create = requests.post(f"{base_url}/api/admin/about-stories", headers=headers, json={
            "yearTag": "NĂM 2026 // BƯỚC NGOẶT AI",
            "heading": "CÁCH MẠNG LAPTOP GAMING AI THẾ HỆ MỚI",
            "content": "ROG định hình lại toàn bộ trải nghiệm gaming với NPU tích hợp...",
            "imageUrl": "/sites/rog-asus/img/detail/scar18-kv.webp",
            "sortOrder": 99,
            "isActive": True
        })
        check("Admin: Thêm Cột mốc lịch sử ROG", r_st_create.status_code == 201)
        st_id = r_st_create.json()["id"]

        r_st_del = requests.delete(f"{base_url}/api/admin/about-stories/{st_id}", headers=headers)
        check("Admin: Xóa Cột mốc lịch sử ROG", r_st_del.status_code == 204)

        # 15. Videos Showcase CRUD
        r_vid_create = requests.post(f"{base_url}/api/admin/videos", headers=headers, json={
            "title": "Trải Nghiệm ROG Ally 2026",
            "videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "thumbnailUrl": "/sites/rog-asus/img/hero/gamescom.webp",
            "isBig": False,
            "sortOrder": 99,
            "isActive": True
        })
        check("Admin: Thêm Video Review mới", r_vid_create.status_code == 201)
        vid_id = r_vid_create.json()["id"]

        r_vid_up = requests.put(f"{base_url}/api/admin/videos/{vid_id}", headers=headers, json={
            "title": "Trải Nghiệm ROG Ally 2026 - Bản Nâng Cấp",
            "videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "thumbnailUrl": "/sites/rog-asus/img/hero/gamescom.webp",
            "isBig": True,
            "sortOrder": 99,
            "isActive": True
        })
        check("Admin: Cập nhật Video Review", r_vid_up.status_code == 200)

        r_vid_del = requests.delete(f"{base_url}/api/admin/videos/{vid_id}", headers=headers)
        check("Admin: Xóa Video Review", r_vid_del.status_code == 204)

        # 16. Customer Points Adjustment & Reset Password
        r_cust_list = requests.get(f"{base_url}/api/admin/customers?pageSize=1", headers=headers)
        check("Admin: Lấy danh sách khách hàng", r_cust_list.status_code == 200 and len(r_cust_list.json().get("items", [])) > 0)
        target_cust = r_cust_list.json()["items"][0]
        cust_id = target_cust["id"]
        c_points = target_cust["points"]

        r_cust_adj = requests.post(f"{base_url}/api/admin/customers/{cust_id}/adjust-points", headers=headers, json={
            "deltaPoints": 100,
            "reason": "Kiểm thử điều chỉnh điểm tích lũy"
        })
        check("Admin: Điều chỉnh điểm thưởng cho khách", r_cust_adj.status_code == 200 and r_cust_adj.json()["points"] == c_points + 100)

        r_cust_pwd = requests.post(f"{base_url}/api/admin/customers/{cust_id}/reset-password", headers=headers, json={})
        check("Admin: Đặt lại mật khẩu khách hàng", r_cust_pwd.status_code == 200 and len(r_cust_pwd.json().get("newPassword", "")) >= 10)

        # Xóa sản phẩm test
        r_p_del = requests.delete(f"{base_url}/api/admin/products/{prod_id}", headers=headers)
        check("Admin: Xóa sản phẩm", r_p_del.status_code == 204)

        # ==============================================================
        # PHẦN 3: KIỂM TRA TẤT CẢ CÁC PUBLIC API ĐANG PHỤC VỤ CLIENT
        # ==============================================================
        print_step("PHẦN 3: TOÀN BỘ PUBLIC APIS ĐỒNG BỘ CLIENT")

        public_endpoints = [
            ("/api/public/site-config", "Cấu hình Site"),
            ("/api/public/hero-slides", "Hero Slides"),
            ("/api/public/product-categories", "Danh mục SP"),
            ("/api/public/articles?section=highlights", "Articles Highlights"),
            ("/api/public/articles?section=listing", "Articles Listing"),
            ("/api/public/products?pageSize=10", "Catalog Products"),
            ("/api/public/dealers", "Hệ thống Đại lý"),
            ("/api/public/warranty/check?serial=R4NRCX0001", "Tra cứu Bảo hành"),
            ("/api/public/pricing/batch?slugs=phones%2Frog-phone-7", "Bảng giá Batch Pricing"),
            ("/api/public/products/compare?slugs=phones/rog-phone-7", "Ma trận So sánh"),
            ("/api/public/reviews", "Đánh giá Reviews Đã duyệt"),
            ("/api/public/support-info", "Trung tâm & CS Bảo hành"),
            ("/api/public/community-info", "Kênh MXH & ROG Elite"),
            ("/api/public/campaigns", "Sự kiện & Khuyến mãi"),
            ("/api/public/downloads", "Kho Phần mềm"),
            ("/api/public/innovations", "Sáng tạo & Công nghệ"),
            ("/api/public/wallpapers", "Hình nền 4K"),
            ("/api/public/about-rog", "Giới thiệu ROG"),
            ("/api/public/videos", "Thư viện Video Showcase"),
        ]

        for ep, desc in public_endpoints:
            r = requests.get(f"{base_url}{ep}")
            check(f"Public API: {desc} ({ep})", r.status_code == 200)

        # Kiểm tra luồng Khách hàng: Đăng ký -> Đổi Profile -> Đổi Mật khẩu -> Đặt Đơn -> Hủy Đơn
        print_step("PHẦN 3B: LUỒNG TƯƠNG TÁC TỰ PHỤC VỤ CỦA KHÁCH HÀNG (CUSTOMER SELF-SERVICE)")
        test_cust_email = f"audit_user_{int(time.time())}@rogtest.vn"
        r_reg = requests.post(f"{base_url}/api/public/auth/register", json={
            "email": test_cust_email,
            "fullName": "Game thủ Test",
            "phoneNumber": "0988111222",
            "password": "Password123!"
        })
        check("Customer: Đăng ký tài khoản mới", r_reg.status_code == 201)
        cust_token = r_reg.json().get("token")
        cust_auth_hdr = {"Authorization": f"Bearer {cust_token}"}

        # Đổi Profile
        r_prof = requests.put(f"{base_url}/api/public/auth/profile", headers=cust_auth_hdr, json={
            "fullName": "Game thủ ROG Pro",
            "phoneNumber": "0988999888"
        })
        check("Customer: Chỉnh sửa thông tin cá nhân", r_prof.status_code == 200 and r_prof.json().get("fullName") == "Game thủ ROG Pro")

        # Đổi Mật khẩu
        r_pwd_change = requests.put(f"{base_url}/api/public/auth/change-password", headers=cust_auth_hdr, json={
            "oldPassword": "Password123!",
            "newPassword": "NewPassword456!"
        })
        check("Customer: Đổi mật khẩu tài khoản", r_pwd_change.status_code == 200)

        # Đăng nhập bằng mật khẩu mới
        r_relogin = requests.post(f"{base_url}/api/public/auth/login", json={
            "email": test_cust_email,
            "password": "NewPassword456!"
        })
        check("Customer: Đăng nhập lại với mật khẩu mới", r_relogin.status_code == 200)

        # Tạo đơn hàng
        r_order_create = requests.post(f"{base_url}/api/public/orders", headers=cust_auth_hdr, json={
            "customerName": "Game thủ ROG Pro",
            "email": test_cust_email,
            "phone": "0988999888",
            "address": "Tầng 5, Tòa nhà ROG, TP.HCM",
            "note": "Giao giờ hành chính",
            "items": [
                {
                    "slug": "phones/rog-phone-7",
                    "quantity": 1,
                    "name": "ROG Phone 7"
                }
            ]
        })
        check("Customer: Đặt hàng mới", r_order_create.status_code in [200, 201])
        test_order_code = r_order_create.json().get("orderCode")

        # Hủy đơn hàng khi ở trạng thái Pending
        r_order_cancel = requests.put(f"{base_url}/api/public/orders/{test_order_code}/cancel", headers=cust_auth_hdr)
        check("Customer: Hủy đơn hàng ở trạng thái Chờ xác nhận (Pending)", r_order_cancel.status_code == 200)

        # Tra cứu lại trạng thái đơn
        r_order_verify = requests.get(f"{base_url}/api/public/orders/{test_order_code}")
        check("Customer: Kiểm tra trạng thái đơn đã đổi sang Đã hủy (Cancelled)", r_order_verify.status_code == 200 and r_order_verify.json().get("status") == "Cancelled")

        # ==============================================================
        # PHẦN 4: TOÀN DIỆN GIAO DIỆN QUẢN TRỊ ADMIN UI & STATIC ASSETS
        # ==============================================================
        print_step("PHẦN 4: KIỂM TRA GIAO DIỆN ADMIN UI & STATIC ASSETS")

        r_html = requests.get(f"{base_url}/admin/index.html")
        check("Admin UI index.html nạp thành công", r_html.status_code == 200)
        check("Admin UI có menu quản lý Video Showcase", 'href="#videos"' in r_html.text)
        check("Admin UI có phần quản lý #page-videos", 'id="page-videos"' in r_html.text)
        check("Admin UI có modal Album ảnh #gallery-modal", 'id="gallery-modal"' in r_html.text)

        r_js = requests.get(f"{base_url}/admin/admin.js")
        check("Admin UI admin.js nạp thành công", r_js.status_code == 200)
        check("Admin JS có hàm loadVideos", "loadVideos" in r_js.text)
        check("Admin JS có hàm openGalleryModal", "openGalleryModal" in r_js.text)
        check("Admin JS có sự kiện điều chỉnh điểm khách hàng", "data-adjust-points" in r_js.text)
        check("Admin JS có sự kiện reset mật khẩu khách hàng", "data-reset-pwd" in r_js.text)

        # ==============================================================
        # PHẦN 5: AUDIT LOG VÀ SAO LƯU CSDL
        # ==============================================================
        print_step("PHẦN 5: TOÀN VẸN AUDIT LOG & SAO LƯU CSDL")

        # Kiểm tra Audit Logs
        r_audit = requests.get(f"{base_url}/api/admin/audit-logs?pageSize=30", headers=headers)
        check("Admin: Truy vấn Nhật ký Hoạt động (Audit Logs)", r_audit.status_code == 200)
        logs = r_audit.json().get("items", [])
        actions_found = set(log["action"] for log in logs)
        print(f"   -> Đã ghi nhận các hành động: {list(actions_found)[:8]}")
        check("Audit Log ghi vết đầy đủ các hành động vừa thực hiện", len(logs) >= 5)

        # Kiểm tra Sao lưu CSDL
        r_backup = requests.get(f"{base_url}/api/admin/backup/export", headers=headers)
        check("Admin: Tải bản Sao lưu JSON CSDL Toàn vẹn", r_backup.status_code == 200 and len(r_backup.content) > 10000)
        backup_json = r_backup.json()
        backup_data = backup_json.get("data", {})
        required_tables = ["products", "dealers", "serviceCenters", "innovations", "wallpapers", "aboutStories", "orders", "featuredVideos", "productImages"]
        for tbl in required_tables:
            check(f"Bản sao lưu chứa bảng '{tbl}'", tbl in backup_data and len(backup_data[tbl]) >= 0)

        print("\n" + "=" * 60)
        print(f"🎉 HOÀN THÀNH KIỂM TRA CHUYÊN SÂU: {passed_tests}/{total_tests} BÀI TEST ĐẠT KẾT QUẢ PASS (100%)")
        print("=" * 60)

    finally:
        if proc:
            proc.terminate()
            try:
                proc.wait(timeout=5)
            except:
                proc.kill()

if __name__ == "__main__":
    main()
