using System.Text;
using System.Text.Json;
using System.Threading.RateLimiting;
using System.IO.Compression;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using RogAdmin.Api.Middleware;
using RogAdmin.Application;
using RogAdmin.Application.Interfaces;
using RogAdmin.Application.Options;
using RogAdmin.Infrastructure;
using RogAdmin.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

// ---------- Tầng Application + Infrastructure (Clean Architecture 4 tầng) ----------
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

builder.Services.AddControllers().AddJsonOptions(options =>
{
    // camelCase khớp tên field FE (img, tag, title, excerpt, src, alt...)
    options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    // Nhận/xuất enum dạng chuỗi ("Highlights", "Listing", "Footer"...)
    options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
});

// Lỗi validation (DataAnnotations) trả { message } thống nhất để admin UI hiển thị được.
// PHẢI đặt SAU AddControllers() — nếu đặt trước, Mvc sẽ ghi đè factory bằng mặc định.
builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.InvalidModelStateResponseFactory = context =>
    {
        var message = string.Join("; ", context.ModelState.Values
            .SelectMany(v => v.Errors)
            .Select(e => e.ErrorMessage));
        return new BadRequestObjectResult(new { message });
    };
});

// ---------- Rate limiter chống brute-force login ----------
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.AddPolicy("login", context =>
        RateLimitPartition.GetFixedWindowLimiter(
            context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = builder.Environment.IsDevelopment() ? 60 : 10,
                Window = TimeSpan.FromMinutes(1),
            }));
});

// ---------- Tối ưu hóa: Response Compression (Brotli + Gzip) ----------
builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
    options.Providers.Add<BrotliCompressionProvider>();
    options.Providers.Add<GzipCompressionProvider>();
    options.MimeTypes = ResponseCompressionDefaults.MimeTypes.Concat(new[]
    {
        "application/json",
        "application/problem+json",
        "text/plain",
        "text/html"
    });
});
builder.Services.Configure<BrotliCompressionProviderOptions>(options =>
{
    options.Level = CompressionLevel.Fastest;
});
builder.Services.Configure<GzipCompressionProviderOptions>(options =>
{
    options.Level = CompressionLevel.Fastest;
});

// ---------- Tối ưu hóa: Output Caching cho API Công khai ----------
builder.Services.AddOutputCache(options =>
{
    options.AddPolicy("PublicCache", p => p.Expire(TimeSpan.FromSeconds(60)).Tag("public-content"));
});

// ---------- JWT Bearer cho khu vực /api/admin ----------
var jwt = builder.Configuration.GetSection(JwtOptions.SectionName).Get<JwtOptions>() ?? new JwtOptions();
if (string.IsNullOrWhiteSpace(jwt.Key) || jwt.Key.Length < 32)
{
    throw new InvalidOperationException(
        "Jwt:Key chưa cấu hình (cần ít nhất 32 ký tự). " +
        "Môi trường Development lấy key từ appsettings.Development.json; " +
        "khi deploy thật hãy đặt biến môi trường Jwt__Key hoặc dùng dotnet user-secrets. " +
        "KHÔNG commit key thật vào appsettings.json.");
}

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwt.Issuer,
            ValidateAudience = true,
            ValidAudience = jwt.Audience,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt.Key)),
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(1),
        };
    });

builder.Services.AddAuthorization();

// ---------- CORS cho FE Next.js ----------
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
builder.Services.AddCors(options => options.AddPolicy("Frontend", policy =>
    policy.WithOrigins(allowedOrigins).AllowAnyHeader().AllowAnyMethod()));

// ---------- Swagger (chỉ bật ở Development — không lộ endpoint ra Production) ----------
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.CustomSchemaIds(type => type.FullName?.Replace('+', '.') ?? type.Name);
    options.ResolveConflictingActions(apiDescriptions => apiDescriptions.First());
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "RogAdmin API",
        Version = "v1",
        Description = "Backend admin quản trị nội dung ROG ASUS VN (Clean Architecture 4 tầng). " +
                      "Đăng nhập /api/auth/login lấy token rồi Authorize để dùng các endpoint /api/admin/*.",
    });
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Nhập token JWT lấy từ POST /api/auth/login",
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" },
            },
            Array.Empty<string>()
        },
    });
});

var app = builder.Build();

