using RogAdmin.Domain.Enums;

namespace RogAdmin.Application.Dtos.Warranty;

public record WarrantyRecordDto(
    int Id,
    string SerialNumber,
    string ProductModel,
    DateTime PurchaseDate,
    DateTime ExpiryDate,
    WarrantyStatus Status,
    string StatusText,
    string ServiceCenter
);

public record CreateWarrantyRecordRequest(
    string SerialNumber,
    string ProductModel,
    DateTime PurchaseDate,
    DateTime ExpiryDate,
    WarrantyStatus Status = WarrantyStatus.Active,
    string ServiceCenter = "ASUS Service Center TP.HCM - 285 CMT8"
);

public record UpdateWarrantyRecordRequest(
    string SerialNumber,
    string ProductModel,
    DateTime PurchaseDate,
    DateTime ExpiryDate,
    WarrantyStatus Status,
    string ServiceCenter
);
