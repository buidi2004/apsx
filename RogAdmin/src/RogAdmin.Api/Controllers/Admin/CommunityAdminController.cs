using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RogAdmin.Application.Interfaces;
using RogAdmin.Domain.Entities;
using RogAdmin.Infrastructure.Persistence;

namespace RogAdmin.Api.Controllers.Admin;

public record SocialChannelItemDto(
    int Id,
    string Name,
    string MembersCount,
    string Description,
    string Link,
    string ButtonText,
    int SortOrder,
    bool IsActive
);

public record UpsertSocialChannelRequest(
    string Name,
    string MembersCount,
    string Description,
    string Link,
    string ButtonText,
    int SortOrder,
    bool IsActive
);

public record EliteTierItemDto(
    int Id,
    string Tier,
    string PointsRange,
    string Perk,
    int SortOrder,
    bool IsActive
);

public record UpsertEliteTierRequest(
    string Tier,
    string PointsRange,
    string Perk,
    int SortOrder,
    bool IsActive
);

[ApiController]
[Route("api/admin/community")]
[Authorize(Roles = "Admin,Editor")]
public class CommunityAdminController(RogAdminDbContext db, IAuditLogService auditLog) : ControllerBase
{
    // ---------- Social Channels ----------
    [HttpGet("channels")]
    public async Task<ActionResult<IReadOnlyList<SocialChannelItemDto>>> GetChannels(CancellationToken ct = default)
    {
        var items = await db.SocialChannels
            .AsNoTracking()
            .OrderBy(c => c.SortOrder)
            .Select(c => new SocialChannelItemDto(
                c.Id,
                c.Name,
                c.MembersCount,
                c.Description,
                c.Link,
                c.ButtonText,
                c.SortOrder,
                c.IsActive
            ))
            .ToListAsync(ct);

        return Ok(items);
    }

    [HttpPost("channels")]
    public async Task<ActionResult<SocialChannelItemDto>> CreateChannel([FromBody] UpsertSocialChannelRequest req, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(req.Name) || string.IsNullOrWhiteSpace(req.Link))
        {
            return BadRequest(new { message = "Tên kênh và liên kết không được để trống." });
        }

        var channel = new SocialChannel
        {
            Name = req.Name.Trim(),
            MembersCount = req.MembersCount.Trim(),
            Description = req.Description.Trim(),
            Link = req.Link.Trim(),
            ButtonText = req.ButtonText.Trim(),
            SortOrder = req.SortOrder,
            IsActive = req.IsActive
        };

        db.SocialChannels.Add(channel);
        await db.SaveChangesAsync(ct);

        var username = User.Identity?.Name ?? "Admin";
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        await auditLog.LogAsync(username, "CREATE_SOCIAL_CHANNEL", "SocialChannel", channel.Id.ToString(), $"Thêm kênh mạng xã hội: {channel.Name}", ip, ct);

