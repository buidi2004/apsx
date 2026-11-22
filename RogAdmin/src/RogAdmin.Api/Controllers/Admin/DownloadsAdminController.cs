using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.EntityFrameworkCore;
using RogAdmin.Domain.Entities;
using RogAdmin.Infrastructure.Persistence;

namespace RogAdmin.Api.Controllers.Admin;

public record SoftwareDownloadDto(
    int Id,
    string Name,
    string Version,
    string Size,
    string Desc,
    string FeaturesJson,
    string Os,
    string Badge,
    string DownloadUrl,
    bool IsActive,
    int SortOrder
);

public record SaveSoftwareDownloadRequest(
    string Name,
    string Version,
    string Size,
    string Desc,
    string FeaturesJson = "[]",
    string Os = "Windows 11 / 10 64-bit",
    string Badge = "",
    string DownloadUrl = "",
    bool IsActive = true,
    int SortOrder = 0
);

[ApiController]
[Route("api/admin/downloads")]
[Authorize(Roles = "Admin,Editor")]
public class DownloadsAdminController(
    RogAdminDbContext db,
    IOutputCacheStore cacheStore) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<SoftwareDownloadDto>>> GetAll(CancellationToken ct = default)
    {
        var list = await db.SoftwareDownloads
            .AsNoTracking()
            .OrderBy(d => d.SortOrder)
            .Select(d => new SoftwareDownloadDto(
                d.Id, d.Name, d.Version, d.Size, d.Desc, d.FeaturesJson, d.Os, d.Badge, d.DownloadUrl, d.IsActive, d.SortOrder
            ))
            .ToListAsync(ct);

        return Ok(list);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<SoftwareDownloadDto>> GetById(int id, CancellationToken ct = default)
    {
        var d = await db.SoftwareDownloads.AsNoTracking().FirstOrDefaultAsync(d => d.Id == id, ct);
        if (d == null) return NotFound(new { message = $"Không tìm thấy phần mềm #{id}" });

        return Ok(new SoftwareDownloadDto(
            d.Id, d.Name, d.Version, d.Size, d.Desc, d.FeaturesJson, d.Os, d.Badge, d.DownloadUrl, d.IsActive, d.SortOrder
        ));
    }

    [HttpPost]
    public async Task<ActionResult<SoftwareDownloadDto>> Create([FromBody] SaveSoftwareDownloadRequest req, CancellationToken ct = default)
    {
        var d = new SoftwareDownload
        {
            Name = req.Name.Trim(),
            Version = req.Version.Trim(),
            Size = req.Size.Trim(),
            Desc = req.Desc.Trim(),
            FeaturesJson = req.FeaturesJson.Trim(),
            Os = req.Os.Trim(),
            Badge = req.Badge.Trim(),
            DownloadUrl = req.DownloadUrl.Trim(),
            IsActive = req.IsActive,
            SortOrder = req.SortOrder
        };

        db.SoftwareDownloads.Add(d);
        await db.SaveChangesAsync(ct);
        await cacheStore.EvictByTagAsync("public-content", ct);

        return CreatedAtAction(nameof(GetById), new { id = d.Id }, new SoftwareDownloadDto(
            d.Id, d.Name, d.Version, d.Size, d.Desc, d.FeaturesJson, d.Os, d.Badge, d.DownloadUrl, d.IsActive, d.SortOrder
        ));
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<SoftwareDownloadDto>> Update(int id, [FromBody] SaveSoftwareDownloadRequest req, CancellationToken ct = default)
    {
        var d = await db.SoftwareDownloads.FirstOrDefaultAsync(d => d.Id == id, ct);
        if (d == null) return NotFound(new { message = $"Không tìm thấy phần mềm #{id}" });

        d.Name = req.Name.Trim();
        d.Version = req.Version.Trim();
        d.Size = req.Size.Trim();
        d.Desc = req.Desc.Trim();
        d.FeaturesJson = req.FeaturesJson.Trim();
        d.Os = req.Os.Trim();
        d.Badge = req.Badge.Trim();
        d.DownloadUrl = req.DownloadUrl.Trim();
        d.IsActive = req.IsActive;
        d.SortOrder = req.SortOrder;

        await db.SaveChangesAsync(ct);
        await cacheStore.EvictByTagAsync("public-content", ct);

        return Ok(new SoftwareDownloadDto(
            d.Id, d.Name, d.Version, d.Size, d.Desc, d.FeaturesJson, d.Os, d.Badge, d.DownloadUrl, d.IsActive, d.SortOrder
        ));
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct = default)
    {
        var d = await db.SoftwareDownloads.FirstOrDefaultAsync(d => d.Id == id, ct);
        if (d == null) return NotFound(new { message = $"Không tìm thấy phần mềm #{id}" });

        db.SoftwareDownloads.Remove(d);
        await db.SaveChangesAsync(ct);
        await cacheStore.EvictByTagAsync("public-content", ct);

        return NoContent();
    }
}
