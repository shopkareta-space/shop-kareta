"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, CreditCard, Banknote, Smartphone, ShieldCheck } from "lucide-react";
import { useCheckoutStore, PaymentMethod } from "@/store/checkoutStore";
import { fadeUp, premiumSpring } from "@/lib/motion";

interface PaymentSelectorProps {
  onNext: () => void;
  onBack: () => void;
}

export function PaymentSelector({ onNext, onBack }: PaymentSelectorProps) {
  const paymentMethod = useCheckoutStore((state) => state.paymentMethod);
  const setPaymentMethod = useCheckoutStore((state) => state.setPaymentMethod);

  const methods = [
    { id: "upi" as PaymentMethod, name: "UPI", icon: Smartphone, desc: "Google Pay, PhonePe, Paytm", comingSoon: true },
    { id: "card" as PaymentMethod, name: "Credit / Debit Card", icon: CreditCard, desc: "Visa, MasterCard, RuPay", comingSoon: true },
    { id: "cod" as PaymentMethod, name: "Cash on Delivery", icon: Banknote, desc: "Pay via cash when order arrives", comingSoon: false }
  ];

  const handleNext = () => {
    if (paymentMethod) {
      onNext();
    }
  };

  return (
    <motion.div variants={fadeUp} initial="initial" animate="animate" exit="exit">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-heading text-2xl font-bold text-brand-blue">Payment Method</h2>
        <ShieldCheck className="w-5 h-5 text-brand-green" />
      </div>
      <p className="text-brand-gray text-sm mb-8">All transactions are secure and encrypted.</p>

      <div className="flex flex-col gap-4 mb-10">
        {methods.map((method) => {
          const isSelected = paymentMethod === method.id;
          const Icon = method.icon;
          
          return (
            <div
              key={method.id}
              onClick={() => {
                if (!method.comingSoon) setPaymentMethod(method.id);
              }}
              className={`relative p-5 rounded-2xl border-2 transition-all ${method.comingSoon ? "opacity-60 cursor-not-allowed" : "cursor-pointer"} ${
                isSelected 
                  ? "border-brand-blue bg-brand-blue/5" 
                  : "border-brand-gray/10 bg-white hover:border-brand-gray/30"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isSelected ? "bg-brand-blue text-white" : "bg-brand-gray/10 text-brand-gray"}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-brand-blue">{method.name}</h3>
                    {method.comingSoon && (
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-amber-100 text-amber-700">Coming Soon</span>
                    )}
                  </div>
                  <p className="text-xs text-brand-gray mt-0.5">{method.desc}</p>
                </div>
              </div>
              
              <div className={`absolute top-1/2 -translate-y-1/2 right-5 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                isSelected ? "border-brand-blue" : "border-brand-gray/30"
              }`}>
                {isSelected && <div className="w-2.5 h-2.5 bg-brand-blue rounded-full" />}
              </div>
              
              {/* Optional: Render specific input forms if a method is selected (e.g. Card Input fields) */}
              {isSelected && method.id === "card" && (
                <div className="mt-4 pt-4 border-t border-brand-blue/10">
                  <p className="text-xs text-brand-gray mb-3">You will be securely redirected to our payment gateway to complete your card transaction during the final step.</p>
                </div>
              )}
            </div>
          );
        })}
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
          whileTap={paymentMethod ? { scale: 0.98 } : {}}
          transition={premiumSpring}
          onClick={handleNext}
          disabled={!paymentMethod}
          className="h-14 px-8 bg-brand-blue text-white rounded-full font-medium flex items-center justify-center gap-2 hover:bg-[#152a60] transition-colors shadow-sm disabled:opacity-50 disabled:hover:bg-brand-blue"
        >
          <span>Review Order</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}
