"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, ShoppingBag } from "lucide-react";
import { premiumSpring, slideUp } from "@/lib/motion";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import type { Product } from "@/data/products";

export function StickyPurchaseBar({ product }: { product: Product }) {
  const [isVisible, setIsVisible] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();

  const handleBuyNow = () => {
    addItem(product, 1, product.variant);
    router.push("/checkout");
  };

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar after scrolling past 500px on mobile
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial="initial"
          animate="animate"
          exit="exit"
          variants={slideUp}
          className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-brand-gray/10 p-4 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.08)] md:hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-brand-gray">{product.name}</span>
              <span className="font-heading font-bold text-brand-blue">₹{product.price.toFixed(2)}</span>
            </div>
            {product.stockStatus === "Out of Stock" && (
              <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">Out of Stock</span>
            )}
          </div>
          
          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              transition={premiumSpring}
              onClick={() => addItem(product, 1, product.variant)}
              disabled={product.stockStatus === "Out of Stock"}
              className="flex-1 h-12 bg-brand-blue text-white rounded-full font-medium flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add</span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              transition={premiumSpring}
              onClick={handleBuyNow}
              disabled={product.stockStatus === "Out of Stock"}
              className="flex-[1.5] h-12 bg-brand-green text-white rounded-full font-medium flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Buy Now</span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
