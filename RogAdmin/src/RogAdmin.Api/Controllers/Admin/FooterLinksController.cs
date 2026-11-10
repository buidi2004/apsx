using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RogAdmin.Application.Dtos.FooterLinks;
using RogAdmin.Application.Interfaces;
using RogAdmin.Domain.Enums;

namespace RogAdmin.Api.Controllers.Admin;

[ApiController]
[Route("api/admin/footer-links")]
[Authorize(Roles = "Admin,Editor")]
public class FooterLinksController(IFooterLinkService service) : ControllerBase
{
    /// <summary>Danh sách link footer (lọc được theo nhóm Footer|Legal|Social).</summary>
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<FooterLinkDto>>> GetAll(
        [FromQuery] FooterLinkGroup? group,
        [FromQuery] bool includeInactive = true,
        CancellationToken ct = default)
        => Ok(await service.GetAllAsync(group, includeInactive, ct));

    [HttpGet("{id:int}")]
    public async Task<ActionResult<FooterLinkDto>> GetById(int id, CancellationToken ct)
        => Ok(await service.GetByIdAsync(id, ct));

    [HttpPost]
    public async Task<ActionResult<FooterLinkDto>> Create([FromBody] CreateFooterLinkRequest request, CancellationToken ct)
    {
        var created = await service.CreateAsync(request, ct);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<FooterLinkDto>> Update(int id, [FromBody] UpdateFooterLinkRequest request, CancellationToken ct)
        => Ok(await service.UpdateAsync(id, request, ct));

    /// <summary>Xóa link — chỉ Admin (Editor không được xóa).</summary>
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        await service.DeleteAsync(id, ct);
        return NoContent();
    }
}
