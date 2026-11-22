using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RogAdmin.Application.Common;
using RogAdmin.Application.Dtos.Newsletter;
using RogAdmin.Infrastructure.Persistence;

namespace RogAdmin.Api.Controllers.Admin;

[ApiController]
[Route("api/admin/newsletter")]
[Authorize(Roles = "Admin,Editor")]
public class NewsletterAdminController(RogAdminDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PagedResult<NewsletterSubscriberDto>>> GetPaged(
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 30,
        CancellationToken ct = default)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = db.NewsletterSubscribers.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim().ToLower();
            query = query.Where(n => n.Email.ToLower().Contains(s));
        }

        var total = await query.CountAsync(ct);
        var items = await query
            .OrderByDescending(n => n.CreatedAtUtc)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(n => new NewsletterSubscriberDto(
                n.Id,
                n.Email,
                n.CreatedAtUtc
            ))
            .ToListAsync(ct);

        return Ok(new PagedResult<NewsletterSubscriberDto>
        {
            Items = items,
            Page = page,
            PageSize = pageSize,
            TotalCount = total
        });
    }

    [HttpGet("export-csv")]
    public async Task<IActionResult> ExportCsv(CancellationToken ct = default)
    {
        var list = await db.NewsletterSubscribers
            .AsNoTracking()
            .OrderByDescending(n => n.CreatedAtUtc)
            .ToListAsync(ct);

        var sb = new StringBuilder();
        sb.AppendLine("Id,Email,CreatedAtUtc");
        foreach (var item in list)
        {
            sb.AppendLine($"\"{item.Id}\",\"{item.Email}\",\"{item.CreatedAtUtc:yyyy-MM-dd HH:mm:ss}\"");
        }

        var bytes = Encoding.UTF8.GetPreamble().Concat(Encoding.UTF8.GetBytes(sb.ToString())).ToArray();
        return File(bytes, "text/csv", $"rog_newsletter_{DateTime.UtcNow:yyyyMMdd_HHmm}.csv");
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct = default)
    {
        var item = await db.NewsletterSubscribers.FirstOrDefaultAsync(n => n.Id == id, ct);
        if (item == null) return NotFound(new { message = $"Không tìm thấy subscriber {id}" });

        db.NewsletterSubscribers.Remove(item);
        await db.SaveChangesAsync(ct);
        return NoContent();
    }
}
