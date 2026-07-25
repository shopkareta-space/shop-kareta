"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Truck, Zap } from "lucide-react";
import { useCheckoutStore } from "@/store/checkoutStore";
import { fadeUp, premiumSpring } from "@/lib/motion";

interface DeliverySelectorProps {
  onNext: () => void;
  onBack: () => void;
}

export function DeliverySelector({ onNext, onBack }: DeliverySelectorProps) {
  const deliveryMethod = useCheckoutStore((state) => state.deliveryMethod);
  const setDeliveryMethod = useCheckoutStore((state) => state.setDeliveryMethod);

  return (
    <motion.div variants={fadeUp} initial="initial" animate="animate" exit="exit">
      <h2 className="font-heading text-2xl font-bold text-brand-blue mb-2">Delivery Options</h2>
      <p className="text-brand-gray text-sm mb-8">Choose how you want your order delivered.</p>

      <div className="flex flex-col gap-4 mb-10">
        {/* Standard Delivery */}
        <div
          onClick={() => setDeliveryMethod("standard")}
          className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all ${
            deliveryMethod === "standard" 
              ? "border-brand-green bg-brand-green/5" 
              : "border-brand-gray/10 bg-white hover:border-brand-gray/30"
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="flex gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${deliveryMethod === "standard" ? "bg-brand-green text-white" : "bg-brand-gray/10 text-brand-gray"}`}>
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-brand-blue">Standard Delivery</h3>
                <p className="text-sm text-brand-gray mt-1">3-5 Business Days</p>
              </div>
            </div>
            <span className="font-bold text-brand-blue">Free</span>
          </div>
          
          {/* Custom Radio Button */}
          <div className={`absolute top-5 right-5 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            deliveryMethod === "standard" ? "border-brand-green" : "border-brand-gray/30"
          }`}>
            {deliveryMethod === "standard" && <div className="w-2.5 h-2.5 bg-brand-green rounded-full" />}
          </div>
        </div>

        {/* Express Delivery */}
        <div
          onClick={() => setDeliveryMethod("express")}
          className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all ${
            deliveryMethod === "express" 
              ? "border-brand-green bg-brand-green/5" 
              : "border-brand-gray/10 bg-white hover:border-brand-gray/30"
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="flex gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${deliveryMethod === "express" ? "bg-brand-green text-white" : "bg-brand-gray/10 text-brand-gray"}`}>
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-brand-blue">Express Delivery</h3>
                <p className="text-sm text-brand-gray mt-1">1-2 Business Days</p>
              </div>
            </div>
            <span className="font-bold text-brand-blue">₹149.00</span>
          </div>

          <div className={`absolute top-5 right-5 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            deliveryMethod === "express" ? "border-brand-green" : "border-brand-gray/30"
          }`}>
            {deliveryMethod === "express" && <div className="w-2.5 h-2.5 bg-brand-green rounded-full" />}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-brand-gray hover:text-brand-blue transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        
        <motion.button
          whileTap={{ scale: 0.98 }}
          transition={premiumSpring}
          onClick={onNext}
          className="h-14 px-8 bg-brand-blue text-white rounded-full font-medium flex items-center justify-center gap-2 hover:bg-[#152a60] transition-colors shadow-sm"
        >
          <span>Continue to Payment</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}
