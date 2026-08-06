import { create } from "zustand";

export interface Address {
  id: string;
  fullName: string;
  mobile: string;
  line1: string;
  line2?: string;
  landmark?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

interface AddressState {
  addresses: Address[];
  setAddresses: (addresses: Address[]) => void;
  addAddress: (address: Omit<Address, "id">) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

export const useAddressStore = create<AddressState>()(
  (set) => ({
    // Always starts empty — real data is fetched from Supabase (filtered by user_id)
    addresses: [],

    setAddresses: (addresses) => set({ addresses }),

    addAddress: (address) => set((state) => {
      const newAddress = { ...address, id: `addr_${Date.now()}` };

      let newAddresses = [...state.addresses];
      if (address.isDefault || newAddresses.length === 0) {
        newAddress.isDefault = true;
        newAddresses = newAddresses.map(a => ({ ...a, isDefault: false }));
      }

      return { addresses: [...newAddresses, newAddress] };
    }),

    updateAddress: (id, updatedFields) => set((state) => {
      let newAddresses = [...state.addresses];

      if (updatedFields.isDefault) {
        newAddresses = newAddresses.map(a => ({ ...a, isDefault: false }));
      }

      return {
        addresses: newAddresses.map((a) => (a.id === id ? { ...a, ...updatedFields } : a))
      };
    }),

    deleteAddress: (id) => set((state) => ({
      addresses: state.addresses.filter((a) => a.id !== id)
    })),

    setDefaultAddress: (id) => set((state) => ({
      addresses: state.addresses.map((a) => ({ ...a, isDefault: a.id === id }))
    }))
  })
);
