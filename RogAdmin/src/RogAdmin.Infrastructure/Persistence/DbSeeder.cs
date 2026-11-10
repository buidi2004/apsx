using RogAdmin.Application.Interfaces;
using RogAdmin.Domain.Entities;
using RogAdmin.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace RogAdmin.Infrastructure.Persistence;

/// <summary>
/// Seed dữ liệu ban đầu — giá trị copy NGUYÊN VĂN từ các component FE
/// (RogHeroCarousel, RogProductCategories, RogHighlights, RogArticleListing,
/// RogFooter, RogJoinRepublic, RogPromoBar) để BE quản trị đúng nội dung FE đang hiển thị.
/// Idempotent: bảng đã có dữ liệu thì bỏ qua.
/// </summary>
public static class DbSeeder
{
    public static async Task SeedAsync(RogAdminDbContext db, IPasswordHasher hasher, bool seedDefaultUsers = true, CancellationToken ct = default)
    {
        if (seedDefaultUsers)
        {
            await SeedUsersAsync(db, hasher, ct);
        }
        await SeedHeroSlidesAsync(db, ct);
        await SeedProductCategoriesAsync(db, ct);
        await SeedArticlesAsync(db, ct);
        await SeedFooterLinksAsync(db, ct);
        await SeedSiteSettingsAsync(db, ct);
        await SeedDealersAsync(db, ct);
        await SeedWarrantyRecordsAsync(db, ct);
        await SeedProductsAsync(db, ct);
    }

    private static async Task SeedUsersAsync(RogAdminDbContext db, IPasswordHasher hasher, CancellationToken ct)
    {
        if (await db.AdminUsers.AnyAsync(ct))
        {
            return;
        }

        var (adminHash, adminSalt) = hasher.Hash("Admin@123");
        var (editorHash, editorSalt) = hasher.Hash("Editor@123");

        db.AdminUsers.AddRange(
            new AdminUser
            {
                Username = "admin",
                PasswordHash = adminHash,
                PasswordSalt = adminSalt,
                FullName = "Quản trị viên",
                Role = UserRole.Admin,
                IsActive = true,
            },
            new AdminUser
            {
                Username = "editor",
                PasswordHash = editorHash,
                PasswordSalt = editorSalt,
                FullName = "Biên tập viên",
                Role = UserRole.Editor,
                IsActive = true,
            });

        await db.SaveChangesAsync(ct);
    }

    private static async Task SeedHeroSlidesAsync(RogAdminDbContext db, CancellationToken ct)
    {
        if (await db.HeroSlides.AnyAsync(ct))
        {
            return;
        }

        /* RogHeroCarousel.tsx — const SLIDES (href FE đang là "#") */
        (string Src, string Alt)[] slides =
        [
            ("/sites/rog-asus/img/hero/control-resonant.webp", "SỞ HỮU ROG & TUF GAMING RTX 50 SERIES – NHẬN NGAY TỰA GAME CONTROL RESONANT"),
            ("/sites/rog-asus/img/hero/gamescom.webp", "ROG GAMESCOM"),
            ("/sites/rog-asus/img/hero/google-ai.webp", "Mua laptop ROG nhận Google AI"),
            ("/sites/rog-asus/img/hero/strix-scar-18.webp", "ROG Strix Scar 18 2026"),
            ("/sites/rog-asus/img/hero/zephyrus-duo.webp", "ROG Zephyrus DUO 2026"),
            ("/sites/rog-asus/img/hero/zephyrus-g14.webp", "ROG Zephyrus G14 2026 GU405"),
        ];

        db.HeroSlides.AddRange(slides.Select((s, i) => new HeroSlide
        {
            ImageUrl = s.Src,
            AltText = s.Alt,
            Href = null,
            SortOrder = i,
            IsActive = true,
        }));

        await db.SaveChangesAsync(ct);
    }

    private static async Task SeedProductCategoriesAsync(RogAdminDbContext db, CancellationToken ct)
    {
        if (await db.ProductCategories.AnyAsync(ct))
        {
            return;
        }

        /* RogProductCategories.tsx — const PRODUCTS (22 mục) */
        (string Image, string Label, string Href)[] products =
        [
            ("/sites/rog-asus/img/products/laptop-gaming.webp", "Laptop Gaming ASUS ROG", "/vn/laptops-group/"),
            ("/sites/rog-asus/img/products/bo-mach-chu.webp", "Bo mạch chủ", "https://rog.asus.com/vn/motherboards-group/"),
            ("/sites/rog-asus/img/products/card-do-hoa.webp", "Card Đồ họa", "https://rog.asus.com/vn/graphics-cards-group/"),
            ("/sites/rog-asus/img/products/man-hinh.webp", "Màn hình", "https://rog.asus.com/vn/monitors-group/"),
            ("/sites/rog-asus/img/products/phones.webp", "Phones", "https://rog.asus.com/vn/phones-group/allmodels/"),
            ("/sites/rog-asus/img/products/may-bo-pc-gaming.webp", "MÁY BỘ PC GAMING", "https://rog.asus.com/vn/desktops-group/"),
            ("/sites/rog-asus/img/products/nguon-may-tinh.webp", "Nguồn máy tính", "https://rog.asus.com/vn/power-supply-units-group/"),
            ("/sites/rog-asus/img/products/dock-vga.webp", "Dock VGA gắn ngoài", "https://rog.asus.com/vn/external-graphics-docks-group/allmodels/"),
            ("/sites/rog-asus/img/products/thiet-bi-mang.webp", "Thiết bị mạng", "https://rog.asus.com/vn/networking-group/allmodels/"),
            ("/sites/rog-asus/img/products/ban-phim.webp", "Bàn phím", "https://rog.asus.com/vn/keyboards-group/"),
            ("/sites/rog-asus/img/products/chuot-lot-chuot.webp", "Chuột & Lót chuột", "https://rog.asus.com/vn/mice-mouse-pads-group/"),
            ("/sites/rog-asus/img/products/tai-nghe-audio.webp", "Tai nghe & audio", "https://rog.asus.com/vn/headsets-audio-group/"),
            ("/sites/rog-asus/img/products/cases.webp", "Cases", "https://rog.asus.com/vn/cases-group/allmodels/"),
            ("/sites/rog-asus/img/products/apparel-bags-gear.webp", "Apparel, Bags, & Gear", "https://rog.asus.com/vn/apparel-bags-gear-group/"),
            ("/sites/rog-asus/img/products/streaming-kits.webp", "Streaming Kits", "https://rog.asus.com/vn/streaming-kits-group/allmodels/"),
            ("/sites/rog-asus/img/products/tay-cam.webp", "Tay cầm", "https://rog.asus.com/vn/controllers-group/allmodels/"),
            ("/sites/rog-asus/img/products/o-luu-tru.webp", "Ổ lưu trữ", "https://rog.asus.com/vn/storage/rog-strix-arion-model/"),
            ("/sites/rog-asus/img/products/protection-gadgets.webp", "Protection and Gadgets", "https://rog.asus.com/vn/protection-and-gadgets-group/"),
            ("/sites/rog-asus/img/products/lam-mat.webp", "Làm mát", "https://rog.asus.com/vn/cooling-group/"),
            ("/sites/rog-asus/img/products/gaming-handhelds.webp", "Gaming Handhelds", "https://rog.asus.com/vn/gaming-handhelds-group/"),
            ("/sites/rog-asus/img/products/rog-saga.webp", "ROG SAGA", "https://rog.asus.com/vn/rog-saga-group/"),
            ("/sites/rog-asus/img/products/docks-chargers-cables.webp", "Docks, Chargers and Cables", "https://rog.asus.com/vn/docks-chargers-and-cables-group/"),
        ];

        db.ProductCategories.AddRange(products.Select((p, i) => new ProductCategory
        {
            ImageUrl = p.Image,
            Label = p.Label,
            Href = p.Href,
            SortOrder = i,
            IsActive = true,
        }));

        await db.SaveChangesAsync(ct);
    }

