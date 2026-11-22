using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RogAdmin.Application.Interfaces;
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
}
