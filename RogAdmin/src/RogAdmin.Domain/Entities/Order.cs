using RogAdmin.Domain.Common;
using RogAdmin.Domain.Enums;

namespace RogAdmin.Domain.Entities;

/// <summary>Đơn hàng đặt từ storefront (guest hoặc thành viên ROG Elite).</summary>
public class Order : BaseEntity
{
    public string OrderCode { get; set; } = string.Empty;
    public int? CustomerId { get; set; }

    public string CustomerName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Note { get; set; } = string.Empty;

    /// <summary>Đơn vị: VND (số nguyên, không có phần thập phân).</summary>
    public long Subtotal { get; set; }
    public long ShippingFee { get; set; }
    public long Total { get; set; }

    public OrderStatus Status { get; set; } = OrderStatus.Pending;

    public virtual ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}
