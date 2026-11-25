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

export interface PublicReviewDto {
  id: string;
  productSlug: string;
  authorName: string;
  title: string;
  content: string;
  rating: number;
  isApproved: boolean;
  createdAtUtc: string;
  adminReply?: string | null;
  repliedAt?: string | null;
  repliedBy?: string | null;
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
  galleryImages?: string[];
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

export interface CampaignDto {
  badge: string;
  title: string;
  period: string;
  desc: string;
  img: string;
  ctaText: string;
  ctaLink: string;
}

export interface SoftwareDownloadDto {
  name: string;
  version: string;
  size: string;
  desc: string;
  featuresJson: string;
  os: string;
  badge: string;
  downloadUrl: string;
}

export interface CompareMatrixDto {
  products: ProductDetailDto[];
  commonSpecKeys: string[];
}

export interface ServiceCenterDto {
  city: string;
  name: string;
  address: string;
  phone: string;
  time: string;
}

export interface WarrantyPolicyDto {
  title: string;
  desc: string;
}

export interface SupportInfoDto {
  centers: ServiceCenterDto[];
  policies: WarrantyPolicyDto[];
}

export interface SocialChannelDto {
  name: string;
  members: string;
  desc: string;
  link: string;
  btn: string;
}

export interface EliteTierDto {
  tier: string;
  points: string;
  perk: string;
}

export interface CommunityInfoDto {
  channels: SocialChannelDto[];
  tiers: EliteTierDto[];
}

export interface InnovationDto {
  tag: string;
  title: string;
  desc: string;
  highlightsJson: string;
  img: string;
}

export interface WallpaperDto {
  title: string;
  res: string;
  img: string;
  downloadUrl: string;
}

export interface AboutStoryDto {
  yearTag: string;
  heading: string;
  content: string;
  imageUrl?: string | null;
}

export interface AboutRogDto {
  heroTitle: string;
  heroSubtitle: string;
  manifestoTitle: string;
  manifestoText: string;
  stories: AboutStoryDto[];
}

// ---------- Commerce: giỏ hàng, đơn hàng, tài khoản khách hàng ----------

export interface CreateOrderItemInput {
  slug: string;
  quantity: number;
  selectedSpecs?: string;
  name?: string;
  unitPrice?: number;
}

export interface CreateOrderInput {
  customerName: string;
  email: string;
  phone: string;
  address: string;
  note?: string;
  couponCode?: string;
  items: CreateOrderItemInput[];
}

export interface OrderItemDto {
  productId?: number | null;
  productSlug: string;
  productName: string;
  selectedSpecs: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface OrderDto {
  orderCode: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  note: string;
  subtotal: number;
  shippingFee: number;
  total: number;
  status: string;
  statusText: string;
  createdAt: string;
  items: OrderItemDto[];
  shippingCarrier?: string;
  trackingNumber?: string;
  couponCode?: string | null;
  discountAmount?: number;
}

export interface PublicCouponDto {
  code: string;
  title: string;
  description: string;
  discountType: "Percentage" | "FixedAmount";
  discountValue: number;
  minOrderValue: number;
  maxDiscountAmount?: number | null;
  validTo?: string | null;
}

export interface ValidateCouponResponse {
  valid: boolean;
  code: string;
  title: string;
  message: string;
  discountAmount: number;
  finalTotal: number;
}

export interface CreateOrderResponse {
  orderCode: string;
  total: number;
  status: string;
  createdAt: string;
}

export interface CustomerProfileDto {
  id: number;
  email: string;
  fullName: string;
  phoneNumber: string;
  tier: string;
  points: number;
  orderCount: number;
}

export interface CustomerAuthResponse {
  token: string;
  expiresAtUtc: string;
  user: CustomerProfileDto;
}

export const CUSTOMER_TOKEN_KEY = "rog_customer_token";
export const CUSTOMER_USER_KEY = "rog_customer_user";

export function getCustomerToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(CUSTOMER_TOKEN_KEY);
}

export function getCustomerUser(): CustomerProfileDto | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CUSTOMER_USER_KEY);
    return raw ? (JSON.parse(raw) as CustomerProfileDto) : null;
  } catch {
    return null;
  }
}

