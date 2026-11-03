"use client";

import React, { useState, useMemo } from "react";
import { Product, Brand, Category } from "@/lib/cms/types";
import { ProductCard } from "./ProductCard";
import { SlidersHorizontal, RotateCcw, Search, ChevronDown } from "lucide-react";
import { formatPrice } from "./DemoCartDrawer";

interface ProductCatalogWithFiltersProps {
  initialProducts: Product[];
  brands: Brand[];
  categories: Category[];
}

export function ProductCatalogWithFilters({
  initialProducts,
  brands,
  categories,
}: ProductCatalogWithFiltersProps) {
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("default");

  // Determine global min and max prices from initialProducts
  const priceRange = useMemo(() => {
    if (initialProducts.length === 0) return { min: 0, max: 500000 };
    const prices = initialProducts.map((p) => p.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [initialProducts]);

  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(priceRange.max || 500000);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Live filtering
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // Filter by brand
      if (selectedBrand !== "all" && product.brand.slug !== selectedBrand) {
        return false;
      }

      // Filter by category
      if (selectedCategory !== "all" && product.category.slug !== selectedCategory) {
        return false;
      }

      // Filter by price range
      if (product.price < minPrice || product.price > maxPrice) {
        return false;
      }

      // Filter by text search
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesTitle = product.title.toLowerCase().includes(query);
        const matchesBrand = product.brand.title.toLowerCase().includes(query);
        const matchesCategory = product.category.name.toLowerCase().includes(query);
        if (!matchesTitle && !matchesBrand && !matchesCategory) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "name-asc") return a.title.localeCompare(b.title);
      return 0;
    });
  }, [initialProducts, selectedBrand, selectedCategory, minPrice, maxPrice, searchQuery, sortBy]);

  const isFiltered =
    selectedBrand !== "all" ||
    selectedCategory !== "all" ||
    searchQuery !== "" ||
    minPrice > 0 ||
    maxPrice < priceRange.max;

  const resetFilters = () => {
    setSelectedBrand("all");
    setSelectedCategory("all");
    setSearchQuery("");
    setMinPrice(0);
    setMaxPrice(priceRange.max);
    setSortBy("default");
  };

  return (
    <div className="space-y-8">
      {/* Top Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-6 border border-stone-200/90 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Buscar prenda, marca o categoría..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 focus:outline-none focus:border-stone-900 transition-colors"
            />
          </div>

          {/* Quick Selects */}
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            {/* Category Select */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2.5 text-xs bg-stone-50 border border-stone-200 text-stone-800 focus:outline-none focus:border-stone-900 uppercase tracking-wider"
            >
              <option value="all">Todas las Categorías</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Brand Select */}
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="px-3 py-2.5 text-xs bg-stone-50 border border-stone-200 text-stone-800 focus:outline-none focus:border-stone-900 uppercase tracking-wider"
            >
              <option value="all">Todas las Marcas</option>
              {brands.map((b) => (
                <option key={b.id} value={b.slug}>
                  {b.title}
                </option>
              ))}
            </select>

            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2.5 text-xs bg-stone-50 border border-stone-200 text-stone-800 focus:outline-none focus:border-stone-900 uppercase tracking-wider"
            >
              <option value="default">Orden por Defecto</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
              <option value="name-asc">Nombre: A - Z</option>
            </select>

            {/* Mobile filters button */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="md:hidden px-3 py-2.5 bg-stone-900 text-white text-xs flex items-center space-x-2"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Precio</span>
            </button>

            {/* Reset button */}
            {isFiltered && (
              <button
                onClick={resetFilters}
                className="px-3 py-2.5 text-xs text-stone-600 hover:text-stone-950 flex items-center space-x-1.5 transition-colors border border-stone-200 hover:border-stone-400"
                title="Limpiar todos los filtros"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Limpiar</span>
              </button>
            )}
          </div>
        </div>

        {/* Price Slider Section (Desktop & Toggleable on Mobile) */}
        <div
          className={`${
            showMobileFilters ? "block" : "hidden md:block"
          } pt-4 border-t border-stone-100`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3 text-xs text-stone-600">
              <span className="font-semibold uppercase tracking-wider text-stone-900">
                Rango de Precio:
              </span>
              <span className="font-mono bg-stone-100 px-2 py-1 rounded">
                {formatPrice(minPrice)} — {formatPrice(maxPrice)}
              </span>
            </div>

            <div className="flex items-center space-x-4 flex-1 max-w-md">
              <input
                type="range"
                min="0"
                max={priceRange.max}
                step="10000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-stone-950 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between pb-2 border-b border-stone-200">
        <p className="text-xs uppercase tracking-wideEditorial text-stone-500 font-medium">
          Mostrando {filteredProducts.length} de {initialProducts.length} prendas
        </p>

        {isFiltered && (
          <span className="text-xs text-stone-500 italic">
            Filtros activos
          </span>
        )}
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center space-y-4 bg-white border border-stone-200">
          <p className="text-base font-serif text-stone-800">
            No se encontraron prendas con los criterios seleccionados.
          </p>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            Prueba ajustando el rango de precio, cambiando de categoría o limpiando los filtros para ver más opciones.
          </p>
          <button
            onClick={resetFilters}
            className="px-6 py-2.5 bg-stone-950 text-white text-xs uppercase tracking-editorial font-medium hover:bg-stone-800 transition-colors"
          >
            Ver Todo el Catálogo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} showBrand={true} />
          ))}
        </div>
      )}
    </div>
  );
}
