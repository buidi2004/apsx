using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RogAdmin.Application.Dtos.Users;
using RogAdmin.Application.Interfaces;

namespace RogAdmin.Api.Controllers.Admin;

/// <summary>Quản lý tài khoản admin — CHỈ role Admin được truy cập.</summary>
[ApiController]
[Route("api/admin/users")]
[Authorize(Roles = "Admin")]
public class UsersController(IUserService service) : ControllerBase
{
    /// <summary>Danh sách toàn bộ tài khoản.</summary>
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<AdminUserDto>>> GetAll(CancellationToken ct)
        => Ok(await service.GetAllAsync(ct));

    [HttpGet("{id:int}")]
    public async Task<ActionResult<AdminUserDto>> GetById(int id, CancellationToken ct)
        => Ok(await service.GetByIdAsync(id, ct));

    /// <summary>Tạo tài khoản mới (username lưu lowercase, mật khẩu tối thiểu 8 ký tự).</summary>
    [HttpPost]
    public async Task<ActionResult<AdminUserDto>> Create([FromBody] CreateUserRequest request, CancellationToken ct)
    {
        var created = await service.CreateAsync(request, ct);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    /// <summary>Sửa họ tên / vai trò / trạng thái. Không thể tự hạ quyền hoặc vô hiệu hóa chính mình.</summary>
    [HttpPut("{id:int}")]
    public async Task<ActionResult<AdminUserDto>> Update(
        int id, [FromBody] UpdateUserRequest request, CancellationToken ct)
        => Ok(await service.UpdateAsync(id, request, User.Identity?.Name ?? string.Empty, ct));

    /// <summary>Admin đặt lại mật khẩu cho tài khoản khác.</summary>
    [HttpPut("{id:int}/password")]
    public async Task<IActionResult> ResetPassword(
        int id, [FromBody] ResetPasswordRequest request, CancellationToken ct)
    {
        await service.ResetPasswordAsync(id, request, ct);
        return NoContent();
    }

    /// <summary>Xóa tài khoản. Không thể tự xóa và không thể xóa admin duy nhất.</summary>
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        await service.DeleteAsync(id, User.Identity?.Name ?? string.Empty, ct);
        return NoContent();
    }
}
