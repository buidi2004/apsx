using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.EntityFrameworkCore;
using RogAdmin.Application.Common;
using RogAdmin.Application.Dtos.Products;
using RogAdmin.Application.Interfaces;
using RogAdmin.Domain.Entities;
using RogAdmin.Domain.Enums;

namespace RogAdmin.Api.Controllers.Admin;

public record UpdateProductRequest(
    string? Name,
    string? Tagline,
    string? ModelCode,
    string? CategorySlug,
    string? ThumbnailUrl,
    string? KeyVisualUrl,
    bool? IsHot,
    bool? IsFeatured,
    bool? IsActive
);

public record CreateProductRequest(
    string Slug,
    string Name,
    string CategorySlug,
    string ModelCode = "",
    string Tagline = "",
    string ThumbnailUrl = "",
    string KeyVisualUrl = "",
    decimal Price = 0,
    decimal? OldPrice = null,
    string DiscountLabel = "",
    StockStatus StockStatus = StockStatus.InStock
);

[ApiController]
[Route("api/admin/products")]
[Authorize(Roles = "Admin,Editor")]
public class ProductsAdminController(
    IProductCatalogService catalogService,
    IRepository<Product> productRepo,
    IRepository<ProductPrice> priceRepo,
    IUnitOfWork unitOfWork,
    IOutputCacheStore cacheStore) : ControllerBase
{
    /// <summary>Danh sách sản phẩm quản trị (phân trang, lọc danh mục, tìm kiếm).</summary>
    [HttpGet]
    public async Task<ActionResult<PagedResult<ProductListItemDto>>> GetPaged(
        [FromQuery] string? category,
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken ct = default)
    {
        var result = await catalogService.GetProductsAsync(category, search, page, pageSize, ct);
        return Ok(result);
    }

    /// <summary>Chi tiết sản phẩm theo ID.</summary>
    [HttpGet("{id:int}")]
    public async Task<ActionResult<ProductDetailDto>> GetById(int id, CancellationToken ct = default)
    {
        var product = await productRepo.Query()
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == id, ct);

        if (product == null) return NotFound(new { message = $"Không tìm thấy sản phẩm #{id}" });

        var detail = await catalogService.GetProductBySlugAsync(product.Slug, ct);
        return Ok(detail);
    }

    /// <summary>Cập nhật giá và trạng thái kho sản phẩm theo ID.</summary>
    [HttpPut("{id:int}/price")]
    public async Task<ActionResult<ProductPriceDto>> UpdatePrice(
        int id,
        [FromBody] UpdateProductPriceRequest req,
        CancellationToken ct = default)
    {
        var result = await catalogService.UpdateProductPriceAsync(
            id,
            req.Price,
            req.OldPrice,
            req.DiscountLabel,
            req.StockStatus,
            ct);

        if (result == null) return NotFound(new { message = $"Không tìm thấy sản phẩm #{id}" });

        // Xóa ngay lập tức bộ đệm cache tầng BE để phản ánh tức thì ra Frontend
        await cacheStore.EvictByTagAsync("public-content", ct);

        return Ok(result);
    }

    /// <summary>Cập nhật giá và trạng thái kho sản phẩm theo Slug.</summary>
    [HttpPut("price-by-slug/{**slug}")]
    public async Task<ActionResult<ProductPriceDto>> UpdatePriceBySlug(
        string slug,
        [FromBody] UpdateProductPriceRequest req,
        CancellationToken ct = default)
    {
        var result = await catalogService.UpdateProductPriceBySlugAsync(
            slug,
            req.Price,
            req.OldPrice,
            req.DiscountLabel,
            req.StockStatus,
            ct);

        if (result == null) return NotFound(new { message = $"Không tìm thấy sản phẩm slug: '{slug}'" });

        await cacheStore.EvictByTagAsync("public-content", ct);

        return Ok(result);
    }

    /// <summary>Cập nhật thông tin cơ bản của sản phẩm.</summary>
    [HttpPut("{id:int}")]
    public async Task<ActionResult> UpdateProduct(
        int id,
        [FromBody] UpdateProductRequest req,
        CancellationToken ct = default)
    {
        var product = await productRepo.GetByIdAsync(id, ct);
        if (product == null) return NotFound(new { message = $"Không tìm thấy sản phẩm #{id}" });

        if (!string.IsNullOrWhiteSpace(req.Name)) product.Name = req.Name.Trim();
        if (req.Tagline != null) product.Tagline = req.Tagline;
        if (req.ModelCode != null) product.ModelCode = req.ModelCode;
        if (!string.IsNullOrWhiteSpace(req.CategorySlug)) product.CategorySlug = req.CategorySlug.Trim();
        if (req.ThumbnailUrl != null) product.ThumbnailUrl = req.ThumbnailUrl;
        if (req.KeyVisualUrl != null) product.KeyVisualUrl = req.KeyVisualUrl;
        if (req.IsHot.HasValue) product.IsHot = req.IsHot.Value;
        if (req.IsFeatured.HasValue) product.IsFeatured = req.IsFeatured.Value;
        if (req.IsActive.HasValue) product.IsActive = req.IsActive.Value;

        productRepo.Update(product);
        await unitOfWork.SaveChangesAsync(ct);
        await cacheStore.EvictByTagAsync("public-content", ct);

        return Ok(product);
    }

    /// <summary>Thêm mới sản phẩm.</summary>
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> CreateProduct(
        [FromBody] CreateProductRequest req,
        CancellationToken ct = default)
    {
        var normalizedSlug = req.Slug.Trim().ToLower().TrimStart('/');
        var existing = await productRepo.Query().FirstOrDefaultAsync(p => p.Slug.ToLower() == normalizedSlug, ct);
        if (existing != null)
        {
            return Conflict(new { message = $"Sản phẩm với slug '{normalizedSlug}' đã tồn tại." });
        }

        var product = new Product
        {
            Slug = normalizedSlug,
            Name = req.Name,
            CategorySlug = req.CategorySlug,
            ModelCode = req.ModelCode,
            Tagline = req.Tagline,
            ThumbnailUrl = req.ThumbnailUrl,
            KeyVisualUrl = req.KeyVisualUrl,
            BasePath = "/" + normalizedSlug,
            IsActive = true
        };

        await productRepo.AddAsync(product, ct);
        await unitOfWork.SaveChangesAsync(ct);

        if (req.Price > 0 || req.OldPrice.HasValue || !string.IsNullOrEmpty(req.DiscountLabel))
        {
            var price = new ProductPrice
            {
                ProductId = product.Id,
                Price = req.Price,
                OldPrice = req.OldPrice,
                DiscountLabel = req.DiscountLabel,
                StockStatus = req.StockStatus,
                Currency = "VND",
                LastCheckedAt = DateTime.UtcNow
            };
            await priceRepo.AddAsync(price, ct);
            await unitOfWork.SaveChangesAsync(ct);
        }

        await cacheStore.EvictByTagAsync("public-content", ct);

        return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
    }

    /// <summary>Xóa sản phẩm — chỉ Admin.</summary>
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct = default)
    {
        var product = await productRepo.Query()
            .Include(p => p.Price)
            .Include(p => p.Specs)
            .FirstOrDefaultAsync(p => p.Id == id, ct);

        if (product == null) return NotFound(new { message = $"Không tìm thấy sản phẩm #{id}" });

        if (product.Price != null)
        {
            priceRepo.Remove(product.Price);
        }
        productRepo.Remove(product);
        await unitOfWork.SaveChangesAsync(ct);

        await cacheStore.EvictByTagAsync("public-content", ct);

        return NoContent();
    }
}
