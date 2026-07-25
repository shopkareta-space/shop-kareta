"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { useCheckoutStore } from "@/store/checkoutStore";
import { fadeUp, staggerContainer } from "@/lib/motion";

export function CheckoutSummary() {
  const items = useCartStore((state) => state.items);
  const coupon = useCartStore((state) => state.coupon);
  const deliveryMethod = useCheckoutStore((state) => state.deliveryMethod);

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discount = coupon ? (subtotal * coupon.discountPercent) / 100 : 0;
  
  const isFreeShipping = subtotal >= 1000;
  let shippingCost = isFreeShipping ? 0 : 99;
  
  // If express is selected, it might override free shipping or add a flat cost. Let's add a fixed cost for express.
  if (deliveryMethod === "express") {
    shippingCost = isFreeShipping ? 149 : 99 + 149;
  }
  
  const grandTotal = subtotal - discount + shippingCost;

  return (
    <motion.div 
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="bg-brand-light/30 border border-brand-gray/10 rounded-2xl p-6 lg:sticky lg:top-24"
    >
      <h2 className="font-heading text-lg font-bold text-brand-blue mb-6">Order Summary</h2>

      {/* Miniature Cart Items List */}
      <div className="flex flex-col gap-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {items.map((item) => (
          <div key={`${item.product.id}-${item.variant || 'default'}`} className="flex gap-4 items-center">
            <div className="relative w-16 h-16 bg-[#F6F3EC] rounded-lg overflow-hidden shrink-0 border border-brand-gray/10">
              {item.product.images && item.product.images.length > 0 && !item.product.images[0].includes("placeholder") ? (
                <Image
                  src={item.product.images[0]}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-brand-gray/30">
                  <span className="font-heading font-medium text-[10px]">SK</span>
                </div>
              )}
              <div className="absolute -top-2 -right-2 w-5 h-5 bg-brand-gray/80 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                {item.quantity}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-brand-blue truncate">{item.product.name}</h4>
              {item.variant && <span className="text-[10px] text-brand-gray block">{item.variant}</span>}
              <span className="text-sm font-medium text-brand-blue block mt-1">₹{(item.product.price * item.quantity).toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="h-px bg-brand-gray/10 w-full mb-6" />

      {/* Cost Breakdown */}
      <motion.div variants={staggerContainer} className="flex flex-col gap-3 mb-6">
        <motion.div variants={fadeUp} className="flex justify-between text-brand-gray text-sm">
          <span>Subtotal</span>
          <span className="font-medium text-brand-blue">₹{subtotal.toFixed(2)}</span>
        </motion.div>
        
        <AnimatePresence>
          {coupon && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex justify-between text-brand-green text-sm overflow-hidden"
            >
              <span>Discount ({coupon.code})</span>
              <span className="font-medium">-₹{discount.toFixed(2)}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div variants={fadeUp} className="flex justify-between text-brand-gray text-sm">
          <span>Shipping {deliveryMethod === "express" && "(Express)"}</span>
          <span className="font-medium text-brand-blue">
            {shippingCost === 0 ? (
              <span className="text-brand-green font-semibold">FREE</span>
            ) : (
              `₹${shippingCost.toFixed(2)}`
            )}
          </span>
        </motion.div>
      </motion.div>

      <div className="h-px bg-brand-gray/10 w-full mb-6" />

      {/* Grand Total */}
      <motion.div variants={fadeUp} className="flex justify-between items-end mb-6">
        <span className="font-bold text-brand-blue">Total</span>
        <div className="text-right">
          <span className="font-heading text-2xl font-bold text-brand-blue">
            ₹{grandTotal.toFixed(2)}
          </span>
        </div>
      </motion.div>

      {/* Security Assurance */}
      <motion.div variants={fadeUp} className="flex items-center justify-center gap-2 text-xs font-medium text-brand-gray mt-4">
        <ShieldCheck className="w-4 h-4 text-brand-green" />
        <span>Secure & Encrypted Checkout</span>
      </motion.div>
    </motion.div>
  );
}
