"use client";

import Link from "next/link";
import { ShoppingCart, Trash2 } from "lucide-react";
import { type Product } from "@/data/products";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";

export function WishlistCard({ product }: { product: Product }) {
  const removeFromWishlist = useWishlistStore((state) => state.removeFromWishlist);
  const addItem = useCartStore((state) => state.addItem);

  const handleMoveToCart = () => {
    addItem(product, 1);
    removeFromWishlist(product.id);
  };

  return (
    <div className="group bg-white border border-brand-gray/10 rounded-3xl overflow-hidden hover:shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] hover:border-brand-gray/30 transition-all duration-300 flex flex-col sm:flex-row relative">
      {/* Product Image */}
      <Link href={`/products/${product.id}`} className="block sm:w-48 shrink-0 overflow-hidden bg-brand-gray/5 aspect-square sm:aspect-auto">
        <img
          src={product.images?.[0] || "/images/placeholder-main.jpg"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </Link>
      
      {/* Details */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start gap-4 mb-2">
          <div>
            <Link href={`/products/${product.id}`} className="inline-block">
              <h3 className="font-heading font-bold text-xl text-[#0D1B2A] group-hover:text-brand-green transition-colors line-clamp-2">
                {product.name}
              </h3>
            </Link>
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-green mt-1 block">
              {product.brand}
            </span>
          </div>
          
          <button 
            onClick={() => removeFromWishlist(product.id)}
            className="p-2 -mt-2 -mr-2 text-brand-gray/40 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors flex-shrink-0"
            title="Remove from wishlist"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-auto pt-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex items-end gap-3">
            <span className="font-heading font-bold text-2xl text-[#0D1B2A]">
              <span className="text-sm text-brand-gray/60 font-sans mr-0.5">₹</span>
              {product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-brand-gray line-through mb-1">
                ₹{product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          
          <button
            onClick={handleMoveToCart}
            className="bg-[#0D1B2A] hover:bg-[#0F6B46] text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm w-full sm:w-auto"
          >
            <ShoppingCart className="w-4 h-4" /> Move to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
