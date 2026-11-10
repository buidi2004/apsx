using System.ComponentModel.DataAnnotations;

namespace RogAdmin.Application.Dtos.HeroSlides;

public class HeroSlideDto
{
    public int Id { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string AltText { get; set; } = string.Empty;
    public string? Href { get; set; }
    public int SortOrder { get; set; }
    public bool IsActive { get; set; }
}

public class CreateHeroSlideRequest
{
    [Required(ErrorMessage = "Ảnh slide không được để trống.")]
    [MaxLength(500, ErrorMessage = "URL ảnh tối đa 500 ký tự.")]
    public string ImageUrl { get; set; } = string.Empty;

    [Required(ErrorMessage = "Chú thích ảnh (alt) không được để trống.")]
    [MaxLength(300, ErrorMessage = "Chú thích tối đa 300 ký tự.")]
    public string AltText { get; set; } = string.Empty;

    [MaxLength(500, ErrorMessage = "Đường dẫn tối đa 500 ký tự.")]
    public string? Href { get; set; }

    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
}

public class UpdateHeroSlideRequest
{
    [Required(ErrorMessage = "Ảnh slide không được để trống.")]
    [MaxLength(500, ErrorMessage = "URL ảnh tối đa 500 ký tự.")]
    public string ImageUrl { get; set; } = string.Empty;

    [Required(ErrorMessage = "Chú thích ảnh (alt) không được để trống.")]
    [MaxLength(300, ErrorMessage = "Chú thích tối đa 300 ký tự.")]
    public string AltText { get; set; } = string.Empty;

    [MaxLength(500, ErrorMessage = "Đường dẫn tối đa 500 ký tự.")]
    public string? Href { get; set; }

    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
}
