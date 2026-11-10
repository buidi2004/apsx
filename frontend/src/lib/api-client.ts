/**
 * ASUS ROG Full-Stack API Client
 * Provides typed access to RogAdmin Backend API (/api/be/...); API failures are surfaced without synthetic data.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api/be";
const BE_INTERNAL_URL = process.env.ROG_BACKEND_INTERNAL_URL || "http://127.0.0.1:5161";

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages?: number;
}

export interface HeroSlideDto {
  src?: string;
  desktop?: string;
  mobile?: string;
  alt: string;
  href: string;
}

export interface ProductCategoryDto {
  id?: string;
  image: string;
  label: string;
  href: string;
  sortOrder?: number;
}

export interface PublicArticleDto {
  id?: string;
  img: string;
  tag: string;
  title: string;
  excerpt?: string;
  overlay?: string;
  date: string;
  href: string;
  isBig?: boolean;
}

export interface ProductListItemDto {
  id: number;
  slug: string;
  name: string;
  categorySlug: string;
  modelCode: string;
  tagline: string;
  thumbnailUrl: string;
  basePath: string;
  price: number;
  oldPrice?: number | null;
  discountLabel: string;
  stockStatus: number;
  isHot: boolean;
  isFeatured: boolean;
}

export interface ProductSpecDto {
  group: string;
  key: string;
  value: string;
}

export interface ProductDetailDto {
  id: number;
  slug: string;
  name: string;
  categorySlug: string;
  modelCode: string;
  tagline: string;
  thumbnailUrl: string;
  keyVisualUrl: string;
  basePath: string;
  subBarType: string;
  price: number;
  oldPrice?: number | null;
  discountLabel: string;
  stockStatus: number;
  storeUrl: string;
  specs: ProductSpecDto[];
}

export interface ProductPriceDto {
  productId: number;
  slug: string;
  price: number;
  oldPrice?: number | null;
  discountLabel: string;
  stockStatus: number;
  formattedPrice: string;
  formattedOldPrice?: string | null;
}

export interface DealerDto {
  id: number;
  name: string;
  slug: string;
  logoUrl: string;
  websiteUrl: string;
  hotline: string;
  isOfficialPartner: boolean;
  storeCount: number;
  cityCoverage: string;
}

export interface WarrantyCheckDto {
  serialNumber: string;
  productModel: string;
  purchaseDate: string;
  expiryDate: string;
  status: number;
  statusText: string;
  serviceCenter: string;
}

export interface CompareMatrixDto {
  products: ProductDetailDto[];
  commonSpecKeys: string[];
}

export interface SiteConfigDto {
  promoBar?: {
    text: string;
    url: string;
  };
  joinRepublic?: {
    title: string;
    description: string;
    url: string;
    image: string;
    imageAlt: string;
  };
  footer?: {
    links: Array<{ label: string; href: string }>;
    legalLinks: Array<{ label: string; href: string }>;
    social: Array<{ label: string; href: string }>;
    company: {
      name: string;
      address: string;
      businessRegistration: string;
      phone: string;
      ecommerceLicense: string;
    };
    newsletter: {
      label: string;
      placeholder: string;
      button: string;
    };
    badge: {
      url: string;
      image: string;
      alt: string;
    };
    region: string;
    copyright: string;
  };
}

/**
 * Cấu hình tối ưu hóa bộ nhớ đệm (In-memory SWR Cache, In-flight Deduplication & LRU)
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const MAX_CACHE_ENTRIES = 300;
const FRESH_TTL_MS = 60_000;       // 60 giây (tươi mới - trả ngay < 0.1ms)
const STALE_TTL_MS = 300_000;      // 5 phút (Stale-While-Revalidate: trả ngay stale data, revalidate ngầm)

const memoryCache = new Map<string, CacheEntry<unknown>>();
const inFlightRequests = new Map<string, Promise<unknown>>();

// Thống kê hiệu năng
const metrics = {
  totalRequests: 0,
  freshHits: 0,
  staleHits: 0,
  networkRequests: 0,
  dedupedRequests: 0,
  totalNetworkMs: 0,
};

export interface FetchOptions {
  forceRefresh?: boolean;
  ttlMs?: number;
  skipSwr?: boolean;
}

function evictOldestEntries(count = 50) {
  const iterator = memoryCache.keys();
  for (let i = 0; i < count; i++) {
    const next = iterator.next();
    if (next.done) break;
    memoryCache.delete(next.value);
  }
}

/**
 * Thực hiện gọi mạng thực sự
 */
