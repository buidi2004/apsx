using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RogAdmin.Application.Dtos.Users;
using RogAdmin.Application.Interfaces;

namespace RogAdmin.Api.Controllers.Admin;

/// <summary>Tài khoản của chính người đang đăng nhập (cả Admin lẫn Editor).</summary>
[ApiController]
[Route("api/admin/account")]
[Authorize(Roles = "Admin,Editor")]
public class AccountController(IUserService service) : ControllerBase
{
    /// <summary>Đổi mật khẩu của chính mình (phải nhập đúng mật khẩu hiện tại).</summary>
    [HttpPut("password")]
    public async Task<IActionResult> ChangeOwnPassword([FromBody] ChangePasswordRequest request, CancellationToken ct)
    {
        await service.ChangePasswordAsync(User.Identity?.Name ?? string.Empty, request, ct);
        return NoContent();
    }
}
