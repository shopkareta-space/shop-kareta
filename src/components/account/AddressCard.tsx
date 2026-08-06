"use client";

import { MapPin, Phone, Edit2, Trash2, CheckCircle2 } from "lucide-react";
import type { SavedAddress } from "@/lib/services/address.service";

interface AddressCardProps {
  address: SavedAddress;
  onEdit?: () => void;
  onDelete?: () => void;
  onSetDefault?: () => void;
}

export function AddressCard({ address, onEdit, onDelete, onSetDefault }: AddressCardProps) {
  return (
    <div className={`relative bg-white border ${address.is_default ? 'border-[#0F6B46] bg-[#0F6B46]/5 shadow-sm' : 'border-brand-gray/10 hover:border-brand-gray/30'} rounded-3xl p-6 transition-all`}>
      {address.is_default && (
        <div className="absolute top-6 right-6 flex items-center gap-1.5 text-[#0F6B46] text-xs font-bold uppercase tracking-wider bg-[#0F6B46]/10 px-3 py-1 rounded-full">
          <CheckCircle2 className="w-4 h-4" /> Default
        </div>
      )}
      
      <div className="mb-4 pr-24">
        <h3 className="font-heading font-bold text-lg text-brand-blue">{address.full_name}</h3>
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="flex gap-3 text-brand-gray text-sm">
          <MapPin className="w-5 h-5 shrink-0 text-brand-gray/50" />
          <p className="leading-relaxed">
            {address.addressLine1}
            {address.addressLine2 && <><br />{address.addressLine2}</>}
            {address.landmark && <><br />Landmark: {address.landmark}</>}
            <br />
            {address.city}, {address.state} {address.pincode}
            <br />
            India
          </p>
        </div>
        
        <div className="flex gap-3 text-brand-gray text-sm items-center">
          <Phone className="w-5 h-5 shrink-0 text-brand-gray/50" />
          <p>{address.mobile}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-brand-gray/10">
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-sm font-semibold text-brand-blue hover:text-[#0F6B46] transition-colors px-3 py-1.5 -ml-3"
          >
            <span className="flex items-center gap-2"><Edit2 className="w-4 h-4" /> Edit</span>
          </button>
        )}
        {onDelete && (
          <button
            onClick={onDelete}
            className="text-sm font-semibold text-brand-gray hover:text-red-500 transition-colors px-3 py-1.5"
          >
            <span className="flex items-center gap-2"><Trash2 className="w-4 h-4" /> Delete</span>
          </button>
        )}
        {!address.is_default && onSetDefault && (
          <button
            onClick={onSetDefault}
            className="text-sm font-semibold text-[#0F6B46] hover:text-[#148356] transition-colors ml-auto px-3 py-1.5 bg-[#0F6B46]/10 rounded-lg"
          >
            Set as Default
          </button>
        )}
      </div>
    </div>
  );
}
