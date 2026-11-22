using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RogAdmin.Application.Interfaces;
using RogAdmin.Domain.Entities;
using RogAdmin.Infrastructure.Persistence;

namespace RogAdmin.Api.Controllers.Admin;

public record VideoItemDto(int Id, string Title, string VideoUrl, string ThumbnailUrl, bool IsBig, int SortOrder, bool IsActive);
public record CreateVideoRequest(string Title, string VideoUrl, string ThumbnailUrl, bool IsBig, int SortOrder, bool IsActive);
public record UpdateVideoRequest(string Title, string VideoUrl, string ThumbnailUrl, bool IsBig, int SortOrder, bool IsActive);

[ApiController]
[Route("api/admin/videos")]
[Authorize(Roles = "Admin,Editor")]
public class VideosAdminController(RogAdminDbContext db, IAuditLogService auditLog) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<VideoItemDto>>> GetAll(CancellationToken ct = default)
    {
        var list = await db.FeaturedVideos.AsNoTracking()
            .OrderBy(v => v.SortOrder)
            .Select(v => new VideoItemDto(v.Id, v.Title, v.VideoUrl, v.ThumbnailUrl, v.IsBig, v.SortOrder, v.IsActive))
            .ToListAsync(ct);
        return Ok(list);
    }

    [HttpPost]
    public async Task<ActionResult<VideoItemDto>> Create([FromBody] CreateVideoRequest req, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(req.Title) || string.IsNullOrWhiteSpace(req.ThumbnailUrl))
        {
            return BadRequest(new { message = "Tiêu đề và Ảnh thumbnail không được để trống." });
        }

        var video = new FeaturedVideo
        {
            Title = req.Title.Trim(),
            VideoUrl = req.VideoUrl?.Trim() ?? string.Empty,
            ThumbnailUrl = req.ThumbnailUrl.Trim(),
            IsBig = req.IsBig,
            SortOrder = req.SortOrder,
            IsActive = req.IsActive
        };

        db.FeaturedVideos.Add(video);
        await db.SaveChangesAsync(ct);

        var username = User.Identity?.Name ?? "Admin";
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        await auditLog.LogAsync(username, "CREATE_FEATURED_VIDEO", "FeaturedVideo", video.Id.ToString(), $"Thêm video review: {video.Title}", ip, ct);

        return CreatedAtAction(nameof(GetAll), new { id = video.Id }, new VideoItemDto(video.Id, video.Title, video.VideoUrl, video.ThumbnailUrl, video.IsBig, video.SortOrder, video.IsActive));
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<VideoItemDto>> Update(int id, [FromBody] UpdateVideoRequest req, CancellationToken ct = default)
    {
        var video = await db.FeaturedVideos.FirstOrDefaultAsync(v => v.Id == id, ct);
        if (video == null) return NotFound(new { message = $"Không tìm thấy video #{id}" });

        video.Title = req.Title.Trim();
        video.VideoUrl = req.VideoUrl?.Trim() ?? string.Empty;
        video.ThumbnailUrl = req.ThumbnailUrl.Trim();
        video.IsBig = req.IsBig;
        video.SortOrder = req.SortOrder;
        video.IsActive = req.IsActive;

        await db.SaveChangesAsync(ct);

        var username = User.Identity?.Name ?? "Admin";
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        await auditLog.LogAsync(username, "UPDATE_FEATURED_VIDEO", "FeaturedVideo", video.Id.ToString(), $"Cập nhật video review: {video.Title}", ip, ct);

        return Ok(new VideoItemDto(video.Id, video.Title, video.VideoUrl, video.ThumbnailUrl, video.IsBig, video.SortOrder, video.IsActive));
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct = default)
    {
        var video = await db.FeaturedVideos.FirstOrDefaultAsync(v => v.Id == id, ct);
        if (video == null) return NotFound(new { message = $"Không tìm thấy video #{id}" });

        db.FeaturedVideos.Remove(video);
        await db.SaveChangesAsync(ct);

        var username = User.Identity?.Name ?? "Admin";
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        await auditLog.LogAsync(username, "DELETE_FEATURED_VIDEO", "FeaturedVideo", id.ToString(), $"Xóa video review: {video.Title}", ip, ct);

        return NoContent();
    }
}
