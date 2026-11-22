using RogAdmin.Domain.Common;

namespace RogAdmin.Domain.Entities;

/// <summary>
/// Công nghệ & Sáng tạo đột phá của ROG (Intelligent Cooling, Nebula Display, AniMe Matrix, MUX Switch...).
/// </summary>
public class Innovation : BaseEntity
{
    public string Tag { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string HighlightsJson { get; set; } = "[]";
    public string ImageUrl { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
}
