using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RogAdmin.Application.Interfaces;
using RogAdmin.Domain.Entities;
using RogAdmin.Infrastructure.Persistence;

namespace RogAdmin.Api.Controllers.Admin;

public record ServiceCenterDto(
    int Id,
    string Name,
    string City,
    string Address,
    string Phone,
    string OperatingHours,
    int SortOrder,
    bool IsActive
);

public record UpsertServiceCenterRequest(
    string Name,
    string City,
    string Address,
    string Phone,
    string OperatingHours,
    int SortOrder,
    bool IsActive
);

[ApiController]
[Route("api/admin/service-centers")]
[Authorize(Roles = "Admin,Editor")]
public class ServiceCentersAdminController(RogAdminDbContext db, IAuditLogService auditLog) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ServiceCenterDto>>> GetAll(CancellationToken ct = default)
    {
        var items = await db.ServiceCenters
            .AsNoTracking()
            .OrderBy(s => s.SortOrder)
            .Select(s => new ServiceCenterDto(
                s.Id,
                s.Name,
                s.City,
                s.Address,
                s.Phone,
                s.OperatingHours,
                s.SortOrder,
                s.IsActive
            ))
            .ToListAsync(ct);

        return Ok(items);
    }

    [HttpPost]
    public async Task<ActionResult<ServiceCenterDto>> Create([FromBody] UpsertServiceCenterRequest req, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(req.Name) || string.IsNullOrWhiteSpace(req.Address))
        {
            return BadRequest(new { message = "Tên và địa chỉ trung tâm bảo hành không được để trống." });
        }

        var center = new ServiceCenter
        {
            Name = req.Name.Trim(),
            City = req.City.Trim(),
            Address = req.Address.Trim(),
            Phone = req.Phone.Trim(),
            OperatingHours = req.OperatingHours.Trim(),
            SortOrder = req.SortOrder,
            IsActive = req.IsActive
        };

        db.ServiceCenters.Add(center);
        await db.SaveChangesAsync(ct);

        var username = User.Identity?.Name ?? "Admin";
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        await auditLog.LogAsync(username, "CREATE_SERVICE_CENTER", "ServiceCenter", center.Id.ToString(), $"Thêm trung tâm bảo hành: {center.Name} ({center.City})", ip, ct);

        return StatusCode(StatusCodes.Status201Created, new ServiceCenterDto(
            center.Id,
            center.Name,
            center.City,
            center.Address,
            center.Phone,
            center.OperatingHours,
            center.SortOrder,
            center.IsActive
        ));
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpsertServiceCenterRequest req, CancellationToken ct = default)
    {
        var center = await db.ServiceCenters.FirstOrDefaultAsync(s => s.Id == id, ct);
        if (center is null) return NotFound(new { message = $"Không tìm thấy trung tâm bảo hành #{id}" });

        center.Name = req.Name.Trim();
        center.City = req.City.Trim();
        center.Address = req.Address.Trim();
        center.Phone = req.Phone.Trim();
        center.OperatingHours = req.OperatingHours.Trim();
        center.SortOrder = req.SortOrder;
        center.IsActive = req.IsActive;
        center.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync(ct);

        var username = User.Identity?.Name ?? "Admin";
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        await auditLog.LogAsync(username, "UPDATE_SERVICE_CENTER", "ServiceCenter", center.Id.ToString(), $"Cập nhật trung tâm bảo hành: {center.Name}", ip, ct);

        return Ok(new ServiceCenterDto(
            center.Id,
            center.Name,
            center.City,
            center.Address,
            center.Phone,
            center.OperatingHours,
            center.SortOrder,
            center.IsActive
        ));
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct = default)
    {
        var center = await db.ServiceCenters.FirstOrDefaultAsync(s => s.Id == id, ct);
        if (center is null) return NotFound(new { message = $"Không tìm thấy trung tâm bảo hành #{id}" });

        var name = center.Name;
        db.ServiceCenters.Remove(center);
        await db.SaveChangesAsync(ct);

        var username = User.Identity?.Name ?? "Admin";
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        await auditLog.LogAsync(username, "DELETE_SERVICE_CENTER", "ServiceCenter", id.ToString(), $"Xóa trung tâm bảo hành: {name}", ip, ct);

        return NoContent();
    }
}
