using RogAdmin.Application.Dtos.HeroSlides;
using RogAdmin.Application.Exceptions;
using RogAdmin.Application.Interfaces;
using RogAdmin.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace RogAdmin.Application.Services;

public class HeroSlideService(
    IRepository<HeroSlide> repository,
    IUnitOfWork unitOfWork) : IHeroSlideService
{
    public async Task<IReadOnlyList<HeroSlideDto>> GetAllAsync(bool includeInactive = true, CancellationToken ct = default)
    {
        var q = repository.Query().AsNoTracking();
        if (!includeInactive)
        {
            q = q.Where(s => s.IsActive);
        }
        var slides = await q.OrderBy(s => s.SortOrder).ThenBy(s => s.Id).ToListAsync(ct);
        return slides.Select(ToDto).ToList();
    }

    public async Task<HeroSlideDto> GetByIdAsync(int id, CancellationToken ct = default)
    {
        var slide = await repository.GetByIdAsync(id, ct)
                    ?? throw AppException.NotFound($"Slide hero #{id}");
        return ToDto(slide);
    }

    public async Task<HeroSlideDto> CreateAsync(CreateHeroSlideRequest request, CancellationToken ct = default)
    {
        Validate(request.ImageUrl, request.AltText);

        var slide = new HeroSlide
        {
            ImageUrl = request.ImageUrl.Trim(),
            AltText = request.AltText.Trim(),
            Href = string.IsNullOrWhiteSpace(request.Href) ? null : request.Href.Trim(),
            SortOrder = request.SortOrder,
            IsActive = request.IsActive,
        };

        await repository.AddAsync(slide, ct);
        await unitOfWork.SaveChangesAsync(ct);
        return ToDto(slide);
    }

    public async Task<HeroSlideDto> UpdateAsync(int id, UpdateHeroSlideRequest request, CancellationToken ct = default)
    {
        Validate(request.ImageUrl, request.AltText);

        var slide = await repository.GetByIdAsync(id, ct)
                    ?? throw AppException.NotFound($"Slide hero #{id}");

        slide.ImageUrl = request.ImageUrl.Trim();
        slide.AltText = request.AltText.Trim();
        slide.Href = string.IsNullOrWhiteSpace(request.Href) ? null : request.Href.Trim();
        slide.SortOrder = request.SortOrder;
        slide.IsActive = request.IsActive;
        slide.UpdatedAt = DateTime.UtcNow;

        repository.Update(slide);
        await unitOfWork.SaveChangesAsync(ct);
        return ToDto(slide);
    }

    public async Task DeleteAsync(int id, CancellationToken ct = default)
    {
        var slide = await repository.GetByIdAsync(id, ct)
                    ?? throw AppException.NotFound($"Slide hero #{id}");
        repository.Remove(slide);
        await unitOfWork.SaveChangesAsync(ct);
    }

    private static void Validate(string imageUrl, string altText)
    {
        if (string.IsNullOrWhiteSpace(imageUrl))
        {
            throw AppException.BadRequest("Ảnh slide không được để trống.");
        }
        if (string.IsNullOrWhiteSpace(altText))
        {
            throw AppException.BadRequest("Chú thích ảnh (alt) không được để trống.");
        }
    }

    private static HeroSlideDto ToDto(HeroSlide s) => new()
    {
        Id = s.Id,
        ImageUrl = s.ImageUrl,
        AltText = s.AltText,
        Href = s.Href,
        SortOrder = s.SortOrder,
        IsActive = s.IsActive,
    };
}
