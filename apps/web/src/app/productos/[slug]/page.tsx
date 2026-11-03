import React from "react";
import { notFound } from "next/navigation";
import { getProducts, getProductBySlug } from "@/lib/cms/client";
import { ProductDetailView } from "@/components/ProductDetailView";

export const revalidate = 3600;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Get other products from the same brand
  const allBrandProducts = await getProducts({ brandSlug: product.brand.slug });
  const relatedProducts = allBrandProducts.filter((p) => p.id !== product.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <ProductDetailView product={product} relatedProducts={relatedProducts} />
    </div>
  );
}
