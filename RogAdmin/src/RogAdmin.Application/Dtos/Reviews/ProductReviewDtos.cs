namespace RogAdmin.Application.Dtos.Reviews;

public record ProductReviewDto(
    Guid Id,
    string ProductSlug,
    string AuthorName,
    string Title,
    string Content,
    int Rating,
    bool IsApproved,
    DateTime CreatedAtUtc,
    string? AdminReply = null,
    DateTime? RepliedAt = null,
    string? RepliedBy = null
);
