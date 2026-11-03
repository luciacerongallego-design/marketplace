import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Instagram, FileText, ArrowLeft, ExternalLink } from "lucide-react";
import { getBrands, getBrandBySlug, getProducts } from "@/lib/cms/client";
import { ProductCard } from "@/components/ProductCard";
import { BannerMedia } from "@/components/BannerMedia";

export const revalidate = 3600;
export const dynamicParams = true;

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
    <div className="space-y-16 pb-24">
      {/* SECCIÓN A & B: BANNER DE ENTRADA (1280x400px, solo imagen) + RECUADRO DE IDENTIDAD CONECTADO */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        {/* Banner de Entrada 1280x400px (Imagen o PDF) */}
        <section className="relative w-full aspect-[1280/400] min-h-[220px] max-h-[400px] bg-stone-100 overflow-hidden border border-stone-200">
          <BannerMedia
            url={brand.entry_banner}
            alt={`Banner principal ${brand.title}`}
            isPdf={brand.is_entry_banner_pdf}
            priority
            className="object-cover object-center"
            sizes="(max-width: 1280px) 100vw, 1280px"
          />

          {/* Enlace discreto para regresar */}
          <div className="absolute top-4 left-4 z-10">
            <Link
              href="/marcas"
              className="inline-flex items-center space-x-2 px-3 py-1.5 bg-white/95 hover:bg-white text-stone-950 text-[11px] tracking-tight uppercase transition-all shadow-sm border border-stone-300 font-bold backdrop-blur-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver a Marcas</span>
            </Link>
          </div>
        </section>

        {/* SECCIÓN B & C: IDENTIDAD DE MARCA Y BOTONES (Directamente debajo del banner, sin separación) */}
        <section className="bg-white border border-stone-200 border-t-0 p-6 sm:p-10 lg:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Identity Info */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center space-x-4">
                {brand.logo && (
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border border-stone-300 bg-white flex-shrink-0 p-1.5 flex items-center justify-center shadow-sm">
                    <Image
                      src={brand.logo}
                      alt={`Logo ${brand.title}`}
                      fill
                      className="object-contain p-1"
                      sizes="64px"
                    />
                  </div>
                )}
                <div>
                  <h1 className="text-3xl sm:text-5xl font-black text-stone-950 uppercase tracking-tight">
                    {brand.title}
                  </h1>
                  <p className="text-xs text-stone-500 uppercase tracking-tight font-bold mt-1">
                    Colección Producto Comercial
                  </p>
                </div>
              </div>

              <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-sans max-w-3xl pt-2 font-normal">
                {brand.description}
              </p>
            </div>

            {/* SECCIÓN C: BOTONES DE ACCESO EXTERNO (Revista, Instagram, Fichas Técnicas) */}
            <div className="lg:col-span-4 flex flex-col space-y-3 pt-2 lg:border-l lg:border-stone-200 lg:pl-8">
              <span className="text-[11px] tracking-tight uppercase text-stone-400 font-bold mb-1">
                Recursos Editoriales & Técnicos
              </span>

              {/* Botón 1: REVISTA */}
              {hasRevista && (
                <a
                  href={brand.revista_url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between px-5 py-3.5 bg-stone-950 text-white text-xs tracking-tight uppercase font-bold hover:bg-stone-800 transition-colors shadow-sm"
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
                  className="inline-flex items-center justify-between px-5 py-3.5 bg-white border border-stone-300 text-stone-900 text-xs tracking-tight uppercase font-bold hover:border-stone-900 hover:bg-stone-50 transition-colors"
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
                  className="inline-flex items-center justify-between px-5 py-3.5 bg-stone-100 text-stone-900 text-xs tracking-tight uppercase font-bold hover:bg-stone-200 transition-colors"
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
        </section>
      </div>

      {/* SECCIÓN D: CATÁLOGO DE PRODUCTOS DE LA MARCA */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-stone-200 pb-4 gap-2">
          <div>
            <span className="text-[11px] tracking-tight uppercase text-stone-500 font-bold">
              Colección en Vitrina
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-stone-950 uppercase tracking-tight mt-1">
              Catálogo de {brand.title}
            </h2>
          </div>
          <span className="text-xs uppercase tracking-tight text-stone-500 font-bold">
            {products.length} {products.length === 1 ? "prenda disponible" : "prendas disponibles"}
          </span>
        </div>

        {products.length === 0 ? (
          <div className="py-20 text-center bg-white border border-stone-200 space-y-2">
            <p className="text-base text-stone-700 uppercase tracking-tight font-bold">
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

      {/* SECCIÓN E: BANNER DE SALIDA (1280x250px, solo imagen) + ACCESO A MÁS MARCAS */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Banner inferior 1280x250px (Imagen o PDF) */}
        <div className="relative w-full aspect-[1280/250] min-h-[160px] max-h-[250px] bg-stone-100 overflow-hidden border border-stone-200 shadow-sm">
          <BannerMedia
            url={brand.exit_banner}
            alt={`Banner de cierre ${brand.title}`}
            isPdf={brand.is_exit_banner_pdf}
            className="object-cover object-center"
            sizes="(max-width: 1280px) 100vw, 1280px"
          />
        </div>

        {/* Abajo del banner: Botón Descubrir más marcas (sin texto de espacio final) */}
        <div className="flex justify-center pt-2">
          <Link
            href="/marcas"
            className="inline-flex items-center space-x-2 px-8 py-3.5 bg-stone-950 text-white text-xs tracking-tight uppercase font-bold hover:bg-stone-800 transition-colors shadow-sm"
          >
            <span>Descubrir más marcas</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
