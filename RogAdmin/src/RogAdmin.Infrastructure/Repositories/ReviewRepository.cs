using RogAdmin.Application.Interfaces;
using RogAdmin.Domain.Entities;
using RogAdmin.Infrastructure.Persistence;

namespace RogAdmin.Infrastructure.Repositories;

public class ReviewRepository(RogAdminDbContext context) : IReviewRepository
{
    public IQueryable<ProductReview> Query() => context.ProductReviews.AsQueryable();
}
