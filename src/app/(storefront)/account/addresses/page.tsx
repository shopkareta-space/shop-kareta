"use client";

import { useAddressStore } from "@/store/addressStore";
import { AddressCard } from "@/components/account/AddressCard";
import { EmptyState } from "@/components/account/EmptyState";
import { MapPin, Plus } from "lucide-react";
import BlurFade from "@/components/ui/blur-fade";

export default function AddressesPage() {
  const { addresses } = useAddressStore();

  return (
    <div className="space-y-8">
      <BlurFade delay={0.1}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-brand-gray/10 pb-6">
          <div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-brand-blue mb-2">
              Saved Addresses
            </h1>
            <p className="text-brand-gray">
              Manage your delivery addresses for faster checkout.
            </p>
          </div>
          <button className="bg-[#0F6B46] hover:bg-[#148356] text-white font-semibold py-2.5 px-6 rounded-xl transition-colors shadow-sm flex items-center gap-2 shrink-0">
            <Plus className="w-5 h-5" /> Add New Address
          </button>
        </div>
      </BlurFade>

      <BlurFade delay={0.2}>
        {addresses.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {addresses.map((address) => (
              <AddressCard key={address.id} address={address} />
            ))}
          </div>
        ) : (
          <EmptyState 
            icon={MapPin}
            title="No addresses saved"
            description="You haven't added any shipping addresses yet. Add one now for a faster checkout experience."
          />
        )}
      </BlurFade>
    </div>
  );
}
