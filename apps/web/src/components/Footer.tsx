import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-stone-950 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-stone-800">
          {/* Col 1: Identity */}
          <div className="md:col-span-2 space-y-4">
            <span className="font-bold tracking-tight text-xl sm:text-2xl text-white uppercase block">
              Producto Comercial
            </span>
            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed max-w-md font-sans font-normal">
              Plataforma virtual que reúne las marcas independientes de diseño y vestuario desarrolladas por estudiantes de la Universidad Pontificia Bolivariana. Un espacio de exhibición académica y convergencia profesional.
            </p>
            <div className="pt-2 text-[11px] tracking-tight uppercase text-stone-400 font-bold">
              Facultad de Diseño de Vestuario · Medellín, Colombia
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3">
            <p className="text-xs tracking-tight uppercase text-white font-bold">
              Explorar
            </p>
            <ul className="space-y-2 text-xs tracking-tight uppercase text-stone-400 font-semibold">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/marcas" className="hover:text-white transition-colors">
                  Directorio de Marcas
                </Link>
              </li>
              <li>
                <Link href="/productos" className="hover:text-white transition-colors">
                  Catálogo General
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Academic Notice */}
          <div className="space-y-3">
            <p className="text-xs tracking-tight uppercase text-white font-bold">
              Plataforma Académica
            </p>
            <p className="text-xs text-stone-400 leading-relaxed font-normal">
              Este sitio opera con fines de portafolio y evaluación formativa. Los proyectos y marcas pertenecen a sus respectivos autores.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 space-y-4 sm:space-y-0 font-medium">
          <p>© {new Date().getFullYear()} Producto Comercial · UPB. Todos los derechos reservados.</p>
          <p className="text-[11px] tracking-tight uppercase font-bold">
            Desarrollado con Next.js + Wagtail CMS
          </p>
        </div>
      </div>
    </footer>
  );
}
