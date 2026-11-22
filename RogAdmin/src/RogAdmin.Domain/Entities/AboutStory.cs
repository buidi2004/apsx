using RogAdmin.Domain.Common;

namespace RogAdmin.Domain.Entities;

/// <summary>
/// Cột mốc lịch sử và câu chuyện thương hiệu ROG (About ROG - Crosshair 2006, etc.).
/// </summary>
public class AboutStory : BaseEntity
{
    public string YearTag { get; set; } = string.Empty;
    public string Heading { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
}
