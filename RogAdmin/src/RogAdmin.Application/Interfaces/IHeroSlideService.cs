using RogAdmin.Application.Dtos.HeroSlides;

namespace RogAdmin.Application.Interfaces;

public interface IHeroSlideService
{
    Task<IReadOnlyList<HeroSlideDto>> GetAllAsync(bool includeInactive = true, CancellationToken ct = default);
    Task<HeroSlideDto> GetByIdAsync(int id, CancellationToken ct = default);
    Task<HeroSlideDto> CreateAsync(CreateHeroSlideRequest request, CancellationToken ct = default);
    Task<HeroSlideDto> UpdateAsync(int id, UpdateHeroSlideRequest request, CancellationToken ct = default);
    Task DeleteAsync(int id, CancellationToken ct = default);
}
