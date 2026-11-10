namespace RogAdmin.Domain.Entities;

/// <summary>
/// Cấu hình site dạng key-value: PromoBar, JoinRepublic, thông tin công ty footer,
/// newsletter, badge Bộ Công Thương... Khóa được liệt kê tĩnh trong
/// RogAdmin.Application.Dtos.SiteSettingKeys.
/// </summary>
public class SiteSetting : BaseEntity
{
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string? Description { get; set; }
}
