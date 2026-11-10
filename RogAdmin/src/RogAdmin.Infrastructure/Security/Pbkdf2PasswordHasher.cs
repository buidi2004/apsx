using System.Security.Cryptography;
using RogAdmin.Application.Interfaces;

namespace RogAdmin.Infrastructure.Security;

/// <summary>
/// Băm mật khẩu bằng PBKDF2 (SHA-256, 100.000 vòng) — API chuẩn .NET,
/// không cần thư viện ngoài. Salt riêng cho từng user.
/// </summary>
public class Pbkdf2PasswordHasher : IPasswordHasher
{
    private const int SaltSize = 16;
    private const int HashSize = 32;
    private const int Iterations = 100_000;

    public (string Hash, string Salt) Hash(string password)
    {
        var salt = RandomNumberGenerator.GetBytes(SaltSize);
        var hash = Rfc2898DeriveBytes.Pbkdf2(password, salt, Iterations, HashAlgorithmName.SHA256, HashSize);
        return (Convert.ToBase64String(hash), Convert.ToBase64String(salt));
    }

    public bool Verify(string password, string hash, string salt)
    {
        try
        {
            var expectedHash = Convert.FromBase64String(hash);
            var saltBytes = Convert.FromBase64String(salt);
            var actualHash = Rfc2898DeriveBytes.Pbkdf2(password, saltBytes, Iterations, HashAlgorithmName.SHA256, expectedHash.Length);
            return CryptographicOperations.FixedTimeEquals(actualHash, expectedHash);
        }
        catch (FormatException)
        {
            // Hash/salt lưu trong DB bị hỏng — coi như mật khẩu sai thay vì nổ 500
            return false;
        }
    }
}
