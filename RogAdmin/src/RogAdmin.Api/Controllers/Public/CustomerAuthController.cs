using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using RogAdmin.Application.Dtos.Commerce;
using RogAdmin.Application.Interfaces;

namespace RogAdmin.Api.Controllers.Public;

public record ChangeCustomerPasswordRequest(string OldPassword, string NewPassword);
public record UpdateCustomerProfileRequest(string FullName, string PhoneNumber);

[ApiController]
[Route("api/public/auth")]
public class CustomerAuthController(ICustomerAuthService authService) : ControllerBase
{
    [HttpPost("register")]
    [AllowAnonymous]
    [EnableRateLimiting("login")]
    public async Task<ActionResult<CustomerAuthResponse>> Register(
        [FromBody] CustomerRegisterRequest request,
        CancellationToken ct)
    {
        var result = await authService.RegisterAsync(request, ct);
        return StatusCode(StatusCodes.Status201Created, result);
    }

    [HttpPost("login")]
    [AllowAnonymous]
    [EnableRateLimiting("login")]
    public async Task<ActionResult<CustomerAuthResponse>> Login(
        [FromBody] CustomerLoginRequest request,
        CancellationToken ct)
    {
        return Ok(await authService.LoginAsync(request, ct));
    }

    [HttpGet("me")]
    [Authorize(Roles = "Customer")]
    public async Task<ActionResult<CustomerProfileDto>> Me(CancellationToken ct)
    {
        var raw = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(raw, out var customerId))
        {
            return Unauthorized();
        }

        return Ok(await authService.GetProfileAsync(customerId, ct));
    }

    [HttpPut("change-password")]
    [Authorize(Roles = "Customer")]
    public async Task<IActionResult> ChangePassword(
        [FromBody] ChangeCustomerPasswordRequest request,
        CancellationToken ct)
    {
        var raw = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(raw, out var customerId))
        {
            return Unauthorized();
        }

        var success = await authService.ChangePasswordAsync(customerId, request.OldPassword, request.NewPassword, ct);
        if (!success)
        {
            return BadRequest(new { message = "Mật khẩu cũ không chính xác hoặc mật khẩu mới không hợp lệ." });
        }

        return Ok(new { success = true });
    }

    [HttpPut("profile")]
    [Authorize(Roles = "Customer")]
    public async Task<ActionResult<CustomerProfileDto>> UpdateProfile(
        [FromBody] UpdateCustomerProfileRequest request,
        CancellationToken ct)
    {
        var raw = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(raw, out var customerId))
        {
            return Unauthorized();
        }

        var updated = await authService.UpdateProfileAsync(customerId, request.FullName, request.PhoneNumber, ct);
        return Ok(updated);
    }
}
