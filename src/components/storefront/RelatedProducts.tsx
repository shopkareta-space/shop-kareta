"use client";

import { useMemo } from "react";
import { ProductGrid } from "./ProductGrid";
import { products } from "@/data/products";

interface RelatedProductsProps {
  currentProductId: string;
  category: string;
}

export function RelatedProducts({ currentProductId, category }: RelatedProductsProps) {
  const relatedProducts = useMemo(() => {
    // Filter by same category, exclude current product, limit to 4
    return products
      .filter(p => p.category === category && p.id !== currentProductId)
      .slice(0, 4);
  }, [currentProductId, category]);

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
