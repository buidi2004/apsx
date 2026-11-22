using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RogAdmin.Application.Common;
using RogAdmin.Application.Dtos.Audit;
using RogAdmin.Application.Interfaces;

namespace RogAdmin.Api.Controllers.Admin;

[ApiController]
[Route("api/admin/audit-logs")]
[Authorize(Roles = "Admin")]
public class AuditLogsAdminController(IAuditLogService auditLog) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PagedResult<AuditLogDto>>> GetLogs(
        [FromQuery] string? search,
        [FromQuery] string? action,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken ct = default)
    {
        return Ok(await auditLog.GetLogsAsync(search, action, page, pageSize, ct));
    }
}
