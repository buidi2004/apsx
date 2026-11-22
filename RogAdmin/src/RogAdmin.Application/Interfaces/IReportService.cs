using RogAdmin.Application.Dtos.Reports;

namespace RogAdmin.Application.Interfaces;

public interface IReportService
{
    Task<SalesSummaryDto> GetSalesSummaryAsync(DateTime? fromDate, DateTime? toDate, CancellationToken ct = default);
    Task<List<TopProductReportDto>> GetTopProductsAsync(int limit = 10, DateTime? fromDate = null, DateTime? toDate = null, CancellationToken ct = default);
    Task<InventoryReportDto> GetInventoryReportAsync(CancellationToken ct = default);
    Task<WarrantyReportDto> GetWarrantyReportAsync(CancellationToken ct = default);
    Task<CustomerAnalyticsDto> GetCustomerAnalyticsAsync(CancellationToken ct = default);
    Task<byte[]> ExportSalesCsvAsync(DateTime? fromDate, DateTime? toDate, CancellationToken ct = default);
    Task<byte[]> ExportInventoryCsvAsync(CancellationToken ct = default);
    Task<byte[]> ExportWarrantyCsvAsync(CancellationToken ct = default);
}
