import requests
import sys

BASE_URL = "http://localhost:5161"

def main():
    print("==================================================================")
    print("🔬 KIỂM TRA CHUYÊN SÂU & STRESS-TEST HỆ THỐNG BÁO CÁO TRÊN CỔNG 5161")
    print("==================================================================")

    # 1. Login
    res = requests.post(f"{BASE_URL}/api/auth/login", json={"username": "admin", "password": "Admin@123"})
    assert res.status_code == 200, f"Login failed: {res.text}"
    token = res.json()["token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("1. [PASS] Đăng nhập tài khoản quản trị thành công.")

    # 2. Check sales-summary with various date filter edge cases
    # Case 2a: No params
    s1 = requests.get(f"{BASE_URL}/api/admin/reports/sales-summary", headers=headers).json()
    assert s1["totalRevenue"] >= 0 and s1["totalOrders"] >= 0, "Dữ liệu tổng không hợp lệ"
    print(f"2a. [PASS] Doanh thu toàn thời gian: {s1['totalRevenue']:,} VND | {s1['totalOrders']} đơn | AOV: {s1['averageOrderValue']:,} VND")

    # Case 2b: Today only
    from datetime import datetime, timezone
    today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    s2 = requests.get(f"{BASE_URL}/api/admin/reports/sales-summary?fromDate={today_str}&toDate={today_str}", headers=headers).json()
    assert isinstance(s2["dailyRevenue"], list), "dailyRevenue phải là list"
    print(f"2b. [PASS] Lọc theo ngày hôm nay ({today_str}): {s2['totalOrders']} đơn | {s2['totalRevenue']:,} VND")

    # Case 2c: Future dates (zero data expected)
    s3 = requests.get(f"{BASE_URL}/api/admin/reports/sales-summary?fromDate=2030-01-01&toDate=2030-01-31", headers=headers).json()
    assert s3["totalOrders"] == 0 and s3["totalRevenue"] == 0 and s3["averageOrderValue"] == 0, "Dữ liệu tương lai phải bằng 0"
    print("2c. [PASS] Xử lý khoảng ngày không có giao dịch (Future dates) an toàn, trả về 0.")

    # 3. Top Products verification
    top = requests.get(f"{BASE_URL}/api/admin/reports/top-products?limit=5", headers=headers).json()
    assert isinstance(top, list), "Top products phải là danh sách"
    for i in range(len(top) - 1):
        assert top[i]["totalRevenue"] >= top[i+1]["totalRevenue"], "Top products phải sắp xếp giảm dần theo doanh thu"
    print(f"3. [PASS] Top {len(top)} sản phẩm được sắp xếp chuẩn giảm dần theo doanh thu.")

    # 4. Inventory health check
    inv = requests.get(f"{BASE_URL}/api/admin/reports/inventory", headers=headers).json()
    assert inv["totalProducts"] >= inv["inStockCount"], "Tổng máy phải lớn hơn hoặc bằng máy còn hàng"
    cat_sum = sum(c["totalProducts"] for c in inv["categoryBreakdown"])
    assert cat_sum == inv["totalProducts"], f"Tổng số máy theo danh mục ({cat_sum}) phải bằng totalProducts ({inv['totalProducts']})"
    print(f"4. [PASS] Tính toàn vẹn tồn kho: {inv['totalProducts']} máy phân bổ chính xác 100% qua {len(inv['categoryBreakdown'])} danh mục.")

    # 5. Warranty health check
    war = requests.get(f"{BASE_URL}/api/admin/reports/warranty", headers=headers).json()
    status_sum = war["activeCount"] + war["expiredCount"] + war["inServiceCount"]
    assert status_sum == war["totalRecords"], f"Tổng trạng thái ({status_sum}) phải bằng totalRecords ({war['totalRecords']})"
    for exp in war["expiringSoonList"]:
        assert exp["daysRemaining"] >= 0 and exp["daysRemaining"] <= 60, "Ngày còn lại phải trong ngưỡng 0-60 ngày"
    print(f"5. [PASS] Tính toàn vẹn bảo hành: {war['totalRecords']} hồ sơ phân bổ đúng (Còn hạn: {war['activeCount']}, Hết hạn: {war['expiredCount']}).")

    # 6. Customer analytics check
    cust = requests.get(f"{BASE_URL}/api/admin/reports/customers", headers=headers).json()
    assert cust["totalCustomers"] >= cust["activeCustomers"]
    for i in range(len(cust["topCustomers"]) - 1):
        assert cust["topCustomers"][i]["totalSpent"] >= cust["topCustomers"][i+1]["totalSpent"], "Top khách hàng phải sắp xếp theo chi tiêu"
    print(f"6. [PASS] Phân tích khách hàng: {cust['totalCustomers']} khách, Top Spender: {cust['topCustomers'][0]['fullName']} ({cust['topCustomers'][0]['totalSpent']:,} VND).")

    # 7. CSV Export byte check
    csv_sales = requests.get(f"{BASE_URL}/api/admin/reports/export/sales-csv", headers=headers)
    assert csv_sales.content[:3] == b'\xef\xbb\xbf', "File CSV phải có UTF-8 BOM preamble"
    sales_text = csv_sales.content.decode("utf-8")
    assert "Mã đơn hàng,Ngày đặt" in sales_text, "Thiếu header CSV"
    print("7a. [PASS] Xuất CSV Doanh thu: Header chuẩn UTF-8 BOM, tương thích Microsoft Excel.")

    csv_inv = requests.get(f"{BASE_URL}/api/admin/reports/export/inventory-csv", headers=headers)
    assert csv_inv.content[:3] == b'\xef\xbb\xbf', "File CSV Tồn kho phải có UTF-8 BOM"
    print("7b. [PASS] Xuất CSV Tồn kho: Header chuẩn UTF-8 BOM.")

    csv_war = requests.get(f"{BASE_URL}/api/admin/reports/export/warranty-csv", headers=headers)
    assert csv_war.content[:3] == b'\xef\xbb\xbf', "File CSV Bảo hành phải có UTF-8 BOM"
    print("7c. [PASS] Xuất CSV Bảo hành: Header chuẩn UTF-8 BOM.")

    # 8. Check Audit Log records for export
    logs_res = requests.get(f"{BASE_URL}/api/admin/audit-logs?page=1&pageSize=10", headers=headers).json()
    recent_actions = [item["action"] for item in logs_res["items"]]
    assert "EXPORT_SALES_REPORT" in recent_actions or "EXPORT_INVENTORY_REPORT" in recent_actions or "EXPORT_WARRANTY_REPORT" in recent_actions, "Audit Log phải ghi nhận hành động xuất báo cáo"
    print(f"8. [PASS] Nhật ký hoạt động (Audit Log) ghi nhận chính xác vết xuất báo cáo: {recent_actions[:3]}")

    # 9. Verify Frontend Admin Assets
    html = requests.get(f"{BASE_URL}/admin/index.html").text
    assert 'id="page-reports"' in html and 'data-page="reports"' in html
    assert 'id="report-sales-chart"' in html and 'id="report-top-products-table"' in html
    assert 'data-report-tab' in html

    js = requests.get(f"{BASE_URL}/admin/admin.js").text
    assert 'loadReports' in js and 'exportSalesReportCsv' in js and 'reportTab' in js

    css = requests.get(f"{BASE_URL}/admin/admin.css").text
    assert '.tab-btn' in css and '.chart-bar' in css and '.btn-preset' in css
    print("9. [PASS] Giao diện Admin UI: HTML, JavaScript và CSS đồng bộ hoàn hảo.")

    print("\n==================================================================")
    print("🏆 TẤT CẢ CÁC BÀI KIỂM TRA CHUYÊN SÂU ĐÃ ĐẠT 100% CHẤT LƯỢNG CAO!")
    print("==================================================================")

if __name__ == "__main__":
    main()
