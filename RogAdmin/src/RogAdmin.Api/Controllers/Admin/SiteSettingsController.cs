using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using RogAdmin.Application.Dtos.SiteSettings;
using RogAdmin.Application.Interfaces;

namespace RogAdmin.Api.Controllers.Admin;

[ApiController]
[Route("api/admin/site-settings")]
[Authorize(Roles = "Admin,Editor")]
public class SiteSettingsController(ISiteSettingService service, IOutputCacheStore cacheStore) : ControllerBase
{
    /// <summary>Toàn bộ cấu hình site (PromoBar, JoinRepublic, footer, newsletter, badge...).</summary>
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<SiteSettingDto>>> GetAll(CancellationToken ct)
        => Ok(await service.GetAllAsync(ct));

    [HttpGet("{key}")]
    public async Task<ActionResult<SiteSettingDto>> Get(string key, CancellationToken ct)
        => Ok(await service.GetAsync(key, ct));

    [HttpPut("{key}")]
    public async Task<ActionResult<SiteSettingDto>> Update(string key, [FromBody] UpdateSiteSettingRequest request, CancellationToken ct)
    {
        var updated = await service.UpdateAsync(key, request, ct);
        await cacheStore.EvictByTagAsync("public-content", ct);
        return Ok(updated);
    }

    /// <summary>Cập nhật nhiều cấu hình cùng lúc (dùng cho form lưu nhanh ở admin UI).</summary>
    [HttpPut]
    public async Task<ActionResult<IReadOnlyList<SiteSettingDto>>> UpdateRange([FromBody] UpdateSiteSettingsRequest request, CancellationToken ct)
    {
        var updated = await service.UpdateRangeAsync(request, ct);
        await cacheStore.EvictByTagAsync("public-content", ct);
        return Ok(updated);
    }
}
