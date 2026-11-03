"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { Brand } from "@/lib/cms/types";

interface BrandSliderProps {
  brands: Brand[];
}

export function BrandSlider({ brands }: BrandSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Filtrar marcas con banner promocional o de entrada
  const slides = brands.filter((b) => b.promo_banner || b.entry_banner);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  // Autoplay continuo cada 4.5 segundos (se pausa al pasar el mouse)
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide, slides.length]);

  if (slides.length === 0) return null;

  const currentBrand = slides[currentIndex];

  return (
    <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
      {/* Marco de Banner 1280x400px identico al de los espacios de marca */}
      <div
        className="relative w-full aspect-[1280/400] min-h-[220px] max-h-[400px] bg-stone-100 overflow-hidden border border-stone-200 shadow-sm group select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        aria-label="Carrusel de marcas participantes"
      >
        {/* Banners con transicion suave */}
        {slides.map((brand, idx) => {
          const img = brand.promo_banner || brand.entry_banner;
          const isCurrent = idx === currentIndex;
          return (
            <div
              key={brand.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isCurrent ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <Image
                src={img}
                alt={`Banner ${brand.title}`}
                fill
                priority={idx === 0}
                className="object-cover object-center transition-all duration-500 ease-out group-hover:scale-105 group-hover:blur-[3px] group-hover:brightness-90"
                sizes="(max-width: 1280px) 100vw, 1280px"
              />
            </div>
          );
        })}

        {/* Capa de Hover: Fondo blurreado con Nombre, Descripcion y Boton Ver Mas */}
        <div className="absolute inset-0 z-20 bg-black/45 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-xl space-y-3 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
            {/* Titulo de la marca en mayuscula recta */}
            <h2 className="text-3xl sm:text-5xl font-light text-white tracking-widest uppercase leading-tight">
              {currentBrand.title}
            </h2>

            {/* Descripcion de la marca */}
            <p className="text-xs sm:text-sm text-stone-200 line-clamp-2 leading-relaxed font-sans max-w-lg mx-auto">
              {currentBrand.description}
            </p>

            {/* Boton para ver mas */}
            <div className="pt-2">
              <Link
                href={`/marcas/${currentBrand.slug}`}
                className="inline-flex items-center space-x-2.5 px-6 py-2.5 bg-white text-stone-950 text-xs tracking-editorial uppercase font-medium hover:bg-stone-200 transition-colors shadow-md"
              >
                <span>Ver Espacio de Marca</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Flechas de navegacion (visibles en hover o tactil) */}
        {slides.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-sm flex items-center justify-center transition-all opacity-0 group-hover:opacity-90 hover:!opacity-100"
              aria-label="Banner anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-sm flex items-center justify-center transition-all opacity-0 group-hover:opacity-90 hover:!opacity-100"
              aria-label="Banner siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Indicadores inferiores */}
        {slides.length > 1 && (
          <div className="absolute bottom-3 right-4 z-30 flex items-center space-x-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`h-1 transition-all duration-300 rounded-full ${
                  idx === currentIndex
                    ? "w-6 bg-white"
                    : "w-2 bg-white/50 hover:bg-white/80"
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
