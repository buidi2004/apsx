using RogAdmin.Application.Common;
using RogAdmin.Application.Dtos.Warranty;

namespace RogAdmin.Application.Interfaces;

public interface IWarrantyAdminService
{
    Task<PagedResult<WarrantyRecordDto>> GetPagedAsync(string? search, int page = 1, int pageSize = 20, CancellationToken ct = default);
    Task<WarrantyRecordDto?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<WarrantyRecordDto> CreateAsync(CreateWarrantyRecordRequest request, CancellationToken ct = default);
    Task<WarrantyRecordDto?> UpdateAsync(int id, UpdateWarrantyRecordRequest request, CancellationToken ct = default);
    Task<bool> DeleteAsync(int id, CancellationToken ct = default);
}
