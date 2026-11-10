using RogAdmin.Application.Dtos.Users;

namespace RogAdmin.Application.Interfaces;

/// <summary>
/// Quản lý tài khoản admin. Toàn bộ endpoint gọi service này yêu cầu role Admin,
/// TRỪ ChangePasswordAsync (tự đổi mật khẩu của chính mình — cả Editor được dùng).
/// </summary>
public interface IUserService
{
    Task<IReadOnlyList<AdminUserDto>> GetAllAsync(CancellationToken ct = default);
    Task<AdminUserDto> GetByIdAsync(int id, CancellationToken ct = default);
    Task<AdminUserDto> CreateAsync(CreateUserRequest request, CancellationToken ct = default);

    /// <summary>currentUsername dùng để chặn tự hạ quyền/vô hiệu hóa chính mình.</summary>
    Task<AdminUserDto> UpdateAsync(int id, UpdateUserRequest request, string currentUsername, CancellationToken ct = default);

    /// <summary>Admin đặt lại mật khẩu cho user khác.</summary>
    Task ResetPasswordAsync(int id, ResetPasswordRequest request, CancellationToken ct = default);

    /// <summary>User tự đổi mật khẩu (xác minh mật khẩu hiện tại).</summary>
    Task ChangePasswordAsync(string currentUsername, ChangePasswordRequest request, CancellationToken ct = default);

    Task DeleteAsync(int id, string currentUsername, CancellationToken ct = default);
}
