using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RogAdmin.Application.Interfaces;
using RogAdmin.Domain.Entities;
using RogAdmin.Infrastructure.Persistence;

namespace RogAdmin.Api.Controllers.Admin;

public record InnovationItemDto(
    int Id,
    string Tag,
    string Title,
    string Description,
    string HighlightsJson,
    string ImageUrl,
    int SortOrder,
    bool IsActive
);

public record UpsertInnovationRequest(
    string Tag,
    string Title,
    string Description,
    string HighlightsJson,
    string ImageUrl,
    int SortOrder,
    bool IsActive
);

[ApiController]
[Route("api/admin/innovations")]
[Authorize(Roles = "Admin,Editor")]
public class InnovationsAdminController(RogAdminDbContext db, IAuditLogService auditLog) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<InnovationItemDto>>> GetAll(CancellationToken ct = default)
    {
        var items = await db.Innovations
            .AsNoTracking()
            .OrderBy(i => i.SortOrder)
            .Select(i => new InnovationItemDto(
                i.Id,
                i.Tag,
                i.Title,
                i.Description,
                i.HighlightsJson,
                i.ImageUrl,
                i.SortOrder,
                i.IsActive
            ))
            .ToListAsync(ct);

        return Ok(items);
    }

    [HttpPost]
    public async Task<ActionResult<InnovationItemDto>> Create([FromBody] UpsertInnovationRequest req, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(req.Title) || string.IsNullOrWhiteSpace(req.Description))
        {
            return BadRequest(new { message = "Tiêu đề và nội dung công nghệ không được để trống." });
        }

        var item = new Innovation
        {
            Tag = req.Tag.Trim(),
            Title = req.Title.Trim(),
            Description = req.Description.Trim(),
            HighlightsJson = string.IsNullOrWhiteSpace(req.HighlightsJson) ? "[]" : req.HighlightsJson.Trim(),
            ImageUrl = req.ImageUrl.Trim(),
            SortOrder = req.SortOrder,
            IsActive = req.IsActive
        };

        db.Innovations.Add(item);
        await db.SaveChangesAsync(ct);

        var username = User.Identity?.Name ?? "Admin";
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        await auditLog.LogAsync(username, "CREATE_INNOVATION", "Innovation", item.Id.ToString(), $"Thêm công nghệ mới: {item.Title}", ip, ct);

        return StatusCode(StatusCodes.Status201Created, new InnovationItemDto(
            item.Id,
            item.Tag,
            item.Title,
            item.Description,
            item.HighlightsJson,
            item.ImageUrl,
            item.SortOrder,
            item.IsActive
        ));
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpsertInnovationRequest req, CancellationToken ct = default)
    {
        var item = await db.Innovations.FirstOrDefaultAsync(i => i.Id == id, ct);
        if (item is null) return NotFound(new { message = $"Không tìm thấy công nghệ #{id}" });

        item.Tag = req.Tag.Trim();
        item.Title = req.Title.Trim();
        item.Description = req.Description.Trim();
        item.HighlightsJson = string.IsNullOrWhiteSpace(req.HighlightsJson) ? "[]" : req.HighlightsJson.Trim();
        item.ImageUrl = req.ImageUrl.Trim();
        item.SortOrder = req.SortOrder;
        item.IsActive = req.IsActive;
        item.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync(ct);

        var username = User.Identity?.Name ?? "Admin";
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        await auditLog.LogAsync(username, "UPDATE_INNOVATION", "Innovation", item.Id.ToString(), $"Cập nhật công nghệ: {item.Title}", ip, ct);

        return Ok(new InnovationItemDto(
            item.Id,
            item.Tag,
            item.Title,
            item.Description,
            item.HighlightsJson,
            item.ImageUrl,
            item.SortOrder,
            item.IsActive
        ));
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct = default)
    {
        var item = await db.Innovations.FirstOrDefaultAsync(i => i.Id == id, ct);
        if (item is null) return NotFound(new { message = $"Không tìm thấy công nghệ #{id}" });

        var title = item.Title;
        db.Innovations.Remove(item);
        await db.SaveChangesAsync(ct);

        var username = User.Identity?.Name ?? "Admin";
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        await auditLog.LogAsync(username, "DELETE_INNOVATION", "Innovation", id.ToString(), $"Xóa công nghệ: {title}", ip, ct);

        return NoContent();
    }
}
