namespace RogAdmin.Domain.Entities;

public class FeaturedVideo : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string VideoUrl { get; set; } = string.Empty;
    public string ThumbnailUrl { get; set; } = string.Empty;
    public bool IsBig { get; set; }
    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
}
