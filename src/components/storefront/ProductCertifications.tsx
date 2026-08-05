"use client";

import { motion } from "framer-motion";
import { scaleUp, staggerContainer } from "@/lib/motion";
import { ShieldCheck, Award, Leaf, CheckCircle2 } from "lucide-react";
import type { Product } from "@/types/product";

interface ProductCertificationsProps {
  product: Product;
}

export function ProductCertifications({ product }: ProductCertificationsProps) {
  if (!product.certifications || product.certifications.length === 0) {
    return null;
  }

  // Helper to assign a dynamic icon based on the certification text
  const getIcon = (cert: string) => {
    const text = cert.toLowerCase();
    if (text.includes("natural") || text.includes("organic") || text.includes("vegan") || text.includes("ayush")) {
      return Leaf;
    }
    if (text.includes("iso") || text.includes("fssai") || text.includes("gmp") || text.includes("haccp")) {
      return Award;
    }
    if (text.includes("tested") || text.includes("certified") || text.includes("safe")) {
      return ShieldCheck;
    }
    return CheckCircle2;
  };

  return (
    <div className="py-6 border-y border-brand-gray/10 mb-10">
      <h3 className="text-sm font-semibold text-brand-blue mb-4 uppercase tracking-wider">Certifications & Assurances</h3>
      <motion.div 
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-2 sm:grid-cols-3 gap-4"
      >
        {product.certifications.map((cert, index) => {
          const Icon = getIcon(cert);
          return (
            <motion.div 
              variants={scaleUp}
              key={index} 
              className="flex items-center gap-3 p-3 bg-brand-light/50 rounded-lg border border-brand-gray/5"
            >
              <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 text-brand-green">
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-brand-blue leading-tight">{cert}</span>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
