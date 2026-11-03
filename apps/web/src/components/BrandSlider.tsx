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

  // Filter brands that have a promo banner or entry banner
  const slides = brands.filter((b) => b.promo_banner || b.entry_banner);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  // Autoplay timer
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide, slides.length]);

  if (slides.length === 0) return null;

  const currentBrand = slides[currentIndex];
  const bannerImg = currentBrand.promo_banner || currentBrand.entry_banner;

  return (
    <section
      className="relative w-full h-[65vh] sm:h-[75vh] min-h-[460px] max-h-[780px] bg-stone-900 overflow-hidden group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Carrusel de marcas participantes"
    >
      {/* Background Banner with Crossfade Transition */}
      {slides.map((brand, idx) => {
        const img = brand.promo_banner || brand.entry_banner;
        return (
          <div
            key={brand.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <Image
              src={img}
              alt={`Banner promocional ${brand.title}`}
              fill
              priority={idx === 0}
              className="object-cover object-center scale-[1.02] transform transition-transform duration-7000 ease-out group-hover:scale-100"
              sizes="100vw"
            />
            {/* Elegant editorial gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20" />
          </div>
        );
      })}

      {/* Slide Content Overlay */}
      <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16 sm:pb-20">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded text-[11px] uppercase tracking-wideEditorial text-stone-200">
            <span>Marca Participante</span>
            <span>·</span>
            <span>UPB {new Date().getFullYear()}</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-serif text-white tracking-tight uppercase font-light leading-none">
            {currentBrand.title}
          </h2>

          <p className="text-sm sm:text-base text-stone-300 font-sans line-clamp-2 leading-relaxed max-w-xl">
            {currentBrand.description}
          </p>

          <div className="pt-2">
            <Link
              href={`/marcas/${currentBrand.slug}`}
              className="inline-flex items-center space-x-3 px-6 py-3.5 bg-white text-stone-950 text-xs tracking-editorial uppercase font-semibold hover:bg-stone-200 transition-colors shadow-lg"
            >
              <span>Ver Espacio de Marca</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-sm flex items-center justify-center transition-all opacity-80 hover:opacity-100"
            aria-label="Banner anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-sm flex items-center justify-center transition-all opacity-80 hover:opacity-100"
            aria-label="Banner siguiente"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Slide Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 right-6 z-20 flex items-center space-x-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 transition-all duration-300 rounded-full ${
                idx === currentIndex
                  ? "w-8 bg-white"
                  : "w-2 bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Ir al banner ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
