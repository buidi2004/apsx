using Microsoft.EntityFrameworkCore;
using RogAdmin.Application.Interfaces;
using RogAdmin.Domain.Entities;
using System.Text.RegularExpressions;

namespace RogAdmin.Application.Services;

public class ScraperService(
    IRepository<Product> productRepo,
    IUnitOfWork unitOfWork) : IScraperService
{
    private static readonly HttpClient Client = new()
    {
        Timeout = TimeSpan.FromSeconds(15)
    };

    static ScraperService()
    {
        Client.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36");
        Client.DefaultRequestHeaders.Add("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
        Client.DefaultRequestHeaders.Add("Accept-Language", "vi-VN,vi;q=0.9,en-US;q=0.8");
    }

    public async Task<ScrapeResultDto> ScrapeProductUrlAsync(string url, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(url))
            return new ScrapeResultDto(url, "", null, null, 0, false, "URL không hợp lệ");

        try
        {
            var target = url.StartsWith("http") ? url : $"https://rog.asus.com/vn/{url.TrimStart('/')}/";
            var response = await Client.GetAsync(target, ct);
            if (!response.IsSuccessStatusCode)
            {
                return new ScrapeResultDto(url, "", null, null, 0, false, $"Máy chủ ASUS trả về mã {response.StatusCode}");
            }

            var html = await response.Content.ReadAsStringAsync(ct);

            // 1. Title
            var titleMatch = Regex.Match(html, @"<title>([^<]+)</title>", RegexOptions.IgnoreCase);
            var rawTitle = titleMatch.Success ? titleMatch.Groups[1].Value.Trim() : "ASUS ROG Product";
            var titleParts = rawTitle.Split(new[] { '|', '｜' }, StringSplitOptions.TrimEntries);
            var title = titleParts[0];

            // 2. Price
            var priceMatch = Regex.Match(html, @"(\d{1,3}(?:\.\d{3})+)\s*₫");
            var priceStr = priceMatch.Success ? priceMatch.Groups[1].Value : null;

            // 3. Model
            var modelMatch = Regex.Match(html, @"data-bv-product-id=""([^""]+)""", RegexOptions.IgnoreCase);
            var model = modelMatch.Success ? modelMatch.Groups[1].Value : null;

            // 4. Clean slug
            var cleanSlug = url.Replace("https://rog.asus.com/vn/", "").Trim('/');

            // Upsert in database
            var product = await productRepo.Query()
                .Include(p => p.Price)
                .FirstOrDefaultAsync(p => p.Slug == cleanSlug, ct);

            if (product == null)
            {
                product = new Product
                {
                    Slug = cleanSlug,
                    Name = title,
                    CategorySlug = "laptops-group",
                    ModelCode = model ?? cleanSlug.ToUpper(),
                    Tagline = $"Sản phẩm chính hãng ROG — {title}",
                    ThumbnailUrl = "/sites/rog-asus/img/products/laptop-gaming.webp",
                    KeyVisualUrl = "/sites/rog-asus/img/hero/control-resonant.webp",
                    BasePath = $"/vn/{cleanSlug}",
                    SubBarType = "standard",
                    IsActive = true,
                };
                await productRepo.AddAsync(product, ct);
            }
            else
            {
                product.Name = title;
                product.UpdatedAt = DateTime.UtcNow;
            }

            if (priceStr != null && decimal.TryParse(priceStr.Replace(".", ""), out var pVal))
            {
                if (product.Price == null)
                {
                    product.Price = new ProductPrice
                    {
                        ProductId = product.Id,
                        Price = pVal,
                        Currency = "VND",
                        LastCheckedAt = DateTime.UtcNow,
                    };
                }
                else
                {
                    product.Price.Price = pVal;
                    product.Price.LastCheckedAt = DateTime.UtcNow;
                }
            }

            await unitOfWork.SaveChangesAsync(ct);

            return new ScrapeResultDto(url, title, priceStr, model, 1, true, "Cập nhật dữ liệu từ ASUS ROG thành công");
        }
        catch (Exception ex)
        {
            return new ScrapeResultDto(url, "", null, null, 0, false, $"Lỗi cào dữ liệu: {ex.Message}");
        }
    }

    public async Task<int> SyncCatalogBatchAsync(List<string> slugs, CancellationToken ct = default)
    {
        var count = 0;
        foreach (var slug in slugs)
        {
            var res = await ScrapeProductUrlAsync(slug, ct);
            if (res.Success) count++;
        }
        return count;
    }
}
