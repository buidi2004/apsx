using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace RogAdmin.Api.Controllers.Admin;

public class UploadMediaRequest
{
    public IFormFile? File { get; set; }
}

[ApiController]
[Route("api/admin/media")]
[Authorize(Roles = "Admin,Editor")]
public class MediaController(IWebHostEnvironment env) : ControllerBase
{
    private static readonly HashSet<string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".avif"
    };

    /// <summary>
    /// Tải lên tệp hình ảnh cho sản phẩm, bài viết, banner hero, v.v.
    /// POST /api/admin/media/upload
    /// </summary>
    [HttpPost("upload")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UploadImage([FromForm] UploadMediaRequest request, CancellationToken ct = default)
    {
        var file = request.File;
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "Vui lòng chọn một tệp hình ảnh hợp lệ" });

        if (file.Length > 10 * 1024 * 1024)
            return BadRequest(new { message = "Dung lượng ảnh tối đa là 10 MB" });

        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!AllowedExtensions.Contains(ext))
            return BadRequest(new { message = $"Định dạng ảnh '{ext}' không được hỗ trợ. Chỉ chấp nhận JPG, PNG, WEBP, GIF, SVG, AVIF." });

        var uploadsFolder = Path.Combine(env.WebRootPath ?? Path.Combine(AppContext.BaseDirectory, "wwwroot"), "uploads");
        if (!Directory.Exists(uploadsFolder))
        {
            Directory.CreateDirectory(uploadsFolder);
        }

        var fileName = $"{DateTime.UtcNow:yyyyMMdd_HHmmss}_{Guid.NewGuid():N[..8]}{ext}";
        var filePath = Path.Combine(uploadsFolder, fileName);

        await using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream, ct);
        }

        var relativeUrl = $"/uploads/{fileName}";
        return Ok(new
        {
            url = relativeUrl,
            fileName,
            originalName = file.FileName,
            size = file.Length,
            message = "Tải ảnh lên thành công"
        });
    }
}
