import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Instagram, FileText, ArrowLeft, ExternalLink } from "lucide-react";
import { getBrands, getBrandBySlug, getProducts } from "@/lib/cms/client";
import { ProductCard } from "@/components/ProductCard";

export const revalidate = 3600;

export async function generateStaticParams() {
  const brands = await getBrands();
  return brands.map((brand) => ({
    slug: brand.slug,
  }));
}

export default async function BrandDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);

  if (!brand) {
    notFound();
  }

  // Get products specific to this brand
  const products = await getProducts({ brandSlug: brand.slug });

  const hasRevista = Boolean(brand.revista_url);
  const hasInstagram = Boolean(brand.instagram_url);
  const hasFichas = Boolean(brand.fichas_tecnicas_url);

  return (
    <div className="space-y-16 sm:space-y-24 pb-24">
      {/* SECCIÓN A: BANNER DE ENTRADA (Gran formato superior) */}
      <section className="relative w-full h-[50vh] sm:h-[65vh] min-h-[380px] max-h-[650px] bg-stone-900 overflow-hidden">
        <Image
          src={brand.entry_banner}
          alt={`Banner principal ${brand.title}`}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

        {/* Back Link */}
        <div className="absolute top-6 left-4 sm:left-8 z-20">
          <Link
            href="/marcas"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-black/40 hover:bg-black/70 backdrop-blur-md text-white text-xs tracking-editorial uppercase transition-colors rounded"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a Marcas</span>
          </Link>
        </div>

        {/* Banner Title */}
        <div className="absolute inset-x-0 bottom-0 z-20 pb-12 sm:pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-stone-300 text-[11px] tracking-wideEditorial uppercase block mb-2 font-medium">
            Espacio Oficial de Marca · UPB
          </span>
          <h1 className="text-4xl sm:text-7xl font-serif text-white tracking-tight uppercase font-light">
            {brand.title}
          </h1>
        </div>
      </section>

      {/* SECCIÓN B & C: IDENTIDAD DE MARCA Y BOTONES DE ACCESO EXTERNO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-stone-200 p-8 sm:p-12 space-y-8 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Identity Info */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center space-x-4">
                {brand.logo && (
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border border-stone-200 bg-stone-50 flex-shrink-0">
                    <Image
                      src={brand.logo}
                      alt={`Logo ${brand.title}`}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                )}
                <div>
                  <h2 className="text-2xl sm:text-3xl font-serif text-stone-950 uppercase tracking-wider font-medium">
                    {brand.title}
                  </h2>
                  <p className="text-xs text-stone-500 uppercase tracking-wideEditorial">
                    Colección Producto Comercial
                  </p>
                </div>
              </div>

              <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-sans max-w-3xl pt-2">
                {brand.description}
              </p>
            </div>

            {/* SECCIÓN C: BOTONES DE ACCESO EXTERNO (Revista, Instagram, Fichas Técnicas) */}
            <div className="lg:col-span-4 flex flex-col space-y-3 pt-2 lg:border-l lg:border-stone-200 lg:pl-8">
              <span className="text-[11px] tracking-wideEditorial uppercase text-stone-400 font-semibold mb-1">
                Recursos Editoriales & Técnicos
              </span>

              {/* Botón 1: REVISTA */}
              {hasRevista && (
                <a
                  href={brand.revista_url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between px-5 py-3.5 bg-stone-950 text-white text-xs tracking-editorial uppercase font-medium hover:bg-stone-800 transition-colors shadow-sm"
                >
                  <div className="flex items-center space-x-2.5">
                    <BookOpen className="w-4 h-4 text-stone-300" />
                    <span>Revista Digital</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                </a>
              )}

              {/* Botón 2: INSTAGRAM */}
              {hasInstagram && (
                <a
                  href={brand.instagram_url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between px-5 py-3.5 bg-white border border-stone-300 text-stone-900 text-xs tracking-editorial uppercase font-medium hover:border-stone-900 hover:bg-stone-50 transition-colors"
                >
                  <div className="flex items-center space-x-2.5">
                    <Instagram className="w-4 h-4 text-stone-600" />
                    <span>Instagram Oficial</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                </a>
              )}

              {/* Botón 3: FICHAS TÉCNICAS */}
              {hasFichas && (
                <a
                  href={brand.fichas_tecnicas_url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between px-5 py-3.5 bg-stone-100 text-stone-800 text-xs tracking-editorial uppercase font-medium hover:bg-stone-200 transition-colors"
                >
                  <div className="flex items-center space-x-2.5">
                    <FileText className="w-4 h-4 text-stone-600" />
                    <span>Fichas Técnicas</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                </a>
              )}

              {!hasRevista && !hasInstagram && !hasFichas && (
                <p className="text-xs text-stone-400 italic">
                  Recursos externos en proceso de actualización por el diseñador.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN D: CATÁLOGO DE PRODUCTOS DE LA MARCA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-stone-200 pb-4 gap-2">
          <div>
            <span className="text-[11px] tracking-wideEditorial uppercase text-stone-500">
              Colección en Vitrina
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-stone-950 font-light mt-0.5">
              Catálogo de {brand.title}
            </h2>
          </div>
          <span className="text-xs uppercase tracking-editorial text-stone-500">
            {products.length} {products.length === 1 ? "prenda disponible" : "prendas disponibles"}
          </span>
        </div>

        {products.length === 0 ? (
          <div className="py-20 text-center bg-white border border-stone-200 space-y-2">
            <p className="font-serif text-lg text-stone-700">
              No hay productos publicados para esta marca por el momento.
            </p>
            <p className="text-xs text-stone-400">
              El estudiante está cargando su colección a través de Wagtail CMS.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} showBrand={false} />
            ))}
          </div>
        )}
      </section>

      {/* SECCIÓN E: BANNER DE SALIDA (Segundo banner horizontal independiente) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative w-full h-[40vh] sm:h-[50vh] min-h-[300px] max-h-[500px] bg-stone-900 overflow-hidden">
          <Image
            src={brand.exit_banner}
            alt={`Banner de cierre ${brand.title}`}
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-4 z-10">
            <span className="text-[11px] tracking-wideEditorial uppercase text-stone-300">
              Final del Espacio de Marca
            </span>
            <h3 className="text-3xl sm:text-5xl font-serif text-white tracking-wide uppercase font-light">
              {brand.title}
            </h3>
            <div className="pt-2">
              <Link
                href="/marcas"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-white text-stone-950 text-xs tracking-editorial uppercase font-semibold hover:bg-stone-200 transition-colors"
              >
                <span>Descubrir Más Marcas</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
