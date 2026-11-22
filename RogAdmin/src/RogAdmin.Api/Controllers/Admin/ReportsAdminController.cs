using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RogAdmin.Application.Dtos.Reports;
using RogAdmin.Application.Interfaces;

namespace RogAdmin.Api.Controllers.Admin;

[ApiController]
[Route("api/admin/reports")]
[Authorize(Roles = "Admin,Editor")]
public class ReportsAdminController(IReportService reportService, IAuditLogService auditLog) : ControllerBase
{
    [HttpGet("sales-summary")]
    public async Task<ActionResult<SalesSummaryDto>> GetSalesSummary(
        [FromQuery] DateTime? fromDate,
        [FromQuery] DateTime? toDate,
        CancellationToken ct = default)
    {
        return Ok(await reportService.GetSalesSummaryAsync(fromDate, toDate, ct));
    }

    [HttpGet("top-products")]
    public async Task<ActionResult<List<TopProductReportDto>>> GetTopProducts(
        [FromQuery] int limit = 10,
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null,
        CancellationToken ct = default)
    {
        return Ok(await reportService.GetTopProductsAsync(limit, fromDate, toDate, ct));
    }

    [HttpGet("inventory")]
    public async Task<ActionResult<InventoryReportDto>> GetInventory(CancellationToken ct = default)
    {
        return Ok(await reportService.GetInventoryReportAsync(ct));
    }

    [HttpGet("warranty")]
    public async Task<ActionResult<WarrantyReportDto>> GetWarranty(CancellationToken ct = default)
    {
        return Ok(await reportService.GetWarrantyReportAsync(ct));
    }

    [HttpGet("customers")]
    public async Task<ActionResult<CustomerAnalyticsDto>> GetCustomers(CancellationToken ct = default)
    {
        return Ok(await reportService.GetCustomerAnalyticsAsync(ct));
    }

    [HttpGet("export/sales-csv")]
    public async Task<IActionResult> ExportSalesCsv(
        [FromQuery] DateTime? fromDate,
        [FromQuery] DateTime? toDate,
        CancellationToken ct = default)
    {
        var bytes = await reportService.ExportSalesCsvAsync(fromDate, toDate, ct);
        var username = User.Identity?.Name ?? "Admin";
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        await auditLog.LogAsync(username, "EXPORT_SALES_REPORT", "Report", null, $"Xuất báo cáo doanh thu ra CSV ({bytes.Length / 1024} KB)", ip, ct);

        var filename = $"rog_sales_report_{DateTime.UtcNow:yyyyMMdd_HHmm}.csv";
        return File(bytes, "text/csv", filename);
    }

    [HttpGet("export/inventory-csv")]
    public async Task<IActionResult> ExportInventoryCsv(CancellationToken ct = default)
    {
        var bytes = await reportService.ExportInventoryCsvAsync(ct);
        var username = User.Identity?.Name ?? "Admin";
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        await auditLog.LogAsync(username, "EXPORT_INVENTORY_REPORT", "Report", null, $"Xuất báo cáo tồn kho ra CSV ({bytes.Length / 1024} KB)", ip, ct);

        var filename = $"rog_inventory_report_{DateTime.UtcNow:yyyyMMdd_HHmm}.csv";
        return File(bytes, "text/csv", filename);
    }

    [HttpGet("export/warranty-csv")]
    public async Task<IActionResult> ExportWarrantyCsv(CancellationToken ct = default)
    {
        var bytes = await reportService.ExportWarrantyCsvAsync(ct);
        var username = User.Identity?.Name ?? "Admin";
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        await auditLog.LogAsync(username, "EXPORT_WARRANTY_REPORT", "Report", null, $"Xuất báo cáo bảo hành ra CSV ({bytes.Length / 1024} KB)", ip, ct);

        var filename = $"rog_warranty_report_{DateTime.UtcNow:yyyyMMdd_HHmm}.csv";
        return File(bytes, "text/csv", filename);
    }
}
