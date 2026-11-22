using RogAdmin.Domain.Common;

namespace RogAdmin.Domain.Entities;

/// <summary>Một dòng sản phẩm trong đơn hàng. Giá được chốt tại thời điểm đặt.</summary>
public class OrderItem : BaseEntity
{
    public int OrderId { get; set; }
    public int? ProductId { get; set; }

    public string ProductSlug { get; set; } = string.Empty;
    public string ProductName { get; set; } = string.Empty;
    public string SelectedSpecs { get; set; } = string.Empty;

    /// <summary>Đơn vị: VND (số nguyên).</summary>
    public long UnitPrice { get; set; }
    public int Quantity { get; set; } = 1;
    public long LineTotal { get; set; }

    public virtual Order Order { get; set; } = null!;
}
