import sqlite3, requests, time

db_path = 'RogAdmin/src/RogAdmin.Api/rogadmin-dev.db'

def get_db_promo():
    con = sqlite3.connect(db_path)
    cur = con.cursor()
    cur.execute("SELECT Value FROM SiteSettings WHERE Key = 'Site:PromoBarText';")
    row = cur.fetchone()
    con.close()
    return row[0] if row else ""

def set_db_promo(val):
    con = sqlite3.connect(db_path)
    cur = con.cursor()
    cur.execute("UPDATE SiteSettings SET Value = ? WHERE Key = 'Site:PromoBarText';", (val,))
    con.commit()
    con.close()

original = get_db_promo()
print(f"Giá trị PromoBar ban đầu trong SQLite: '{original}'")

test_val = "⚡ [LIVE BE-FE MUTATION VERIFIED] ROG ASUS VIỆT NAM - KHUYẾN MÃI ĐỘC QUYỀN VIP 2026 ⚡"
print(f"Đang đột biến giá trị sang: '{test_val}'...")
set_db_promo(test_val)

# Kiểm tra direct BE
r_be = requests.get('http://localhost:5161/api/public/site-config')
be_val = r_be.json().get('promoBar', {}).get('text')
print(f"Direct BE /api/public/site-config trả về: '{be_val}'")

# Kiểm tra qua Next.js Proxy
r_fe = requests.get('http://localhost:3000/api/be/public/site-config')
fe_val = r_fe.json().get('promoBar', {}).get('text')
print(f"FE Reverse Proxy /api/be/public/site-config trả về: '{fe_val}'")

mutation_success = (test_val in be_val) and (test_val in fe_val)
print(f"\n=> KẾT QUẢ ĐỘT BIẾN THỜI GIAN THỰC: {'THÀNH CÔNG HOÀN TOÀN' if mutation_success else 'CHƯA ĐỒNG BỘ'}")

# Khôi phục giá trị gốc
set_db_promo(original)
print(f"Đã khôi phục lại giá trị ban đầu trong SQLite: '{original}'")
