import Link from "next/link";
import { ArrowRight, Leaf, ShieldCheck, Sparkles, Tag } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";

// A fallback icon mapping
const getCategoryIcon = (slug: string) => {
  if (slug.includes('beauty') || slug.includes('skin') || slug.includes('hair')) return Sparkles;
  if (slug.includes('energy') || slug.includes('immune')) return Leaf;
  if (slug.includes('pain') || slug.includes('ortho')) return ShieldCheck;
  return Tag;
};

// Image mapping fallback
const getCategoryBanner = (slug: string) => {
  if (slug === 'cosmetics') return '/images/categories/cosmetics.png';
  if (slug === 'health-and-wellness') return '/images/categories/health-and-wellness.png';
  if (slug === 'ortho-care') return '/images/categories/ortho-care.png';
  return null;
};

// Colors mapping
const getCategoryColors = (index: number) => {
  const colors = [
    { bgHover: "group-hover:bg-[#0D1B2A]/60", bgIcon: "bg-brand-blue/5", textIcon: "text-white/30", badgeText: "text-[#0D1B2A]", bgOverlay: "bg-[#0D1B2A]/40" },
    { bgHover: "group-hover:bg-[#0F6B46]/60", bgIcon: "bg-brand-green/5", textIcon: "text-white/30", badgeText: "text-[#0F6B46]", bgOverlay: "bg-[#0F6B46]/40" },
    { bgHover: "group-hover:bg-amber-900/60", bgIcon: "bg-amber-900/5", textIcon: "text-white/30", badgeText: "text-amber-900", bgOverlay: "bg-amber-900/40" },
  ];
  return colors[index % colors.length];
};

interface CategoryShowcaseProps {
  featuredOnly?: boolean;
  searchQuery?: string;
}

export async function CategoryShowcase({ featuredOnly = false, searchQuery }: CategoryShowcaseProps) {
  const supabase = await createClient();
  
  // Fetch categories and get count of products for each category
  let query = supabase
    .from('categories')
    .select('*, products(id)')
    .eq('is_active', true)
    .order('display_order', { ascending: true })
    .order('name', { ascending: true });

  if (featuredOnly) {
    query = query.eq('featured', true);
  }

  if (searchQuery) {
    query = query.ilike('name', `%${searchQuery}%`);
  }

  const { data: categories, error } = await query;

  if (error || !categories) {
    return (
      <div className="text-center p-8 bg-red-50 text-red-600 rounded-2xl">
        Failed to load categories.
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center p-8 bg-brand-light text-brand-blue rounded-2xl border border-brand-gray/20">
        No categories found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category: any, index: number) => {
        const Icon = getCategoryIcon(category.slug);
        const colors = getCategoryColors(index);
        const productCount = category.products?.length || 0;
        
        return (
          <Link 
            key={category.id}
            href={`/shop?category=${category.slug}`} 
            className="group relative h-96 rounded-3xl overflow-hidden bg-brand-light flex flex-col justify-end p-8 transition-all duration-500"
          >
            {category.image_url || category.banner_url || getCategoryBanner(category.slug) ? (
              <Image 
                src={category.image_url || category.banner_url || getCategoryBanner(category.slug)!} 
                alt={category.name} 
                fill 
                className="object-cover absolute inset-0 z-0 group-hover:scale-105 transition-transform duration-700" 
              />
            ) : null}
            
            <div className={`absolute inset-0 ${colors.bgOverlay} ${colors.bgHover} transition-colors duration-500 z-10`} />
            
            {!(category.image_url || category.banner_url || getCategoryBanner(category.slug)) && (
              <div className={`absolute inset-0 flex items-center justify-center ${colors.textIcon} z-0 ${colors.bgIcon}`}>
                <Icon className="w-32 h-32 opacity-20" />
              </div>
            )}
            
            <div className="relative z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <span className={`bg-white ${colors.badgeText} text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4 inline-block`}>
                {productCount} {productCount === 1 ? 'Product' : 'Products'}
              </span>
              <h3 className="font-heading text-3xl font-bold text-white mb-2">{category.name}</h3>
              {category.description && (
                <p className="text-white/90 text-sm mb-4 line-clamp-2">{category.description}</p>
              )}
              <p className="text-white/80 flex items-center gap-2 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                Explore Collection <ArrowRight className="w-4 h-4" />
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
