"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { slideUp, magneticSpring } from "@/lib/motion";
import Image from "next/image";

interface ProductCardProps {
  id: string;
  name: string;
  brand: string;
  category?: string;
  price: number;
  originalPrice?: number;
  images?: string[];
  imageAlt?: string;
  badge?: string;
}

export default function ProductCard({
  id,
  name,
  brand,
  category,
  price,
  originalPrice,
  images,
  badge,
}: ProductCardProps) {
  const primaryImage = images?.[0];
  return (
    <motion.div 
      variants={slideUp}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover={{ y: -6, boxShadow: "0 20px 40px -10px rgba(15, 107, 70, 0.08)" }}
      transition={magneticSpring}
      className="group flex flex-col bg-white rounded-2xl border border-brand-gray/10 overflow-hidden"
    >
      {/* Image Container */}
      <Link href={`/products/${id}`} className="relative w-full bg-[#F6F3EC] overflow-hidden block" style={{ aspectRatio: '16/9' }}>
        {primaryImage ? (
          <Image 
            src={primaryImage} 
            alt={name} 
            fill 
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
          />
        ) : (
          <motion.div 
            className="absolute inset-0 flex flex-col items-center justify-center text-brand-gray/30 transition-transform duration-700 ease-out group-hover:scale-105"
          >
            <div className="w-16 h-16 rounded-full bg-white/50 flex items-center justify-center mb-3 shadow-sm backdrop-blur-sm border border-white/20">
              <span className="font-heading font-medium text-2xl text-brand-gray/40">SK</span>
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium opacity-50">Placeholder</span>
          </motion.div>
        )}

        {badge && (
          <div className="absolute top-4 left-4 bg-[#D4AF37] text-[#0D1B2A] text-[10px] font-bold uppercase tracking-wider py-1.5 px-3 rounded-sm z-10 shadow-sm">
            {badge}
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase tracking-widest text-brand-gray font-medium">
            {brand}
          </span>
          {category && (
            <span className="text-[10px] uppercase tracking-wider text-[#0F6B46]/70 font-medium">
              {category}
            </span>
          )}
        </div>
        
        <Link href={`/products/${id}`} className="block mb-4">
          <motion.h3 
            className="font-heading font-semibold text-[#0D1B2A] text-lg leading-snug group-hover:text-[#0F6B46] transition-colors line-clamp-2"
          >
            {name}
          </motion.h3>
        </Link>

        <div className="mt-auto flex items-end justify-between pt-2">
          <div className="flex flex-col">
            {originalPrice && (
              <span className="text-xs text-brand-gray line-through mb-0.5">
                ₹{originalPrice.toFixed(2)}
              </span>
            )}
            <span className="font-semibold text-[#0D1B2A] text-xl">
              ₹{price.toFixed(2)}
            </span>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            transition={magneticSpring}
            aria-label="Add to cart"
            className="w-11 h-11 rounded-full bg-[#F6F3EC] flex items-center justify-center text-[#0F6B46] hover:bg-[#D4AF37] hover:text-[#0D1B2A] hover:shadow-md transition-colors"
          >
            <ShoppingCart className="w-4 h-4" strokeWidth={2.5} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
