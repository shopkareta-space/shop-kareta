"use client";

import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { premiumSpring } from "@/lib/motion";

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
  max?: number;
}

export function QuantitySelector({ quantity, onQuantityChange, max = 10 }: QuantitySelectorProps) {
  const handleDecrement = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < max) {
      onQuantityChange(quantity + 1);
    }
  };

  return (
    <div className="flex items-center">
      <div className="flex items-center bg-brand-light rounded-full border border-brand-gray/20 p-1">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleDecrement}
          disabled={quantity <= 1}
          aria-label="Decrease quantity"
          className="w-10 h-10 rounded-full flex items-center justify-center text-brand-blue hover:bg-white hover:shadow-sm disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:shadow-none transition-colors"
        >
          <Minus className="w-4 h-4" />
        </motion.button>
        
        <div className="w-12 text-center font-semibold text-brand-blue relative overflow-hidden h-6">
          <motion.div
            key={quantity}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={premiumSpring}
            className="absolute inset-0 flex items-center justify-center"
          >
            {quantity}
          </motion.div>
        </div>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleIncrement}
          disabled={quantity >= max}
          aria-label="Increase quantity"
          className="w-10 h-10 rounded-full flex items-center justify-center text-brand-blue hover:bg-white hover:shadow-sm disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:shadow-none transition-colors"
        >
          <Plus className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
}
