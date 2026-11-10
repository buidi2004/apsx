using RogAdmin.Domain.Enums;

namespace RogAdmin.Domain.Entities;

/// <summary>Link footer: nhóm chính (Footer), pháp lý (Legal) và mạng xã hội (Social).</summary>
public class FooterLink : BaseEntity
{
    public string Label { get; set; } = string.Empty;
    public string Href { get; set; } = string.Empty;
    public FooterLinkGroup Group { get; set; } = FooterLinkGroup.Footer;
    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
}
