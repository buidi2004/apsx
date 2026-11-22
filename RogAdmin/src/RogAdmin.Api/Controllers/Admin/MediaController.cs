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
        ".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"
    };

    /// <summary>Kiểm tra header tệp có đúng là ảnh raster tương ứng đuôi mở rộng.</summary>
    private static bool MatchesSignature(string ext, ReadOnlySpan<byte> h)
    {
        if (h.Length < 12) return false;
        return ext switch
        {
            ".jpg" or ".jpeg" => h[0] == 0xFF && h[1] == 0xD8 && h[2] == 0xFF,
            ".png" => h[0] == 0x89 && h[1] == 0x50 && h[2] == 0x4E && h[3] == 0x47,
            ".gif" => h[0] == 0x47 && h[1] == 0x49 && h[2] == 0x46 && h[3] == 0x38,
            ".webp" => h[0] == 0x52 && h[1] == 0x49 && h[2] == 0x46 && h[3] == 0x46
                        && h[8] == 0x57 && h[9] == 0x45 && h[10] == 0x42 && h[11] == 0x50,
            ".avif" => h[4] == 0x66 && h[5] == 0x74 && h[6] == 0x79 && h[7] == 0x70
                        && h[8] == 0x61 && h[9] == 0x76 && h[10] == 0x69 && (h[11] == 0x66 || h[11] == 0x73),
            _ => false
        };
    }

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
            return BadRequest(new { message = $"Định dạng ảnh '{ext}' không được hỗ trợ. Chỉ chấp nhận JPG, PNG, WEBP, GIF, AVIF." });

        // Kiểm tra chữ ký tệp (magic bytes) — không tin phần mở rộng do client gửi lên.
        await using (var probe = file.OpenReadStream())
        {
            var header = new byte[12];
            var read = await probe.ReadAsync(header.AsMemory(0, header.Length), ct);
            if (!MatchesSignature(ext, header.AsSpan(0, read)))
                return BadRequest(new { message = "Nội dung tệp không khớp với định dạng ảnh." });
        }

        var uploadsFolder = Path.Combine(env.WebRootPath ?? Path.Combine(AppContext.BaseDirectory, "wwwroot"), "uploads");
        if (!Directory.Exists(uploadsFolder))
        {
            Directory.CreateDirectory(uploadsFolder);
        }

        var fileName = $"{DateTime.UtcNow:yyyyMMdd_HHmmss}_{Guid.NewGuid().ToString("N")[..8]}{ext}";
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

    /// <summary>Danh sách tệp hình ảnh đã tải lên.</summary>
    [HttpGet]
    public IActionResult GetUploadedMedia()
    {
        var uploadsFolder = Path.Combine(env.WebRootPath ?? Path.Combine(AppContext.BaseDirectory, "wwwroot"), "uploads");
        if (!Directory.Exists(uploadsFolder))
        {
            return Ok(Array.Empty<object>());
        }

        var dirInfo = new DirectoryInfo(uploadsFolder);
        var files = dirInfo.GetFiles()
            .Where(f => AllowedExtensions.Contains(f.Extension))
            .OrderByDescending(f => f.CreationTimeUtc)
            .Select(f => new
            {
                fileName = f.Name,
                url = $"/uploads/{f.Name}",
                size = f.Length,
                createdAt = f.CreationTimeUtc
            })
            .Take(100)
            .ToList();

        return Ok(files);
    }

    /// <summary>Xóa tệp hình ảnh đã tải lên.</summary>
    [HttpDelete("{fileName}")]
    [Authorize(Roles = "Admin")]
    public IActionResult DeleteMedia(string fileName)
    {
        var safeFileName = Path.GetFileName(fileName);
        var uploadsFolder = Path.Combine(env.WebRootPath ?? Path.Combine(AppContext.BaseDirectory, "wwwroot"), "uploads");
        var filePath = Path.Combine(uploadsFolder, safeFileName);

        if (!System.IO.File.Exists(filePath))
        {
            return NotFound(new { message = $"Không tìm thấy tệp {safeFileName}" });
        }

        System.IO.File.Delete(filePath);
        return NoContent();
    }
}
