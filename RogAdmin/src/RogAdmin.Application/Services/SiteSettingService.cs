using RogAdmin.Application.Dtos.SiteSettings;
using RogAdmin.Application.Exceptions;
using RogAdmin.Application.Interfaces;
using RogAdmin.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace RogAdmin.Application.Services;

public class SiteSettingService(
    IRepository<SiteSetting> repository,
    IUnitOfWork unitOfWork) : ISiteSettingService
{
    public async Task<IReadOnlyList<SiteSettingDto>> GetAllAsync(CancellationToken ct = default)
    {
        var settings = await repository.Query().AsNoTracking()
            .OrderBy(s => s.Key)
            .ToListAsync(ct);
        return settings.Select(ToDto).ToList();
    }

    public async Task<SiteSettingDto> GetAsync(string key, CancellationToken ct = default)
    {
        var setting = await FindByKeyAsync(key, ct)
                      ?? throw AppException.NotFound($"Cấu hình '{key}'");
        return ToDto(setting);
    }

    public async Task<SiteSettingDto> UpdateAsync(string key, UpdateSiteSettingRequest request, CancellationToken ct = default)
    {
        var setting = await FindByKeyAsync(key, ct)
                      ?? throw AppException.NotFound($"Cấu hình '{key}'");
        setting.Value = request.Value ?? string.Empty;
        setting.UpdatedAt = DateTime.UtcNow;

        repository.Update(setting);
        await unitOfWork.SaveChangesAsync(ct);
        return ToDto(setting);
    }

    public async Task<IReadOnlyList<SiteSettingDto>> UpdateRangeAsync(UpdateSiteSettingsRequest request, CancellationToken ct = default)
    {
        var settings = request.Settings ?? [];
        if (settings.Count == 0)
        {
            throw AppException.BadRequest("Danh sách cấu hình cần cập nhật đang trống.");
        }

        var now = DateTime.UtcNow;
        var updated = new List<SiteSettingDto>();

        foreach (var item in settings)
        {
            var setting = await FindByKeyAsync(item.Key, ct)
                          ?? throw AppException.NotFound($"Cấu hình '{item.Key}'");
            // JSON "value": null không được phép phá cột NOT NULL — quy về chuỗi rỗng
            setting.Value = item.Value ?? string.Empty;
            setting.UpdatedAt = now;
            repository.Update(setting);
            updated.Add(ToDto(setting));
        }

        await unitOfWork.SaveChangesAsync(ct);
        return updated;
    }

    public async Task<Dictionary<string, string>> GetDictionaryAsync(CancellationToken ct = default)
    {
        var settings = await repository.Query().AsNoTracking().ToListAsync(ct);
        return settings.ToDictionary(s => s.Key, s => s.Value);
    }

    private async Task<SiteSetting?> FindByKeyAsync(string key, CancellationToken ct)
    {
        var normalized = (key ?? string.Empty).Trim();
        if (normalized.Length == 0)
        {
            throw AppException.BadRequest("Khóa cấu hình không được để trống.");
        }
        if (!SiteSettingKeys.All.Contains(normalized, StringComparer.OrdinalIgnoreCase))
        {
            throw AppException.BadRequest($"Khóa '{normalized}' không nằm trong danh mục cấu hình hợp lệ.");
        }
        return await repository.Query().FirstOrDefaultAsync(s => s.Key.ToLower() == normalized.ToLower(), ct);
    }

    private static SiteSettingDto ToDto(SiteSetting s) => new()
    {
        Key = s.Key,
        Value = s.Value,
        Description = s.Description,
    };
}
