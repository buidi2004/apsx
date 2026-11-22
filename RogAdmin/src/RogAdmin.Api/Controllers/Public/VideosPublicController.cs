using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RogAdmin.Infrastructure.Persistence;

namespace RogAdmin.Api.Controllers.Public;

[ApiController]
[Route("api/public/videos")]
public class VideosPublicController(RogAdminDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetVideos(CancellationToken ct = default)
    {
        var videos = await db.FeaturedVideos.AsNoTracking()
            .Where(v => v.IsActive)
            .OrderBy(v => v.SortOrder)
            .Select(v => new
            {
                img = v.ThumbnailUrl,
                title = v.Title,
                videoUrl = v.VideoUrl,
                big = v.IsBig
            })
            .ToListAsync(ct);

        return Ok(videos);
    }
}