async function executeNetworkFetch<T>(endpoint: string): Promise<T> {
  const isServer = typeof window === "undefined";
  const start = Date.now();
  try {
    const url = isServer
      ? `${BE_INTERNAL_URL}/api${endpoint}`
      : `${API_BASE}${endpoint}`;

    const res = await fetch(url, {
      next: { revalidate: 60 },
      headers: {
        "Accept": "application/json",
        "Connection": "keep-alive",
      },
      signal: AbortSignal.timeout(5000),
    });

    metrics.networkRequests++;
    metrics.totalNetworkMs += (Date.now() - start);

    if (!res.ok) {
      throw new Error(`[ApiClient] Failed to fetch ${endpoint}: HTTP ${res.status}`);
    }

    const data = (await res.json()) as T;
    
    // Kiểm tra giới hạn kích thước LRU
    if (memoryCache.size >= MAX_CACHE_ENTRIES) {
      evictOldestEntries(50);
    }

    memoryCache.set(endpoint, {
      data,
      timestamp: Date.now(),
    });
    return data;
  } catch (error) {
    metrics.networkRequests++;
    metrics.totalNetworkMs += (Date.now() - start);
    throw error;
  }
}

/**
 * Fetch with timeout, in-flight deduplication, SWR and in-memory caching.
 */
async function safeFetch<T>(endpoint: string, options?: FetchOptions): Promise<T> {
  metrics.totalRequests++;
  const freshTtl = options?.ttlMs ?? FRESH_TTL_MS;
  const now = Date.now();

  // 1. Kiểm tra cache
  if (!options?.forceRefresh) {
    const cached = memoryCache.get(endpoint) as CacheEntry<T> | undefined;
    if (cached) {
      const age = now - cached.timestamp;
      
      // Cache còn tươi (< freshTtl) -> Trả về tức thì (< 0.1ms)
      if (age < freshTtl) {
        metrics.freshHits++;
        return cached.data;
      }

      // Cache hơi cũ nhưng nằm trong ngưỡng Stale (< STALE_TTL_MS) -> SWR pattern
      if (!options?.skipSwr && age < STALE_TTL_MS) {
        metrics.staleHits++;
        // Kích hoạt revalidate ngầm nếu chưa có request in-flight
        if (!inFlightRequests.has(endpoint)) {
          const bgPromise = executeNetworkFetch<T>(endpoint).finally(() => {
            inFlightRequests.delete(endpoint);
          });
          inFlightRequests.set(endpoint, bgPromise);
        }
        return cached.data;
      }
    }
  }

  // 2. Chống gọi trùng lặp (In-flight request deduplication)
  const existingPromise = inFlightRequests.get(endpoint);
  if (existingPromise) {
    metrics.dedupedRequests++;
    return existingPromise as Promise<T>;
  }

  const fetchPromise = executeNetworkFetch<T>(endpoint).finally(() => {
    inFlightRequests.delete(endpoint);
  });

  inFlightRequests.set(endpoint, fetchPromise);
  return fetchPromise;
}

