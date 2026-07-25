"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { QuantitySelector } from "@/components/storefront/QuantitySelector";
import { premiumSpring } from "@/lib/motion";

export function CartItemList() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-brand-gray/10 pb-4">
        <h2 className="font-heading text-xl font-bold text-brand-blue">
          Shopping Cart ({items.length} {items.length === 1 ? "Item" : "Items"})
        </h2>
      </div>

      <div className="flex flex-col gap-4">
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <motion.div
              key={`${item.product.id}-${item.variant || 'default'}`}
              layout
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, x: -20 }}
              transition={premiumSpring}
              className="bg-white border border-brand-gray/10 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row gap-6 group hover:border-brand-green/30 transition-colors"
            >
              {/* Product Image */}
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 shrink-0 bg-[#F6F3EC] rounded-xl overflow-hidden self-center sm:self-start border border-brand-gray/5">
                <Link href={`/products/${item.product.id}`}>
                  {item.product.images && item.product.images.length > 0 && !item.product.images[0].includes("placeholder") ? (
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-brand-gray/30">
                      <span className="font-heading font-medium text-lg text-brand-gray/40">SK</span>
                    </div>
                  )}
                </Link>
              </div>

              {/* Product Details & Actions */}
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex justify-between items-start gap-4 mb-2">
                  <div className="flex flex-col">
                    <Link href={`/products/${item.product.id}`}>
                      <h3 className="font-heading font-bold text-lg text-brand-blue hover:text-brand-green transition-colors truncate">
                        {item.product.name}
                      </h3>
                    </Link>
                    {item.variant && (
                      <span className="text-sm text-brand-gray mt-1">{item.variant}</span>
                    )}
                    {item.product.sku && (
                      <span className="text-xs text-brand-gray/60 mt-1 uppercase">SKU: {item.product.sku}</span>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-heading font-bold text-lg text-brand-blue block">
                      ₹{item.product.price.toFixed(2)}
                    </span>
                    {item.product.originalPrice && (
                      <span className="text-xs text-brand-gray line-through">
                        ₹{item.product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto pt-4">
                  <QuantitySelector 
                    quantity={item.quantity} 
                    onQuantityChange={(q) => updateQuantity(item.product.id, q, item.variant)}
                    max={10} 
                  />
                  
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-brand-blue hidden sm:inline-block">
                      Subtotal: ₹{(item.product.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeItem(item.product.id, item.variant)}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-brand-gray/60 hover:bg-red-50 hover:text-red-500 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
