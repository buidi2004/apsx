using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RogAdmin.Application.Dtos.Commerce;
using RogAdmin.Application.Interfaces;

namespace RogAdmin.Api.Controllers.Public;

[ApiController]
[Route("api/public/orders")]
public class OrdersController(IOrderService orderService) : ControllerBase
{
    /// <summary>Tạo đơn hàng từ storefront. Khách vãng lai không cần đăng nhập;
    /// nếu có Bearer token của khách hàng thì đơn được gắn vào tài khoản.</summary>
    [HttpPost]
    [AllowAnonymous]
    [ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
    public async Task<ActionResult<CreateOrderResponse>> Create(
        [FromBody] CreateOrderRequest request,
        CancellationToken ct)
    {
        var order = await orderService.CreateAsync(request, GetCustomerId(), ct);
        return StatusCode(StatusCodes.Status201Created, new CreateOrderResponse(
            order.OrderCode,
            order.Total,
            order.Status,
            order.CreatedAt));
    }

    /// <summary>Danh sách đơn hàng của khách hàng đang đăng nhập.</summary>
    [HttpGet("mine")]
    [Authorize(Roles = "Customer")]
    [ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
    public async Task<ActionResult<IReadOnlyList<OrderDto>>> Mine(CancellationToken ct)
    {
        var customerId = GetCustomerId();
        if (customerId is null)
        {
            return Unauthorized();
        }

        return Ok(await orderService.GetByCustomerAsync(customerId.Value, ct));
    }

    /// <summary>Tra cứu đơn hàng theo mã (mã đủ dài và ngẫu nhiên).</summary>
    [HttpGet("{code}")]
    [AllowAnonymous]
    [ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
    public async Task<ActionResult<OrderDto>> GetByCode(string code, CancellationToken ct)
    {
        var order = await orderService.GetByCodeAsync(code, ct);
        return order is null ? NotFound(new { message = "Không tìm thấy đơn hàng." }) : Ok(order);
    }

    /// <summary>Khách hàng hủy đơn hàng (chỉ hủy được khi trạng thái là Pending).</summary>
    [HttpPut("{code}/cancel")]
    [AllowAnonymous]
    [ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
    public async Task<IActionResult> Cancel(string code, CancellationToken ct)
    {
        var success = await orderService.CancelAsync(code, ct);
        if (!success)
        {
            return BadRequest(new { message = "Không thể hủy đơn hàng này. Đơn hàng chỉ có thể hủy khi đang ở trạng thái 'Chờ xác nhận'." });
        }
        return Ok(new { success = true, message = "Đã hủy đơn hàng thành công." });
    }

    private int? GetCustomerId()
    {
        if (User.Identity?.IsAuthenticated != true || !User.IsInRole("Customer"))
        {
            return null;
        }

        var raw = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(raw, out var id) ? id : null;
    }
}
