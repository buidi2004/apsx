using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using RogAdmin.Application.Interfaces;
using RogAdmin.Application.Options;
using RogAdmin.Infrastructure.Persistence;
using RogAdmin.Infrastructure.Repositories;
using RogAdmin.Infrastructure.Security;

namespace RogAdmin.Infrastructure;

public static class DependencyInjection
{
    /// <summary>
    /// Đăng ký hạ tầng: DbContext (chọn provider SqlServer | Sqlite theo "Database:Provider"),
    /// repository, unit-of-work, security.
    /// </summary>
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<JwtOptions>(configuration.GetSection(JwtOptions.SectionName));

        var provider = configuration["Database:Provider"] ?? "SqlServer";
        var connectionString = provider.Equals("Sqlite", StringComparison.OrdinalIgnoreCase)
            ? configuration.GetConnectionString("Sqlite")
            : configuration.GetConnectionString("SqlServer");

        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new InvalidOperationException(
                $"Thiếu connection string cho provider '{provider}'. Kiểm tra ConnectionStrings trong appsettings.json.");
        }

        services.AddDbContext<RogAdminDbContext>(options =>
        {
            if (provider.Equals("Sqlite", StringComparison.OrdinalIgnoreCase))
            {
                options.UseSqlite(connectionString);
                options.AddInterceptors(new SqlitePragmaInterceptor());
            }
            else
            {
                options.UseSqlServer(connectionString);
            }
        });

        services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<IPasswordHasher, Pbkdf2PasswordHasher>();
        services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();

        return services;
    }
}
