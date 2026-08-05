"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, Zap, Check } from "lucide-react";
import { QuantitySelector } from "./QuantitySelector";
import { premiumSpring } from "@/lib/motion";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import type { Product } from "@/types/product";

interface PurchaseActionsProps {
  product: Product;
}

export function PurchaseActions({ product }: PurchaseActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();

  const handleAddToCart = () => {
    setIsAddingToCart(true);
    // Simulate network delay for premium feel
    setTimeout(() => {
      addItem(product, quantity, product.variant);
      setIsAddingToCart(false);
      setAddedToCart(true);
      // Reset confirmation after 2 seconds
      setTimeout(() => setAddedToCart(false), 2000);
    }, 600);
  };

  const handleBuyNow = () => {
    addItem(product, quantity, product.variant);
    router.push("/checkout");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Quantity & Stock */}
      <div className="flex items-center gap-6">
        <div>
          <span className="block text-xs uppercase tracking-wider text-brand-gray font-medium mb-2">Quantity</span>
          <QuantitySelector quantity={quantity} onQuantityChange={setQuantity} />
        </div>
        
        {product.stockStatus === "In Stock" ? (
          <div className="mt-6 px-3 py-1.5 bg-brand-green/10 text-brand-green text-xs font-semibold rounded-full flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
            In Stock
          </div>
        ) : product.stockStatus === "Out of Stock" ? (
          <div className="mt-6 px-3 py-1.5 bg-red-500/10 text-red-600 text-xs font-semibold rounded-full flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
            Out of Stock
          </div>
        ) : null}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <motion.button
          whileTap={{ scale: 0.98 }}
          transition={premiumSpring}
          onClick={handleAddToCart}
          disabled={isAddingToCart || product.stockStatus === "Out of Stock"}
          className="flex-1 relative overflow-hidden h-14 bg-brand-blue text-white rounded-full font-medium disabled:opacity-70 disabled:scale-100"
        >
          <AnimatePresence mode="wait">
            {isAddingToCart ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </motion.div>
            ) : addedToCart ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 flex items-center justify-center gap-2 text-brand-green bg-brand-light"
              >
                <Check className="w-5 h-5" />
                <span>Added to Cart</span>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Add to Cart</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.98 }}
          transition={premiumSpring}
          onClick={handleBuyNow}
          disabled={product.stockStatus === "Out of Stock"}
          className="flex-1 h-14 bg-brand-green text-white rounded-full font-medium flex items-center justify-center gap-2 transition-all hover:bg-[#0c593a] hover:shadow-lg hover:shadow-brand-green/20 disabled:opacity-50 disabled:scale-100 disabled:hover:shadow-none"
        >
          <Zap className="w-5 h-5 fill-white" />
          <span>Buy Now</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          transition={premiumSpring}
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="w-14 h-14 shrink-0 rounded-full border border-brand-gray/20 flex items-center justify-center text-brand-blue hover:border-brand-green hover:text-brand-green transition-colors bg-white"
          aria-label="Toggle Wishlist"
        >
          <Heart 
            className={`w-6 h-6 transition-transform ${isWishlisted ? "fill-brand-green text-brand-green scale-110" : ""}`} 
          />
        </motion.button>
      </div>
    </div>
  );
}
