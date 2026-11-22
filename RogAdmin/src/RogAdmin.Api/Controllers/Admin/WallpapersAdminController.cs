using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RogAdmin.Application.Interfaces;
using RogAdmin.Domain.Entities;
using RogAdmin.Infrastructure.Persistence;

namespace RogAdmin.Api.Controllers.Admin;

public record WallpaperItemDto(
    int Id,
    string Title,
    string Resolution,
    string ImageUrl,
    string DownloadUrl,
    int SortOrder,
    bool IsActive
);

public record UpsertWallpaperRequest(
    string Title,
    string Resolution,
    string ImageUrl,
    string DownloadUrl,
    int SortOrder,
    bool IsActive
);

[ApiController]
[Route("api/admin/wallpapers")]
[Authorize(Roles = "Admin,Editor")]
public class WallpapersAdminController(RogAdminDbContext db, IAuditLogService auditLog) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<WallpaperItemDto>>> GetAll(CancellationToken ct = default)
    {
        var items = await db.Wallpapers
            .AsNoTracking()
            .OrderBy(w => w.SortOrder)
            .Select(w => new WallpaperItemDto(
                w.Id,
                w.Title,
                w.Resolution,
                w.ImageUrl,
                w.DownloadUrl,
                w.SortOrder,
                w.IsActive
            ))
            .ToListAsync(ct);

        return Ok(items);
    }

    [HttpPost]
    public async Task<ActionResult<WallpaperItemDto>> Create([FromBody] UpsertWallpaperRequest req, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(req.Title) || string.IsNullOrWhiteSpace(req.ImageUrl))
        {
            return BadRequest(new { message = "Tiêu đề và đường dẫn ảnh không được để trống." });
        }

        var wp = new Wallpaper
        {
            Title = req.Title.Trim(),
            Resolution = string.IsNullOrWhiteSpace(req.Resolution) ? "3840 x 2160 (4K)" : req.Resolution.Trim(),
            ImageUrl = req.ImageUrl.Trim(),
            DownloadUrl = string.IsNullOrWhiteSpace(req.DownloadUrl) ? req.ImageUrl.Trim() : req.DownloadUrl.Trim(),
            SortOrder = req.SortOrder,
            IsActive = req.IsActive
        };

        db.Wallpapers.Add(wp);
        await db.SaveChangesAsync(ct);

        var username = User.Identity?.Name ?? "Admin";
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        await auditLog.LogAsync(username, "CREATE_WALLPAPER", "Wallpaper", wp.Id.ToString(), $"Thêm wallpaper mới: {wp.Title}", ip, ct);

        return StatusCode(StatusCodes.Status201Created, new WallpaperItemDto(
            wp.Id,
            wp.Title,
            wp.Resolution,
            wp.ImageUrl,
            wp.DownloadUrl,
            wp.SortOrder,
            wp.IsActive
        ));
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpsertWallpaperRequest req, CancellationToken ct = default)
    {
        var wp = await db.Wallpapers.FirstOrDefaultAsync(w => w.Id == id, ct);
        if (wp is null) return NotFound(new { message = $"Không tìm thấy hình nền #{id}" });

        wp.Title = req.Title.Trim();
        wp.Resolution = req.Resolution.Trim();
        wp.ImageUrl = req.ImageUrl.Trim();
        wp.DownloadUrl = string.IsNullOrWhiteSpace(req.DownloadUrl) ? req.ImageUrl.Trim() : req.DownloadUrl.Trim();
        wp.SortOrder = req.SortOrder;
        wp.IsActive = req.IsActive;
        wp.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync(ct);

        var username = User.Identity?.Name ?? "Admin";
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        await auditLog.LogAsync(username, "UPDATE_WALLPAPER", "Wallpaper", wp.Id.ToString(), $"Cập nhật wallpaper: {wp.Title}", ip, ct);

        return Ok(new WallpaperItemDto(
            wp.Id,
            wp.Title,
            wp.Resolution,
            wp.ImageUrl,
            wp.DownloadUrl,
            wp.SortOrder,
            wp.IsActive
        ));
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct = default)
    {
        var wp = await db.Wallpapers.FirstOrDefaultAsync(w => w.Id == id, ct);
        if (wp is null) return NotFound(new { message = $"Không tìm thấy hình nền #{id}" });

        var title = wp.Title;
        db.Wallpapers.Remove(wp);
        await db.SaveChangesAsync(ct);

        var username = User.Identity?.Name ?? "Admin";
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        await auditLog.LogAsync(username, "DELETE_WALLPAPER", "Wallpaper", id.ToString(), $"Xóa wallpaper: {title}", ip, ct);

        return NoContent();
    }
}
