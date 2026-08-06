import { Suspense } from "react";
import { getProducts, getCategories, getBrands } from "@/lib/services/product.service";
import { ShopClient } from "@/components/storefront/ShopClient";

export const revalidate = 60; // Revalidate every minute

export default async function ShopPage() {
  const [products, categories, brands] = await Promise.all([
    getProducts(),
    getCategories(),
    getBrands(),
  ]);

  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-light flex items-center justify-center">Loading shop...</div>}>
      <ShopClient 
        initialProducts={products}
        categories={categories}
        brands={brands}
      />
    </Suspense>
  );
}
