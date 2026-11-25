using System.ComponentModel.DataAnnotations;

namespace RogAdmin.Application.Dtos.Commerce;

public sealed class CreateOrderItemRequest
{
    [Required(ErrorMessage = "Thiếu slug sản phẩm.")]
    public string Slug { get; set; } = string.Empty;

    [Range(1, 10, ErrorMessage = "Số lượng mỗi sản phẩm phải từ 1 đến 10.")]
    public int Quantity { get; set; } = 1;

    public string? SelectedSpecs { get; set; }

    /// <summary>Tên dự phòng khi sản phẩm chưa có trong catalog DB (storefront tĩnh).</summary>
    public string? Name { get; set; }

    /// <summary>Giá dự phòng (VND) khi sản phẩm chưa có trong catalog DB.</summary>
    public long? UnitPrice { get; set; }
}

public sealed class CreateOrderRequest
{
    [Required(ErrorMessage = "Vui lòng nhập họ tên.")]
    [MaxLength(150)]
    public string CustomerName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Vui lòng nhập email.")]
    [EmailAddress(ErrorMessage = "Email không hợp lệ.")]
    [MaxLength(150)]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Vui lòng nhập số điện thoại.")]
    [RegularExpression(@"^0\d{9,10}$", ErrorMessage = "Số điện thoại phải bắt đầu bằng 0 và có 10-11 chữ số.")]
    public string Phone { get; set; } = string.Empty;

    [Required(ErrorMessage = "Vui lòng nhập địa chỉ giao hàng.")]
    [MaxLength(500)]
    public string Address { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? Note { get; set; }

    [MaxLength(50)]
    public string? CouponCode { get; set; }

    [MinLength(1, ErrorMessage = "Giỏ hàng đang trống.")]
    public List<CreateOrderItemRequest> Items { get; set; } = new();
}

public sealed record OrderItemDto(
    int? ProductId,
    string ProductSlug,
    string ProductName,
    string SelectedSpecs,
    long UnitPrice,
    int Quantity,
    long LineTotal);

public sealed record OrderDto(
    string OrderCode,
    string CustomerName,
    string Email,
    string Phone,
    string Address,
    string Note,
    long Subtotal,
    long ShippingFee,
    long Total,
    string Status,
    string StatusText,
    DateTime CreatedAt,
    IReadOnlyList<OrderItemDto> Items,
    string ShippingCarrier = "",
    string TrackingNumber = "",
    string? CouponCode = null,
    long DiscountAmount = 0);

public sealed record CreateOrderResponse(
    string OrderCode,
    long Total,
    string Status,
    DateTime CreatedAt);

public sealed class CustomerRegisterRequest
{
    [Required(ErrorMessage = "Vui lòng nhập email.")]
    [EmailAddress(ErrorMessage = "Email không hợp lệ.")]
    [MaxLength(150)]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Vui lòng nhập họ tên.")]
    [MaxLength(150)]
    public string FullName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Vui lòng nhập số điện thoại.")]
    [RegularExpression(@"^0\d{9,10}$", ErrorMessage = "Số điện thoại phải bắt đầu bằng 0 và có 10-11 chữ số.")]
    public string PhoneNumber { get; set; } = string.Empty;

    [Required(ErrorMessage = "Vui lòng nhập mật khẩu.")]
    [MinLength(6, ErrorMessage = "Mật khẩu phải có ít nhất 6 ký tự.")]
    public string Password { get; set; } = string.Empty;
}

public sealed class CustomerLoginRequest
{
    [Required(ErrorMessage = "Vui lòng nhập email.")]
    [EmailAddress(ErrorMessage = "Email không hợp lệ.")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Vui lòng nhập mật khẩu.")]
    public string Password { get; set; } = string.Empty;
}

public sealed record CustomerProfileDto(
    int Id,
    string Email,
    string FullName,
    string PhoneNumber,
    string Tier,
    int Points,
    int OrderCount);

public sealed record CustomerAuthResponse(
    string Token,
    DateTime ExpiresAtUtc,
    CustomerProfileDto User);

public sealed record AdminOrderSummaryDto(
    int Id,
    string OrderCode,
    string CustomerName,
    string Email,
    string Phone,
    string Address,
    long Total,
    string Status,
    string StatusText,
    int ItemsCount,
    DateTime CreatedAt,
    string ShippingCarrier = "",
    string TrackingNumber = "");

public sealed record AdminOrderDetailDto(
    int Id,
    string OrderCode,
    int? CustomerId,
    string CustomerName,
    string Email,
    string Phone,
    string Address,
    string Note,
    long Subtotal,
    long ShippingFee,
    long Total,
    string Status,
    string StatusText,
    DateTime CreatedAt,
    IReadOnlyList<OrderItemDto> Items,
    string ShippingCarrier = "",
    string TrackingNumber = "",
    string? InternalNotes = null,
    string? CouponCode = null,
    long DiscountAmount = 0);

public sealed class UpdateOrderStatusRequest
{
    [Required]
    public string Status { get; set; } = string.Empty;
    public string? ShippingCarrier { get; set; }
    public string? TrackingNumber { get; set; }
    public string? InternalNotes { get; set; }
}

public sealed record UpdateOrderShippingRequest(
    string? ShippingCarrier,
    string? TrackingNumber,
    string? InternalNotes
);

public sealed record CustomerOrderSummaryDto(
    int Id,
    string OrderCode,
    DateTime CreatedAt,
    long Total,
    string Status,
    string StatusText,
    int ItemsCount,
    string ShippingCarrier,
    string TrackingNumber
);

public sealed record CustomerDetailWithOrdersDto(
    int Id,
    string Email,
    string FullName,
    string PhoneNumber,
    string Tier,
    int Points,
    bool IsActive,
    long TotalSpent,
    int OrderCount,
    IReadOnlyList<CustomerOrderSummaryDto> Orders
);
