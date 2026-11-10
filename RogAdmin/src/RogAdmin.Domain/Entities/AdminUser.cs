using RogAdmin.Domain.Enums;

namespace RogAdmin.Domain.Entities;

/// <summary>Tài khoản đăng nhập khu vực admin.</summary>
public class AdminUser : BaseEntity
{
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string PasswordSalt { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public UserRole Role { get; set; } = UserRole.Editor;
    public bool IsActive { get; set; } = true;
}
