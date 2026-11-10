namespace RogAdmin.Application.Common;

/// <summary>
/// Chuẩn hóa tag về đúng một quy ước duy nhất của FE: prefix "// " + nội dung,
/// không phân biệt người dùng có gõ prefix hay không, gộp khoảng trắng thừa.
/// Dùng chung cho ghi dữ liệu (ArticleService) và lọc public (PublicContentService).
/// </summary>
public static class TagNormalizer
{
    public static string Normalize(string? tag)
    {
        if (string.IsNullOrWhiteSpace(tag))
        {
            return string.Empty;
        }

        // Bỏ mọi prefix kiểu "// ", "///", "//" rồi gộp khoảng trắng
        var content = tag.Trim().TrimStart('/', ' ', '\t');
        content = string.Join(' ', content.Split(' ', StringSplitOptions.RemoveEmptyEntries));
        return content.Length == 0 ? string.Empty : $"// {content}";
    }

    public static string Slugify(string? text)
    {
        if (string.IsNullOrWhiteSpace(text)) return string.Empty;
        var s = text.Trim().ToLowerInvariant();
        s = System.Text.RegularExpressions.Regex.Replace(s, @"\s+", "-");
        s = System.Text.RegularExpressions.Regex.Replace(s, @"[^\w\-]+", "");
        s = System.Text.RegularExpressions.Regex.Replace(s, @"\-\-+", "-");
        return s.Trim('-');
    }
}
