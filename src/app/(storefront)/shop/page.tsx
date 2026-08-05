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
    <ShopClient 
      initialProducts={products}
      categories={categories}
      brands={brands}
    />
  );
}
