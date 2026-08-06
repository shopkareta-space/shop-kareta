"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Package, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const router = useRouter();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId.trim()) {
      router.push(`/track/${orderId.trim()}`);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50/50 py-12 px-4">
      <div className="max-w-md w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center"
        >
          <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-8 h-8 text-brand-blue" />
          </div>
          
          <h1 className="text-2xl font-heading font-bold text-gray-900 mb-2">
            Track Your Order
          </h1>
          <p className="text-gray-500 text-sm mb-8">
            Enter your order ID below to check the current status of your shipment.
          </p>

          <form onSubmit={handleTrack} className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                required
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g. SK-ORD-12345"
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
              />
            </div>
            
            <button
              type="submit"
              disabled={!orderId.trim()}
              className="w-full flex items-center justify-center gap-2 py-3 bg-brand-blue text-white rounded-xl font-medium hover:bg-brand-blue/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Track Order
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
