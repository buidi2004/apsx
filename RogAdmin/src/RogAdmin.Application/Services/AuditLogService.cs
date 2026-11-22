using Microsoft.EntityFrameworkCore;
using RogAdmin.Application.Common;
using RogAdmin.Application.Dtos.Audit;
using RogAdmin.Application.Interfaces;
using RogAdmin.Domain.Entities;

namespace RogAdmin.Application.Services;

public class AuditLogService(IRepository<AuditLog> auditRepo, IUnitOfWork unitOfWork) : IAuditLogService
{
    public async Task LogAsync(
        string username,
        string action,
        string entityName,
        string? entityId,
        string details,
        string? ipAddress = null,
        CancellationToken ct = default)
    {
        var log = new AuditLog
        {
            Username = string.IsNullOrWhiteSpace(username) ? "system" : username.Trim(),
            Action = action.Trim().ToUpperInvariant(),
            EntityName = entityName.Trim(),
            EntityId = entityId?.Trim(),
            Details = details.Trim(),
            IpAddress = ipAddress?.Trim()
        };

        await auditRepo.AddAsync(log, ct);
        await unitOfWork.SaveChangesAsync(ct);
    }

    public async Task<PagedResult<AuditLogDto>> GetLogsAsync(
        string? search,
        string? action,
        int page,
        int pageSize,
        CancellationToken ct = default)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = auditRepo.Query().AsNoTracking();

        if (!string.IsNullOrWhiteSpace(action))
        {
            var act = action.Trim().ToUpperInvariant();
            query = query.Where(l => l.Action == act);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim().ToLowerInvariant();
            query = query.Where(l =>
                l.Username.ToLower().Contains(s) ||
                l.EntityName.ToLower().Contains(s) ||
                (l.EntityId != null && l.EntityId.ToLower().Contains(s)) ||
                l.Details.ToLower().Contains(s));
        }

        var total = await query.CountAsync(ct);
        var logs = await query
            .OrderByDescending(l => l.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        var items = logs.Select(l => new AuditLogDto(
            l.Id,
            l.Username,
            l.Action,
            l.EntityName,
            l.EntityId,
            l.Details,
            l.IpAddress,
            l.CreatedAt
        )).ToList();

        return new PagedResult<AuditLogDto>
        {
            Items = items,
            Page = page,
            PageSize = pageSize,
            TotalCount = total
        };
    }
}