export function saveCustomerAuth(auth: CustomerAuthResponse): void {
  window.localStorage.setItem(CUSTOMER_TOKEN_KEY, auth.token);
  window.localStorage.setItem(CUSTOMER_USER_KEY, JSON.stringify(auth.user));
}

export function clearCustomerAuth(): void {
  window.localStorage.removeItem(CUSTOMER_TOKEN_KEY);
  window.localStorage.removeItem(CUSTOMER_USER_KEY);
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

function apiUrl(endpoint: string): string {
  return typeof window === "undefined"
    ? `${BE_INTERNAL_URL}/api${endpoint}`
    : `${API_BASE}${endpoint}`;
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const data = await response.json();
    return data?.message || data?.title || `HTTP ${response.status}`;
  } catch {
    return `HTTP ${response.status}`;
  }
}

async function postJson<T>(endpoint: string, body: unknown, token?: string | null): Promise<T> {
  const response = await fetch(apiUrl(endpoint), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return (await response.json()) as T;
}

async function getJsonAuth<T>(endpoint: string, token?: string | null): Promise<T> {
  const response = await fetch(apiUrl(endpoint), {
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    signal: AbortSignal.timeout(10000),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return (await response.json()) as T;
}

export type VideoItemDto = {
  img: string;
  title: string;
  videoUrl?: string;
  big?: boolean;
};

export type ProductGalleryImageDto = {
  id: number;
  productId: number;
  imageUrl: string;
  caption?: string;
  sortOrder: number;
};

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

  // ---------- Tài khoản khách hàng ----------
  async customerRegister(input: {
    email: string;
    fullName: string;
    phoneNumber: string;
    password: string;
  }): Promise<CustomerAuthResponse> {
    return postJson<CustomerAuthResponse>("/public/auth/register", input);
  },

  async customerLogin(email: string, password: string): Promise<CustomerAuthResponse> {
    return postJson<CustomerAuthResponse>("/public/auth/login", { email, password });
  },

  async getCustomerMe(token?: string | null): Promise<CustomerProfileDto> {
    return getJsonAuth<CustomerProfileDto>("/public/auth/me", token ?? getCustomerToken());
  },

  // ---------- Mã giảm giá / Coupons ----------
  async getPublicCoupons(): Promise<PublicCouponDto[]> {
    return safeFetch<PublicCouponDto[]>("/public/coupons");
  },

  async validateCoupon(code: string, orderSubtotal: number): Promise<ValidateCouponResponse> {
    return postJson<ValidateCouponResponse>("/public/coupons/validate", { code, orderSubtotal });
  },

  // ---------- Đơn hàng ----------
  async createOrder(input: CreateOrderInput, token?: string | null): Promise<CreateOrderResponse> {
    return postJson<CreateOrderResponse>("/public/orders", input, token ?? getCustomerToken());
  },

  async getOrder(orderCode: string): Promise<OrderDto> {
    return getJsonAuth<OrderDto>(`/public/orders/${encodeURIComponent(orderCode)}`);
  },

  async getMyOrders(token?: string | null): Promise<OrderDto[]> {
    return getJsonAuth<OrderDto[]>("/public/orders/mine", token ?? getCustomerToken());
  },

  async subscribeNewsletter(email: string): Promise<boolean> {
    try {
      const response = await fetch(apiUrl("/public/newsletter/subscribe"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        signal: AbortSignal.timeout(5000),
      });
      return response.ok;
    } catch {
      return false;
    }
  },

  async submitProductReview(productSlug: string, content: string, rating = 5, authorName?: string, title?: string): Promise<boolean> {
    try {
      const response = await fetch(apiUrl("/public/reviews"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productSlug, content, rating, authorName, title }),
        signal: AbortSignal.timeout(5000),
      });
      return response.ok;
    } catch {
      return false;
    }
  },

  async getProductReviews(productSlug: string, options?: FetchOptions): Promise<PublicReviewDto[]> {
    return safeFetch<PublicReviewDto[]>(`/public/reviews?productSlug=${encodeURIComponent(productSlug)}`, options);
  },

  async cancelOrder(orderCode: string, token?: string | null): Promise<boolean> {
    const url = apiUrl(`/public/orders/${encodeURIComponent(orderCode)}/cancel`);
    const authToken = token ?? getCustomerToken();
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
    });
    if (!response.ok) {
      throw new Error(await readErrorMessage(response));
    }
    return true;
  },

  async changeCustomerPassword(input: { oldPassword: string; newPassword: string }, token?: string | null): Promise<boolean> {
    const url = apiUrl("/public/auth/change-password");
    const authToken = token ?? getCustomerToken();
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
      body: JSON.stringify(input),
    });
    if (!response.ok) {
      throw new Error(await readErrorMessage(response));
    }
    return true;
  },

  async updateCustomerProfile(input: { fullName: string; phoneNumber: string }, token?: string | null): Promise<CustomerProfileDto> {
    const url = apiUrl("/public/auth/profile");
    const authToken = token ?? getCustomerToken();
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
      body: JSON.stringify(input),
    });
    if (!response.ok) {
      throw new Error(await readErrorMessage(response));
    }
    const updated = (await response.json()) as CustomerProfileDto;
    if (typeof window !== "undefined") {
      const current = getCustomerUser();
      if (current) {
        window.localStorage.setItem(CUSTOMER_USER_KEY, JSON.stringify({ ...current, ...updated }));
      }
    }
    return updated;
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

  /**
   * Fetch active campaigns and events
   */
  async getCampaigns(): Promise<CampaignDto[]> {
    return safeFetch<CampaignDto[]>("/public/campaigns");
  },

  /**
   * Fetch software downloads and utilities
   */
  async getDownloads(): Promise<SoftwareDownloadDto[]> {
    return safeFetch<SoftwareDownloadDto[]>("/public/downloads");
  },

  /**
   * Fetch customer support centers and warranty policies
   */
  async getSupportInfo(): Promise<SupportInfoDto | null> {
    return safeFetch<SupportInfoDto | null>("/public/support-info");
  },

  /**
   * Fetch community social channels and ROG Elite tier perks
   */
  async getCommunityInfo(): Promise<CommunityInfoDto | null> {
    return safeFetch<CommunityInfoDto | null>("/public/community-info");
  },

  /**
   * Fetch ROG innovations and technologies
   */
  async getInnovations(): Promise<InnovationDto[]> {
    return safeFetch<InnovationDto[]>("/public/innovations");
  },

  /**
   * Fetch 4K Wallpapers
   */
  async getWallpapers(): Promise<WallpaperDto[]> {
    return safeFetch<WallpaperDto[]>("/public/wallpapers");
  },

  /**
   * Fetch About ROG stories, manifesto and pillars
   */
  async getAboutRog(): Promise<AboutRogDto | null> {
    return safeFetch<AboutRogDto | null>("/public/about-rog");
  },

  /**
   * Fetch Featured YouTube & product review videos
   */
  async getVideos(): Promise<VideoItemDto[]> {
    return safeFetch<VideoItemDto[]>("/public/videos");
  },

  /**
   * Fetch full article detail with contentHtml
   */
  async getArticleDetail(slugPath: string, options?: FetchOptions): Promise<{
    title: string;
    lead: string;
    date: string;
    image: string;
    category: string;
    contentHtml: string;
    author?: string;
  } | null> {
    const slug = slugPath.replace(/^\/+|\/+$/g, "").split("/").map(encodeURIComponent).join("/");
    return safeFetch(`/public/articles/${slug}`, options);
  },

  /**
   * Fetch individual service centers
   */
  async getServiceCenters(options?: FetchOptions): Promise<unknown[] | null> {
    return safeFetch("/public/service-centers", options);
  },

  /**
   * Fetch individual warranty policies
   */
  async getWarrantyPolicies(options?: FetchOptions): Promise<unknown[] | null> {
    return safeFetch("/public/warranty-policies", options);
  },
};