    private static async Task SeedArticlesAsync(RogAdminDbContext db, CancellationToken ct)
    {
        if (await db.Articles.AnyAsync(ct))
        {
            return;
        }

        /* RogHighlights.tsx — const ARTICLES (5 bài; 2 bài đầu render to => IsBig) */
        var highlights = new List<Article>
        {
            new()
            {
                Title = "TỔNG HỢP THÔNG TIN GTA 6: GTA 6 RA MẮT KHI NÀO, CẤU HÌNH YÊU CẦU RA SAO?",
                OverlayText = "TỔNG HỢP TIN TỨC GTA 6 MỚI NHẤT: GTA 6 RA MẮT KHI NÀO VÀ CẤU HÌNH CHI TIẾT",
                Tag = "// GAMING",
                ImageUrl = "/sites/rog-asus/img/articles/gta6.webp",
                Href = "https://rog.asus.com/vn/articles/gaming/thong-tin-gta-6-moi-cau-hinh-yeu-cau/",
                PublishedDate = new DateTime(2026, 6, 30),
                Section = ArticleSection.Highlights,
                IsBig = true,
                SortOrder = 0,
                IsActive = true,
            },
            new()
            {
                Title = "TẤT TẦN TẬT CÁCH SỬ DỤNG SCENARIO PROFILES TRONG ARMOURY CRATE ĐỂ TỐI ƯU LAPTOP GAMING ROG",
                OverlayText = "TẤT TẦN TẬT CÁCH SỬ DỤNG SCENARIO PROFILES TRONG ARMOURY CRATE ĐỂ TỐI ƯU LAPTOP ASUS",
                Tag = "// GUIDES",
                ImageUrl = "/sites/rog-asus/img/articles/scenario-profiles.webp",
                Href = "https://rog.asus.com/vn/articles/guides/su-dung-scenario-profiles-trong-armoury-crate/",
                PublishedDate = new DateTime(2026, 6, 28),
                Section = ArticleSection.Highlights,
                IsBig = true,
                SortOrder = 1,
                IsActive = true,
            },
            new()
            {
                Title = "HƯỚNG DẪN SỬ DỤNG AURA SYNC TRONG ARMOURY CRATE ĐỂ ĐỒNG BỘ ĐÈN LED LAPTOP GAMING ROG",
                OverlayText = "Hướng dẫn sử dụng Aura Sync trong Armoury Crate để đồng bộ đèn LED laptop ASUS",
                Tag = "// GUIDES",
                ImageUrl = "/sites/rog-asus/img/articles/aura-sync.webp",
                Href = "https://rog.asus.com/vn/articles/guides/su-dung-aura-sync-trong-armoury-crate/",
                PublishedDate = new DateTime(2026, 6, 28),
                Section = ArticleSection.Highlights,
                IsBig = false,
                SortOrder = 2,
                IsActive = true,
            },
            new()
            {
                Title = "CÁCH TĂNG THỜI LƯỢNG PIN LAPTOP GAMING ROG VỚI ARMOURY CRATE",
                OverlayText = "CÁCH TỐI ƯU ARMOURY CRATE GIÚP LAPTOP ROG PIN TRÂU CÁ NGÀY TRÊN GIẢNG ĐƯỜNG",
                Tag = "// GUIDES",
                ImageUrl = "/sites/rog-asus/img/articles/tiet-kiem-pin.webp",
                Href = "https://rog.asus.com/vn/articles/guides/tang-thoi-luong-pin-laptop-gaming-asus-rog/",
                PublishedDate = new DateTime(2026, 6, 28),
                Section = ArticleSection.Highlights,
                IsBig = false,
                SortOrder = 3,
                IsActive = true,
            },
            new()
            {
                Title = "LAPTOP GAMING 2 MÀN HÌNH MỎNG NHẸ CÓ MẠNH KHÔNG? THỰC TẾ DÙNG ROG ZEPHYRUS DUO 2026 LÀM ĐỒ HỌA",
                OverlayText = null,
                Tag = "// ROG GAMING LAPTOPS",
                ImageUrl = "/sites/rog-asus/img/articles/zephyrus-duo-2-man-hinh.webp",
                Href = "https://rog.asus.com/vn/articles/rog-gaming-laptops/laptop-gaming-2-man-hinh-16-inch/",
                PublishedDate = new DateTime(2026, 6, 22),
                Section = ArticleSection.Highlights,
                IsBig = false,
                SortOrder = 4,
                IsActive = true,
            },
        };

        /* RogArticleListing.tsx — const ARTICLES (9 bài; FE không có date) */
        var listing = new List<Article>
        {
            new()
            {
                Title = "ROG Ally Cập Nhật Armoury Crate SE: Tùy Biến Nút Bấm, Travel Mode và Remote Play",
                Excerpt = "ROG Ally vừa nhận bản cập nhật Armoury Crate SE quan trọng với 3 nhóm tính năng chính: tùy biến nút Command Center, Library và Action; Travel Mode giới hạn công suất sạc ở 65W; cùng Remote Play beta để chơi game PC từ xa mượt mà.",
                Tag = "// ROG Xbox Ally",
                ImageUrl = "/sites/rog-asus/img/articles/ally-armoury-crate-se.webp",
                Href = "https://rog.asus.com/vn/articles/rog-xbox-ally/14069929-a664-4cb5-b0a0-aeeee0c6c32f/",
                PublishedDate = null,
                Section = ArticleSection.Listing,
                IsBig = false,
                SortOrder = 0,
                IsActive = true,
            },
            new()
            {
                Title = "SCI vs SCE: Màn Hình Chống Phản Chiếu Có Ý Nghĩa Gì Với Người Dùng Laptop Gaming?",
                Excerpt = "Màn hình chống phản chiếu giúp giảm lượng ánh sáng môi trường phản ngược về mắt, nhờ đó hình ảnh giữ được độ tương phản, màu sắc và độ rõ nét ngay cả khi bạn làm việc hoặc chơi game gần cửa sổ.",
                Tag = "// Technologies",
                ImageUrl = "/sites/rog-asus/img/articles/sci-vs-sce.webp",
                Href = "https://rog.asus.com/vn/articles/technologies/man-hinh-chong-phan-chieu-laptop-gaming-rog/",
                PublishedDate = null,
                Section = ArticleSection.Listing,
                IsBig = false,
                SortOrder = 1,
                IsActive = true,
            },
            new()
            {
                Title = "Laptop Gaming Tản Nhiệt Tốt: Chọn ROG Nào Để Chơi Game Mát Và Êm?",
                Excerpt = "Laptop gaming tản nhiệt tốt là laptop giữ được CPU và GPU ở ngưỡng nhiệt an toàn, hạn chế thermal throttling và duy trì hiệu năng ổn định trong các phiên chơi dài.",
                Tag = "// Guides",
                ImageUrl = "/sites/rog-asus/img/articles/tan-nhiet-tot.webp",
                Href = "https://rog.asus.com/vn/articles/guides/laptop-gaming-tan-nhiet-tot-em-ai/",
                PublishedDate = null,
                Section = ArticleSection.Listing,
                IsBig = false,
                SortOrder = 2,
                IsActive = true,
            },
            new()
            {
                Title = "Mini LED hay OLED: Chọn Laptop Gaming OLED Hay Laptop Gaming Mini LED Cho Trải Nghiệm HDR Tốt Nhất?",
                Excerpt = "Laptop gaming OLED là lựa chọn tốt hơn nếu bạn ưu tiên độ tương phản, màu đen tuyệt đối, thời gian phản hồi nhanh và trải nghiệm HDR trong không gian thiếu sáng; laptop gaming Mini LED là lựa chọn tốt cho độ sáng và tuổi thọ pin.",
                Tag = "// Guides",
                ImageUrl = "/sites/rog-asus/img/articles/oled-hay-mini-led.webp",
                Href = "https://rog.asus.com/vn/articles/guides/chon-laptop-gaming-oled-hay-mini-led/",
                PublishedDate = null,
                Section = ArticleSection.Listing,
                IsBig = false,
                SortOrder = 3,
                IsActive = true,
            },
            new()
            {
                Title = "Cách Mở Khóa TGP Tối Đa Trên Laptop Gaming ROG Bằng Manual Mode Trong Armoury Crate",
                Excerpt = "Manual Mode trong Armoury Crate là cách chính thức để mở khóa TGP tối đa trên laptop gaming ROG.",
                Tag = "// Guides",
                ImageUrl = "/sites/rog-asus/img/articles/mo-khoa-tgp.webp",
                Href = "https://rog.asus.com/vn/articles/guides/mo-khoa-tgp-laptop-gaming-rog/",
                PublishedDate = null,
                Section = ArticleSection.Listing,
                IsBig = false,
                SortOrder = 4,
                IsActive = true,
            },
            new()
            {
                Title = "Laptop RTX 5050: Không Chỉ Để Chơi Game, Hiệu Năng Thực Tế Cho Công Việc, Sáng Tạo Và Học Tập",
                Excerpt = "Laptop RTX 5050 là lựa chọn đa năng cho người dùng cần một chiếc máy vừa học tập, làm việc sáng tạo vừa chơi game.",
                Tag = "// ROG Gaming Laptops",
                ImageUrl = "/sites/rog-asus/img/articles/rtx-5050.webp",
                Href = "https://rog.asus.com/vn/articles/rog-gaming-laptops/hieu-nang-laptop-rtx-50-series-rog/",
                PublishedDate = null,
                Section = ArticleSection.Listing,
                IsBig = false,
                SortOrder = 5,
                IsActive = true,
            },
            new()
            {
                Title = "Laptop RTX 50 Series: Thế Hệ GPU Mới Thay Đổi Gì Cho Người Dùng Không Chỉ Chơi Game?",
                Excerpt = "Nếu bạn cần một chiếc laptop RTX 50 series cho học tập, sáng tạo và giải trí, hãy ưu tiên ba yếu tố: GPU phù hợp workload, công suất TGP đủ cao và hệ thống tản nhiệt giữ được hiệu năng trong thời gian dài.",
                Tag = "// ROG Gaming Laptops",
                ImageUrl = "/sites/rog-asus/img/articles/rtx-50-series.webp",
                Href = "https://rog.asus.com/vn/articles/rog-gaming-laptops/laptop-rtx-50-series-rog/",
                PublishedDate = null,
                Section = ArticleSection.Listing,
                IsBig = false,
                SortOrder = 6,
                IsActive = true,
            },
            new()
            {
                Title = "Laptop Gaming RTX 50 Series: Hiệu Năng Cao Cho Game, Công Việc Nặng Và Sáng Tạo Nội Dung",
                Excerpt = "Một chiếc laptop gaming RTX 50 Series tốt không chỉ được quyết định bởi tên GPU. Người mua cần xem đồng thời TGP của GPU, CPU, RAM, VRAM, SSD, màn hình, hệ thống tản nhiệt, chế độ hiệu năng và khả năng nâng cấp.",
                Tag = "// ROG Gaming Laptops",
                ImageUrl = "/sites/rog-asus/img/articles/rtx-50-hieu-nang.webp",
                Href = "https://rog.asus.com/vn/articles/rog-gaming-laptops/hieu-nang-laptop-gaming-rtx-50-series/",
                PublishedDate = null,
                Section = ArticleSection.Listing,
                IsBig = false,
                SortOrder = 7,
                IsActive = true,
            },
            new()
            {
                Title = "Laptop RTX 5060: GPU Tầm Trung Đủ Mạnh Cho Content Creator, Kỹ Sư Và Người Dùng Cần Laptop Hiệu Năng Cao",
                Excerpt = "Laptop RTX 5060 là lựa chọn hợp lý cho content creator, designer, kỹ sư và game developer cần GPU rời để dựng video 4K, làm đồ họa, render 3D hoặc chơi game.",
                Tag = "// ROG Gaming Laptops",
                ImageUrl = "/sites/rog-asus/img/articles/rtx-5060.webp",
                Href = "https://rog.asus.com/vn/articles/rog-gaming-laptops/hieu-nang-laptop-rtx-5060/",
                PublishedDate = null,
                Section = ArticleSection.Listing,
                IsBig = false,
                SortOrder = 8,
                IsActive = true,
            },
        };

        db.Articles.AddRange(highlights);
        db.Articles.AddRange(listing);
        await db.SaveChangesAsync(ct);
    }

