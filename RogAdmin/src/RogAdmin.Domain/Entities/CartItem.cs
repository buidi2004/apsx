using RogAdmin.Domain.Common;

namespace RogAdmin.Domain.Entities;

public class CartItem : BaseEntity
{
    public int CustomerId { get; set; }
    public int ProductId { get; set; }
    public int Quantity { get; set; } = 1;
    public string SelectedSpecs { get; set; } = string.Empty; // e.g. "RTX 5090 / 64GB RAM / 2TB SSD"

    public virtual Customer Customer { get; set; } = null!;
    public virtual Product Product { get; set; } = null!;
}
