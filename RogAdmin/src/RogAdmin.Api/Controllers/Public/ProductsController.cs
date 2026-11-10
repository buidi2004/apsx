using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using RogAdmin.Application.Common;
using RogAdmin.Application.Dtos.Products;
using RogAdmin.Application.Interfaces;

namespace RogAdmin.Api.Controllers.Public;

[ApiController]
[Route("api/public")]
[OutputCache(PolicyName = "PublicCache")]
[ResponseCache(Duration = 60, Location = ResponseCacheLocation.Any)]
public class ProductsController(IProductCatalogService catalogService) : ControllerBase
{
    /// <summary>
    /// Danh sách sản phẩm phân trang, lọc theo danh mục hoặc tìm kiếm
    /// GET /api/public/products?category=laptops&search=scar&page=1&pageSize=20
    /// </summary>
    [HttpGet("products")]
    public async Task<ActionResult<PagedResult<ProductListItemDto>>> GetProducts(
        [FromQuery] string? category,
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken ct = default)
    {
        var result = await catalogService.GetProductsAsync(category, search, page, pageSize, ct);
        return Ok(result);
    }

    /// <summary>
    /// Chi tiết sản phẩm theo slug (hỗ trợ nested slug)
    /// GET /api/public/products/item?slug=...
    /// </summary>
    [HttpGet("products/item")]
    public async Task<ActionResult<ProductDetailDto>> GetProductBySlug(
        [FromQuery] string slug,
        CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(slug))
            return BadRequest(new { message = "Slug không được để trống" });

        var product = await catalogService.GetProductBySlugAsync(slug, ct);
        if (product == null)
            return NotFound(new { message = $"Không tìm thấy sản phẩm với slug: {slug}" });

        return Ok(product);
    }

    /// <summary>
    /// Bảng giá tức thời hàng loạt theo danh sách slug
    /// GET /api/public/pricing/batch?slugs=slug1,slug2,slug3
    /// </summary>
    [HttpGet("pricing/batch")]
    public async Task<ActionResult<List<ProductPriceDto>>> GetBatchPricing(
        [FromQuery] string slugs,
        CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(slugs))
            return Ok(new List<ProductPriceDto>());

        var slugList = slugs.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries).ToList();
        var prices = await catalogService.GetBatchPricingAsync(slugList, ct);
        return Ok(prices);
    }

    /// <summary>
    /// So sánh đối đầu cấu hình giữa các dòng máy
    /// GET /api/public/products/compare?slugs=slug1,slug2
    /// </summary>
    [HttpGet("products/compare")]
    public async Task<ActionResult<CompareMatrixDto>> CompareProducts(
        [FromQuery] string slugs,
        CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(slugs))
            return BadRequest(new { message = "Vui lòng cung cấp ít nhất một sản phẩm để so sánh" });

        var slugList = slugs.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries).ToList();
        var matrix = await catalogService.CompareProductsAsync(slugList, ct);
        return Ok(matrix);
    }

    /// <summary>
    /// Danh sách đại lý ủy quyền và hệ thống cửa hàng trên toàn quốc
    /// GET /api/public/dealers
    /// </summary>
    [HttpGet("dealers")]
    public async Task<ActionResult<List<DealerDto>>> GetDealers(CancellationToken ct = default)
    {
        var dealers = await catalogService.GetDealersAsync(ct);
        return Ok(dealers);
    }

    /// <summary>
    /// Tra cứu thông tin bảo hành chính hãng theo số serial
    /// GET /api/public/warranty/check?serial=R4NRCX0001
    /// </summary>
    [HttpGet("warranty/check")]
    public async Task<ActionResult<WarrantyCheckResultDto>> CheckWarranty(
        [FromQuery] string serial,
        CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(serial))
            return BadRequest(new { message = "Vui lòng nhập số serial hợp lệ" });

        var result = await catalogService.CheckWarrantyAsync(serial, ct);
        if (result == null)
            return NotFound(new { message = $"Không tìm thấy thông tin bảo hành cho số serial: {serial}" });

        return Ok(result);
    }
}
