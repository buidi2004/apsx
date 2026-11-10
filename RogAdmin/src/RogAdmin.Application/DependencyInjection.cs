using Microsoft.Extensions.DependencyInjection;
using RogAdmin.Application.Interfaces;
using RogAdmin.Application.Services;

namespace RogAdmin.Application;

public static class DependencyInjection
{
    /// <summary>Đăng ký toàn bộ service nghiệp vụ tầng Application.</summary>
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IArticleService, ArticleService>();
        services.AddScoped<IHeroSlideService, HeroSlideService>();
        services.AddScoped<IProductCategoryService, ProductCategoryService>();
        services.AddScoped<IFooterLinkService, FooterLinkService>();
        services.AddScoped<ISiteSettingService, SiteSettingService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IDashboardService, DashboardService>();
        services.AddScoped<IPublicContentService, PublicContentService>();
        services.AddScoped<IProductCatalogService, ProductCatalogService>();
        services.AddScoped<IScraperService, ScraperService>();
        return services;
    }
}
