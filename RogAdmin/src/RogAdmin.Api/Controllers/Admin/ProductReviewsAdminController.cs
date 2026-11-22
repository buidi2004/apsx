using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.EntityFrameworkCore;
using RogAdmin.Application.Common;
using RogAdmin.Application.Dtos.Reviews;
using RogAdmin.Application.Interfaces;
using RogAdmin.Infrastructure.Persistence;

namespace RogAdmin.Api.Controllers.Admin;

[ApiController]
[Route("api/admin/reviews")]
[Authorize(Roles = "Admin,Editor")]
public class ProductReviewsAdminController(
    RogAdminDbContext db,
    IOutputCacheStore cacheStore,
    IAuditLogService auditLog) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PagedResult<ProductReviewDto>>> GetPaged(
        [FromQuery] string? search,
        [FromQuery] bool? approved,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken ct = default)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = db.ProductReviews.AsNoTracking();

        if (approved.HasValue)
        {
            query = query.Where(r => r.IsApproved == approved.Value);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim().ToLower();
            query = query.Where(r => r.ProductSlug.ToLower().Contains(s) || r.AuthorName.ToLower().Contains(s) || r.Content.ToLower().Contains(s));
        }

        var total = await query.CountAsync(ct);
        var items = await query
            .OrderByDescending(r => r.CreatedAtUtc)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(r => new ProductReviewDto(
                r.Id,
                r.ProductSlug,
                r.AuthorName,
                r.Title,
                r.Content,
                r.Rating,
                r.IsApproved,
                r.CreatedAtUtc
            ))
            .ToListAsync(ct);

        return Ok(new PagedResult<ProductReviewDto>
        {
            Items = items,
            Page = page,
            PageSize = pageSize,
            TotalCount = total
        });
    }

    [HttpPut("{id:guid}/approve")]
    public async Task<IActionResult> Approve(Guid id, CancellationToken ct = default)
    {
        var review = await db.ProductReviews.FirstOrDefaultAsync(r => r.Id == id, ct);
        if (review == null) return NotFound(new { message = $"Không tìm thấy đánh giá {id}" });

        review.IsApproved = true;
        await db.SaveChangesAsync(ct);
        await cacheStore.EvictByTagAsync("public-content", ct);

        var username = User.Identity?.Name ?? "Admin";
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        await auditLog.LogAsync(username, "APPROVE_REVIEW", "ProductReview", id.ToString(), $"Duyệt đánh giá của tác giả '{review.AuthorName}' cho sản phẩm '{review.ProductSlug}'", ip, ct);

        return Ok(new { success = true, approved = true });
    }

    [HttpPut("{id:guid}/reject")]
    public async Task<IActionResult> Reject(Guid id, CancellationToken ct = default)
    {
        var review = await db.ProductReviews.FirstOrDefaultAsync(r => r.Id == id, ct);
        if (review == null) return NotFound(new { message = $"Không tìm thấy đánh giá {id}" });

        review.IsApproved = false;
        await db.SaveChangesAsync(ct);
        await cacheStore.EvictByTagAsync("public-content", ct);

        var username = User.Identity?.Name ?? "Admin";
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        await auditLog.LogAsync(username, "REJECT_REVIEW", "ProductReview", id.ToString(), $"Hạ duyệt đánh giá của tác giả '{review.AuthorName}' cho sản phẩm '{review.ProductSlug}'", ip, ct);

        return Ok(new { success = true, approved = false });
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct = default)
    {
        var review = await db.ProductReviews.FirstOrDefaultAsync(r => r.Id == id, ct);
        if (review == null) return NotFound(new { message = $"Không tìm thấy đánh giá {id}" });

        var author = review.AuthorName;
        var slug = review.ProductSlug;
        db.ProductReviews.Remove(review);
        await db.SaveChangesAsync(ct);
        await cacheStore.EvictByTagAsync("public-content", ct);

        var username = User.Identity?.Name ?? "Admin";
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        await auditLog.LogAsync(username, "DELETE_REVIEW", "ProductReview", id.ToString(), $"Xóa đánh giá của tác giả '{author}' cho sản phẩm '{slug}'", ip, ct);

        return NoContent();
    }
}
