using RogAdmin.Application.Common;
using RogAdmin.Application.Dtos.Articles;
using RogAdmin.Application.Exceptions;
using RogAdmin.Application.Interfaces;
using RogAdmin.Domain.Entities;
using RogAdmin.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace RogAdmin.Application.Services;

public class ArticleService(
    IRepository<Article> repository,
    IUnitOfWork unitOfWork) : IArticleService
{
    public async Task<PagedResult<ArticleDto>> GetPagedAsync(ArticleQuery query, CancellationToken ct = default)
    {
        var page = Math.Max(1, query.Page);
        var pageSize = Math.Clamp(query.PageSize, 1, 100);

        var q = repository.Query().AsNoTracking();

        if (!query.IncludeInactive)
        {
            q = q.Where(a => a.IsActive);
        }
        if (query.Section.HasValue)
        {
            q = q.Where(a => a.Section == query.Section.Value);
        }
        if (!string.IsNullOrWhiteSpace(query.Tag))
        {
            // FE so sánh tag kiểu `// ${filter}` — chấp nhận truyền có/không prefix
            var tag = TagNormalizer.Normalize(query.Tag);
            q = q.Where(a => a.Tag.ToLower() == tag.ToLower());
        }
        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var s = query.Search.Trim();
            q = q.Where(a => a.Title.ToLower().Contains(s.ToLower()));
        }

        var total = await q.CountAsync(ct);
        var items = await q
            .OrderBy(a => a.Section)
            .ThenBy(a => a.SortOrder)
            .ThenByDescending(a => a.PublishedDate)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        return new PagedResult<ArticleDto>
        {
            Items = items.Select(ToDto).ToList(),
            Page = page,
            PageSize = pageSize,
            TotalCount = total,
        };
    }

    public async Task<IReadOnlyList<string>> GetDistinctTagsAsync(CancellationToken ct = default)
        => await repository.Query().AsNoTracking()
            .Where(a => a.IsActive && a.Tag != "")
            .Select(a => a.Tag)
            .Distinct()
            .OrderBy(t => t)
            .ToListAsync(ct);

    public async Task<ArticleDto> GetByIdAsync(int id, CancellationToken ct = default)
    {
        var article = await repository.GetByIdAsync(id, ct)
                      ?? throw AppException.NotFound($"Bài viết #{id}");
        return ToDto(article);
    }

    public async Task<ArticleDto> CreateAsync(CreateArticleRequest request, CancellationToken ct = default)
    {
        // Chuẩn hóa tag TRƯỚC khi validate — tag chỉ toàn "/" như "//" sẽ rỗng sau normalize → 400
        var tag = TagNormalizer.Normalize(request.Tag);
        Validate(request.Title, request.ImageUrl, request.Href, tag);
        EnsureSectionValid(request.Section);

        var article = new Article
        {
            Title = request.Title.Trim(),
            Excerpt = request.Excerpt?.Trim(),
            Tag = tag,
            ImageUrl = request.ImageUrl.Trim(),
            Href = request.Href.Trim(),
            PublishedDate = request.PublishedDate,
            Section = request.Section,
            IsBig = request.IsBig,
            OverlayText = request.OverlayText?.Trim(),
            SortOrder = request.SortOrder,
            IsActive = request.IsActive,
        };

        await repository.AddAsync(article, ct);
        await unitOfWork.SaveChangesAsync(ct);
        return ToDto(article);
    }

    public async Task<ArticleDto> UpdateAsync(int id, UpdateArticleRequest request, CancellationToken ct = default)
    {
        var tag = TagNormalizer.Normalize(request.Tag);
        Validate(request.Title, request.ImageUrl, request.Href, tag);
        EnsureSectionValid(request.Section);

        var article = await repository.GetByIdAsync(id, ct)
                      ?? throw AppException.NotFound($"Bài viết #{id}");

        article.Title = request.Title.Trim();
        article.Excerpt = request.Excerpt?.Trim();
        article.Tag = tag;
        article.ImageUrl = request.ImageUrl.Trim();
        article.Href = request.Href.Trim();
        article.PublishedDate = request.PublishedDate;
        article.Section = request.Section;
        article.IsBig = request.IsBig;
        article.OverlayText = request.OverlayText?.Trim();
        article.SortOrder = request.SortOrder;
        article.IsActive = request.IsActive;
        article.UpdatedAt = DateTime.UtcNow;

        repository.Update(article);
        await unitOfWork.SaveChangesAsync(ct);
        return ToDto(article);
    }

    public async Task DeleteAsync(int id, CancellationToken ct = default)
    {
        var article = await repository.GetByIdAsync(id, ct)
                      ?? throw AppException.NotFound($"Bài viết #{id}");
        repository.Remove(article);
        await unitOfWork.SaveChangesAsync(ct);
    }

    /// <summary>Chặn enum rác (JsonStringEnumConverter nhận cả số, ví dụ 99) lưu xuống DB.</summary>
    private static void EnsureSectionValid(ArticleSection section)
    {
        if (!Enum.IsDefined(typeof(ArticleSection), section))
        {
            throw AppException.BadRequest("Khu vực bài viết chỉ nhận 'Highlights' hoặc 'Listing'.");
        }
    }

    private static void Validate(string title, string imageUrl, string href, string tag)
    {
        if (string.IsNullOrWhiteSpace(title))
        {
            throw AppException.BadRequest("Tiêu đề bài viết không được để trống.");
        }
        if (string.IsNullOrWhiteSpace(imageUrl))
        {
            throw AppException.BadRequest("Ảnh bài viết không được để trống.");
        }
        if (string.IsNullOrWhiteSpace(href))
        {
            throw AppException.BadRequest("Đường dẫn bài viết không được để trống.");
        }
        if (string.IsNullOrWhiteSpace(tag))
        {
            throw AppException.BadRequest("Tag/chuyên mục không được để trống.");
        }
    }

    /// <summary>Chuẩn hóa tag luôn có prefix "// " đúng quy ước dữ liệu FE (xem TagNormalizer).</summary>
    public static string NormalizeTag(string tag) => TagNormalizer.Normalize(tag);

    private static ArticleDto ToDto(Article a) => new()
    {
        Id = a.Id,
        Title = a.Title,
        Excerpt = a.Excerpt,
        Tag = a.Tag,
        ImageUrl = a.ImageUrl,
        Href = a.Href,
        PublishedDate = a.PublishedDate,
        Section = a.Section,
        IsBig = a.IsBig,
        OverlayText = a.OverlayText,
        SortOrder = a.SortOrder,
        IsActive = a.IsActive,
        CreatedAt = a.CreatedAt,
        UpdatedAt = a.UpdatedAt,
    };
}
