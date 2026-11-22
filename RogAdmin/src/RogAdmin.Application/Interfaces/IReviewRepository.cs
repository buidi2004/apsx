using RogAdmin.Domain.Entities;

namespace RogAdmin.Application.Interfaces;

public interface IReviewRepository
{
    IQueryable<ProductReview> Query();
}
