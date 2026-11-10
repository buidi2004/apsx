namespace RogAdmin.Application.Exceptions;

/// <summary>Lỗi nghiệp vụ — middleware API map StatusCode này vào HTTP response.</summary>
public class AppException : Exception
{
    public int StatusCode { get; }

    public AppException(string message, int statusCode = 400) : base(message)
    {
        StatusCode = statusCode;
    }

    public static AppException NotFound(string what) => new($"{what} không tồn tại.", 404);
    public static AppException BadRequest(string message) => new(message, 400);
    public static AppException Unauthorized(string message = "Thông tin đăng nhập không đúng.") => new(message, 401);
    public static AppException Conflict(string message) => new(message, 409);
}
