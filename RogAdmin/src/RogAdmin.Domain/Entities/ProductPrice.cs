using RogAdmin.Domain.Common;
using RogAdmin.Domain.Enums;

namespace RogAdmin.Domain.Entities;

public class ProductPrice : BaseEntity
{
    public int ProductId { get; set; }
    public decimal Price { get; set; }
    public decimal? OldPrice { get; set; }
    public string Currency { get; set; } = "VND";
    public string DiscountLabel { get; set; } = string.Empty; // e.g. "-15%", "TIẾT KIỆM 5 TRIỆU"
    public StockStatus StockStatus { get; set; } = StockStatus.InStock;
    public string StoreUrl { get; set; } = string.Empty;
    public DateTime LastCheckedAt { get; set; } = DateTime.UtcNow;

    public virtual Product Product { get; set; } = null!;
}
