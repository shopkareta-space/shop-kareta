"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Plus, MapPin, Check, Edit2, Trash2 } from "lucide-react";
import { useCheckoutStore, AddressInfo } from "@/store/checkoutStore";
import { useAuthStore } from "@/store/authStore";
import { fadeUp } from "@/lib/motion";
import { useEffect, useState } from "react";
import { addressService, SavedAddress } from "@/lib/services/address.service";

const addressSchema = z.object({
  addressLine1: z.string().min(5, "Address must be at least 5 characters"),
  addressLine2: z.string().optional(),
  landmark: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().regex(/^[0-9]{6}$/, "Please enter a valid 6-digit PIN code"),
});

interface AddressFormProps {
  onNext: () => void;
  onBack: () => void;
}

export function AddressForm({ onNext, onBack }: AddressFormProps) {
  const { user } = useAuthStore();
  const storedAddress = useCheckoutStore((state) => state.shippingAddress);
  const setShippingAddress = useCheckoutStore((state) => state.setShippingAddress);
  const contact = useCheckoutStore((state) => state.contact);

  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  useEffect(() => {
    async function loadAddresses() {
      if (user) {
        setIsLoadingAddresses(true);
        try {
          const addresses = await addressService.getAddresses(user.id);
          setSavedAddresses(addresses);
          
          // Auto-select if we have a stored address that matches a saved one
          if (storedAddress) {
            const match = addresses.find(a => 
              a.addressLine1 === storedAddress.addressLine1 && 
              a.pincode === storedAddress.pincode
            );
            if (match) {
              setSelectedAddressId(match.id);
            }
          } else if (addresses.length > 0) {
            // Auto-select default address
            const def = addresses.find(a => a.is_default) || addresses[0];
            setSelectedAddressId(def.id);
          }
        } catch (error) {
          console.error("Failed to load addresses", error);
        } finally {
          setIsLoadingAddresses(false);
        }
      } else {
        setIsLoadingAddresses(false);
        setIsAddingNew(true); // Force new address mode for guests
      }
    }
    loadAddresses();
  }, [user, storedAddress]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset
  } = useForm<AddressInfo>({
    resolver: zodResolver(addressSchema),
    defaultValues: storedAddress || {
      addressLine1: "",
      addressLine2: "",
      landmark: "",
      city: "",
      state: "",
      pincode: ""
    }
  });

  const pincode = watch("pincode");
  const [isFetchingPincode, setIsFetchingPincode] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [saveToBook, setSaveToBook] = useState(true);

  useEffect(() => {
    async function fetchPincodeDetails() {
      if (pincode?.length === 6) {
        setIsFetchingPincode(true);
        try {
          const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
          const data = await res.json();
          if (data && data[0]?.Status === "Success") {
            const postOffice = data[0].PostOffice[0];
            setValue("city", postOffice.District, { shouldValidate: true });
            setValue("state", postOffice.State, { shouldValidate: true });
          }
        } catch (error) {
          console.error("Failed to fetch pincode details:", error);
        } finally {
          setIsFetchingPincode(false);
        }
      }
    }
    fetchPincodeDetails();
  }, [pincode, setValue]);

  const onSubmitNewAddress = async (data: AddressInfo) => {
    if (user && saveToBook) {
      setIsSavingAddress(true);
      try {
        await addressService.addAddress(user.id, {
          ...data,
          full_name: contact?.firstName + " " + (contact?.lastName || ""),
          mobile: contact?.phone || "",
          is_default: savedAddresses.length === 0, // make default if it's the first one
        });
        // Reload addresses and switch back to selection view
        const addresses = await addressService.getAddresses(user.id);
        setSavedAddresses(addresses);
        setIsAddingNew(false);
        
        // Auto select the new one
        const newest = addresses[0]; // assuming sorted by created_at desc
        setSelectedAddressId(newest.id);
        setShippingAddress(newest);
      } catch (error) {
        console.error("Failed to save address", error);
        // Fallback: just proceed with the address in store
        setShippingAddress(data);
        onNext();
      } finally {
        setIsSavingAddress(false);
      }
    } else {
      setShippingAddress(data);
      onNext();
    }
  };

  const handleSelectAddress = () => {
    if (selectedAddressId) {
      const selected = savedAddresses.find(a => a.id === selectedAddressId);
      if (selected) {
        // Map SavedAddress back to AddressInfo for the store
        setShippingAddress({
          addressLine1: selected.addressLine1,
          addressLine2: selected.addressLine2,
          landmark: selected.landmark,
          city: selected.city,
          state: selected.state,
          pincode: selected.pincode
        });
        onNext();
      }
    }
  };

  return (
    <motion.div variants={fadeUp} initial="initial" animate="animate" exit="exit" className="flex flex-col h-full min-h-[400px]">
      <div className="flex-grow">
        <h2 className="font-heading text-2xl font-bold text-brand-blue mb-2">Shipping Address</h2>
        <p className="text-brand-gray text-sm mb-8">Where should we send your order?</p>

        {isLoadingAddresses ? (
          <div className="flex justify-center items-center py-10">
            <div className="w-6 h-6 border-2 border-brand-green/30 border-t-brand-green rounded-full animate-spin" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {!isAddingNew && savedAddresses.length > 0 ? (
              <motion.div key="address-list" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <div className="flex flex-col gap-4 mb-6">
                  {savedAddresses.map((addr) => (
                    <div 
                      key={addr.id} 
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all ${selectedAddressId === addr.id ? 'border-brand-green bg-brand-green/5' : 'border-brand-gray/10 hover:border-brand-green/30'}`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedAddressId === addr.id ? 'border-brand-green' : 'border-brand-gray/30'}`}>
                            {selectedAddressId === addr.id && <div className="w-2.5 h-2.5 bg-brand-green rounded-full" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-brand-blue">{addr.full_name}</span>
                              {addr.is_default && (
                                <span className="text-[10px] uppercase tracking-wider font-bold bg-brand-green/10 text-brand-green px-2 py-0.5 rounded-full">Default</span>
                              )}
                            </div>
                            <p className="text-sm text-brand-gray leading-relaxed">
                              {addr.addressLine1} {addr.addressLine2 && `, ${addr.addressLine2}`}<br />
                              {addr.city}, {addr.state} - {addr.pincode}
                            </p>
                            <p className="text-sm font-medium text-brand-blue mt-2">Mobile: {addr.mobile}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button 
                  onClick={() => setIsAddingNew(true)}
                  className="flex items-center gap-2 text-brand-green font-semibold text-sm hover:text-brand-green-dark transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add New Address
                </button>
              </motion.div>
            ) : (
              <motion.form key="new-address-form" onSubmit={handleSubmit(onSubmitNewAddress)} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-5">
                {savedAddresses.length > 0 && (
                  <button type="button" onClick={() => setIsAddingNew(false)} className="flex items-center gap-1.5 text-brand-blue text-sm font-medium w-fit hover:text-brand-green transition-colors mb-2">
                    <ArrowLeft className="w-4 h-4" /> Back to saved addresses
                  </button>
                )}
                
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="addressLine1" className="text-xs font-semibold text-brand-blue uppercase tracking-wider">Address Line 1*</label>
                  <input
                    id="addressLine1"
                    {...register("addressLine1")}
                    className={`w-full bg-white border ${errors.addressLine1 ? 'border-red-500' : 'border-brand-gray/20'} rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/50 focus:border-brand-green transition-colors`}
                    placeholder="House/Flat No., Building Name, Street"
                  />
                  {errors.addressLine1 && <p className="text-red-500 text-xs">{errors.addressLine1.message}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="addressLine2" className="text-xs font-semibold text-brand-blue uppercase tracking-wider">Address Line 2 (Optional)</label>
                  <input
                    id="addressLine2"
                    {...register("addressLine2")}
                    className="w-full bg-white border border-brand-gray/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/50 focus:border-brand-green transition-colors"
                    placeholder="Locality, Area, Sector"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="pincode" className="text-xs font-semibold text-brand-blue uppercase tracking-wider">PIN Code*</label>
                    <div className="relative">
                      <input
                        id="pincode"
                        {...register("pincode")}
                        maxLength={6}
                        className={`w-full bg-white border ${errors.pincode ? 'border-red-500' : 'border-brand-gray/20'} rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/50 focus:border-brand-green transition-colors`}
                        placeholder="6-digit PIN"
                      />
                      {isFetchingPincode && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <div className="w-4 h-4 border-2 border-brand-green/30 border-t-brand-green rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                    {errors.pincode && <p className="text-red-500 text-xs">{errors.pincode.message}</p>}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="landmark" className="text-xs font-semibold text-brand-blue uppercase tracking-wider">Landmark (Optional)</label>
                    <input
                      id="landmark"
                      {...register("landmark")}
                      className="w-full bg-white border border-brand-gray/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/50 focus:border-brand-green transition-colors"
                      placeholder="e.g. Near Apollo Hospital"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="city" className="text-xs font-semibold text-brand-blue uppercase tracking-wider">City*</label>
                    <input
                      id="city"
                      {...register("city")}
                      className={`w-full bg-white border ${errors.city ? 'border-red-500' : 'border-brand-gray/20'} rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/50 focus:border-brand-green transition-colors`}
                      placeholder="City Name"
                    />
                    {errors.city && <p className="text-red-500 text-xs">{errors.city.message}</p>}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="state" className="text-xs font-semibold text-brand-blue uppercase tracking-wider">State*</label>
                    <input
                      id="state"
                      {...register("state")}
                      className={`w-full bg-white border ${errors.state ? 'border-red-500' : 'border-brand-gray/20'} rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/50 focus:border-brand-green transition-colors`}
                      placeholder="State Name"
                    />
                    {errors.state && <p className="text-red-500 text-xs">{errors.state.message}</p>}
                  </div>
                </div>

                {user && (
                  <label className="flex items-center gap-3 mt-2 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${saveToBook ? 'bg-brand-green border-brand-green' : 'border-brand-gray/30 group-hover:border-brand-green'}`}>
                      {saveToBook && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className="text-sm font-medium text-brand-blue">Save this address to my account</span>
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={saveToBook} 
                      onChange={(e) => setSaveToBook(e.target.checked)} 
                    />
                  </label>
                )}
                
                {/* Hidden submit button to trigger form via parent logic if needed, but we handle it manually */}
                <button id="submitNewAddressBtn" type="submit" className="hidden" />
              </motion.form>
            )}
          </AnimatePresence>
        )}
      </div>

      <div className="pt-8 mt-auto flex items-center justify-between border-t border-brand-gray/10">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-brand-gray hover:text-brand-blue font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        
        {!isAddingNew && savedAddresses.length > 0 ? (
          <button
            type="button"
            onClick={handleSelectAddress}
            disabled={!selectedAddressId}
            className="flex items-center gap-2 bg-brand-green text-white px-8 py-3.5 rounded-full font-semibold hover:bg-brand-green-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => document.getElementById('submitNewAddressBtn')?.click()}
            disabled={isSavingAddress}
            className="flex items-center gap-2 bg-brand-green text-white px-8 py-3.5 rounded-full font-semibold hover:bg-brand-green-dark transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSavingAddress ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>
    </motion.div>
  );
}
