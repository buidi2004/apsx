import os
import sys
import time
import subprocess
import requests

def main():
    print("==============================================================")
    print("🚀 BẮT ĐẦU KIỂM TRA TOÀN DIỆN HỆ THỐNG BÁO CÁO ADMIN (REPORTS)")
    print("==============================================================")

    port = 5173
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
    print(f"1. Đang khởi động Backend test tại {base_url}...")

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

    passed = 0
    failed = 0

    def check(name, condition, extra=""):
        nonlocal passed, failed
        if condition:
            print(f"  [PASS] {name}")
            passed += 1
        else:
            print(f"  [FAIL] {name}: {extra}")
            failed += 1

    try:
        # 1. Đăng nhập Admin lấy token
        login_res = requests.post(f"{base_url}/api/auth/login", json={"username": "admin", "password": "Admin@123"})
        check("Đăng nhập JWT Admin", login_res.status_code == 200 and "token" in login_res.json())
        token = login_res.json()["token"]
        headers = {"Authorization": f"Bearer {token}"}

        # 2. Kiểm tra bảo mật: Bị chặn 401 khi không có token
        unauth_res = requests.get(f"{base_url}/api/admin/reports/sales-summary")
        check("Bảo mật: Từ chối 401 khi không có JWT Token", unauth_res.status_code == 401)

        # 3. Kiểm tra Sales Summary (Báo cáo doanh thu & đơn hàng)
        sales_res = requests.get(f"{base_url}/api/admin/reports/sales-summary", headers=headers)
        check("GET /api/admin/reports/sales-summary trả về 200", sales_res.status_code == 200)
        sales_data = sales_res.json()
        check("Sales Summary có các trường doanh thu & đơn hàng", 
              "totalRevenue" in sales_data and "totalOrders" in sales_data and "averageOrderValue" in sales_data and "cancellationRate" in sales_data,
              f"Data: {sales_data}")
        check("DailyRevenue và StatusBreakdown có dữ liệu", 
              isinstance(sales_data.get("dailyRevenue"), list) and isinstance(sales_data.get("statusBreakdown"), list))
        print(f"      -> Tổng doanh thu: {sales_data.get('totalRevenue'):,} VND | Tổng đơn: {sales_data.get('totalOrders')} | AOV: {sales_data.get('averageOrderValue'):,} VND")

        # 4. Kiểm tra Lọc theo khoảng ngày (Date Range Filtering)
        sales_filter = requests.get(f"{base_url}/api/admin/reports/sales-summary?fromDate=2026-01-01&toDate=2026-12-31", headers=headers)
        check("Lọc doanh thu theo ngày hợp lệ trả về 200", sales_filter.status_code == 200)

        # 5. Kiểm tra Top Sản phẩm Bán chạy
        top_res = requests.get(f"{base_url}/api/admin/reports/top-products?limit=5", headers=headers)
        check("GET /api/admin/reports/top-products trả về 200", top_res.status_code == 200)
        top_list = top_res.json()
        check("Top products là danh sách", isinstance(top_list, list))
        if top_list:
            top_item = top_list[0]
            check("Sản phẩm top có đầy đủ trường phân tích", 
                  "slug" in top_item and "quantitySold" in top_item and "totalRevenue" in top_item)
            print(f"      -> Top #1 bán chạy: {top_item.get('name')} (Đã bán: {top_item.get('quantitySold')}, Doanh thu: {top_item.get('totalRevenue'):,} VND)")

        # 6. Kiểm tra Báo cáo Tồn kho (Inventory Report)
        inv_res = requests.get(f"{base_url}/api/admin/reports/inventory", headers=headers)
        check("GET /api/admin/reports/inventory trả về 200", inv_res.status_code == 200)
        inv_data = inv_res.json()
        check("Báo cáo tồn kho có thống kê trạng thái kho", 
              "totalProducts" in inv_data and "inStockCount" in inv_data and "categoryBreakdown" in inv_data)
        print(f"      -> Tổng máy: {inv_data.get('totalProducts')} (Còn hàng: {inv_data.get('inStockCount')}, Hết hàng: {inv_data.get('outOfStockCount')})")

        # 7. Kiểm tra Báo cáo Bảo hành (Warranty Report)
        war_res = requests.get(f"{base_url}/api/admin/reports/warranty", headers=headers)
        check("GET /api/admin/reports/warranty trả về 200", war_res.status_code == 200)
        war_data = war_res.json()
        check("Báo cáo bảo hành có thống kê hạn bảo hành & cảnh báo", 
              "totalRecords" in war_data and "activeCount" in war_data and "expiringSoonCount" in war_data and "byServiceCenter" in war_data)
        print(f"      -> Tổng hồ sơ: {war_data.get('totalRecords')} (Còn hạn: {war_data.get('activeCount')}, Hết hạn: {war_data.get('expiredCount')}, Sắp hết hạn: {war_data.get('expiringSoonCount')})")

        # 8. Kiểm tra Báo cáo Khách hàng & Elite (Customer Analytics)
        cust_res = requests.get(f"{base_url}/api/admin/reports/customers", headers=headers)
        check("GET /api/admin/reports/customers trả về 200", cust_res.status_code == 200)
        cust_data = cust_res.json()
        check("Phân tích khách hàng có tier breakdown & top spenders", 
              "totalCustomers" in cust_data and "totalPointsIssued" in cust_data and "topCustomers" in cust_data)
        print(f"      -> Tổng hội viên: {cust_data.get('totalCustomers')} (Tổng điểm ROG Elite: {cust_data.get('totalPointsIssued'):,})")

        # 9. Kiểm tra Xuất Báo cáo CSV Doanh thu
        csv_sales = requests.get(f"{base_url}/api/admin/reports/export/sales-csv", headers=headers)
        check("GET /api/admin/reports/export/sales-csv trả về 200", csv_sales.status_code == 200)
        check("CSV Content-Type text/csv", "text/csv" in csv_sales.headers.get("Content-Type", ""))
        check("CSV có UTF-8 BOM và tiêu đề cột tiếng Việt", "Mã đơn hàng" in csv_sales.content.decode("utf-8-sig"))

        # 10. Kiểm tra Xuất Báo cáo CSV Tồn kho
        csv_inv = requests.get(f"{base_url}/api/admin/reports/export/inventory-csv", headers=headers)
        check("GET /api/admin/reports/export/inventory-csv trả về 200", csv_inv.status_code == 200)
        check("CSV tồn kho có tiêu đề cột", "Tên sản phẩm" in csv_inv.content.decode("utf-8-sig"))

        # 11. Kiểm tra Xuất Báo cáo CSV Bảo hành
        csv_war = requests.get(f"{base_url}/api/admin/reports/export/warranty-csv", headers=headers)
        check("GET /api/admin/reports/export/warranty-csv trả về 200", csv_war.status_code == 200)
        check("CSV bảo hành có tiêu đề cột", "Số Serial" in csv_war.content.decode("utf-8-sig"))

        # 12. Kiểm tra Giao diện Static Assets (HTML, JS, CSS)
        idx_res = requests.get(f"{base_url}/admin/index.html")
        check("admin/index.html có section #page-reports", idx_res.status_code == 200 and 'id="page-reports"' in idx_res.text)
        check("admin/index.html có menu link #reports", 'href="#reports"' in idx_res.text)
        check("admin/index.html có biểu đồ #report-sales-chart", 'id="report-sales-chart"' in idx_res.text)
        check("admin/index.html có các nút xuất CSV", 'id="export-sales-report-btn"' in idx_res.text)

        js_res = requests.get(f"{base_url}/admin/admin.js")
        check("admin/admin.js có loadReports", js_res.status_code == 200 and "loadReports" in js_res.text)
        check("admin/admin.js có exportSalesReportCsv", "exportSalesReportCsv" in js_res.text)
        check("admin/admin.js có exportInventoryReportCsv", "exportInventoryReportCsv" in js_res.text)
        check("admin/admin.js có exportWarrantyReportCsv", "exportWarrantyReportCsv" in js_res.text)

        css_res = requests.get(f"{base_url}/admin/admin.css")
        check("admin/admin.css có style .tab-btn và .chart-bar", css_res.status_code == 200 and ".tab-btn" in css_res.text and ".chart-bar" in css_res.text)

        print("\n==============================================================")
        print(f"KẾT QUẢ KIỂM TRA: {passed} PASSED, {failed} FAILED")
        print("==============================================================")

    finally:
        proc.terminate()
        try:
            proc.wait(timeout=5)
        except:
            proc.kill()

    if failed > 0:
        sys.exit(1)

if __name__ == "__main__":
    main()
