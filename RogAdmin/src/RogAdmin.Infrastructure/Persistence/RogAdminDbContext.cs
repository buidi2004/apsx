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
    public DbSet<EventCampaign> Campaigns => Set<EventCampaign>();
    public DbSet<SoftwareDownload> SoftwareDownloads => Set<SoftwareDownload>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<ServiceCenter> ServiceCenters => Set<ServiceCenter>();
    public DbSet<WarrantyPolicy> WarrantyPolicies => Set<WarrantyPolicy>();
    public DbSet<SocialChannel> SocialChannels => Set<SocialChannel>();
    public DbSet<EliteTierPerk> EliteTierPerks => Set<EliteTierPerk>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
    public DbSet<Innovation> Innovations => Set<Innovation>();
    public DbSet<Wallpaper> Wallpapers => Set<Wallpaper>();
    public DbSet<AboutStory> AboutStories => Set<AboutStory>();
    public DbSet<FeaturedVideo> FeaturedVideos => Set<FeaturedVideo>();
    public DbSet<ProductImage> ProductImages => Set<ProductImage>();
    public DbSet<Coupon> Coupons => Set<Coupon>();

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
            e.Property(r => r.Id).HasConversion(
                v => v.ToString().ToLower(),
                v => Guid.Parse(v));
            e.Property(r => r.ProductSlug).HasMaxLength(500).IsRequired();
            e.Property(r => r.AuthorName).HasMaxLength(150).IsRequired();
            e.Property(r => r.Title).HasMaxLength(300);
            e.Property(r => r.Content).IsRequired();
            e.HasIndex(r => r.ProductSlug);
            e.HasIndex(r => new { r.ProductSlug, r.IsApproved });
            e.HasIndex(r => new { r.IsApproved, r.CreatedAtUtc });
        });

        modelBuilder.Entity<NewsletterSubscriber>(e =>
        {
            e.ToTable("NewsletterSubscribers");
            e.Property(s => s.Id).HasConversion(
                v => v.ToString().ToLower(),
                v => Guid.Parse(v));
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
            e.HasIndex(p => p.StockStatus);
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

        modelBuilder.Entity<Order>(e =>
        {
            e.ToTable("Orders");
            e.HasIndex(o => o.OrderCode).IsUnique();
            e.HasIndex(o => o.CustomerId);
            e.HasIndex(o => new { o.Status, o.CreatedAt });
            e.Property(o => o.OrderCode).HasMaxLength(40).IsRequired();
            e.Property(o => o.CustomerName).HasMaxLength(150).IsRequired();
            e.Property(o => o.Email).HasMaxLength(150).IsRequired();
            e.Property(o => o.Phone).HasMaxLength(30).IsRequired();
            e.Property(o => o.Address).HasMaxLength(500).IsRequired();
            e.Property(o => o.Note).HasMaxLength(1000);
            e.Property(o => o.ShippingCarrier).HasMaxLength(100);
            e.Property(o => o.TrackingNumber).HasMaxLength(100);
            e.Property(o => o.InternalNotes).HasMaxLength(2000);
            e.Property(o => o.CouponCode).HasMaxLength(50);
            e.Property(o => o.Status).HasConversion<int>();
            e.HasMany(o => o.Items)
             .WithOne(i => i.Order)
             .HasForeignKey(i => i.OrderId)
             .OnDelete(DeleteBehavior.Cascade);
            e.HasOne<Customer>()
             .WithMany()
             .HasForeignKey(o => o.CustomerId)
             .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<OrderItem>(e =>
        {
            e.ToTable("OrderItems");
            e.HasIndex(i => i.OrderId);
            e.Property(i => i.ProductSlug).HasMaxLength(300).IsRequired();
            e.Property(i => i.ProductName).HasMaxLength(300).IsRequired();
            e.Property(i => i.SelectedSpecs).HasMaxLength(500);
        });

        modelBuilder.Entity<ServiceCenter>(e =>
        {
            e.ToTable("ServiceCenters");
            e.Property(s => s.Name).HasMaxLength(200).IsRequired();
            e.Property(s => s.City).HasMaxLength(100).IsRequired();
            e.Property(s => s.Address).HasMaxLength(500).IsRequired();
            e.Property(s => s.Phone).HasMaxLength(50).IsRequired();
            e.Property(s => s.OperatingHours).HasMaxLength(200).IsRequired();
            e.HasIndex(s => s.SortOrder);
        });

        modelBuilder.Entity<WarrantyPolicy>(e =>
        {
            e.ToTable("WarrantyPolicies");
            e.Property(w => w.Title).HasMaxLength(200).IsRequired();
            e.Property(w => w.Description).HasMaxLength(1000).IsRequired();
            e.HasIndex(w => w.SortOrder);
        });

        modelBuilder.Entity<SocialChannel>(e =>
        {
            e.ToTable("SocialChannels");
            e.Property(s => s.Name).HasMaxLength(200).IsRequired();
            e.Property(s => s.MembersCount).HasMaxLength(100);
            e.Property(s => s.Description).HasMaxLength(1000);
            e.Property(s => s.Link).HasMaxLength(500).IsRequired();
            e.Property(s => s.ButtonText).HasMaxLength(100);
            e.HasIndex(s => s.SortOrder);
        });

        modelBuilder.Entity<EliteTierPerk>(e =>
        {
            e.ToTable("EliteTierPerks");
            e.Property(t => t.Tier).HasMaxLength(50).IsRequired();
            e.Property(t => t.PointsRange).HasMaxLength(100).IsRequired();
            e.Property(t => t.Perk).HasMaxLength(1000).IsRequired();
            e.HasIndex(t => t.SortOrder);
        });

        modelBuilder.Entity<AuditLog>(e =>
        {
            e.ToTable("AuditLogs");
            e.Property(a => a.Username).HasMaxLength(100).IsRequired();
            e.Property(a => a.Action).HasMaxLength(100).IsRequired();
            e.Property(a => a.EntityName).HasMaxLength(100).IsRequired();
            e.Property(a => a.EntityId).HasMaxLength(100);
            e.Property(a => a.Details).HasMaxLength(2000).IsRequired();
            e.Property(a => a.IpAddress).HasMaxLength(100);
            e.HasIndex(a => a.CreatedAt);
            e.HasIndex(a => a.Action);
            e.HasIndex(a => a.Username);
        });

        modelBuilder.Entity<Innovation>(e =>
        {
            e.ToTable("Innovations");
            e.Property(i => i.Tag).HasMaxLength(100).IsRequired();
            e.Property(i => i.Title).HasMaxLength(200).IsRequired();
            e.Property(i => i.Description).HasMaxLength(2000).IsRequired();
            e.Property(i => i.ImageUrl).HasMaxLength(500).IsRequired();
            e.HasIndex(i => i.SortOrder);
        });

        modelBuilder.Entity<Wallpaper>(e =>
        {
            e.ToTable("Wallpapers");
            e.Property(w => w.Title).HasMaxLength(200).IsRequired();
            e.Property(w => w.Resolution).HasMaxLength(100).IsRequired();
            e.Property(w => w.ImageUrl).HasMaxLength(500).IsRequired();
            e.Property(w => w.DownloadUrl).HasMaxLength(500);
            e.HasIndex(w => w.SortOrder);
        });

        modelBuilder.Entity<AboutStory>(e =>
        {
            e.ToTable("AboutStories");
            e.Property(s => s.YearTag).HasMaxLength(100).IsRequired();
            e.Property(s => s.Heading).HasMaxLength(300).IsRequired();
            e.Property(s => s.Content).IsRequired();
            e.Property(s => s.ImageUrl).HasMaxLength(500);
            e.HasIndex(s => s.SortOrder);
        });

        modelBuilder.Entity<FeaturedVideo>(e =>
        {
            e.ToTable("FeaturedVideos");
            e.Property(v => v.Title).HasMaxLength(300).IsRequired();
            e.Property(v => v.VideoUrl).HasMaxLength(500).IsRequired();
            e.Property(v => v.ThumbnailUrl).HasMaxLength(500).IsRequired();
            e.HasIndex(v => v.SortOrder);
        });

        modelBuilder.Entity<ProductImage>(e =>
        {
            e.ToTable("ProductImages");
            e.Property(i => i.ImageUrl).HasMaxLength(500).IsRequired();
            e.Property(i => i.Caption).HasMaxLength(200);
            e.HasIndex(i => new { i.ProductId, i.SortOrder });
        });

        modelBuilder.Entity<Coupon>(e =>
        {
            e.ToTable("Coupons");
            e.Property(c => c.Code).HasMaxLength(50).IsRequired();
            e.Property(c => c.Title).HasMaxLength(200).IsRequired();
            e.Property(c => c.Description).HasMaxLength(1000);
            e.Property(c => c.DiscountType).HasConversion<int>();
            e.HasIndex(c => c.Code).IsUnique();
            e.HasIndex(c => c.IsActive);
        });
    }
}
