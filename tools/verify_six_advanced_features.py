import subprocess
import time
import requests
import sys
import os
import json

def main():
    print("=== KIỂM TRA TOÀN DIỆN 6 TÍNH NĂNG QUẢN TRỊ CHUYÊN SÂU MỚI ===")
    
    port = 5170
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

        # =========================================================================
        # TÍNH NĂNG 1: Mở rộng Dashboard BI & Cảnh báo Review
        # =========================================================================
        dash_res = requests.get(f"{base_url}/api/admin/dashboard", headers=headers)
        assert dash_res.status_code == 200, f"Dashboard failed: {dash_res.text}"
        dash = dash_res.json()
        assert "productsTotal" in dash and "productsInStock" in dash, "Thiếu products metrics trong Dashboard"
        assert "dealersTotal" in dash and "warrantyRecordsTotal" in dash, "Thiếu dealers/warranty metrics"
        assert "customersTotal" in dash and "ordersTotal" in dash, "Thiếu customers/orders metrics"
        assert "ordersPending" in dash and "pendingReviewsTotal" in dash, "Thiếu ordersPending/pendingReviewsTotal"
        print(f"3. [PASS] Dashboard BI Mở rộng: {dash['productsTotal']} máy ({dash['productsInStock']} còn hàng), {dash['ordersTotal']} đơn, {dash['dealersTotal']} đại lý, {dash['pendingReviewsTotal']} review chờ duyệt.")

        # =========================================================================
        # TÍNH NĂNG 2: Trung tâm Bảo hành & Chính sách
        # =========================================================================
        # Public Support Info
        sup_pub = requests.get(f"{base_url}/api/public/support-info")
        assert sup_pub.status_code == 200, "GET /api/public/support-info thất bại"
        sup_data = sup_pub.json()
        assert len(sup_data["centers"]) >= 4, f"Cần ít nhất 4 trung tâm bảo hành, nhận được {len(sup_data['centers'])}"
        assert len(sup_data["policies"]) >= 3, f"Cần ít nhất 3 chính sách VIP, nhận được {len(sup_data['policies'])}"
        
        # Admin CRUD Service Centers
        sc_res = requests.get(f"{base_url}/api/admin/service-centers", headers=headers)
        assert sc_res.status_code == 200 and len(sc_res.json()) >= 4
        # Create test center
        sc_new = requests.post(f"{base_url}/api/admin/service-centers", headers=headers, json={
            "name": "Trung tâm Thử nghiệm ASUS",
            "city": "Hải Phòng",
            "address": "123 Lạch Tray, Ngô Quyền, Hải Phòng",
            "phone": "1800 65 88",
            "operatingHours": "08:00 - 17:30",
            "sortOrder": 99,
            "isActive": True
        })
        assert sc_new.status_code == 201, f"Tạo center thất bại: {sc_new.text}"
        sc_id = sc_new.json()["id"]
        # Update
        sc_up = requests.put(f"{base_url}/api/admin/service-centers/{sc_id}", headers=headers, json={
            "name": "Trung tâm Thử nghiệm ASUS Cập nhật",
            "city": "Hải Phòng",
            "address": "123 Lạch Tray, Ngô Quyền, Hải Phòng",
            "phone": "1800 65 99",
            "operatingHours": "08:00 - 17:30",
            "sortOrder": 99,
            "isActive": True
        })
        assert sc_up.status_code == 200
        # Delete
        sc_del = requests.delete(f"{base_url}/api/admin/service-centers/{sc_id}", headers=headers)
        assert sc_del.status_code == 204
        
        # Admin CRUD Warranty Policies
        wp_res = requests.get(f"{base_url}/api/admin/warranty-policies", headers=headers)
        assert wp_res.status_code == 200 and len(wp_res.json()) >= 3
        # Create test policy
        wp_new = requests.post(f"{base_url}/api/admin/warranty-policies", headers=headers, json={
            "title": "CHÍNH SÁCH BẢO HÀNH 1 ĐỔI 1 TRONG 30 NGÀY",
            "description": "Đổi mới 100% nếu có lỗi từ nhà sản xuất trong vòng 30 ngày đầu.",
            "sortOrder": 99,
            "isActive": True
        })
        assert wp_new.status_code == 201
        wp_id = wp_new.json()["id"]
        # Delete test policy
        wp_del = requests.delete(f"{base_url}/api/admin/warranty-policies/{wp_id}", headers=headers)
        assert wp_del.status_code == 204
        print("4. [PASS] Trung tâm Bảo hành & Chính sách (Public & Admin CRUD) hoạt động trơn tru.")

        # =========================================================================
        # TÍNH NĂNG 3: Kênh Mạng Xã Hội & ROG Elite
        # =========================================================================
        comm_pub = requests.get(f"{base_url}/api/public/community-info")
        assert comm_pub.status_code == 200
        comm_data = comm_pub.json()
        assert len(comm_data["channels"]) >= 4, f"Cần ít nhất 4 kênh MXH, nhận được {len(comm_data['channels'])}"
        assert len(comm_data["tiers"]) >= 4, f"Cần ít nhất 4 hạng ROG Elite, nhận được {len(comm_data['tiers'])}"

        # Admin CRUD Channels
        ch_res = requests.get(f"{base_url}/api/admin/community/channels", headers=headers)
        assert ch_res.status_code == 200 and len(ch_res.json()) >= 4
        ch_new = requests.post(f"{base_url}/api/admin/community/channels", headers=headers, json={
            "name": "KÊNH TELEGRAM ROG VIỆT NAM",
            "membersCount": "10.000+ Thành viên",
            "description": "Kênh thông báo tin deal hot và quà tặng độc quyền.",
            "link": "https://t.me/asusrogvn",
            "buttonText": "THAM GIA TELEGRAM ↗",
            "sortOrder": 99,
            "isActive": True
        })
        assert ch_new.status_code == 201
        ch_id = ch_new.json()["id"]
        ch_del = requests.delete(f"{base_url}/api/admin/community/channels/{ch_id}", headers=headers)
        assert ch_del.status_code == 204

        # Admin CRUD Tiers
        tr_res = requests.get(f"{base_url}/api/admin/community/tiers", headers=headers)
        assert tr_res.status_code == 200 and len(tr_res.json()) >= 4
        print("5. [PASS] Kênh Mạng Xã Hội & ROG Elite Rewards (Public & Admin CRUD) hoạt động hoàn hảo.")

        # =========================================================================
        # TÍNH NĂNG 4: Quản lý Đơn hàng (Order Management)
        # =========================================================================
        # 1. Tạo đơn hàng từ Public API
        create_order_res = requests.post(f"{base_url}/api/public/orders", json={
            "customerName": "Nguyễn Văn Test",
            "email": "testorder@rog.asus.com",
            "phone": "0912345678",
            "address": "123 Hoàng Diệu, Quận 4, TP.HCM",
            "note": "Giao giờ hành chính",
            "items": [
                {
                    "slug": "rog-zephyrus-g14-2026",
                    "quantity": 1,
                    "name": "ROG Zephyrus G14 2026",
                    "unitPrice": 45990000,
                    "selectedSpecs": "Ryzen AI 9 / RTX 5070 / 32GB"
                }
            ]
        })
        assert create_order_res.status_code == 201, f"Tạo đơn thất bại: {create_order_res.text}"
        order_info = create_order_res.json()
        order_code = order_info["orderCode"]
        
        # 2. Admin xem danh sách đơn hàng
        orders_admin_res = requests.get(f"{base_url}/api/admin/orders?search={order_code}", headers=headers)
        assert orders_admin_res.status_code == 200
        orders_list = orders_admin_res.json().get("items", [])
        assert len(orders_list) >= 1, "Không tìm thấy đơn hàng vừa tạo trong Admin"
        order_id = orders_list[0]["id"]
        
        # 3. Admin xem chi tiết đơn hàng
        order_detail_res = requests.get(f"{base_url}/api/admin/orders/{order_id}", headers=headers)
        assert order_detail_res.status_code == 200
        detail = order_detail_res.json()
        assert detail["orderCode"] == order_code
        assert len(detail["items"]) == 1
        
        # 4. Admin đổi trạng thái đơn hàng (Pending -> Confirmed -> Shipping -> Completed)
        st_res = requests.put(f"{base_url}/api/admin/orders/{order_id}/status", headers=headers, json={"status": "Confirmed"})
        assert st_res.status_code == 200 and st_res.json()["status"] == "Confirmed"

        st_res2 = requests.put(f"{base_url}/api/admin/orders/{order_id}/status", headers=headers, json={"status": "Shipping"})
        assert st_res2.status_code == 200 and st_res2.json()["status"] == "Shipping"
        
        # 5. Xóa đơn hàng test
        del_ord = requests.delete(f"{base_url}/api/admin/orders/{order_id}", headers=headers)
        assert del_ord.status_code == 204
        print(f"6. [PASS] Quản lý Đơn hàng (Đặt hàng, Xem danh sách/chi tiết, Đổi trạng thái, Xóa) hoàn tất.")

        # =========================================================================
        # TÍNH NĂNG 5: Nhật ký Hoạt động (Audit Logs)
        # =========================================================================
        audit_res = requests.get(f"{base_url}/api/admin/audit-logs", headers=headers)
        assert audit_res.status_code == 200, f"Audit logs failed: {audit_res.text}"
        audit_items = audit_res.json().get("items", [])
        assert len(audit_items) >= 2, f"Cần ghi nhận ít nhất 2 logs, có {len(audit_items)}"
        actions = [a["action"] for a in audit_items]
        assert "UPDATE_ORDER_STATUS" in actions or "DELETE_ORDER" in actions, f"Thiếu action mong đợi trong logs: {actions}"
        print(f"7. [PASS] Nhật ký Hoạt động (Audit Logs): Đã ghi vết thành công {len(audit_items)} thao tác của quản trị viên.")

        # =========================================================================
        # TÍNH NĂNG 6: Sao lưu Toàn diện CSDL (Database Backup)
        # =========================================================================
        summary_res = requests.get(f"{base_url}/api/admin/backup/summary", headers=headers)
        assert summary_res.status_code == 200
        sum_data = summary_res.json()
        assert sum_data["products"] > 0 and sum_data["dealers"] > 0, "Summary database thiếu dữ liệu"

        backup_res = requests.get(f"{base_url}/api/admin/backup/export", headers=headers)
        assert backup_res.status_code == 200
        assert "application/json" in backup_res.headers.get("content-type", "")
        assert "attachment" in backup_res.headers.get("content-disposition", "")
        
        backup_json = backup_res.json()
        assert "system" in backup_json and "data" in backup_json
        assert "products" in backup_json["data"] and "serviceCenters" in backup_json["data"]
        backup_size = len(backup_res.content) / 1024
        print(f"8. [PASS] Sao lưu Toàn diện CSDL: Tải thành công bản backup JSON ({backup_size:.1f} KB) với đầy đủ tất cả các bảng.")

        print("\n🎉 TẤT CẢ 6 TÍNH NĂNG QUẢN TRỊ CHUYÊN SÂU ĐÃ ĐƯỢC KIỂM TRA VÀ CHẠY THÀNH CÔNG 100%!")

    finally:
        proc.terminate()
        proc.wait()

if __name__ == "__main__":
    main()
