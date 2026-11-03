"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(price);
}

export function DemoCartDrawer() {
  const {
    items,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-stone-200">
          {/* Header */}
          <div className="p-6 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ShoppingBag className="w-5 h-5 text-stone-900" />
              <h2 className="text-base font-semibold tracking-editorial uppercase text-stone-900">
                Carrito Demostrativo
              </h2>
              <span className="text-xs bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full font-medium">
                {totalItems}
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-2 text-stone-400 hover:text-stone-900 transition-colors"
              aria-label="Cerrar carrito"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Academic notice banner */}
          <div className="bg-stone-50 px-6 py-2.5 border-b border-stone-200/60 text-xs text-stone-600 flex items-center justify-between">
            <span>Simulador académico UPB · Sin cobro real</span>
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-stone-500 hover:text-red-600 underline transition-colors"
              >
                Vaciar
              </button>
            )}
          </div>

          {/* Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <p className="text-base font-medium text-stone-800">
                    Tu carrito está vacío
                  </p>
                  <p className="text-sm text-stone-500 max-w-xs">
                    Explora los productos de las marcas de Producto Comercial y agrégalos a tu selección.
                  </p>
                </div>
                <button
                  onClick={closeCart}
                  className="mt-4 px-6 py-2.5 bg-stone-900 text-white text-xs tracking-editorial uppercase font-medium hover:bg-stone-800 transition-colors"
                >
                  Explorar Catálogo
                </button>
              </div>
            ) : (
              items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex space-x-4 pb-6 border-b border-stone-100 last:border-b-0"
                >
                  <div className="relative w-20 h-28 flex-shrink-0 bg-stone-100 overflow-hidden">
                    <Image
                      src={product.floating_photo || product.model_photo}
                      alt={product.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs tracking-wider uppercase text-stone-500">
                            {product.brand.title}
                          </p>
                          <Link
                            href={`/productos/${product.slug}`}
                            onClick={closeCart}
                            className="text-sm font-medium text-stone-900 hover:underline line-clamp-1"
                          >
                            {product.title}
                          </Link>
                        </div>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="text-stone-400 hover:text-red-500 transition-colors p-1"
                          aria-label="Eliminar prenda"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm font-semibold text-stone-900 mt-1">
                        {formatPrice(product.price)}
                      </p>
                    </div>

                    <div className="flex items-center space-x-3 mt-3">
                      <div className="flex items-center border border-stone-200 rounded">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="p-1 hover:bg-stone-100 text-stone-600 transition-colors"
                          aria-label="Disminuir cantidad"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-medium text-stone-800">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="p-1 hover:bg-stone-100 text-stone-600 transition-colors"
                          aria-label="Aumentar cantidad"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-xs text-stone-400">
                        Subtotal: {formatPrice(product.price * quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal */}
          {items.length > 0 && (
            <div className="p-6 border-t border-stone-200 bg-stone-50 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-stone-600 tracking-wider uppercase text-xs">
                  Subtotal Estimado
                </span>
                <span className="text-lg font-bold text-stone-950 font-mono">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed">
                Esta plataforma es de carácter expositivo y académico. Para solicitar prendas o información comercial, contacta a la marca directamente a través de su canal de Instagram o consulta sus fichas técnicas.
              </p>
              <div className="pt-2">
                <button
                  onClick={closeCart}
                  className="w-full py-3.5 bg-stone-950 text-white text-xs tracking-editorial uppercase font-medium hover:bg-stone-800 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Continuar Explorando</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
