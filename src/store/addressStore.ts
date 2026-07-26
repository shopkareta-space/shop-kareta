import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  addAddress: (address: Omit<Address, "id">) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

const MOCK_ADDRESSES: Address[] = [
  {
    id: "addr_1",
    fullName: "Demo User",
    mobile: "9876543210",
    line1: "123 Wellness Avenue",
    line2: "Apt 4B",
    landmark: "Near Central Park",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400001",
    country: "India",
    isDefault: true,
  }
];

export const useAddressStore = create<AddressState>()(
  persist(
    (set) => ({
      addresses: MOCK_ADDRESSES,

      addAddress: (address) => set((state) => {
        const newAddress = { ...address, id: `addr_${Date.now()}` };
        
        // If it's the first address or set to default, make others non-default
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
    }),
    {
      name: "shopkareta-addresses",
    }
  )
);
