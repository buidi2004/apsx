namespace RogAdmin.Application.Dtos.Public;

/// <summary>
/// Shape JSON trả về KHỚP hệt dữ liệu FE đang hardcode, để FE gọi được mà không phải sửa BE.
/// </summary>
public class PublicHeroSlideDto
{
    public string Src { get; set; } = string.Empty;
    public string Alt { get; set; } = string.Empty;
    public string Href { get; set; } = "#";
}

public class PublicProductCategoryDto
{
    public string Image { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public string Href { get; set; } = string.Empty;
}

/// <summary>
/// Superset bài viết: Highlights cần {img, tag, title, date, href},
/// Listing cần {img, tag, title, excerpt, href}. Field không dùng của section sẽ null.
/// </summary>
public class PublicArticleDto
{
    public string Img { get; set; } = string.Empty;
    public string Tag { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Excerpt { get; set; }

    /// <summary>Định dạng trùng FE: "Jun 30, 2026".</summary>
    public string? Date { get; set; }

    public string Href { get; set; } = string.Empty;
}

public class PublicArticleDetailDto
{
    public string Title { get; set; } = string.Empty;
    public string Lead { get; set; } = string.Empty;
    public string Date { get; set; } = string.Empty;
    public string Image { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string ContentHtml { get; set; } = string.Empty;
}

public class PublicLinkDto
{
    public string Label { get; set; } = string.Empty;
    public string Href { get; set; } = string.Empty;
}

public class PublicPromoBarDto
{
    public string Text { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
}

public class PublicJoinRepublicDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public string Image { get; set; } = string.Empty;
    public string ImageAlt { get; set; } = string.Empty;
}

public class PublicCompanyDto
{
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string BusinessRegistration { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string EcommerceLicense { get; set; } = string.Empty;
}

public class PublicNewsletterDto
{
    public string Label { get; set; } = string.Empty;
    public string Placeholder { get; set; } = string.Empty;
    public string Button { get; set; } = string.Empty;
}

public class PublicBadgeDto
{
    public string Url { get; set; } = string.Empty;
    public string Image { get; set; } = string.Empty;
    public string Alt { get; set; } = string.Empty;
}

public class PublicFooterDto
{
    public IReadOnlyList<PublicLinkDto> Links { get; set; } = [];
    public IReadOnlyList<PublicLinkDto> LegalLinks { get; set; } = [];
    public IReadOnlyList<PublicLinkDto> Social { get; set; } = [];
    public PublicCompanyDto Company { get; set; } = new();
    public PublicNewsletterDto Newsletter { get; set; } = new();
    public PublicBadgeDto Badge { get; set; } = new();
    public string Region { get; set; } = string.Empty;
    public string Copyright { get; set; } = string.Empty;
}

public class PublicSiteConfigDto
{
    public PublicPromoBarDto PromoBar { get; set; } = new();
    public PublicJoinRepublicDto JoinRepublic { get; set; } = new();
    public PublicFooterDto Footer { get; set; } = new();
}
