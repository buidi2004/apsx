using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using RogAdmin.Application.Dtos.ProductCategories;
using RogAdmin.Application.Interfaces;

namespace RogAdmin.Api.Controllers.Admin;

[ApiController]
[Route("api/admin/product-categories")]
[Authorize(Roles = "Admin,Editor")]
public class ProductCategoriesController(IProductCategoryService service, IOutputCacheStore cacheStore) : ControllerBase
{
    /// <summary>Danh sách danh mục sản phẩm carousel "KHÁM PHÁ SẢN PHẨM".</summary>
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ProductCategoryDto>>> GetAll(
        [FromQuery] bool includeInactive = true, CancellationToken ct = default)
        => Ok(await service.GetAllAsync(includeInactive, ct));

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ProductCategoryDto>> GetById(int id, CancellationToken ct)
        => Ok(await service.GetByIdAsync(id, ct));

    [HttpPost]
    public async Task<ActionResult<ProductCategoryDto>> Create([FromBody] CreateProductCategoryRequest request, CancellationToken ct)
    {
        var created = await service.CreateAsync(request, ct);
        await cacheStore.EvictByTagAsync("public-content", ct);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<ProductCategoryDto>> Update(int id, [FromBody] UpdateProductCategoryRequest request, CancellationToken ct)
    {
        var updated = await service.UpdateAsync(id, request, ct);
        await cacheStore.EvictByTagAsync("public-content", ct);
        return Ok(updated);
    }

    /// <summary>Xóa danh mục — chỉ Admin (Editor không được xóa).</summary>
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        await service.DeleteAsync(id, ct);
        await cacheStore.EvictByTagAsync("public-content", ct);
        return NoContent();
    }
}