export const RogApi = {
  /**
   * Xóa toàn bộ bộ nhớ đệm phía Client
   */
  clearCache(): void {
    memoryCache.clear();
  },

  /**
   * Thống kê chi tiết hiệu năng cache, SWR, deduplication và độ trễ
   */
  getMetrics() {
    const hits = metrics.freshHits + metrics.staleHits;
    const total = metrics.totalRequests;
    const hitRatio = total > 0 ? (hits / total) * 100 : 0;
    const avgNetMs = metrics.networkRequests > 0 ? metrics.totalNetworkMs / metrics.networkRequests : 0;
    return {
      cacheEntries: memoryCache.size,
      inFlightCount: inFlightRequests.size,
      totalRequests: total,
      freshHits: metrics.freshHits,
      staleHits: metrics.staleHits,
      networkRequests: metrics.networkRequests,
      dedupedRequests: metrics.dedupedRequests,
      hitRatio: `${hitRatio.toFixed(1)}%`,
      avgNetworkLatencyMs: `${avgNetMs.toFixed(1)}ms`,
      cachedKeys: Array.from(memoryCache.keys()),
    };
  },

  /**
   * Preload trước toàn bộ dữ liệu thiết yếu của hệ thống
   */
  async preloadCriticalData(): Promise<void> {
    await Promise.allSettled([
      RogApi.getHeroSlides(),
      RogApi.getCategories(),
      RogApi.getSiteConfig(),
      RogApi.getArticles("highlights"),
      RogApi.getArticles("listing"),
      RogApi.getDealers(),
    ]);
  },

  /**
   * Fetch Hero Slides from RogAdmin Backend
   */
  async getHeroSlides(options?: FetchOptions): Promise<HeroSlideDto[]> {
    return safeFetch<HeroSlideDto[]>("/public/hero-slides", options);
  },

  /**
   * Fetch 22 Product Categories from RogAdmin Backend
   */
  async getCategories(options?: FetchOptions): Promise<ProductCategoryDto[]> {
    return safeFetch<ProductCategoryDto[]>("/public/product-categories", options);
  },

  /**
   * Fetch Articles by section (highlights or listing)
   */
  async getArticles(section: "highlights" | "listing", options?: FetchOptions): Promise<PublicArticleDto[]> {
    return safeFetch<PublicArticleDto[]>(`/public/articles?section=${section}`, options);
  },

  /**
   * Fetch Site Config (PromoBar, Join Republic, Footer, Company info)
   */
  async getSiteConfig(options?: FetchOptions): Promise<SiteConfigDto | undefined> {
    return safeFetch<SiteConfigDto | undefined>("/public/site-config", options);
  },

  async login(username: string, password: string): Promise<{ token: string; user: { username: string; fullName: string; role: string } }> {
    const url = typeof window === "undefined"
      ? `${BE_INTERNAL_URL}/api/auth/login`
      : `${API_BASE}/auth/login`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) throw new Error(`Đăng nhập thất bại: HTTP ${response.status}`);
    return await response.json();
  },

  async subscribeNewsletter(email: string): Promise<boolean> {
    const response = await fetch(`${API_BASE}/public/newsletter/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return response.ok;
  },

  async submitProductReview(productSlug: string, content: string, rating = 5): Promise<boolean> {
    const response = await fetch(`${API_BASE}/public/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productSlug, content, rating }),
    });
    return response.ok;
  },

  /**
   * Fetch Products Catalog with search and category filtering
   */
  async getProducts(
    params: { category?: string; search?: string; page?: number; pageSize?: number } = {},
    options?: FetchOptions
  ): Promise<PagedResult<ProductListItemDto>> {
    const searchParams = new URLSearchParams();
    if (params.category) searchParams.set("category", params.category);
    if (params.search) searchParams.set("search", params.search);
    if (params.page) searchParams.set("page", params.page.toString());
    if (params.pageSize) searchParams.set("pageSize", params.pageSize.toString());

    const qs = searchParams.toString();
    return safeFetch<PagedResult<ProductListItemDto>>(`/public/products${qs ? `?${qs}` : ""}`, options);
  },

  /**
   * Fetch single product detail by slug
   */
  async getProductItem(slug: string, options?: FetchOptions): Promise<ProductDetailDto | null> {
    try {
      return await safeFetch<ProductDetailDto | null>(`/public/products/item?slug=${encodeURIComponent(slug)}`, options);
    } catch (error) {
      if (error instanceof Error && error.message.includes("HTTP 404")) return null;
      throw error;
    }
  },

  /**
   * Batch lookup prices for multiple slugs
   */
  async getBatchPricing(slugs: string[], options?: FetchOptions): Promise<ProductPriceDto[]> {
    if (!slugs || slugs.length === 0) return [];
    return safeFetch<ProductPriceDto[]>(`/public/pricing/batch?slugs=${encodeURIComponent(slugs.join(","))}`, options);
  },

  /**
   * Multi-product spec comparison matrix
   */
  async compareProducts(slugs: string[]): Promise<CompareMatrixDto | null> {
    if (!slugs || slugs.length === 0) return null;
    return safeFetch<CompareMatrixDto | null>(`/public/products/compare?slugs=${encodeURIComponent(slugs.join(","))}`);
  },

  /**
   * Fetch authorized dealers and stores
   */
  async getDealers(): Promise<DealerDto[]> {
    return safeFetch<DealerDto[]>("/public/dealers");
  },

  /**
   * Check official warranty by serial number
   */
  async checkWarranty(serial: string): Promise<WarrantyCheckDto | null> {
    if (!serial) return null;
    return safeFetch<WarrantyCheckDto | null>(`/public/warranty/check?serial=${encodeURIComponent(serial)}`);
  },
};
