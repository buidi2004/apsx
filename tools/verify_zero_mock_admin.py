import subprocess
import time
import requests
import sys
import os

def main():
    print("=== KIỂM TRA ZERO MOCK & TOÀN BỘ KHẢ NĂNG QUẢN TRỊ ADMIN ===")
    
    port = 5171
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

        # 2. Public Endpoints Verification
        innovations_pub = requests.get(f"{base_url}/api/public/innovations").json()
        assert len(innovations_pub) >= 4, f"Expected at least 4 innovations, got {len(innovations_pub)}"
        print(f"3. [PASS] Public API Innovations: {len(innovations_pub)} công nghệ (Intelligent Cooling, Nebula...)")

        wallpapers_pub = requests.get(f"{base_url}/api/public/wallpapers").json()
        assert len(wallpapers_pub) >= 4, f"Expected at least 4 wallpapers, got {len(wallpapers_pub)}"
        print(f"4. [PASS] Public API Wallpapers 4K: {len(wallpapers_pub)} hình nền")

        about_pub = requests.get(f"{base_url}/api/public/about-rog").json()
        assert "heroTitle" in about_pub and len(about_pub["stories"]) >= 3
        print(f"5. [PASS] Public API About ROG: Hero={about_pub['heroTitle']}, {len(about_pub['stories'])} câu chuyện lịch sử")

        products_pub = requests.get(f"{base_url}/api/public/products?pageSize=5").json()
        assert len(products_pub.get("items", [])) > 0
        print(f"6. [PASS] Public API Catalog Products: {products_pub['totalCount']} sản phẩm kết nối Store & Compare")

        # 3. Admin CRUD - Innovations
        new_inno = requests.post(f"{base_url}/api/admin/innovations", headers=headers, json={
            "tag": "// TEST TECH",
            "title": "Quantum Vapor Chamber 2026",
            "description": "Hệ thống tản nhiệt lượng tử thử nghiệm cho ROG Ally Next",
            "highlightsJson": "[\"Ống dẫn nhiệt nano carbon\", \"Keo gốm dẫn nhiệt siêu dẫn\"]",
            "imageUrl": "/sites/rog-asus/img/detail/gu605-cooling.webp",
            "sortOrder": 99,
            "isActive": True
        })
        assert new_inno.status_code == 201, f"Failed to create innovation: {new_inno.text}"
        inno_id = new_inno.json()["id"]
        print(f"7. [PASS] Admin POST /api/admin/innovations -> Tạo mới #{inno_id}")

        up_inno = requests.put(f"{base_url}/api/admin/innovations/{inno_id}", headers=headers, json={
            "tag": "// TEST TECH UPDATED",
            "title": "Quantum Vapor Chamber 2026 (Updated)",
            "description": "Mô tả đã được cập nhật thành công",
            "highlightsJson": "[\"Đã update\"]",
            "imageUrl": "/sites/rog-asus/img/detail/gu605-cooling.webp",
            "sortOrder": 100,
            "isActive": True
        })
        assert up_inno.status_code == 200, f"Failed to update innovation: {up_inno.text}"
        print(f"8. [PASS] Admin PUT /api/admin/innovations/{inno_id} -> Cập nhật thành công")

        del_inno = requests.delete(f"{base_url}/api/admin/innovations/{inno_id}", headers=headers)
        assert del_inno.status_code == 204
        print(f"9. [PASS] Admin DELETE /api/admin/innovations/{inno_id} -> Xóa thành công")

        # 4. Admin CRUD - Wallpapers
        new_wp = requests.post(f"{base_url}/api/admin/wallpapers", headers=headers, json={
            "title": "ROG Cyber Horizon 8K",
            "resolution": "7680 x 4320 (8K)",
            "imageUrl": "/sites/rog-asus/img/hero/gamescom.webp",
            "downloadUrl": "/sites/rog-asus/img/hero/gamescom.webp",
            "sortOrder": 50,
            "isActive": True
        })
        assert new_wp.status_code == 201
        wp_id = new_wp.json()["id"]
        print(f"10. [PASS] Admin POST /api/admin/wallpapers -> Tạo mới #{wp_id}")

        up_wp = requests.put(f"{base_url}/api/admin/wallpapers/{wp_id}", headers=headers, json={
            "title": "ROG Cyber Horizon 8K (Updated)",
            "resolution": "7680 x 4320 (8K)",
            "imageUrl": "/sites/rog-asus/img/hero/gamescom.webp",
            "downloadUrl": "/sites/rog-asus/img/hero/gamescom.webp",
            "sortOrder": 51,
            "isActive": True
        })
        assert up_wp.status_code == 200
        print(f"11. [PASS] Admin PUT /api/admin/wallpapers/{wp_id} -> Cập nhật thành công")

        del_wp = requests.delete(f"{base_url}/api/admin/wallpapers/{wp_id}", headers=headers)
        assert del_wp.status_code == 204
        print(f"12. [PASS] Admin DELETE /api/admin/wallpapers/{wp_id} -> Xóa thành công")

        # 5. Admin CRUD - About Stories
        new_st = requests.post(f"{base_url}/api/admin/about-stories", headers=headers, json={
            "yearTag": "NĂM 2027 // TƯƠNG LAI",
            "heading": "KỶ NGUYÊN CHIẾN BINH ROG MỚI",
            "content": "ROG tiếp tục định hình thế giới gaming...",
            "imageUrl": "/sites/rog-asus/img/mb/hot-crosshair-x870e.webp",
            "sortOrder": 99,
            "isActive": True
        })
        assert new_st.status_code == 201
        st_id = new_st.json()["id"]
        print(f"13. [PASS] Admin POST /api/admin/about-stories -> Tạo mới #{st_id}")

        up_st = requests.put(f"{base_url}/api/admin/about-stories/{st_id}", headers=headers, json={
            "yearTag": "NĂM 2027 // TƯƠNG LAI (UPDATED)",
            "heading": "KỶ NGUYÊN CHIẾN BINH ROG MỚI",
            "content": "ROG tiếp tục định hình thế giới gaming (Updated)...",
            "imageUrl": "/sites/rog-asus/img/mb/hot-crosshair-x870e.webp",
            "sortOrder": 100,
            "isActive": True
        })
        assert up_st.status_code == 200
        print(f"14. [PASS] Admin PUT /api/admin/about-stories/{st_id} -> Cập nhật thành công")

        del_st = requests.delete(f"{base_url}/api/admin/about-stories/{st_id}", headers=headers)
        assert del_st.status_code == 204
        print(f"15. [PASS] Admin DELETE /api/admin/about-stories/{st_id} -> Xóa thành công")

        # 6. Audit Log Verification
        logs_res = requests.get(f"{base_url}/api/admin/audit-logs?pageSize=10", headers=headers).json()
        actions = [log["action"] for log in logs_res.get("items", [])]
        assert "CREATE_INNOVATION" in actions or "DELETE_INNOVATION" in actions
        print(f"16. [PASS] Audit Log tự động ghi lại hành vi quản trị Admin: {actions[:4]}")

        print("\n>>> TẤT CẢ 16/16 BƯỚC KIỂM TRA ĐỀU THÀNH CÔNG 100%! ZERO MOCK HOÀN TẤT! <<<")

    finally:
        proc.terminate()
        try:
            proc.wait(timeout=5)
        except:
            proc.kill()

if __name__ == "__main__":
    main()
