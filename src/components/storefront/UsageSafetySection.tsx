"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Beaker, ShieldAlert, Thermometer, Info } from "lucide-react";
import type { Product } from "@/types/product";
import BlurFade from "@/components/ui/blur-fade";

const AccordionItem = ({ title, icon: Icon, children, isOpen, onToggle }: any) => {
  return (
    <div className="border border-brand-gray/10 rounded-2xl mb-4 overflow-hidden bg-white shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:border-brand-green/20 transition-colors">
      <button 
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 text-left focus:outline-none focus:ring-2 focus:ring-brand-green/20"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-brand-green/10 flex items-center justify-center shrink-0">
            <Icon className="w-6 h-6 text-brand-green" />
          </div>
          <span className="font-heading font-semibold text-xl md:text-2xl text-brand-blue">{title}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-6 h-6 text-brand-gray" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 pb-8 pt-2 md:pl-[5.5rem]">
              <div className="text-brand-gray text-lg leading-relaxed whitespace-pre-line">
                {children}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export function UsageSafetySection({ product }: { product: Product }) {
  const [openSection, setOpenSection] = useState<string | null>("usage");

  const hasUsage = product.directions || product.dosage;
  const hasSafety = product.storage || product.precautions;

  if (!hasUsage && !hasSafety) return null;

  return (
    <div>
      <BlurFade delay={0.1}>
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-brand-blue mb-10 text-center">
          Usage & Safety
        </h2>
      </BlurFade>
      <div className="max-w-3xl mx-auto">
        {hasUsage && (
          <BlurFade delay={0.15}>
            <AccordionItem
              title="Directions for Use & Dosage"
              icon={Beaker}
              isOpen={openSection === "usage"}
              onToggle={() => setOpenSection(openSection === "usage" ? null : "usage")}
            >
              {product.dosage && (
                <div className="mb-6 bg-brand-gray/5 p-4 rounded-xl border border-brand-gray/10">
                  <span className="font-semibold text-brand-blue block mb-1">Recommended Dosage</span>
                  {product.dosage}
                </div>
              )}
              {product.directions && product.directions.length > 0 && (
                <div>
                  <span className="font-semibold text-brand-blue block mb-3">Directions</span>
                  <ul className="space-y-3 list-disc list-inside">
                    {product.directions.map((dir, idx) => (
                      <li key={idx} className="text-[#0D1B2A]">{dir}</li>
                    ))}
                  </ul>
                </div>
              )}
            </AccordionItem>
          </BlurFade>
        )}

        {hasSafety && (
          <BlurFade delay={0.2}>
            <AccordionItem
              title="Storage & Precautions"
              icon={ShieldAlert}
              isOpen={openSection === "safety"}
              onToggle={() => setOpenSection(openSection === "safety" ? null : "safety")}
            >
              {product.storage && (
                <div className="mb-6">
                  <span className="font-semibold text-brand-blue block mb-2 flex items-center gap-2">
                    <Thermometer className="w-5 h-5 text-brand-green" /> Storage Instructions
                  </span>
                  {product.storage}
                </div>
              )}
              {product.precautions && (
                <div>
                  <span className="font-semibold text-brand-blue block mb-2 flex items-center gap-2">
                    <Info className="w-5 h-5 text-[#D4AF37]" /> Safety Precautions
                  </span>
                  <div className="bg-red-50 text-red-900 p-4 rounded-xl border border-red-100">
                    {product.precautions}
                  </div>
                </div>
              )}
            </AccordionItem>
          </BlurFade>
        )}
      </div>
    </div>
  );
}
