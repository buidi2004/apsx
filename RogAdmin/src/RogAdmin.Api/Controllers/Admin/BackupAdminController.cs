using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RogAdmin.Application.Interfaces;
using RogAdmin.Domain.Entities;
using RogAdmin.Infrastructure.Persistence;

namespace RogAdmin.Api.Controllers.Admin;

[ApiController]
[Route("api/admin/backup")]
[Authorize(Roles = "Admin")]
public class BackupAdminController(RogAdminDbContext db, IAuditLogService auditLog) : ControllerBase
{
    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary(CancellationToken ct = default)
    {
        var summary = new
        {
            products = await db.Products.CountAsync(ct),
            dealers = await db.Dealers.CountAsync(ct),
            warrantyRecords = await db.WarrantyRecords.CountAsync(ct),
            customers = await db.Customers.CountAsync(ct),
            orders = await db.Orders.CountAsync(ct),
            reviews = await db.ProductReviews.CountAsync(ct),
            campaigns = await db.Campaigns.CountAsync(ct),
            downloads = await db.SoftwareDownloads.CountAsync(ct),
            newsletterSubscribers = await db.NewsletterSubscribers.CountAsync(ct),
            articles = await db.Articles.CountAsync(ct),
            heroSlides = await db.HeroSlides.CountAsync(ct),
            categories = await db.ProductCategories.CountAsync(ct),
            footerLinks = await db.FooterLinks.CountAsync(ct),
            siteSettings = await db.SiteSettings.CountAsync(ct),
            serviceCenters = await db.ServiceCenters.CountAsync(ct),
            warrantyPolicies = await db.WarrantyPolicies.CountAsync(ct),
            socialChannels = await db.SocialChannels.CountAsync(ct),
            eliteTiers = await db.EliteTierPerks.CountAsync(ct),
            innovations = await db.Innovations.CountAsync(ct),
            wallpapers = await db.Wallpapers.CountAsync(ct),
            aboutStories = await db.AboutStories.CountAsync(ct),
            featuredVideos = await db.FeaturedVideos.CountAsync(ct),
            productImages = await db.ProductImages.CountAsync(ct),
            auditLogs = await db.AuditLogs.CountAsync(ct)
        };

        return Ok(summary);
    }

    [HttpGet("export")]
    public async Task<IActionResult> ExportBackup(CancellationToken ct = default)
    {
        var backup = new
        {
            system = "ROG Asus Vietnam Enterprise Management System",
            version = "2.0",
            exportedAt = DateTime.UtcNow,
            exportedBy = User.Identity?.Name ?? "Admin",
            data = new
            {
                products = await db.Products.Include(p => p.Price).Include(p => p.Specs).AsNoTracking().ToListAsync(ct),
                dealers = await db.Dealers.AsNoTracking().ToListAsync(ct),
                warrantyRecords = await db.WarrantyRecords.AsNoTracking().ToListAsync(ct),
                customers = await db.Customers.AsNoTracking().ToListAsync(ct),
                orders = await db.Orders.Include(o => o.Items).AsNoTracking().ToListAsync(ct),
                reviews = await db.ProductReviews.AsNoTracking().ToListAsync(ct),
                campaigns = await db.Campaigns.AsNoTracking().ToListAsync(ct),
                downloads = await db.SoftwareDownloads.AsNoTracking().ToListAsync(ct),
                newsletterSubscribers = await db.NewsletterSubscribers.AsNoTracking().ToListAsync(ct),
                articles = await db.Articles.AsNoTracking().ToListAsync(ct),
                heroSlides = await db.HeroSlides.AsNoTracking().ToListAsync(ct),
                productCategories = await db.ProductCategories.AsNoTracking().ToListAsync(ct),
                footerLinks = await db.FooterLinks.AsNoTracking().ToListAsync(ct),
                siteSettings = await db.SiteSettings.AsNoTracking().ToListAsync(ct),
                serviceCenters = await db.ServiceCenters.AsNoTracking().ToListAsync(ct),
                warrantyPolicies = await db.WarrantyPolicies.AsNoTracking().ToListAsync(ct),
                socialChannels = await db.SocialChannels.AsNoTracking().ToListAsync(ct),
                eliteTiers = await db.EliteTierPerks.AsNoTracking().ToListAsync(ct),
                innovations = await db.Innovations.AsNoTracking().ToListAsync(ct),
                wallpapers = await db.Wallpapers.AsNoTracking().ToListAsync(ct),
                aboutStories = await db.AboutStories.AsNoTracking().ToListAsync(ct),
                featuredVideos = await db.FeaturedVideos.AsNoTracking().ToListAsync(ct),
                productImages = await db.ProductImages.AsNoTracking().ToListAsync(ct),
                coupons = await db.Coupons.AsNoTracking().ToListAsync(ct),
                auditLogs = await db.AuditLogs.AsNoTracking().Take(1000).OrderByDescending(a => a.CreatedAt).ToListAsync(ct)
            }
        };

        var json = JsonSerializer.Serialize(backup, new JsonSerializerOptions
        {
            WriteIndented = true,
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles
        });

        var bytes = Encoding.UTF8.GetBytes(json);
        var filename = $"rogadmin_backup_{DateTime.UtcNow:yyyyMMdd_HHmmss}.json";

        var username = User.Identity?.Name ?? "Admin";
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        await auditLog.LogAsync(username, "BACKUP_EXPORT", "System", null, $"Xuất bản sao lưu toàn bộ CSDL ({bytes.Length / 1024} KB)", ip, ct);

        return File(bytes, "application/json", filename);
    }

