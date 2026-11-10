using RogAdmin.Application.Common;
using RogAdmin.Application.Dtos.Articles;

namespace RogAdmin.Application.Interfaces;

public interface IArticleService
{
    Task<PagedResult<ArticleDto>> GetPagedAsync(ArticleQuery query, CancellationToken ct = default);

    /// <summary>Danh sách chuyên mục (tag) phân biệt — dùng cho dropdown lọc ở admin UI.</summary>
    Task<IReadOnlyList<string>> GetDistinctTagsAsync(CancellationToken ct = default);
    Task<ArticleDto> GetByIdAsync(int id, CancellationToken ct = default);
    Task<ArticleDto> CreateAsync(CreateArticleRequest request, CancellationToken ct = default);
    Task<ArticleDto> UpdateAsync(int id, UpdateArticleRequest request, CancellationToken ct = default);
    Task DeleteAsync(int id, CancellationToken ct = default);
}
