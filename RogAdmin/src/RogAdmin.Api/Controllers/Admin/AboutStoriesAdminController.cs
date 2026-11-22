using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RogAdmin.Application.Interfaces;
using RogAdmin.Domain.Entities;
using RogAdmin.Infrastructure.Persistence;

namespace RogAdmin.Api.Controllers.Admin;

public record AboutStoryItemDto(
    int Id,
    string YearTag,
    string Heading,
    string Content,
    string? ImageUrl,
    int SortOrder,
    bool IsActive
);

public record UpsertAboutStoryRequest(
    string YearTag,
    string Heading,
    string Content,
    string? ImageUrl,
    int SortOrder,
    bool IsActive
);

[ApiController]
[Route("api/admin/about-stories")]
[Authorize(Roles = "Admin,Editor")]
public class AboutStoriesAdminController(RogAdminDbContext db, IAuditLogService auditLog) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<AboutStoryItemDto>>> GetAll(CancellationToken ct = default)
    {
        var items = await db.AboutStories
            .AsNoTracking()
            .OrderBy(s => s.SortOrder)
            .Select(s => new AboutStoryItemDto(
                s.Id,
                s.YearTag,
                s.Heading,
                s.Content,
                s.ImageUrl,
                s.SortOrder,
                s.IsActive
            ))
            .ToListAsync(ct);

        return Ok(items);
    }

    [HttpPost]
    public async Task<ActionResult<AboutStoryItemDto>> Create([FromBody] UpsertAboutStoryRequest req, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(req.YearTag) || string.IsNullOrWhiteSpace(req.Heading))
        {
            return BadRequest(new { message = "Năm/Thời kỳ và tiêu đề câu chuyện không được để trống." });
        }

        var story = new AboutStory
        {
            YearTag = req.YearTag.Trim(),
            Heading = req.Heading.Trim(),
            Content = req.Content.Trim(),
            ImageUrl = req.ImageUrl?.Trim(),
            SortOrder = req.SortOrder,
            IsActive = req.IsActive
        };

        db.AboutStories.Add(story);
        await db.SaveChangesAsync(ct);

        var username = User.Identity?.Name ?? "Admin";
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        await auditLog.LogAsync(username, "CREATE_ABOUT_STORY", "AboutStory", story.Id.ToString(), $"Thêm cột mốc lịch sử: {story.Heading}", ip, ct);

        return StatusCode(StatusCodes.Status201Created, new AboutStoryItemDto(
            story.Id,
            story.YearTag,
            story.Heading,
            story.Content,
            story.ImageUrl,
            story.SortOrder,
            story.IsActive
        ));
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpsertAboutStoryRequest req, CancellationToken ct = default)
    {
        var story = await db.AboutStories.FirstOrDefaultAsync(s => s.Id == id, ct);
        if (story is null) return NotFound(new { message = $"Không tìm thấy câu chuyện #{id}" });

        story.YearTag = req.YearTag.Trim();
        story.Heading = req.Heading.Trim();
        story.Content = req.Content.Trim();
        story.ImageUrl = req.ImageUrl?.Trim();
        story.SortOrder = req.SortOrder;
        story.IsActive = req.IsActive;
        story.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync(ct);

        var username = User.Identity?.Name ?? "Admin";
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        await auditLog.LogAsync(username, "UPDATE_ABOUT_STORY", "AboutStory", story.Id.ToString(), $"Cập nhật cột mốc: {story.Heading}", ip, ct);

        return Ok(new AboutStoryItemDto(
            story.Id,
            story.YearTag,
            story.Heading,
            story.Content,
            story.ImageUrl,
            story.SortOrder,
            story.IsActive
        ));
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct = default)
    {
        var story = await db.AboutStories.FirstOrDefaultAsync(s => s.Id == id, ct);
        if (story is null) return NotFound(new { message = $"Không tìm thấy câu chuyện #{id}" });

        var heading = story.Heading;
        db.AboutStories.Remove(story);
        await db.SaveChangesAsync(ct);

        var username = User.Identity?.Name ?? "Admin";
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        await auditLog.LogAsync(username, "DELETE_ABOUT_STORY", "AboutStory", id.ToString(), $"Xóa cột mốc: {heading}", ip, ct);

        return NoContent();
    }
}
