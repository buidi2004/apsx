using RogAdmin.Domain.Common;

namespace RogAdmin.Domain.Entities;

public class SoftwareDownload : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Version { get; set; } = string.Empty;
    public string Size { get; set; } = string.Empty;
    public string Desc { get; set; } = string.Empty;
    public string FeaturesJson { get; set; } = "[]";
    public string Os { get; set; } = "Windows 11 / 10 64-bit";
    public string Badge { get; set; } = string.Empty;
    public string DownloadUrl { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public int SortOrder { get; set; }
}
