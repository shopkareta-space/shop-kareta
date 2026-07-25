"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Loader2, CheckCircle2, ArrowLeft } from "lucide-react";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/lib/validations/auth";
import { motion } from "framer-motion";

export function ForgotPasswordForm() {
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="text-center"
      >
        <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-brand-green" />
        </div>
        <h3 className="font-heading text-2xl font-bold text-[#0D1B2A] mb-4">Check your email</h3>
        <p className="text-brand-gray mb-8 leading-relaxed">
          We've sent a password reset link to your email address. Please check your inbox and spam folder.
        </p>
        <div className="space-y-4">
          <button 
            type="button"
            className="w-full bg-white border border-brand-gray/20 hover:bg-brand-gray/5 text-[#0D1B2A] font-semibold py-3.5 px-4 rounded-xl transition-colors shadow-sm"
          >
            Resend Link
          </button>
          <Link 
            href="/login"
            className="w-full flex items-center justify-center gap-2 text-brand-gray hover:text-brand-blue font-medium py-3.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-[#0D1B2A] mb-1.5">Email Address</label>
        <input
          {...register("email")}
          type="email"
          placeholder="you@example.com"
          className="w-full px-4 py-3 rounded-xl border border-brand-gray/20 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-colors bg-white text-[#0D1B2A] placeholder:text-gray-400"
        />
        {errors.email && (
          <p className="mt-1.5 text-sm text-red-500 font-medium">{errors.email.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#0F6B46] hover:bg-[#148356] text-white font-semibold py-3.5 px-4 rounded-xl transition-colors shadow-sm flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          "Send Reset Link"
        )}
      </button>

      <div className="text-center mt-6">
        <Link 
          href="/login"
          className="inline-flex items-center gap-2 text-sm font-medium text-brand-gray hover:text-brand-blue transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </Link>
      </div>
    </form>
  );
}
