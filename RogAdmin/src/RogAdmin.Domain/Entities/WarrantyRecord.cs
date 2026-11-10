using RogAdmin.Domain.Common;
using RogAdmin.Domain.Enums;

namespace RogAdmin.Domain.Entities;

public class WarrantyRecord : BaseEntity
{
    public string SerialNumber { get; set; } = string.Empty; // e.g. "R4NRCX0001"
    public string ProductModel { get; set; } = string.Empty; // e.g. "ROG Zephyrus G16 GU605"
    public DateTime PurchaseDate { get; set; }
    public DateTime ExpiryDate { get; set; }
    public WarrantyStatus Status { get; set; } = WarrantyStatus.Active;
    public string ServiceCenter { get; set; } = "ASUS Service Center TP.HCM - 285 CMT8";
}
