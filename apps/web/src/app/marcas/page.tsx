import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { getBrands, getProducts } from "@/lib/cms/client";

export const revalidate = 3600;

export default async function MarcasPage() {
  const brands = await getBrands();
  const allProducts = await getProducts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12">
      {/* Editorial Header */}
      <div className="border-b border-stone-200 pb-8 space-y-3">
        <div className="flex items-center space-x-2 text-stone-500 text-xs tracking-tight uppercase font-bold">
          <Sparkles className="w-4 h-4" />
          <span>Directorio UPB</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-stone-950 uppercase tracking-tight">
          Marcas Participantes
        </h1>
        <p className="text-sm sm:text-base text-stone-600 max-w-2xl font-sans leading-relaxed font-normal">
          Conoce los universos conceptuales, universos visuales y propuestas de indumentaria desarrolladas por los estudiantes de Producto Comercial. Cada marca cuenta con su propio apartado y catálogo independiente.
        </p>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
        {brands.map((brand) => {
          const productCount = allProducts.filter(
            (p) => p.brand.slug.toLowerCase() === brand.slug.toLowerCase()
          ).length;

          return (
            <Link
              key={brand.id}
              href={`/marcas/${brand.slug}`}
              className="group flex flex-col bg-white border border-stone-200 hover:border-stone-950 transition-all duration-300 shadow-sm hover:shadow-md overflow-hidden"
            >
              {/* Cover Image */}
              <div className="relative aspect-[16/10] w-full bg-stone-100 overflow-hidden">
                <Image
                  src={brand.cover_image || brand.entry_banner}
                  alt={`Identidad de ${brand.title}`}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors" />

                {/* Slug Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-white/95 backdrop-blur-sm text-[10px] tracking-tight uppercase font-bold text-stone-900 px-3 py-1">
                    /{brand.slug}
                  </span>
                </div>
              </div>

              {/* Brand Info */}
              <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black text-stone-950 uppercase tracking-tight group-hover:text-stone-600 transition-colors">
                      {brand.title}
                    </h2>
                    <ArrowUpRight className="w-5 h-5 text-stone-400 group-hover:text-stone-950 transition-colors" />
                  </div>
                  <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed font-normal">
                    {brand.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <span className="font-bold tracking-tight uppercase text-[10px]">
                    {productCount} {productCount === 1 ? "prenda en vitrina" : "prendas en vitrina"}
                  </span>
                  <span className="text-stone-950 font-black uppercase tracking-tight text-[11px] group-hover:underline">
                    Ver Tienda →
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
