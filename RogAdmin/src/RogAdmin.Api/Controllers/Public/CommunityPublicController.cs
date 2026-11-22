using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.EntityFrameworkCore;
using RogAdmin.Infrastructure.Persistence;

namespace RogAdmin.Api.Controllers.Public;

public record PublicSocialChannelDto(
    string Name,
    string Members,
    string Desc,
    string Link,
    string Btn
);

public record PublicEliteTierDto(
    string Tier,
    string Points,
    string Perk
);

public record PublicCommunityInfoDto(
    IReadOnlyList<PublicSocialChannelDto> Channels,
    IReadOnlyList<PublicEliteTierDto> Tiers
);

[ApiController]
[Route("api/public")]
[OutputCache(PolicyName = "PublicCache")]
[ResponseCache(Duration = 60, Location = ResponseCacheLocation.Any)]
public class CommunityPublicController(RogAdminDbContext db) : ControllerBase
{
    [HttpGet("community-info")]
    public async Task<ActionResult<PublicCommunityInfoDto>> GetCommunityInfo(CancellationToken ct = default)
    {
        var channels = await db.SocialChannels
            .AsNoTracking()
            .Where(c => c.IsActive)
            .OrderBy(c => c.SortOrder)
            .Select(c => new PublicSocialChannelDto(
                c.Name,
                c.MembersCount,
                c.Description,
                c.Link,
                c.ButtonText
            ))
            .ToListAsync(ct);

        var tiers = await db.EliteTierPerks
            .AsNoTracking()
            .Where(t => t.IsActive)
            .OrderBy(t => t.SortOrder)
            .Select(t => new PublicEliteTierDto(
                t.Tier,
                t.PointsRange,
                t.Perk
            ))
            .ToListAsync(ct);

        return Ok(new PublicCommunityInfoDto(channels, tiers));
    }
}
