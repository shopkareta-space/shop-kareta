"use client";

import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useCheckoutStore } from "@/store/checkoutStore";
import { useCartStore } from "@/store/cartStore";
import { fadeUp, premiumSpring } from "@/lib/motion";
import { useState } from "react";
import { AlertCircle } from "lucide-react";

interface OrderReviewProps {
  onBack: () => void;
  onEditStep: (step: number) => void;
  onPlaceOrder: () => void;
}

export function OrderReview({ onBack, onEditStep, onPlaceOrder }: OrderReviewProps) {
  const { contact, shippingAddress, deliveryMethod, paymentMethod } = useCheckoutStore();
  const cartItems = useCartStore((state) => state.items);
  const coupon = useCartStore((state) => state.coupon);
  
  // Need to add shipping logic + discount logic here to match the real amount, 
  // but we should just pass the coupon to the API and let it calculate the final amount.
  const subtotal = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const discount = coupon ? (subtotal * coupon.discountPercent) / 100 : 0;
  const isFreeShipping = subtotal >= 1000;
  const shippingCost = isFreeShipping ? 0 : 99;
  const cartTotal = subtotal - discount + shippingCost;
  const [isPlacing, setIsPlacing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handlePlaceOrder = async () => {
    setIsPlacing(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact,
          shippingAddress,
          deliveryMethod,
          paymentMethod,
          items: cartItems.map(item => ({
            productId: item.product.id,
            name: item.product.name,
            quantity: item.quantity,
            price: item.product.price,
            image: item.product.images?.[0] || ""
          })),
          totalAmount: cartTotal,
          couponCode: coupon?.code
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to place order");

      // Save delivery ID in session storage to show on success page
      sessionStorage.setItem("latestDeliveryId", data.orderNumber || data.deliveryId);
      sessionStorage.setItem("latestOrderId", data.orderId);
      sessionStorage.setItem("latestOrderTotal", cartTotal.toString());
      sessionStorage.setItem("latestPaymentMethod", paymentMethod || "cod");
      
      // Clear the cart (handled in parent page.tsx to avoid redirect race conditions)
      // useCartStore.getState().clearCart();

      onPlaceOrder();
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || "Failed to place order. Please try again.");
      setIsPlacing(false);
    }
  };

  if (!contact || !shippingAddress || !paymentMethod) return null;

  return (
    <motion.div variants={fadeUp} initial="initial" animate="animate" exit="exit">
      <h2 className="font-heading text-2xl font-bold text-brand-blue mb-8">Review Your Order</h2>
      
      <div className="flex flex-col gap-6 mb-10">
        
        {/* Contact Review */}
        <div className="bg-white border border-brand-gray/10 rounded-xl p-5 relative">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold text-brand-blue uppercase tracking-wider">Contact Details</h3>
            <button onClick={() => onEditStep(1)} className="text-sm text-brand-green font-medium hover:underline">Edit</button>
          </div>
          <p className="text-brand-gray text-sm">{contact.firstName} {contact.lastName}</p>
          <p className="text-brand-gray text-sm">{contact.email}</p>
          <p className="text-brand-gray text-sm">+91 {contact.phone}</p>
        </div>

        {/* Shipping Review */}
        <div className="bg-white border border-brand-gray/10 rounded-xl p-5 relative">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold text-brand-blue uppercase tracking-wider">Shipping Address</h3>
            <button onClick={() => onEditStep(2)} className="text-sm text-brand-green font-medium hover:underline">Edit</button>
          </div>
          <p className="text-brand-gray text-sm">{shippingAddress.addressLine1}</p>
          {shippingAddress.addressLine2 && <p className="text-brand-gray text-sm">{shippingAddress.addressLine2}</p>}
          <p className="text-brand-gray text-sm">
            {shippingAddress.city}, {shippingAddress.state} {shippingAddress.pincode}
          </p>
        </div>

        {/* Delivery & Payment Review */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white border border-brand-gray/10 rounded-xl p-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-brand-blue uppercase tracking-wider">Delivery</h3>
              <button onClick={() => onEditStep(3)} className="text-sm text-brand-green font-medium hover:underline">Edit</button>
            </div>
            <p className="text-brand-gray text-sm capitalize">{deliveryMethod} Delivery</p>
          </div>

          <div className="bg-white border border-brand-gray/10 rounded-xl p-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-brand-blue uppercase tracking-wider">Payment</h3>
              <button onClick={() => onEditStep(4)} className="text-sm text-brand-green font-medium hover:underline">Edit</button>
            </div>
            <p className="text-brand-gray text-sm">
              {paymentMethod === "cod" ? "Cash on Delivery" : paymentMethod === "card" ? "Credit / Debit Card" : paymentMethod.toUpperCase()}
            </p>
          </div>
        </div>

      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-sm text-red-800">
            <p className="font-semibold mb-1">Could not process your order</p>
            <p>{errorMsg}</p>
            <p className="mt-2 text-xs opacity-80">
              <strong>Tip:</strong> If you are on Vercel, ensure your production Supabase database has all the SQL migrations applied (including `process_checkout` RPC) and that your Vercel Environment Variables are set properly.
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isPlacing}
          className="flex items-center gap-2 text-sm font-medium text-brand-gray hover:text-brand-blue transition-colors disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        
        <motion.button
          whileTap={{ scale: 0.98 }}
          transition={premiumSpring}
          onClick={handlePlaceOrder}
          disabled={isPlacing}
          className="h-14 px-8 bg-brand-green text-white rounded-full font-medium flex items-center justify-center gap-2 hover:bg-[#0c593a] transition-colors shadow-sm disabled:opacity-80"
        >
          {isPlacing ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>Place Order Securely</span>
              <CheckCircle2 className="w-5 h-5" />
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
