using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using RogAdmin.Application.Dtos.Auth;
using RogAdmin.Application.Interfaces;

namespace RogAdmin.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(IAuthService authService) : ControllerBase
{
    /// <summary>Đăng nhập khu vực admin, trả về JWT dùng cho mọi endpoint /api/admin/*.
    /// Giới hạn 10 lần/phút cho mỗi IP (chống brute-force).</summary>
    [HttpPost("login")]
    [AllowAnonymous]
    [EnableRateLimiting("login")]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request, CancellationToken ct)
    {
        var response = await authService.LoginAsync(request, ct);
        return Ok(response);
    }
}
