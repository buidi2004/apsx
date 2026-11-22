using RogAdmin.Domain.Enums;

namespace RogAdmin.Application.Dtos.Reports;

public class SalesSummaryDto
{
    public long TotalRevenue { get; set; }
    public long CompletedRevenue { get; set; }
    public long PendingRevenue { get; set; }
    public int TotalOrders { get; set; }
    public int CompletedOrders { get; set; }
    public int ConfirmedOrders { get; set; }
    public int ShippingOrders { get; set; }
    public int PendingOrders { get; set; }
    public int CancelledOrders { get; set; }
    public long AverageOrderValue { get; set; }
    public double CancellationRate { get; set; }
    public List<DailyRevenuePointDto> DailyRevenue { get; set; } = new();
    public List<OrderStatusBreakdownDto> StatusBreakdown { get; set; } = new();
}

public class DailyRevenuePointDto
{
    public string Date { get; set; } = string.Empty;
    public long Revenue { get; set; }
    public int OrderCount { get; set; }
}

public class OrderStatusBreakdownDto
{
    public string Status { get; set; } = string.Empty;
    public string StatusText { get; set; } = string.Empty;
    public int Count { get; set; }
    public long Revenue { get; set; }
    public double Percentage { get; set; }
}

public class TopProductReportDto
{
    public int? ProductId { get; set; }
    public string Slug { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string CategorySlug { get; set; } = string.Empty;
    public int QuantitySold { get; set; }
    public long TotalRevenue { get; set; }
    public decimal CurrentPrice { get; set; }
    public string StockStatus { get; set; } = string.Empty;
}

public class InventoryReportDto
{
    public int TotalProducts { get; set; }
    public int InStockCount { get; set; }
    public int OutOfStockCount { get; set; }
    public int PreOrderCount { get; set; }
    public int InactiveCount { get; set; }
    public List<CategoryStockDto> CategoryBreakdown { get; set; } = new();
    public List<ProductStockItemDto> OutOfStockProducts { get; set; } = new();
}

public class CategoryStockDto
{
    public string CategorySlug { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public int TotalProducts { get; set; }
    public int InStockProducts { get; set; }
}

public class ProductStockItemDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string ModelCode { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string StockStatus { get; set; } = string.Empty;
}

public class WarrantyReportDto
{
    public int TotalRecords { get; set; }
    public int ActiveCount { get; set; }
    public int ExpiredCount { get; set; }
    public int InServiceCount { get; set; }
    public int ExpiringSoonCount { get; set; }
    public List<WarrantyCenterCountDto> ByServiceCenter { get; set; } = new();
    public List<WarrantyModelCountDto> TopModels { get; set; } = new();
    public List<ExpiringWarrantyItemDto> ExpiringSoonList { get; set; } = new();
}

public class WarrantyCenterCountDto
{
    public string CenterName { get; set; } = string.Empty;
    public int Count { get; set; }
}

public class WarrantyModelCountDto
{
    public string ModelName { get; set; } = string.Empty;
    public int Count { get; set; }
}

public class ExpiringWarrantyItemDto
{
    public int Id { get; set; }
    public string SerialNumber { get; set; } = string.Empty;
    public string ProductModel { get; set; } = string.Empty;
    public DateTime PurchaseDate { get; set; }
    public DateTime ExpiryDate { get; set; }
    public int DaysRemaining { get; set; }
    public string ServiceCenter { get; set; } = string.Empty;
}

public class CustomerAnalyticsDto
{
    public int TotalCustomers { get; set; }
    public int ActiveCustomers { get; set; }
    public int TotalPointsIssued { get; set; }
    public List<CustomerTierBreakdownDto> TierBreakdown { get; set; } = new();
    public List<TopCustomerDto> TopCustomers { get; set; } = new();
}

public class CustomerTierBreakdownDto
{
    public string Tier { get; set; } = string.Empty;
    public int Count { get; set; }
}

public class TopCustomerDto
{
    public int CustomerId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Tier { get; set; } = string.Empty;
    public int Points { get; set; }
    public int OrderCount { get; set; }
    public long TotalSpent { get; set; }
}
