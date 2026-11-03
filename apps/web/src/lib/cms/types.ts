export interface ImageRendition {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
}

export interface Brand {
  id: number;
  title: string;
  slug: string;
  logo: string | null;
  cover_image: string;
  description: string;
  entry_banner: string;
  exit_banner: string;
  promo_banner: string | null;
  is_entry_banner_pdf?: boolean;
  is_exit_banner_pdf?: boolean;
  is_promo_banner_pdf?: boolean;
  instagram_url: string | null;
  revista_url: string | null;
  fichas_tecnicas_url: string | null;
  is_featured_home: boolean;
  product_count?: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  brand: {
    id: number;
    title: string;
    slug: string;
  };
  category: {
    id: number;
    name: string;
    slug: string;
  };
  price: number;
  description: string;
  model_photo: string; // Prenda puesta con modelo
  floating_photo: string; // Prenda flotante sin modelo
  gallery?: string[]; // Fotografías adicionales
}

export interface HomePageData {
  title: string;
  editorial_title: string;
  editorial_intro: string;
  editorial_body: string;
  slider_brands: Brand[];
  featured_brands: Brand[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}
