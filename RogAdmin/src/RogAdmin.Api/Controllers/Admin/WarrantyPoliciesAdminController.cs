using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RogAdmin.Application.Interfaces;
using RogAdmin.Domain.Entities;
using RogAdmin.Infrastructure.Persistence;

namespace RogAdmin.Api.Controllers.Admin;

public record WarrantyPolicyDto(
    int Id,
    string Title,
    string Description,
    int SortOrder,
    bool IsActive
);

public record UpsertWarrantyPolicyRequest(
    string Title,
    string Description,
    int SortOrder,
    bool IsActive
);

[ApiController]
[Route("api/admin/warranty-policies")]
[Authorize(Roles = "Admin,Editor")]
public class WarrantyPoliciesAdminController(RogAdminDbContext db, IAuditLogService auditLog) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<WarrantyPolicyDto>>> GetAll(CancellationToken ct = default)
    {
        var items = await db.WarrantyPolicies
            .AsNoTracking()
            .OrderBy(w => w.SortOrder)
            .Select(w => new WarrantyPolicyDto(
                w.Id,
                w.Title,
                w.Description,
                w.SortOrder,
                w.IsActive
            ))
            .ToListAsync(ct);

        return Ok(items);
    }

    [HttpPost]
    public async Task<ActionResult<WarrantyPolicyDto>> Create([FromBody] UpsertWarrantyPolicyRequest req, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(req.Title) || string.IsNullOrWhiteSpace(req.Description))
        {
            return BadRequest(new { message = "Tiêu đề và nội dung chính sách không được để trống." });
        }

        var policy = new WarrantyPolicy
        {
            Title = req.Title.Trim(),
            Description = req.Description.Trim(),
            SortOrder = req.SortOrder,
            IsActive = req.IsActive
        };

        db.WarrantyPolicies.Add(policy);
        await db.SaveChangesAsync(ct);

        var username = User.Identity?.Name ?? "Admin";
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        await auditLog.LogAsync(username, "CREATE_WARRANTY_POLICY", "WarrantyPolicy", policy.Id.ToString(), $"Thêm chính sách bảo hành: {policy.Title}", ip, ct);

        return StatusCode(StatusCodes.Status201Created, new WarrantyPolicyDto(
            policy.Id,
            policy.Title,
            policy.Description,
            policy.SortOrder,
            policy.IsActive
        ));
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpsertWarrantyPolicyRequest req, CancellationToken ct = default)
    {
        var policy = await db.WarrantyPolicies.FirstOrDefaultAsync(w => w.Id == id, ct);
        if (policy is null) return NotFound(new { message = $"Không tìm thấy chính sách #{id}" });

        policy.Title = req.Title.Trim();
        policy.Description = req.Description.Trim();
        policy.SortOrder = req.SortOrder;
        policy.IsActive = req.IsActive;
        policy.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync(ct);

        var username = User.Identity?.Name ?? "Admin";
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        await auditLog.LogAsync(username, "UPDATE_WARRANTY_POLICY", "WarrantyPolicy", policy.Id.ToString(), $"Cập nhật chính sách: {policy.Title}", ip, ct);

        return Ok(new WarrantyPolicyDto(
            policy.Id,
            policy.Title,
            policy.Description,
            policy.SortOrder,
            policy.IsActive
        ));
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct = default)
    {
        var policy = await db.WarrantyPolicies.FirstOrDefaultAsync(w => w.Id == id, ct);
        if (policy is null) return NotFound(new { message = $"Không tìm thấy chính sách #{id}" });

        var title = policy.Title;
        db.WarrantyPolicies.Remove(policy);
        await db.SaveChangesAsync(ct);

        var username = User.Identity?.Name ?? "Admin";
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        await auditLog.LogAsync(username, "DELETE_WARRANTY_POLICY", "WarrantyPolicy", id.ToString(), $"Xóa chính sách bảo hành: {title}", ip, ct);

        return NoContent();
    }
}
