using System.Globalization;
using RogAdmin.Application.Common;
using RogAdmin.Application.Dtos.Public;
using RogAdmin.Application.Exceptions;
using RogAdmin.Application.Dtos.SiteSettings;
using RogAdmin.Application.Interfaces;
using RogAdmin.Domain.Entities;
using RogAdmin.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace RogAdmin.Application.Services;

/// <summary>
/// Build payload công khai khớp 1:1 với dữ liệu FE đang hardcode.
/// Chỉ lấy bản IsActive, sắp theo SortOrder.
/// </summary>
public class PublicContentService(
    IRepository<HeroSlide> heroSlides,
    IRepository<ProductCategory> categories,
    IRepository<Article> articles,
    IRepository<FooterLink> footerLinks,
    ISiteSettingService siteSettings) : IPublicContentService
{
    public async Task<IReadOnlyList<PublicHeroSlideDto>> GetHeroSlidesAsync(CancellationToken ct = default)
    {
        var slides = await heroSlides.Query().AsNoTracking()
            .Where(s => s.IsActive)
            .OrderBy(s => s.SortOrder).ThenBy(s => s.Id)
            .ToListAsync(ct);

        return slides.Select(s => new PublicHeroSlideDto
        {
            Src = s.ImageUrl,
            Alt = s.AltText,
            // FE hiện wrap link "#"
            Href = string.IsNullOrWhiteSpace(s.Href) ? "#" : s.Href,
        }).ToList();
    }

    public async Task<IReadOnlyList<PublicProductCategoryDto>> GetProductCategoriesAsync(CancellationToken ct = default)
    {
        var rows = await categories.Query().AsNoTracking()
            .Where(c => c.IsActive)
            .OrderBy(c => c.SortOrder).ThenBy(c => c.Id)
            .ToListAsync(ct);

        return rows.Select(c => new PublicProductCategoryDto
        {
            Image = c.ImageUrl,
            Label = c.Label,
            Href = c.Href,
        }).ToList();
    }

    public async Task<IReadOnlyList<PublicArticleDto>> GetArticlesAsync(string? section, string? tag, CancellationToken ct = default)
    {
        var q = articles.Query().AsNoTracking().Where(a => a.IsActive);

        // Parse section tại tầng Application — giá trị lạ trả 400 thay vì âm thầm trả tất cả
        var sectionValue = section?.Trim().ToLowerInvariant();
        ArticleSection? parsedSection = sectionValue switch
        {
            null or "" => null,
            "highlights" => ArticleSection.Highlights,
            "listing" => ArticleSection.Listing,
            _ => throw AppException.BadRequest("section chỉ nhận 'highlights' hoặc 'listing'."),
        };
        if (parsedSection.HasValue)
        {
            q = q.Where(a => a.Section == parsedSection.Value);
        }
        if (!string.IsNullOrWhiteSpace(tag))
        {
            // FE so sánh: a.tag.toLowerCase() === `// ${filter.toLowerCase()}`
            // TagNormalizer chấp nhận cả "Guides" lẫn "// Guides" (kể cả "//Guides")
            var normalized = TagNormalizer.Normalize(tag);
            q = q.Where(a => a.Tag.ToLower() == normalized.ToLower());
        }

        var rows = await q
            .OrderBy(a => a.Section).ThenBy(a => a.SortOrder).ThenByDescending(a => a.PublishedDate)
            .ToListAsync(ct);

        return rows.Select(a => new PublicArticleDto
        {
            Img = a.ImageUrl,
            Tag = a.Tag,
            Title = a.Title,
            Excerpt = a.Excerpt,
            Date = a.PublishedDate?.ToString("MMM d, yyyy", CultureInfo.InvariantCulture),
            Href = a.Href,
        }).ToList();
    }

    private static string NormalizeArticleSlug(string value)
    {
        value = value.Trim().TrimStart('/').ToLowerInvariant().TrimEnd('/');
        if (Uri.TryCreate(value, UriKind.Absolute, out var uri))
            value = uri.AbsolutePath.Trim('/').TrimEnd('/').ToLowerInvariant();

        if (value.StartsWith("vn/articles/", StringComparison.Ordinal))
            value = value["vn/articles/".Length..];
        else if (value.StartsWith("articles/", StringComparison.Ordinal))
            value = value["articles/".Length..];
        return value.Trim('/');
    }

    public async Task<PublicArticleDetailDto?> GetArticleAsync(string slug, CancellationToken ct = default)
    {
        var normalized = NormalizeArticleSlug(slug);

        var rows = await articles.Query().AsNoTracking()
            .Where(a => a.IsActive)
            .ToListAsync(ct);

        var article = rows.FirstOrDefault(a =>
        {
            var href = NormalizeArticleSlug(a.Href);
            return href == normalized;
        });

        if (article == null) return null;

        return new PublicArticleDetailDto
        {
            Title = article.Title,
            Lead = article.Excerpt ?? string.Empty,
            Date = article.PublishedDate?.ToString("MMM d, yyyy", CultureInfo.InvariantCulture) ?? string.Empty,
            Image = article.ImageUrl,
            Category = article.Tag.TrimStart('/', ' ').Trim(),
            ContentHtml = string.Empty,
        };
    }

    public async Task<PublicSiteConfigDto> GetSiteConfigAsync(CancellationToken ct = default)
    {
        var settings = await siteSettings.GetDictionaryAsync(ct);
        var links = await footerLinks.Query().AsNoTracking()
            .Where(l => l.IsActive)
            .OrderBy(l => l.Group).ThenBy(l => l.SortOrder).ThenBy(l => l.Id)
            .ToListAsync(ct);

        string Value(string key) => settings.TryGetValue(key, out var v) ? v : string.Empty;

        PublicLinkDto MapLink(FooterLink l) => new() { Label = l.Label, Href = l.Href };

        return new PublicSiteConfigDto
        {
            PromoBar = new PublicPromoBarDto
            {
                Text = Value(SiteSettingKeys.PromoBarText),
                Url = Value(SiteSettingKeys.PromoBarUrl),
            },
            JoinRepublic = new PublicJoinRepublicDto
            {
                Title = Value(SiteSettingKeys.JoinRepublicTitle),
                Description = Value(SiteSettingKeys.JoinRepublicDescription),
                Url = Value(SiteSettingKeys.JoinRepublicUrl),
                Image = Value(SiteSettingKeys.JoinRepublicImage),
                ImageAlt = Value(SiteSettingKeys.JoinRepublicImageAlt),
            },
            Footer = new PublicFooterDto
            {
                Links = links.Where(l => l.Group == FooterLinkGroup.Footer).Select(MapLink).ToList(),
                LegalLinks = links.Where(l => l.Group == FooterLinkGroup.Legal).Select(MapLink).ToList(),
                Social = links.Where(l => l.Group == FooterLinkGroup.Social).Select(MapLink).ToList(),
                Company = new PublicCompanyDto
                {
                    Name = Value(SiteSettingKeys.CompanyName),
                    Address = Value(SiteSettingKeys.CompanyAddress),
                    BusinessRegistration = Value(SiteSettingKeys.CompanyBusinessRegistration),
                    Phone = Value(SiteSettingKeys.CompanyPhone),
                    EcommerceLicense = Value(SiteSettingKeys.CompanyEcommerceLicense),
                },
                Newsletter = new PublicNewsletterDto
                {
                    Label = Value(SiteSettingKeys.NewsletterLabel),
                    Placeholder = Value(SiteSettingKeys.NewsletterPlaceholder),
                    Button = Value(SiteSettingKeys.NewsletterButton),
                },
                Badge = new PublicBadgeDto
                {
                    Url = Value(SiteSettingKeys.BadgeUrl),
                    Image = Value(SiteSettingKeys.BadgeImage),
                    Alt = Value(SiteSettingKeys.BadgeAlt),
                },
                Region = Value(SiteSettingKeys.FooterRegion),
                Copyright = Value(SiteSettingKeys.FooterCopyright),
            },
        };
    }
}
