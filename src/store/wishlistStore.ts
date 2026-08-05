import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type Product } from "@/types/product";

interface WishlistState {
  items: Product[];
  isLoading: boolean;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      addToWishlist: (product: Product) => {
        if (!get().items.some((p) => p.id === product.id)) {
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
