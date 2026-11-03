"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/cms/types";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "./DemoCartDrawer";
import { ShoppingBag, Check, ArrowLeft, ShieldCheck, Tag } from "lucide-react";

interface ProductDetailViewProps {
  product: Product;
  relatedProducts?: Product[];
}

export function ProductDetailView({ product, relatedProducts = [] }: ProductDetailViewProps) {
  // Combine all available photos: model_photo, floating_photo, gallery
  const allPhotos = [
    { url: product.model_photo, label: "Sobre Modelo" },
    { url: product.floating_photo, label: "Prenda Flotante" },
    ...(product.gallery || []).map((url, idx) => ({
      url,
      label: `Detalle ${idx + 1}`,
    })),
  ].filter((p) => Boolean(p.url));

  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const activePhoto = allPhotos[selectedPhotoIndex] || allPhotos[0];

  return (
    <div className="space-y-16">
      {/* Back button */}
      <div>
        <Link
          href="/productos"
          className="inline-flex items-center space-x-2 text-xs uppercase tracking-editorial text-stone-500 hover:text-stone-950 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Catálogo</span>
        </Link>
      </div>

      {/* Main Product Layout: Left Image Gallery, Right Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* LEFT COLUMN: Large Main Image + Gallery Thumbnails */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-[3/4] w-full bg-stone-100 overflow-hidden border border-stone-200">
            <Image
              src={activePhoto.url}
              alt={`${product.title} - ${activePhoto.label}`}
              fill
              priority
              className="object-cover object-center transition-all duration-300"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />

            {/* Current photo badge */}
            <div className="absolute top-4 left-4">
              <span className="bg-white/90 backdrop-blur-sm text-[11px] tracking-wideEditorial uppercase font-semibold text-stone-900 px-3 py-1 shadow-sm">
                {activePhoto.label}
              </span>
            </div>
          </div>

          {/* Gallery Thumbnails */}
          {allPhotos.length > 1 && (
            <div className="flex items-center space-x-3 overflow-x-auto pb-2">
              {allPhotos.map((photo, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPhotoIndex(idx)}
                  className={`relative w-20 h-24 flex-shrink-0 bg-stone-100 border-2 overflow-hidden transition-all ${
                    idx === selectedPhotoIndex
                      ? "border-stone-950 opacity-100 scale-105"
                      : "border-transparent opacity-60 hover:opacity-90"
                  }`}
                  aria-label={`Ver foto ${photo.label}`}
                >
                  <Image
                    src={photo.url}
                    alt={photo.label}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Product Details */}
        <div className="lg:col-span-5 space-y-8 sticky top-28 bg-white p-6 sm:p-8 border border-stone-200/90 shadow-sm">
          {/* Brand & Category */}
          <div className="space-y-2 border-b border-stone-100 pb-4">
            <div className="flex items-center justify-between">
              <Link
                href={`/marcas/${product.brand.slug}`}
                className="text-xs uppercase tracking-wideEditorial font-semibold text-stone-600 hover:text-stone-950 transition-colors"
              >
                Marca: {product.brand.title} →
              </Link>
              <span className="inline-flex items-center space-x-1 text-[11px] text-stone-400 uppercase tracking-wider">
                <Tag className="w-3 h-3" />
                <span>{product.category.name}</span>
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl text-stone-950 font-light leading-tight pt-1 tracking-tight">
              {product.title}
            </h1>

            {/* Price */}
            <div className="pt-2">
              <span className="text-2xl font-bold font-mono text-stone-950">
                {formatPrice(product.price)}
              </span>
              <span className="text-xs text-stone-400 ml-2 font-mono">COP</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h2 className="text-xs uppercase tracking-wideEditorial font-semibold text-stone-900">
              Descripción & Moldería
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed font-sans">
              {product.description}
            </p>
          </div>

          {/* Quantity and Add to Cart Button */}
          <div className="space-y-4 pt-4 border-t border-stone-100">
            <div className="flex items-center space-x-4">
              <span className="text-xs uppercase tracking-wider text-stone-600 font-medium">
                Cantidad:
              </span>
              <div className="flex items-center border border-stone-200 rounded">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1 hover:bg-stone-100 text-stone-700 text-sm"
                  aria-label="Menos cantidad"
                >
                  -
                </button>
                <span className="px-4 text-xs font-semibold text-stone-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-1 hover:bg-stone-100 text-stone-700 text-sm"
                  aria-label="Más cantidad"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className={`w-full py-4 text-xs tracking-editorial uppercase font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg ${
                isAdded
                  ? "bg-emerald-600 text-white"
                  : "bg-stone-950 text-white hover:bg-stone-800"
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Agregado al Carrito Demostrativo</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Agregar al Carrito</span>
                </>
              )}
            </button>
          </div>

          {/* Brand Card & Technical info note */}
          <div className="bg-stone-50 p-4 border border-stone-200/60 space-y-2">
            <div className="flex items-center space-x-2 text-stone-700 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-stone-500" />
              <span>Proyecto Académico UPB</span>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
              Esta prenda forma parte del ejercicio proyectual de la asignatura Producto Comercial. Conoce más sobre esta colección en el{" "}
              <Link
                href={`/marcas/${product.brand.slug}`}
                className="text-stone-900 underline font-medium"
              >
                apartado de {product.brand.title}
              </Link>
              .
            </p>
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS FROM SAME BRAND */}
      {relatedProducts.length > 0 && (
        <section className="pt-16 border-t border-stone-200 space-y-8">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-[11px] tracking-wideEditorial uppercase text-stone-500">
                Misma Marca
              </span>
              <h2 className="text-2xl text-stone-950 font-light mt-0.5 tracking-tight">
                Otras prendas de {product.brand.title}
              </h2>
            </div>
            <Link
              href={`/marcas/${product.brand.slug}`}
              className="text-xs uppercase tracking-editorial text-stone-700 hover:text-stone-950 font-semibold"
            >
              Ver Colección Completa →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.slice(0, 4).map((rel) => (
              <div key={rel.id} className="group">
                <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden border border-stone-200">
                  <Link href={`/productos/${rel.slug}`}>
                    <Image
                      src={rel.model_photo}
                      alt={rel.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="25vw"
                    />
                  </Link>
                </div>
                <div className="pt-3">
                  <Link
                    href={`/productos/${rel.slug}`}
                    className="text-xs font-medium text-stone-900 hover:underline block line-clamp-1"
                  >
                    {rel.title}
                  </Link>
                  <p className="text-xs font-mono text-stone-600 mt-1">
                    {formatPrice(rel.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
