"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ShieldCheck, Tag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { premiumSpring, fadeUp, staggerContainer } from "@/lib/motion";
import { ShippingEstimator } from "./ShippingEstimator";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function OrderSummary() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const coupon = useCartStore((state) => state.coupon);
  const applyCoupon = useCartStore((state) => state.applyCoupon);
  const removeCoupon = useCartStore((state) => state.removeCoupon);

  const [couponCode, setCouponCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discount = coupon ? (subtotal * coupon.discountPercent) / 100 : 0;
  
  // Free shipping threshold logic
  const FREE_SHIPPING_THRESHOLD = 1000;
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingCost = isFreeShipping ? 0 : 99; // Base shipping cost
  
  const grandTotal = subtotal - discount + shippingCost;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    
    setIsApplying(true);
    setCouponError("");
    
    const success = await applyCoupon(couponCode);
    setIsApplying(false);
    
    if (!success) {
      setCouponError("Invalid or expired coupon code.");
    } else {
      setCouponCode("");
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;
    
    setIsValidating(true);
    try {
      const res = await fetch("/api/cart/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      
      const data = await res.json();
      
      if (!res.ok || !data.success) {
        if (data.issues && data.issues.length > 0) {
          alert("Please update your cart:\n\n" + data.issues.join("\n"));
        } else {
          alert(data.error || "Failed to validate cart");
        }
        return;
      }
      
      router.push("/checkout");
    } catch (error) {
      console.error("Cart validation error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <motion.div 
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="bg-brand-light/30 border border-brand-gray/10 rounded-2xl p-6 lg:sticky lg:top-24"
    >
      <h2 className="font-heading text-lg font-bold text-brand-blue mb-6">Order Summary</h2>

      {/* Coupon Component Integrated */}
      <motion.div variants={fadeUp} className="mb-6">
        {coupon ? (
          <div className="flex items-center justify-between bg-brand-green/10 border border-brand-green/20 rounded-xl p-3">
            <div className="flex items-center gap-2 text-brand-green font-semibold text-sm">
              <Tag className="w-4 h-4" />
              <span>{coupon.code} applied (-{coupon.discountPercent}%)</span>
            </div>
            <button 
              onClick={removeCoupon}
              className="text-xs text-brand-gray hover:text-red-500 font-medium underline-offset-2 hover:underline"
            >
              Remove
            </button>
          </div>
        ) : (
          <form onSubmit={handleApplyCoupon} className="flex flex-col gap-2">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Gift card or discount code"
                className="flex-1 bg-white border border-brand-gray/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/50 focus:border-brand-green uppercase"
              />
              <motion.button
                type="submit"
                whileTap={{ scale: 0.95 }}
                disabled={isApplying || !couponCode.trim()}
                className="bg-brand-blue text-white px-6 rounded-xl font-medium text-sm disabled:opacity-50 min-w-[90px] flex items-center justify-center"
              >
                {isApplying ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Apply"
                )}
              </motion.button>
            </div>
            {couponError && <span className="text-xs text-red-500 pl-1">{couponError}</span>}
          </form>
        )}
      </motion.div>

      {/* Shipping Estimator */}
      <ShippingEstimator />

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
              <span>Discount</span>
              <span className="font-medium">-₹{discount.toFixed(2)}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div variants={fadeUp} className="flex justify-between text-brand-gray text-sm">
          <span>Shipping</span>
          <span className="font-medium text-brand-blue">
            {isFreeShipping ? (
              <span className="text-brand-green font-semibold">FREE</span>
            ) : (
              `₹${shippingCost.toFixed(2)}`
            )}
          </span>
        </motion.div>
      </motion.div>

      <div className="h-px bg-brand-gray/10 w-full mb-6" />

      {/* Grand Total */}
      <motion.div variants={fadeUp} className="flex justify-between items-end mb-8">
        <span className="font-bold text-brand-blue">Total</span>
        <div className="text-right">
          <span className="text-xs text-brand-gray block mb-1">Includes all taxes</span>
          <span className="font-heading text-2xl font-bold text-brand-blue">
            ₹{grandTotal.toFixed(2)}
          </span>
        </div>
      </motion.div>

      {/* Checkout Action */}
      <motion.div variants={fadeUp}>
        <motion.button
          onClick={handleCheckout}
          disabled={isValidating || items.length === 0}
          whileTap={{ scale: 0.98 }}
          transition={premiumSpring}
          className="w-full h-14 bg-brand-green text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-[#0c593a] hover:shadow-lg hover:shadow-brand-green/20 transition-all mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isValidating ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </motion.button>
      </motion.div>

      {/* Security Assurance */}
      <motion.div variants={fadeUp} className="flex items-center justify-center gap-2 text-xs font-medium text-brand-gray">
        <ShieldCheck className="w-4 h-4 text-brand-green" />
        <span>Secure & Encrypted Checkout</span>
      </motion.div>
    </motion.div>
  );
}