    private static async Task SeedFooterLinksAsync(RogAdminDbContext db, CancellationToken ct)
    {
        if (await db.FooterLinks.AnyAsync(ct))
        {
            return;
        }

        /* RogFooter.tsx — FOOTER_LINKS, LEGAL_LINKS, SocialIcons */
        var links = new List<FooterLink>
        {
            // nhóm chính
            new() { Label = "GIỚI THIỆU VỀ ROG", Href = "https://rog.asus.com/vn/about-rog", Group = FooterLinkGroup.Footer, SortOrder = 0, IsActive = true },
            new() { Label = "PRODUCT GUIDE", Href = "https://asusproductguide.asus.com/vn_product-guide-rog_q3-2023/full-view.html", Group = FooterLinkGroup.Footer, SortOrder = 1, IsActive = true },
            new() { Label = "HỖ TRỢ", Href = "https://rog.asus.com/vn/support", Group = FooterLinkGroup.Footer, SortOrder = 2, IsActive = true },
            new() { Label = "TRANG CHỦ", Href = "https://rog.asus.com/vn/", Group = FooterLinkGroup.Footer, SortOrder = 3, IsActive = true },
            new() { Label = "NEWSROOM", Href = "https://press.asus.com/", Group = FooterLinkGroup.Footer, SortOrder = 4, IsActive = true },
            // pháp lý
            new() { Label = "QUI CHẾ PHÁP LÝ", Href = "https://rog.asus.com/vn/terms-of-notice/privacy_policy/", Group = FooterLinkGroup.Legal, SortOrder = 0, IsActive = true },
            new() { Label = "THÔNG TIN HỢP PHÁP", Href = "https://rog.asus.com/vn/terms-of-notice/official-site/", Group = FooterLinkGroup.Legal, SortOrder = 1, IsActive = true },
            // mạng xã hội
            new() { Label = "Facebook", Href = "https://www.facebook.com/vn.asus.rog", Group = FooterLinkGroup.Social, SortOrder = 0, IsActive = true },
            new() { Label = "TikTok", Href = "https://www.tiktok.com/@asusrogvn", Group = FooterLinkGroup.Social, SortOrder = 1, IsActive = true },
            new() { Label = "YouTube", Href = "https://www.youtube.com/@asusrogvietnam?sub_confirmation=1", Group = FooterLinkGroup.Social, SortOrder = 2, IsActive = true },
            new() { Label = "Instagram", Href = "https://www.instagram.com/asusrogvietnam/", Group = FooterLinkGroup.Social, SortOrder = 3, IsActive = true },
            new() { Label = "X", Href = "https://twitter.com/ASUS_ROG", Group = FooterLinkGroup.Social, SortOrder = 4, IsActive = true },
        };

        db.FooterLinks.AddRange(links);
        await db.SaveChangesAsync(ct);
    }

