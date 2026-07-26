"use client";

import Image from "next/image";
import Link from "next/link";
import BlurFade from "@/components/ui/blur-fade";

export interface BrandCategory {
  title: string;
  description: string;
  iconSrc?: string;
  colorClass?: string;
}

interface BrandCategoriesProps {
  title: string;
  categories: BrandCategory[];
  accentColorClass?: string;
}

export function BrandCategories({ title, categories, accentColorClass = "text-brand-green" }: BrandCategoriesProps) {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        
        <div className="flex flex-col items-center mb-16 text-center">
          <BlurFade delay={0.1}>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-12 bg-brand-gray/20" />
              <h2 className={`font-heading text-2xl md:text-3xl font-bold ${accentColorClass}`}>
                {title}
              </h2>
              <div className="h-px w-12 bg-brand-gray/20" />
            </div>
          </BlurFade>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {categories.map((category, idx) => (
            <BlurFade key={category.title} delay={0.1 + (idx * 0.1)}>
              <Link 
                href="#shop" 
                className="group flex flex-col items-center text-center space-y-4 p-4 rounded-2xl hover:bg-brand-gray/5 transition-colors"
              >
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-2 shadow-sm transition-transform group-hover:scale-110 ${category.colorClass || "bg-brand-light"}`}>
                  {category.iconSrc ? (
                    <Image src={category.iconSrc} alt={category.title} width={40} height={40} className="w-10 h-10 object-contain opacity-80 group-hover:opacity-100" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-brand-gray/20" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#0D1B2A] mb-1 group-hover:text-brand-green transition-colors">{category.title}</h3>
                  <p className="text-[10px] text-brand-gray">{category.description}</p>
                </div>
              </Link>
            </BlurFade>
          ))}
        </div>

      </div>
    </section>
  );
}
