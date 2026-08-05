"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { CartItemList } from "@/components/cart/CartItemList";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { EmptyCartState } from "@/components/cart/EmptyCartState";
import { TrustBadges } from "@/components/storefront/TrustBadges";
import { staggerContainer, fadeUp } from "@/lib/motion";

export function CartClient() {
  const items = useCartStore((state) => state.items);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-brand-green/30 border-t-brand-green rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return <EmptyCartState />;
  }

  return (
    <motion.div 
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="flex flex-col lg:flex-row gap-10 xl:gap-16 relative"
    >
      <motion.div variants={fadeUp} className="w-full lg:w-[65%] xl:w-[70%]">
        <CartItemList />
      </motion.div>

      <motion.div variants={fadeUp} className="w-full lg:w-[35%] xl:w-[30%]">
        <OrderSummary />
        <div className="mt-8">
          <TrustBadges />
        </div>
      </motion.div>
    </motion.div>
  );
}
