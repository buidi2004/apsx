using RogAdmin.Domain.Common;

namespace RogAdmin.Domain.Entities;

public class Dealer : BaseEntity
{
    public string Name { get; set; } = string.Empty; // e.g. GearVN, Phong Vũ, CellphoneS
    public string Slug { get; set; } = string.Empty;
    public string LogoUrl { get; set; } = string.Empty;
    public string WebsiteUrl { get; set; } = string.Empty;
    public string Hotline { get; set; } = string.Empty;
    public bool IsOfficialPartner { get; set; } = true;
    public int StoreCount { get; set; }
    public string CityCoverage { get; set; } = "Toàn quốc"; // e.g. "Hà Nội, TP.HCM, Đà Nẵng..."
}
