using RogAdmin.Application.Common;
using RogAdmin.Application.Dtos.Products;
using RogAdmin.Domain.Enums;

namespace RogAdmin.Application.Interfaces;

public interface IProductCatalogService
{
    Task<PagedResult<ProductListItemDto>> GetProductsAsync(
        string? category,
        string? search,
        int page = 1,
        int pageSize = 20,
        CancellationToken ct = default);

    Task<ProductDetailDto?> GetProductBySlugAsync(string slug, CancellationToken ct = default);

    Task<List<ProductPriceDto>> GetBatchPricingAsync(List<string> slugs, CancellationToken ct = default);

    Task<CompareMatrixDto> CompareProductsAsync(List<string> slugs, CancellationToken ct = default);

    Task<List<DealerDto>> GetDealersAsync(CancellationToken ct = default);

    Task<WarrantyCheckResultDto?> CheckWarrantyAsync(string serialNumber, CancellationToken ct = default);

    Task<ProductPriceDto?> UpdateProductPriceAsync(
        int productId,
        decimal price,
        decimal? oldPrice,
        string? discountLabel,
        StockStatus? stockStatus,
        CancellationToken ct = default);

    Task<ProductPriceDto?> UpdateProductPriceBySlugAsync(
        string slug,
        decimal price,
        decimal? oldPrice,
        string? discountLabel,
        StockStatus? stockStatus,
        CancellationToken ct = default);

    Task<ProductDetailDto?> GetProductByIdAsync(int id, CancellationToken ct = default);

    Task<ProductListItemDto> CreateProductAsync(CreateProductRequest request, CancellationToken ct = default);

    Task<ProductListItemDto?> UpdateProductAsync(int id, UpdateProductRequest request, CancellationToken ct = default);

    Task<bool> DeleteProductAsync(int id, CancellationToken ct = default);
}
