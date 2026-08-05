import { ProductGrid } from "./ProductGrid";
import { getRelatedProducts } from "@/lib/services/product.service";

interface RelatedProductsProps {
  currentProductId: string;
  category: string;
}

export async function RelatedProducts({ currentProductId, category }: RelatedProductsProps) {
  // Pass category to getRelatedProducts if we want, but for now we just fetch by ID.
  const relatedProducts = await getRelatedProducts(currentProductId, 4);

  if (relatedProducts.length === 0) return null;

  return (
    <section className="py-20 border-t border-brand-gray/10 bg-brand-light/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl font-bold text-brand-blue mb-4">
            You May Also Like
          </h2>
          <p className="text-brand-gray">Customers who viewed this item also bought</p>
        </div>
        
        <ProductGrid products={relatedProducts} />
      </div>
    </section>
  );
}
