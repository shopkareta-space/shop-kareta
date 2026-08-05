"use client";

import { Check } from "lucide-react";
import type { Product } from "@/types/product";
import BlurFade from "@/components/ui/blur-fade";

export function BenefitsSection({ product }: { product: Product }) {
  if (!product.benefits || product.benefits.length === 0) return null;

  return (
    <section className="bg-brand-blue py-16 md:py-24 text-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <BlurFade delay={0.1}>
          <div className="text-center mb-16 md:mb-20">
            <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4">Key Benefits</h2>
            <p className="text-brand-light/70 text-lg max-w-2xl mx-auto">
              Carefully formulated to provide maximum results naturally.
            </p>
          </div>
        </BlurFade>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {product.benefits.map((benefit, idx) => (
            <BlurFade key={idx} delay={0.1 + (idx % 3) * 0.1}>
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col h-full hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-brand-green/20 flex items-center justify-center mb-6">
                  <Check className="w-6 h-6 text-brand-green" />
                </div>
                <span className="text-lg leading-relaxed text-brand-light/90">{benefit}</span>
              </div>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
