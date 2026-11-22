using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.EntityFrameworkCore;
using RogAdmin.Infrastructure.Persistence;

namespace RogAdmin.Api.Controllers.Public;

public record PublicInnovationDto(
    string Tag,
    string Title,
    string Desc,
    string HighlightsJson,
    string Img
);

[ApiController]
[Route("api/public")]
[OutputCache(PolicyName = "PublicCache")]
[ResponseCache(Duration = 60, Location = ResponseCacheLocation.Any)]
public class InnovationsPublicController(RogAdminDbContext db) : ControllerBase
{
    [HttpGet("innovations")]
    public async Task<ActionResult<IReadOnlyList<PublicInnovationDto>>> GetInnovations(CancellationToken ct = default)
    {
        var items = await db.Innovations
            .AsNoTracking()
            .Where(i => i.IsActive)
            .OrderBy(i => i.SortOrder)
            .Select(i => new PublicInnovationDto(
                i.Tag,
                i.Title,
                i.Description,
                i.HighlightsJson,
                i.ImageUrl
            ))
            .ToListAsync(ct);

        return Ok(items);
    }
}
