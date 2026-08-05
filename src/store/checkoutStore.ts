import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface AddressInfo {
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
}

export type DeliveryMethod = "standard" | "express";
export type PaymentMethod = "upi" | "card" | "netbanking" | "wallet" | "cod";

interface CheckoutState {
  // Data
  contact: ContactInfo | null;
  shippingAddress: AddressInfo | null;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod | null;
  
  // Actions
  setContact: (contact: ContactInfo) => void;
  setShippingAddress: (address: AddressInfo) => void;
  setDeliveryMethod: (method: DeliveryMethod) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  clearCheckout: () => void;
}

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      contact: null,
      shippingAddress: null,
      deliveryMethod: "standard",
      paymentMethod: "cod",

      setContact: (contact) => set({ contact }),
      setShippingAddress: (shippingAddress) => set({ shippingAddress }),
      setDeliveryMethod: (deliveryMethod) => set({ deliveryMethod }),
      setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
      
      clearCheckout: () => set({
        contact: null,
        shippingAddress: null,
        deliveryMethod: "standard",
        paymentMethod: null
      })
    }),
    {
      name: "shopkareta-checkout",
    }
  )
);
