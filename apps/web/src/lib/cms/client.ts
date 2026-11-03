import { Brand, Category, Product, HomePageData } from "./types";
import { MOCK_BRANDS, MOCK_CATEGORIES, MOCK_HOME_DATA, MOCK_PRODUCTS } from "./mock-data";

export const CMS_URL = (process.env.CMS_API_URL ?? "http://localhost:8000").replace(/\/$/, "");
export const REVALIDATE_SECONDS = 3600;

// Placeholder neutral SVG para marcas y productos que aún no tengan imagen cargada en Wagtail
const NEUTRAL_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23f5f5f4'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%23a8a29e' font-weight='600' letter-spacing='0.1em'%3EPRODUCTO COMERCIAL%3C/text%3E%3C/svg%3E";

export function isPdfUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.toLowerCase().includes(".pdf");
}

/**
 * Normaliza las URLs de medios para que funcionen tanto en local como en producción
 */
export function resolveMediaUrl(url: string | null | undefined, fallback: string = NEUTRAL_PLACEHOLDER): string {
  if (!url) return fallback;
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }
  // URL relativa desde Wagtail (e.g. /media/images/banner.jpg)
  const cleanPath = url.startsWith("/") ? url : `/${url}`;
  return `${CMS_URL}${cleanPath}`;
}

export async function fetchFromCms<T>(
  url: string,
  options: { tags?: string[]; revalidate?: number } = {},
  fallback: T
): Promise<{ data: T; isFromCms: boolean }> {
  try {
    const isDev = process.env.NODE_ENV === "development";
    const res = await fetch(url, {
      ...(isDev
        ? { cache: "no-store" as const }
        : {
            next: {
              revalidate: options.revalidate ?? REVALIDATE_SECONDS,
              tags: options.tags ?? ["cms"],
            },
          }),
    });

    if (!res.ok) {
      console.warn(`[CMS API Error ${res.status}] en ${url}. Se utilizará respaldo.`);
      return { data: fallback, isFromCms: false };
    }

    const data = await res.json();
    return { data: data as T, isFromCms: true };
  } catch (err) {
    console.warn(
      `[CMS Desconectado] No se pudo conectar con el CMS en ${url} (${err instanceof Error ? err.message : String(err)}). Se utilizará respaldo para no interrumpir el frontend.`
    );
    return { data: fallback, isFromCms: false };
  }
}

export async function getHomePageData(): Promise<HomePageData> {
  const url = `${CMS_URL}/api/v2/pages/?type=marketplace.HomePage&fields=*`;
  const { data: raw, isFromCms } = await fetchFromCms<any>(url, { tags: ["cms", "home"] }, null);

  if (!isFromCms || !raw || !raw.items || raw.items.length === 0) {
    return MOCK_HOME_DATA;
  }

  const page = raw.items[0];
  const brands = await getBrands();

  return {
    title: page.title || "Producto Comercial",
    editorial_title: page.editorial_title || MOCK_HOME_DATA.editorial_title,
    editorial_intro: page.editorial_intro || MOCK_HOME_DATA.editorial_intro,
    editorial_body: page.editorial_body || MOCK_HOME_DATA.editorial_body,
    slider_brands: brands,
    featured_brands: brands.filter((b) => b.is_featured_home),
  };
}

