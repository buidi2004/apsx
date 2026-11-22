using RogAdmin.Domain.Common;

namespace RogAdmin.Domain.Entities;

public class EventCampaign : BaseEntity
{
    public string Badge { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Period { get; set; } = string.Empty;
    public string Desc { get; set; } = string.Empty;
    public string Img { get; set; } = string.Empty;
    public string CtaText { get; set; } = "XEM CHI TIẾT";
    public string CtaLink { get; set; } = "/vn/laptops-group";
    public bool IsActive { get; set; } = true;
    public int SortOrder { get; set; }
}
