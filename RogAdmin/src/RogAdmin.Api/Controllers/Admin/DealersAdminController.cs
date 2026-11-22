using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using RogAdmin.Application.Common;
using RogAdmin.Application.Dtos.Dealers;
using RogAdmin.Application.Interfaces;

namespace RogAdmin.Api.Controllers.Admin;

[ApiController]
[Route("api/admin/dealers")]
[Authorize(Roles = "Admin,Editor")]
public class DealersAdminController(
    IDealerAdminService dealerService,
    IOutputCacheStore cacheStore) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PagedResult<DealerDto>>> GetPaged(
        [FromQuery] string? search,
        [FromQuery] string? city,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken ct = default)
    {
        return Ok(await dealerService.GetPagedAsync(search, city, page, pageSize, ct));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<DealerDto>> GetById(int id, CancellationToken ct = default)
    {
        var dealer = await dealerService.GetByIdAsync(id, ct);
        if (dealer == null) return NotFound(new { message = $"Không tìm thấy đại lý #{id}" });
        return Ok(dealer);
    }

    [HttpPost]
    public async Task<ActionResult<DealerDto>> Create([FromBody] CreateDealerRequest request, CancellationToken ct = default)
    {
        var created = await dealerService.CreateAsync(request, ct);
        await cacheStore.EvictByTagAsync("public-content", ct);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<DealerDto>> Update(int id, [FromBody] UpdateDealerRequest request, CancellationToken ct = default)
    {
        var updated = await dealerService.UpdateAsync(id, request, ct);
        if (updated == null) return NotFound(new { message = $"Không tìm thấy đại lý #{id}" });
        await cacheStore.EvictByTagAsync("public-content", ct);
        return Ok(updated);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct = default)
    {
        var ok = await dealerService.DeleteAsync(id, ct);
        if (!ok) return NotFound(new { message = $"Không tìm thấy đại lý #{id}" });
        await cacheStore.EvictByTagAsync("public-content", ct);
        return NoContent();
    }
}
