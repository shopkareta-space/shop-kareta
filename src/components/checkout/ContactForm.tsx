"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useCheckoutStore, ContactInfo } from "@/store/checkoutStore";
import { fadeUp, premiumSpring } from "@/lib/motion";
import { useEffect } from "react";

const contactSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().regex(/^[0-9]{10}$/, "Please enter a valid 10-digit mobile number"),
});

interface ContactFormProps {
  onNext: () => void;
}

export function ContactForm({ onNext }: ContactFormProps) {
  const storedContact = useCheckoutStore((state) => state.contact);
  const setContact = useCheckoutStore((state) => state.setContact);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactInfo>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: ""
    }
  });

  // Hydrate form with stored data on mount
  useEffect(() => {
    if (storedContact) {
      reset(storedContact);
    }
  }, [storedContact, reset]);

  const onSubmit = (data: ContactInfo) => {
    setContact(data);
    onNext();
  };

  return (
    <motion.div variants={fadeUp} initial="initial" animate="animate" exit="exit">
      <h2 className="font-heading text-2xl font-bold text-brand-blue mb-2">Contact Information</h2>
      <p className="text-brand-gray text-sm mb-8">We&apos;ll use this to send order updates.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="firstName" className="text-xs font-semibold text-brand-blue uppercase tracking-wider">First Name</label>
            <input
              id="firstName"
              {...register("firstName")}
              className={`w-full bg-white border ${errors.firstName ? 'border-red-500' : 'border-brand-gray/20'} rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/50 focus:border-brand-green transition-colors`}
              placeholder="John"
              autoComplete="given-name"
            />
            {errors.firstName && <span className="text-xs text-red-500">{errors.firstName.message}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="lastName" className="text-xs font-semibold text-brand-blue uppercase tracking-wider">Last Name</label>
            <input
              id="lastName"
              {...register("lastName")}
              className={`w-full bg-white border ${errors.lastName ? 'border-red-500' : 'border-brand-gray/20'} rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/50 focus:border-brand-green transition-colors`}
              placeholder="Doe"
              autoComplete="family-name"
            />
            {errors.lastName && <span className="text-xs text-red-500">{errors.lastName.message}</span>}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-xs font-semibold text-brand-blue uppercase tracking-wider">Email Address</label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className={`w-full bg-white border ${errors.email ? 'border-red-500' : 'border-brand-gray/20'} rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/50 focus:border-brand-green transition-colors`}
            placeholder="john@example.com"
            autoComplete="email"
          />
          {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
        </div>

        <div className="flex flex-col gap-1.5 mb-4">
          <label htmlFor="phone" className="text-xs font-semibold text-brand-blue uppercase tracking-wider">Mobile Number</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray text-sm">+91</span>
            <input
              id="phone"
              type="tel"
              {...register("phone")}
              className={`w-full bg-white border ${errors.phone ? 'border-red-500' : 'border-brand-gray/20'} rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/50 focus:border-brand-green transition-colors`}
              placeholder="9876543210"
              maxLength={10}
              autoComplete="tel-national"
            />
          </div>
          {errors.phone && <span className="text-xs text-red-500">{errors.phone.message}</span>}
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          transition={premiumSpring}
          type="submit"
          className="w-full sm:w-auto self-end h-14 px-8 bg-brand-blue text-white rounded-full font-medium flex items-center justify-center gap-2 hover:bg-[#152a60] transition-colors shadow-sm"
        >
          <span>Continue to Shipping</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </form>
    </motion.div>
  );
}
