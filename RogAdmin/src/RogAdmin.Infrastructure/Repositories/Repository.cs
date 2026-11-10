using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using RogAdmin.Application.Interfaces;
using RogAdmin.Domain.Common;
using RogAdmin.Infrastructure.Persistence;

namespace RogAdmin.Infrastructure.Repositories;

/// <summary>Repository generic cài đặt bằng EF Core cho mọi entity.</summary>
public class Repository<T>(RogAdminDbContext context) : IRepository<T>
    where T : BaseEntity
{
    protected readonly RogAdminDbContext Context = context;
    protected readonly DbSet<T> Set = context.Set<T>();

    public Task<T?> GetByIdAsync(int id, CancellationToken ct = default)
        => Set.FirstOrDefaultAsync(e => e.Id == id, ct);

    public async Task<IReadOnlyList<T>> ListAsync(CancellationToken ct = default)
        => await Set.ToListAsync(ct);

    public IQueryable<T> Query() => Set.AsQueryable();

    public async Task<IReadOnlyList<T>> FindAsync(Expression<Func<T, bool>> predicate, CancellationToken ct = default)
        => await Set.Where(predicate).ToListAsync(ct);

    public async Task AddAsync(T entity, CancellationToken ct = default)
        => await Set.AddAsync(entity, ct);

    public void Update(T entity) => Set.Update(entity);

    public void Remove(T entity) => Set.Remove(entity);
}

/// <summary>Đơn vị công tác — commit thay đổi của các repository xuống DB.</summary>
public class UnitOfWork(RogAdminDbContext context) : IUnitOfWork
{
    public Task<int> SaveChangesAsync(CancellationToken ct = default) => context.SaveChangesAsync(ct);
}
