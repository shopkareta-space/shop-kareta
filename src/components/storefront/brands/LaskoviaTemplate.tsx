"use client";

import { BrandHero } from "./BrandHero";
import { BrandCategories, BrandCategory } from "./BrandCategories";
import ProductCard from "@/components/storefront/ProductCard";
import { ProductReviews } from "@/components/storefront/ProductReviews";
import BlurFade from "@/components/ui/blur-fade";
import { Sparkles, Heart, Droplets, CheckCircle2 } from "lucide-react";
import type { Product } from "@/data/products";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface LaskoviaTemplateProps {
  products: Product[];
}

export function LaskoviaTemplate({ products }: LaskoviaTemplateProps) {
  const categories: BrandCategory[] = [
    { title: "Skincare", description: "Glow & Care", colorClass: "bg-[#FDF2F4] text-[#C17A8B]" },
    { title: "Makeup", description: "Enhance Beauty", colorClass: "bg-[#FDF2F4] text-[#C17A8B]" },
    { title: "Haircare", description: "Strength & Shine", colorClass: "bg-[#FDF2F4] text-[#C17A8B]" },
    { title: "Fragrance", description: "Long Lasting", colorClass: "bg-[#FDF2F4] text-[#C17A8B]" },
    { title: "Bath & Body", description: "Pamper Yourself", colorClass: "bg-[#FDF2F4] text-[#C17A8B]" },
    { title: "Men's Grooming", description: "Confident You", colorClass: "bg-[#FDF2F4] text-[#C17A8B]" },
  ];

  return (
    <div className="bg-[#FAF7F7] min-h-screen">
      <BrandHero 
        brandName="La'Skovia"
        headline={
          <>
            Luxury You Deserve.<br />
            <span className="text-[#C17A8B]">Beauty You Own.</span>
          </>
        }
        subHeadline="Premium cosmetics crafted for timeless beauty & confidence. Where science meets elegance."
        bgClass="bg-[#FDF2F4]"
        textClass="text-[#2A2A2A]"
        accentClass="bg-[#C17A8B] text-white"
        features={[
          { icon: <Sparkles className="w-6 h-6 text-[#C17A8B]" />, title: "Premium Ingredients", desc: "Luxury that shows" },
          { icon: <Droplets className="w-6 h-6 text-[#C17A8B]" />, title: "Dermatologically Tested", desc: "Gentle on skin" },
          { icon: <Heart className="w-6 h-6 text-[#C17A8B]" />, title: "Cruelty Free", desc: "We love animals" },
        ]}
      />

      <div className="bg-white">
        <BrandCategories 
          title="Explore Our Collections"
          categories={categories}
          accentColorClass="text-[#C17A8B]"
        />
      </div>

      {/* Best Sellers Grid */}
      <section className="py-20 bg-[#FAF7F7]">
        <div className="container mx-auto px-4">
          <BlurFade delay={0.1}>
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4">
                <div className="h-px w-12 bg-[#C17A8B]/30" />
                <h2 className="font-heading text-3xl font-bold text-[#2A2A2A]">Best Sellers</h2>
                <div className="h-px w-12 bg-[#C17A8B]/30" />
              </div>
              <Link href="#all" className="text-sm font-semibold text-[#C17A8B] hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </BlurFade>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center border-2 border-dashed border-[#C17A8B]/20 rounded-3xl bg-white">
              <p className="text-brand-gray">Products loading soon...</p>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white border-y border-[#C17A8B]/10">
        <div className="container mx-auto px-4 text-center">
          <BlurFade delay={0.1}>
            <h2 className="font-heading text-3xl font-bold text-[#2A2A2A] mb-12">Why Choose La'Skovia?</h2>
          </BlurFade>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: <Sparkles />, title: "Premium Quality", desc: "Luxury that shows" },
              { icon: <CheckCircle2 />, title: "Trusted Ingredients", desc: "Safe & effective" },
              { icon: <Droplets />, title: "Dermatologically Tested", desc: "Gentle on skin" },
              { icon: <Heart />, title: "Cruelty Free", desc: "We love animals" },
            ].map((item, idx) => (
              <BlurFade key={idx} delay={0.2 + (idx * 0.1)}>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-[#FDF2F4] text-[#C17A8B] flex items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-[#2A2A2A] mb-2">{item.title}</h3>
                  <p className="text-sm text-brand-gray">{item.desc}</p>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="py-20 bg-[#1A1A1A] text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
            <BlurFade delay={0.1} className="max-w-xl text-center md:text-left">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#D4AF37] mb-4">Loved By Thousands</h2>
              <p className="text-white/80 text-lg">Real Stories. Real Results. Discover our beauty secrets and community stories.</p>
            </BlurFade>
            <BlurFade delay={0.2}>
              <Link href="#blog" className="inline-flex items-center justify-center gap-2 bg-[#D4AF37] text-[#1A1A1A] px-8 py-4 rounded-full font-bold hover:bg-white transition-colors">
                Read Beauty Tips
              </Link>
            </BlurFade>
          </div>
        </div>
      </section>

      <ProductReviews productId="brand-laskovia" />
    </div>
  );
}
