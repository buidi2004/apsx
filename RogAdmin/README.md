# RogAdmin — BE Admin cho ROG ASUS VN (ASP.NET Core Web API)

Backend quản trị nội dung cho website ROG ASUS Việt Nam (FE Next.js tại `../ai-website-cloner-template`).
**BE không sửa hay đụng vào FE** — nằm song song, trả API đúng shape dữ liệu FE đang hardcode.

## Kiến trúc Clean Architecture 4 tầng

```
src/
├── RogAdmin.Domain/          Tầng 1 — Entities, Enums (không phụ thuộc gì)
├── RogAdmin.Application/      Tầng 2 — DTOs, Interfaces, Services (chỉ thấy Domain)
├── RogAdmin.Infrastructure/   Tầng 3 — EF Core DbContext, Repository, JWT, PBKDF2, Seeder
└── RogAdmin.Api/              Tầng 4 — Controllers, Program.cs, middleware, Admin UI tĩnh
```

Chiều phụ thuộc: `Api → Application + Infrastructure`, `Infrastructure → Application`, `Application → Domain`.
DI wiring (composition root) nằm ở `Api/Program.cs`.

## Tính năng

- **Đăng nhập JWT** (`/api/auth/login`), phân quyền role `Admin` / `Editor`, mật khẩu băm PBKDF2 (SHA-256, 100k vòng)
- **Rate limit login**: tối đa 10 lần/phút mỗi IP (chống brute-force, vượt → HTTP 429)
- **Quản lý tài khoản** (chỉ Admin): CRUD user, đặt lại mật khẩu cho user khác, guard "không thể xóa/hạ quyền admin duy nhất" và "không thể tự xóa chính mình"
- **Đổi mật khẩu của chính mình** (cả Admin lẫn Editor): `PUT /api/admin/account/password`
- **CRUD nội dung chính** đúng cấu trúc field của FE:
  - Bài viết gộp chung (Highlights + Listing) — tag chuẩn hóa về prefix `// `, lọc/phân trang/tìm kiếm
  - Slide Hero, Danh mục sản phẩm, Link Footer (Footer/Legal/Social)
  - **Xóa nội dung chỉ Admin** làm được; Editor xem/thêm/sửa được nhưng không xóa
- **Cấu hình site** key-value: PromoBar, JoinRepublic, thông tin công ty, newsletter, badge Bộ Công Thương...
- **REST API công khai** `/api/public/*` trả JSON shape **giống hệt** dữ liệu FE đang hardcode
- **Admin UI tĩnh** tiếng Việt tại `/admin` (vanilla JS, không cần build; ẩn trang Tài khoản với Editor)
- Swagger UI **chỉ bật ở Development** (`/swagger`)
- Health check: `GET /health`
- Seed idempotent dữ liệu FE gốc: 6 slides, 22 danh mục, 14 bài viết, 12 link, 20 cấu hình. **Ở Production không tự seed user mặc định** trừ khi đặt `SeedDefaultUsers=true`

## Tài khoản mặc định (chỉ seed ở Development)

| Tài khoản | Mật khẩu    | Role   |
|-----------|-------------|--------|
| `admin`   | `Admin@123` | Admin  |
| `editor`  | `Editor@123`| Editor |

> ⚠️ Vào `admin` → nút **🔑 Đổi mật khẩu** để đổi ngay sau khi cài đặt. Production phải tự tạo user (bật `SeedDefaultUsers=true` lần chạy đầu, sau đó tắt).

## Chạy trên Windows (SQL Server LocalDB)

Yêu cầu: .NET 9 SDK, Visual Studio 2022 hoặc VS Code.

```bash
cd RogAdmin
dotnet ef database update --project src/RogAdmin.Infrastructure --startup-project src/RogAdmin.Api
dotnet run --project src/RogAdmin.Api
```

- Connection string LocalDB mặc định trong `src/RogAdmin.Api/appsettings.json`:
  `Server=(localdb)\MSSQLLocalDB;Database=RogAdminDb;Trusted_Connection=True;...`
- Mở:
  - Admin UI: http://localhost:5161/admin
  - Swagger: http://localhost:5161/swagger (chỉ Development)
- **Cấu hình bảo mật trước khi deploy:**
  - `Jwt:Key`: Development dùng key dev trong `appsettings.Development.json`; deploy thật **bắt buộc** đặt biến môi trường `Jwt__Key` (≥32 ký tự, không commit vào repo). Để trống app sẽ từ chối khởi động với thông báo rõ ràng.
  - HSTS + HTTPS redirect tự bật khi chạy ngoài Development.
  - Thêm domain FE thật vào `Cors:AllowedOrigins`.
  - Production không seed user mặc định: đặt `SeedDefaultUsers=true` lần chạy đầu rồi tắt đi.

### Checklist vận hành (ops)

