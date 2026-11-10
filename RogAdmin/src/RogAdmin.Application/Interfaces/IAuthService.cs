using RogAdmin.Application.Dtos.Auth;

namespace RogAdmin.Application.Interfaces;

public interface IAuthService
{
    Task<LoginResponse> LoginAsync(LoginRequest request, CancellationToken ct = default);
}
