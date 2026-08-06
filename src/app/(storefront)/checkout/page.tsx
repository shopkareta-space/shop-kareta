"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { useCheckoutStore } from "@/store/checkoutStore";
import { CheckoutStepper } from "@/components/checkout/CheckoutStepper";
import { CheckoutSummary } from "@/components/checkout/CheckoutSummary";
import { ContactForm } from "@/components/checkout/ContactForm";
import { AddressForm } from "@/components/checkout/AddressForm";
import { DeliverySelector } from "@/components/checkout/DeliverySelector";
import { PaymentSelector } from "@/components/checkout/PaymentSelector";
import { OrderReview } from "@/components/checkout/OrderReview";

export default function CheckoutPage() {
  const router = useRouter();
  const cartItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isMounted, setIsMounted] = useState(false);

  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Redirect to cart if empty on initial load
  useEffect(() => {
    if (isMounted) {
      // Use getState to avoid subscribing to cart changes which causes race conditions during success redirect
      if (useCartStore.getState().items.length === 0 && !isOrderPlaced) {
        router.replace("/cart");
      }
    }
  }, [isMounted, router]);

  if (!isMounted || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-green/30 border-t-brand-green rounded-full animate-spin" />
      </div>
    );
  }

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));
  const editStep = (step: number) => setCurrentStep(step);

  const handlePlaceOrder = () => {
    setIsOrderPlaced(true);
    // In a real app, API call goes here (handled in OrderReview now)
    
    // clearCheckout(); // Might want to keep address for next time, but clear it for now
    router.push("/checkout/success");
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1200px]">
        <div className="flex flex-col lg:flex-row gap-10 xl:gap-16">
          
          {/* Left Column: Flow */}
          <div className="w-full lg:w-[60%]">
            <CheckoutStepper currentStep={currentStep} />

            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-brand-gray/5 overflow-hidden relative min-h-[400px]">
              <AnimatePresence mode="wait">
                {currentStep === 1 && <ContactForm key="step1" onNext={nextStep} />}
                {currentStep === 2 && <AddressForm key="step2" onNext={nextStep} onBack={prevStep} />}
                {currentStep === 3 && <DeliverySelector key="step3" onNext={nextStep} onBack={prevStep} />}
                {currentStep === 4 && <PaymentSelector key="step4" onNext={nextStep} onBack={prevStep} />}
                {currentStep === 5 && <OrderReview key="step5" onBack={prevStep} onEditStep={editStep} onPlaceOrder={handlePlaceOrder} />}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column: Summary */}
          <div className="w-full lg:w-[40%]">
            <CheckoutSummary />
          </div>

        </div>
      </div>
    </div>
  );
}
