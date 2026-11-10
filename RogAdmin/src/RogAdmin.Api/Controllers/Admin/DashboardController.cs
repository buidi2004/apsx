using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RogAdmin.Application.Dtos.Dashboard;
using RogAdmin.Application.Interfaces;

namespace RogAdmin.Api.Controllers.Admin;

[ApiController]
[Route("api/admin/dashboard")]
[Authorize(Roles = "Admin,Editor")]
public class DashboardController(IDashboardService service) : ControllerBase
{
    /// <summary>Thống kê nhanh cho trang dashboard.</summary>
    [HttpGet]
    public async Task<ActionResult<DashboardStatsDto>> GetStats(CancellationToken ct)
        => Ok(await service.GetStatsAsync(ct));
}
