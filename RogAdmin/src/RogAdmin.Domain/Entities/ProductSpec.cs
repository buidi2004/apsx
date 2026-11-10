using RogAdmin.Domain.Common;

namespace RogAdmin.Domain.Entities;

public class ProductSpec : BaseEntity
{
    public int ProductId { get; set; }
    public string SpecGroup { get; set; } = string.Empty; // e.g. "Processor", "Graphics", "Display"
    public string SpecKey { get; set; } = string.Empty;   // e.g. "Model", "Speed", "Cores"
    public string SpecValue { get; set; } = string.Empty; // e.g. "Intel Core Ultra 9 290HX"
    public int OrderIndex { get; set; }

    public virtual Product Product { get; set; } = null!;
}