- [ ] Đặt `Jwt__Key` mạnh cho Production
- [ ] Đổi mật khẩu các tài khoản ngay sau khi tạo
- [ ] Thêm origin FE thật vào `Cors:AllowedOrigins`
- [ ] Cấu hình TLS ở reverse proxy (IIS/Nginx) — BE đã bật HSTS và **đã đọc X-Forwarded-For/Proto** (nếu proxy ở đâu đó trong mạng không tin cậy, thêm IP proxy vào `KnownProxies` trong Program.cs)
- [ ] `GET /health` đưa vào monitoring
- [ ] Production không seed user mặc định: đặt `SeedDefaultUsers=true` lần chạy đầu rồi tắt đi

## Chạy thử không cần SQL Server (SQLite)

Trên máy không có SQL Server (Linux/macOS hoặc Windows chưa cài LocalDB):

```bash
Database__Provider=Sqlite dotnet run --project src/RogAdmin.Api
```

Schema tự tạo (`EnsureCreated`) + seed; file DB là `rogadmin-dev.db` bên cạnh project Api.
Provider mặc định vẫn là `SqlServer` cho môi trường thật.

## API chính

### Công khai (không cần token, CORS mở cho FE localhost:3000/3001)

| Endpoint | Shape trả về (khớp FE) |
|---|---|
| `GET /api/public/hero-slides` | `[{src, alt, href}]` |
| `GET /api/public/product-categories` | `[{image, label, href}]` |
| `GET /api/public/articles?section=highlights\|listing&tag=Guides` | `[{img, tag, title, excerpt, date, href}]` |
| `GET /api/public/site-config` | `{promoBar, joinRepublic, footer{links, legalLinks, social, company, newsletter, badge, region, copyright}}` |

> `tag` truyền **không kèm prefix** `// ` (giống dropdown FE: `Guides`, `Technologies`, `ROG Xbox Ally`...).
> `date` format trùng FE: `Jun 30, 2026`.

### Admin (JWT Bearer: `Authorization: Bearer <token>`)

| Method | Endpoint | Mô tả | Role |
|---|---|---|---|
| POST | `/api/auth/login` | Đăng nhập → `{token, expiresAtUtc, user}` (rate limit 10/phút/IP) | anon |
| GET | `/api/admin/dashboard` | Thống kê số lượng | Admin, Editor |
| GET | `/api/admin/articles/tags` | Danh sách chuyên mục phân biệt (dropdown lọc) | Admin, Editor |
| GET/POST/PUT | `/api/admin/articles` | CRUD bài viết (`?section=&tag=&search=&page=&pageSize=`) | Admin, Editor |
| DELETE | `/api/admin/articles/{id}` | Xóa bài viết | Admin |
| GET/POST/PUT | `/api/admin/hero-slides` | CRUD slide hero | Admin, Editor |
| DELETE | `/api/admin/hero-slides/{id}` | Xóa slide | Admin |
| GET/POST/PUT | `/api/admin/product-categories` | CRUD danh mục | Admin, Editor |
| DELETE | `/api/admin/product-categories/{id}` | Xóa danh mục | Admin |
| GET/POST/PUT | `/api/admin/footer-links` | CRUD link footer (`?group=Footer\|Legal\|Social`) | Admin, Editor |
| DELETE | `/api/admin/footer-links/{id}` | Xóa link | Admin |
| GET/PUT | `/api/admin/site-settings` | Cấu hình site (PUT từng key hoặc hàng loạt) | Admin, Editor |
| GET/POST/PUT/DELETE | `/api/admin/users` | Quản lý tài khoản (+`PUT {id}/password` đặt lại MK) | Admin |
| PUT | `/api/admin/account/password` | Đổi mật khẩu của chính mình | Admin, Editor |

Lỗi trả về thống nhất `{ "message": "..." }` qua `ExceptionHandlingMiddleware`;
vi phạm DataAnnotations (độ dài/bắt buộc) trả 400 tự động; login vượt rate limit trả 429.

## FE kết nối BE (khi cần)

FE chưa có tích hợp API — sau này chỉ cần `fetch("http://localhost:5161/api/public/...")`
hoặc thêm rewrite trong `next.config.ts`; BE đã mở CORS cho `localhost:3000` và `localhost:3001`.
**Không bắt buộc sửa BE thêm gì nữa.**

## Ví dụ seed → FE mapping

| FE component | Bảng BE | Số dòng seed |
|---|---|---|
| `RogHeroCarousel.tsx` → `SLIDES` | `HeroSlides` | 6 |
| `RogProductCategories.tsx` → `PRODUCTS` | `ProductCategories` | 22 |
| `RogHighlights.tsx` → `ARTICLES` | `Articles` (Section=Highlights) | 5 |
| `RogArticleListing.tsx` → `ARTICLES` | `Articles` (Section=Listing) | 9 |
| `RogFooter.tsx` → `FOOTER_LINKS`/`LEGAL_LINKS`/social | `FooterLinks` | 12 |
| `RogPromoBar.tsx`, `RogJoinRepublic.tsx`, footer công ty... | `SiteSettings` | 20 khóa |
