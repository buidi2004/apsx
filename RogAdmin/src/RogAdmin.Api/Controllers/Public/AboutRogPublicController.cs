using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.EntityFrameworkCore;
using RogAdmin.Infrastructure.Persistence;

namespace RogAdmin.Api.Controllers.Public;

public record PublicAboutStoryDto(
    string YearTag,
    string Heading,
    string Content,
    string? ImageUrl
);

public record PublicAboutRogDto(
    string HeroTitle,
    string HeroSubtitle,
    string ManifestoTitle,
    string ManifestoText,
    IReadOnlyList<PublicAboutStoryDto> Stories
);

[ApiController]
[Route("api/public")]
[OutputCache(PolicyName = "PublicCache")]
[ResponseCache(Duration = 60, Location = ResponseCacheLocation.Any)]
public class AboutRogPublicController(RogAdminDbContext db) : ControllerBase
{
    [HttpGet("about-rog")]
    public async Task<ActionResult<PublicAboutRogDto>> GetAboutRog(CancellationToken ct = default)
    {
        var stories = await db.AboutStories
            .AsNoTracking()
            .Where(s => s.IsActive)
            .OrderBy(s => s.SortOrder)
            .Select(s => new PublicAboutStoryDto(
                s.YearTag,
                s.Heading,
                s.Content,
                s.ImageUrl
            ))
            .ToListAsync(ct);

        return Ok(new PublicAboutRogDto(
            "FOR THOSE WHO DARE",
            "Republic of Gamers được sáng lập để theo đuổi sự hoàn hảo, không ngừng vượt qua mọi giới hạn kỹ thuật để mang đến những cỗ máy tối thượng cho game thủ.",
            "DÀNH CHO NHỮNG NGƯỜI TÁO BẠO",
            "Republic of Gamers là nền tảng uy tín cho phép theo đuổi sự hoàn hảo và không ngừng thúc đẩy giới hạn. Mỗi vết sẹo chiến tích là một huy chương danh dự—cái giá của chiến thắng.",
            stories
        ));
    }
}