    private static async Task SeedSiteSettingsAsync(RogAdminDbContext db, CancellationToken ct)
    {
        if (await db.SiteSettings.AnyAsync(ct))
        {
            return;
        }

        /* Giá trị lấy từ RogPromoBar, RogJoinRepublic, RogFooter */
        var settings = new (string Key, string Value, string Description)[]
        {
            // PromoBar
            ("promoBarText", "Mua Ngay Laptop Gaming AI ROG RTX 50 Series!", "Dòng chữ banner khuyến mãi chạy trên cùng"),
            ("promoBarUrl", "https://vn.store.asus.com/rog/2025-rog-laptop-gaming-ai-rtx-50-series?utm_source=rogsite&utm_medium=banner", "Link banner khuyến mãi"),
            // JoinRepublic
            ("joinRepublicTitle", "THE ART OF THE ROG UNIVERSE", "Tiêu đề khối Join the Republic"),
            ("joinRepublicDescription", "Technology never sleeps, nor should the action. For those keen on winning power, the Republic of Gamers awaits. Driven by relentless innovation, ROG is committed to producing out-of-this-world experiences for gamers and enthusiasts everywhere.", "Mô tả khối Join the Republic"),
            ("joinRepublicUrl", "https://rog.asus.com/microsite/rog-saga/", "Link khối Join the Republic"),
            ("joinRepublicImage", "/sites/rog-asus/img/misc/join-the-republic.webp", "Ảnh khối Join the Republic"),
            ("joinRepublicImageAlt", "Join the Republic", "Alt ảnh Join the Republic"),
            // Footer — công ty
            ("companyName", "Công Ty TNHH Công Nghệ Asus (Việt Nam)", "Tên công ty trong footer"),
            ("companyAddress", "Địa chỉ: 285 Cách Mạng Tháng Tám, Phường 12, Quận 10, Thành phố Hồ Chí Minh, Việt Nam", "Địa chỉ công ty"),
            ("companyBusinessRegistration", "Giấy chứng nhận đăng ký doanh nghiệp số 0304965680 do Sở Kế hoạch và Đầu tư và Thành phố Hồ Chí Minh cấp ngày 03/05/2007.", "Giấy ĐK doanh nghiệp"),
            ("companyPhone", "Điện thoại: 1800 65 88", "Hotline"),
            ("companyEcommerceLicense", "Giấy phép kinh doanh hoạt động mua bán hàng hóa và các hoạt động liên quan trực tiếp đến mua bán hàng hóa, số 0304965680/KD-0321, do Sở Công thương TP. Hồ Chí Minh cấp lần đầu ngày 24/01/2019.", "Giấy phép TMĐT"),
            // Footer — newsletter
            ("newsletterLabel", "NHẬN CÁC ƯU ĐÃI MỚI NHẤT VÀ NHIỀU HƠN NỮA", "Nhãn form đăng ký nhận tin"),
            ("newsletterPlaceholder", "Nhập địa chỉ email", "Placeholder ô email"),
            ("newsletterButton", "ĐĂNG KÝ", "Nút submit"),
            // Footer — badge
            ("badgeUrl", "http://online.gov.vn/Home/WebDetails/115530", "Link badge Bộ Công Thương"),
            ("badgeImage", "/sites/rog-asus/img/misc/da-thong-bao-badge.png", "Ảnh badge Bộ Công Thương"),
            ("badgeAlt", "Đã thông báo Bộ Công Thương", "Alt badge"),
            // Footer — dòng cuối
            ("footerRegion", "Vietnam/Việt Nam", "Khu vực hiển thị góc footer"),
            ("footerCopyright", "©ASUSTEK COMPUTER INC. ALL RIGHTS RESERVED.", "Dòng copyright"),
        };

        db.SiteSettings.AddRange(settings.Select(s => new SiteSetting
        {
            Key = s.Key,
            Value = s.Value,
            Description = s.Description,
        }));

        await db.SaveChangesAsync(ct);
    }

