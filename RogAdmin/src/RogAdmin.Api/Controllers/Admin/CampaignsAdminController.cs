using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.EntityFrameworkCore;
using RogAdmin.Domain.Entities;
using RogAdmin.Infrastructure.Persistence;

namespace RogAdmin.Api.Controllers.Admin;

public record CampaignDto(
    int Id,
    string Badge,
    string Title,
    string Period,
    string Desc,
    string Img,
    string CtaText,
    string CtaLink,
    bool IsActive,
    int SortOrder
);

public record SaveCampaignRequest(
    string Badge,
    string Title,
    string Period,
    string Desc,
    string Img,
    string CtaText = "XEM CHI TIẾT",
    string CtaLink = "/vn/laptops-group",
    bool IsActive = true,
    int SortOrder = 0
);

[ApiController]
[Route("api/admin/campaigns")]
[Authorize(Roles = "Admin,Editor")]
public class CampaignsAdminController(
    RogAdminDbContext db,
    IOutputCacheStore cacheStore) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<CampaignDto>>> GetAll(CancellationToken ct = default)
    {
        var list = await db.Campaigns
            .AsNoTracking()
            .OrderBy(c => c.SortOrder)
            .Select(c => new CampaignDto(
                c.Id, c.Badge, c.Title, c.Period, c.Desc, c.Img, c.CtaText, c.CtaLink, c.IsActive, c.SortOrder
            ))
            .ToListAsync(ct);

        return Ok(list);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<CampaignDto>> GetById(int id, CancellationToken ct = default)
    {
        var c = await db.Campaigns.AsNoTracking().FirstOrDefaultAsync(c => c.Id == id, ct);
        if (c == null) return NotFound(new { message = $"Không tìm thấy chiến dịch #{id}" });

        return Ok(new CampaignDto(
            c.Id, c.Badge, c.Title, c.Period, c.Desc, c.Img, c.CtaText, c.CtaLink, c.IsActive, c.SortOrder
        ));
    }

    [HttpPost]
    public async Task<ActionResult<CampaignDto>> Create([FromBody] SaveCampaignRequest req, CancellationToken ct = default)
    {
        var c = new EventCampaign
        {
            Badge = req.Badge.Trim(),
            Title = req.Title.Trim(),
            Period = req.Period.Trim(),
            Desc = req.Desc.Trim(),
            Img = req.Img.Trim(),
            CtaText = req.CtaText.Trim(),
            CtaLink = req.CtaLink.Trim(),
            IsActive = req.IsActive,
            SortOrder = req.SortOrder
        };

        db.Campaigns.Add(c);
        await db.SaveChangesAsync(ct);
        await cacheStore.EvictByTagAsync("public-content", ct);

        return CreatedAtAction(nameof(GetById), new { id = c.Id }, new CampaignDto(
            c.Id, c.Badge, c.Title, c.Period, c.Desc, c.Img, c.CtaText, c.CtaLink, c.IsActive, c.SortOrder
        ));
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<CampaignDto>> Update(int id, [FromBody] SaveCampaignRequest req, CancellationToken ct = default)
    {
        var c = await db.Campaigns.FirstOrDefaultAsync(c => c.Id == id, ct);
        if (c == null) return NotFound(new { message = $"Không tìm thấy chiến dịch #{id}" });

        c.Badge = req.Badge.Trim();
        c.Title = req.Title.Trim();
        c.Period = req.Period.Trim();
        c.Desc = req.Desc.Trim();
        c.Img = req.Img.Trim();
        c.CtaText = req.CtaText.Trim();
        c.CtaLink = req.CtaLink.Trim();
        c.IsActive = req.IsActive;
        c.SortOrder = req.SortOrder;

        await db.SaveChangesAsync(ct);
        await cacheStore.EvictByTagAsync("public-content", ct);

        return Ok(new CampaignDto(
            c.Id, c.Badge, c.Title, c.Period, c.Desc, c.Img, c.CtaText, c.CtaLink, c.IsActive, c.SortOrder
        ));
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct = default)
    {
        var c = await db.Campaigns.FirstOrDefaultAsync(c => c.Id == id, ct);
        if (c == null) return NotFound(new { message = $"Không tìm thấy chiến dịch #{id}" });

        db.Campaigns.Remove(c);
        await db.SaveChangesAsync(ct);
        await cacheStore.EvictByTagAsync("public-content", ct);

        return NoContent();
    }
}
