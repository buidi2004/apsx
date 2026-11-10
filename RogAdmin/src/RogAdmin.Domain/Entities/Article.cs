using RogAdmin.Domain.Enums;

namespace RogAdmin.Domain.Entities;

/// <summary>
/// Bài viết — superset của hai shape FE đang hardcode:
/// Highlights dùng {img, tag, title, overlay?, date, href},
/// Listing dùng {img, tag, title, excerpt, href}.
/// Tag giữ nguyên prefix "// " đúng như dữ liệu FE (filter so sánh theo prefix này).
/// </summary>
public class Article : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string? Excerpt { get; set; }
    public string Tag { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string Href { get; set; } = string.Empty;
    public DateTime? PublishedDate { get; set; }
    public ArticleSection Section { get; set; } = ArticleSection.Listing;
    public bool IsBig { get; set; }

    /// <summary>Text overlay của FE Highlights — hiện FE chưa render, giữ để dùng sau.</summary>
    public string? OverlayText { get; set; }

    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
}
