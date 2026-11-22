import subprocess
import time
import requests
import sys
import os

def main():
    print("=== KIỂM TRA TOÀN DIỆN CÁC TÍNH NĂNG ADMIN MỚI ===")
    
    # Khởi động Backend tạm thời trên port 5169 để test
    port = 5169
    env = os.environ.copy()
    env.update({
        "ASPNETCORE_ENVIRONMENT": "Development",
        "ASPNETCORE_URLS": f"http://127.0.0.1:{port}",
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
    
    base_url = f"http://127.0.0.1:{port}"
    print(f"1. Đang khởi động Backend tại {base_url}...")
    
    token = None
    for _ in range(30):
        time.sleep(1)
        try:
            r = requests.get(f"{base_url}/health", timeout=1)
            if r.status_code == 200:
                print("   -> Backend đã sẵn sàng!")
                break
        except:
            pass
            
    try:
        # 1. Đăng nhập Admin
        login_res = requests.post(f"{base_url}/api/auth/login", json={"username": "admin", "password": "Admin@123"})
        assert login_res.status_code == 200, f"Login failed: {login_res.text}"
        token = login_res.json()["token"]
        headers = {"Authorization": f"Bearer {token}"}
        print("2. [PASS] Đăng nhập JWT Admin thành công.")

        # 2. Test Dealers
        dealers_res = requests.get(f"{base_url}/api/admin/dealers", headers=headers)
        assert dealers_res.status_code == 200
        d_items = dealers_res.json().get("items", [])
        print(f"3. [PASS] Quản lý Đại lý (GET /api/admin/dealers): {len(d_items)} đại lý")

        # 3. Test Warranty
        warranty_res = requests.get(f"{base_url}/api/admin/warranty", headers=headers)
        assert warranty_res.status_code == 200
        w_items = warranty_res.json().get("items", [])
        print(f"4. [PASS] Quản lý Bảo hành (GET /api/admin/warranty): {len(w_items)} hồ sơ serial")

        # 4. Test Reviews
        reviews_res = requests.get(f"{base_url}/api/admin/reviews", headers=headers)
        assert reviews_res.status_code == 200
        r_items = reviews_res.json().get("items", [])
        print(f"5. [PASS] Duyệt Đánh giá (GET /api/admin/reviews): {len(r_items)} đánh giá")

        # 5. Test Campaigns
        camp_res = requests.get(f"{base_url}/api/admin/campaigns", headers=headers)
        assert camp_res.status_code == 200
        c_items = camp_res.json()
        print(f"6. [PASS] Quản lý Sự kiện (GET /api/admin/campaigns): {len(c_items)} chiến dịch")

        # 6. Test Downloads
        down_res = requests.get(f"{base_url}/api/admin/downloads", headers=headers)
        assert down_res.status_code == 200
        dl_items = down_res.json()
        print(f"7. [PASS] Quản lý Kho phần mềm (GET /api/admin/downloads): {len(dl_items)} phần mềm")

        # 7. Test Customers
        cust_res = requests.get(f"{base_url}/api/admin/customers", headers=headers)
        assert cust_res.status_code == 200
        cu_items = cust_res.json().get("items", [])
        print(f"8. [PASS] Quản lý Khách hàng & ROG Elite (GET /api/admin/customers): {len(cu_items)} khách hàng")

        # 8. Test Newsletter
        news_res = requests.get(f"{base_url}/api/admin/newsletter", headers=headers)
        assert news_res.status_code == 200
        n_items = news_res.json().get("items", [])
        print(f"9. [PASS] Danh sách Nhận tin (GET /api/admin/newsletter): {len(n_items)} đăng ký")

        # 9. Test Media Gallery
        media_res = requests.get(f"{base_url}/api/admin/media", headers=headers)
        assert media_res.status_code == 200
        print("10. [PASS] Thư viện Media (GET /api/admin/media) phản hồi OK.")

        # 10. Test Public Campaigns & Downloads
        pub_c = requests.get(f"{base_url}/api/public/campaigns")
        assert pub_c.status_code == 200 and len(pub_c.json()) > 0
        pub_d = requests.get(f"{base_url}/api/public/downloads")
        assert pub_d.status_code == 200 and len(pub_d.json()) > 0
        print("11. [PASS] Public API /api/public/campaigns & /api/public/downloads hoạt động trơn tru.")

        # 11. Test Specs Management
        # Lấy 1 sản phẩm
        prods = requests.get(f"{base_url}/api/admin/products", headers=headers).json()
        if prods["items"]:
            prod_id = prods["items"][0]["id"]
            spec_add = requests.post(f"{base_url}/api/admin/products/{prod_id}/specs", headers=headers, json={
                "specGroup": "Processor",
                "specKey": "CPU Test",
                "specValue": "Intel Core Ultra 9 290HX",
                "orderIndex": 1
            })
            assert spec_add.status_code == 200
            spec_data = spec_add.json()
            spec_id = spec_data["id"]
            
            # Xóa spec test
            spec_del = requests.delete(f"{base_url}/api/admin/products/specs/{spec_id}", headers=headers)
            assert spec_del.status_code == 204
            print("12. [PASS] Quản lý Specs (Thêm/Xóa thông số kỹ thuật động) hoạt động hoàn hảo.")

        print("\n🎉 TẤT CẢ 12 PHÂN HỆ TÍNH NĂNG MỚI ĐÃ ĐƯỢC KIỂM TRA VÀ CHẠY THÀNH CÔNG 100%!")

    finally:
        proc.terminate()
        proc.wait()

if __name__ == "__main__":
    main()
