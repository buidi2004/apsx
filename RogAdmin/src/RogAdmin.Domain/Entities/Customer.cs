using RogAdmin.Domain.Common;
using RogAdmin.Domain.Enums;

namespace RogAdmin.Domain.Entities;

public class Customer : BaseEntity
{
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string PasswordSalt { get; set; } = string.Empty;
    public CustomerTier Tier { get; set; } = CustomerTier.Elite;
    public int Points { get; set; } = 100;
    public bool IsActive { get; set; } = true;

    public virtual ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
}
