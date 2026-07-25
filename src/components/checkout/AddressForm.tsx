"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useCheckoutStore, AddressInfo } from "@/store/checkoutStore";
import { fadeUp, premiumSpring } from "@/lib/motion";
import { useEffect } from "react";

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
  const storedAddress = useCheckoutStore((state) => state.shippingAddress);
  const setShippingAddress = useCheckoutStore((state) => state.setShippingAddress);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<AddressInfo>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      addressLine1: "",
      addressLine2: "",
      landmark: "",
      city: "",
      state: "",
      pincode: ""
    }
  });

  useEffect(() => {
    if (storedAddress) {
      reset(storedAddress);
    }
  }, [storedAddress, reset]);

  const onSubmit = (data: AddressInfo) => {
    setShippingAddress(data);
    onNext();
  };

  return (
    <motion.div variants={fadeUp} initial="initial" animate="animate" exit="exit">
      <h2 className="font-heading text-2xl font-bold text-brand-blue mb-2">Shipping Address</h2>
      <p className="text-brand-gray text-sm mb-8">Where should we send your order?</p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        
        <div className="flex flex-col gap-1.5">
          <label htmlFor="addressLine1" className="text-xs font-semibold text-brand-blue uppercase tracking-wider">Address Line 1*</label>
          <input
            id="addressLine1"
            {...register("addressLine1")}
            className={`w-full bg-white border ${errors.addressLine1 ? 'border-red-500' : 'border-brand-gray/20'} rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/50 focus:border-brand-green transition-colors`}
            placeholder="House/Flat No., Building Name, Street"
            autoComplete="address-line1"
          />
          {errors.addressLine1 && <span className="text-xs text-red-500">{errors.addressLine1.message}</span>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="addressLine2" className="text-xs font-semibold text-brand-blue uppercase tracking-wider">Address Line 2 (Optional)</label>
          <input
            id="addressLine2"
            {...register("addressLine2")}
            className={`w-full bg-white border ${errors.addressLine2 ? 'border-red-500' : 'border-brand-gray/20'} rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/50 focus:border-brand-green transition-colors`}
            placeholder="Sector, Area, or Village"
            autoComplete="address-line2"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="landmark" className="text-xs font-semibold text-brand-blue uppercase tracking-wider">Landmark (Optional)</label>
          <input
            id="landmark"
            {...register("landmark")}
            className="w-full bg-white border border-brand-gray/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/50 focus:border-brand-green transition-colors"
            placeholder="E.g. Near Apollo Hospital"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="pincode" className="text-xs font-semibold text-brand-blue uppercase tracking-wider">PIN Code*</label>
            <input
              id="pincode"
              {...register("pincode")}
              maxLength={6}
              className={`w-full bg-white border ${errors.pincode ? 'border-red-500' : 'border-brand-gray/20'} rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/50 focus:border-brand-green transition-colors`}
              placeholder="110001"
              autoComplete="postal-code"
            />
            {errors.pincode && <span className="text-xs text-red-500">{errors.pincode.message}</span>}
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label htmlFor="city" className="text-xs font-semibold text-brand-blue uppercase tracking-wider">City*</label>
            <input
              id="city"
              {...register("city")}
              className={`w-full bg-white border ${errors.city ? 'border-red-500' : 'border-brand-gray/20'} rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/50 focus:border-brand-green transition-colors`}
              placeholder="New Delhi"
              autoComplete="address-level2"
            />
            {errors.city && <span className="text-xs text-red-500">{errors.city.message}</span>}
          </div>
        </div>

        <div className="flex flex-col gap-1.5 mb-4">
          <label htmlFor="state" className="text-xs font-semibold text-brand-blue uppercase tracking-wider">State*</label>
          <input
            id="state"
            {...register("state")}
            className={`w-full bg-white border ${errors.state ? 'border-red-500' : 'border-brand-gray/20'} rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/50 focus:border-brand-green transition-colors`}
            placeholder="Delhi"
            autoComplete="address-level1"
          />
          {errors.state && <span className="text-xs text-red-500">{errors.state.message}</span>}
        </div>

        <div className="flex items-center justify-between mt-4">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-medium text-brand-gray hover:text-brand-blue transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          
          <motion.button
            whileTap={{ scale: 0.98 }}
            transition={premiumSpring}
            type="submit"
            className="h-14 px-8 bg-brand-blue text-white rounded-full font-medium flex items-center justify-center gap-2 hover:bg-[#152a60] transition-colors shadow-sm"
          >
            <span>Continue to Delivery</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}
