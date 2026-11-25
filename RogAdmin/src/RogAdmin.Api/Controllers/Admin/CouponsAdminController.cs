using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RogAdmin.Application.Common;
using RogAdmin.Application.Interfaces;
using RogAdmin.Domain.Entities;
using RogAdmin.Domain.Enums;
using RogAdmin.Infrastructure.Persistence;

namespace RogAdmin.Api.Controllers.Admin;

public record CouponItemDto(
    int Id,
    string Code,
    string Title,
    string Description,
    DiscountType DiscountType,
    string DiscountTypeText,
    decimal DiscountValue,
    decimal MinOrderValue,
    decimal? MaxDiscountAmount,
    DateTime? ValidFrom,
    DateTime? ValidTo,
    int UsageLimit,
    int UsedCount,
    bool IsActive,
    DateTime CreatedAt
);

public record SaveCouponRequest(
    string Code,
    string Title,
    string? Description,
    DiscountType DiscountType,
    decimal DiscountValue,
    decimal MinOrderValue = 0,
    decimal? MaxDiscountAmount = null,
    DateTime? ValidFrom = null,
    DateTime? ValidTo = null,
    int UsageLimit = 100,
    bool IsActive = true
);

[ApiController]
[Route("api/admin/coupons")]
[Authorize(Roles = "Admin,Editor")]
public class CouponsAdminController(
    RogAdminDbContext db,
    IAuditLogService auditLog) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PagedResult<CouponItemDto>>> GetPaged(
        [FromQuery] string? search,
        [FromQuery] bool? active,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken ct = default)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = db.Coupons.AsNoTracking();

        if (active.HasValue)
        {
            query = query.Where(c => c.IsActive == active.Value);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim().ToLower();
            query = query.Where(c => c.Code.ToLower().Contains(s) || c.Title.ToLower().Contains(s) || c.Description.ToLower().Contains(s));
        }

        var total = await query.CountAsync(ct);
        var coupons = await query
            .OrderByDescending(c => c.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        var dtos = coupons.Select(c => new CouponItemDto(
            c.Id,
            c.Code,
            c.Title,
            c.Description,
            c.DiscountType,
            c.DiscountType == DiscountType.Percentage ? "Phần trăm (%)" : "Số tiền cố định (VNĐ)",
            c.DiscountValue,
            c.MinOrderValue,
            c.MaxDiscountAmount,
            c.ValidFrom,
            c.ValidTo,
            c.UsageLimit,
            c.UsedCount,
            c.IsActive,
            c.CreatedAt
        )).ToList();

        return Ok(new PagedResult<CouponItemDto>
        {
            Items = dtos,
            Page = page,
            PageSize = pageSize,
            TotalCount = total
        });
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<CouponItemDto>> GetById(int id, CancellationToken ct = default)
    {
        var c = await db.Coupons.AsNoTracking().FirstOrDefaultAsync(c => c.Id == id, ct);
        if (c == null) return NotFound(new { message = $"Không tìm thấy mã giảm giá #{id}" });

        return Ok(new CouponItemDto(
            c.Id,
            c.Code,
            c.Title,
            c.Description,
            c.DiscountType,
            c.DiscountType == DiscountType.Percentage ? "Phần trăm (%)" : "Số tiền cố định (VNĐ)",
            c.DiscountValue,
            c.MinOrderValue,
            c.MaxDiscountAmount,
            c.ValidFrom,
            c.ValidTo,
            c.UsageLimit,
            c.UsedCount,
            c.IsActive,
            c.CreatedAt
        ));
    }

    [HttpPost]
    public async Task<ActionResult<CouponItemDto>> Create([FromBody] SaveCouponRequest req, CancellationToken ct = default)
    {
        var code = req.Code.Trim().ToUpperInvariant();
        if (await db.Coupons.AnyAsync(c => c.Code == code, ct))
        {
            return BadRequest(new { message = $"Mã giảm giá '{code}' đã tồn tại trong hệ thống." });
        }

        var coupon = new Coupon
        {
            Code = code,
            Title = req.Title.Trim(),
            Description = req.Description?.Trim() ?? string.Empty,
            DiscountType = req.DiscountType,
            DiscountValue = req.DiscountValue,
            MinOrderValue = req.MinOrderValue,
            MaxDiscountAmount = req.MaxDiscountAmount,
            ValidFrom = req.ValidFrom,
            ValidTo = req.ValidTo,
            UsageLimit = req.UsageLimit,
            UsedCount = 0,
            IsActive = req.IsActive
        };

        db.Coupons.Add(coupon);
        await db.SaveChangesAsync(ct);

        var username = User.Identity?.Name ?? "Admin";
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        await auditLog.LogAsync(username, "CREATE_COUPON", "Coupon", coupon.Id.ToString(), $"Tạo mã giảm giá mới: {coupon.Code} - {coupon.Title}", ip, ct);

        return CreatedAtAction(nameof(GetById), new { id = coupon.Id }, new CouponItemDto(
            coupon.Id,
            coupon.Code,
            coupon.Title,
            coupon.Description,
            coupon.DiscountType,
            coupon.DiscountType == DiscountType.Percentage ? "Phần trăm (%)" : "Số tiền cố định (VNĐ)",
            coupon.DiscountValue,
            coupon.MinOrderValue,
            coupon.MaxDiscountAmount,
            coupon.ValidFrom,
            coupon.ValidTo,
            coupon.UsageLimit,
            coupon.UsedCount,
            coupon.IsActive,
            coupon.CreatedAt
        ));
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] SaveCouponRequest req, CancellationToken ct = default)
    {
        var coupon = await db.Coupons.FirstOrDefaultAsync(c => c.Id == id, ct);
        if (coupon == null) return NotFound(new { message = $"Không tìm thấy mã giảm giá #{id}" });

        var code = req.Code.Trim().ToUpperInvariant();
        if (code != coupon.Code && await db.Coupons.AnyAsync(c => c.Code == code && c.Id != id, ct))
        {
            return BadRequest(new { message = $"Mã giảm giá '{code}' đã được sử dụng cho mã khác." });
        }

        coupon.Code = code;
        coupon.Title = req.Title.Trim();
        coupon.Description = req.Description?.Trim() ?? string.Empty;
        coupon.DiscountType = req.DiscountType;
        coupon.DiscountValue = req.DiscountValue;
        coupon.MinOrderValue = req.MinOrderValue;
        coupon.MaxDiscountAmount = req.MaxDiscountAmount;
        coupon.ValidFrom = req.ValidFrom;
        coupon.ValidTo = req.ValidTo;
        coupon.UsageLimit = req.UsageLimit;
        coupon.IsActive = req.IsActive;

        await db.SaveChangesAsync(ct);

        var username = User.Identity?.Name ?? "Admin";
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        await auditLog.LogAsync(username, "UPDATE_COUPON", "Coupon", coupon.Id.ToString(), $"Cập nhật mã giảm giá: {coupon.Code}", ip, ct);

        return Ok(new { success = true });
    }

    [HttpPut("{id:int}/toggle-active")]
    public async Task<IActionResult> ToggleActive(int id, CancellationToken ct = default)
    {
        var coupon = await db.Coupons.FirstOrDefaultAsync(c => c.Id == id, ct);
        if (coupon == null) return NotFound(new { message = $"Không tìm thấy mã giảm giá #{id}" });

        coupon.IsActive = !coupon.IsActive;
        await db.SaveChangesAsync(ct);

        var username = User.Identity?.Name ?? "Admin";
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        await auditLog.LogAsync(username, "TOGGLE_COUPON", "Coupon", coupon.Id.ToString(), $"Đổi trạng thái mã {coupon.Code} sang: {(coupon.IsActive ? "Bật" : "Tắt")}", ip, ct);

        return Ok(new { success = true, isActive = coupon.IsActive });
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct = default)
    {
        var coupon = await db.Coupons.FirstOrDefaultAsync(c => c.Id == id, ct);
        if (coupon == null) return NotFound(new { message = $"Không tìm thấy mã giảm giá #{id}" });

        var code = coupon.Code;
        db.Coupons.Remove(coupon);
        await db.SaveChangesAsync(ct);

        var username = User.Identity?.Name ?? "Admin";
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        await auditLog.LogAsync(username, "DELETE_COUPON", "Coupon", id.ToString(), $"Xóa mã giảm giá: {code}", ip, ct);

        return NoContent();
    }
}
