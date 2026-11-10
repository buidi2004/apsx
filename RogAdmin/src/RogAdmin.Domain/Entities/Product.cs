using RogAdmin.Domain.Common;

namespace RogAdmin.Domain.Entities;

public class Product : BaseEntity
{
    public string Slug { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string CategorySlug { get; set; } = string.Empty;
    public string ModelCode { get; set; } = string.Empty;
    public string Tagline { get; set; } = string.Empty;
    public string ThumbnailUrl { get; set; } = string.Empty;
    public string KeyVisualUrl { get; set; } = string.Empty;
    public string BasePath { get; set; } = string.Empty;
    public string SubBarType { get; set; } = "standard";
    public bool IsHot { get; set; }
    public bool IsFeatured { get; set; }
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public virtual ProductPrice? Price { get; set; }
    public virtual ICollection<ProductSpec> Specs { get; set; } = new List<ProductSpec>();
}
