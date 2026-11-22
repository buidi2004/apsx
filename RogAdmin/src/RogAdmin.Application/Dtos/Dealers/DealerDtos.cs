namespace RogAdmin.Application.Dtos.Dealers;

public record DealerDto(
    int Id,
    string Name,
    string Slug,
    string LogoUrl,
    string WebsiteUrl,
    string Hotline,
    bool IsOfficialPartner,
    int StoreCount,
    string CityCoverage
);

public record CreateDealerRequest(
    string Name,
    string Slug,
    string LogoUrl = "",
    string WebsiteUrl = "",
    string Hotline = "",
    bool IsOfficialPartner = true,
    int StoreCount = 1,
    string CityCoverage = "Toàn quốc"
);

public record UpdateDealerRequest(
    string Name,
    string Slug,
    string LogoUrl,
    string WebsiteUrl,
    string Hotline,
    bool IsOfficialPartner,
    int StoreCount,
    string CityCoverage
);