// ---------- Pipeline ----------
// Đọc X-Forwarded-For/Proto từ reverse proxy (nginx/IIS) — nếu không có,
// đứng sau proxy sẽ bị vòng lặp redirect https và rate-limit gộp chung một IP.
// Chỉ tin header từ proxy trên máy nội bộ để tránh giả mạo X-Forwarded-For.
var forwardedOptions = new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto,
};
forwardedOptions.KnownProxies.Clear();
forwardedOptions.KnownNetworks.Clear();
forwardedOptions.KnownProxies.Add(System.Net.IPAddress.Loopback);
forwardedOptions.KnownProxies.Add(System.Net.IPAddress.IPv6Loopback);
// Cho phép khai báo thêm IP proxy nội bộ qua cấu hình (vd. nginx trong Docker).
foreach (var proxy in builder.Configuration.GetSection("ReverseProxy:KnownProxies").Get<string[]>() ?? [])
{
    if (System.Net.IPAddress.TryParse(proxy, out var addr)) forwardedOptions.KnownProxies.Add(addr);
}
app.UseForwardedHeaders(forwardedOptions);

if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
}
app.UseHttpsRedirection();
app.UseResponseCompression();
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseRateLimiter();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options => options.SwaggerEndpoint("/swagger/v1/swagger.json", "RogAdmin API v1"));
}

// Admin UI tĩnh (wwwroot/admin) — serve index.html khi mở /admin/
app.UseDefaultFiles(new DefaultFilesOptions
{
    RequestPath = "/admin",
    DefaultFileNames = ["index.html"],
});
app.UseStaticFiles();
app.MapGet("/admin", () => Results.Redirect("/admin/index.html"));

app.UseCors("Frontend");
app.UseAuthentication();
app.UseAuthorization();
app.UseOutputCache();
app.MapControllers();

// ---------- Health check cho monitoring/reverse proxy ----------
app.MapGet("/health", async (RogAdminDbContext db) =>
{
    try
    {
        return await db.Database.CanConnectAsync()
            ? Results.Ok(new { status = "healthy", database = "up" })
            : Results.Json(new { status = "degraded", database = "down" }, statusCode: 503);
    }
    catch
    {
        return Results.Json(new { status = "degraded", database = "unreachable" }, statusCode: 503);
    }
});
app.MapGet("/api/health", async (RogAdminDbContext db) =>
{
    try
    {
        return await db.Database.CanConnectAsync()
            ? Results.Ok(new { status = "healthy", database = "up" })
            : Results.Json(new { status = "degraded", database = "down" }, statusCode: 503);
    }
    catch
    {
        return Results.Json(new { status = "degraded", database = "unreachable" }, statusCode: 503);
    }
});

