using Microsoft.EntityFrameworkCore;
using RogAdmin.Application.Common;
using RogAdmin.Application.Dtos.Products;
using RogAdmin.Application.Interfaces;
using RogAdmin.Domain.Entities;
using RogAdmin.Domain.Enums;
using System.Globalization;

namespace RogAdmin.Application.Services;

public class ProductCatalogService(
    IRepository<Product> productRepo,
    IRepository<ProductPrice> priceRepo,
    IRepository<Dealer> dealerRepo,
    IRepository<WarrantyRecord> warrantyRepo,
    IUnitOfWork unitOfWork) : IProductCatalogService
{
    private static readonly CultureInfo ViCulture = new("vi-VN");

    public async Task<PagedResult<ProductListItemDto>> GetProductsAsync(
        string? category,
        string? search,
        int page = 1,
        int pageSize = 20,
        CancellationToken ct = default)
    {
        var q = productRepo.Query()
            .AsNoTracking()
            .Include(p => p.Price)
            .Where(p => p.IsActive);

        if (!string.IsNullOrWhiteSpace(category))
        {
            var catLower = category.Trim().ToLower();
            q = q.Where(p => p.CategorySlug.ToLower() == catLower || p.CategorySlug.ToLower().Contains(catLower));
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var searchLower = search.Trim().ToLower();
            q = q.Where(p => p.Name.ToLower().Contains(searchLower) ||
                             p.Slug.ToLower().Contains(searchLower) ||
                             p.ModelCode.ToLower().Contains(searchLower));
        }

        var total = await q.CountAsync(ct);
        var items = await q.OrderByDescending(p => p.IsHot)
                           .ThenByDescending(p => p.IsFeatured)
                           .ThenBy(p => p.Name)
                           .Skip((page - 1) * pageSize)
                           .Take(pageSize)
                           .Select(p => new ProductListItemDto(
                               p.Id,
                               p.Slug,
                               p.Name,
                               p.CategorySlug,
                               p.ModelCode,
                               p.Tagline,
                               p.ThumbnailUrl,
                               p.BasePath,
                               p.Price != null ? p.Price.Price : 0,
                               p.Price != null ? p.Price.OldPrice : null,
                               p.Price != null ? p.Price.DiscountLabel : "",
                               p.Price != null ? p.Price.StockStatus : StockStatus.InStock,
                               p.IsHot,
                               p.IsFeatured,
                               p.IsActive
                           ))
                           .ToListAsync(ct);

        return new PagedResult<ProductListItemDto>
        {
            Items = items,
            Page = page,
            PageSize = pageSize,
            TotalCount = total
        };
    }

    public async Task<ProductDetailDto?> GetProductBySlugAsync(string slug, CancellationToken ct = default)
    {
        var slugLower = slug.Trim().ToLower();
        var product = await productRepo.Query()
            .AsNoTracking()
            .Include(p => p.Price)
            .Include(p => p.Specs.OrderBy(s => s.OrderIndex))
            .FirstOrDefaultAsync(p => p.Slug.ToLower() == slugLower || p.Slug.ToLower().EndsWith("/" + slugLower), ct);

        if (product == null) return null;

        return new ProductDetailDto(
            product.Id,
            product.Slug,
            product.Name,
            product.CategorySlug,
            product.ModelCode,
            product.Tagline,
            product.ThumbnailUrl,
            product.KeyVisualUrl,
            product.BasePath,
            product.SubBarType,
            product.Price?.Price ?? 0,
            product.Price?.OldPrice,
            product.Price?.DiscountLabel ?? "",
            product.Price?.StockStatus ?? StockStatus.InStock,
            product.Price?.StoreUrl ?? "/vn/where-to-buy",
            product.Specs.Select(s => new ProductSpecDto(s.SpecGroup, s.SpecKey, s.SpecValue)).ToList()
        );
    }

    public async Task<List<ProductPriceDto>> GetBatchPricingAsync(List<string> slugs, CancellationToken ct = default)
    {
        var normalizedSlugs = slugs.Select(s => s.Trim().ToLower().TrimStart('/').Replace("vn/", "")).ToList();
        var shortSlugs = normalizedSlugs.Select(s => s.Split('/').Last()).ToList();
        var allKeys = normalizedSlugs.Concat(shortSlugs).Distinct().ToList();

        var products = await productRepo.Query()
            .AsNoTracking()
            .Include(p => p.Price)
            .Where(p => allKeys.Contains(p.Slug.ToLower()))
            .ToListAsync(ct);

        if (products.Count < normalizedSlugs.Count)
        {
            var foundSlugs = products.Select(p => p.Slug.ToLower()).ToHashSet();
            var missingShortSlugs = shortSlugs.Where(s => !foundSlugs.Any(f => f.EndsWith(s))).ToList();

            if (missingShortSlugs.Count > 0)
            {
                var allActive = await productRepo.Query()
                    .AsNoTracking()
                    .Include(p => p.Price)
                    .Where(p => p.IsActive)
                    .ToListAsync(ct);

                foreach (var p in allActive)
                {
                    if (foundSlugs.Contains(p.Slug.ToLower())) continue;
                    var tail = p.Slug.ToLower().Split('/').Last();
                    if (missingShortSlugs.Contains(tail))
                    {
                        products.Add(p);
                        foundSlugs.Add(p.Slug.ToLower());
                    }
                }
            }
        }

        return products.Select(p =>
        {
            var price = p.Price?.Price ?? 0;
            var oldPrice = p.Price?.OldPrice;
            var formattedPrice = price > 0 ? string.Format(ViCulture, "{0:N0} ₫", price) : "Liên hệ";
            var formattedOld = oldPrice > 0 ? string.Format(ViCulture, "{0:N0} ₫", oldPrice) : null;

            return new ProductPriceDto(
                p.Id,
                p.Slug,
                price,
                oldPrice,
                p.Price?.DiscountLabel ?? "",
                p.Price?.StockStatus ?? StockStatus.InStock,
                formattedPrice,
                formattedOld
            );
        }).ToList();
    }

    public async Task<CompareMatrixDto> CompareProductsAsync(List<string> slugs, CancellationToken ct = default)
    {
        var normalizedSlugs = slugs.Select(s => s.Trim().ToLower().TrimStart('/').Replace("vn/", "")).ToList();
        var shortSlugs = normalizedSlugs.Select(s => s.Split('/').Last()).ToList();
        var allKeys = normalizedSlugs.Concat(shortSlugs).Distinct().ToList();

        var products = await productRepo.Query()
            .AsNoTracking()
            .Include(p => p.Price)
            .Include(p => p.Specs)
            .Where(p => allKeys.Contains(p.Slug.ToLower()))
            .ToListAsync(ct);

        if (products.Count < normalizedSlugs.Count)
        {
            var foundSlugs = products.Select(p => p.Slug.ToLower()).ToHashSet();
            var missingShortSlugs = shortSlugs.Where(s => !foundSlugs.Any(f => f.EndsWith(s))).ToList();

            if (missingShortSlugs.Count > 0)
            {
                var allActive = await productRepo.Query()
                    .AsNoTracking()
                    .Include(p => p.Price)
                    .Include(p => p.Specs)
                    .Where(p => p.IsActive)
                    .ToListAsync(ct);

                foreach (var p in allActive)
                {
                    if (foundSlugs.Contains(p.Slug.ToLower())) continue;
                    var tail = p.Slug.ToLower().Split('/').Last();
                    if (missingShortSlugs.Contains(tail))
                    {
                        products.Add(p);
                        foundSlugs.Add(p.Slug.ToLower());
                    }
                }
            }
        }

        var productDtos = products.Select(product => new ProductDetailDto(
            product.Id,
            product.Slug,
            product.Name,
            product.CategorySlug,
            product.ModelCode,
            product.Tagline,
            product.ThumbnailUrl,
            product.KeyVisualUrl,
            product.BasePath,
            product.SubBarType,
            product.Price?.Price ?? 0,
            product.Price?.OldPrice,
            product.Price?.DiscountLabel ?? "",
            product.Price?.StockStatus ?? StockStatus.InStock,
            product.Price?.StoreUrl ?? "/vn/where-to-buy",
            product.Specs.OrderBy(s => s.OrderIndex).Select(s => new ProductSpecDto(s.SpecGroup, s.SpecKey, s.SpecValue)).ToList()
        )).ToList();

        var commonKeys = productDtos
            .SelectMany(p => p.Specs.Select(s => s.Key))
            .Distinct()
            .ToList();

        return new CompareMatrixDto(productDtos, commonKeys);
    }

    public async Task<List<DealerDto>> GetDealersAsync(CancellationToken ct = default)
    {
        var dealers = await dealerRepo.Query()
            .AsNoTracking()
            .OrderByDescending(d => d.IsOfficialPartner)
            .ThenBy(d => d.Name)
            .ToListAsync(ct);

        return dealers.Select(d => new DealerDto(
            d.Id,
            d.Name,
            d.Slug,
            d.LogoUrl,
            d.WebsiteUrl,
            d.Hotline,
            d.IsOfficialPartner,
            d.StoreCount,
            d.CityCoverage
        )).ToList();
    }

    public async Task<WarrantyCheckResultDto?> CheckWarrantyAsync(string serialNumber, CancellationToken ct = default)
    {
        var snLower = serialNumber.Trim().ToUpper();
        var record = await warrantyRepo.Query()
            .AsNoTracking()
            .FirstOrDefaultAsync(w => w.SerialNumber.ToUpper() == snLower, ct);

        if (record == null) return null;

        var statusText = record.Status switch
        {
            WarrantyStatus.Active => "Còn hạn bảo hành chính hãng",
            WarrantyStatus.Expired => "Đã hết hạn bảo hành",
            WarrantyStatus.InService => "Đang trong quá trình bảo dưỡng",
            _ => "Không xác định"
        };

        return new WarrantyCheckResultDto(
            record.SerialNumber,
            record.ProductModel,
            record.PurchaseDate,
            record.ExpiryDate,
            record.Status,
            statusText,
            record.ServiceCenter
        );
    }

    public async Task<ProductPriceDto?> UpdateProductPriceAsync(
        int productId,
        decimal price,
        decimal? oldPrice,
        string? discountLabel,
        StockStatus? stockStatus,
        CancellationToken ct = default)
    {
        var product = await productRepo.Query()
            .Include(p => p.Price)
            .FirstOrDefaultAsync(p => p.Id == productId, ct);

        if (product == null) return null;

        if (product.Price == null)
        {
            var newPrice = new ProductPrice
            {
                ProductId = product.Id,
                Price = price,
                OldPrice = oldPrice,
                DiscountLabel = discountLabel ?? "",
                StockStatus = stockStatus ?? StockStatus.InStock,
                Currency = "VND",
                LastCheckedAt = DateTime.UtcNow
            };
            await priceRepo.AddAsync(newPrice, ct);
            product.Price = newPrice;
        }
        else
        {
            product.Price.Price = price;
            if (oldPrice.HasValue) product.Price.OldPrice = oldPrice.Value;
            if (discountLabel != null) product.Price.DiscountLabel = discountLabel;
            if (stockStatus.HasValue) product.Price.StockStatus = stockStatus.Value;
            product.Price.LastCheckedAt = DateTime.UtcNow;
            priceRepo.Update(product.Price);
        }

        await unitOfWork.SaveChangesAsync(ct);

        var formattedPrice = price > 0 ? string.Format(ViCulture, "{0:N0} ₫", price) : "Liên hệ";
        var formattedOld = product.Price.OldPrice > 0 ? string.Format(ViCulture, "{0:N0} ₫", product.Price.OldPrice) : null;

        return new ProductPriceDto(
            product.Id,
            product.Slug,
            product.Price.Price,
            product.Price.OldPrice,
            product.Price.DiscountLabel,
            product.Price.StockStatus,
            formattedPrice,
            formattedOld
        );
    }

    public async Task<ProductPriceDto?> UpdateProductPriceBySlugAsync(
        string slug,
        decimal price,
        decimal? oldPrice,
        string? discountLabel,
        StockStatus? stockStatus,
        CancellationToken ct = default)
    {
        var normalizedSlug = slug.Trim().ToLower().TrimStart('/').Replace("vn/", "");
        var shortSlug = normalizedSlug.Split('/').Last();

        var product = await productRepo.Query()
            .Include(p => p.Price)
            .FirstOrDefaultAsync(p => p.Slug.ToLower() == normalizedSlug || p.Slug.ToLower().EndsWith("/" + shortSlug) || p.Slug.ToLower() == shortSlug, ct);

        if (product == null) return null;

        return await UpdateProductPriceAsync(product.Id, price, oldPrice, discountLabel, stockStatus, ct);
    }

    public async Task<ProductDetailDto?> GetProductByIdAsync(int id, CancellationToken ct = default)
    {
        var product = await productRepo.Query()
            .AsNoTracking()
            .Include(p => p.Price)
            .Include(p => p.Specs)
            .FirstOrDefaultAsync(p => p.Id == id, ct);

        if (product == null) return null;

        var price = product.Price?.Price ?? 0;
        var oldPrice = product.Price?.OldPrice;
        var discountLabel = product.Price?.DiscountLabel ?? "";
        var stockStatus = product.Price?.StockStatus ?? StockStatus.InStock;
        var storeUrl = product.Price?.StoreUrl ?? "";

        var specs = product.Specs
            .OrderBy(s => s.OrderIndex)
            .Select(s => new ProductSpecDto(s.SpecGroup, s.SpecKey, s.SpecValue))
            .ToList();

        return new ProductDetailDto(
            product.Id,
            product.Slug,
            product.Name,
            product.CategorySlug,
            product.ModelCode,
            product.Tagline,
            product.ThumbnailUrl,
            product.KeyVisualUrl,
            product.BasePath,
            product.SubBarType,
            price,
            oldPrice,
            discountLabel,
            stockStatus,
            storeUrl,
            specs
        );
    }

    public async Task<ProductListItemDto> CreateProductAsync(CreateProductRequest request, CancellationToken ct = default)
    {
        var slug = string.IsNullOrWhiteSpace(request.Slug)
            ? TagNormalizer.Slugify(request.Name)
            : request.Slug.Trim().ToLower();

        var product = new Product
        {
            Name = request.Name.Trim(),
            Slug = slug,
            CategorySlug = request.CategorySlug.Trim().ToLower(),
            ModelCode = request.ModelCode?.Trim() ?? string.Empty,
            Tagline = request.Tagline?.Trim() ?? string.Empty,
            ThumbnailUrl = request.ThumbnailUrl?.Trim() ?? string.Empty,
            KeyVisualUrl = request.KeyVisualUrl?.Trim() ?? string.Empty,
            BasePath = string.IsNullOrWhiteSpace(request.BasePath) ? $"/vn/{request.CategorySlug}/{slug}" : request.BasePath.Trim(),
            IsHot = request.IsHot,
            IsFeatured = request.IsFeatured,
            IsActive = true
        };

        await productRepo.AddAsync(product, ct);
        await unitOfWork.SaveChangesAsync(ct);

        var price = new ProductPrice
        {
            ProductId = product.Id,
            Price = request.Price,
            OldPrice = request.OldPrice,
            DiscountLabel = request.DiscountLabel ?? "",
            StockStatus = request.StockStatus,
            Currency = "VND",
            LastCheckedAt = DateTime.UtcNow
        };

        await priceRepo.AddAsync(price, ct);
        await unitOfWork.SaveChangesAsync(ct);

        return new ProductListItemDto(
            product.Id,
            product.Slug,
            product.Name,
            product.CategorySlug,
            product.ModelCode,
            product.Tagline,
            product.ThumbnailUrl,
            product.BasePath,
            price.Price,
            price.OldPrice,
            price.DiscountLabel,
            price.StockStatus,
            product.IsHot,
            product.IsFeatured,
            product.IsActive
        );
    }

    public async Task<ProductListItemDto?> UpdateProductAsync(int id, UpdateProductRequest request, CancellationToken ct = default)
    {
        var product = await productRepo.Query()
            .Include(p => p.Price)
            .FirstOrDefaultAsync(p => p.Id == id, ct);

        if (product == null) return null;

        product.Name = request.Name.Trim();
        product.CategorySlug = request.CategorySlug.Trim().ToLower();
        if (request.ModelCode != null) product.ModelCode = request.ModelCode.Trim();
        if (request.Tagline != null) product.Tagline = request.Tagline.Trim();
        if (request.ThumbnailUrl != null) product.ThumbnailUrl = request.ThumbnailUrl.Trim();
        if (request.KeyVisualUrl != null) product.KeyVisualUrl = request.KeyVisualUrl.Trim();
        if (!string.IsNullOrWhiteSpace(request.BasePath)) product.BasePath = request.BasePath.Trim();
        product.IsHot = request.IsHot;
        product.IsFeatured = request.IsFeatured;
        product.IsActive = request.IsActive;

        productRepo.Update(product);
        await unitOfWork.SaveChangesAsync(ct);

        return new ProductListItemDto(
            product.Id,
            product.Slug,
            product.Name,
            product.CategorySlug,
            product.ModelCode,
            product.Tagline,
            product.ThumbnailUrl,
            product.BasePath,
            product.Price?.Price ?? 0,
            product.Price?.OldPrice,
            product.Price?.DiscountLabel ?? "",
            product.Price?.StockStatus ?? StockStatus.InStock,
            product.IsHot,
            product.IsFeatured,
            product.IsActive
        );
    }

    public async Task<bool> DeleteProductAsync(int id, CancellationToken ct = default)
    {
        var product = await productRepo.Query()
            .Include(p => p.Price)
            .Include(p => p.Specs)
            .FirstOrDefaultAsync(p => p.Id == id, ct);

        if (product == null) return false;

        if (product.Price != null)
        {
            priceRepo.Remove(product.Price);
        }

        productRepo.Remove(product);
        await unitOfWork.SaveChangesAsync(ct);
        return true;
    }
}
