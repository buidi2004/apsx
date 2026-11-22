using RogAdmin.Domain.Common;

namespace RogAdmin.Domain.Entities;

/// <summary>
/// Hình nền & Wallpaper 4K gaming cho game thủ.
/// </summary>
public class Wallpaper : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Resolution { get; set; } = "3840 x 2160 (4K)";
    public string ImageUrl { get; set; } = string.Empty;
    public string DownloadUrl { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
}
