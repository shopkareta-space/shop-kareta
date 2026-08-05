"use client";

import type { Product } from "@/types/product";
import BlurFade from "@/components/ui/blur-fade";
import { Info } from "lucide-react";

export function IngredientsSection({ product }: { product: Product }) {
  if (!product.ingredients && !product.nutritionalInfo) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
      {/* Ingredients */}
      {product.ingredients && (
        <BlurFade delay={0.1}>
          <h2 className="font-heading text-3xl font-bold text-brand-blue mb-6">
            Complete Composition
          </h2>
          <div className="bg-white rounded-3xl p-8 md:p-10 border border-brand-gray/10 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] h-full">
            <p className="text-brand-gray text-lg leading-relaxed whitespace-pre-line">
              {product.ingredients}
            </p>
          </div>
        </BlurFade>
      )}

      {/* Nutritional Info */}
      {product.nutritionalInfo && (
        <BlurFade delay={0.2} className="h-full">
          <h2 className="font-heading text-3xl font-bold text-brand-blue mb-6">
            Nutritional Facts
          </h2>
          <div className="bg-white rounded-3xl overflow-hidden border border-brand-gray/10 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] h-full">
            <div className="bg-brand-gray/5 p-4 flex items-center gap-3 border-b border-brand-gray/10">
              <Info className="w-5 h-5 text-brand-gray" />
              <span className="text-sm font-semibold text-brand-gray uppercase tracking-wider">Approximate Values per Serving</span>
            </div>
            <table className="w-full text-left">
              <tbody className="divide-y divide-brand-gray/10">
                {Object.entries(product.nutritionalInfo).map(([key, value]) => (
                  <tr key={key} className="hover:bg-brand-gray/5 transition-colors">
                    <td className="px-6 py-4 text-brand-blue font-medium">{key}</td>
                    <td className="px-6 py-4 text-brand-gray text-right font-medium">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </BlurFade>
      )}
    </div>
  );
}
