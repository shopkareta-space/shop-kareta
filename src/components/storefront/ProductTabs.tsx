"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, AlertTriangle, ShieldCheck } from "lucide-react";
import { premiumSpring, fluidLayout, staggerContainer, fadeUp } from "@/lib/motion";
import type { Product } from "@/data/products";

interface ProductTabsProps {
  product: Product;
}

export function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<string>("manufacturing");
  const [activeAccordion, setActiveAccordion] = useState<string>("manufacturing");

  const tabs = [
    { id: "manufacturing", label: "Manufacturing Info", hidden: !product.manufacturing },
    { id: "faq", label: "FAQ", hidden: !product.faq || product.faq.length === 0 },
  ].filter(tab => !tab.hidden);

  if (tabs.length === 0) return null;


  const renderContent = (tabId: string) => {
    switch (tabId) {
      case "manufacturing":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
            {product.manufacturing?.manufacturer && (
              <div>
                <span className="block text-brand-gray mb-1 text-xs uppercase tracking-wider">Manufacturer</span>
                <span className="text-brand-blue font-medium">{product.manufacturing.manufacturer}</span>
              </div>
            )}
            {product.manufacturing?.marketedBy && (
              <div>
                <span className="block text-brand-gray mb-1 text-xs uppercase tracking-wider">Marketed By</span>
                <span className="text-brand-blue font-medium">{product.manufacturing.marketedBy}</span>
              </div>
            )}
            {product.manufacturing?.countryOfOrigin && (
              <div>
                <span className="block text-brand-gray mb-1 text-xs uppercase tracking-wider">Country of Origin</span>
                <span className="text-brand-blue font-medium">{product.manufacturing.countryOfOrigin}</span>
              </div>
            )}
            {product.manufacturing?.mfgLicNo && (
              <div>
                <span className="block text-brand-gray mb-1 text-xs uppercase tracking-wider">Mfg. Lic. No.</span>
                <span className="text-brand-blue font-medium">{product.manufacturing.mfgLicNo}</span>
              </div>
            )}
            {product.manufacturing?.mfgDate && (
              <div>
                <span className="block text-brand-gray mb-1 text-xs uppercase tracking-wider">Mfg Date</span>
                <span className="text-brand-blue font-medium">{product.manufacturing.mfgDate}</span>
              </div>
            )}
            {product.manufacturing?.batchNumber && (
              <div>
                <span className="block text-brand-gray mb-1 text-xs uppercase tracking-wider">Batch Number</span>
                <span className="text-brand-blue font-medium">{product.manufacturing.batchNumber}</span>
              </div>
            )}
            {product.manufacturing?.shelfLife && (
              <div>
                <span className="block text-brand-gray mb-1 text-xs uppercase tracking-wider">Shelf Life</span>
                <span className="text-brand-blue font-medium">{product.manufacturing.shelfLife}</span>
              </div>
            )}
          </div>
        );
      case "faq":
        return (
          <div className="space-y-4">
            {product.faq?.map((item, idx) => (
              <div key={idx} className="border border-brand-gray/10 rounded-xl p-4 bg-brand-light/50">
                <h4 className="font-semibold text-brand-blue mb-2 text-sm">{item.question}</h4>
                <p className="text-sm text-brand-gray">{item.answer}</p>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {/* Desktop Tabs */}
      <div className="hidden md:block">
        <div className="flex border-b border-brand-gray/20 mb-8 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-8 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id ? "text-brand-green" : "text-brand-gray hover:text-brand-blue"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-green"
                  transition={premiumSpring}
                />
              )}
            </button>
          ))}
        </div>
        <div className="min-h-[200px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent(activeTab)}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Accordion */}
      <div className="md:hidden flex flex-col gap-3">
        {tabs.map((tab) => {
          const isActive = activeAccordion === tab.id;
          return (
            <div key={tab.id} className="border border-brand-gray/10 rounded-2xl overflow-hidden bg-white">
              <button
                onClick={() => setActiveAccordion(isActive ? "" : tab.id)}
                className="w-full px-6 py-4 flex items-center justify-between bg-white"
              >
                <span className={`font-medium ${isActive ? "text-brand-green" : "text-brand-blue"}`}>
                  {tab.label}
                </span>
                {isActive ? (
                  <Minus className="w-5 h-5 text-brand-green" />
                ) : (
                  <Plus className="w-5 h-5 text-brand-gray" />
                )}
              </button>
              <AnimatePresence initial={false}>
                {isActive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={fluidLayout}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-2 border-t border-brand-gray/5">
                      {renderContent(tab.id)}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
