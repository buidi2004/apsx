using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RogAdmin.Application.Interfaces;
using RogAdmin.Domain.Entities;
using RogAdmin.Infrastructure.Persistence;

namespace RogAdmin.Api.Controllers.Admin;

public record ProductImageDto(int Id, int ProductId, string ImageUrl, string? Caption, int SortOrder);
public record CreateProductImageRequest(string ImageUrl, string? Caption, int SortOrder);

[ApiController]
[Route("api/admin/products/{productId:int}/images")]
[Authorize(Roles = "Admin,Editor")]
public class ProductImagesAdminController(RogAdminDbContext db, IAuditLogService auditLog) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<ProductImageDto>>> GetImages(int productId, CancellationToken ct = default)
    {
        var product = await db.Products.AsNoTracking().FirstOrDefaultAsync(p => p.Id == productId, ct);
        if (product == null) return NotFound(new { message = $"Không tìm thấy sản phẩm #{productId}" });

        var list = await db.ProductImages.AsNoTracking()
            .Where(i => i.ProductId == productId)
            .OrderBy(i => i.SortOrder)
            .Select(i => new ProductImageDto(i.Id, i.ProductId, i.ImageUrl, i.Caption, i.SortOrder))
            .ToListAsync(ct);

        return Ok(list);
    }

    [HttpPost]
    public async Task<ActionResult<ProductImageDto>> AddImage(int productId, [FromBody] CreateProductImageRequest req, CancellationToken ct = default)
    {
        var product = await db.Products.FirstOrDefaultAsync(p => p.Id == productId, ct);
        if (product == null) return NotFound(new { message = $"Không tìm thấy sản phẩm #{productId}" });

        if (string.IsNullOrWhiteSpace(req.ImageUrl))
        {
            return BadRequest(new { message = "URL hình ảnh không được để trống." });
        }

        var image = new ProductImage
        {
            ProductId = productId,
            ImageUrl = req.ImageUrl.Trim(),
            Caption = req.Caption?.Trim(),
            SortOrder = req.SortOrder
        };

        db.ProductImages.Add(image);
        await db.SaveChangesAsync(ct);

        var username = User.Identity?.Name ?? "Admin";
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        await auditLog.LogAsync(username, "ADD_PRODUCT_IMAGE", "Product", productId.ToString(), $"Thêm ảnh gallery cho {product.Name}: {image.ImageUrl}", ip, ct);

        return CreatedAtAction(nameof(GetImages), new { productId }, new ProductImageDto(image.Id, image.ProductId, image.ImageUrl, image.Caption, image.SortOrder));
    }

    [HttpDelete("{imageId:int}")]
    public async Task<IActionResult> DeleteImage(int productId, int imageId, CancellationToken ct = default)
    {
        var image = await db.ProductImages.FirstOrDefaultAsync(i => i.Id == imageId && i.ProductId == productId, ct);
        if (image == null) return NotFound(new { message = $"Không tìm thấy ảnh #{imageId} của sản phẩm #{productId}" });

        db.ProductImages.Remove(image);
        await db.SaveChangesAsync(ct);

        var username = User.Identity?.Name ?? "Admin";
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        await auditLog.LogAsync(username, "DELETE_PRODUCT_IMAGE", "Product", productId.ToString(), $"Xóa ảnh gallery #{imageId}", ip, ct);

        return NoContent();
    }
}
