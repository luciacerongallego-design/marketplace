"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { Brand } from "@/lib/cms/types";
import { BannerMedia } from "./BannerMedia";

interface BrandSliderProps {
  brands: Brand[];
}

export function BrandSlider({ brands }: BrandSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Filtrar marcas con banner promocional o de entrada
  const slides = brands.filter((b) => b.promo_banner || b.entry_banner);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  // Autoplay continuo cada 3 segundos exactos (se pausa al pasar el mouse)
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 3000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide, slides.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null || slides.length <= 1) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    setTouchStartX(null);
    setIsPaused(false);
  };

  if (slides.length === 0) return null;

  return (
    <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
      {/* Marco de Banner 1280x400px identico al de los espacios de marca */}
      <div
        className="relative w-full aspect-[1280/400] min-h-[220px] max-h-[400px] bg-stone-100 overflow-hidden border border-stone-200 shadow-sm group select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        aria-label="Carrusel de marcas participantes"
      >
        {/* Track horizontal continuo con deslizamiento suave y estético */}
        <div
          className="flex h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((brand, idx) => {
            const img = brand.promo_banner || brand.entry_banner;
            return (
              <div
                key={brand.id}
                className="relative w-full h-full flex-shrink-0 overflow-hidden bg-stone-900"
              >
                <BannerMedia
                  url={img}
                  alt={`Banner ${brand.title}`}
                  isPdf={brand.is_promo_banner_pdf || brand.is_entry_banner_pdf}
                  priority={idx === 0}
                  className="object-cover object-center w-full h-full transition-all duration-700 ease-out group-hover:scale-105 group-hover:blur-[3px] group-hover:brightness-90"
                  sizes="(max-width: 1280px) 100vw, 1280px"
                />

                {/* Capa de Hover: Fondo blurreado con Nombre, Descripcion y Boton Ver Mas */}
                <div className="absolute inset-0 z-20 bg-black/55 backdrop-blur-[4px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center p-6 text-center">
                  <div className="max-w-xl space-y-3 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                    {/* Titulo de la marca en mayusculas, negrita y letras compactas */}
                    <h2 className="text-3xl sm:text-6xl font-black text-white tracking-tight uppercase leading-none">
                      {brand.title}
                    </h2>

                    {/* Descripcion de la marca */}
                    <p className="text-xs sm:text-sm text-stone-200 line-clamp-2 leading-relaxed font-sans max-w-lg mx-auto font-medium">
                      {brand.description}
                    </p>

                    {/* Boton para ver mas */}
                    <div className="pt-2">
                      <Link
                        href={`/marcas/${brand.slug}`}
                        className="inline-flex items-center space-x-2.5 px-6 py-2.5 bg-white text-stone-950 text-xs tracking-tight uppercase font-bold hover:bg-stone-200 transition-colors shadow-lg"
                      >
                        <span>Ver Espacio de Marca</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Flechas de navegacion limpias y esteticas */}
        {slides.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/40 hover:bg-black/75 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95 shadow-lg border border-white/10"
              aria-label="Banner anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/40 hover:bg-black/75 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95 shadow-lg border border-white/10"
              aria-label="Banner siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Indicadores inferiores tipo barra/píldora estéticos */}
        {slides.length > 1 && (
          <div className="absolute bottom-3.5 right-4 z-30 flex items-center space-x-1.5 bg-black/30 backdrop-blur-sm px-2.5 py-1.5 rounded-full border border-white/10">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`h-1.5 transition-all duration-500 rounded-full ${
                  idx === currentIndex
                    ? "w-7 bg-white shadow-sm"
                    : "w-2 bg-white/40 hover:bg-white/75"
                }`}
                aria-label={`Ir al banner ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
