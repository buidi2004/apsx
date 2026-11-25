using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;

namespace RogAdmin.Tests.TestSupport;

/// <summary>
/// Khởi động app RogAdmin thật (Program.cs) trên SQLite file tạm cho test HTTP end-to-end.
/// Môi trường Development để lấy Jwt key + provider Sqlite từ appsettings.Development.json.
/// Mỗi factory = 1 file DB riêng, tự xoá khi dispose.
/// </summary>
public class TestAppFactory : WebApplicationFactory<Program>
{
    private readonly string _dbPath = Path.Combine(
        Path.GetTempPath(), $"rogadmin-test-{Guid.NewGuid():N}.db");

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Development");
        builder.UseSetting("Database:Provider", "Sqlite");
        builder.UseSetting("ConnectionStrings:Sqlite", $"Data Source={_dbPath}");
        // Tránh rate-limit login (60/phút IP test) chi phối assertion — giữ policy nhưng đủ cao
        builder.UseSetting("Jwt:ExpireHours", "8");
    }

    public HttpClient CreateClientWithToken(out string token)
    {
        var client = CreateClient();
        var login = client.PostAsJsonAsync("/api/auth/login",
            new { username = "admin", password = "Admin@123" }).GetAwaiter().GetResult();
        login.EnsureSuccessStatusCode();
        var body = login.Content.ReadFromJsonAsync<LoginDto>().GetAwaiter().GetResult()!;
        token = body.Token;
        client.DefaultRequestHeaders.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
        return client;
    }

    private sealed record LoginDto(string Token, DateTime ExpiresAtUtc);

    protected override void Dispose(bool disposing)
    {
        base.Dispose(disposing);
        try
        {
            if (File.Exists(_dbPath)) File.Delete(_dbPath);
            if (File.Exists(_dbPath + "-wal")) File.Delete(_dbPath + "-wal");
            if (File.Exists(_dbPath + "-shm")) File.Delete(_dbPath + "-shm");
        }
        catch { /* best effort */ }
    }
}
