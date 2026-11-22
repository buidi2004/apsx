using RogAdmin.Application.Common;
using RogAdmin.Application.Dtos.Commerce;
using RogAdmin.Domain.Enums;

namespace RogAdmin.Application.Interfaces;

public interface IOrderService
{
    Task<OrderDto> CreateAsync(CreateOrderRequest request, int? customerId, CancellationToken ct = default);
    Task<OrderDto?> GetByCodeAsync(string orderCode, CancellationToken ct = default);
    Task<IReadOnlyList<OrderDto>> GetByCustomerAsync(int customerId, CancellationToken ct = default);
    Task<PagedResult<AdminOrderSummaryDto>> GetAdminOrdersAsync(string? search, OrderStatus? status, int page, int pageSize, CancellationToken ct = default);
    Task<AdminOrderDetailDto?> GetAdminOrderDetailAsync(int id, CancellationToken ct = default);
    Task<bool> UpdateOrderStatusAsync(int id, OrderStatus newStatus, CancellationToken ct = default);
    Task<bool> DeleteOrderAsync(int id, CancellationToken ct = default);
    Task<bool> CancelAsync(string orderCode, CancellationToken ct = default);
}

public interface ICustomerAuthService
{
    Task<CustomerAuthResponse> RegisterAsync(CustomerRegisterRequest request, CancellationToken ct = default);
    Task<CustomerAuthResponse> LoginAsync(CustomerLoginRequest request, CancellationToken ct = default);
    Task<CustomerProfileDto> GetProfileAsync(int customerId, CancellationToken ct = default);
    Task<bool> ChangePasswordAsync(int customerId, string oldPassword, string newPassword, CancellationToken ct = default);
    Task<CustomerProfileDto> UpdateProfileAsync(int customerId, string fullName, string phoneNumber, CancellationToken ct = default);
}
