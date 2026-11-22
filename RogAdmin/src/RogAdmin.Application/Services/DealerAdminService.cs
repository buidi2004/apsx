using Microsoft.EntityFrameworkCore;
using RogAdmin.Application.Common;
using RogAdmin.Application.Dtos.Dealers;
using RogAdmin.Application.Interfaces;
using RogAdmin.Domain.Entities;

namespace RogAdmin.Application.Services;

public class DealerAdminService(
    IRepository<Dealer> dealerRepo,
    IUnitOfWork unitOfWork) : IDealerAdminService
{
    public async Task<PagedResult<DealerDto>> GetPagedAsync(
        string? search, string? city, int page = 1, int pageSize = 20, CancellationToken ct = default)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = dealerRepo.Query().AsNoTracking();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim().ToLower();
            query = query.Where(d => d.Name.ToLower().Contains(s) || d.Hotline.Contains(s) || d.Slug.ToLower().Contains(s));
        }

        if (!string.IsNullOrWhiteSpace(city) && !city.Equals("all", StringComparison.OrdinalIgnoreCase))
        {
            var c = city.Trim().ToLower();
            query = query.Where(d => d.CityCoverage.ToLower().Contains(c));
        }

        var total = await query.CountAsync(ct);
        var items = await query
            .OrderByDescending(d => d.IsOfficialPartner)
            .ThenBy(d => d.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(d => new DealerDto(
                d.Id,
                d.Name,
                d.Slug,
                d.LogoUrl,
                d.WebsiteUrl,
                d.Hotline,
                d.IsOfficialPartner,
                d.StoreCount,
                d.CityCoverage
            ))
            .ToListAsync(ct);

        return new PagedResult<DealerDto>
        {
            Items = items,
            Page = page,
            PageSize = pageSize,
            TotalCount = total,
        };
    }

    public async Task<DealerDto?> GetByIdAsync(int id, CancellationToken ct = default)
    {
        var d = await dealerRepo.GetByIdAsync(id, ct);
        if (d == null) return null;

        return new DealerDto(
            d.Id,
            d.Name,
            d.Slug,
            d.LogoUrl,
            d.WebsiteUrl,
            d.Hotline,
            d.IsOfficialPartner,
            d.StoreCount,
            d.CityCoverage
        );
    }

    public async Task<DealerDto> CreateAsync(CreateDealerRequest request, CancellationToken ct = default)
    {
        var slug = string.IsNullOrWhiteSpace(request.Slug)
            ? request.Name.Trim().ToLower().Replace(" ", "-")
            : request.Slug.Trim().ToLower();

        var dealer = new Dealer
        {
            Name = request.Name.Trim(),
            Slug = slug,
            LogoUrl = request.LogoUrl.Trim(),
            WebsiteUrl = request.WebsiteUrl.Trim(),
            Hotline = request.Hotline.Trim(),
            IsOfficialPartner = request.IsOfficialPartner,
            StoreCount = request.StoreCount,
            CityCoverage = string.IsNullOrWhiteSpace(request.CityCoverage) ? "Toàn quốc" : request.CityCoverage.Trim()
        };

        await dealerRepo.AddAsync(dealer, ct);
        await unitOfWork.SaveChangesAsync(ct);

        return new DealerDto(
            dealer.Id,
            dealer.Name,
            dealer.Slug,
            dealer.LogoUrl,
            dealer.WebsiteUrl,
            dealer.Hotline,
            dealer.IsOfficialPartner,
            dealer.StoreCount,
            dealer.CityCoverage
        );
    }

    public async Task<DealerDto?> UpdateAsync(int id, UpdateDealerRequest request, CancellationToken ct = default)
    {
        var dealer = await dealerRepo.GetByIdAsync(id, ct);
        if (dealer == null) return null;

        dealer.Name = request.Name.Trim();
        dealer.Slug = request.Slug.Trim().ToLower();
        dealer.LogoUrl = request.LogoUrl.Trim();
        dealer.WebsiteUrl = request.WebsiteUrl.Trim();
        dealer.Hotline = request.Hotline.Trim();
        dealer.IsOfficialPartner = request.IsOfficialPartner;
        dealer.StoreCount = request.StoreCount;
        dealer.CityCoverage = request.CityCoverage.Trim();

        dealerRepo.Update(dealer);
        await unitOfWork.SaveChangesAsync(ct);

        return new DealerDto(
            dealer.Id,
            dealer.Name,
            dealer.Slug,
            dealer.LogoUrl,
            dealer.WebsiteUrl,
            dealer.Hotline,
            dealer.IsOfficialPartner,
            dealer.StoreCount,
            dealer.CityCoverage
        );
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
    {
        var dealer = await dealerRepo.GetByIdAsync(id, ct);
        if (dealer == null) return false;

        dealerRepo.Remove(dealer);
        await unitOfWork.SaveChangesAsync(ct);
        return true;
    }
}
