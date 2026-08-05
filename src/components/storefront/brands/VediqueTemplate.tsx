"use client";

import { BrandHero } from "./BrandHero";
import { BrandCategories, BrandCategory } from "./BrandCategories";
import ProductCard from "@/components/storefront/ProductCard";
import { ProductReviews } from "@/components/storefront/ProductReviews";
import BlurFade from "@/components/ui/blur-fade";
import { ShieldCheck, Sparkles, Microscope, Hexagon, TestTube } from "lucide-react";
import type { Product } from "@/types/product";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface VediqueTemplateProps {
  products: Product[];
}

export function VediqueTemplate({ products }: VediqueTemplateProps) {
  const categories: BrandCategory[] = [
    { title: "Herbal Juices", description: "Liquid nutrition", colorClass: "bg-[#0D1B2A] text-[#D4AF37]" },
    { title: "Swarn Bhasma", description: "Royal formulations", colorClass: "bg-[#0D1B2A] text-[#D4AF37]" },
    { title: "Rajat Bhasma", description: "Premium wellness", colorClass: "bg-[#0D1B2A] text-[#D4AF37]" },
    { title: "Herbal Supplements", description: "Daily health", colorClass: "bg-[#0D1B2A] text-[#D4AF37]" },
  ];

  return (
    <div className="bg-black min-h-screen">
      <BrandHero 
        brandName="Vedique Nutrition"
        headline={
          <>
            Ancient Wisdom.<br />
            <span className="text-[#D4AF37]">Modern Science.</span>
          </>
        }
        subHeadline="Premium Ayurvedic formulations crafted with rare herbs, Swarn Bhasma & modern science for a healthier, stronger you."
        bgClass="bg-[#0D1B2A]"
        textClass="text-white"
        accentClass="bg-[#D4AF37] text-black"
        features={[
          { icon: <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />, title: "100% Natural", desc: "Pure & Safe" },
          { icon: <Microscope className="w-6 h-6 text-[#D4AF37]" />, title: "Lab Tested", desc: "For Purity" },
          { icon: <Hexagon className="w-6 h-6 text-[#D4AF37]" />, title: "No Side Effects", desc: "Safe & Effective" },
        ]}
      />

      <div className="bg-[#0A1520]">
        <BrandCategories 
          title="Our Premium Product Range"
          categories={categories}
          accentColorClass="text-[#D4AF37]"
        />
      </div>

      {/* Best Sellers Grid */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <BlurFade delay={0.1}>
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4">
                <div className="h-px w-12 bg-[#D4AF37]/30" />
                <h2 className="font-heading text-3xl font-bold text-white">Best Sellers</h2>
                <div className="h-px w-12 bg-[#D4AF37]/30" />
              </div>
              <Link href="#all" className="text-sm font-semibold text-[#D4AF37] hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </BlurFade>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {products.map((product) => (
                <div key={product.id} className="[&>div]:bg-[#0D1B2A] [&>div]:border-white/10 [&_h3]:text-white [&_span]:text-white/90">
                  <ProductCard {...product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center border-2 border-dashed border-[#D4AF37]/20 rounded-3xl">
              <p className="text-brand-gray">Products loading soon...</p>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-[#0D1B2A] border-y border-white/5">
        <div className="container mx-auto px-4 text-center">
          <BlurFade delay={0.1}>
            <h2 className="font-heading text-3xl font-bold text-white mb-12">Why Choose Vedique Nutrition?</h2>
          </BlurFade>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: <Sparkles />, title: "Ancient Ayurveda", desc: "Rooted in timeless wisdom" },
              { icon: <Hexagon />, title: "Premium Ingredients", desc: "Finest herbs sourced from nature" },
              { icon: <TestTube />, title: "Lab Tested", desc: "Tested for purity, safety & quality" },
              { icon: <ShieldCheck />, title: "Trusted by Thousands", desc: "Loved by happy customers" },
            ].map((item, idx) => (
              <BlurFade key={idx} delay={0.2 + (idx * 0.1)}>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-black border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-brand-gray">{item.desc}</p>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="py-20 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#D4AF37] via-black to-black" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <BlurFade delay={0.1}>
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Scientific Nutrition Articles</h2>
              <p className="text-brand-gray max-w-2xl mx-auto">Explore clinical insights, Ayurvedic research, and premium wellness guidance.</p>
            </BlurFade>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              "The Science Behind Swarn Bhasma in Immunity",
              "ORAC Value Explained: Why Cellogen is Superior",
              "Understanding Cellular Detoxification",
              "Ayurveda Meets Modern Nano-Extraction"
            ].map((title, idx) => (
              <BlurFade key={idx} delay={0.2 + (idx * 0.1)}>
                <div className="bg-[#0D1B2A] border border-white/10 rounded-2xl p-6 h-full flex flex-col hover:border-[#D4AF37]/50 transition-colors group cursor-pointer">
                  <h3 className="font-bold text-lg leading-tight mb-4 group-hover:text-[#D4AF37] transition-colors">{title}</h3>
                  <div className="mt-auto flex items-center text-sm font-semibold text-[#D4AF37]">
                    Read Article <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      <div className="[&>section]:bg-[#0D1B2A] [&>section_.bg-brand-light]:bg-black [&>section_h2]:text-white [&>section_h3]:text-white [&>section_.text-brand-blue]:text-white">
        <ProductReviews productId="brand-vedique" />
      </div>
    </div>
  );
}
