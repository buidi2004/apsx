namespace RogAdmin.Application.Dtos.Dashboard;

public class DashboardStatsDto
{
    public int ArticlesTotal { get; set; }
    public int ArticlesHighlights { get; set; }
    public int ArticlesListing { get; set; }
    public int ArticlesActive { get; set; }
    public int HeroSlidesTotal { get; set; }
    public int HeroSlidesActive { get; set; }
    public int ProductCategoriesTotal { get; set; }
    public int ProductCategoriesActive { get; set; }
    public int FooterLinksTotal { get; set; }
    public int SiteSettingsTotal { get; set; }
    public int AdminUsersTotal { get; set; }

    // 8 chỉ số KPI kinh doanh mở rộng & cảnh báo review
    public int ProductsTotal { get; set; }
    public int ProductsInStock { get; set; }
    public int DealersTotal { get; set; }
    public int WarrantyRecordsTotal { get; set; }
    public int CustomersTotal { get; set; }
    public int OrdersTotal { get; set; }
    public int OrdersPending { get; set; }
    public int PendingReviewsTotal { get; set; }
}
