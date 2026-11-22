using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.EntityFrameworkCore;
using RogAdmin.Infrastructure.Persistence;

namespace RogAdmin.Api.Controllers.Public;

public record PublicServiceCenterDto(
    string City,
    string Name,
    string Address,
    string Phone,
    string Time
);

public record PublicWarrantyPolicyDto(
    string Title,
    string Desc
);

public record PublicSupportInfoDto(
    IReadOnlyList<PublicServiceCenterDto> Centers,
    IReadOnlyList<PublicWarrantyPolicyDto> Policies
);

[ApiController]
[Route("api/public")]
[OutputCache(PolicyName = "PublicCache")]
[ResponseCache(Duration = 60, Location = ResponseCacheLocation.Any)]
public class SupportPublicController(RogAdminDbContext db) : ControllerBase
{
    [HttpGet("support-info")]
    public async Task<ActionResult<PublicSupportInfoDto>> GetSupportInfo(CancellationToken ct = default)
    {
        var centers = await db.ServiceCenters
            .AsNoTracking()
            .Where(s => s.IsActive)
            .OrderBy(s => s.SortOrder)
            .Select(s => new PublicServiceCenterDto(
                s.City,
                s.Name,
                s.Address,
                s.Phone,
                s.OperatingHours
            ))
            .ToListAsync(ct);

        var policies = await db.WarrantyPolicies
            .AsNoTracking()
            .Where(w => w.IsActive)
            .OrderBy(w => w.SortOrder)
            .Select(w => new PublicWarrantyPolicyDto(
                w.Title,
                w.Description
            ))
            .ToListAsync(ct);

        return Ok(new PublicSupportInfoDto(centers, policies));
    }

    [HttpGet("service-centers")]
    public async Task<ActionResult<IReadOnlyList<PublicServiceCenterDto>>> GetCenters(CancellationToken ct = default)
    {
        var centers = await db.ServiceCenters
            .AsNoTracking()
            .Where(s => s.IsActive)
            .OrderBy(s => s.SortOrder)
            .Select(s => new PublicServiceCenterDto(
                s.City,
                s.Name,
                s.Address,
                s.Phone,
                s.OperatingHours
            ))
            .ToListAsync(ct);

        return Ok(centers);
    }

    [HttpGet("warranty-policies")]
    public async Task<ActionResult<IReadOnlyList<PublicWarrantyPolicyDto>>> GetPolicies(CancellationToken ct = default)
    {
        var policies = await db.WarrantyPolicies
            .AsNoTracking()
            .Where(w => w.IsActive)
            .OrderBy(w => w.SortOrder)
            .Select(w => new PublicWarrantyPolicyDto(
                w.Title,
                w.Description
            ))
            .ToListAsync(ct);

        return Ok(policies);
    }
}
