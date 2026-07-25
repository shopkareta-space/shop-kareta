"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, CheckCircle2 } from "lucide-react";
import { fadeUp, premiumSpring } from "@/lib/motion";

export function ShippingEstimator() {
  const [pincode, setPincode] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [estimate, setEstimate] = useState<string | null>(null);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length < 6) return;
    
    setIsChecking(true);
    setEstimate(null);

    // Mock API delay
    setTimeout(() => {
      setIsChecking(false);
      setEstimate("Delivery by Thursday, Oct 24");
    }, 800);
  };

  return (
    <motion.div variants={fadeUp} className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="w-4 h-4 text-brand-green" />
        <span className="text-sm font-semibold text-brand-blue">Delivery Estimate</span>
      </div>
      
      <form onSubmit={handleCheck} className="flex gap-2">
        <input 
          type="text"
          maxLength={6}
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/[^0-9]/g, ''))}
          placeholder="Enter Pincode"
          className="flex-1 bg-white border border-brand-gray/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/50 focus:border-brand-green"
        />
        <motion.button
          type="submit"
          whileTap={{ scale: 0.95 }}
          transition={premiumSpring}
          disabled={isChecking || pincode.length < 6}
          className="bg-brand-gray/10 text-brand-blue px-4 rounded-xl font-medium text-sm disabled:opacity-50 hover:bg-brand-gray/20 transition-colors flex items-center justify-center min-w-[80px]"
        >
          {isChecking ? (
            <div className="w-4 h-4 border-2 border-brand-blue/30 border-t-brand-blue rounded-full animate-spin" />
          ) : (
            "Check"
          )}
        </motion.button>
      </form>

      <AnimatePresence>
        {estimate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mt-3"
          >
            <div className="flex items-center gap-2 text-brand-green text-sm font-medium bg-brand-green/5 p-3 rounded-lg border border-brand-green/10">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{estimate}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
