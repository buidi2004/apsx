using RogAdmin.Application.Common;
using RogAdmin.Application.Dtos.Audit;

namespace RogAdmin.Application.Interfaces;

public interface IAuditLogService
{
    Task LogAsync(string username, string action, string entityName, string? entityId, string details, string? ipAddress = null, CancellationToken ct = default);
    Task<PagedResult<AuditLogDto>> GetLogsAsync(string? search, string? action, int page, int pageSize, CancellationToken ct = default);
}
