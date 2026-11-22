using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using RogAdmin.Application.Common;
using RogAdmin.Application.Dtos.Warranty;
using RogAdmin.Application.Interfaces;

namespace RogAdmin.Api.Controllers.Admin;

[ApiController]
[Route("api/admin/warranty")]
[Authorize(Roles = "Admin,Editor")]
public class WarrantyAdminController(
    IWarrantyAdminService warrantyService,
    IOutputCacheStore cacheStore) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PagedResult<WarrantyRecordDto>>> GetPaged(
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken ct = default)
    {
        return Ok(await warrantyService.GetPagedAsync(search, page, pageSize, ct));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<WarrantyRecordDto>> GetById(int id, CancellationToken ct = default)
    {
        var record = await warrantyService.GetByIdAsync(id, ct);
        if (record == null) return NotFound(new { message = $"Không tìm thấy hồ sơ bảo hành #{id}" });
        return Ok(record);
    }

    [HttpPost]
    public async Task<ActionResult<WarrantyRecordDto>> Create([FromBody] CreateWarrantyRecordRequest request, CancellationToken ct = default)
    {
        var created = await warrantyService.CreateAsync(request, ct);
        await cacheStore.EvictByTagAsync("public-content", ct);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<WarrantyRecordDto>> Update(int id, [FromBody] UpdateWarrantyRecordRequest request, CancellationToken ct = default)
    {
        var updated = await warrantyService.UpdateAsync(id, request, ct);
        if (updated == null) return NotFound(new { message = $"Không tìm thấy hồ sơ bảo hành #{id}" });
        await cacheStore.EvictByTagAsync("public-content", ct);
        return Ok(updated);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct = default)
    {
        var ok = await warrantyService.DeleteAsync(id, ct);
        if (!ok) return NotFound(new { message = $"Không tìm thấy hồ sơ bảo hành #{id}" });
        await cacheStore.EvictByTagAsync("public-content", ct);
        return NoContent();
    }
}
