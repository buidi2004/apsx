namespace RogAdmin.Domain.Entities;

/// <summary>Danh mục sản phẩm carousel "KHÁM PHÁ SẢN PHẨM" — shape FE {image, label, href}.</summary>
public class ProductCategory : BaseEntity
{
    public string Label { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string Href { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
}
