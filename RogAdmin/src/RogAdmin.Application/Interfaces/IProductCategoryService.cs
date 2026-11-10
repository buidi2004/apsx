using RogAdmin.Application.Dtos.ProductCategories;

namespace RogAdmin.Application.Interfaces;

public interface IProductCategoryService
{
    Task<IReadOnlyList<ProductCategoryDto>> GetAllAsync(bool includeInactive = true, CancellationToken ct = default);
    Task<ProductCategoryDto> GetByIdAsync(int id, CancellationToken ct = default);
    Task<ProductCategoryDto> CreateAsync(CreateProductCategoryRequest request, CancellationToken ct = default);
    Task<ProductCategoryDto> UpdateAsync(int id, UpdateProductCategoryRequest request, CancellationToken ct = default);
    Task DeleteAsync(int id, CancellationToken ct = default);
}