// ---------- Khởi tạo DB: migrate (SQL Server) hoặc tạo schema (Sqlite dev) + seed ----------
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<RogAdminDbContext>();
    var provider = app.Configuration["Database:Provider"] ?? "SqlServer";
    if (provider.Equals("Sqlite", StringComparison.OrdinalIgnoreCase))
    {
        await db.Database.EnsureCreatedAsync();

        // Bản WIP trước tạo sai bảng/cột (EventCampaigns + CreatedAtUtc/UpdatedAtUtc) làm app crash khi nâng cấp DB cũ.
        // EventCampaigns chưa từng được seed nên xoá an toàn; SoftwareDownloads nếu sai schema và còn rỗng thì tạo lại.
        await db.Database.ExecuteSqlRawAsync("DROP TABLE IF EXISTS EventCampaigns;");
        var sqliteConnection = db.Database.GetDbConnection();
        var openedHere = sqliteConnection.State != System.Data.ConnectionState.Open;
        if (openedHere) await sqliteConnection.OpenAsync();
        try
        {
            using var schemaCheck = sqliteConnection.CreateCommand();
            schemaCheck.CommandText = """
                SELECT CASE
                    WHEN NOT EXISTS (SELECT 1 FROM sqlite_master WHERE type='table' AND name='SoftwareDownloads') THEN 1
                    WHEN EXISTS (SELECT 1 FROM pragma_table_info('SoftwareDownloads') WHERE name='CreatedAt') THEN 1
                    WHEN EXISTS (SELECT 1 FROM SoftwareDownloads) THEN 0
                    ELSE 2
                END
                """;
            var tableState = Convert.ToInt64(await schemaCheck.ExecuteScalarAsync() ?? 1L);
            // tableState = 2: bảng tồn tại nhưng sai cột và đang rỗng -> tạo lại theo schema đúng
            if (tableState == 2)
            {
                await db.Database.ExecuteSqlRawAsync("DROP TABLE SoftwareDownloads;");
            }
        }
        finally
        {
            if (openedHere) await sqliteConnection.CloseAsync();
        }

        await db.Database.ExecuteSqlRawAsync("""
            CREATE TABLE IF NOT EXISTS NewsletterSubscribers (
                Id TEXT NOT NULL PRIMARY KEY,
                Email TEXT NOT NULL,
                CreatedAtUtc TEXT NOT NULL
            );
            CREATE UNIQUE INDEX IF NOT EXISTS IX_NewsletterSubscribers_Email
            ON NewsletterSubscribers (Email);
            CREATE TABLE IF NOT EXISTS ProductReviews (
                Id TEXT NOT NULL PRIMARY KEY,
                ProductSlug TEXT NOT NULL,
                AuthorName TEXT NOT NULL,
                Title TEXT NOT NULL,
                Content TEXT NOT NULL,
                Rating INTEGER NOT NULL,
                IsApproved INTEGER NOT NULL DEFAULT 0,
                CreatedAtUtc TEXT NOT NULL
            );
            CREATE INDEX IF NOT EXISTS IX_ProductReviews_ProductSlug
            ON ProductReviews (ProductSlug);
            CREATE TABLE IF NOT EXISTS Campaigns (
                Id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                Badge TEXT NOT NULL,
                Title TEXT NOT NULL,
                Period TEXT NOT NULL,
                Desc TEXT NOT NULL,
                Img TEXT NOT NULL,
                CtaText TEXT NOT NULL,
                CtaLink TEXT NOT NULL,
                IsActive INTEGER NOT NULL DEFAULT 1,
                SortOrder INTEGER NOT NULL DEFAULT 0,
                CreatedAt TEXT NOT NULL,
                UpdatedAt TEXT
            );
            CREATE TABLE IF NOT EXISTS SoftwareDownloads (
                Id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                Name TEXT NOT NULL,
                Version TEXT NOT NULL,
                Size TEXT NOT NULL,
                Desc TEXT NOT NULL,
                FeaturesJson TEXT NOT NULL,
                Os TEXT NOT NULL,
                Badge TEXT NOT NULL,
                DownloadUrl TEXT NOT NULL,
                IsActive INTEGER NOT NULL DEFAULT 1,
                SortOrder INTEGER NOT NULL DEFAULT 0,
                CreatedAt TEXT NOT NULL,
                UpdatedAt TEXT
            );
            CREATE TABLE IF NOT EXISTS Orders (
                Id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                OrderCode TEXT NOT NULL,
                CustomerId INTEGER NULL,
                CustomerName TEXT NOT NULL,
                Email TEXT NOT NULL,
                Phone TEXT NOT NULL,
                Address TEXT NOT NULL,
                Note TEXT NOT NULL,
                Subtotal INTEGER NOT NULL,
                ShippingFee INTEGER NOT NULL,
                Total INTEGER NOT NULL,
                Status INTEGER NOT NULL DEFAULT 0,
                CreatedAt TEXT NOT NULL,
                UpdatedAt TEXT NULL
            );
            CREATE UNIQUE INDEX IF NOT EXISTS IX_Orders_OrderCode ON Orders (OrderCode);
            CREATE INDEX IF NOT EXISTS IX_Orders_CustomerId ON Orders (CustomerId);
            CREATE TABLE IF NOT EXISTS OrderItems (
                Id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                OrderId INTEGER NOT NULL,
                ProductId INTEGER NULL,
                ProductSlug TEXT NOT NULL,
                ProductName TEXT NOT NULL,
                SelectedSpecs TEXT NOT NULL,
                UnitPrice INTEGER NOT NULL,
                Quantity INTEGER NOT NULL,
                LineTotal INTEGER NOT NULL,
                CreatedAt TEXT NOT NULL,
                UpdatedAt TEXT NULL
            );
            CREATE INDEX IF NOT EXISTS IX_OrderItems_OrderId ON OrderItems (OrderId);

            CREATE TABLE IF NOT EXISTS ServiceCenters (
                Id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                Name TEXT NOT NULL,
                City TEXT NOT NULL,
                Address TEXT NOT NULL,
                Phone TEXT NOT NULL,
                OperatingHours TEXT NOT NULL,
                SortOrder INTEGER NOT NULL DEFAULT 0,
                IsActive INTEGER NOT NULL DEFAULT 1,
                CreatedAt TEXT NOT NULL,
                UpdatedAt TEXT NULL
            );
            CREATE INDEX IF NOT EXISTS IX_ServiceCenters_SortOrder ON ServiceCenters (SortOrder);

            CREATE TABLE IF NOT EXISTS WarrantyPolicies (
                Id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                Title TEXT NOT NULL,
                Description TEXT NOT NULL,
                SortOrder INTEGER NOT NULL DEFAULT 0,
                IsActive INTEGER NOT NULL DEFAULT 1,
                CreatedAt TEXT NOT NULL,
                UpdatedAt TEXT NULL
            );
            CREATE INDEX IF NOT EXISTS IX_WarrantyPolicies_SortOrder ON WarrantyPolicies (SortOrder);

            CREATE TABLE IF NOT EXISTS SocialChannels (
                Id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                Name TEXT NOT NULL,
                MembersCount TEXT NOT NULL,
                Description TEXT NOT NULL,
                Link TEXT NOT NULL,
                ButtonText TEXT NOT NULL,
                SortOrder INTEGER NOT NULL DEFAULT 0,
                IsActive INTEGER NOT NULL DEFAULT 1,
                CreatedAt TEXT NOT NULL,
                UpdatedAt TEXT NULL
            );
            CREATE INDEX IF NOT EXISTS IX_SocialChannels_SortOrder ON SocialChannels (SortOrder);

            CREATE TABLE IF NOT EXISTS EliteTierPerks (
                Id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                Tier TEXT NOT NULL,
                PointsRange TEXT NOT NULL,
                Perk TEXT NOT NULL,
                SortOrder INTEGER NOT NULL DEFAULT 0,
                IsActive INTEGER NOT NULL DEFAULT 1,
                CreatedAt TEXT NOT NULL,
                UpdatedAt TEXT NULL
            );
            CREATE INDEX IF NOT EXISTS IX_EliteTierPerks_SortOrder ON EliteTierPerks (SortOrder);

            CREATE TABLE IF NOT EXISTS AuditLogs (
                Id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                Username TEXT NOT NULL,
                Action TEXT NOT NULL,
                EntityName TEXT NOT NULL,
                EntityId TEXT NULL,
                Details TEXT NOT NULL,
                IpAddress TEXT NULL,
                CreatedAt TEXT NOT NULL,
                UpdatedAt TEXT NULL
            );
            CREATE INDEX IF NOT EXISTS IX_AuditLogs_CreatedAt ON AuditLogs (CreatedAt);
            CREATE INDEX IF NOT EXISTS IX_AuditLogs_Action ON AuditLogs (Action);
            CREATE INDEX IF NOT EXISTS IX_AuditLogs_Username ON AuditLogs (Username);

            CREATE TABLE IF NOT EXISTS Innovations (
                Id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                Tag TEXT NOT NULL,
                Title TEXT NOT NULL,
                Description TEXT NOT NULL,
                HighlightsJson TEXT NOT NULL,
                ImageUrl TEXT NOT NULL,
                SortOrder INTEGER NOT NULL DEFAULT 0,
                IsActive INTEGER NOT NULL DEFAULT 1,
                CreatedAt TEXT NOT NULL,
                UpdatedAt TEXT NULL
            );
            CREATE INDEX IF NOT EXISTS IX_Innovations_SortOrder ON Innovations (SortOrder);

            CREATE TABLE IF NOT EXISTS Wallpapers (
                Id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                Title TEXT NOT NULL,
                Resolution TEXT NOT NULL,
                ImageUrl TEXT NOT NULL,
                DownloadUrl TEXT NOT NULL,
                SortOrder INTEGER NOT NULL DEFAULT 0,
                IsActive INTEGER NOT NULL DEFAULT 1,
                CreatedAt TEXT NOT NULL,
                UpdatedAt TEXT NULL
            );
            CREATE INDEX IF NOT EXISTS IX_Wallpapers_SortOrder ON Wallpapers (SortOrder);

            CREATE TABLE IF NOT EXISTS AboutStories (
                Id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                YearTag TEXT NOT NULL,
                Heading TEXT NOT NULL,
                Content TEXT NOT NULL,
                ImageUrl TEXT NULL,
                SortOrder INTEGER NOT NULL DEFAULT 0,
                IsActive INTEGER NOT NULL DEFAULT 1,
                CreatedAt TEXT NOT NULL,
                UpdatedAt TEXT NULL
            );
            CREATE INDEX IF NOT EXISTS IX_AboutStories_SortOrder ON AboutStories (SortOrder);

            CREATE TABLE IF NOT EXISTS FeaturedVideos (
                Id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                Title TEXT NOT NULL,
                VideoUrl TEXT NOT NULL,
                ThumbnailUrl TEXT NOT NULL,
                IsBig INTEGER NOT NULL DEFAULT 0,
                SortOrder INTEGER NOT NULL DEFAULT 0,
                IsActive INTEGER NOT NULL DEFAULT 1,
                CreatedAt TEXT NOT NULL,
                UpdatedAt TEXT NULL
            );
            CREATE INDEX IF NOT EXISTS IX_FeaturedVideos_SortOrder ON FeaturedVideos (SortOrder);

            CREATE TABLE IF NOT EXISTS ProductImages (
                Id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                ProductId INTEGER NOT NULL,
                ImageUrl TEXT NOT NULL,
                Caption TEXT NULL,
                SortOrder INTEGER NOT NULL DEFAULT 0,
                CreatedAt TEXT NOT NULL,
                UpdatedAt TEXT NULL,
                FOREIGN KEY (ProductId) REFERENCES Products (Id) ON DELETE CASCADE
            );
            CREATE INDEX IF NOT EXISTS IX_ProductImages_ProductId ON ProductImages (ProductId);

            CREATE TABLE IF NOT EXISTS Coupons (
                Id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                Code TEXT NOT NULL,
                Title TEXT NOT NULL,
                Description TEXT NOT NULL,
                DiscountType INTEGER NOT NULL DEFAULT 0,
                DiscountValue REAL NOT NULL DEFAULT 0,
                MinOrderValue REAL NOT NULL DEFAULT 0,
                MaxDiscountAmount REAL NULL,
                ValidFrom TEXT NULL,
                ValidTo TEXT NULL,
                UsageLimit INTEGER NOT NULL DEFAULT 100,
                UsedCount INTEGER NOT NULL DEFAULT 0,
                IsActive INTEGER NOT NULL DEFAULT 1,
                CreatedAt TEXT NOT NULL,
                UpdatedAt TEXT NULL
            );
            CREATE UNIQUE INDEX IF NOT EXISTS IX_Coupons_Code ON Coupons (Code);
            CREATE INDEX IF NOT EXISTS IX_Coupons_IsActive ON Coupons (IsActive);
            """);

        try
        {
            await db.Database.ExecuteSqlRawAsync("ALTER TABLE Articles ADD COLUMN ContentHtml TEXT NULL;");
        }
        catch { /* Column already exists */ }

        try
        {
            await db.Database.ExecuteSqlRawAsync("ALTER TABLE Articles ADD COLUMN Author TEXT NULL DEFAULT 'ROG Editor';");
        }
        catch { /* Column already exists */ }

        try { await db.Database.ExecuteSqlRawAsync("ALTER TABLE Orders ADD COLUMN ShippingCarrier TEXT NOT NULL DEFAULT '';"); } catch { }
        try { await db.Database.ExecuteSqlRawAsync("ALTER TABLE Orders ADD COLUMN TrackingNumber TEXT NOT NULL DEFAULT '';"); } catch { }
        try { await db.Database.ExecuteSqlRawAsync("ALTER TABLE Orders ADD COLUMN InternalNotes TEXT NULL;"); } catch { }
        try { await db.Database.ExecuteSqlRawAsync("ALTER TABLE Orders ADD COLUMN CouponCode TEXT NULL;"); } catch { }
        try { await db.Database.ExecuteSqlRawAsync("ALTER TABLE Orders ADD COLUMN DiscountAmount INTEGER NOT NULL DEFAULT 0;"); } catch { }
        try { await db.Database.ExecuteSqlRawAsync("ALTER TABLE ProductPrices ADD COLUMN StockQuantity INTEGER NOT NULL DEFAULT 15;"); } catch { }
        try { await db.Database.ExecuteSqlRawAsync("ALTER TABLE ProductReviews ADD COLUMN AdminReply TEXT NULL;"); } catch { }
        try { await db.Database.ExecuteSqlRawAsync("ALTER TABLE ProductReviews ADD COLUMN RepliedAt TEXT NULL;"); } catch { }
        try { await db.Database.ExecuteSqlRawAsync("ALTER TABLE ProductReviews ADD COLUMN RepliedBy TEXT NULL;"); } catch { }
    }
    else
    {
        await db.Database.MigrateAsync();
    }

    var hasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher>();
    // Production không tự tạo tài khoản mặc định trừ khi bật cấu hình SeedDefaultUsers=true
    var seedDefaultUsers = !app.Environment.IsProduction()
        || app.Configuration.GetValue("SeedDefaultUsers", false);
    await DbSeeder.SeedAsync(db, hasher, seedDefaultUsers);
    app.Logger.LogInformation("Khởi tạo database ({Provider}) + seed dữ liệu hoàn tất (seed users: {SeedUsers}).",
        provider, seedDefaultUsers);
}

app.Run();

// Cho phép WebApplicationFactory<Program> trong project test (RogAdmin.Tests) khởi động app thật.
public partial class Program { }
