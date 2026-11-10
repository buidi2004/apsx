using Microsoft.EntityFrameworkCore;
using RogAdmin.Application.Interfaces;
using RogAdmin.Domain.Entities;

namespace RogAdmin.Infrastructure.Persistence;

/// <summary>
/// DbContext đồng thời hiện thực IUnitOfWork của tầng Application.
/// Provider (SqlServer | Sqlite) được chọn lúc runtime qua "Database:Provider".
/// </summary>
public class RogAdminDbContext(DbContextOptions<RogAdminDbContext> options)
    : DbContext(options), IUnitOfWork
{
    public DbSet<AdminUser> AdminUsers => Set<AdminUser>();
    public DbSet<Article> Articles => Set<Article>();
    public DbSet<HeroSlide> HeroSlides => Set<HeroSlide>();
    public DbSet<ProductCategory> ProductCategories => Set<ProductCategory>();
    public DbSet<FooterLink> FooterLinks => Set<FooterLink>();
    public DbSet<SiteSetting> SiteSettings => Set<SiteSetting>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<ProductSpec> ProductSpecs => Set<ProductSpec>();
    public DbSet<ProductPrice> ProductPrices => Set<ProductPrice>();
    public DbSet<Dealer> Dealers => Set<Dealer>();
    public DbSet<WarrantyRecord> WarrantyRecords => Set<WarrantyRecord>();
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<CartItem> CartItems => Set<CartItem>();
    public DbSet<NewsletterSubscriber> NewsletterSubscribers => Set<NewsletterSubscriber>();
    public DbSet<ProductReview> ProductReviews => Set<ProductReview>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<AdminUser>(e =>
        {
            e.ToTable("AdminUsers");
            e.HasIndex(u => u.Username).IsUnique();
            e.Property(u => u.Username).HasMaxLength(50).IsRequired();
            e.Property(u => u.FullName).HasMaxLength(150);
            e.Property(u => u.PasswordHash).HasMaxLength(500).IsRequired();
            e.Property(u => u.PasswordSalt).HasMaxLength(500).IsRequired();
            e.Property(u => u.Role).HasConversion<string>().HasMaxLength(20);
        });

        modelBuilder.Entity<ProductReview>(e =>
        {
            e.ToTable("ProductReviews");
            e.Property(r => r.ProductSlug).HasMaxLength(500).IsRequired();
            e.Property(r => r.AuthorName).HasMaxLength(150).IsRequired();
            e.Property(r => r.Title).HasMaxLength(300);
            e.Property(r => r.Content).IsRequired();
            e.HasIndex(r => r.ProductSlug);
        });

        modelBuilder.Entity<NewsletterSubscriber>(e =>
        {
            e.ToTable("NewsletterSubscribers");
            e.Property(s => s.Email).HasMaxLength(320).IsRequired();
            e.HasIndex(s => s.Email).IsUnique();
        });

        modelBuilder.Entity<Article>(e =>
        {
            e.ToTable("Articles");
            e.Property(a => a.Title).HasMaxLength(300).IsRequired();
            e.Property(a => a.Excerpt).HasMaxLength(1000);
            e.Property(a => a.Tag).HasMaxLength(100).IsRequired();
            e.Property(a => a.ImageUrl).HasMaxLength(500).IsRequired();
            e.Property(a => a.Href).HasMaxLength(500).IsRequired();
            e.Property(a => a.OverlayText).HasMaxLength(300);
            e.Property(a => a.Section).HasConversion<string>().HasMaxLength(20);
            e.HasIndex(a => new { a.Section, a.SortOrder });
        });

        modelBuilder.Entity<HeroSlide>(e =>
        {
            e.ToTable("HeroSlides");
            e.Property(s => s.ImageUrl).HasMaxLength(500).IsRequired();
            e.Property(s => s.AltText).HasMaxLength(300).IsRequired();
            e.Property(s => s.Href).HasMaxLength(500);
            e.HasIndex(s => s.SortOrder);
        });

        modelBuilder.Entity<ProductCategory>(e =>
        {
            e.ToTable("ProductCategories");
            e.Property(c => c.Label).HasMaxLength(150).IsRequired();
            e.Property(c => c.ImageUrl).HasMaxLength(500).IsRequired();
            e.Property(c => c.Href).HasMaxLength(500).IsRequired();
            e.HasIndex(c => c.SortOrder);
        });

        modelBuilder.Entity<FooterLink>(e =>
        {
            e.ToTable("FooterLinks");
            e.Property(l => l.Label).HasMaxLength(150).IsRequired();
            e.Property(l => l.Href).HasMaxLength(500).IsRequired();
            e.Property(l => l.Group).HasConversion<string>().HasMaxLength(20);
            e.HasIndex(l => new { l.Group, l.SortOrder });
        });

        modelBuilder.Entity<SiteSetting>(e =>
        {
            e.ToTable("SiteSettings");
            e.HasIndex(s => s.Key).IsUnique();
            e.Property(s => s.Key).HasMaxLength(100).IsRequired();
            e.Property(s => s.Value).HasMaxLength(2000).IsRequired();
            e.Property(s => s.Description).HasMaxLength(500);
        });

        modelBuilder.Entity<Product>(e =>
        {
            e.ToTable("Products");
            e.HasIndex(p => p.Slug).IsUnique();
            e.HasIndex(p => new { p.IsActive, p.CategorySlug });
            e.HasIndex(p => new { p.IsActive, p.IsHot, p.IsFeatured });
            e.HasIndex(p => p.ModelCode);
            e.Property(p => p.Slug).HasMaxLength(200).IsRequired();
            e.Property(p => p.Name).HasMaxLength(300).IsRequired();
            e.Property(p => p.CategorySlug).HasMaxLength(100).IsRequired();
            e.Property(p => p.ModelCode).HasMaxLength(100);
            e.Property(p => p.Tagline).HasMaxLength(500);
            e.Property(p => p.ThumbnailUrl).HasMaxLength(500);
            e.Property(p => p.KeyVisualUrl).HasMaxLength(500);
            e.Property(p => p.BasePath).HasMaxLength(300);
            e.HasMany(p => p.Specs)
             .WithOne(s => s.Product)
             .HasForeignKey(s => s.ProductId)
             .OnDelete(DeleteBehavior.Cascade);
            e.HasOne(p => p.Price)
             .WithOne(pr => pr.Product)
             .HasForeignKey<ProductPrice>(pr => pr.ProductId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<ProductSpec>(e =>
        {
            e.ToTable("ProductSpecs");
            e.Property(s => s.SpecGroup).HasMaxLength(100).IsRequired();
            e.Property(s => s.SpecKey).HasMaxLength(200).IsRequired();
            e.Property(s => s.SpecValue).HasMaxLength(2000).IsRequired();
            e.HasIndex(s => new { s.ProductId, s.SpecGroup });
        });

        modelBuilder.Entity<ProductPrice>(e =>
        {
            e.ToTable("ProductPrices");
            e.Property(p => p.Price).HasPrecision(18, 2);
            e.Property(p => p.OldPrice).HasPrecision(18, 2);
            e.Property(p => p.DiscountLabel).HasMaxLength(100);
            e.Property(p => p.StoreUrl).HasMaxLength(500);
            e.Property(p => p.StockStatus).HasConversion<int>();
        });

        modelBuilder.Entity<Dealer>(e =>
        {
            e.ToTable("Dealers");
            e.HasIndex(d => d.Slug).IsUnique();
            e.Property(d => d.Name).HasMaxLength(150).IsRequired();
            e.Property(d => d.Slug).HasMaxLength(100).IsRequired();
            e.Property(d => d.LogoUrl).HasMaxLength(500);
            e.Property(d => d.WebsiteUrl).HasMaxLength(500);
            e.Property(d => d.Hotline).HasMaxLength(50);
        });

        modelBuilder.Entity<WarrantyRecord>(e =>
        {
            e.ToTable("WarrantyRecords");
            e.HasIndex(w => w.SerialNumber).IsUnique();
            e.Property(w => w.SerialNumber).HasMaxLength(100).IsRequired();
            e.Property(w => w.ProductModel).HasMaxLength(200).IsRequired();
            e.Property(w => w.Status).HasConversion<int>();
        });

        modelBuilder.Entity<Customer>(e =>
        {
            e.ToTable("Customers");
            e.HasIndex(c => c.Email).IsUnique();
            e.Property(c => c.Email).HasMaxLength(150).IsRequired();
            e.Property(c => c.FullName).HasMaxLength(150).IsRequired();
            e.Property(c => c.PhoneNumber).HasMaxLength(50);
            e.Property(c => c.Tier).HasConversion<int>();
        });

        modelBuilder.Entity<CartItem>(e =>
        {
            e.ToTable("CartItems");
            e.HasOne(c => c.Customer)
             .WithMany(u => u.CartItems)
             .HasForeignKey(c => c.CustomerId)
             .OnDelete(DeleteBehavior.Cascade);
            e.HasOne(c => c.Product)
             .WithMany()
             .HasForeignKey(c => c.ProductId)
             .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
