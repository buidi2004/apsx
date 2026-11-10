using System.Linq.Expressions;
using RogAdmin.Domain.Common;

namespace RogAdmin.Application.Interfaces;

/// <summary>
/// Repository generic — tầng Application chỉ thấy interface này,
/// phần cài đặt EF Core nằm ở tầng Infrastructure.
/// </summary>
public interface IRepository<T> where T : Domain.Common.BaseEntity
{
    Task<T?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<IReadOnlyList<T>> ListAsync(CancellationToken ct = default);

    /// <summary>Chuỗi truy vấn compose thêm điều kiện phía service (chưa execute).</summary>
    IQueryable<T> Query();

    Task<IReadOnlyList<T>> FindAsync(Expression<Func<T, bool>> predicate, CancellationToken ct = default);
    Task AddAsync(T entity, CancellationToken ct = default);
    void Update(T entity);
    void Remove(T entity);
}

/// <summary>Đơn vị công tác — commit thay đổi xuống DB.</summary>
public interface IUnitOfWork
{
    Task<int> SaveChangesAsync(CancellationToken ct = default);
}