        return StatusCode(StatusCodes.Status201Created, new SocialChannelItemDto(
            channel.Id,
            channel.Name,
            channel.MembersCount,
            channel.Description,
            channel.Link,
            channel.ButtonText,
            channel.SortOrder,
            channel.IsActive
        ));
    }

    [HttpPut("channels/{id:int}")]
    public async Task<IActionResult> UpdateChannel(int id, [FromBody] UpsertSocialChannelRequest req, CancellationToken ct = default)
    {
        var channel = await db.SocialChannels.FirstOrDefaultAsync(c => c.Id == id, ct);
        if (channel is null) return NotFound(new { message = $"Không tìm thấy kênh #{id}" });

        channel.Name = req.Name.Trim();
        channel.MembersCount = req.MembersCount.Trim();
        channel.Description = req.Description.Trim();
        channel.Link = req.Link.Trim();
        channel.ButtonText = req.ButtonText.Trim();
        channel.SortOrder = req.SortOrder;
        channel.IsActive = req.IsActive;
        channel.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync(ct);

        var username = User.Identity?.Name ?? "Admin";
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        await auditLog.LogAsync(username, "UPDATE_SOCIAL_CHANNEL", "SocialChannel", channel.Id.ToString(), $"Cập nhật kênh MXH: {channel.Name}", ip, ct);

        return Ok(new SocialChannelItemDto(
            channel.Id,
            channel.Name,
            channel.MembersCount,
            channel.Description,
            channel.Link,
            channel.ButtonText,
            channel.SortOrder,
            channel.IsActive
        ));
    }

    [HttpDelete("channels/{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteChannel(int id, CancellationToken ct = default)
    {
        var channel = await db.SocialChannels.FirstOrDefaultAsync(c => c.Id == id, ct);
        if (channel is null) return NotFound(new { message = $"Không tìm thấy kênh #{id}" });

        var name = channel.Name;
        db.SocialChannels.Remove(channel);
        await db.SaveChangesAsync(ct);

        var username = User.Identity?.Name ?? "Admin";
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        await auditLog.LogAsync(username, "DELETE_SOCIAL_CHANNEL", "SocialChannel", id.ToString(), $"Xóa kênh MXH: {name}", ip, ct);

        return NoContent();
    }

    // ---------- Elite Tiers ----------
    [HttpGet("tiers")]
    public async Task<ActionResult<IReadOnlyList<EliteTierItemDto>>> GetTiers(CancellationToken ct = default)
    {
        var items = await db.EliteTierPerks
            .AsNoTracking()
            .OrderBy(t => t.SortOrder)
            .Select(t => new EliteTierItemDto(
                t.Id,
                t.Tier,
                t.PointsRange,
                t.Perk,
                t.SortOrder,
                t.IsActive
            ))
            .ToListAsync(ct);

        return Ok(items);
    }

    [HttpPost("tiers")]
    public async Task<ActionResult<EliteTierItemDto>> CreateTier([FromBody] UpsertEliteTierRequest req, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(req.Tier) || string.IsNullOrWhiteSpace(req.Perk))
        {
            return BadRequest(new { message = "Tên hạng và đặc quyền không được để trống." });
        }

        var tier = new EliteTierPerk
        {
            Tier = req.Tier.Trim().ToUpperInvariant(),
            PointsRange = req.PointsRange.Trim(),
            Perk = req.Perk.Trim(),
            SortOrder = req.SortOrder,
            IsActive = req.IsActive
        };

        db.EliteTierPerks.Add(tier);
        await db.SaveChangesAsync(ct);

        var username = User.Identity?.Name ?? "Admin";
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        await auditLog.LogAsync(username, "CREATE_ELITE_TIER", "EliteTierPerk", tier.Id.ToString(), $"Thêm hạng ROG Elite: {tier.Tier}", ip, ct);

        return StatusCode(StatusCodes.Status201Created, new EliteTierItemDto(
            tier.Id,
            tier.Tier,
            tier.PointsRange,
            tier.Perk,
            tier.SortOrder,
            tier.IsActive
        ));
    }

    [HttpPut("tiers/{id:int}")]
    public async Task<IActionResult> UpdateTier(int id, [FromBody] UpsertEliteTierRequest req, CancellationToken ct = default)
    {
        var tier = await db.EliteTierPerks.FirstOrDefaultAsync(t => t.Id == id, ct);
        if (tier is null) return NotFound(new { message = $"Không tìm thấy hạng #{id}" });

        tier.Tier = req.Tier.Trim().ToUpperInvariant();
        tier.PointsRange = req.PointsRange.Trim();
        tier.Perk = req.Perk.Trim();
        tier.SortOrder = req.SortOrder;
        tier.IsActive = req.IsActive;
        tier.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync(ct);

        var username = User.Identity?.Name ?? "Admin";
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        await auditLog.LogAsync(username, "UPDATE_ELITE_TIER", "EliteTierPerk", tier.Id.ToString(), $"Cập nhật hạng ROG Elite: {tier.Tier}", ip, ct);

        return Ok(new EliteTierItemDto(
            tier.Id,
            tier.Tier,
            tier.PointsRange,
            tier.Perk,
            tier.SortOrder,
            tier.IsActive
        ));
    }

    [HttpDelete("tiers/{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteTier(int id, CancellationToken ct = default)
    {
        var tier = await db.EliteTierPerks.FirstOrDefaultAsync(t => t.Id == id, ct);
        if (tier is null) return NotFound(new { message = $"Không tìm thấy hạng #{id}" });

        var name = tier.Tier;
        db.EliteTierPerks.Remove(tier);
        await db.SaveChangesAsync(ct);

        var username = User.Identity?.Name ?? "Admin";
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        await auditLog.LogAsync(username, "DELETE_ELITE_TIER", "EliteTierPerk", id.ToString(), $"Xóa hạng ROG Elite: {name}", ip, ct);

        return NoContent();
    }
}
