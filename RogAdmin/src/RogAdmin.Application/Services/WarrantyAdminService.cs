using Microsoft.EntityFrameworkCore;
using RogAdmin.Application.Common;
using RogAdmin.Application.Dtos.Warranty;
using RogAdmin.Application.Interfaces;
using RogAdmin.Domain.Entities;
using RogAdmin.Domain.Enums;

namespace RogAdmin.Application.Services;

public class WarrantyAdminService(
    IRepository<WarrantyRecord> warrantyRepo,
    IUnitOfWork unitOfWork) : IWarrantyAdminService
{
    private static string GetStatusText(WarrantyStatus status, DateTime expiry)
    {
        if (status == WarrantyStatus.InService) return "Đang tiếp nhận xử lý tại TTBH";
        if (status == WarrantyStatus.Expired || DateTime.UtcNow > expiry) return "Hết hạn bảo hành";
        return "Còn hạn bảo hành chính hãng";
    }

    public async Task<PagedResult<WarrantyRecordDto>> GetPagedAsync(
        string? search, int page = 1, int pageSize = 20, CancellationToken ct = default)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = warrantyRepo.Query().AsNoTracking();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim().ToLower();
            query = query.Where(w => w.SerialNumber.ToLower().Contains(s) || w.ProductModel.ToLower().Contains(s) || w.ServiceCenter.ToLower().Contains(s));
        }

        var total = await query.CountAsync(ct);
        var records = await query
            .OrderByDescending(w => w.PurchaseDate)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        var dtos = records.Select(w => new WarrantyRecordDto(
            w.Id,
            w.SerialNumber,
            w.ProductModel,
            w.PurchaseDate,
            w.ExpiryDate,
            w.Status,
            GetStatusText(w.Status, w.ExpiryDate),
            w.ServiceCenter
        )).ToList();

        return new PagedResult<WarrantyRecordDto>
        {
            Items = dtos,
            Page = page,
            PageSize = pageSize,
            TotalCount = total
        };
    }

    public async Task<WarrantyRecordDto?> GetByIdAsync(int id, CancellationToken ct = default)
    {
        var w = await warrantyRepo.GetByIdAsync(id, ct);
        if (w == null) return null;

        return new WarrantyRecordDto(
            w.Id,
            w.SerialNumber,
            w.ProductModel,
            w.PurchaseDate,
            w.ExpiryDate,
            w.Status,
            GetStatusText(w.Status, w.ExpiryDate),
            w.ServiceCenter
        );
    }

    public async Task<WarrantyRecordDto> CreateAsync(CreateWarrantyRecordRequest request, CancellationToken ct = default)
    {
        var record = new WarrantyRecord
        {
            SerialNumber = request.SerialNumber.Trim().ToUpperInvariant(),
            ProductModel = request.ProductModel.Trim(),
            PurchaseDate = request.PurchaseDate,
            ExpiryDate = request.ExpiryDate,
            Status = request.Status,
            ServiceCenter = string.IsNullOrWhiteSpace(request.ServiceCenter)
                ? "ASUS Service Center TP.HCM - 285 CMT8"
                : request.ServiceCenter.Trim()
        };

        await warrantyRepo.AddAsync(record, ct);
        await unitOfWork.SaveChangesAsync(ct);

        return new WarrantyRecordDto(
            record.Id,
            record.SerialNumber,
            record.ProductModel,
            record.PurchaseDate,
            record.ExpiryDate,
            record.Status,
            GetStatusText(record.Status, record.ExpiryDate),
            record.ServiceCenter
        );
    }

    public async Task<WarrantyRecordDto?> UpdateAsync(int id, UpdateWarrantyRecordRequest request, CancellationToken ct = default)
    {
        var record = await warrantyRepo.GetByIdAsync(id, ct);
        if (record == null) return null;

        record.SerialNumber = request.SerialNumber.Trim().ToUpperInvariant();
        record.ProductModel = request.ProductModel.Trim();
        record.PurchaseDate = request.PurchaseDate;
        record.ExpiryDate = request.ExpiryDate;
        record.Status = request.Status;
        record.ServiceCenter = request.ServiceCenter.Trim();

        warrantyRepo.Update(record);
        await unitOfWork.SaveChangesAsync(ct);

        return new WarrantyRecordDto(
            record.Id,
            record.SerialNumber,
            record.ProductModel,
            record.PurchaseDate,
            record.ExpiryDate,
            record.Status,
            GetStatusText(record.Status, record.ExpiryDate),
            record.ServiceCenter
        );
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
    {
        var record = await warrantyRepo.GetByIdAsync(id, ct);
        if (record == null) return false;

        warrantyRepo.Remove(record);
        await unitOfWork.SaveChangesAsync(ct);
        return true;
    }
}
