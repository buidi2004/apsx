using RogAdmin.Application.Dtos.SiteSettings;

namespace RogAdmin.Application.Interfaces;

public interface ISiteSettingService
{
    Task<IReadOnlyList<SiteSettingDto>> GetAllAsync(CancellationToken ct = default);
    Task<SiteSettingDto> GetAsync(string key, CancellationToken ct = default);
    Task<SiteSettingDto> UpdateAsync(string key, UpdateSiteSettingRequest request, CancellationToken ct = default);

    /// <summary>Cập nhật hàng loạt; key không có trong DB sẽ lỗi — chỉ sửa được khóa đã seed.</summary>
    Task<IReadOnlyList<SiteSettingDto>> UpdateRangeAsync(UpdateSiteSettingsRequest request, CancellationToken ct = default);

    /// <summary>Đọc giá trị thô (dùng khi build public site-config).</summary>
    Task<Dictionary<string, string>> GetDictionaryAsync(CancellationToken ct = default);
}