    private static async Task SeedDealersAsync(RogAdminDbContext db, CancellationToken ct)
    {
        if (await db.Dealers.AnyAsync(ct)) return;

        var dealers = new List<Dealer>
        {
            new() { Name = "GearVN", Slug = "gearvn", LogoUrl = "/sites/rog-asus/img/dealers/gearvn.webp", WebsiteUrl = "https://gearvn.com", Hotline = "1800 6975", IsOfficialPartner = true, StoreCount = 12, CityCoverage = "Hà Nội, TP.HCM, Đà Nẵng" },
            new() { Name = "CellphoneS", Slug = "cellphones", LogoUrl = "/sites/rog-asus/img/dealers/cellphones.webp", WebsiteUrl = "https://cellphones.com.vn", Hotline = "1800 2097", IsOfficialPartner = true, StoreCount = 115, CityCoverage = "Toàn quốc (30+ tỉnh thành)" },
            new() { Name = "Phong Vũ", Slug = "phongvu", LogoUrl = "/sites/rog-asus/img/dealers/phongvu.webp", WebsiteUrl = "https://phongvu.vn", Hotline = "1800 6867", IsOfficialPartner = true, StoreCount = 45, CityCoverage = "Toàn quốc" },
            new() { Name = "An Phát Computer", Slug = "anphat", LogoUrl = "/sites/rog-asus/img/dealers/anphat.webp", WebsiteUrl = "https://www.anphatpc.com.vn", Hotline = "1900 0323", IsOfficialPartner = true, StoreCount = 8, CityCoverage = "Hà Nội, TP.HCM" },
            new() { Name = "HACOM", Slug = "hacom", LogoUrl = "/sites/rog-asus/img/dealers/hacom.webp", WebsiteUrl = "https://hacom.vn", Hotline = "1900 1903", IsOfficialPartner = true, StoreCount = 15, CityCoverage = "Hà Nội, Hải Phòng, Bắc Ninh" },
            new() { Name = "Thế Giới Di Động", Slug = "tgdd", LogoUrl = "/sites/rog-asus/img/dealers/tgdd.webp", WebsiteUrl = "https://www.thegioididong.com", Hotline = "1900 232 460", IsOfficialPartner = true, StoreCount = 3000, CityCoverage = "63 tỉnh thành" },
            new() { Name = "MemoryZone", Slug = "memoryzone", LogoUrl = "/sites/rog-asus/img/dealers/memoryzone.webp", WebsiteUrl = "https://memoryzone.com.vn", Hotline = "028 7301 3878", IsOfficialPartner = true, StoreCount = 4, CityCoverage = "Hà Nội, TP.HCM" },
            new() { Name = "Phi Long Technology", Slug = "philong", LogoUrl = "/sites/rog-asus/img/dealers/philong.webp", WebsiteUrl = "https://philong.com.vn", Hotline = "0236 3 888 000", IsOfficialPartner = true, StoreCount = 5, CityCoverage = "Đà Nẵng, Huế" },
        };

        db.Dealers.AddRange(dealers);
        await db.SaveChangesAsync(ct);
    }

