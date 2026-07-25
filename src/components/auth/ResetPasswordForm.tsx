"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { resetPasswordSchema, type ResetPasswordFormData } from "@/lib/validations/auth";
import { PasswordStrength } from "./PasswordStrength";
import { motion } from "framer-motion";

export function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const passwordValue = useWatch({ control, name: "password" });

  const onSubmit = async (data: ResetPasswordFormData) => {
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
        <h3 className="font-heading text-2xl font-bold text-[#0D1B2A] mb-4">Password Reset Successfully</h3>
        <p className="text-brand-gray mb-8 leading-relaxed">
          Your password has been changed. You can now use your new password to sign in to your account.
        </p>
        <Link 
          href="/login"
          className="w-full inline-flex items-center justify-center bg-[#0F6B46] hover:bg-[#148356] text-white font-semibold py-3.5 px-4 rounded-xl transition-colors shadow-sm"
        >
          Sign In Now
        </Link>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-[#0D1B2A] mb-1.5">New Password</label>
        <div className="relative">
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-xl border border-brand-gray/20 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-colors bg-white text-[#0D1B2A] placeholder:text-gray-400 pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-gray transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        <PasswordStrength password={passwordValue} />
        {errors.password && <p className="mt-1.5 text-sm text-red-500 font-medium">{errors.password.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-[#0D1B2A] mb-1.5">Confirm New Password</label>
        <div className="relative">
          <input
            {...register("confirmPassword")}
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-xl border border-brand-gray/20 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-colors bg-white text-[#0D1B2A] placeholder:text-gray-400 pr-12"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-gray transition-colors"
            tabIndex={-1}
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.confirmPassword && <p className="mt-1.5 text-sm text-red-500 font-medium">{errors.confirmPassword.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#0F6B46] hover:bg-[#148356] text-white font-semibold py-3.5 px-4 rounded-xl transition-colors shadow-sm flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed mt-4"
      >
        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Reset Password"}
      </button>
    </form>
  );
}
