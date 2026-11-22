using RogAdmin.Domain.Common;

namespace RogAdmin.Domain.Entities;

/// <summary>
/// Đặc quyền và tiêu chuẩn tích điểm hạng ROG Elite Rewards (Bronze, Silver, Gold, Diamond...).
/// </summary>
public class EliteTierPerk : BaseEntity
{
    public string Tier { get; set; } = string.Empty;
    public string PointsRange { get; set; } = string.Empty;
    public string Perk { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
}
