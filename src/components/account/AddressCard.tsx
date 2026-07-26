"use client";

import { MapPin, Phone, Edit2, Trash2, CheckCircle2 } from "lucide-react";
import type { Address } from "@/store/addressStore";
import { useAddressStore } from "@/store/addressStore";

interface AddressCardProps {
  address: Address;
  onEdit?: () => void;
}

export function AddressCard({ address, onEdit }: AddressCardProps) {
  const { deleteAddress, setDefaultAddress } = useAddressStore();

  return (
    <div className={`relative bg-white border ${address.isDefault ? 'border-brand-green bg-brand-green/5 shadow-sm' : 'border-brand-gray/10 hover:border-brand-gray/30'} rounded-3xl p-6 transition-all`}>
      {address.isDefault && (
        <div className="absolute top-6 right-6 flex items-center gap-1.5 text-brand-green text-xs font-bold uppercase tracking-wider bg-brand-green/10 px-3 py-1 rounded-full">
          <CheckCircle2 className="w-4 h-4" /> Default
        </div>
      )}
      
      <div className="mb-4 pr-24">
        <h3 className="font-heading font-bold text-lg text-brand-blue">{address.fullName}</h3>
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="flex gap-3 text-brand-gray text-sm">
          <MapPin className="w-5 h-5 shrink-0 text-brand-gray/50" />
          <p className="leading-relaxed">
            {address.line1}
            {address.line2 && <><br />{address.line2}</>}
            {address.landmark && <><br />Landmark: {address.landmark}</>}
            <br />
            {address.city}, {address.state} {address.postalCode}
            <br />
            {address.country}
          </p>
        </div>
        
        <div className="flex gap-3 text-brand-gray text-sm items-center">
          <Phone className="w-5 h-5 shrink-0 text-brand-gray/50" />
          <p>{address.mobile}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-brand-gray/10">
        <button 
          onClick={onEdit}
          className="text-sm font-semibold text-brand-blue hover:text-brand-green transition-colors px-3 py-1.5 -ml-3"
        >
          <span className="flex items-center gap-2"><Edit2 className="w-4 h-4" /> Edit</span>
        </button>
        <button 
          onClick={() => deleteAddress(address.id)}
          className="text-sm font-semibold text-brand-gray hover:text-red-500 transition-colors px-3 py-1.5"
        >
          <span className="flex items-center gap-2"><Trash2 className="w-4 h-4" /> Delete</span>
        </button>
        {!address.isDefault && (
          <button 
            onClick={() => setDefaultAddress(address.id)}
            className="text-sm font-semibold text-brand-green hover:text-[#0F6B46] transition-colors ml-auto px-3 py-1.5 bg-brand-green/10 rounded-lg"
          >
            Set as Default
          </button>
        )}
      </div>
    </div>
  );
}
