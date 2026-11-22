using System.Text;
using Microsoft.EntityFrameworkCore;
using RogAdmin.Application.Dtos.Reports;
using RogAdmin.Application.Interfaces;
using RogAdmin.Domain.Entities;
using RogAdmin.Domain.Enums;

namespace RogAdmin.Application.Services;

public class ReportService(
    IRepository<Order> orderRepo,
    IRepository<OrderItem> orderItemRepo,
    IRepository<Product> productRepo,
    IRepository<ProductCategory> categoryRepo,
    IRepository<Customer> customerRepo,
    IRepository<WarrantyRecord> warrantyRepo) : IReportService
{
    public async Task<SalesSummaryDto> GetSalesSummaryAsync(DateTime? fromDate, DateTime? toDate, CancellationToken ct = default)
    {
        var query = orderRepo.Query().AsNoTracking();

        if (fromDate.HasValue)
        {
            var start = fromDate.Value.Date;
            query = query.Where(o => o.CreatedAt >= start);
        }

        if (toDate.HasValue)
        {
            var end = toDate.Value.Date.AddDays(1);
            query = query.Where(o => o.CreatedAt < end);
        }

        var orders = await query.ToListAsync(ct);

        var totalOrders = orders.Count;
        var completedOrders = orders.Count(o => o.Status == OrderStatus.Completed);
        var confirmedOrders = orders.Count(o => o.Status == OrderStatus.Confirmed);
        var shippingOrders = orders.Count(o => o.Status == OrderStatus.Shipping);
        var pendingOrders = orders.Count(o => o.Status == OrderStatus.Pending);
        var cancelledOrders = orders.Count(o => o.Status == OrderStatus.Cancelled);

        // Doanh thu hợp lệ: Completed + Confirmed + Shipping
        var validOrders = orders.Where(o => o.Status != OrderStatus.Cancelled && o.Status != OrderStatus.Pending).ToList();
        var totalRevenue = validOrders.Sum(o => o.Total);
        var completedRevenue = orders.Where(o => o.Status == OrderStatus.Completed).Sum(o => o.Total);
        var pendingRevenue = orders.Where(o => o.Status == OrderStatus.Pending).Sum(o => o.Total);

        var avgOrderValue = validOrders.Count > 0 ? totalRevenue / validOrders.Count : (orders.Count > 0 ? orders.Sum(o => o.Total) / orders.Count : 0);
        var cancellationRate = totalOrders > 0 ? Math.Round((double)cancelledOrders / totalOrders * 100, 1) : 0;

        // Daily revenue points (nhóm theo ngày định dạng yyyy-MM-dd)
        var dailyPoints = orders
            .Where(o => o.Status != OrderStatus.Cancelled)
            .GroupBy(o => o.CreatedAt.ToString("yyyy-MM-dd"))
            .OrderBy(g => g.Key)
            .Select(g => new DailyRevenuePointDto
            {
                Date = g.Key,
                Revenue = g.Sum(o => o.Total),
                OrderCount = g.Count()
            })
            .ToList();

        // Status breakdown
        var allStatuses = new[] { OrderStatus.Pending, OrderStatus.Confirmed, OrderStatus.Shipping, OrderStatus.Completed, OrderStatus.Cancelled };
        var breakdown = allStatuses.Select(st =>
        {
            var matched = orders.Where(o => o.Status == st).ToList();
            var count = matched.Count;
            var rev = matched.Sum(o => o.Total);
            var pct = totalOrders > 0 ? Math.Round((double)count / totalOrders * 100, 1) : 0;
            return new OrderStatusBreakdownDto
            {
                Status = st.ToString(),
                StatusText = StatusToVietnamese(st),
                Count = count,
                Revenue = rev,
                Percentage = pct
            };
        }).ToList();

        return new SalesSummaryDto
        {
            TotalRevenue = totalRevenue,
            CompletedRevenue = completedRevenue,
            PendingRevenue = pendingRevenue,
            TotalOrders = totalOrders,
            CompletedOrders = completedOrders,
            ConfirmedOrders = confirmedOrders,
            ShippingOrders = shippingOrders,
            PendingOrders = pendingOrders,
            CancelledOrders = cancelledOrders,
            AverageOrderValue = avgOrderValue,
            CancellationRate = cancellationRate,
            DailyRevenue = dailyPoints,
            StatusBreakdown = breakdown
        };
    }

    public async Task<List<TopProductReportDto>> GetTopProductsAsync(int limit = 10, DateTime? fromDate = null, DateTime? toDate = null, CancellationToken ct = default)
    {
        var itemQuery = orderItemRepo.Query().AsNoTracking().Include(i => i.Order).AsQueryable();

        // Chỉ tính các đơn không bị huỷ
        itemQuery = itemQuery.Where(i => i.Order.Status != OrderStatus.Cancelled);

        if (fromDate.HasValue)
        {
            var start = fromDate.Value.Date;
            itemQuery = itemQuery.Where(i => i.Order.CreatedAt >= start);
        }
        if (toDate.HasValue)
        {
            var end = toDate.Value.Date.AddDays(1);
            itemQuery = itemQuery.Where(i => i.Order.CreatedAt < end);
        }

        var items = await itemQuery.ToListAsync(ct);

        var grouped = items
            .GroupBy(i => i.ProductSlug)
            .Select(g => new
            {
                Slug = g.Key,
                ProductName = g.First().ProductName,
                ProductId = g.First().ProductId,
                QuantitySold = g.Sum(x => x.Quantity),
                TotalRevenue = g.Sum(x => x.LineTotal)
            })
            .OrderByDescending(x => x.TotalRevenue)
            .Take(Math.Clamp(limit, 1, 50))
            .ToList();

        // Lấy danh sách sản phẩm thực tế từ kho để làm giàu dữ liệu (giá hiện tại, tình trạng kho, danh mục)
        var allSlugs = grouped.Select(g => g.Slug).ToList();
        var catalogProducts = await productRepo.Query()
            .AsNoTracking()
            .Include(p => p.Price)
            .Where(p => allSlugs.Contains(p.Slug))
            .ToDictionaryAsync(p => p.Slug, ct);

        var result = new List<TopProductReportDto>();
        foreach (var g in grouped)
        {
            catalogProducts.TryGetValue(g.Slug, out var prod);

            result.Add(new TopProductReportDto
            {
                ProductId = g.ProductId ?? prod?.Id,
                Slug = g.Slug,
                Name = prod?.Name ?? g.ProductName,
                CategorySlug = prod?.CategorySlug ?? string.Empty,
                QuantitySold = g.QuantitySold,
                TotalRevenue = g.TotalRevenue,
                CurrentPrice = prod?.Price?.Price ?? (g.QuantitySold > 0 ? g.TotalRevenue / g.QuantitySold : 0),
                StockStatus = prod?.Price?.StockStatus.ToString() ?? "InStock"
            });
        }

        return result;
    }

    public async Task<InventoryReportDto> GetInventoryReportAsync(CancellationToken ct = default)
    {
        var products = await productRepo.Query()
            .AsNoTracking()
            .Include(p => p.Price)
            .ToListAsync(ct);

        var categories = await categoryRepo.Query().AsNoTracking().ToListAsync(ct);
        var catNameDict = categories.ToDictionary(c => c.Label.ToLowerInvariant(), c => c.Label);

        var total = products.Count;
        var inStock = products.Count(p => p.Price != null && p.Price.StockStatus == StockStatus.InStock);
        var outOfStock = products.Count(p => p.Price != null && p.Price.StockStatus == StockStatus.OutOfStock);
        var preOrder = products.Count(p => p.Price != null && p.Price.StockStatus == StockStatus.PreOrder);
        var inactive = products.Count(p => !p.IsActive);

        var catBreakdown = products
            .GroupBy(p => p.CategorySlug ?? "other")
            .Select(g => new CategoryStockDto
            {
                CategorySlug = g.Key,
                CategoryName = catNameDict.TryGetValue(g.Key.ToLowerInvariant(), out var name) ? name : g.Key,
                TotalProducts = g.Count(),
                InStockProducts = g.Count(p => p.Price != null && p.Price.StockStatus == StockStatus.InStock)
            })
            .OrderByDescending(c => c.TotalProducts)
            .ToList();

        var outOfStockList = products
            .Where(p => (p.Price != null && p.Price.StockStatus == StockStatus.OutOfStock) || !p.IsActive)
            .Select(p => new ProductStockItemDto
            {
                Id = p.Id,
                Name = p.Name,
                Slug = p.Slug,
                ModelCode = p.ModelCode,
                Price = p.Price?.Price ?? 0,
                StockStatus = !p.IsActive ? "Ngừng kinh doanh" : (p.Price?.StockStatus.ToString() ?? "Hết hàng")
            })
            .ToList();

        return new InventoryReportDto
        {
            TotalProducts = total,
            InStockCount = inStock,
            OutOfStockCount = outOfStock,
            PreOrderCount = preOrder,
            InactiveCount = inactive,
            CategoryBreakdown = catBreakdown,
            OutOfStockProducts = outOfStockList
        };
    }

    public async Task<WarrantyReportDto> GetWarrantyReportAsync(CancellationToken ct = default)
    {
        var records = await warrantyRepo.Query().AsNoTracking().ToListAsync(ct);

        var now = DateTime.UtcNow;
        var in60Days = now.AddDays(60);

        var total = records.Count;
        var active = records.Count(r => r.Status == WarrantyStatus.Active);
        var expired = records.Count(r => r.Status == WarrantyStatus.Expired);
        var inService = records.Count(r => r.Status == WarrantyStatus.InService);

        // Sắp hết hạn trong 60 ngày tới
        var expiringSoon = records
            .Where(r => r.Status == WarrantyStatus.Active && r.ExpiryDate <= in60Days && r.ExpiryDate >= now)
            .OrderBy(r => r.ExpiryDate)
            .Select(r => new ExpiringWarrantyItemDto
            {
                Id = r.Id,
                SerialNumber = r.SerialNumber,
                ProductModel = r.ProductModel,
                PurchaseDate = r.PurchaseDate,
                ExpiryDate = r.ExpiryDate,
                DaysRemaining = Math.Max(0, (int)(r.ExpiryDate - now).TotalDays),
                ServiceCenter = r.ServiceCenter
            })
            .ToList();

        var byCenter = records
            .GroupBy(r => string.IsNullOrWhiteSpace(r.ServiceCenter) ? "Chưa chỉ định" : r.ServiceCenter)
            .Select(g => new WarrantyCenterCountDto { CenterName = g.Key, Count = g.Count() })
            .OrderByDescending(x => x.Count)
            .ToList();

        var topModels = records
            .GroupBy(r => string.IsNullOrWhiteSpace(r.ProductModel) ? "Model không xác định" : r.ProductModel)
            .Select(g => new WarrantyModelCountDto { ModelName = g.Key, Count = g.Count() })
            .OrderByDescending(x => x.Count)
            .Take(10)
            .ToList();

        return new WarrantyReportDto
        {
            TotalRecords = total,
            ActiveCount = active,
            ExpiredCount = expired,
            InServiceCount = inService,
            ExpiringSoonCount = expiringSoon.Count,
            ByServiceCenter = byCenter,
            TopModels = topModels,
            ExpiringSoonList = expiringSoon
        };
    }

    public async Task<CustomerAnalyticsDto> GetCustomerAnalyticsAsync(CancellationToken ct = default)
    {
        var customers = await customerRepo.Query().AsNoTracking().ToListAsync(ct);
        var orders = await orderRepo.Query().AsNoTracking().Where(o => o.CustomerId != null && o.Status != OrderStatus.Cancelled).ToListAsync(ct);

        var total = customers.Count;
        var active = customers.Count(c => c.IsActive);
        var pointsIssued = customers.Sum(c => c.Points);

        var tierBreakdown = customers
            .GroupBy(c => c.Tier.ToString())
            .Select(g => new CustomerTierBreakdownDto { Tier = g.Key, Count = g.Count() })
            .OrderByDescending(t => t.Count)
            .ToList();

        var customerSpending = orders
            .GroupBy(o => o.CustomerId!.Value)
            .ToDictionary(g => g.Key, g => new { OrderCount = g.Count(), TotalSpent = g.Sum(x => x.Total) });

        var topCustomers = customers
            .Select(c =>
            {
                customerSpending.TryGetValue(c.Id, out var spend);
                return new TopCustomerDto
                {
                    CustomerId = c.Id,
                    FullName = c.FullName,
                    Email = c.Email,
                    PhoneNumber = c.PhoneNumber,
                    Tier = c.Tier.ToString(),
                    Points = c.Points,
                    OrderCount = spend?.OrderCount ?? 0,
                    TotalSpent = spend?.TotalSpent ?? 0
                };
            })
            .OrderByDescending(c => c.TotalSpent)
            .ThenByDescending(c => c.Points)
            .Take(20)
            .ToList();

        return new CustomerAnalyticsDto
        {
            TotalCustomers = total,
            ActiveCustomers = active,
            TotalPointsIssued = pointsIssued,
            TierBreakdown = tierBreakdown,
            TopCustomers = topCustomers
        };
    }

    public async Task<byte[]> ExportSalesCsvAsync(DateTime? fromDate, DateTime? toDate, CancellationToken ct = default)
    {
        var query = orderRepo.Query().AsNoTracking().Include(o => o.Items).AsQueryable();

        if (fromDate.HasValue)
        {
            var start = fromDate.Value.Date;
            query = query.Where(o => o.CreatedAt >= start);
        }
        if (toDate.HasValue)
        {
            var end = toDate.Value.Date.AddDays(1);
            query = query.Where(o => o.CreatedAt < end);
        }

        var orders = await query.OrderByDescending(o => o.CreatedAt).ToListAsync(ct);

        var sb = new StringBuilder();
        sb.AppendLine("Mã đơn hàng,Ngày đặt,Tên khách hàng,Email,Số điện thoại,Địa chỉ,Trạng thái,Số lượng mặt hàng,Tổng tiền (VND)");

        foreach (var o in orders)
        {
            var dateStr = o.CreatedAt.ToString("yyyy-MM-dd HH:mm:ss");
            var statusStr = StatusToVietnamese(o.Status);
            var itemsCount = o.Items.Sum(i => i.Quantity);
            sb.AppendLine($"\"{EscapeCsv(o.OrderCode)}\",\"{dateStr}\",\"{EscapeCsv(o.CustomerName)}\",\"{EscapeCsv(o.Email)}\",\"{EscapeCsv(o.Phone)}\",\"{EscapeCsv(o.Address)}\",\"{statusStr}\",{itemsCount},{o.Total}");
        }

        return Encoding.UTF8.GetPreamble().Concat(Encoding.UTF8.GetBytes(sb.ToString())).ToArray();
    }

    public async Task<byte[]> ExportInventoryCsvAsync(CancellationToken ct = default)
    {
        var products = await productRepo.Query()
            .AsNoTracking()
            .Include(p => p.Price)
            .OrderBy(p => p.CategorySlug)
            .ThenBy(p => p.Name)
            .ToListAsync(ct);

        var sb = new StringBuilder();
        sb.AppendLine("ID,Tên sản phẩm,Mã Model,Slug,Danh mục,Tình trạng kho,Giá bán (VND),Giá niêm yết (VND),Đang kinh doanh");

        foreach (var p in products)
        {
            var stockStr = p.Price?.StockStatus.ToString() ?? "N/A";
            var price = p.Price?.Price ?? 0;
            var oldPrice = p.Price?.OldPrice ?? 0;
            var activeStr = p.IsActive ? "Có" : "Không";
            sb.AppendLine($"{p.Id},\"{EscapeCsv(p.Name)}\",\"{EscapeCsv(p.ModelCode)}\",\"{EscapeCsv(p.Slug)}\",\"{EscapeCsv(p.CategorySlug)}\",\"{stockStr}\",{price},{oldPrice},\"{activeStr}\"");
        }

        return Encoding.UTF8.GetPreamble().Concat(Encoding.UTF8.GetBytes(sb.ToString())).ToArray();
    }

    public async Task<byte[]> ExportWarrantyCsvAsync(CancellationToken ct = default)
    {
        var records = await warrantyRepo.Query()
            .AsNoTracking()
            .OrderByDescending(r => r.PurchaseDate)
            .ToListAsync(ct);

        var sb = new StringBuilder();
        sb.AppendLine("ID,Số Serial,Model máy,Ngày mua,Ngày hết hạn,Trạng thái,Trung tâm bảo hành");

        foreach (var r in records)
        {
            var buyDate = r.PurchaseDate.ToString("yyyy-MM-dd");
            var expDate = r.ExpiryDate.ToString("yyyy-MM-dd");
            sb.AppendLine($"{r.Id},\"{EscapeCsv(r.SerialNumber)}\",\"{EscapeCsv(r.ProductModel)}\",\"{buyDate}\",\"{expDate}\",\"{r.Status}\",\"{EscapeCsv(r.ServiceCenter)}\"");
        }

        return Encoding.UTF8.GetPreamble().Concat(Encoding.UTF8.GetBytes(sb.ToString())).ToArray();
    }

    private static string StatusToVietnamese(OrderStatus status) => status switch
    {
        OrderStatus.Pending => "Chờ xác nhận",
        OrderStatus.Confirmed => "Đã xác nhận",
        OrderStatus.Shipping => "Đang giao hàng",
        OrderStatus.Completed => "Hoàn tất",
        OrderStatus.Cancelled => "Đã hủy",
        _ => status.ToString()
    };

    private static string EscapeCsv(string? input) => (input ?? string.Empty).Replace("\"", "\"\"");
}
