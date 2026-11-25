using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RogAdmin.Application.Common;
using RogAdmin.Application.Dtos.Commerce;
using RogAdmin.Application.Interfaces;
using RogAdmin.Domain.Enums;

namespace RogAdmin.Api.Controllers.Admin;

[ApiController]
[Route("api/admin/orders")]
[Authorize(Roles = "Admin,Editor")]
public class OrdersAdminController(IOrderService orderService, IAuditLogService auditLog) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PagedResult<AdminOrderSummaryDto>>> GetPaged(
        [FromQuery] string? search,
        [FromQuery] OrderStatus? status,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 15,
        CancellationToken ct = default)
    {
        return Ok(await orderService.GetAdminOrdersAsync(search, status, page, pageSize, ct));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<AdminOrderDetailDto>> GetById(int id, CancellationToken ct = default)
    {
        var order = await orderService.GetAdminOrderDetailAsync(id, ct);
        return order is null ? NotFound(new { message = $"Không tìm thấy đơn hàng #{id}" }) : Ok(order);
    }

    [HttpPut("{id:int}/status")]
    public async Task<IActionResult> UpdateStatus(
        int id,
        [FromBody] UpdateOrderStatusRequest request,
        CancellationToken ct = default)
    {
        if (!Enum.TryParse<OrderStatus>(request.Status, true, out var newStatus))
        {
            return BadRequest(new { message = "Trạng thái đơn hàng không hợp lệ. Cho phép: Pending, Confirmed, Shipping, Completed, Cancelled." });
        }

        var success = await orderService.UpdateOrderStatusAsync(
            id,
            newStatus,
            request.ShippingCarrier,
            request.TrackingNumber,
            request.InternalNotes,
            ct);

        if (!success)
        {
            return NotFound(new { message = $"Không tìm thấy đơn hàng #{id}" });
        }

        var username = User.Identity?.Name ?? "Admin";
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        await auditLog.LogAsync(username, "UPDATE_ORDER_STATUS", "Order", id.ToString(), $"Đổi trạng thái đơn hàng sang: {newStatus}. Vận chuyển: {request.ShippingCarrier} ({request.TrackingNumber})", ip, ct);

        return Ok(new { success = true, status = newStatus.ToString() });
    }

    [HttpPut("{id:int}/shipping")]
    public async Task<IActionResult> UpdateShipping(
        int id,
        [FromBody] UpdateOrderShippingRequest request,
        CancellationToken ct = default)
    {
        var success = await orderService.UpdateOrderShippingAsync(id, request.ShippingCarrier, request.TrackingNumber, request.InternalNotes, ct);
        if (!success)
        {
            return NotFound(new { message = $"Không tìm thấy đơn hàng #{id}" });
        }

        var username = User.Identity?.Name ?? "Admin";
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        await auditLog.LogAsync(username, "UPDATE_ORDER_SHIPPING", "Order", id.ToString(), $"Cập nhật vận đơn: Hãng={request.ShippingCarrier}, Vận đơn={request.TrackingNumber}", ip, ct);

        return Ok(new { success = true, carrier = request.ShippingCarrier, tracking = request.TrackingNumber });
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct = default)
    {
        var success = await orderService.DeleteOrderAsync(id, ct);
        if (!success)
        {
            return NotFound(new { message = $"Không tìm thấy đơn hàng #{id}" });
        }

        var username = User.Identity?.Name ?? "Admin";
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        await auditLog.LogAsync(username, "DELETE_ORDER", "Order", id.ToString(), $"Xóa đơn hàng #{id}", ip, ct);

        return NoContent();
    }
}
