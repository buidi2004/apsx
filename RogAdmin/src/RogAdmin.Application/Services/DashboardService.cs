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
    IRepository<AdminUser> users,
    IRepository<Product> products,
    IRepository<ProductPrice> prices,
    IRepository<Dealer> dealers,
    IRepository<WarrantyRecord> warrantyRecords,
    IRepository<Customer> customers,
    IRepository<Order> orders,
    IReviewRepository reviews) : IDashboardService
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

            // 8 chỉ số KPI kinh doanh & cảnh báo review
            ProductsTotal = await products.Query().CountAsync(ct),
            ProductsInStock = await prices.Query().CountAsync(p => p.StockStatus == StockStatus.InStock, ct),
            DealersTotal = await dealers.Query().CountAsync(ct),
            WarrantyRecordsTotal = await warrantyRecords.Query().CountAsync(ct),
            CustomersTotal = await customers.Query().CountAsync(ct),
            OrdersTotal = await orders.Query().CountAsync(ct),
            OrdersPending = await orders.Query().CountAsync(o => o.Status == OrderStatus.Pending, ct),
            PendingReviewsTotal = await reviews.Query().CountAsync(r => !r.IsApproved, ct),
        };
    }
}