    [HttpPost("restore")]
    [Consumes("multipart/form-data", "application/json")]
    public async Task<IActionResult> RestoreBackup(CancellationToken ct = default)
    {
        string jsonContent;
        if (Request.HasFormContentType && Request.Form.Files.Count > 0)
        {
            var file = Request.Form.Files[0];
            using var reader = new StreamReader(file.OpenReadStream(), Encoding.UTF8);
            jsonContent = await reader.ReadToEndAsync(ct);
        }
        else
        {
            using var reader = new StreamReader(Request.Body, Encoding.UTF8);
            jsonContent = await reader.ReadToEndAsync(ct);
        }

        if (string.IsNullOrWhiteSpace(jsonContent))
        {
            return BadRequest(new { message = "Không tìm thấy nội dung tệp JSON sao lưu." });
        }

        JsonDocument doc;
        try
        {
            doc = JsonDocument.Parse(jsonContent);
        }
        catch (JsonException ex)
        {
            return BadRequest(new { message = $"Tệp JSON không hợp lệ: {ex.Message}" });
        }

        using (doc)
        {
            var root = doc.RootElement;
            var data = root.TryGetProperty("data", out var d) ? d : root;

            var restoredCounts = new Dictionary<string, int>();

            // Phục hồi Dealers
            if (data.TryGetProperty("dealers", out var dealersEl) && dealersEl.ValueKind == JsonValueKind.Array)
            {
                var dealers = JsonSerializer.Deserialize<List<Dealer>>(dealersEl.GetRawText()) ?? new();
                foreach (var item in dealers)
                {
                    var existing = await db.Dealers.FirstOrDefaultAsync(x => x.Slug == item.Slug, ct);
                    if (existing == null) db.Dealers.Add(item);
                    else
                    {
                        existing.Name = item.Name;
                        existing.LogoUrl = item.LogoUrl;
                        existing.WebsiteUrl = item.WebsiteUrl;
                        existing.Hotline = item.Hotline;
                        existing.IsOfficialPartner = item.IsOfficialPartner;
                        existing.StoreCount = item.StoreCount;
                        existing.CityCoverage = item.CityCoverage;
                    }
                }
                restoredCounts["dealers"] = dealers.Count;
            }

            // Phục hồi Coupons
            if (data.TryGetProperty("coupons", out var couponsEl) && couponsEl.ValueKind == JsonValueKind.Array)
            {
                var coupons = JsonSerializer.Deserialize<List<Coupon>>(couponsEl.GetRawText()) ?? new();
                foreach (var item in coupons)
                {
                    var existing = await db.Coupons.FirstOrDefaultAsync(x => x.Code == item.Code, ct);
                    if (existing == null) db.Coupons.Add(item);
                    else
                    {
                        existing.Title = item.Title;
                        existing.Description = item.Description;
                        existing.DiscountType = item.DiscountType;
                        existing.DiscountValue = item.DiscountValue;
                        existing.MinOrderValue = item.MinOrderValue;
                        existing.MaxDiscountAmount = item.MaxDiscountAmount;
                        existing.ValidFrom = item.ValidFrom;
                        existing.ValidTo = item.ValidTo;
                        existing.UsageLimit = item.UsageLimit;
                        existing.IsActive = item.IsActive;
                    }
                }
                restoredCounts["coupons"] = coupons.Count;
            }

            // Phục hồi SiteSettings
            if (data.TryGetProperty("siteSettings", out var settingsEl) && settingsEl.ValueKind == JsonValueKind.Array)
            {
                var settings = JsonSerializer.Deserialize<List<SiteSetting>>(settingsEl.GetRawText()) ?? new();
                foreach (var item in settings)
                {
                    var existing = await db.SiteSettings.FirstOrDefaultAsync(x => x.Key == item.Key, ct);
                    if (existing == null) db.SiteSettings.Add(item);
                    else
                    {
                        existing.Value = item.Value;
                        existing.Description = item.Description;
                    }
                }
                restoredCounts["siteSettings"] = settings.Count;
            }

            // Phục hồi WarrantyPolicies
            if (data.TryGetProperty("warrantyPolicies", out var warPolEl) && warPolEl.ValueKind == JsonValueKind.Array)
            {
                var policies = JsonSerializer.Deserialize<List<WarrantyPolicy>>(warPolEl.GetRawText()) ?? new();
                foreach (var item in policies)
                {
                    var existing = await db.WarrantyPolicies.FirstOrDefaultAsync(x => x.Title == item.Title, ct);
                    if (existing == null) db.WarrantyPolicies.Add(item);
                    else
                    {
                        existing.Description = item.Description;
                        existing.SortOrder = item.SortOrder;
                        existing.IsActive = item.IsActive;
                    }
                }
                restoredCounts["warrantyPolicies"] = policies.Count;
            }

            // Phục hồi ServiceCenters
            if (data.TryGetProperty("serviceCenters", out var scEl) && scEl.ValueKind == JsonValueKind.Array)
            {
                var centers = JsonSerializer.Deserialize<List<ServiceCenter>>(scEl.GetRawText()) ?? new();
                foreach (var item in centers)
                {
                    var existing = await db.ServiceCenters.FirstOrDefaultAsync(x => x.Name == item.Name && x.City == item.City, ct);
                    if (existing == null) db.ServiceCenters.Add(item);
                    else
                    {
                        existing.Address = item.Address;
                        existing.Phone = item.Phone;
                        existing.OperatingHours = item.OperatingHours;
                        existing.SortOrder = item.SortOrder;
                        existing.IsActive = item.IsActive;
                    }
                }
                restoredCounts["serviceCenters"] = centers.Count;
            }

            // Phục hồi Campaigns
            if (data.TryGetProperty("campaigns", out var campEl) && campEl.ValueKind == JsonValueKind.Array)
            {
                var campaigns = JsonSerializer.Deserialize<List<EventCampaign>>(campEl.GetRawText()) ?? new();
                foreach (var item in campaigns)
                {
                    var existing = await db.Campaigns.FirstOrDefaultAsync(x => x.Title == item.Title, ct);
                    if (existing == null) db.Campaigns.Add(item);
                    else
                    {
                        existing.Badge = item.Badge;
                        existing.Period = item.Period;
                        existing.Desc = item.Desc;
                        existing.Img = item.Img;
                        existing.CtaText = item.CtaText;
                        existing.CtaLink = item.CtaLink;
                        existing.IsActive = item.IsActive;
                        existing.SortOrder = item.SortOrder;
                    }
                }
                restoredCounts["campaigns"] = campaigns.Count;
            }

            // Phục hồi SoftwareDownloads
            if (data.TryGetProperty("downloads", out var downEl) && downEl.ValueKind == JsonValueKind.Array)
            {
                var downloads = JsonSerializer.Deserialize<List<SoftwareDownload>>(downEl.GetRawText()) ?? new();
                foreach (var item in downloads)
                {
                    var existing = await db.SoftwareDownloads.FirstOrDefaultAsync(x => x.Name == item.Name && x.Version == item.Version, ct);
                    if (existing == null) db.SoftwareDownloads.Add(item);
                    else
                    {
                        existing.Size = item.Size;
                        existing.Desc = item.Desc;
                        existing.FeaturesJson = item.FeaturesJson;
                        existing.Os = item.Os;
                        existing.Badge = item.Badge;
                        existing.DownloadUrl = item.DownloadUrl;
                        existing.IsActive = item.IsActive;
                        existing.SortOrder = item.SortOrder;
                    }
                }
                restoredCounts["downloads"] = downloads.Count;
            }

            // Phục hồi SocialChannels
            if (data.TryGetProperty("socialChannels", out var socEl) && socEl.ValueKind == JsonValueKind.Array)
            {
                var socials = JsonSerializer.Deserialize<List<SocialChannel>>(socEl.GetRawText()) ?? new();
                foreach (var item in socials)
                {
                    var existing = await db.SocialChannels.FirstOrDefaultAsync(x => x.Name == item.Name, ct);
                    if (existing == null) db.SocialChannels.Add(item);
                    else
                    {
                        existing.MembersCount = item.MembersCount;
                        existing.Description = item.Description;
                        existing.Link = item.Link;
                        existing.ButtonText = item.ButtonText;
                        existing.SortOrder = item.SortOrder;
                        existing.IsActive = item.IsActive;
                    }
                }
                restoredCounts["socialChannels"] = socials.Count;
            }

            // Phục hồi Wallpapers
            if (data.TryGetProperty("wallpapers", out var wallEl) && wallEl.ValueKind == JsonValueKind.Array)
            {
                var wallpapers = JsonSerializer.Deserialize<List<Wallpaper>>(wallEl.GetRawText()) ?? new();
                foreach (var item in wallpapers)
                {
                    var existing = await db.Wallpapers.FirstOrDefaultAsync(x => x.Title == item.Title, ct);
                    if (existing == null) db.Wallpapers.Add(item);
                    else
                    {
                        existing.Resolution = item.Resolution;
                        existing.ImageUrl = item.ImageUrl;
                        existing.DownloadUrl = item.DownloadUrl;
                        existing.SortOrder = item.SortOrder;
                    }
                }
                restoredCounts["wallpapers"] = wallpapers.Count;
            }

            // Phục hồi Innovations
            if (data.TryGetProperty("innovations", out var innoEl) && innoEl.ValueKind == JsonValueKind.Array)
            {
                var innovations = JsonSerializer.Deserialize<List<Innovation>>(innoEl.GetRawText()) ?? new();
                foreach (var item in innovations)
                {
                    var existing = await db.Innovations.FirstOrDefaultAsync(x => x.Title == item.Title, ct);
                    if (existing == null) db.Innovations.Add(item);
                    else
                    {
                        existing.Tag = item.Tag;
                        existing.Description = item.Description;
                        existing.HighlightsJson = item.HighlightsJson;
                        existing.ImageUrl = item.ImageUrl;
                        existing.SortOrder = item.SortOrder;
                    }
                }
                restoredCounts["innovations"] = innovations.Count;
            }

            // Phục hồi AboutStories
            if (data.TryGetProperty("aboutStories", out var storyEl) && storyEl.ValueKind == JsonValueKind.Array)
            {
                var stories = JsonSerializer.Deserialize<List<AboutStory>>(storyEl.GetRawText()) ?? new();
                foreach (var item in stories)
                {
                    var existing = await db.AboutStories.FirstOrDefaultAsync(x => x.YearTag == item.YearTag && x.Heading == item.Heading, ct);
                    if (existing == null) db.AboutStories.Add(item);
                    else
                    {
                        existing.Content = item.Content;
                        existing.ImageUrl = item.ImageUrl;
                        existing.SortOrder = item.SortOrder;
                    }
                }
                restoredCounts["aboutStories"] = stories.Count;
            }

            // Phục hồi FeaturedVideos
            if (data.TryGetProperty("featuredVideos", out var vidEl) && vidEl.ValueKind == JsonValueKind.Array)
            {
                var videos = JsonSerializer.Deserialize<List<FeaturedVideo>>(vidEl.GetRawText()) ?? new();
                foreach (var item in videos)
                {
                    var existing = await db.FeaturedVideos.FirstOrDefaultAsync(x => x.Title == item.Title, ct);
                    if (existing == null) db.FeaturedVideos.Add(item);
                    else
                    {
                        existing.VideoUrl = item.VideoUrl;
                        existing.ThumbnailUrl = item.ThumbnailUrl;
                        existing.IsBig = item.IsBig;
                        existing.SortOrder = item.SortOrder;
                        existing.IsActive = item.IsActive;
                    }
                }
                restoredCounts["featuredVideos"] = videos.Count;
            }

            try
            {
                await db.SaveChangesAsync(ct);
            }
            catch (DbUpdateException dbEx)
            {
                return BadRequest(new { message = $"Lỗi khi lưu CSDL: {dbEx.InnerException?.Message ?? dbEx.Message}" });
            }

            var username = User.Identity?.Name ?? "Admin";
            var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
            await auditLog.LogAsync(username, "BACKUP_RESTORE", "System", null, $"Khôi phục CSDL thành công từ file JSON. Danh mục khôi phục: {string.Join(", ", restoredCounts.Select(kv => $"{kv.Key}: {kv.Value}"))}", ip, ct);

            return Ok(new
            {
                success = true,
                message = "Khôi phục dữ liệu từ bản sao lưu JSON thành công!",
                restored = restoredCounts
            });
        }
    }
}
