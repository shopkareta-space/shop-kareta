"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { fadeUp } from "@/lib/motion";

const steps = [
  { id: 1, name: "Contact" },
  { id: 2, name: "Shipping" },
  { id: 3, name: "Delivery" },
  { id: 4, name: "Payment" },
  { id: 5, name: "Review" }
];

interface CheckoutStepperProps {
  currentStep: number;
}

export function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
  return (
    <motion.div variants={fadeUp} className="w-full mb-10 overflow-x-auto pb-4 hide-scrollbar">
      <div className="flex items-center min-w-[500px]">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          
          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center relative">
                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor: isCompleted ? "#0F764D" : isCurrent ? "#1E3A8A" : "#F3F4F6",
                    borderColor: isCompleted ? "#0F764D" : isCurrent ? "#1E3A8A" : "#E5E7EB",
                    color: isCompleted || isCurrent ? "#FFFFFF" : "#9CA3AF"
                  }}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 transition-colors duration-300`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span className="text-xs font-bold">{step.id}</span>
                  )}
                </motion.div>
                <span 
                  className={`absolute top-10 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors duration-300 ${
                    isCompleted || isCurrent ? "text-brand-blue" : "text-brand-gray/50"
                  }`}
                >
                  {step.name}
                </span>
              </div>
              
              {index < steps.length - 1 && (
                <div className="flex-1 h-[2px] bg-brand-gray/10 mx-2 relative overflow-hidden">
                  <motion.div 
                    initial={false}
                    animate={{ width: isCompleted ? "100%" : "0%" }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute top-0 left-0 h-full bg-brand-green"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
