using RogAdmin.Application.Dtos.Dashboard;
using RogAdmin.Application.Interfaces;
using RogAdmin.Domain.Entities;
using RogAdmin.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace RogAdmin.Application.Services;

public class DashboardService(
    IRepository<Article> articles,
    IRepository<HeroSlide> heroSlides,
    IRepository<ProductCategory> categories,
    IRepository<FooterLink> footerLinks,
    IRepository<SiteSetting> settings,
    IRepository<AdminUser> users) : IDashboardService
{
    public async Task<DashboardStatsDto> GetStatsAsync(CancellationToken ct = default)
    {
        var articleQuery = articles.Query().AsNoTracking();
        var heroQuery = heroSlides.Query().AsNoTracking();
        var categoryQuery = categories.Query().AsNoTracking();

        return new DashboardStatsDto
        {
            ArticlesTotal = await articleQuery.CountAsync(ct),
            ArticlesHighlights = await articleQuery.CountAsync(a => a.Section == ArticleSection.Highlights, ct),
            ArticlesListing = await articleQuery.CountAsync(a => a.Section == ArticleSection.Listing, ct),
            ArticlesActive = await articleQuery.CountAsync(a => a.IsActive, ct),
            HeroSlidesTotal = await heroQuery.CountAsync(ct),
            HeroSlidesActive = await heroQuery.CountAsync(s => s.IsActive, ct),
            ProductCategoriesTotal = await categoryQuery.CountAsync(ct),
            ProductCategoriesActive = await categoryQuery.CountAsync(c => c.IsActive, ct),
            FooterLinksTotal = await footerLinks.Query().CountAsync(ct),
            SiteSettingsTotal = await settings.Query().CountAsync(ct),
            AdminUsersTotal = await users.Query().CountAsync(ct),
        };
    }
}
