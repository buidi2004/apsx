using System.Net.Mail;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.EntityFrameworkCore;
using RogAdmin.Application.Dtos.Public;
using RogAdmin.Application.Interfaces;
using RogAdmin.Domain.Entities;
using RogAdmin.Domain.Enums;
using RogAdmin.Infrastructure.Persistence;

namespace RogAdmin.Api.Controllers.Public;

[ApiController]
[Route("api/public")]
[OutputCache(PolicyName = "PublicCache")]
[ResponseCache(Duration = 60, Location = ResponseCacheLocation.Any)]
public class PublicContentController(IPublicContentService service, RogAdminDbContext db) : ControllerBase
{
    public sealed record NewsletterSubscribeRequest(string Email);
    public sealed record ProductReviewRequest(string ProductSlug, string? AuthorName, string? Title, string Content, int Rating);

    [HttpPost("reviews")]
    public async Task<IActionResult> SubmitReview([FromBody] ProductReviewRequest request, CancellationToken ct)
    {
        var slug = request.ProductSlug?.Trim();
        var content = request.Content?.Trim();
        if (string.IsNullOrWhiteSpace(slug) || string.IsNullOrWhiteSpace(content))
            return BadRequest(new { message = "Thiếu slug sản phẩm hoặc nội dung đánh giá." });
        if (content.Length > 2000)
            return BadRequest(new { message = "Nội dung đánh giá không được vượt quá 2000 ký tự." });
        if (request.Rating is < 1 or > 5)
            return BadRequest(new { message = "Điểm đánh giá phải từ 1 đến 5." });

        db.ProductReviews.Add(new ProductReview
        {
            ProductSlug = slug,
            AuthorName = string.IsNullOrWhiteSpace(request.AuthorName) ? "Khách ROG" : request.AuthorName.Trim(),
            Title = request.Title?.Trim() ?? string.Empty,
            Content = content,
            Rating = request.Rating,
            IsApproved = false,
        });
        await db.SaveChangesAsync(ct);
        return Ok(new { submitted = true });
    }

    [HttpPost("newsletter/subscribe")]
    public async Task<IActionResult> SubscribeNewsletter([FromBody] NewsletterSubscribeRequest request, CancellationToken ct)
    {
        var email = request.Email?.Trim().ToLowerInvariant();
        if (string.IsNullOrWhiteSpace(email) || email.Length > 320 || !IsValidEmail(email))
            return BadRequest(new { message = "Email không hợp lệ." });

        var exists = await db.NewsletterSubscribers.AnyAsync(s => s.Email == email, ct);
        if (!exists)
        {
            db.NewsletterSubscribers.Add(new NewsletterSubscriber { Email = email });
            try
            {
                await db.SaveChangesAsync(ct);
            }
            catch (DbUpdateException)
            {
                // Another request may have registered the same address concurrently.
                db.ChangeTracker.Clear();
            }
        }

        return Ok(new { subscribed = true });
    }

    private static bool IsValidEmail(string email)
    {
        try
        {
            var address = new MailAddress(email);
            return string.Equals(address.Address, email, StringComparison.OrdinalIgnoreCase);
        }
        catch (FormatException)
        {
            return false;
        }
    }

    /// <summary>Slide hero trang chủ — shape {src, alt, href} như FE.</summary>
    [HttpGet("hero-slides")]
    public async Task<ActionResult<IReadOnlyList<PublicHeroSlideDto>>> GetHeroSlides(CancellationToken ct)
        => Ok(await service.GetHeroSlidesAsync(ct));

    /// <summary>Danh mục sản phẩm — shape {image, label, href} như FE.</summary>
    [HttpGet("product-categories")]
    public async Task<ActionResult<IReadOnlyList<PublicProductCategoryDto>>> GetProductCategories(CancellationToken ct)
        => Ok(await service.GetProductCategoriesAsync(ct));

    /// <summary>
    /// Bài viết — shape {img, tag, title, excerpt, date, href} như FE.
    /// section: highlights | listing (bỏ trống lấy tất cả).
    /// tag: có/không prefix "// " đều được (ví dụ "Guides" hoặc "// Guides").
    /// </summary>
    [HttpGet("articles")]
    public async Task<ActionResult<IReadOnlyList<PublicArticleDto>>> GetArticles(
        [FromQuery] string? section,
        [FromQuery] string? tag,
        CancellationToken ct)
        => Ok(await service.GetArticlesAsync(section, tag, ct));

    /// <summary>Cấu hình site: PromoBar, JoinRepublic, footer (links/legal/social/company/newsletter/badge).</summary>
    [HttpGet("articles/{**slug}")]
    public async Task<ActionResult<PublicArticleDetailDto>> GetArticle([FromRoute] string slug, CancellationToken ct)
    {
        var article = await service.GetArticleAsync(slug, ct);
        return article == null
            ? NotFound(new { message = $"Không tìm thấy bài viết: {slug}" })
            : Ok(article);
    }

    [HttpGet("site-config")]
    public async Task<ActionResult<PublicSiteConfigDto>> GetSiteConfig(CancellationToken ct)
        => Ok(await service.GetSiteConfigAsync(ct));
}
