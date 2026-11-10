using RogAdmin.Application.Dtos.Users;
using RogAdmin.Application.Exceptions;
using RogAdmin.Application.Interfaces;
using RogAdmin.Domain.Entities;
using RogAdmin.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace RogAdmin.Application.Services;

public class UserService(
    IRepository<AdminUser> users,
    IUnitOfWork unitOfWork,
    IPasswordHasher hasher) : IUserService
{
    public async Task<IReadOnlyList<AdminUserDto>> GetAllAsync(CancellationToken ct = default)
    {
        var rows = await users.Query().AsNoTracking()
            .OrderBy(u => u.Username)
            .ToListAsync(ct);
        return rows.Select(ToDto).ToList();
    }

    public async Task<AdminUserDto> GetByIdAsync(int id, CancellationToken ct = default)
    {
        var user = await FindByIdAsync(id, ct);
        return ToDto(user);
    }

    public async Task<AdminUserDto> CreateAsync(CreateUserRequest request, CancellationToken ct = default)
    {
        var username = request.Username.Trim().ToLowerInvariant();
        if (username.Length == 0)
        {
            throw AppException.BadRequest("Tên đăng nhập không được để trống.");
        }
        if (string.IsNullOrWhiteSpace(request.Password) || request.Password.Length < 8)
        {
            throw AppException.BadRequest("Mật khẩu tối thiểu 8 ký tự.");
        }
        if (await users.Query().AnyAsync(u => u.Username == username, ct))
        {
            throw AppException.Conflict($"Tên đăng nhập '{username}' đã tồn tại.");
        }

        var (hash, salt) = hasher.Hash(request.Password);
        EnsureRoleValid(request.Role);
        var user = new AdminUser
        {
            Username = username,
            PasswordHash = hash,
            PasswordSalt = salt,
            FullName = request.FullName.Trim(),
            Role = request.Role,
            IsActive = request.IsActive,
        };

        await users.AddAsync(user, ct);
        await unitOfWork.SaveChangesAsync(ct);
        return ToDto(user);
    }

    public async Task<AdminUserDto> UpdateAsync(int id, UpdateUserRequest request, string currentUsername, CancellationToken ct = default)
    {
        var user = await FindByIdAsync(id, ct);

        EnsureRoleValid(request.Role);
        var isSelf = user.Username.Equals(currentUsername, StringComparison.OrdinalIgnoreCase);
        if (isSelf && (request.Role != UserRole.Admin || !request.IsActive))
        {
            throw AppException.BadRequest("Không thể tự hạ quyền hoặc vô hiệu hóa chính mình.");
        }

        // Chắc chắn luôn còn ít nhất một admin đang hoạt động
        if (user.Role == UserRole.Admin && user.IsActive
            && (request.Role != UserRole.Admin || !request.IsActive))
        {
            var activeAdmins = await users.Query().CountAsync(u => u.Role == UserRole.Admin && u.IsActive, ct);
            if (activeAdmins <= 1)
            {
                throw AppException.BadRequest("Phải giữ lại ít nhất một quản trị viên đang hoạt động.");
            }
        }

        user.FullName = request.FullName.Trim();
        user.Role = request.Role;
        user.IsActive = request.IsActive;
        user.UpdatedAt = DateTime.UtcNow;

        users.Update(user);
        await unitOfWork.SaveChangesAsync(ct);
        return ToDto(user);
    }

    public async Task ResetPasswordAsync(int id, ResetPasswordRequest request, CancellationToken ct = default)
    {
        var user = await FindByIdAsync(id, ct);
        if (string.IsNullOrWhiteSpace(request.NewPassword) || request.NewPassword.Length < 8)
        {
            throw AppException.BadRequest("Mật khẩu tối thiểu 8 ký tự.");
        }

        var (hash, salt) = hasher.Hash(request.NewPassword);
        user.PasswordHash = hash;
        user.PasswordSalt = salt;
        user.UpdatedAt = DateTime.UtcNow;

        users.Update(user);
        await unitOfWork.SaveChangesAsync(ct);
    }

    public async Task ChangePasswordAsync(string currentUsername, ChangePasswordRequest request, CancellationToken ct = default)
    {
        var username = (currentUsername ?? string.Empty).Trim().ToLowerInvariant();
        var user = await users.Query().FirstOrDefaultAsync(u => u.Username == username, ct)
                   ?? throw AppException.Unauthorized();

        if (string.IsNullOrWhiteSpace(request.CurrentPassword)
            || !hasher.Verify(request.CurrentPassword, user.PasswordHash, user.PasswordSalt))
        {
            throw AppException.BadRequest("Mật khẩu hiện tại không đúng.");
        }
        if (string.IsNullOrWhiteSpace(request.NewPassword) || request.NewPassword.Length < 8)
        {
            throw AppException.BadRequest("Mật khẩu mới tối thiểu 8 ký tự.");
        }

        var (hash, salt) = hasher.Hash(request.NewPassword);
        user.PasswordHash = hash;
        user.PasswordSalt = salt;
        user.UpdatedAt = DateTime.UtcNow;

        users.Update(user);
        await unitOfWork.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(int id, string currentUsername, CancellationToken ct = default)
    {
        var user = await FindByIdAsync(id, ct);

        if (user.Username.Equals(currentUsername, StringComparison.OrdinalIgnoreCase))
        {
            throw AppException.BadRequest("Không thể tự xóa chính mình.");
        }
        if (user.Role == UserRole.Admin && user.IsActive)
        {
            var activeAdmins = await users.Query().CountAsync(u => u.Role == UserRole.Admin && u.IsActive, ct);
            if (activeAdmins <= 1)
            {
                throw AppException.BadRequest("Không thể xóa quản trị viên duy nhất đang hoạt động.");
            }
        }

        users.Remove(user);
        await unitOfWork.SaveChangesAsync(ct);
    }

    /// <summary>Chặn enum rác (ví dụ JSON "role": 99) tạo user không khớp [Authorize].</summary>
    private static void EnsureRoleValid(UserRole role)
    {
        if (!Enum.IsDefined(typeof(UserRole), role))
        {
            throw AppException.BadRequest("Vai trò chỉ nhận 'Admin' hoặc 'Editor'.");
        }
    }

    private async Task<AdminUser> FindByIdAsync(int id, CancellationToken ct)
        => await users.Query().FirstOrDefaultAsync(u => u.Id == id, ct)
           ?? throw AppException.NotFound($"Tài khoản #{id}");

    private static AdminUserDto ToDto(AdminUser u) => new()
    {
        Id = u.Id,
        Username = u.Username,
        FullName = u.FullName,
        Role = u.Role.ToString(),
        IsActive = u.IsActive,
        CreatedAt = u.CreatedAt,
    };
}