    private static async Task SeedWarrantyRecordsAsync(RogAdminDbContext db, CancellationToken ct)
    {
        if (await db.WarrantyRecords.AnyAsync(ct)) return;

        var records = new List<WarrantyRecord>
        {
            new() { SerialNumber = "R4NRCX0001", ProductModel = "ROG Strix SCAR 18 (2026)", PurchaseDate = DateTime.UtcNow.AddMonths(-3), ExpiryDate = DateTime.UtcNow.AddMonths(21), Status = WarrantyStatus.Active, ServiceCenter = "ASUS Service Center 285 CMT8, Q10, TP.HCM" },
            new() { SerialNumber = "R4NRCX0002", ProductModel = "ROG Zephyrus G16 GU605", PurchaseDate = DateTime.UtcNow.AddMonths(-14), ExpiryDate = DateTime.UtcNow.AddMonths(10), Status = WarrantyStatus.Active, ServiceCenter = "ASUS Service Center Thái Hà, Đống Đa, Hà Nội" },
            new() { SerialNumber = "R4NRCX0003", ProductModel = "ROG Ally (2023)", PurchaseDate = DateTime.UtcNow.AddMonths(-26), ExpiryDate = DateTime.UtcNow.AddMonths(-2), Status = WarrantyStatus.Expired, ServiceCenter = "ASUS Service Center Nguyễn Thị Minh Khai, Q3, TP.HCM" },
            new() { SerialNumber = "G16GU605VN01", ProductModel = "ROG Zephyrus G16 2025 GU605", PurchaseDate = DateTime.UtcNow.AddMonths(-1), ExpiryDate = DateTime.UtcNow.AddMonths(23), Status = WarrantyStatus.Active, ServiceCenter = "ASUS Service Center 285 CMT8, Q10, TP.HCM" },
            new() { SerialNumber = "SCAR18VN001", ProductModel = "ROG Strix SCAR 18 2026 G835", PurchaseDate = DateTime.UtcNow.AddDays(-10), ExpiryDate = DateTime.UtcNow.AddMonths(24), Status = WarrantyStatus.Active, ServiceCenter = "ASUS Service Center Hàm Nghi, Thanh Khê, Đà Nẵng" }
        };

        db.WarrantyRecords.AddRange(records);
        await db.SaveChangesAsync(ct);
    }

