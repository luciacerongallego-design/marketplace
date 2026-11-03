import { Brand, Category, Product, HomePageData } from "./types";
import { MOCK_BRANDS, MOCK_CATEGORIES, MOCK_HOME_DATA, MOCK_PRODUCTS } from "./mock-data";

const CMS_URL = (process.env.CMS_API_URL ?? "http://localhost:8000").replace(/\/$/, "");
export const REVALIDATE_SECONDS = 3600;

export async function fetchWithFallback<T>(
  url: string,
  options: { tags?: string[]; revalidate?: number } = {},
  fallback: T
): Promise<T> {
  try {
    const res = await fetch(url, {
      next: {
        revalidate: options.revalidate ?? REVALIDATE_SECONDS,
        tags: options.tags ?? ["cms"],
      },
    });

    if (!res.ok) {
      console.warn(`[CMS] Error ${res.status} al consultar ${url}. Usando fallback.`);
      return fallback;
    }

    const data = await res.json();
    return data as T;
  } catch (err) {
    console.warn(`[CMS] No se pudo conectar a ${url} (${err instanceof Error ? err.message : String(err)}). Usando fallback.`);
    return fallback;
  }
}

export async function getHomePageData(): Promise<HomePageData> {
  const url = `${CMS_URL}/api/v2/pages/?type=marketplace.HomePage&fields=*`;
  const raw = await fetchWithFallback<any>(url, { tags: ["cms", "home"] }, null);

  if (!raw || !raw.items || raw.items.length === 0) {
    return MOCK_HOME_DATA;
  }

  const page = raw.items[0];
  const brands = await getBrands();

  return {
    title: page.title || MOCK_HOME_DATA.title,
    editorial_title: page.editorial_title || MOCK_HOME_DATA.editorial_title,
    editorial_intro: page.editorial_intro || MOCK_HOME_DATA.editorial_intro,
    editorial_body: page.editorial_body || MOCK_HOME_DATA.editorial_body,
    slider_brands: brands,
    featured_brands: brands.filter((b) => b.is_featured_home),
  };
}

export async function getBrands(): Promise<Brand[]> {
  const url = `${CMS_URL}/api/v2/pages/?type=marketplace.BrandPage&fields=*&limit=50`;
  const raw = await fetchWithFallback<any>(url, { tags: ["cms", "brands", "type:brand"] }, null);

  if (!raw || !raw.items || raw.items.length === 0) {
    return MOCK_BRANDS;
  }

  return raw.items.map((item: any): Brand => ({
    id: item.id,
    title: item.title,
    slug: item.meta?.slug || item.slug,
    logo: item.logo?.url || null,
    cover_image: item.cover_image?.url || MOCK_BRANDS[0].cover_image,
    description: item.description || "",
    entry_banner: item.entry_banner?.url || MOCK_BRANDS[0].entry_banner,
    exit_banner: item.exit_banner?.url || MOCK_BRANDS[0].exit_banner,
    promo_banner: item.promo_banner?.url || item.entry_banner?.url || null,
    instagram_url: item.instagram_url || null,
    revista_url: item.revista_url || null,
    fichas_tecnicas_url: item.fichas_tecnicas_doc?.url || item.fichas_tecnicas_url || null,
    is_featured_home: item.is_featured_home ?? true,
  }));
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

  const raw = await fetchWithFallback<any>(url, { tags: ["cms", "products", "type:product"] }, null);

  let products: Product[] = [];
  if (!raw || !raw.items || raw.items.length === 0) {
    products = MOCK_PRODUCTS;
  } else {
    products = raw.items.map((item: any): Product => ({
      id: item.id,
      title: item.title,
      slug: item.meta?.slug || item.slug,
      brand: {
        id: item.brand?.id || 1,
        title: item.brand?.title || "134340",
        slug: item.brand?.slug || "134340",
      },
      category: {
        id: item.category?.id || 1,
        name: item.category?.name || "Prendas Superiores",
        slug: item.category?.slug || "prendas-superiores",
      },
      price: Number(item.price || 0),
      description: item.description || "",
      model_photo: item.model_photo?.url || MOCK_PRODUCTS[0].model_photo,
      floating_photo: item.floating_photo?.url || MOCK_PRODUCTS[0].floating_photo,
      gallery: item.gallery?.map((g: any) => g.image?.url || g.url) || [],
    }));
  }

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
  const raw = await fetchWithFallback<any>(url, { tags: ["cms", "categories"] }, null);

  if (!raw || !raw.items || raw.items.length === 0) {
    return MOCK_CATEGORIES;
  }

  return raw.items;
}
