using RogAdmin.Domain.Common;

namespace RogAdmin.Domain.Entities;

/// <summary>
/// Kênh mạng xã hội cộng đồng ROG (Facebook, Discord, Youtube, TikTok...).
/// </summary>
public class SocialChannel : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string MembersCount { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Link { get; set; } = string.Empty;
    public string ButtonText { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
}
