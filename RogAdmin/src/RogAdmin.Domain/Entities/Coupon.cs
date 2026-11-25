using RogAdmin.Domain.Common;
using RogAdmin.Domain.Enums;

namespace RogAdmin.Domain.Entities;

public class Coupon : BaseEntity
{
    public string Code { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DiscountType DiscountType { get; set; } = DiscountType.FixedAmount;
    public decimal DiscountValue { get; set; }
    public decimal MinOrderValue { get; set; } = 0;
    public decimal? MaxDiscountAmount { get; set; }
    public DateTime? ValidFrom { get; set; }
    public DateTime? ValidTo { get; set; }
    public int UsageLimit { get; set; } = 100;
    public int UsedCount { get; set; } = 0;
    public bool IsActive { get; set; } = true;
}
