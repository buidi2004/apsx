namespace RogAdmin.Domain.Entities;

/// <summary>
/// Slide carousel hero trang chủ. FE hiện wrap link "#",
/// nên Href cho phép null và public API vẫn trả đủ shape {src, alt, href}.
/// </summary>
public class HeroSlide : BaseEntity
{
    public string ImageUrl { get; set; } = string.Empty;
    public string AltText { get; set; } = string.Empty;
    public string? Href { get; set; }
    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
}
