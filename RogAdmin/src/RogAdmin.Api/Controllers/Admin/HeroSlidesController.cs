using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using RogAdmin.Application.Dtos.HeroSlides;
using RogAdmin.Application.Interfaces;

namespace RogAdmin.Api.Controllers.Admin;

[ApiController]
[Route("api/admin/hero-slides")]
[Authorize(Roles = "Admin,Editor")]
public class HeroSlidesController(IHeroSlideService service, IOutputCacheStore cacheStore) : ControllerBase
{
    /// <summary>Danh sách slide carousel hero trang chủ.</summary>
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<HeroSlideDto>>> GetAll(
        [FromQuery] bool includeInactive = true, CancellationToken ct = default)
        => Ok(await service.GetAllAsync(includeInactive, ct));

    [HttpGet("{id:int}")]
    public async Task<ActionResult<HeroSlideDto>> GetById(int id, CancellationToken ct)
        => Ok(await service.GetByIdAsync(id, ct));

    [HttpPost]
    public async Task<ActionResult<HeroSlideDto>> Create([FromBody] CreateHeroSlideRequest request, CancellationToken ct)
    {
        var created = await service.CreateAsync(request, ct);
        await cacheStore.EvictByTagAsync("public-content", ct);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<HeroSlideDto>> Update(int id, [FromBody] UpdateHeroSlideRequest request, CancellationToken ct)
    {
        var updated = await service.UpdateAsync(id, request, ct);
        await cacheStore.EvictByTagAsync("public-content", ct);
        return Ok(updated);
    }

    /// <summary>Xóa slide — chỉ Admin (Editor không được xóa).</summary>
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        await service.DeleteAsync(id, ct);
        await cacheStore.EvictByTagAsync("public-content", ct);
        return NoContent();
    }
}
