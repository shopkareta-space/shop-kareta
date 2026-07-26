import { create } from "zustand";
import { persist } from "zustand/middleware";
import { products, type Product } from "@/data/products";

interface WishlistState {
  items: Product[];
  isLoading: boolean;
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      // Initialize with some mock data from our catalog
      items: [products[0], products[2]],
      isLoading: false,

      addToWishlist: (productId: string) => {
        const product = products.find((p) => p.id === productId);
        if (product && !get().items.some((p) => p.id === productId)) {
          set((state) => ({ items: [...state.items, product] }));
        }
      },

      removeFromWishlist: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },

      isInWishlist: (productId: string) => {
        return get().items.some((item) => item.id === productId);
      },
    }),
    {
      name: "shopkareta-wishlist",
    }
  )
);
