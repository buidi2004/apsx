using System.ComponentModel.DataAnnotations;
using RogAdmin.Domain.Enums;

namespace RogAdmin.Application.Dtos.FooterLinks;

public class FooterLinkDto
{
    public int Id { get; set; }
    public string Label { get; set; } = string.Empty;
    public string Href { get; set; } = string.Empty;
    public FooterLinkGroup Group { get; set; }
    public int SortOrder { get; set; }
    public bool IsActive { get; set; }
}

public class CreateFooterLinkRequest
{
    [Required(ErrorMessage = "Nhãn link không được để trống.")]
    [MaxLength(150, ErrorMessage = "Nhãn tối đa 150 ký tự.")]
    public string Label { get; set; } = string.Empty;

    [Required(ErrorMessage = "Đường dẫn link không được để trống.")]
    [MaxLength(500, ErrorMessage = "Đường dẫn tối đa 500 ký tự.")]
    public string Href { get; set; } = string.Empty;

    public FooterLinkGroup Group { get; set; } = FooterLinkGroup.Footer;
    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
}

public class UpdateFooterLinkRequest
{
    [Required(ErrorMessage = "Nhãn link không được để trống.")]
    [MaxLength(150, ErrorMessage = "Nhãn tối đa 150 ký tự.")]
    public string Label { get; set; } = string.Empty;

    [Required(ErrorMessage = "Đường dẫn link không được để trống.")]
    [MaxLength(500, ErrorMessage = "Đường dẫn tối đa 500 ký tự.")]
    public string Href { get; set; } = string.Empty;

    public FooterLinkGroup Group { get; set; } = FooterLinkGroup.Footer;
    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
}
