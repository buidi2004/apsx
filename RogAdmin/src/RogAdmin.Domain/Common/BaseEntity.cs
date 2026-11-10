namespace RogAdmin.Domain.Common;

/// <summary>
/// Base cho mọi entity: khóa tự tăng + dấu thời gian audit.
/// </summary>
public abstract class BaseEntity
{
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
