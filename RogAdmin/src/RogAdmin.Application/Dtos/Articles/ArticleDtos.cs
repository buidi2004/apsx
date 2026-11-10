using System.ComponentModel.DataAnnotations;
using RogAdmin.Domain.Enums;

namespace RogAdmin.Application.Dtos.Articles;

/// <summary>Bài viết cho admin — đủ field kể cả ẩn/hiện.</summary>
public class ArticleDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Excerpt { get; set; }
    public string Tag { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string Href { get; set; } = string.Empty;
    public DateTime? PublishedDate { get; set; }
    public ArticleSection Section { get; set; }
    public bool IsBig { get; set; }
    public string? OverlayText { get; set; }
    public int SortOrder { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class CreateArticleRequest
{
    [Required(ErrorMessage = "Tiêu đề bài viết không được để trống.")]
    [MaxLength(300, ErrorMessage = "Tiêu đề tối đa 300 ký tự.")]
    public string Title { get; set; } = string.Empty;

    [MaxLength(1000, ErrorMessage = "Mô tả ngắn tối đa 1000 ký tự.")]
    public string? Excerpt { get; set; }

    [Required(ErrorMessage = "Tag/chuyên mục không được để trống.")]
    [MaxLength(100, ErrorMessage = "Tag tối đa 100 ký tự.")]
    public string Tag { get; set; } = string.Empty;

    [Required(ErrorMessage = "Ảnh bài viết không được để trống.")]
    [MaxLength(500, ErrorMessage = "URL ảnh tối đa 500 ký tự.")]
    public string ImageUrl { get; set; } = string.Empty;

    [Required(ErrorMessage = "Đường dẫn bài viết không được để trống.")]
    [MaxLength(500, ErrorMessage = "Đường dẫn tối đa 500 ký tự.")]
    public string Href { get; set; } = string.Empty;

    public DateTime? PublishedDate { get; set; }

    public ArticleSection Section { get; set; } = ArticleSection.Listing;
    public bool IsBig { get; set; }

    [MaxLength(300, ErrorMessage = "Overlay tối đa 300 ký tự.")]
    public string? OverlayText { get; set; }

    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
}

public class UpdateArticleRequest
{
    [Required(ErrorMessage = "Tiêu đề bài viết không được để trống.")]
    [MaxLength(300, ErrorMessage = "Tiêu đề tối đa 300 ký tự.")]
    public string Title { get; set; } = string.Empty;

    [MaxLength(1000, ErrorMessage = "Mô tả ngắn tối đa 1000 ký tự.")]
    public string? Excerpt { get; set; }

    [Required(ErrorMessage = "Tag/chuyên mục không được để trống.")]
    [MaxLength(100, ErrorMessage = "Tag tối đa 100 ký tự.")]
    public string Tag { get; set; } = string.Empty;

    [Required(ErrorMessage = "Ảnh bài viết không được để trống.")]
    [MaxLength(500, ErrorMessage = "URL ảnh tối đa 500 ký tự.")]
    public string ImageUrl { get; set; } = string.Empty;

    [Required(ErrorMessage = "Đường dẫn bài viết không được để trống.")]
    [MaxLength(500, ErrorMessage = "Đường dẫn tối đa 500 ký tự.")]
    public string Href { get; set; } = string.Empty;

    public DateTime? PublishedDate { get; set; }

    public ArticleSection Section { get; set; } = ArticleSection.Listing;
    public bool IsBig { get; set; }

    [MaxLength(300, ErrorMessage = "Overlay tối đa 300 ký tự.")]
    public string? OverlayText { get; set; }

    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
}

/// <summary>Tham số lọc danh sách. Tag truyền KHÔNG kèm prefix "// " (giống dropdown FE).</summary>
public class ArticleQuery
{
    public ArticleSection? Section { get; set; }
    public string? Tag { get; set; }
    public string? Search { get; set; }
    public bool IncludeInactive { get; set; } = true;
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}
