using RogAdmin.Application.Dtos.FooterLinks;
using RogAdmin.Application.Exceptions;
using RogAdmin.Application.Interfaces;
using RogAdmin.Domain.Entities;
using RogAdmin.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace RogAdmin.Application.Services;

public class FooterLinkService(
    IRepository<FooterLink> repository,
    IUnitOfWork unitOfWork) : IFooterLinkService
{
    public async Task<IReadOnlyList<FooterLinkDto>> GetAllAsync(FooterLinkGroup? group = null, bool includeInactive = true, CancellationToken ct = default)
    {
        var q = repository.Query().AsNoTracking();
        if (group.HasValue)
        {
            q = q.Where(l => l.Group == group.Value);
        }
        if (!includeInactive)
        {
            q = q.Where(l => l.IsActive);
        }
        var links = await q.OrderBy(l => l.Group).ThenBy(l => l.SortOrder).ThenBy(l => l.Id).ToListAsync(ct);
        return links.Select(ToDto).ToList();
    }

    public async Task<FooterLinkDto> GetByIdAsync(int id, CancellationToken ct = default)
    {
        var link = await repository.GetByIdAsync(id, ct)
                   ?? throw AppException.NotFound($"Link footer #{id}");
        return ToDto(link);
    }

    public async Task<FooterLinkDto> CreateAsync(CreateFooterLinkRequest request, CancellationToken ct = default)
    {
        Validate(request.Label, request.Href);
        EnsureGroupValid(request.Group);

        var link = new FooterLink
        {
            Label = request.Label.Trim(),
            Href = request.Href.Trim(),
            Group = request.Group,
            SortOrder = request.SortOrder,
            IsActive = request.IsActive,
        };

        await repository.AddAsync(link, ct);
        await unitOfWork.SaveChangesAsync(ct);
        return ToDto(link);
    }

    public async Task<FooterLinkDto> UpdateAsync(int id, UpdateFooterLinkRequest request, CancellationToken ct = default)
    {
        Validate(request.Label, request.Href);
        EnsureGroupValid(request.Group);

        var link = await repository.GetByIdAsync(id, ct)
                   ?? throw AppException.NotFound($"Link footer #{id}");

        link.Label = request.Label.Trim();
        link.Href = request.Href.Trim();
        link.Group = request.Group;
        link.SortOrder = request.SortOrder;
        link.IsActive = request.IsActive;
        link.UpdatedAt = DateTime.UtcNow;

        repository.Update(link);
        await unitOfWork.SaveChangesAsync(ct);
        return ToDto(link);
    }

    public async Task DeleteAsync(int id, CancellationToken ct = default)
    {
        var link = await repository.GetByIdAsync(id, ct)
                   ?? throw AppException.NotFound($"Link footer #{id}");
        repository.Remove(link);
        await unitOfWork.SaveChangesAsync(ct);
    }

    /// <summary>Chặn enum rác (ví dụ JSON "group": 99) lưu xuống DB.</summary>
    private static void EnsureGroupValid(FooterLinkGroup group)
    {
        if (!Enum.IsDefined(typeof(FooterLinkGroup), group))
        {
            throw AppException.BadRequest("Nhóm link chỉ nhận 'Footer', 'Legal' hoặc 'Social'.");
        }
    }

    private static void Validate(string label, string href)
    {
        if (string.IsNullOrWhiteSpace(label))
        {
            throw AppException.BadRequest("Nhãn link không được để trống.");
        }
        if (string.IsNullOrWhiteSpace(href))
        {
            throw AppException.BadRequest("Đường dẫn link không được để trống.");
        }
    }

    private static FooterLinkDto ToDto(FooterLink l) => new()
    {
        Id = l.Id,
        Label = l.Label,
        Href = l.Href,
        Group = l.Group,
        SortOrder = l.SortOrder,
        IsActive = l.IsActive,
    };
}
