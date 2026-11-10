using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RogAdmin.Application.Interfaces;

namespace RogAdmin.Api.Controllers.Admin;

[ApiController]
[Route("api/admin/scraper")]
[Authorize]
public class ScraperController(IScraperService scraperService) : ControllerBase
{
    public record TriggerScrapeRequest(string Url);
    public record BatchSyncRequest(List<string> Slugs);

    /// <summary>
    /// Kích hoạt cào dữ liệu tức thì cho 1 URL/Slug của ASUS ROG
    /// POST /api/admin/scraper/trigger
    /// </summary>
    [HttpPost("trigger")]
    public async Task<ActionResult<ScrapeResultDto>> TriggerScrape([FromBody] TriggerScrapeRequest request, CancellationToken ct)
    {
        var result = await scraperService.ScrapeProductUrlAsync(request.Url, ct);
        return Ok(result);
    }

    /// <summary>
    /// Đồng bộ hàng loạt nhiều sản phẩm
    /// POST /api/admin/scraper/batch-sync
    /// </summary>
    [HttpPost("batch-sync")]
    public async Task<ActionResult> BatchSync([FromBody] BatchSyncRequest request, CancellationToken ct)
    {
        var count = await scraperService.SyncCatalogBatchAsync(request.Slugs, ct);
        return Ok(new { syncedCount = count, message = $"Đã đồng bộ {count} sản phẩm thành công." });
    }
}
