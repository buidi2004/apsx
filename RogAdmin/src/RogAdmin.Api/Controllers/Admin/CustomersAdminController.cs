using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RogAdmin.Application.Common;
using RogAdmin.Application.Interfaces;
using RogAdmin.Domain.Entities;
using RogAdmin.Domain.Enums;
using RogAdmin.Infrastructure.Persistence;

namespace RogAdmin.Api.Controllers.Admin;

public record CustomerItemDto(
    int Id,
    string Email,
    string FullName,
    string PhoneNumber,
    CustomerTier Tier,
    string TierName,
    int Points,
    bool IsActive,
    int CartItemCount,
    DateTime CreatedAt
);

public record UpdateCustomerRequest(
    string FullName,
    string PhoneNumber,
    CustomerTier Tier,
    int Points,
    bool IsActive
);

public record ResetCustomerPasswordRequest(string? NewPassword);
public record AdjustPointsRequest(int DeltaPoints, string? Reason);

[ApiController]
[Route("api/admin/customers")]
[Authorize(Roles = "Admin,Editor")]
public class CustomersAdminController(
    RogAdminDbContext db,
    IPasswordHasher passwordHasher,
    IAuditLogService auditLog) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PagedResult<CustomerItemDto>>> GetPaged(
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken ct = default)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = db.Customers.Include(c => c.CartItems).AsNoTracking();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim().ToLower();
            query = query.Where(c => c.Email.ToLower().Contains(s) || c.FullName.ToLower().Contains(s) || c.PhoneNumber.Contains(s));
        }

        var total = await query.CountAsync(ct);
        var customers = await query
            .OrderByDescending(c => c.Points)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        var dtos = customers.Select(c => new CustomerItemDto(
            c.Id,
            c.Email,
            c.FullName,
            c.PhoneNumber,
            c.Tier,
            c.Tier.ToString(),
            c.Points,
            c.IsActive,
            c.CartItems.Count,
            c.CreatedAt
        )).ToList();

        return Ok(new PagedResult<CustomerItemDto>
        {
            Items = dtos,
            Page = page,
            PageSize = pageSize,
            TotalCount = total
        });
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<CustomerItemDto>> GetById(int id, CancellationToken ct = default)
    {
        var c = await db.Customers.Include(c => c.CartItems).AsNoTracking().FirstOrDefaultAsync(c => c.Id == id, ct);
        if (c == null) return NotFound(new { message = $"Không tìm thấy khách hàng #{id}" });

        return Ok(new CustomerItemDto(
            c.Id,
            c.Email,
            c.FullName,
            c.PhoneNumber,
            c.Tier,
            c.Tier.ToString(),
            c.Points,
            c.IsActive,
            c.CartItems.Count,
            c.CreatedAt
        ));
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateCustomerRequest req, CancellationToken ct = default)
    {
        var c = await db.Customers.FirstOrDefaultAsync(c => c.Id == id, ct);
        if (c == null) return NotFound(new { message = $"Không tìm thấy khách hàng #{id}" });

        c.FullName = req.FullName.Trim();
        c.PhoneNumber = req.PhoneNumber.Trim();
        c.Tier = req.Tier;
        c.Points = req.Points;
        c.IsActive = req.IsActive;

        await db.SaveChangesAsync(ct);
        return Ok(new { success = true });
    }

    [HttpPost("{id:int}/reset-password")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ResetPassword(int id, [FromBody] ResetCustomerPasswordRequest req, CancellationToken ct = default)
    {
        var c = await db.Customers.FirstOrDefaultAsync(c => c.Id == id, ct);
        if (c == null) return NotFound(new { message = $"Không tìm thấy khách hàng #{id}" });

        var newPassword = string.IsNullOrWhiteSpace(req.NewPassword)
            ? $"Rog@{Random.Shared.Next(100000, 999999)}"
            : req.NewPassword.Trim();

        var (hash, salt) = passwordHasher.Hash(newPassword);
        c.PasswordHash = hash;
        c.PasswordSalt = salt;

        await db.SaveChangesAsync(ct);

        var username = User.Identity?.Name ?? "Admin";
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        await auditLog.LogAsync(username, "RESET_CUSTOMER_PASSWORD", "Customer", id.ToString(), $"Đặt lại mật khẩu cho khách hàng {c.Email}", ip, ct);

        return Ok(new { success = true, newPassword, message = $"Đặt lại mật khẩu thành công cho {c.Email}" });
    }

    [HttpPost("{id:int}/adjust-points")]
    public async Task<IActionResult> AdjustPoints(int id, [FromBody] AdjustPointsRequest req, CancellationToken ct = default)
    {
        var c = await db.Customers.FirstOrDefaultAsync(c => c.Id == id, ct);
        if (c == null) return NotFound(new { message = $"Không tìm thấy khách hàng #{id}" });

        c.Points = Math.Max(0, c.Points + req.DeltaPoints);
        c.Tier = c.Points switch
        {
            >= 5000 => CustomerTier.Champion,
            >= 2000 => CustomerTier.Master,
            _ => CustomerTier.Elite
        };

        await db.SaveChangesAsync(ct);

        var username = User.Identity?.Name ?? "Admin";
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        await auditLog.LogAsync(username, "ADJUST_CUSTOMER_POINTS", "Customer", id.ToString(), $"Điều chỉnh {req.DeltaPoints:+#;-#;0} điểm cho {c.Email}. Lý do: {req.Reason ?? "Không có"}", ip, ct);

        return Ok(new CustomerItemDto(
            c.Id,
            c.Email,
            c.FullName,
            c.PhoneNumber,
            c.Tier,
            c.Tier.ToString(),
            c.Points,
            c.IsActive,
            0,
            c.CreatedAt
        ));
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct = default)
    {
        var c = await db.Customers.Include(c => c.CartItems).FirstOrDefaultAsync(c => c.Id == id, ct);
        if (c == null) return NotFound(new { message = $"Không tìm thấy khách hàng #{id}" });

        db.Customers.Remove(c);
        await db.SaveChangesAsync(ct);
        return NoContent();
    }
}
