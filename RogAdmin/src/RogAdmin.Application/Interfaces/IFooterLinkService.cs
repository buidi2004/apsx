using RogAdmin.Application.Dtos.FooterLinks;
using RogAdmin.Domain.Enums;

namespace RogAdmin.Application.Interfaces;

public interface IFooterLinkService
{
    Task<IReadOnlyList<FooterLinkDto>> GetAllAsync(FooterLinkGroup? group = null, bool includeInactive = true, CancellationToken ct = default);
    Task<FooterLinkDto> GetByIdAsync(int id, CancellationToken ct = default);
    Task<FooterLinkDto> CreateAsync(CreateFooterLinkRequest request, CancellationToken ct = default);
    Task<FooterLinkDto> UpdateAsync(int id, UpdateFooterLinkRequest request, CancellationToken ct = default);
    Task DeleteAsync(int id, CancellationToken ct = default);
}
