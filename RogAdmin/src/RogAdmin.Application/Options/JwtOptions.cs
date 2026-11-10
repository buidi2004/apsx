namespace RogAdmin.Application.Options;

/// <summary>Cấu hình JWT đọc từ "Jwt" trong appsettings.</summary>
public class JwtOptions
{
    public const string SectionName = "Jwt";

    public string Issuer { get; set; } = "RogAdmin.Api";
    public string Audience { get; set; } = "RogAdmin.Client";
    public string Key { get; set; } = string.Empty;
    public int ExpireHours { get; set; } = 8;
}
