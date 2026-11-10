using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using RogAdmin.Application.Common;
using RogAdmin.Application.Dtos.Articles;
using RogAdmin.Application.Interfaces;
using RogAdmin.Domain.Enums;

namespace RogAdmin.Api.Controllers.Admin;

[ApiController]
[Route("api/admin/articles")]
[Authorize(Roles = "Admin,Editor")]
public class ArticlesController(IArticleService service, IOutputCacheStore cacheStore) : ControllerBase
{
    /// <summary>Danh sách bài viết (phân trang, lọc theo section/tag/từ khóa).</summary>
    [HttpGet]
    public async Task<ActionResult<PagedResult<ArticleDto>>> GetPaged(
        [FromQuery] ArticleSection? section,
        [FromQuery] string? tag,
        [FromQuery] string? search,
        [FromQuery] bool includeInactive = true,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken ct = default)
    {
        var result = await service.GetPagedAsync(new ArticleQuery
        {
            Section = section,
            Tag = tag,
            Search = search,
            IncludeInactive = includeInactive,
            Page = page,
            PageSize = pageSize,
        }, ct);
        return Ok(result);
    }

    /// <summary>Danh sách chuyên mục phân biệt (dropdown lọc ở admin UI).</summary>
    [HttpGet("tags")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetTags(CancellationToken ct)
        => Ok(await service.GetDistinctTagsAsync(ct));

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ArticleDto>> GetById(int id, CancellationToken ct)
        => Ok(await service.GetByIdAsync(id, ct));

    [HttpPost]
    public async Task<ActionResult<ArticleDto>> Create([FromBody] CreateArticleRequest request, CancellationToken ct)
    {
        var created = await service.CreateAsync(request, ct);
        await cacheStore.EvictByTagAsync("public-content", ct);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<ArticleDto>> Update(int id, [FromBody] UpdateArticleRequest request, CancellationToken ct)
    {
        var updated = await service.UpdateAsync(id, request, ct);
        await cacheStore.EvictByTagAsync("public-content", ct);
        return Ok(updated);
    }

    /// <summary>Xóa bài viết — chỉ Admin (Editor không được xóa).</summary>
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        await service.DeleteAsync(id, ct);
        await cacheStore.EvictByTagAsync("public-content", ct);
        return NoContent();
    }
}
