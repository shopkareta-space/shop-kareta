"use client";

import { useWishlistStore } from "@/store/wishlistStore";
import { WishlistCard } from "@/components/account/WishlistCard";
import { EmptyState } from "@/components/account/EmptyState";
import { Heart } from "lucide-react";
import BlurFade from "@/components/ui/blur-fade";

export default function WishlistPage() {
  const { items } = useWishlistStore();

  return (
    <div className="space-y-8">
      <BlurFade delay={0.1}>
        <div className="border-b border-brand-gray/10 pb-6">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-brand-blue mb-2">
            Wishlist
          </h1>
          <p className="text-brand-gray">
            Saved items you want to look at later.
          </p>
        </div>
      </BlurFade>

      <BlurFade delay={0.2}>
        {items.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {items.map((product) => (
              <WishlistCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState 
            icon={Heart}
            title="Your wishlist is empty"
            description="Save items you love and easily find them here when you're ready to buy."
            actionLabel="Discover Products"
            actionHref="/shop"
          />
        )}
      </BlurFade>
    </div>
  );
}