    private static async Task SeedProductsAsync(RogAdminDbContext db, CancellationToken ct)
    {
        if (await db.Products.AnyAsync(ct)) return;

        var products = new List<Product>
        {
            new()
            {
                Slug = "laptops/rog-strix/rog-strix-scar-18-2026",
                Name = "ROG Strix SCAR 18 (2026)",
                CategorySlug = "laptops-group",
                ModelCode = "G835",
                Tagline = "Laptop gaming 18-inch mạnh nhất thế giới với Intel Core Ultra 9 290HX Plus & RTX 5090",
                ThumbnailUrl = "/sites/rog-asus/img/hero/gamescom.webp",
                KeyVisualUrl = "/sites/rog-asus/img/hero/control-resonant.webp",
                BasePath = "/vn/laptops/rog-strix/rog-strix-scar-18-2026",
                SubBarType = "standard",
                IsHot = true,
                IsFeatured = true,
                Price = new ProductPrice
                {
                    Price = 134990000m,
                    OldPrice = 142990000m,
                    DiscountLabel = "TIẾT KIỆM 8.000.000 ₫",
                    StockStatus = StockStatus.InStock,
                    StoreUrl = "https://vn.store.asus.com/rog/rog-strix-scar-18-2026.html"
                },
                Specs = new List<ProductSpec>
                {
                    new() { SpecGroup = "Processor", SpecKey = "CPU", SpecValue = "Intel® Core™ Ultra 9 290HX Plus 24 nhân 32 luồng", OrderIndex = 1 },
                    new() { SpecGroup = "Graphics", SpecKey = "GPU", SpecValue = "NVIDIA® GeForce RTX™ 5090 Laptop GPU 16GB GDDR7 TGP 175W", OrderIndex = 2 },
                    new() { SpecGroup = "Display", SpecKey = "Màn hình", SpecValue = "18-inch 2.5K (2560 x 1600) ROG Nebula HDR Mini LED 240Hz 1100 nits", OrderIndex = 3 },
                    new() { SpecGroup = "Memory", SpecKey = "RAM", SpecValue = "64GB DDR5 5600MHz (Nâng cấp tối đa 128GB)", OrderIndex = 4 },
                    new() { SpecGroup = "Storage", SpecKey = "Ổ cứng", SpecValue = "4TB (2x 2TB PCIe® 4.0 NVMe™ M.2 SSD RAID 0)", OrderIndex = 5 },
                    new() { SpecGroup = "Battery", SpecKey = "Pin", SpecValue = "90WHrs, 4S1P, 4-cell Li-ion sạc nhanh 330W Adapter", OrderIndex = 6 },
                    new() { SpecGroup = "Weight", SpecKey = "Trọng lượng", SpecValue = "3.10 Kg", OrderIndex = 7 }
                }
            },
            new()
            {
                Slug = "laptops/rog-zephyrus/rog-zephyrus-g16-2025-gu605",
                Name = "ROG Zephyrus G16 (2025) GU605",
                CategorySlug = "laptops-group",
                ModelCode = "GU605",
                Tagline = "Laptop gaming AI siêu mỏng nhẹ với màn hình OLED 2.5K 240Hz Nebula Display",
                ThumbnailUrl = "/sites/rog-asus/img/products/laptop-gaming.webp",
                KeyVisualUrl = "/sites/rog-asus/img/hero/google-ai.webp",
                BasePath = "/vn/laptops/rog-zephyrus/rog-zephyrus-g16-2025-gu605",
                SubBarType = "standard",
                IsHot = true,
                IsFeatured = true,
                Price = new ProductPrice
                {
                    Price = 79990000m,
                    OldPrice = 84990000m,
                    DiscountLabel = "TIẾT KIỆM 5.000.000 ₫",
                    StockStatus = StockStatus.InStock,
                    StoreUrl = "https://vn.store.asus.com/rog/rog-zephyrus-g16-2025-gu605.html"
                },
                Specs = new List<ProductSpec>
                {
                    new() { SpecGroup = "Processor", SpecKey = "CPU", SpecValue = "Intel® Core™ Ultra 9 185H NPU AI Boost", OrderIndex = 1 },
                    new() { SpecGroup = "Graphics", SpecKey = "GPU", SpecValue = "NVIDIA® GeForce RTX™ 4090 Laptop GPU 16GB GDDR6", OrderIndex = 2 },
                    new() { SpecGroup = "Display", SpecKey = "Màn hình", SpecValue = "16-inch 2.5K (2560 x 1600) ROG Nebula OLED 240Hz 0.2ms 100% DCI-P3", OrderIndex = 3 },
                    new() { SpecGroup = "Memory", SpecKey = "RAM", SpecValue = "32GB LPDDR5X 7467MHz On Board", OrderIndex = 4 },
                    new() { SpecGroup = "Storage", SpecKey = "Ổ cứng", SpecValue = "2TB PCIe® 4.0 NVMe™ M.2 Performance SSD", OrderIndex = 5 },
                    new() { SpecGroup = "Weight", SpecKey = "Trọng lượng", SpecValue = "1.85 Kg — Siêu mỏng 1.49 cm nhôm nguyên khối CNC", OrderIndex = 6 }
                }
            },
            new()
            {
                Slug = "laptops/rog-zephyrus/rog-zephyrus-duo-2026",
                Name = "ROG Zephyrus Duo (2026) GX651",
                CategorySlug = "laptops-group",
                ModelCode = "GX651",
                Tagline = "Laptop gaming hai màn hình OLED 3K đột phá chuẩn tương lai",
                ThumbnailUrl = "/sites/rog-asus/img/hero/control-resonant.webp",
                KeyVisualUrl = "/sites/rog-asus/img/hero/gamescom.webp",
                BasePath = "/vn/laptops/rog-zephyrus/rog-zephyrus-duo-2026",
                SubBarType = "standard",
                IsHot = true,
                IsFeatured = true,
                Price = new ProductPrice
                {
                    Price = 129990000m,
                    OldPrice = 139990000m,
                    DiscountLabel = "ĐẶT HÀNG TRƯỚC NHẬN BỘ QUÀ 15 TRIỆU",
                    StockStatus = StockStatus.PreOrder,
                    StoreUrl = "https://vn.store.asus.com/rog/rog-zephyrus-duo-2026.html"
                },
                Specs = new List<ProductSpec>
                {
                    new() { SpecGroup = "Processor", SpecKey = "CPU", SpecValue = "AMD Ryzen™ AI 9 HX 370 12 nhân 24 luồng (50 TOPS NPU)", OrderIndex = 1 },
                    new() { SpecGroup = "Graphics", SpecKey = "GPU", SpecValue = "NVIDIA® GeForce RTX™ 5080 Laptop GPU 16GB GDDR7", OrderIndex = 2 },
                    new() { SpecGroup = "Display", SpecKey = "Màn hình kép", SpecValue = "Màn hình chính 16-inch 3K 240Hz OLED + Màn hình phụ ROG ScreenPad Plus cảm ứng 4K", OrderIndex = 3 },
                    new() { SpecGroup = "Memory", SpecKey = "RAM", SpecValue = "64GB LPDDR5X 7500MHz", OrderIndex = 4 },
                    new() { SpecGroup = "Storage", SpecKey = "Ổ cứng", SpecValue = "4TB PCIe® Gen 5 SSD", OrderIndex = 5 }
                }
            },
            new()
            {
                Slug = "monitors/32-to-34-inches/rog-swift-oled-pg34wcdn",
                Name = "ROG Swift OLED PG34WCDN",
                CategorySlug = "monitors-group",
                ModelCode = "PG34WCDN",
                Tagline = "Màn hình cong QD-OLED 34-inch siêu rộng 360Hz thời gian phản hồi 0.03ms",
                ThumbnailUrl = "/sites/rog-asus/img/products/man-hinh.webp",
                KeyVisualUrl = "/sites/rog-asus/img/products/man-hinh.webp",
                BasePath = "/vn/monitors/32-to-34-inches/rog-swift-oled-pg34wcdn",
                SubBarType = "standard",
                IsHot = true,
                IsFeatured = false,
                Price = new ProductPrice
                {
                    Price = 36990000m,
                    OldPrice = 39990000m,
                    DiscountLabel = "TIẾT KIỆM 3.000.000 ₫",
                    StockStatus = StockStatus.InStock,
                    StoreUrl = "https://vn.store.asus.com/rog/rog-swift-oled-pg34wcdn.html"
                },
                Specs = new List<ProductSpec>
                {
                    new() { SpecGroup = "Display", SpecKey = "Kích thước & Tấm nền", SpecValue = "34-inch Cong 800R QD-OLED tỷ lệ 21:9", OrderIndex = 1 },
                    new() { SpecGroup = "Display", SpecKey = "Độ phân giải", SpecValue = "UWQHD (3440 x 1440)", OrderIndex = 2 },
                    new() { SpecGroup = "Display", SpecKey = "Tần số quét & Tốc độ", SpecValue = "360Hz, 0.03ms GTG", OrderIndex = 3 },
                    new() { SpecGroup = "Color", SpecKey = "Chuẩn màu", SpecValue = "99% DCI-P3, Delta E < 2, DisplayHDR True Black 400", OrderIndex = 4 }
                }
            },
            new()
            {
                Slug = "gaming-handhelds/rog-ally/rog-ally-2023",
                Name = "ROG Ally (2023)",
                CategorySlug = "gaming-handhelds-group",
                ModelCode = "RC71L",
                Tagline = "Máy chơi game cầm tay Windows 11 mạnh mẽ với AMD Ryzen Z1 Extreme",
                ThumbnailUrl = "/sites/rog-asus/img/products/gaming-handhelds.webp",
                KeyVisualUrl = "/sites/rog-asus/img/products/gaming-handhelds.webp",
                BasePath = "/vn/gaming-handhelds/rog-ally/rog-ally-2023",
                SubBarType = "standard",
                IsHot = false,
                IsFeatured = true,
                Price = new ProductPrice
                {
                    Price = 17990000m,
                    OldPrice = 19990000m,
                    DiscountLabel = "GIẢM 2.000.000 ₫",
                    StockStatus = StockStatus.InStock,
                    StoreUrl = "https://vn.store.asus.com/rog/rog-ally-rc71l.html"
                },
                Specs = new List<ProductSpec>
                {
                    new() { SpecGroup = "Processor", SpecKey = "APU", SpecValue = "AMD Ryzen™ Z1 Extreme 8 nhân 16 luồng (8.6 TFlops)", OrderIndex = 1 },
                    new() { SpecGroup = "Display", SpecKey = "Màn hình", SpecValue = "7-inch FHD (1920x1080) 120Hz 500 nits IPS cảm ứng Gorilla Glass Victus", OrderIndex = 2 },
                    new() { SpecGroup = "Memory", SpecKey = "RAM", SpecValue = "16GB LPDDR5 6400MHz Dual Channel", OrderIndex = 3 },
                    new() { SpecGroup = "Storage", SpecKey = "SSD", SpecValue = "512GB PCIe 4.0 NVMe M.2 2230", OrderIndex = 4 },
                    new() { SpecGroup = "Weight", SpecKey = "Trọng lượng", SpecValue = "608g", OrderIndex = 5 }
                }
            },
            new()
            {
                Slug = "phones/rog-phone-7",
                Name = "ROG Phone 7",
                CategorySlug = "phones-group",
                ModelCode = "AI2205",
                Tagline = "Chiến hạm gaming phone Snapdragon 8 Gen 2 tản nhiệt GameCool 7",
                ThumbnailUrl = "/sites/rog-asus/img/products/phones.webp",
                KeyVisualUrl = "/sites/rog-asus/img/products/phones.webp",
                BasePath = "/vn/phones/rog-phone-7",
                SubBarType = "standard",
                IsHot = false,
                IsFeatured = true,
                Price = new ProductPrice
                {
                    Price = 24990000m,
                    OldPrice = null,
                    DiscountLabel = "TẶNG TAY CẦM KUNAI 3",
                    StockStatus = StockStatus.InStock,
                    StoreUrl = "https://vn.store.asus.com/rog/rog-phone-7.html"
                },
                Specs = new List<ProductSpec>
                {
                    new() { SpecGroup = "Processor", SpecKey = "Chipset", SpecValue = "Qualcomm Snapdragon 8 Gen 2 3.2GHz", OrderIndex = 1 },
                    new() { SpecGroup = "Display", SpecKey = "Màn hình", SpecValue = "6.78-inch AMOLED 165Hz 720Hz Touch Sampling Rate 1500 nits", OrderIndex = 2 },
                    new() { SpecGroup = "Battery", SpecKey = "Dung lượng pin", SpecValue = "6000mAh (2 viên 3000mAh) Sạc HyperCharge 65W", OrderIndex = 3 },
                    new() { SpecGroup = "Audio", SpecKey = "Âm thanh", SpecValue = "Loa kép đối xứng Dirac HD Sound", OrderIndex = 4 }
                }
            },
            new()
            {
                Slug = "phones/apple/iphone-18-pro-max",
                Name = "Apple iPhone 18 Pro Max",
                CategorySlug = "phones-group",
                ModelCode = "A3800",
                Tagline = "Flagship đỉnh cao Apple A19 Pro khung Titanium nguyên khối",
                ThumbnailUrl = "/sites/rog-asus/img/products/phones.webp",
                KeyVisualUrl = "/sites/rog-asus/img/products/phones.webp",
                BasePath = "/vn/iphone-18-pro",
                SubBarType = "standard",
                IsHot = true,
                IsFeatured = true,
                Price = new ProductPrice
                {
                    Price = 38990000m,
                    OldPrice = 41990000m,
                    DiscountLabel = "GIẢM 3.000.000 ₫ MỞ BÁN",
                    StockStatus = StockStatus.InStock,
                    StoreUrl = "/vn/where-to-buy"
                },
                Specs = new List<ProductSpec>
                {
                    new() { SpecGroup = "Processor", SpecKey = "Chip", SpecValue = "Apple A19 Pro (2nm) 6-core GPU Apple Intelligence", OrderIndex = 1 },
                    new() { SpecGroup = "Display", SpecKey = "Màn hình", SpecValue = "6.9-inch Super Retina XDR OLED ProMotion 120Hz 3000 nits", OrderIndex = 2 },
                    new() { SpecGroup = "Camera", SpecKey = "Hệ thống Camera", SpecValue = "48MP Fusion + 48MP Ultra Wide + 48MP Telephoto 5x", OrderIndex = 3 }
                }
            },
            new()
            {
                Slug = "phones/samsung/galaxy-z-fold8-ultra",
                Name = "Samsung Galaxy Z Fold 8 Ultra",
                CategorySlug = "phones-group",
                ModelCode = "SM-F966B",
                Tagline = "Kỳ quan màn hình gập không nếp gấp Snapdragon 8 Elite For Galaxy",
                ThumbnailUrl = "/sites/rog-asus/img/products/phones.webp",
                KeyVisualUrl = "/sites/rog-asus/img/products/phones.webp",
                BasePath = "/vn/galaxy-z-fold8-ultra",
                SubBarType = "standard",
                IsHot = true,
                IsFeatured = true,
                Price = new ProductPrice
                {
                    Price = 45990000m,
                    OldPrice = 49990000m,
                    DiscountLabel = "TIẾT KIỆM 4.000.000 ₫",
                    StockStatus = StockStatus.InStock,
                    StoreUrl = "/vn/where-to-buy"
                },
                Specs = new List<ProductSpec>
                {
                    new() { SpecGroup = "Processor", SpecKey = "Vi xử lý", SpecValue = "Snapdragon® 8 Elite For Galaxy NPU tăng 45%", OrderIndex = 1 },
                    new() { SpecGroup = "Display", SpecKey = "Màn hình chính", SpecValue = "8.0-inch Dynamic AMOLED 2X 1-120Hz chống chói", OrderIndex = 2 },
                    new() { SpecGroup = "Display", SpecKey = "Màn hình phụ", SpecValue = "6.5-inch Dynamic AMOLED 2X 120Hz", OrderIndex = 3 }
                }
            }
        };

        db.Products.AddRange(products);
        await db.SaveChangesAsync(ct);
    }
}
