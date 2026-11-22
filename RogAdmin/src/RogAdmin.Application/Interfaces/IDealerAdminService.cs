using RogAdmin.Application.Common;
using RogAdmin.Application.Dtos.Dealers;

namespace RogAdmin.Application.Interfaces;

public interface IDealerAdminService
{
    Task<PagedResult<DealerDto>> GetPagedAsync(string? search, string? city, int page = 1, int pageSize = 20, CancellationToken ct = default);
    Task<DealerDto?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<DealerDto> CreateAsync(CreateDealerRequest request, CancellationToken ct = default);
    Task<DealerDto?> UpdateAsync(int id, UpdateDealerRequest request, CancellationToken ct = default);
    Task<bool> DeleteAsync(int id, CancellationToken ct = default);
}
