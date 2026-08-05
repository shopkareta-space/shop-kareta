"use client";

import type { Product } from "@/types/product";
import BlurFade from "@/components/ui/blur-fade";

export function ProductDescription({ product }: { product: Product }) {
  if (!product.description && (!product.contents || product.contents.length === 0)) return null;

  return (
    <section className="container mx-auto px-4 max-w-4xl w-full">
      <BlurFade delay={0.1}>
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-brand-blue mb-8 text-center">
          Product Overview
        </h2>
        <div className="prose prose-lg max-w-none text-brand-gray leading-relaxed whitespace-pre-line text-center md:text-xl md:leading-loose">
          {product.description}
        </div>
      </BlurFade>

      {product.contents && product.contents.length > 0 && (
        <BlurFade delay={0.2}>
          <div className="mt-16 bg-white rounded-3xl p-8 md:p-12 border border-brand-gray/10 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.05)]">
            <h3 className="font-heading text-2xl md:text-3xl font-bold text-brand-blue mb-8 text-center">
              Package Contents
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.contents.map((item, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-brand-green/10 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-brand-green" />
                  </div>
                  <span className="text-lg text-[#0D1B2A] leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </BlurFade>
      )}
    </section>
  );
}
