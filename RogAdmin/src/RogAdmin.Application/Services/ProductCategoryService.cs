using RogAdmin.Application.Dtos.ProductCategories;
using RogAdmin.Application.Exceptions;
using RogAdmin.Application.Interfaces;
using RogAdmin.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace RogAdmin.Application.Services;

public class ProductCategoryService(
    IRepository<ProductCategory> repository,
    IUnitOfWork unitOfWork) : IProductCategoryService
{
    public async Task<IReadOnlyList<ProductCategoryDto>> GetAllAsync(bool includeInactive = true, CancellationToken ct = default)
    {
        var q = repository.Query().AsNoTracking();
        if (!includeInactive)
        {
            q = q.Where(c => c.IsActive);
        }
        var categories = await q.OrderBy(c => c.SortOrder).ThenBy(c => c.Id).ToListAsync(ct);
        return categories.Select(ToDto).ToList();
    }

    public async Task<ProductCategoryDto> GetByIdAsync(int id, CancellationToken ct = default)
    {
        var category = await repository.GetByIdAsync(id, ct)
                       ?? throw AppException.NotFound($"Danh mục sản phẩm #{id}");
        return ToDto(category);
    }

    public async Task<ProductCategoryDto> CreateAsync(CreateProductCategoryRequest request, CancellationToken ct = default)
    {
        Validate(request.Label, request.ImageUrl, request.Href);

        var category = new ProductCategory
        {
            Label = request.Label.Trim(),
            ImageUrl = request.ImageUrl.Trim(),
            Href = request.Href.Trim(),
            SortOrder = request.SortOrder,
            IsActive = request.IsActive,
        };

        await repository.AddAsync(category, ct);
        await unitOfWork.SaveChangesAsync(ct);
        return ToDto(category);
    }

    public async Task<ProductCategoryDto> UpdateAsync(int id, UpdateProductCategoryRequest request, CancellationToken ct = default)
    {
        Validate(request.Label, request.ImageUrl, request.Href);

        var category = await repository.GetByIdAsync(id, ct)
                       ?? throw AppException.NotFound($"Danh mục sản phẩm #{id}");

        category.Label = request.Label.Trim();
        category.ImageUrl = request.ImageUrl.Trim();
        category.Href = request.Href.Trim();
        category.SortOrder = request.SortOrder;
        category.IsActive = request.IsActive;
        category.UpdatedAt = DateTime.UtcNow;

        repository.Update(category);
        await unitOfWork.SaveChangesAsync(ct);
        return ToDto(category);
    }

    public async Task DeleteAsync(int id, CancellationToken ct = default)
    {
        var category = await repository.GetByIdAsync(id, ct)
                       ?? throw AppException.NotFound($"Danh mục sản phẩm #{id}");
        repository.Remove(category);
        await unitOfWork.SaveChangesAsync(ct);
    }

    private static void Validate(string label, string imageUrl, string href)
    {
        if (string.IsNullOrWhiteSpace(label))
        {
            throw AppException.BadRequest("Tên danh mục không được để trống.");
        }
        if (string.IsNullOrWhiteSpace(imageUrl))
        {
            throw AppException.BadRequest("Ảnh danh mục không được để trống.");
        }
        if (string.IsNullOrWhiteSpace(href))
        {
            throw AppException.BadRequest("Đường dẫn danh mục không được để trống.");
        }
    }

    private static ProductCategoryDto ToDto(ProductCategory c) => new()
    {
        Id = c.Id,
        Label = c.Label,
        ImageUrl = c.ImageUrl,
        Href = c.Href,
        SortOrder = c.SortOrder,
        IsActive = c.IsActive,
    };
}
