import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Compass } from "lucide-react";
import { getHomePageData, getProducts } from "@/lib/cms/client";
import { BrandSlider } from "@/components/BrandSlider";
import { ProductCard } from "@/components/ProductCard";

export const revalidate = 3600;

export default async function HomePage() {
  const homeData = await getHomePageData();
  const recentProducts = (await getProducts()).slice(0, 4);

  return (
    <div className="space-y-16 sm:space-y-24 pb-24">
      {/* SECCIÓN A: SLIDER DE MARCAS */}
      <BrandSlider brands={homeData.slider_brands} />

      {/* SECCIÓN B: PRESENTACIÓN EDITORIAL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center space-x-2 text-stone-500 text-xs tracking-wideEditorial uppercase">
              <Compass className="w-4 h-4" />
              <span>Manifiesto & Propósito</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-light text-stone-950 tracking-tight leading-tight">
              {homeData.editorial_title}
            </h1>
            <div className="w-16 h-0.5 bg-stone-900 mt-6" />
          </div>

          <div className="lg:col-span-7 space-y-6 text-stone-700 font-sans leading-relaxed text-sm sm:text-base">
            <p className="font-medium text-stone-900 text-base sm:text-lg leading-relaxed">
              {homeData.editorial_intro}
            </p>
            <p className="text-stone-600">
              {homeData.editorial_body}
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                href="/marcas"
                className="inline-flex items-center space-x-2 px-6 py-3.5 bg-stone-950 text-white text-xs tracking-editorial uppercase font-medium hover:bg-stone-800 transition-colors"
              >
                <span>Conocer las Marcas</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/productos"
                className="inline-flex items-center space-x-2 px-6 py-3.5 border border-stone-300 text-stone-900 text-xs tracking-editorial uppercase font-medium hover:border-stone-900 transition-colors"
              >
                <span>Explorar Catálogo General</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN C: MARCAS DESTACADAS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-stone-200 pb-6 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-stone-500 text-xs tracking-wideEditorial uppercase">
              <Sparkles className="w-4 h-4" />
              <span>Selección Editorial</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-light text-stone-950 tracking-tight mt-1">
              Marcas Destacadas
            </h2>
          </div>
          <Link
            href="/marcas"
            className="text-xs uppercase tracking-editorial text-stone-700 hover:text-stone-950 font-semibold inline-flex items-center space-x-1"
          >
            <span>Ver Directorio Completo ({homeData.slider_brands.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {homeData.featured_brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/marcas/${brand.slug}`}
              className="group flex flex-col space-y-4 bg-white border border-stone-200/80 p-5 hover:border-stone-950 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <div className="relative aspect-[4/5] w-full bg-stone-100 overflow-hidden">
                <Image
                  src={brand.cover_image}
                  alt={brand.title}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm text-[10px] tracking-wideEditorial uppercase font-semibold text-stone-900 px-3 py-1">
                    Espacio de Marca
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-medium text-stone-950 uppercase tracking-widest group-hover:text-stone-600 transition-colors">
                    {brand.title}
                  </h3>
                  <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-stone-950 group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                  {brand.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* NOVEDADES / MUESTRA DE PRODUCTOS RECIENTES */}
      {recentProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex items-end justify-between border-b border-stone-200 pb-6">
            <div>
              <p className="text-stone-500 text-xs tracking-wideEditorial uppercase">
                Colecciones en Vitrina
              </p>
              <h2 className="text-2xl sm:text-3xl font-light text-stone-950 tracking-tight mt-1">
                Prendas Recientes
              </h2>
            </div>
            <Link
              href="/productos"
              className="text-xs uppercase tracking-editorial text-stone-700 hover:text-stone-950 font-semibold inline-flex items-center space-x-1"
            >
              <span>Ver todas las prendas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {recentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* SECCIÓN D: ACCESO AL CATÁLOGO GENERAL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-stone-950 text-white p-8 sm:p-16 lg:p-20 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="text-[11px] tracking-wideEditorial uppercase text-stone-400">
              Catálogo Unificado UPB
            </span>
            <h2 className="text-3xl sm:text-5xl font-light tracking-tight leading-tight">
              Explora todas las prendas de todas las marcas
            </h2>
            <p className="text-stone-300 text-sm leading-relaxed">
              Filtra por silueta, categoría de vestuario, marca creadora y rangos de precio en una experiencia curada e interactiva.
            </p>
          </div>

          <div className="relative z-10 flex-shrink-0">
            <Link
              href="/productos"
              className="inline-flex items-center space-x-3 px-8 py-4 bg-white text-stone-950 text-xs tracking-editorial uppercase font-bold hover:bg-stone-200 transition-colors shadow-xl"
            >
              <span>Ir al Catálogo General</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Subtle artistic background texture */}
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-stone-800/40 rounded-full blur-3xl pointer-events-none" />
        </div>
      </section>
    </div>
  );
}
