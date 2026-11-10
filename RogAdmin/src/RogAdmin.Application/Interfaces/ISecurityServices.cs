using RogAdmin.Domain.Entities;

namespace RogAdmin.Application.Interfaces;

/// <summary>Băm + kiểm tra mật khẩu (PBKDF2 — cài đặt ở Infrastructure).</summary>
public interface IPasswordHasher
{
    (string Hash, string Salt) Hash(string password);
    bool Verify(string password, string hash, string salt);
}

/// <summary>Sinh JWT cho user đăng nhập (cài đặt ở Infrastructure).</summary>
public interface IJwtTokenGenerator
{
    (string Token, DateTime ExpiresAtUtc) GenerateToken(AdminUser user);
}
