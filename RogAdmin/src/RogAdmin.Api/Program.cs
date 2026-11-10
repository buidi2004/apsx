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
    options.AddBasePolicy(p => p.Expire(TimeSpan.FromSeconds(60)));
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
// đứng sau proxy sẽ bị vòng lặp redirect https và rate-limit gộp chung một IP
app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto,
    KnownNetworks = { new Microsoft.AspNetCore.HttpOverrides.IPNetwork(System.Net.IPAddress.Any, 0) },
    KnownProxies = { System.Net.IPAddress.IPv6Any },
});

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
            """);
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
