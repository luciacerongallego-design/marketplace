"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function Header() {
  const pathname = usePathname();
  const { totalItems, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "INICIO" },
    { href: "/marcas", label: "MARCAS" },
    { href: "/productos", label: "PRODUCTOS" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 transition-all">
      {/* Top Academic Sub-bar */}
      <div className="bg-stone-950 text-stone-300 text-[10px] tracking-wideEditorial uppercase py-1.5 px-4 sm:px-8 text-center font-medium">
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

        {/* Logo / Main Title */}
        <div className="flex items-center">
          <Link
            href="/"
            className="flex flex-col group transition-transform"
          >
            <span className="font-sans tracking-[0.22em] text-lg sm:text-xl font-medium text-stone-950 uppercase group-hover:opacity-75 transition-opacity">
              Producto Comercial
            </span>
            <span className="text-[9px] tracking-wideEditorial uppercase text-stone-400 font-sans mt-0.5">
              Marketplace de Diseño & Vestuario
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xs tracking-editorial uppercase transition-colors relative py-1 ${
                isActive(link.href)
                  ? "text-stone-950 font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-stone-950"
                  : "text-stone-500 font-medium hover:text-stone-950"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Action: Cart Button */}
        <div className="flex items-center space-x-4">
          <button
            onClick={openCart}
            className="relative p-2.5 text-stone-900 hover:text-stone-600 transition-colors flex items-center space-x-2 border border-stone-200/80 rounded hover:border-stone-400"
            aria-label="Abrir carrito demostrativo"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline text-xs tracking-editorial uppercase font-medium">
              Carrito
            </span>
            {totalItems > 0 && (
              <span className="bg-stone-950 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-mono font-semibold">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-6 py-6 space-y-4 shadow-xl">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm tracking-editorial uppercase py-2 transition-colors ${
                  isActive(link.href)
                    ? "text-stone-950 font-bold border-l-2 border-stone-950 pl-3"
                    : "text-stone-600 font-medium hover:text-stone-950 pl-3"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
