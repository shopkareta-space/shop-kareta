"use client";

import { BrandHero } from "./BrandHero";
import { BrandCategories, BrandCategory } from "./BrandCategories";
import ProductCard from "@/components/storefront/ProductCard";
import { ProductReviews } from "@/components/storefront/ProductReviews";
import BlurFade from "@/components/ui/blur-fade";
import { ShieldCheck, Leaf, HeartPulse, Recycle, BookOpen } from "lucide-react";
import type { Product } from "@/types/product";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SatvamTemplateProps {
  products: Product[];
}

export function SatvamTemplate({ products }: SatvamTemplateProps) {
  const categories: BrandCategory[] = [
    { title: "Immunity", description: "Strengthen defenses", colorClass: "bg-white text-[#0F6B46]" },
    { title: "Joint Care", description: "Stay active", colorClass: "bg-white text-[#0F6B46]" },
    { title: "Digestion", description: "Better gut health", colorClass: "bg-white text-[#0F6B46]" },
    { title: "Detox & Cleanse", description: "Purify naturally", colorClass: "bg-white text-[#0F6B46]" },
    { title: "Heart Care", description: "Cardio support", colorClass: "bg-white text-[#0F6B46]" },
    { title: "Women Wellness", description: "Balance & strength", colorClass: "bg-white text-[#0F6B46]" },
  ];

  return (
    <div className="bg-[#F6F3EC] min-h-screen">
      <BrandHero 
        brandName="Satvam Wellness"
        headline={
          <>
            The Power of <span className="text-[#D4AF37]">Ayurveda.</span><br />
            The Gift of Nature.
          </>
        }
        subHeadline="Pure herbs. Ancient wisdom. Modern wellness. For a healthier you, naturally."
        bgClass="bg-[#0F6B46]"
        textClass="text-white"
        accentClass="bg-[#D4AF37] text-[#0D1B2A]"
        features={[
          { icon: <Leaf className="w-6 h-6 text-[#D4AF37]" />, title: "100% Natural", desc: "Pure & Safe" },
          { icon: <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />, title: "Ayurvedic", desc: "Ancient Wisdom" },
          { icon: <HeartPulse className="w-6 h-6 text-[#D4AF37]" />, title: "No Side Effects", desc: "Gentle & Effective" },
        ]}
      />

      <BrandCategories 
        title="Shop by Wellness Needs"
        categories={categories}
        accentColorClass="text-[#0F6B46]"
      />

      {/* Best Sellers Grid */}
      <section className="py-20 bg-[#F6F3EC]">
        <div className="container mx-auto px-4">
          <BlurFade delay={0.1}>
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4">
                <div className="h-px w-12 bg-[#0F6B46]/30" />
                <h2 className="font-heading text-3xl font-bold text-[#0D1B2A]">Best Sellers</h2>
                <div className="h-px w-12 bg-[#0F6B46]/30" />
              </div>
              <Link href="#all" className="text-sm font-semibold text-[#0F6B46] hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </BlurFade>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {products.map((product, idx) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center border-2 border-dashed border-[#0F6B46]/20 rounded-3xl">
              <p className="text-brand-gray">Products loading soon...</p>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white border-y border-[#0F6B46]/10">
        <div className="container mx-auto px-4 text-center">
          <BlurFade delay={0.1}>
            <h2 className="font-heading text-3xl font-bold text-[#0D1B2A] mb-12">Why Choose Satvam Wellness?</h2>
          </BlurFade>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: <Leaf />, title: "Authentic Ayurveda", desc: "Rooted in ancient wisdom" },
              { icon: <Recycle />, title: "100% Natural Herbs", desc: "Carefully selected" },
              { icon: <ShieldCheck />, title: "Trusted Quality", desc: "Lab tested for purity" },
              { icon: <HeartPulse />, title: "Made in India", desc: "Proudly made with love" },
            ].map((item, idx) => (
              <BlurFade key={idx} delay={0.2 + (idx * 0.1)}>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-[#F6F3EC] text-[#0F6B46] flex items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-[#0D1B2A] mb-2">{item.title}</h3>
                  <p className="text-sm text-brand-gray">{item.desc}</p>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="py-20 bg-[#0F6B46] text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#D4AF37] via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <BlurFade delay={0.1} className="max-w-md">
              <h2 className="font-heading text-3xl font-bold mb-4">Wellness Tips & Ayurveda Insights</h2>
              <p className="text-white/80">Stay updated with the latest health tips, Ayurveda knowledge and much more.</p>
            </BlurFade>
            <BlurFade delay={0.2}>
              <Link href="#blog" className="inline-flex mt-6 md:mt-0 items-center justify-center gap-2 bg-white text-[#0F6B46] px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform">
                Explore Blog <ArrowRight className="w-4 h-4" />
              </Link>
            </BlurFade>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              "5 Ayurvedic Ways to Boost Immunity Naturally",
              "Ashwagandha Benefits for Stress & Sleep",
              "Why Choose Natural Over Chemical Medicine"
            ].map((title, idx) => (
              <BlurFade key={idx} delay={0.3 + (idx * 0.1)}>
                <div className="bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur-md hover:bg-white/20 transition-colors cursor-pointer group">
                  <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#0D1B2A] mb-6">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-lg leading-tight group-hover:text-[#D4AF37] transition-colors">{title}</h3>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Component mapped to a static "fake" product ID or we just pass the brand string.
          Since the Reviews component requires a `productId`, we'll pass a generic brand ID for now 
          so it renders the 0-state. */}
      <ProductReviews productId="brand-satvam-wellness" />

    </div>
  );
}
