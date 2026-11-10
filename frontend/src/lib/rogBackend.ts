/**
 * ROG Backend API Bridge
 * Kết nối Frontend (Next.js) với Backend RogAdmin (.NET Web API)
 * Hỗ trợ cả Server-side Rendering (SSR) và Client-side fetch qua /api/be
 */

const BE_INTERNAL_URL = process.env.ROG_BACKEND_INTERNAL_URL || "http://127.0.0.1:5161";

export interface HeroSlideDto {
  src: string;
  alt: string;
  href: string;
}

export interface ProductCategoryDto {
  image: string;
  label: string;
  href: string;
}

export interface ArticleDto {
  img: string;
  tag: string;
  title: string;
  excerpt: string | null;
  date: string;
  href: string;
}

export interface SiteConfigDto {
  promoBar: {
    text: string;
    url: string;
  };
  joinRepublic: {
    title: string;
    description: string;
    url: string;
    image: string;
    imageAlt: string;
  };
  footer: {
    links: Array<{ label: string; href: string }>;
    legalLinks: Array<{ label: string; href: string }>;
    social: Array<{ icon: string; href: string; label: string }>;
    company: {
      name: string;
      address: string;
      taxCode: string;
      phone: string;
      license: string;
    };
    newsletter: {
      label: string;
      placeholder: string;
      buttonText: string;
    };
    badge: {
      image: string;
      alt: string;
      url: string;
    };
    region: string;
    copyright: string;
  };
}

/**
 * Kiểm tra trạng thái sức khỏe của Backend RogAdmin
 */
export async function checkBackendHealth(): Promise<{ healthy: boolean; detail?: string }> {
  try {
    const res = await fetch(`${BE_INTERNAL_URL}/health`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(2000),
    });
    if (!res.ok) return { healthy: false, detail: `HTTP ${res.status}` };
    const data = await res.json();
    return { healthy: data.status === "healthy", detail: JSON.stringify(data) };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { healthy: false, detail: msg };
  }
}

/**
 * Lấy cấu hình toàn site (PromoBar, JoinRepublic, Footer)
 */
export async function fetchSiteConfig(): Promise<SiteConfigDto | null> {
  try {
    const res = await fetch(`${BE_INTERNAL_URL}/api/public/site-config`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(2000),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Lấy danh sách Hero Slides cho Carousel trang chủ
 */
export async function fetchHeroSlides(): Promise<HeroSlideDto[] | null> {
  try {
    const res = await fetch(`${BE_INTERNAL_URL}/api/public/hero-slides`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(2000),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Lấy danh sách 22 danh mục sản phẩm chính
 */
export async function fetchProductCategories(): Promise<ProductCategoryDto[] | null> {
  try {
    const res = await fetch(`${BE_INTERNAL_URL}/api/public/product-categories`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(2000),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Lấy danh sách bài viết theo section (highlights / listing) và tag tùy chọn
 */
export async function fetchArticles(
  section?: "highlights" | "listing",
  tag?: string
): Promise<ArticleDto[] | null> {
  try {
    const params = new URLSearchParams();
    if (section) params.set("section", section);
    if (tag) params.set("tag", tag);
    const qs = params.toString() ? `?${params.toString()}` : "";

    const res = await fetch(`${BE_INTERNAL_URL}/api/public/articles${qs}`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(2000),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function fetchBackendJson<T>(path: string): Promise<T> {
  try {
    const res = await fetch(`${BE_INTERNAL_URL}${path}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(2000),
    });
    if (!res.ok) throw new Error(`Backend HTTP ${res.status}`);
    return await res.json() as T;
  } catch {
    throw new Error(`Không thể kết nối backend: ${path}`);
  }
}

export async function fetchArticleDetail(slugPath: string) {
  const slug = slugPath.replace(/^\/+|\/+$/g, "").split("/").map(encodeURIComponent).join("/");
  return fetchBackendJson<{
    title: string;
    lead: string;
    date: string;
    image: string;
    category: string;
    contentHtml: string;
  } | null>(`/api/public/articles/${slug}`);
}

export async function fetchProducts() {
  return fetchBackendJson<{ items: unknown[]; totalCount: number }>(
    "/api/public/products?page=1&pageSize=20"
  );
}

export async function fetchDealers() {
  return fetchBackendJson<unknown[]>("/api/public/dealers");
}

export async function fetchArticleDetailProbe() {
  return fetchArticleDetail("guides/su-dung-scenario-profiles-trong-armoury-crate");
}

export async function fetchWarrantyProbe() {
  return fetchBackendJson<unknown>("/api/public/warranty/check?serial=R4NRCX0001");
}

export async function fetchPricingProbe() {
  return fetchBackendJson<unknown[]>(
    "/api/public/pricing/batch?slugs=laptops/rog-strix/rog-strix-scar-18-2026"
  );
}

export async function fetchCompareProbe() {
  return fetchBackendJson<unknown>(
    "/api/public/products/compare?slugs=laptops/rog-strix/rog-strix-scar-18-2026,laptops/rog-zephyrus/rog-zephyrus-g16-2025-gu605"
  );
}

