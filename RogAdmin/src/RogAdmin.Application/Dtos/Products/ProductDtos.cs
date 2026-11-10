using RogAdmin.Domain.Enums;

namespace RogAdmin.Application.Dtos.Products;

public record ProductListItemDto(
    int Id,
    string Slug,
    string Name,
    string CategorySlug,
    string ModelCode,
    string Tagline,
    string ThumbnailUrl,
    string BasePath,
    decimal Price,
    decimal? OldPrice,
    string DiscountLabel,
    StockStatus StockStatus,
    bool IsHot,
    bool IsFeatured,
    bool IsActive
);

public record ProductSpecDto(
    string Group,
    string Key,
    string Value
);

public record ProductDetailDto(
    int Id,
    string Slug,
    string Name,
    string CategorySlug,
    string ModelCode,
    string Tagline,
    string ThumbnailUrl,
    string KeyVisualUrl,
    string BasePath,
    string SubBarType,
    decimal Price,
    decimal? OldPrice,
    string DiscountLabel,
    StockStatus StockStatus,
    string StoreUrl,
    List<ProductSpecDto> Specs
);

public record ProductPriceDto(
    int ProductId,
    string Slug,
    decimal Price,
    decimal? OldPrice,
    string DiscountLabel,
    StockStatus StockStatus,
    string FormattedPrice,
    string? FormattedOldPrice
);

public record DealerDto(
    int Id,
    string Name,
    string Slug,
    string LogoUrl,
    string WebsiteUrl,
    string Hotline,
    bool IsOfficialPartner,
    int StoreCount,
    string CityCoverage
);

public record WarrantyCheckResultDto(
    string SerialNumber,
    string ProductModel,
    DateTime PurchaseDate,
    DateTime ExpiryDate,
    WarrantyStatus Status,
    string StatusText,
    string ServiceCenter
);

public record CompareMatrixDto(
    List<ProductDetailDto> Products,
    List<string> CommonSpecKeys
);

public record UpdateProductPriceRequest(
    decimal Price,
    decimal? OldPrice = null,
    string? DiscountLabel = null,
    StockStatus? StockStatus = null
);

public record CreateProductRequest(
    string Name,
    string Slug,
    string CategorySlug,
    string? ModelCode = null,
    string? Tagline = null,
    string? ThumbnailUrl = null,
    string? KeyVisualUrl = null,
    string? BasePath = null,
    decimal Price = 0,
    decimal? OldPrice = null,
    string? DiscountLabel = null,
    StockStatus StockStatus = StockStatus.InStock,
    bool IsHot = false,
    bool IsFeatured = false
);

public record UpdateProductRequest(
    string Name,
    string CategorySlug,
    string? ModelCode = null,
    string? Tagline = null,
    string? ThumbnailUrl = null,
    string? KeyVisualUrl = null,
    string? BasePath = null,
    bool IsHot = false,
    bool IsFeatured = false,
    bool IsActive = true
);
