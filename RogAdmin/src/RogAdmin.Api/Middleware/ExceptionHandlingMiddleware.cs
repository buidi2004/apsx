using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using RogAdmin.Application.Exceptions;

namespace RogAdmin.Api.Middleware;

/// <summary>
/// Bắt lỗi toàn cục: AppException (lỗi nghiệp vụ) → mã HTTP tương ứng,
/// lỗi khác → 500 kèm log. Response thống nhất dạng { message }.
/// </summary>
public class ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (AppException ex)
        {
            logger.LogWarning("Lỗi nghiệp vụ {Status}: {Message}", ex.StatusCode, ex.Message);
            await WriteErrorAsync(context, ex.StatusCode, ex.Message);
        }
        catch (DbUpdateException ex)
        {
            // Trùng unique index / vi phạm ràng buộc (ví dụ race khi tạo username) → 409 thay vì 500
            logger.LogWarning("Xung đột dữ liệu khi xử lý {Method} {Path}: {Message}",
                context.Request.Method, context.Request.Path, ex.InnerException?.Message ?? ex.Message);
            await WriteErrorAsync(context, 409, "Dữ liệu bị trùng lặp hoặc vi phạm ràng buộc. Vui lòng kiểm tra lại.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Lỗi không mong muốn khi xử lý {Method} {Path}", context.Request.Method, context.Request.Path);
            await WriteErrorAsync(context, 500, "Có lỗi xảy ra phía máy chủ. Vui lòng thử lại sau.");
        }
    }

    private static async Task WriteErrorAsync(HttpContext context, int statusCode, string message)
    {
        if (context.Response.HasStarted)
        {
            return;
        }
        context.Response.Clear();
        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "application/json; charset=utf-8";
        await context.Response.WriteAsync(JsonSerializer.Serialize(new { message }, JsonOptions));
    }
}
