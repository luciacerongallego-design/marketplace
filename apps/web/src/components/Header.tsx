"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Brand } from "@/lib/cms/types";

export function Header() {
  const pathname = usePathname();
  const { totalItems, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [marcasDropdownOpen, setMarcasDropdownOpen] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cargar marcas para el dropdown
  useEffect(() => {
    fetch("/api/brands")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setBrands(data);
        }
      })
      .catch(() => {});
  }, []);

  // Cerrar dropdown al hacer click afuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMarcasDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cerrar menús al cambiar de ruta
  useEffect(() => {
    setMobileMenuOpen(false);
    setMarcasDropdownOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 transition-all">
      {/* Top Academic Sub-bar */}
      <div className="bg-stone-950 text-stone-300 text-[10px] sm:text-[11px] tracking-tight uppercase py-1.5 px-4 sm:px-8 text-center font-bold">
        Universidad Pontificia Bolivariana · Producto Comercial
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Mobile menu trigger */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-stone-800 hover:text-stone-950 transition-colors"
            aria-label="Menú principal"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Logo / Main Title con Logo Circular PC */}
        <div className="flex items-center">
          <Link
            href="/"
            className="flex items-center space-x-3 group transition-transform"
          >
            {/* Logo circular PC (fondo negro, letras blancas, tipografia recta) */}
            <div className="w-8 h-8 rounded-full bg-stone-950 text-white flex items-center justify-center font-bold text-xs tracking-tight border border-stone-800 shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform">
              PC
            </div>

            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-xl sm:text-2xl text-stone-950 uppercase group-hover:opacity-80 transition-opacity">
                Producto Comercial
              </span>
              <span className="text-[10px] tracking-tight uppercase text-stone-500 font-semibold -mt-0.5">
                Marketplace de Diseño & Vestuario
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {/* Botón INICIO */}
          <Link
            href="/"
            className={`text-xs tracking-tight uppercase font-bold transition-colors relative py-1 ${
              pathname === "/"
                ? "text-stone-950 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-stone-950"
                : "text-stone-500 hover:text-stone-950"
            }`}
          >
            INICIO
          </Link>

          {/* Botón MARCAS con Dropdown Desplegable */}
          <div
            className="relative py-2"
            ref={dropdownRef}
            onMouseEnter={() => setMarcasDropdownOpen(true)}
            onMouseLeave={() => setMarcasDropdownOpen(false)}
          >
            <div className="flex items-center space-x-1 cursor-pointer">
              <Link
                href="/marcas"
                className={`text-xs tracking-tight uppercase font-bold transition-colors relative py-1 ${
                  isActive("/marcas")
                    ? "text-stone-950 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-stone-950"
                    : "text-stone-500 hover:text-stone-950"
                }`}
              >
                MARCAS
              </Link>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setMarcasDropdownOpen((prev) => !prev);
                }}
                className="text-stone-400 hover:text-stone-900 transition-colors p-0.5"
                aria-label="Desplegar marcas"
              >
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    marcasDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            {/* Menú Desplegable de Marcas */}
            {marcasDropdownOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 w-72 sm:w-80 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="bg-white border border-stone-200 shadow-xl py-3 px-2 space-y-1">
                  <div className="px-3 py-1.5 border-b border-stone-100 flex items-center justify-between">
                    <span className="text-[10px] tracking-tight uppercase text-stone-400 font-bold">
                      Marcas Participantes
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono font-semibold">
                      {brands.length} marcas
                    </span>
                  </div>

                  <div className="max-h-72 overflow-y-auto py-1 divide-y divide-stone-50">
                    {brands.length === 0 ? (
                      <div className="px-3 py-4 text-xs text-stone-400 text-center font-medium">
                        Cargando marcas...
                      </div>
                    ) : (
                      brands.map((brand) => (
                        <Link
                          key={brand.id}
                          href={`/marcas/${brand.slug}`}
                          onClick={() => setMarcasDropdownOpen(false)}
                          className="flex items-center space-x-3 px-3 py-2.5 hover:bg-stone-50 transition-colors group"
                        >
                          {/* Logo de la marca (SVG o PNG) */}
                          <div className="relative w-7 h-7 rounded-full overflow-hidden border border-stone-200 bg-white flex-shrink-0 flex items-center justify-center p-0.5 shadow-sm">
                            {brand.logo ? (
                              <Image
                                src={brand.logo}
                                alt={`Logo ${brand.title}`}
                                fill
                                className="object-contain p-0.5"
                                sizes="28px"
                              />
                            ) : (
                              <span className="text-[10px] font-bold text-stone-600 uppercase">
                                {brand.title.substring(0, 2)}
                              </span>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-bold text-stone-900 uppercase tracking-tight block truncate group-hover:text-stone-600">
                              {brand.title}
                            </span>
                          </div>

                          <ArrowRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-stone-900 group-hover:translate-x-0.5 transition-all opacity-0 group-hover:opacity-100" />
                        </Link>
                      ))
                    )}
                  </div>

                  <div className="pt-2 px-2 border-t border-stone-100">
                    <Link
                      href="/marcas"
                      onClick={() => setMarcasDropdownOpen(false)}
                      className="block text-center py-2 bg-stone-950 hover:bg-stone-800 text-white text-[11px] uppercase tracking-tight font-bold transition-colors"
                    >
                      Ver Directorio Completo
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Botón PRODUCTOS */}
          <Link
            href="/productos"
            className={`text-xs tracking-tight uppercase font-bold transition-colors relative py-1 ${
              isActive("/productos")
                ? "text-stone-950 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-stone-950"
                : "text-stone-500 hover:text-stone-950"
            }`}
          >
            PRODUCTOS
          </Link>
        </nav>

        {/* Action: Cart Button */}
        <div className="flex items-center space-x-4">
          <button
            onClick={openCart}
            className="relative p-2.5 text-stone-900 hover:text-stone-600 transition-colors flex items-center space-x-2 border border-stone-300 rounded hover:border-stone-900"
            aria-label="Abrir carrito demostrativo"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline text-xs tracking-tight uppercase font-bold">
              Carrito
            </span>
            {totalItems > 0 && (
              <span className="bg-stone-950 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-mono font-bold">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-6 py-6 space-y-4 shadow-xl">
          <nav className="flex flex-col space-y-3">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-sm tracking-tight uppercase font-bold py-2 transition-colors ${
                pathname === "/" ? "text-stone-950 pl-2 border-l-2 border-stone-950" : "text-stone-600 pl-2"
              }`}
            >
              INICIO
            </Link>

            <div>
              <Link
                href="/marcas"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm tracking-tight uppercase font-bold py-2 block transition-colors ${
                  isActive("/marcas") ? "text-stone-950 pl-2 border-l-2 border-stone-950" : "text-stone-600 pl-2"
                }`}
              >
                MARCAS
              </Link>
              {/* Marcas en Mobile */}
              {brands.length > 0 && (
                <div className="pl-6 pt-2 space-y-2 border-l border-stone-100 ml-2 mt-1">
                  {brands.map((b) => (
                    <Link
                      key={b.id}
                      href={`/marcas/${b.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-2.5 py-1 text-xs font-bold text-stone-600 hover:text-stone-950 uppercase tracking-tight"
                    >
                      {b.logo && (
                        <div className="relative w-5 h-5 rounded-full overflow-hidden border border-stone-200 bg-white flex-shrink-0 p-0.5">
                          <Image src={b.logo} alt={b.title} fill className="object-contain" sizes="20px" />
                        </div>
                      )}
                      <span>{b.title}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/productos"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-sm tracking-tight uppercase font-bold py-2 transition-colors ${
                isActive("/productos") ? "text-stone-950 pl-2 border-l-2 border-stone-950" : "text-stone-600 pl-2"
              }`}
            >
              PRODUCTOS
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
