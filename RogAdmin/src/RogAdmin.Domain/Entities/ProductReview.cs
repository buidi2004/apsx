namespace RogAdmin.Domain.Entities;

public class ProductReview
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string ProductSlug { get; set; } = string.Empty;
    public string AuthorName { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public int Rating { get; set; }
    public bool IsApproved { get; set; }
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}
