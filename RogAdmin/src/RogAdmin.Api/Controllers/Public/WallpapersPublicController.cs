using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.EntityFrameworkCore;
using RogAdmin.Infrastructure.Persistence;

namespace RogAdmin.Api.Controllers.Public;

public record PublicWallpaperDto(
    string Title,
    string Res,
    string Img,
    string DownloadUrl
);

[ApiController]
[Route("api/public")]
[OutputCache(PolicyName = "PublicCache")]
[ResponseCache(Duration = 60, Location = ResponseCacheLocation.Any)]
public class WallpapersPublicController(RogAdminDbContext db) : ControllerBase
{
    [HttpGet("wallpapers")]
    public async Task<ActionResult<IReadOnlyList<PublicWallpaperDto>>> GetWallpapers(CancellationToken ct = default)
    {
        var items = await db.Wallpapers
            .AsNoTracking()
            .Where(w => w.IsActive)
            .OrderBy(w => w.SortOrder)
            .Select(w => new PublicWallpaperDto(
                w.Title,
                w.Resolution,
                w.ImageUrl,
                w.DownloadUrl
            ))
            .ToListAsync(ct);

        return Ok(items);
    }
}
