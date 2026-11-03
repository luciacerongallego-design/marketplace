"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/cms/types";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "./DemoCartDrawer";
import {
  ShoppingBag,
  Check,
  ArrowLeft,
  ShieldCheck,
  Tag,
  ZoomIn,
  ZoomOut,
  X,
  Maximize2,
} from "lucide-react";

interface ProductDetailViewProps {
  product: Product;
  relatedProducts?: Product[];
}

export function ProductDetailView({ product, relatedProducts = [] }: ProductDetailViewProps) {
  // Combine all available photos: model_photo, floating_photo, gallery
  const allPhotos = [
    { url: product.model_photo, label: "Vista 1" },
    { url: product.floating_photo, label: "Vista 2" },
    ...(product.gallery || []).map((url, idx) => ({
      url,
      label: `Detalle ${idx + 1}`,
    })),
  ].filter((p) => Boolean(p.url));

  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart } = useCart();

  // Estados de la Lupa (Hover Zoom y Modal Pantalla Completa)
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalZoomScale, setModalZoomScale] = useState(1);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomPos({ x, y });
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  // Cerrar modal con tecla Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        setIsModalOpen(false);
        setModalZoomScale(1);
      }
    },
    [isModalOpen]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const activePhoto = allPhotos[selectedPhotoIndex] || allPhotos[0];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Botón Volver al Catálogo */}
      <div>
        <Link
          href="/productos"
          className="inline-flex items-center space-x-2 text-xs uppercase tracking-tight font-bold text-stone-500 hover:text-stone-950 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al Catálogo</span>
        </Link>
      </div>

      {/* Main Product Layout: Imagen optimizada en altura para entrar sin scroll */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* COLUMNA IZQUIERDA: Imagen con Lupa y Miniaturas */}
        <div className="lg:col-span-7 flex flex-col items-center space-y-3">
          {/* Contenedor de la Imagen con Lupa interactiva */}
          <div
            className="relative w-full max-w-[480px] aspect-[3/4] max-h-[calc(100vh-210px)] min-h-[350px] bg-stone-50 overflow-hidden border border-stone-200 shadow-sm mx-auto group select-none cursor-crosshair"
            onMouseEnter={() => setIsZooming(true)}
            onMouseLeave={() => setIsZooming(false)}
            onMouseMove={handleMouseMove}
          >
            {/* Imagen Principal con Zoom en posición del cursor */}
            <div className="relative w-full h-full">
              <Image
                src={activePhoto.url}
                alt={product.title}
                fill
                priority
                className="object-contain object-center transition-transform duration-150 ease-out will-change-transform"
                style={{
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  transform: isZooming ? "scale(2.3)" : "scale(1)",
                }}
                sizes="(max-width: 1024px) 100vw, 480px"
              />
            </div>

            {/* Botón flotante de Lupa / Pantalla Completa */}
            <button
              onClick={() => {
                setIsModalOpen(true);
                setModalZoomScale(1.5);
              }}
              type="button"
              className="absolute top-3.5 right-3.5 z-20 flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/95 hover:bg-white text-stone-950 shadow-md backdrop-blur-sm transition-all hover:scale-105 active:scale-95 border border-stone-200/80 text-[11px] font-bold tracking-tight uppercase"
              title="Abrir lupa ampliada"
              aria-label="Abrir lupa de detalle"
            >
              <ZoomIn className="w-3.5 h-3.5" />
              <span>Lupa</span>
            </button>

            {/* Indicador sutil de uso de lupa */}
            <div
              className={`absolute bottom-3 inset-x-0 flex justify-center pointer-events-none transition-opacity duration-300 ${
                isZooming ? "opacity-0" : "opacity-80 group-hover:opacity-100"
              }`}
            >
              <span className="bg-stone-900/85 backdrop-blur-sm text-[10px] tracking-tight uppercase text-white px-3 py-1 rounded-full shadow-sm font-medium">
                Pasa el mouse para ampliar detalles
              </span>
            </div>
          </div>

          {/* Miniaturas de Galería */}
          {allPhotos.length > 1 && (
            <div className="flex items-center justify-center space-x-2.5 overflow-x-auto py-1 max-w-full">
              {allPhotos.map((photo, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPhotoIndex(idx)}
                  className={`relative w-14 h-18 sm:w-16 sm:h-20 flex-shrink-0 bg-stone-50 border-2 overflow-hidden transition-all ${
                    idx === selectedPhotoIndex
                      ? "border-stone-950 opacity-100 scale-105 shadow-sm"
                      : "border-stone-200 opacity-60 hover:opacity-100"
                  }`}
                  aria-label={`Ver foto ${idx + 1}`}
                >
                  <Image
                    src={photo.url}
                    alt={`Miniatura ${idx + 1}`}
                    fill
                    className="object-contain"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* COLUMNA DERECHA: Información y Compra */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24 bg-white p-6 sm:p-8 border border-stone-200 shadow-sm">
          {/* Marca y Categoría */}
          <div className="space-y-2 border-b border-stone-100 pb-4">
            <div className="flex items-center justify-between">
              <Link
                href={`/marcas/${product.brand.slug}`}
                className="text-xs uppercase tracking-tight font-bold text-stone-600 hover:text-stone-950 transition-colors"
              >
                Marca: {product.brand.title} →
              </Link>
              <span className="inline-flex items-center space-x-1 text-[11px] text-stone-400 uppercase tracking-tight font-bold">
                <Tag className="w-3 h-3" />
                <span>{product.category.name}</span>
              </span>
            </div>

            {/* Título de la prenda */}
            <h1 className="text-2xl sm:text-4xl text-stone-950 font-black leading-tight pt-1 tracking-tight uppercase">
              {product.title}
            </h1>

            {/* Precio */}
            <div className="pt-2">
              <span className="text-2xl font-bold font-mono text-stone-950">
                {formatPrice(product.price)}
              </span>
              <span className="text-xs text-stone-400 ml-2 font-mono">COP</span>
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-3">
            <h2 className="text-xs uppercase tracking-tight font-bold text-stone-900">
              Descripción
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed font-sans">
              {product.description}
            </p>
          </div>

          {/* Cantidad y Botón de Carrito */}
          <div className="space-y-4 pt-3 border-t border-stone-100">
            <div className="flex items-center space-x-4">
              <span className="text-xs uppercase tracking-tight text-stone-600 font-bold">
                Cantidad:
              </span>
              <div className="flex items-center border border-stone-300">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1 hover:bg-stone-100 text-stone-700 text-sm font-bold"
                  aria-label="Menos cantidad"
                >
                  -
                </button>
                <span className="px-4 text-xs font-bold text-stone-900 font-mono">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-1 hover:bg-stone-100 text-stone-700 text-sm font-bold"
                  aria-label="Más cantidad"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className={`w-full py-4 text-xs tracking-tight uppercase font-bold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg ${
                isAdded
                  ? "bg-emerald-600 text-white"
                  : "bg-stone-950 text-white hover:bg-stone-800"
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Agregado al Carrito</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Agregar al Carrito</span>
                </>
              )}
            </button>
          </div>

          {/* Ficha Institucional */}
          <div className="bg-stone-50 p-4 border border-stone-200/60 space-y-2">
            <div className="flex items-center space-x-2 text-stone-700 text-xs font-bold uppercase tracking-tight">
              <ShieldCheck className="w-4 h-4 text-stone-500" />
              <span>Proyecto Académico UPB</span>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed font-sans">
              Esta prenda forma parte del ejercicio proyectual de la asignatura Producto Comercial. Conoce más sobre esta colección en el{" "}
              <Link
                href={`/marcas/${product.brand.slug}`}
                className="text-stone-900 underline font-bold"
              >
                apartado de {product.brand.title}
              </Link>
              .
            </p>
          </div>
        </div>
      </div>

      {/* MODAL DE LUPA / PANTALLA COMPLETA */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          {/* Barra Superior del Modal */}
          <div className="flex items-center justify-between z-10 text-white">
            <div className="space-y-0.5">
              <span className="text-[10px] text-stone-400 uppercase tracking-tight font-bold">
                {product.brand.title}
              </span>
              <h3 className="text-sm sm:text-base font-bold uppercase tracking-tight">
                {product.title} - Lupa de Alta Definición
              </h3>
            </div>

            {/* Controles de Zoom y Cerrar */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setModalZoomScale((s) => Math.max(1, s - 0.5))}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Alejar"
                aria-label="Alejar"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <span className="text-xs font-mono px-1">{Math.round(modalZoomScale * 100)}%</span>
              <button
                onClick={() => setModalZoomScale((s) => Math.min(3.5, s + 0.5))}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Acercar"
                aria-label="Acercar"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setModalZoomScale(1);
                }}
                className="p-2 ml-4 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                title="Cerrar (Esc)"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Área Central de Visualización Ampliada */}
          <div className="relative flex-1 w-full max-h-[82vh] overflow-auto flex items-center justify-center p-4">
            <div
              className="relative w-full h-full max-w-4xl transition-transform duration-200 ease-out"
              style={{ transform: `scale(${modalZoomScale})` }}
            >
              <Image
                src={activePhoto.url}
                alt={product.title}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
          </div>

          {/* Miniaturas en el Modal */}
          {allPhotos.length > 1 && (
            <div className="flex items-center justify-center space-x-3 pt-2 z-10">
              {allPhotos.map((photo, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPhotoIndex(idx)}
                  className={`relative w-12 h-16 rounded overflow-hidden border-2 transition-all ${
                    idx === selectedPhotoIndex
                      ? "border-white scale-105"
                      : "border-white/30 opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image src={photo.url} alt={`Foto ${idx + 1}`} fill className="object-contain" sizes="48px" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PRENDAS RELACIONADAS DE LA MISMA MARCA */}
      {relatedProducts.length > 0 && (
        <section className="pt-12 border-t border-stone-200 space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-[11px] tracking-tight uppercase text-stone-500 font-bold">
                Misma Marca
              </span>
              <h2 className="text-xl sm:text-2xl text-stone-950 font-black mt-0.5 tracking-tight uppercase">
                Otras prendas de {product.brand.title}
              </h2>
            </div>
            <Link
              href={`/marcas/${product.brand.slug}`}
              className="text-xs uppercase tracking-tight text-stone-700 hover:text-stone-950 font-bold"
            >
              Ver Colección Completa →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.slice(0, 4).map((rel) => (
              <div key={rel.id} className="group bg-white border border-stone-200">
                <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden">
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
                <div className="p-3">
                  <Link
                    href={`/productos/${rel.slug}`}
                    className="text-xs font-bold text-stone-900 hover:underline block line-clamp-1 uppercase tracking-tight"
                  >
                    {rel.title}
                  </Link>
                  <p className="text-xs font-mono font-bold text-stone-600 mt-1">
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
