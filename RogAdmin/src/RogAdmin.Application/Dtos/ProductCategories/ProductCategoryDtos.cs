using System.ComponentModel.DataAnnotations;

namespace RogAdmin.Application.Dtos.ProductCategories;

public class ProductCategoryDto
{
    public int Id { get; set; }
    public string Label { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string Href { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    public bool IsActive { get; set; }
}

public class CreateProductCategoryRequest
{
    [Required(ErrorMessage = "Tên danh mục không được để trống.")]
    [MaxLength(150, ErrorMessage = "Tên danh mục tối đa 150 ký tự.")]
    public string Label { get; set; } = string.Empty;

    [Required(ErrorMessage = "Ảnh danh mục không được để trống.")]
    [MaxLength(500, ErrorMessage = "URL ảnh tối đa 500 ký tự.")]
    public string ImageUrl { get; set; } = string.Empty;

    [Required(ErrorMessage = "Đường dẫn danh mục không được để trống.")]
    [MaxLength(500, ErrorMessage = "Đường dẫn tối đa 500 ký tự.")]
    public string Href { get; set; } = string.Empty;

    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
}

public class UpdateProductCategoryRequest
{
    [Required(ErrorMessage = "Tên danh mục không được để trống.")]
    [MaxLength(150, ErrorMessage = "Tên danh mục tối đa 150 ký tự.")]
    public string Label { get; set; } = string.Empty;

    [Required(ErrorMessage = "Ảnh danh mục không được để trống.")]
    [MaxLength(500, ErrorMessage = "URL ảnh tối đa 500 ký tự.")]
    public string ImageUrl { get; set; } = string.Empty;

    [Required(ErrorMessage = "Đường dẫn danh mục không được để trống.")]
    [MaxLength(500, ErrorMessage = "Đường dẫn tối đa 500 ký tự.")]
    public string Href { get; set; } = string.Empty;

    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
}
