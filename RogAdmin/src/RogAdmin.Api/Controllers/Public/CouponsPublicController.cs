using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RogAdmin.Domain.Enums;
using RogAdmin.Infrastructure.Persistence;

namespace RogAdmin.Api.Controllers.Public;

public record ValidateCouponRequest(string Code, long OrderSubtotal);
public record ValidateCouponResponse(
    bool Valid,
    string Code,
    string Title,
    string Message,
    long DiscountAmount,
    long FinalTotal
);
public record PublicCouponDto(
    string Code,
    string Title,
    string Description,
    string DiscountType,
    decimal DiscountValue,
    decimal MinOrderValue,
    decimal? MaxDiscountAmount,
    DateTime? ValidTo
);

[ApiController]
[Route("api/public/coupons")]
public class CouponsPublicController(RogAdminDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<PublicCouponDto>>> GetPublicCoupons(CancellationToken ct)
    {
        var now = DateTime.UtcNow;
        var coupons = await db.Coupons
            .AsNoTracking()
            .Where(c => c.IsActive && (!c.ValidFrom.HasValue || c.ValidFrom.Value <= now) && (!c.ValidTo.HasValue || c.ValidTo.Value >= now) && (c.UsageLimit == 0 || c.UsedCount < c.UsageLimit))
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => new PublicCouponDto(
                c.Code,
                c.Title,
                c.Description,
                c.DiscountType == DiscountType.Percentage ? "Percentage" : "FixedAmount",
                c.DiscountValue,
                c.MinOrderValue,
                c.MaxDiscountAmount,
                c.ValidTo
            ))
            .ToListAsync(ct);

        return Ok(coupons);
    }

    [HttpPost("validate")]
    public async Task<ActionResult<ValidateCouponResponse>> Validate([FromBody] ValidateCouponRequest req, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(req.Code))
        {
            return Ok(new ValidateCouponResponse(false, "", "", "Vui lòng nhập mã giảm giá.", 0, req.OrderSubtotal));
        }

        var code = req.Code.Trim().ToUpperInvariant();
        var coupon = await db.Coupons
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Code == code, ct);

        if (coupon == null || !coupon.IsActive)
        {
            return Ok(new ValidateCouponResponse(false, code, "", "Mã giảm giá không tồn tại hoặc đã bị tắt.", 0, req.OrderSubtotal));
        }

        var now = DateTime.UtcNow;
        if (coupon.ValidFrom.HasValue && coupon.ValidFrom.Value > now)
        {
            return Ok(new ValidateCouponResponse(false, code, coupon.Title, "Mã giảm giá chưa đến ngày bắt đầu áp dụng.", 0, req.OrderSubtotal));
        }
        if (coupon.ValidTo.HasValue && coupon.ValidTo.Value < now)
        {
            return Ok(new ValidateCouponResponse(false, code, coupon.Title, "Mã giảm giá đã hết hạn sử dụng.", 0, req.OrderSubtotal));
        }

        if (coupon.UsageLimit > 0 && coupon.UsedCount >= coupon.UsageLimit)
        {
            return Ok(new ValidateCouponResponse(false, code, coupon.Title, "Mã giảm giá đã hết số lượt sử dụng tối đa.", 0, req.OrderSubtotal));
        }

        if (req.OrderSubtotal < (long)coupon.MinOrderValue)
        {
            return Ok(new ValidateCouponResponse(
                false,
                code,
                coupon.Title,
                $"Đơn hàng chưa đạt giá trị tối thiểu {coupon.MinOrderValue:N0} VNĐ để áp dụng mã này.",
                0,
                req.OrderSubtotal));
        }

        long discountAmount;
        if (coupon.DiscountType == DiscountType.Percentage)
        {
            var calc = (long)Math.Round((decimal)req.OrderSubtotal * coupon.DiscountValue / 100m);
            if (coupon.MaxDiscountAmount.HasValue && calc > (long)coupon.MaxDiscountAmount.Value)
            {
                calc = (long)coupon.MaxDiscountAmount.Value;
            }
            discountAmount = calc;
        }
        else
        {
            discountAmount = (long)coupon.DiscountValue;
        }

        discountAmount = Math.Min(discountAmount, req.OrderSubtotal);
        var finalTotal = Math.Max(0, req.OrderSubtotal - discountAmount);

        return Ok(new ValidateCouponResponse(
            true,
            coupon.Code,
            coupon.Title,
            $"Áp dụng thành công mã {coupon.Code}: Tiết kiệm {discountAmount:N0} VNĐ!",
            discountAmount,
            finalTotal));
    }
}
