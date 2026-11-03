import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DemoCartDrawer } from "@/components/DemoCartDrawer";
import { CartProvider } from "@/context/CartContext";

export const metadata: Metadata = {
  title: "PRODUCTO COMERCIAL | Universidad Pontificia Bolivariana",
  description:
    "Marketplace y centro comercial virtual de marcas de vestuario y diseño creadas por estudiantes de la Facultad de Diseño de Vestuario - UPB.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-[#fafaf9] text-stone-900 selection:bg-stone-900 selection:text-white">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <DemoCartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
