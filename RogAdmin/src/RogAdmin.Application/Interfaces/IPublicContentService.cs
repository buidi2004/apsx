using RogAdmin.Application.Dtos.Public;

namespace RogAdmin.Application.Interfaces;

/// <summary>
/// Dữ liệu công khai cho FE — compose đúng shape JSON mà FE đang hardcode
/// ({src,alt} / {image,label,href} / {img,tag,title,excerpt,date,href} / site-config).
/// </summary>
public interface IPublicContentService
{
    Task<IReadOnlyList<PublicHeroSlideDto>> GetHeroSlidesAsync(CancellationToken ct = default);
    Task<IReadOnlyList<PublicProductCategoryDto>> GetProductCategoriesAsync(CancellationToken ct = default);

    /// <summary>
    /// section truyền dạng chuỗi "highlights" | "listing" (bỏ trống lấy tất cả).
    /// tag truyền có/không prefix "// " đều được (ví dụ "Guides" hoặc "// Guides").
    /// </summary>
    Task<IReadOnlyList<PublicArticleDto>> GetArticlesAsync(string? section, string? tag, CancellationToken ct = default);
    Task<PublicArticleDetailDto?> GetArticleAsync(string slug, CancellationToken ct = default);
    Task<PublicSiteConfigDto> GetSiteConfigAsync(CancellationToken ct = default);
}
