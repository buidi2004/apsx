namespace RogAdmin.Application.Interfaces;

public record ScrapeResultDto(
    string Url,
    string Title,
    string? Price,
    string? Model,
    int SpecsFound,
    bool Success,
    string Message
);

public interface IScraperService
{
    Task<ScrapeResultDto> ScrapeProductUrlAsync(string url, CancellationToken ct = default);
    Task<int> SyncCatalogBatchAsync(List<string> slugs, CancellationToken ct = default);
}
