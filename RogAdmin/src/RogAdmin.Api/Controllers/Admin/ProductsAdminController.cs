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

public record ProductSpecItemDto(
    int Id,
    int ProductId,
    string SpecGroup,
    string SpecKey,
    string SpecValue,
    int OrderIndex
);

public record SaveProductSpecRequest(
    string SpecGroup,
    string SpecKey,
    string SpecValue,
    int OrderIndex = 0
);

[ApiController]
[Route("api/admin/products")]
[Authorize(Roles = "Admin,Editor")]
public class ProductsAdminController(
    IProductCatalogService catalogService,
    IRepository<Product> productRepo,
    IRepository<ProductPrice> priceRepo,
    IRepository<ProductSpec> specRepo,
    IUnitOfWork unitOfWork,
    IOutputCacheStore cacheStore,
    IAuditLogService auditLog) : ControllerBase
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
        var result = await catalogService.GetProductsAsync(category, search, page, pageSize, includeInactive: true, ct);
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

        var detail = await catalogService.GetProductBySlugAsync(product.Slug, includeInactive: true, ct: ct);
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

        var username = User.Identity?.Name ?? "Admin";
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        await auditLog.LogAsync(username, "UPDATE_PRICE", "Product", id.ToString(), $"Cập nhật giá sản phẩm #{id}: {req.Price:N0} VNĐ, kho: {req.StockStatus}", ip, ct);

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

        // Trả DTO thay vì entity EF để tránh vòng lặp Product.Price.Product khi serialize.
        var detail = await catalogService.GetProductBySlugAsync(product.Slug, includeInactive: true, ct: ct);
        return detail == null
            ? NotFound(new { message = $"Không tìm thấy sản phẩm #{id}" })
            : Ok(detail);
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

        if (req.Price < 0 || req.OldPrice is < 0)
        {
            return BadRequest(new { message = "Giá bán và giá cũ không được âm." });
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

        if (req.Price > 0 || req.OldPrice.HasValue || !string.IsNullOrEmpty(req.DiscountLabel))
        {
            product.Price = new ProductPrice
            {
                Price = req.Price,
                OldPrice = req.OldPrice,
                DiscountLabel = req.DiscountLabel,
                StockStatus = req.StockStatus,
                Currency = "VND",
                LastCheckedAt = DateTime.UtcNow
            };
        }

        // Thêm cả Product + Price trong MỘT lần SaveChanges (transaction) — tránh ghi dở khi response lỗi.
        await productRepo.AddAsync(product, ct);
        await unitOfWork.SaveChangesAsync(ct);

        await cacheStore.EvictByTagAsync("public-content", ct);

        var username = User.Identity?.Name ?? "Admin";
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        await auditLog.LogAsync(username, "CREATE_PRODUCT", "Product", product.Id.ToString(), $"Thêm sản phẩm mới: {product.Name} (slug: {product.Slug})", ip, ct);

        // Trả DTO thay vì entity EF để tránh vòng lặp Product.Price.Product khi serialize.
        var detail = await catalogService.GetProductBySlugAsync(product.Slug, includeInactive: true, ct: ct);
        return CreatedAtAction(nameof(GetById), new { id = product.Id }, detail);
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

        var name = product.Name;
        var slug = product.Slug;
        if (product.Price != null)
        {
            priceRepo.Remove(product.Price);
        }
        productRepo.Remove(product);
        await unitOfWork.SaveChangesAsync(ct);

        await cacheStore.EvictByTagAsync("public-content", ct);

        var username = User.Identity?.Name ?? "Admin";
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        await auditLog.LogAsync(username, "DELETE_PRODUCT", "Product", id.ToString(), $"Xóa sản phẩm: {name} (slug: {slug})", ip, ct);

        return NoContent();
    }

    /// <summary>Lấy danh sách thông số kỹ thuật chi tiết của sản phẩm.</summary>
    [HttpGet("{id:int}/specs")]
    public async Task<ActionResult<List<ProductSpecItemDto>>> GetSpecs(int id, CancellationToken ct = default)
    {
        var productExists = await productRepo.Query().AnyAsync(p => p.Id == id, ct);
        if (!productExists) return NotFound(new { message = $"Không tìm thấy sản phẩm #{id}" });

        var specs = await specRepo.Query()
            .AsNoTracking()
            .Where(s => s.ProductId == id)
            .OrderBy(s => s.SpecGroup)
            .ThenBy(s => s.OrderIndex)
            .Select(s => new ProductSpecItemDto(s.Id, s.ProductId, s.SpecGroup, s.SpecKey, s.SpecValue, s.OrderIndex))
            .ToListAsync(ct);

        return Ok(specs);
    }

    /// <summary>Thêm thông số kỹ thuật mới cho sản phẩm.</summary>
    [HttpPost("{id:int}/specs")]
    public async Task<ActionResult<ProductSpecItemDto>> AddSpec(int id, [FromBody] SaveProductSpecRequest req, CancellationToken ct = default)
    {
        var productExists = await productRepo.Query().AnyAsync(p => p.Id == id, ct);
        if (!productExists) return NotFound(new { message = $"Không tìm thấy sản phẩm #{id}" });

        var spec = new ProductSpec
        {
            ProductId = id,
            SpecGroup = req.SpecGroup.Trim(),
            SpecKey = req.SpecKey.Trim(),
            SpecValue = req.SpecValue.Trim(),
            OrderIndex = req.OrderIndex
        };

        await specRepo.AddAsync(spec, ct);
        await unitOfWork.SaveChangesAsync(ct);
        await cacheStore.EvictByTagAsync("public-content", ct);

        return Ok(new ProductSpecItemDto(spec.Id, spec.ProductId, spec.SpecGroup, spec.SpecKey, spec.SpecValue, spec.OrderIndex));
    }

    /// <summary>Cập nhật thông số kỹ thuật theo ID của spec.</summary>
    [HttpPut("specs/{specId:int}")]
    public async Task<ActionResult<ProductSpecItemDto>> UpdateSpec(int specId, [FromBody] SaveProductSpecRequest req, CancellationToken ct = default)
    {
        var spec = await specRepo.GetByIdAsync(specId, ct);
        if (spec == null) return NotFound(new { message = $"Không tìm thấy thông số #{specId}" });

        spec.SpecGroup = req.SpecGroup.Trim();
        spec.SpecKey = req.SpecKey.Trim();
        spec.SpecValue = req.SpecValue.Trim();
        spec.OrderIndex = req.OrderIndex;

        specRepo.Update(spec);
        await unitOfWork.SaveChangesAsync(ct);
        await cacheStore.EvictByTagAsync("public-content", ct);

        return Ok(new ProductSpecItemDto(spec.Id, spec.ProductId, spec.SpecGroup, spec.SpecKey, spec.SpecValue, spec.OrderIndex));
    }

    /// <summary>Xóa thông số kỹ thuật theo ID của spec.</summary>
    [HttpDelete("specs/{specId:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteSpec(int specId, CancellationToken ct = default)
    {
        var spec = await specRepo.GetByIdAsync(specId, ct);
        if (spec == null) return NotFound(new { message = $"Không tìm thấy thông số #{specId}" });

        specRepo.Remove(spec);
        await unitOfWork.SaveChangesAsync(ct);
        await cacheStore.EvictByTagAsync("public-content", ct);

        return NoContent();
    }
}
