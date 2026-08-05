"use client";

import type { Product } from "@/types/product";
import { ProductDescription } from "./ProductDescription";
import { BenefitsSection } from "./BenefitsSection";
import { IngredientsSection } from "./IngredientsSection";
import { UsageSafetySection } from "./UsageSafetySection";
import { ProductTabs } from "./ProductTabs";

export function ProductSections({ product }: { product: Product }) {
  return (
    <div className="flex flex-col w-full">
      <div className="py-16 md:py-24">
        <ProductDescription product={product} />
      </div>
      
      <BenefitsSection product={product} />
      
      <div className="py-16 md:py-24 bg-[#F9F8F6]">
        <div className="container mx-auto px-4 max-w-6xl">
          <IngredientsSection product={product} />
        </div>
      </div>
      
      <div className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <UsageSafetySection product={product} />
        </div>
      </div>
      
      {/* Keep Tabs for remaining info like FAQs & Manufacturing */}
      <div className="py-16 bg-white border-t border-brand-gray/10">
        <div className="container mx-auto px-4 max-w-5xl">
          <section className="bg-white rounded-3xl p-6 md:p-12 border border-brand-gray/10 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)]">
            <ProductTabs product={product} />
          </section>
        </div>
      </div>
    </div>
  );
}
