namespace RogAdmin.Application.Dtos.Newsletter;

public record NewsletterSubscriberDto(
    Guid Id,
    string Email,
    DateTime CreatedAtUtc
);
