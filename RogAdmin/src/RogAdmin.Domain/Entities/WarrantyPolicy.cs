using RogAdmin.Domain.Common;

namespace RogAdmin.Domain.Entities;

/// <summary>
/// Chính sách bảo hành (On-site, Perfect warranty, 2 năm quốc tế...).
/// </summary>
public class WarrantyPolicy : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
}
