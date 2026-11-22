namespace RogAdmin.Application.Dtos.Audit;

public record AuditLogDto(
    int Id,
    string Username,
    string Action,
    string EntityName,
    string? EntityId,
    string Details,
    string? IpAddress,
    DateTime CreatedAt
);
