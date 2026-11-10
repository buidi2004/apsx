using RogAdmin.Application.Dtos.Auth;
using RogAdmin.Application.Exceptions;
using RogAdmin.Application.Interfaces;
using RogAdmin.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace RogAdmin.Application.Services;

public class AuthService : IAuthService
{
    private readonly IRepository<AdminUser> userRepository;
    private readonly IPasswordHasher passwordHasher;
    private readonly IJwtTokenGenerator tokenGenerator;

    // Cặp hash/salt giả (lazy — chỉ tính khi login thất bại vì user không tồn tại/đã vô hiệu)
    // để response tốn thời gian xác minh như một user thật, tránh timing side-channel
    // đoán được username có tồn tại/không hoạt động hay không
    private readonly Lazy<(string Hash, string Salt)> _dummyCredentials;

    public AuthService(
        IRepository<AdminUser> userRepository,
        IPasswordHasher passwordHasher,
        IJwtTokenGenerator tokenGenerator)
    {
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
        this.tokenGenerator = tokenGenerator;
        _dummyCredentials = new Lazy<(string, string)>(() =>
            passwordHasher.Hash("timing-equalizer-not-a-real-password"));
    }

    public async Task<LoginResponse> LoginAsync(LoginRequest request, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
        {
            throw AppException.BadRequest("Vui lòng nhập tên đăng nhập và mật khẩu.");
        }

        var username = request.Username.Trim();
        var user = await userRepository.Query()
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Username.ToLower() == username.ToLower(), ct);

        // Trả cùng một thông điệp + cùng một lượng thời gian cho cả user không tồn tại
        // lẫn tài khoản bị vô hiệu hóa
        if (user is null)
        {
            DummyVerify(request.Password);
            throw AppException.Unauthorized();
        }
        if (!user.IsActive)
        {
            DummyVerify(request.Password);
            throw AppException.Unauthorized();
        }
        if (!passwordHasher.Verify(request.Password, user.PasswordHash, user.PasswordSalt))
        {
            throw AppException.Unauthorized();
        }

        var (token, expiresAtUtc) = tokenGenerator.GenerateToken(user);

        return new LoginResponse
        {
            Token = token,
            ExpiresAtUtc = expiresAtUtc,
            User = new AuthUserDto
            {
                Username = user.Username,
                FullName = user.FullName,
                Role = user.Role.ToString(),
            },
        };
    }

    private void DummyVerify(string password)
    {
        var (hash, salt) = _dummyCredentials.Value;
        passwordHasher.Verify(password, hash, salt);
    }
}
