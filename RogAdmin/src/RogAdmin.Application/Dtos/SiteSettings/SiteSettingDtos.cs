using System.ComponentModel.DataAnnotations;

namespace RogAdmin.Application.Dtos.SiteSettings;

/// <summary>
/// Danh mục khóa cấu hình site — mirror toàn bộ text/link hardcoded ở FE
/// (PromoBar, JoinRepublic, footer company, newsletter, badge, region, copyright).
/// </summary>
public static class SiteSettingKeys
{
    // PromoBar
    public const string PromoBarText = "promoBarText";
    public const string PromoBarUrl = "promoBarUrl";

    // JoinRepublic (trang chủ)
    public const string JoinRepublicTitle = "joinRepublicTitle";
    public const string JoinRepublicDescription = "joinRepublicDescription";
    public const string JoinRepublicUrl = "joinRepublicUrl";
    public const string JoinRepublicImage = "joinRepublicImage";
    public const string JoinRepublicImageAlt = "joinRepublicImageAlt";

    // Footer — thông tin công ty
    public const string CompanyName = "companyName";
    public const string CompanyAddress = "companyAddress";
    public const string CompanyBusinessRegistration = "companyBusinessRegistration";
    public const string CompanyPhone = "companyPhone";
    public const string CompanyEcommerceLicense = "companyEcommerceLicense";

    // Footer — newsletter
    public const string NewsletterLabel = "newsletterLabel";
    public const string NewsletterPlaceholder = "newsletterPlaceholder";
    public const string NewsletterButton = "newsletterButton";

    // Footer — badge Bộ Công Thương
    public const string BadgeUrl = "badgeUrl";
    public const string BadgeImage = "badgeImage";
    public const string BadgeAlt = "badgeAlt";

    // Footer — dòng cuối
    public const string FooterRegion = "footerRegion";
    public const string FooterCopyright = "footerCopyright";

    /// <summary>Toàn bộ khóa hợp lệ (dùng để seed + validate + build site-config).</summary>
    public static readonly IReadOnlyList<string> All =
    [
        PromoBarText, PromoBarUrl,
        JoinRepublicTitle, JoinRepublicDescription, JoinRepublicUrl, JoinRepublicImage, JoinRepublicImageAlt,
        CompanyName, CompanyAddress, CompanyBusinessRegistration, CompanyPhone, CompanyEcommerceLicense,
        NewsletterLabel, NewsletterPlaceholder, NewsletterButton,
        BadgeUrl, BadgeImage, BadgeAlt,
        FooterRegion, FooterCopyright,
    ];
}

public class SiteSettingDto
{
    public string Key { get; set; } = string.Empty;

    [MaxLength(2000, ErrorMessage = "Giá trị cấu hình tối đa 2000 ký tự.")]
    public string Value { get; set; } = string.Empty;
    public string? Description { get; set; }
}

public class UpdateSiteSettingRequest
{
    [MaxLength(2000, ErrorMessage = "Giá trị cấu hình tối đa 2000 ký tự.")]
    public string? Value { get; set; }
}

public class UpdateSiteSettingsRequest
{
    public List<SiteSettingDto> Settings { get; set; } = [];
}
