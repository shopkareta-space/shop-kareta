"use client";

import Image from "next/image";
import Link from "next/link";
import BlurFade from "@/components/ui/blur-fade";
import { ArrowRight } from "lucide-react";

interface BrandHeroProps {
  brandName: string;
  headline: React.ReactNode;
  subHeadline: string;
  bgClass: string;
  textClass: string;
  primaryCtaText?: string;
  secondaryCtaText?: string;
  imageSrc?: string;
  accentClass?: string;
  features?: { icon: React.ReactNode; title: string; desc: string }[];
}

export function BrandHero({
  brandName,
  headline,
  subHeadline,
  bgClass,
  textClass,
  primaryCtaText = "Shop Now",
  secondaryCtaText = "Explore Collection",
  imageSrc,
  accentClass = "bg-white text-black",
  features
}: BrandHeroProps) {
  return (
    <section className={`relative w-full pt-28 pb-20 overflow-hidden ${bgClass} ${textClass}`}>
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          
          <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
            <BlurFade delay={0.1}>
              <span className="uppercase tracking-widest text-sm font-semibold opacity-80 mb-4 block">
                {brandName}
              </span>
            </BlurFade>
            
            <BlurFade delay={0.2}>
              <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                {headline}
              </h1>
            </BlurFade>
            
            <BlurFade delay={0.3}>
              <p className="text-lg md:text-xl opacity-90 max-w-xl mb-10 leading-relaxed">
                {subHeadline}
              </p>
            </BlurFade>
            
            <BlurFade delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link 
                  href="#shop"
                  className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold transition-all hover:scale-105 ${accentClass}`}
                >
                  {primaryCtaText} <ArrowRight className="w-4 h-4" />
                </Link>
                <Link 
                  href="#explore"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold border-2 border-current hover:bg-white/10 transition-colors"
                >
                  {secondaryCtaText}
                </Link>
              </div>
            </BlurFade>

            {features && (
              <BlurFade delay={0.5}>
                <div className="flex flex-wrap gap-8 pt-8 border-t border-current/20">
                  {features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="opacity-80">{feature.icon}</div>
                      <div>
                        <div className="font-semibold text-sm">{feature.title}</div>
                        <div className="text-xs opacity-70">{feature.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </BlurFade>
            )}
          </div>

          <div className="w-full lg:w-1/2 relative">
            <BlurFade delay={0.3}>
              <div className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden bg-black/5 border border-white/10 flex items-center justify-center">
                {imageSrc ? (
                  <Image 
                    src={imageSrc}
                    alt={brandName}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="text-center opacity-50">
                    <span className="font-heading text-4xl">{brandName}</span>
                    <p className="text-sm mt-2 uppercase tracking-widest">Premium Presentation</p>
                  </div>
                )}
              </div>
            </BlurFade>
          </div>

        </div>
      </div>
    </section>
  );
}
