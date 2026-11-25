using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using RogAdmin.Domain.Entities;
using RogAdmin.Domain.Enums;
using RogAdmin.Infrastructure.Persistence;

namespace RogAdmin.Tests.TestSupport;

/// <summary>
/// Tạo RogAdminDbContext trên SQLite in-memory cho mỗi test.
/// Connection phải giữ mở suốt test nếu không DB sẽ bị xoá.
/// </summary>
public sealed class TestDb : IDisposable
{
    private readonly SqliteConnection _connection;

    public RogAdminDbContext Db { get; }

    public TestDb()
    {
        _connection = new SqliteConnection("DataSource=:memory:");
        _connection.Open();

        var options = new DbContextOptionsBuilder<RogAdminDbContext>()
            .UseSqlite(_connection)
            .Options;

        Db = new RogAdminDbContext(options);
        Db.Database.EnsureCreated();
    }

    /// <summary>Tạo 1 tài khoản admin mẫu (mật khẩu đã hash bằng hasher thật nếu truyền vào).</summary>
    public async Task<AdminUser> SeedAdminAsync(
        string username = "admin",
        string password = "Admin@123",
        UserRole role = UserRole.Admin,
        bool isActive = true,
        RogAdmin.Infrastructure.Security.Pbkdf2PasswordHasher? hasher = null)
    {
        hasher ??= new RogAdmin.Infrastructure.Security.Pbkdf2PasswordHasher();
        var (hash, salt) = hasher.Hash(password);
        var user = new AdminUser
        {
            Username = username,
            PasswordHash = hash,
            PasswordSalt = salt,
            FullName = "Test Admin",
            Role = role,
            IsActive = isActive,
        };
        Db.AdminUsers.Add(user);
        await Db.SaveChangesAsync();
        return user;
    }

    public void Dispose()
    {
        Db.Dispose();
        _connection.Dispose();
    }
}
