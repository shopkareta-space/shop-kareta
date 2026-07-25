"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { CartItemList } from "@/components/cart/CartItemList";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { EmptyCartState } from "@/components/cart/EmptyCartState";
import { TrustBadges } from "@/components/storefront/TrustBadges";
import { RelatedProducts } from "@/components/storefront/RelatedProducts";
import { staggerContainer, fadeUp } from "@/lib/motion";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  // Prevent hydration mismatch for zustand persist by only rendering after mount
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-green/30 border-t-brand-green rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px]">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-medium text-brand-gray mb-8">
          <Link href="/" className="hover:text-brand-blue transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-brand-blue">Shopping Cart</span>
        </nav>

        {items.length === 0 ? (
          <EmptyCartState />
        ) : (
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="flex flex-col lg:flex-row gap-10 xl:gap-16 relative"
          >
            {/* Left Column: Cart Items */}
            <motion.div variants={fadeUp} className="w-full lg:w-[65%] xl:w-[70%]">
              <CartItemList />
            </motion.div>

            {/* Right Column: Order Summary (Sticky) */}
            <motion.div variants={fadeUp} className="w-full lg:w-[35%] xl:w-[30%]">
              <OrderSummary />
              
              <div className="mt-8">
                <TrustBadges />
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Cross-Sell Recommendations */}
      <div className="mt-20">
        <RelatedProducts category="Wellness" currentProductId="" />
      </div>
    </div>
  );
}
