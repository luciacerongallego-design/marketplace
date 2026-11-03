import React from "react";
import { getProducts, getBrands, getCategories } from "@/lib/cms/client";
import { ProductCatalogWithFilters } from "@/components/ProductCatalogWithFilters";
import { Sparkles } from "lucide-react";

export const revalidate = 3600;

export default async function ProductosPage() {
  const [products, brands, categories] = await Promise.all([
    getProducts(),
    getBrands(),
    getCategories(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-10">
      {/* Editorial Header */}
      <div className="border-b border-stone-200 pb-8 space-y-3">
        <div className="flex items-center space-x-2 text-stone-500 text-xs tracking-tight uppercase font-bold">
          <Sparkles className="w-4 h-4" />
          <span>Catálogo General UPB</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-stone-950 uppercase tracking-tight">
          Catálogo de Productos
        </h1>
        <p className="text-sm sm:text-base text-stone-600 max-w-2xl font-sans leading-relaxed font-normal">
          Explora la totalidad de las prendas y accesorios de todas las marcas participantes. Utiliza los filtros para navegar por categoría, diseñador o rango de precio.
        </p>
      </div>

      {/* Interactive Catalog with Functional Filters */}
      <ProductCatalogWithFilters
        initialProducts={products}
        brands={brands}
        categories={categories}
      />
    </div>
  );
}
