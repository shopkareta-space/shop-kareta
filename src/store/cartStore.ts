import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/data/products";

export interface CartItem {
  product: Product;
  quantity: number;
  variant?: string; // Optional if product has variants selected
}

interface CartState {
  items: CartItem[];
  coupon: { code: string; discountPercent: number } | null;
  
  // Actions
  addItem: (product: Product, quantity: number, variant?: string) => void;
  removeItem: (productId: string, variant?: string) => void;
  updateQuantity: (productId: string, quantity: number, variant?: string) => void;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  clearCart: () => void;
  
  // Computed (these will be derived in components, but we keep the types clean)
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      coupon: null,

      addItem: (product, quantity, variant) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.product.id === product.id && item.variant === variant
          );

          if (existingItemIndex >= 0) {
            // Update quantity if item already exists
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity += quantity;
            return { items: newItems };
          } else {
            // Add new item
            return { items: [...state.items, { product, quantity, variant }] };
          }
        });
      },

      removeItem: (productId, variant) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.product.id === productId && item.variant === variant)
          ),
        }));
      },

      updateQuantity: (productId, quantity, variant) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.product.id === productId && item.variant === variant) {
              return { ...item, quantity };
            }
            return item;
          }),
        }));
      },

      applyCoupon: async (code) => {
        // Mock API call
        return new Promise((resolve) => {
          setTimeout(() => {
            if (code.toUpperCase() === "KARETA10") {
              set({ coupon: { code: "KARETA10", discountPercent: 10 } });
              resolve(true);
            } else {
              resolve(false);
            }
          }, 800);
        });
      },

      removeCoupon: () => {
        set({ coupon: null });
      },

      clearCart: () => {
        set({ items: [], coupon: null });
      },
    }),
    {
      name: "shopkareta-cart",
      // Optional: partialize to only save specific fields if needed
    }
  )
);
