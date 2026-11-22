using Microsoft.EntityFrameworkCore;
using RogAdmin.Application.Dtos.Commerce;
using RogAdmin.Application.Exceptions;
using RogAdmin.Application.Interfaces;
using RogAdmin.Domain.Entities;

namespace RogAdmin.Application.Services;

public class CustomerAuthService(
    IRepository<Customer> customerRepo,
    IRepository<Order> orderRepo,
    IPasswordHasher passwordHasher,
    IJwtTokenGenerator tokenGenerator,
    IUnitOfWork unitOfWork) : ICustomerAuthService
{
    public async Task<CustomerAuthResponse> RegisterAsync(CustomerRegisterRequest request, CancellationToken ct = default)
    {
        var email = request.Email.Trim().ToLowerInvariant();

        var exists = await customerRepo.Query()
            .AnyAsync(c => c.Email.ToLower() == email, ct);
        if (exists)
        {
            throw AppException.Conflict("Email này đã được đăng ký.");
        }

        var (hash, salt) = passwordHasher.Hash(request.Password);
        var customer = new Customer
        {
            Email = email,
            FullName = request.FullName.Trim(),
            PhoneNumber = request.PhoneNumber.Trim(),
            PasswordHash = hash,
            PasswordSalt = salt,
            IsActive = true,
        };

        await customerRepo.AddAsync(customer, ct);
        await unitOfWork.SaveChangesAsync(ct);

        var (token, expiresAtUtc) = tokenGenerator.GenerateCustomerToken(customer);
        return new CustomerAuthResponse(
            token,
            expiresAtUtc,
            new CustomerProfileDto(
                customer.Id,
                customer.Email,
                customer.FullName,
                customer.PhoneNumber,
                customer.Tier.ToString(),
                customer.Points,
                0));
    }

    public async Task<CustomerAuthResponse> LoginAsync(CustomerLoginRequest request, CancellationToken ct = default)
    {
        var email = request.Email.Trim().ToLowerInvariant();

        var customer = await customerRepo.Query()
            .FirstOrDefaultAsync(c => c.Email.ToLower() == email, ct);

        if (customer is null || !customer.IsActive)
        {
            throw AppException.Unauthorized("Email hoặc mật khẩu không đúng.");
        }
        if (!passwordHasher.Verify(request.Password, customer.PasswordHash, customer.PasswordSalt))
        {
            throw AppException.Unauthorized("Email hoặc mật khẩu không đúng.");
        }

        var (token, expiresAtUtc) = tokenGenerator.GenerateCustomerToken(customer);
        var orderCount = await orderRepo.Query()
            .CountAsync(o => o.CustomerId == customer.Id, ct);

        return new CustomerAuthResponse(
            token,
            expiresAtUtc,
            new CustomerProfileDto(
                customer.Id,
                customer.Email,
                customer.FullName,
                customer.PhoneNumber,
                customer.Tier.ToString(),
                customer.Points,
                orderCount));
    }

    public async Task<CustomerProfileDto> GetProfileAsync(int customerId, CancellationToken ct = default)
    {
        var customer = await customerRepo.GetByIdAsync(customerId, ct)
            ?? throw AppException.NotFound("Tài khoản");

        var orderCount = await orderRepo.Query()
            .CountAsync(o => o.CustomerId == customer.Id, ct);

        return new CustomerProfileDto(
            customer.Id,
            customer.Email,
            customer.FullName,
            customer.PhoneNumber,
            customer.Tier.ToString(),
            customer.Points,
            orderCount);
    }

    public async Task<bool> ChangePasswordAsync(int customerId, string oldPassword, string newPassword, CancellationToken ct = default)
    {
        var customer = await customerRepo.GetByIdAsync(customerId, ct)
            ?? throw AppException.NotFound("Tài khoản");

        if (!passwordHasher.Verify(oldPassword, customer.PasswordHash, customer.PasswordSalt))
        {
            throw AppException.BadRequest("Mật khẩu hiện tại không chính xác.");
        }

        if (string.IsNullOrWhiteSpace(newPassword) || newPassword.Length < 6)
        {
            throw AppException.BadRequest("Mật khẩu mới phải có ít nhất 6 ký tự.");
        }

        var (hash, salt) = passwordHasher.Hash(newPassword);
        customer.PasswordHash = hash;
        customer.PasswordSalt = salt;
        customer.UpdatedAt = DateTime.UtcNow;
        customerRepo.Update(customer);
        await unitOfWork.SaveChangesAsync(ct);
        return true;
    }

    public async Task<CustomerProfileDto> UpdateProfileAsync(int customerId, string fullName, string phoneNumber, CancellationToken ct = default)
    {
        var customer = await customerRepo.GetByIdAsync(customerId, ct)
            ?? throw AppException.NotFound("Tài khoản");

        if (!string.IsNullOrWhiteSpace(fullName))
        {
            customer.FullName = fullName.Trim();
        }
        if (!string.IsNullOrWhiteSpace(phoneNumber))
        {
            customer.PhoneNumber = phoneNumber.Trim();
        }

        customer.UpdatedAt = DateTime.UtcNow;
        customerRepo.Update(customer);
        await unitOfWork.SaveChangesAsync(ct);

        var orderCount = await orderRepo.Query()
            .CountAsync(o => o.CustomerId == customer.Id, ct);

        return new CustomerProfileDto(
            customer.Id,
            customer.Email,
            customer.FullName,
            customer.PhoneNumber,
            customer.Tier.ToString(),
            customer.Points,
            orderCount);
    }
}