export async function getBrands(): Promise<Brand[]> {
  const url = `${CMS_URL}/api/v2/pages/?type=marketplace.BrandPage&fields=*&limit=50`;
  const { data: raw, isFromCms } = await fetchFromCms<any>(url, { tags: ["cms", "brands", "type:brand"] }, null);

  // Si no hay conexión al CMS, usar respaldo temporal
  if (!isFromCms || !raw || !Array.isArray(raw.items)) {
    return MOCK_BRANDS;
  }

  // Si el CMS respondió con éxito, usar SIEMPRE los datos reales de Wagtail
  return raw.items.map((item: any): Brand => {
    const entryBannerUrl = resolveMediaUrl(item.entry_banner?.url, NEUTRAL_PLACEHOLDER);
    const exitBannerUrl = resolveMediaUrl(item.exit_banner?.url, entryBannerUrl);
    const promoBannerUrl = item.promo_banner?.url
      ? resolveMediaUrl(item.promo_banner.url)
      : entryBannerUrl;

    const isEntryPdf = Boolean(item.entry_banner?.is_pdf || isPdfUrl(item.entry_banner?.url));
    const isExitPdf = Boolean(item.exit_banner?.is_pdf || isPdfUrl(item.exit_banner?.url));
    const isPromoPdf = Boolean(item.promo_banner?.is_pdf || isPdfUrl(item.promo_banner?.url));

    return {
      id: item.id,
      title: item.title,
      slug: item.meta?.slug || item.slug,
      logo: item.logo?.url ? resolveMediaUrl(item.logo.url) : null,
      cover_image: resolveMediaUrl(item.cover_image?.url, entryBannerUrl),
      description: item.description || "",
      entry_banner: entryBannerUrl,
      exit_banner: exitBannerUrl,
      promo_banner: promoBannerUrl,
      is_entry_banner_pdf: isEntryPdf,
      is_exit_banner_pdf: isExitPdf,
      is_promo_banner_pdf: isPromoPdf,
      instagram_url: item.instagram_url || null,
      revista_url: item.revista_url || null,
      fichas_tecnicas_url: item.fichas_tecnicas_doc?.url
        ? resolveMediaUrl(item.fichas_tecnicas_doc.url)
        : item.fichas_tecnicas_url || null,
      is_featured_home: item.is_featured_home ?? true,
    };
  });
}

export async function getBrandBySlug(slug: string): Promise<Brand | null> {
  const brands = await getBrands();
  const brand = brands.find((b) => b.slug.toLowerCase() === slug.toLowerCase());
  return brand ?? null;
}

export async function getProducts(options?: { brandSlug?: string; categorySlug?: string }): Promise<Product[]> {
  let url = `${CMS_URL}/api/v2/pages/?type=marketplace.ProductPage&fields=*&limit=100`;
  if (options?.brandSlug) {
    url += `&brand_slug=${encodeURIComponent(options.brandSlug)}`;
  }
  if (options?.categorySlug) {
    url += `&category_slug=${encodeURIComponent(options.categorySlug)}`;
  }

  const { data: raw, isFromCms } = await fetchFromCms<any>(url, { tags: ["cms", "products", "type:product"] }, null);

  let products: Product[] = [];

  // Si no hay conexión al CMS, usar mock
  if (!isFromCms || !raw || !Array.isArray(raw.items)) {
    products = MOCK_PRODUCTS;
  } else {
    // Si el CMS respondió, usar SIEMPRE los productos reales
    products = raw.items.map((item: any): Product => {
      const modelPhotoUrl = resolveMediaUrl(item.model_photo?.url, NEUTRAL_PLACEHOLDER);
      const floatingPhotoUrl = resolveMediaUrl(item.floating_photo?.url, modelPhotoUrl);
      const galleryUrls = (item.gallery || []).map((g: any) =>
        resolveMediaUrl(g.url || g.image?.url)
      );

      return {
        id: item.id,
        title: item.title,
        slug: item.meta?.slug || item.slug,
        brand: {
          id: item.brand?.id || 0,
          title: item.brand?.title || "Marca UPB",
          slug: item.brand?.slug || "marca-upb",
        },
        category: {
          id: item.category?.id || 0,
          name: item.category?.name || "General",
          slug: item.category?.slug || "general",
        },
        price: Number(item.price || 0),
        description: item.description || "",
        model_photo: modelPhotoUrl,
        floating_photo: floatingPhotoUrl,
        gallery: galleryUrls,
      };
    });
  }

  // Filtrado adicional en memoria para garantizar consistencia
  if (options?.brandSlug) {
    products = products.filter((p) => p.brand.slug.toLowerCase() === options.brandSlug!.toLowerCase());
  }
  if (options?.categorySlug) {
    products = products.filter((p) => p.category.slug.toLowerCase() === options.categorySlug!.toLowerCase());
  }

  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts();
  const product = products.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
  return product ?? null;
}

export async function getCategories(): Promise<Category[]> {
  const url = `${CMS_URL}/api/v2/categories/`;
  const { data: raw, isFromCms } = await fetchFromCms<any>(url, { tags: ["cms", "categories"] }, null);

  if (!isFromCms || !raw || !Array.isArray(raw.items)) {
    return MOCK_CATEGORIES;
  }

  return raw.items;
}
