"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Plus, Check } from "lucide-react";
import { Product } from "@/lib/cms/types";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "./DemoCartDrawer";

interface ProductCardProps {
  product: Product;
  showBrand?: boolean;
}

export function ProductCard({ product, showBrand = true }: ProductCardProps) {
  // 0: Model photo (prenda puesta), 1: Floating photo (prenda flotante)
  const [photoIndex, setPhotoIndex] = useState(0);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const { addToCart } = useCart();

  const photos = [
    { url: product.model_photo, label: "Sobre modelo" },
    { url: product.floating_photo, label: "Prenda flotante" },
  ];

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPhotoIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPhotoIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  return (
    <div className="group flex flex-col bg-white border border-stone-200/80 hover:border-stone-400 transition-all duration-300">
      {/* Photo Viewport Container */}
      <div className="relative aspect-[3/4] w-full bg-stone-100 overflow-hidden">
        <Link href={`/productos/${product.slug}`} className="block w-full h-full">
          <Image
            src={photos[photoIndex].url}
            alt={`${product.title} - ${photos[photoIndex].label}`}
            fill
            className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </Link>

        {/* View Indicator Tag (Modelo / Flotante) */}
        <div className="absolute top-3 left-3 pointer-events-none">
          <span className="bg-white/90 backdrop-blur-sm text-[10px] tracking-wideEditorial uppercase font-semibold text-stone-800 px-2.5 py-1 rounded shadow-sm">
            {photoIndex === 0 ? "Look" : "Prenda"}
          </span>
        </div>

        {/* Carousel Arrows (Switch between model and floating photo) */}
        <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handlePrev}
            className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-stone-900 shadow-md flex items-center justify-center transition-transform hover:scale-110"
            aria-label="Ver fotografía anterior de la prenda"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-stone-900 shadow-md flex items-center justify-center transition-transform hover:scale-110"
            aria-label="Ver fotografía siguiente de la prenda"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom Dot indicators */}
        <div className="absolute bottom-3 inset-x-0 flex justify-center space-x-1.5 pointer-events-none">
          <div
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              photoIndex === 0 ? "bg-stone-900 w-4" : "bg-stone-400"
            }`}
          />
          <div
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              photoIndex === 1 ? "bg-stone-900 w-4" : "bg-stone-400"
            }`}
          />
        </div>

        {/* Quick Add To Cart Floating Button */}
        <button
          onClick={handleQuickAdd}
          className={`absolute bottom-3 right-3 p-2 rounded-full shadow-lg transition-all duration-300 ${
            addedAnimation
              ? "bg-emerald-600 text-white scale-110"
              : "bg-stone-950 text-white hover:bg-stone-800 opacity-90 group-hover:opacity-100"
          }`}
          title="Agregar al carrito"
          aria-label="Agregar al carrito"
        >
          {addedAnimation ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </button>
      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          {showBrand && (
            <Link
              href={`/marcas/${product.brand.slug}`}
              className="text-[11px] tracking-wideEditorial uppercase text-stone-500 hover:text-stone-900 font-medium transition-colors block mb-1"
            >
              {product.brand.title}
            </Link>
          )}

          <Link href={`/productos/${product.slug}`}>
            <h3 className="text-sm font-medium text-stone-900 hover:text-stone-600 transition-colors line-clamp-1">
              {product.title}
            </h3>
          </Link>
        </div>

        <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between">
          <span className="text-xs font-semibold text-stone-950 font-mono">
            {formatPrice(product.price)}
          </span>
          <span className="text-[10px] text-stone-400 uppercase tracking-wider">
            {product.category.name}
          </span>
        </div>
      </div>
    </div>
  );
}
