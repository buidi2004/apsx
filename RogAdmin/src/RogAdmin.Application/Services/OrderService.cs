using Microsoft.EntityFrameworkCore;
using RogAdmin.Application.Common;
using RogAdmin.Application.Dtos.Commerce;
using RogAdmin.Application.Exceptions;
using RogAdmin.Application.Interfaces;
using RogAdmin.Domain.Entities;
using RogAdmin.Domain.Enums;

namespace RogAdmin.Application.Services;

public class OrderService(
    IRepository<Order> orderRepo,
    IRepository<Product> productRepo,
    IUnitOfWork unitOfWork) : IOrderService
{
    public async Task<OrderDto> CreateAsync(CreateOrderRequest request, int? customerId, CancellationToken ct = default)
    {
        if (request.Items is null || request.Items.Count == 0)
        {
            throw AppException.BadRequest("Giỏ hàng đang trống.");
        }
        if (request.Items.Count > 20)
        {
            throw AppException.BadRequest("Một đơn hàng chỉ được tối đa 20 sản phẩm.");
        }

        var order = new Order
        {
            OrderCode = await GenerateOrderCodeAsync(ct),
            CustomerId = customerId,
            CustomerName = request.CustomerName.Trim(),
            Email = request.Email.Trim().ToLowerInvariant(),
            Phone = request.Phone.Trim(),
            Address = request.Address.Trim(),
            Note = request.Note?.Trim() ?? string.Empty,
            Status = OrderStatus.Pending,
        };

        foreach (var line in request.Items)
        {
            var quantity = Math.Clamp(line.Quantity, 1, 10);
            var slug = NormalizeSlug(line.Slug);

            var product = await productRepo.Query()
                .AsNoTracking()
                .Include(p => p.Price)
                .FirstOrDefaultAsync(p => p.Slug == slug && p.IsActive, ct);

            long unitPrice;
            string productName;
            int? productId;

            if (product is not null)
            {
                productId = product.Id;
                productName = product.Name;
                unitPrice = (long)(product.Price?.Price ?? 0);
            }
            else
            {
                productId = null;
                productName = line.Name?.Trim() ?? string.Empty;
                unitPrice = line.UnitPrice ?? 0;
            }

            // Storefront có một số thẻ sản phẩm tĩnh chưa seed vào catalog.
            // Chỉ chấp nhận giá dự phòng khi client gửi kèm và giá đó hợp lệ.
            if (unitPrice <= 0)
            {
                throw AppException.BadRequest($"Sản phẩm '{productName}' chưa có giá bán.");
            }
            if (string.IsNullOrWhiteSpace(productName))
            {
                throw AppException.BadRequest("Thiếu tên sản phẩm trong giỏ hàng.");
            }

            order.Items.Add(new OrderItem
            {
                ProductId = productId,
                ProductSlug = slug,
                ProductName = productName,
                SelectedSpecs = line.SelectedSpecs?.Trim() ?? string.Empty,
                UnitPrice = unitPrice,
                Quantity = quantity,
                LineTotal = unitPrice * quantity,
            });
        }

        order.Subtotal = order.Items.Sum(i => i.LineTotal);
        order.ShippingFee = 0;
        order.Total = order.Subtotal + order.ShippingFee;

        await orderRepo.AddAsync(order, ct);
        await unitOfWork.SaveChangesAsync(ct);

        return ToDto(order);
    }

    public async Task<OrderDto?> GetByCodeAsync(string orderCode, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(orderCode))
        {
            return null;
        }

        var code = orderCode.Trim().ToUpperInvariant();
        var order = await orderRepo.Query()
            .AsNoTracking()
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.OrderCode == code, ct);

        return order is null ? null : ToDto(order);
    }

    public async Task<IReadOnlyList<OrderDto>> GetByCustomerAsync(int customerId, CancellationToken ct = default)
    {
        var orders = await orderRepo.Query()
            .AsNoTracking()
            .Include(o => o.Items)
            .Where(o => o.CustomerId == customerId)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync(ct);

        return orders.Select(ToDto).ToList();
    }

    public async Task<PagedResult<AdminOrderSummaryDto>> GetAdminOrdersAsync(
        string? search,
        OrderStatus? status,
        int page,
        int pageSize,
        CancellationToken ct = default)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        IQueryable<Order> query = orderRepo.Query().AsNoTracking().Include(o => o.Items);

        if (status.HasValue)
        {
            query = query.Where(o => o.Status == status.Value);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim().ToLowerInvariant();
            query = query.Where(o =>
                o.OrderCode.ToLower().Contains(s) ||
                o.CustomerName.ToLower().Contains(s) ||
                o.Phone.ToLower().Contains(s) ||
                o.Email.ToLower().Contains(s));
        }

        var total = await query.CountAsync(ct);
        var orders = await query
            .OrderByDescending(o => o.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        var items = orders.Select(o => new AdminOrderSummaryDto(
            o.Id,
            o.OrderCode,
            o.CustomerName,
            o.Email,
            o.Phone,
            o.Address,
            o.Total,
            o.Status.ToString(),
            StatusText(o.Status),
            o.Items.Count,
            o.CreatedAt
        )).ToList();

        return new PagedResult<AdminOrderSummaryDto>
        {
            Items = items,
            Page = page,
            PageSize = pageSize,
            TotalCount = total
        };
    }

    public async Task<AdminOrderDetailDto?> GetAdminOrderDetailAsync(int id, CancellationToken ct = default)
    {
        var order = await orderRepo.Query()
            .AsNoTracking()
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == id, ct);

        if (order is null) return null;

        return new AdminOrderDetailDto(
            order.Id,
            order.OrderCode,
            order.CustomerId,
            order.CustomerName,
            order.Email,
            order.Phone,
            order.Address,
            order.Note,
            order.Subtotal,
            order.ShippingFee,
            order.Total,
            order.Status.ToString(),
            StatusText(order.Status),
            order.CreatedAt,
            order.Items
                .OrderBy(i => i.Id)
                .Select(i => new OrderItemDto(
                    i.ProductId,
                    i.ProductSlug,
                    i.ProductName,
                    i.SelectedSpecs,
                    i.UnitPrice,
                    i.Quantity,
                    i.LineTotal))
                .ToList()
        );
    }

    public async Task<bool> UpdateOrderStatusAsync(int id, OrderStatus newStatus, CancellationToken ct = default)
    {
        var order = await orderRepo.GetByIdAsync(id, ct);
        if (order is null) return false;

        order.Status = newStatus;
        order.UpdatedAt = DateTime.UtcNow;
        orderRepo.Update(order);
        await unitOfWork.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> DeleteOrderAsync(int id, CancellationToken ct = default)
    {
        var order = await orderRepo.GetByIdAsync(id, ct);
        if (order is null) return false;

        orderRepo.Remove(order);
        await unitOfWork.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> CancelAsync(string orderCode, CancellationToken ct = default)
    {
        var order = await orderRepo.Query()
            .FirstOrDefaultAsync(o => o.OrderCode == orderCode, ct);
        if (order is null) return false;
        if (order.Status != OrderStatus.Pending) return false;

        order.Status = OrderStatus.Cancelled;
        order.UpdatedAt = DateTime.UtcNow;
        orderRepo.Update(order);
        await unitOfWork.SaveChangesAsync(ct);
        return true;
    }

    private async Task<string> GenerateOrderCodeAsync(CancellationToken ct)
    {
        for (var attempt = 0; attempt < 10; attempt++)
        {
            var suffix = Guid.NewGuid().ToString("N")[..6].ToUpperInvariant();
            var code = $"ROG-{DateTime.UtcNow:yyyyMMdd}-{suffix}";
            var exists = await orderRepo.Query().AnyAsync(o => o.OrderCode == code, ct);
            if (!exists)
            {
                return code;
            }
        }

        throw new InvalidOperationException("Không sinh được mã đơn hàng duy nhất.");
    }

    private static string NormalizeSlug(string slug)
    {
        var value = (slug ?? string.Empty).Trim().Trim('/');
        if (value.StartsWith("vn/", StringComparison.OrdinalIgnoreCase))
        {
            value = value[3..];
        }
        return value;
    }

    private static OrderDto ToDto(Order order) => new(
        order.OrderCode,
        order.CustomerName,
        order.Email,
        order.Phone,
        order.Address,
        order.Note,
        order.Subtotal,
        order.ShippingFee,
        order.Total,
        order.Status.ToString(),
        StatusText(order.Status),
        order.CreatedAt,
        order.Items
            .OrderBy(i => i.Id)
            .Select(i => new OrderItemDto(
                i.ProductId,
                i.ProductSlug,
                i.ProductName,
                i.SelectedSpecs,
                i.UnitPrice,
                i.Quantity,
                i.LineTotal))
            .ToList());

    private static string StatusText(OrderStatus status) => status switch
    {
        OrderStatus.Pending => "Chờ xác nhận",
        OrderStatus.Confirmed => "Đã xác nhận",
        OrderStatus.Shipping => "Đang giao hàng",
        OrderStatus.Completed => "Hoàn tất",
        OrderStatus.Cancelled => "Đã hủy",
        _ => "Không xác định",
    };
}
