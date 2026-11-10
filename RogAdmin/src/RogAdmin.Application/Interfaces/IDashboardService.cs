using RogAdmin.Application.Dtos.Dashboard;

namespace RogAdmin.Application.Interfaces;

public interface IDashboardService
{
    Task<DashboardStatsDto> GetStatsAsync(CancellationToken ct = default);
}
