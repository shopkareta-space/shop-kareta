"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { addressService, SavedAddress } from "@/lib/services/address.service";
import { AddressCard } from "@/components/account/AddressCard";
import { EmptyState } from "@/components/account/EmptyState";
import { MapPin, Plus, Loader2, X } from "lucide-react";
import BlurFade from "@/components/ui/blur-fade";
import { motion, AnimatePresence } from "framer-motion";

interface AddressFormState {
  full_name: string;
  mobile: string;
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
}

const EMPTY_FORM: AddressFormState = {
  full_name: "",
  mobile: "",
  addressLine1: "",
  addressLine2: "",
  landmark: "",
  city: "",
  state: "",
  pincode: "",
  is_default: false,
};

export default function AddressesPage() {
  const { user } = useAuthStore();
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null);
  const [form, setForm] = useState<AddressFormState>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAddresses = useCallback(async () => {
    if (!user?.id) return;
    setIsLoading(true);
    const data = await addressService.getAddresses(user.id);
    setAddresses(data);
    setIsLoading(false);
  }, [user?.id]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const openAddForm = () => {
    setEditingAddress(null);
    setForm(EMPTY_FORM);
    setError(null);
    setShowForm(true);
  };

  const openEditForm = (address: SavedAddress) => {
    setEditingAddress(address);
    setForm({
      full_name: address.full_name,
      mobile: address.mobile,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || "",
      landmark: address.landmark || "",
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      is_default: address.is_default,
    });
    setError(null);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    setIsSaving(true);
    setError(null);

    try {
      if (editingAddress) {
        await addressService.updateAddress(user.id, editingAddress.id, form);
      } else {
        await addressService.addAddress(user.id, {
          ...form,
          // If it's the first address, auto-set as default
          is_default: addresses.length === 0 ? true : form.is_default,
        });
      }
      setShowForm(false);
      await fetchAddresses();
    } catch (err: any) {
      setError(err.message || "Failed to save address.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (addressId: string) => {
    if (!user?.id) return;
    try {
      await addressService.deleteAddress(user.id, addressId);
      await fetchAddresses();
    } catch (err: any) {
      console.error("Failed to delete address:", err);
    }
  };

  const handleSetDefault = async (addressId: string) => {
    if (!user?.id) return;
    try {
      await addressService.updateAddress(user.id, addressId, { is_default: true });
      await fetchAddresses();
    } catch (err: any) {
      console.error("Failed to set default address:", err);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-brand-gray/20 focus:outline-none focus:border-[#0F6B46] focus:ring-1 focus:ring-[#0F6B46] transition-colors bg-white text-[#0D1B2A] placeholder:text-gray-400 text-sm";
  const labelClass = "block text-sm font-medium text-[#0D1B2A] mb-1.5";

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
          <button
            onClick={openAddForm}
            className="bg-[#0F6B46] hover:bg-[#148356] text-white font-semibold py-2.5 px-6 rounded-xl transition-colors shadow-sm flex items-center gap-2 shrink-0"
          >
            <Plus className="w-5 h-5" /> Add New Address
          </button>
        </div>
      </BlurFade>

      <BlurFade delay={0.2}>
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-[#0F6B46]" />
          </div>
        ) : addresses.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {addresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                onEdit={() => openEditForm(address)}
                onDelete={() => handleDelete(address.id)}
                onSetDefault={() => handleSetDefault(address.id)}
              />
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

      {/* Add / Edit Address Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-brand-gray/10">
                <h2 className="font-heading text-xl font-bold text-brand-blue">
                  {editingAddress ? "Edit Address" : "Add New Address"}
                </h2>
                <button onClick={() => setShowForm(false)} className="text-brand-gray hover:text-brand-blue transition-colors p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Full Name</label>
                    <input required className={inputClass} placeholder="John Doe" value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} />
                  </div>
                  <div>
                    <label className={labelClass}>Mobile Number</label>
                    <input required className={inputClass} placeholder="9876543210" value={form.mobile} onChange={e => setForm(f => ({ ...f, mobile: e.target.value }))} />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Address Line 1</label>
                  <input required className={inputClass} placeholder="House No., Street Name" value={form.addressLine1} onChange={e => setForm(f => ({ ...f, addressLine1: e.target.value }))} />
                </div>

                <div>
                  <label className={labelClass}>Address Line 2 <span className="text-brand-gray/50 font-normal">(Optional)</span></label>
                  <input className={inputClass} placeholder="Apartment, Floor, etc." value={form.addressLine2} onChange={e => setForm(f => ({ ...f, addressLine2: e.target.value }))} />
                </div>

                <div>
                  <label className={labelClass}>Landmark <span className="text-brand-gray/50 font-normal">(Optional)</span></label>
                  <input className={inputClass} placeholder="Near landmark" value={form.landmark} onChange={e => setForm(f => ({ ...f, landmark: e.target.value }))} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>City</label>
                    <input required className={inputClass} placeholder="Mumbai" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
                  </div>
                  <div>
                    <label className={labelClass}>State</label>
                    <input required className={inputClass} placeholder="Maharashtra" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} />
                  </div>
                  <div>
                    <label className={labelClass}>Pincode</label>
                    <input required className={inputClass} placeholder="400001" value={form.pincode} onChange={e => setForm(f => ({ ...f, pincode: e.target.value }))} />
                  </div>
                </div>

                {addresses.length > 0 && (
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-[#0F6B46] rounded"
                      checked={form.is_default}
                      onChange={e => setForm(f => ({ ...f, is_default: e.target.checked }))}
                    />
                    <span className="text-sm font-medium text-[#0D1B2A]">Set as default address</span>
                  </label>
                )}

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
                    {error}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-3 px-4 rounded-xl border border-brand-gray/20 font-semibold text-brand-gray hover:bg-brand-gray/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 py-3 px-4 rounded-xl bg-[#0F6B46] hover:bg-[#148356] text-white font-semibold transition-colors flex items-center justify-center disabled:opacity-70"
                  >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : editingAddress ? "Save Changes" : "Add Address"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
