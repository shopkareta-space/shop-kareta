"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import { Product } from "@/data/products";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer } from "@/lib/motion";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const [visibleCount, setVisibleCount] = useState(9);

  if (products.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-brand-gray/20 rounded-2xl bg-[#F6F3EC]"
      >
        <div className="w-16 h-16 bg-brand-gray/10 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">🔍</span>
        </div>
        <h3 className="font-heading font-semibold text-xl text-brand-blue mb-2">No products found</h3>
        <p className="text-brand-gray max-w-md">
          We couldn&apos;t find any products matching your current filters. Try adjusting your categories or price range.
        </p>
      </motion.div>
    );
  }

  const visibleProducts = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;

  return (
    <div className="space-y-12">
      <motion.div 
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
      >
        <AnimatePresence mode="popLayout">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </AnimatePresence>
      </motion.div>
      
      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => setVisibleCount((prev) => prev + 9)}
          >
            Load More Products
          </Button>
        </div>
      )}
    </div>
  );
}
