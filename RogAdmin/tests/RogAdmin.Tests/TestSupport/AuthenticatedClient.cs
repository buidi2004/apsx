namespace RogAdmin.Tests.TestSupport;

/// <summary>
/// HTTP client tiện ích cho test end-to-end: tự login rồi gắn Bearer token.
/// </summary>
public static class AuthenticatedClient
{
    public static async Task<HttpClient> CreateAsync(TestAppFactory factory, string username = "admin", string password = "Admin@123")
    {
        var client = factory.CreateClient();
        var res = await client.PostAsJsonAsync("/api/auth/login", new { username, password });
        res.EnsureSuccessStatusCode();
        var body = await res.Content.ReadFromJsonAsync<LoginResponse>();
        client.DefaultRequestHeaders.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", body!.Token);
        return client;
    }

    private sealed record LoginResponse(string Token, DateTime ExpiresAtUtc);
}
