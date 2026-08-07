"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { registerSchema, type RegisterFormData } from "@/lib/validations/auth";
import { useAuthStore } from "@/store/authStore";
import { PasswordStrength } from "./PasswordStrength";
import { createClient } from "@/lib/supabase/client";

import { OTPVerification } from "./OTPVerification";

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // OTP Verification State
  const [verificationEmail, setVerificationEmail] = useState<string | null>(null);

  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const passwordValue = useWatch({ control, name: "password" });

  const onSubmit = async (data: RegisterFormData) => {
    const supabase = createClient();
    
    const { error, data: authData } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        data: {
          full_name: data.fullName,
          mobile: data.mobile || null,
          avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.fullName)}`,
        }
      }
    });

    if (error) {
      return setError("root", { type: "manual", message: error.message });
    }
    
    // Switch to OTP Verification UI
    setVerificationEmail(data.email);
  };

  const handleVerificationSuccess = () => {
    router.push("/");
    router.refresh();
  };

  if (verificationEmail) {
    return (
      <OTPVerification 
        email={verificationEmail}
        type="signup"
        onSuccess={handleVerificationSuccess}
        onCancel={() => router.push("/login")}
        onChangeEmail={() => setVerificationEmail(null)}
      />
    );
  }


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-[#0D1B2A] mb-1.5">Full Name</label>
        <input
          {...register("fullName")}
          type="text"
          placeholder="John Doe"
          className="w-full px-4 py-3 rounded-xl border border-brand-gray/20 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-colors bg-white text-[#0D1B2A] placeholder:text-gray-400"
        />
        {errors.fullName && <p className="mt-1.5 text-sm text-red-500 font-medium">{errors.fullName.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-[#0D1B2A] mb-1.5">Email Address</label>
          <input
            {...register("email")}
            type="email"
            placeholder="you@example.com"
            className="w-full px-4 py-3 rounded-xl border border-brand-gray/20 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-colors bg-white text-[#0D1B2A] placeholder:text-gray-400"
          />
          {errors.email && <p className="mt-1.5 text-sm text-red-500 font-medium">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-[#0D1B2A] mb-1.5">Mobile Number (Optional)</label>
          <input
            {...register("mobile")}
            type="tel"
            placeholder="9876543210"
            className="w-full px-4 py-3 rounded-xl border border-brand-gray/20 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-colors bg-white text-[#0D1B2A] placeholder:text-gray-400"
          />
          {errors.mobile && <p className="mt-1.5 text-sm text-red-500 font-medium">{errors.mobile.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#0D1B2A] mb-1.5">Password</label>
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
        <label className="block text-sm font-medium text-[#0D1B2A] mb-1.5">Confirm Password</label>
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

      <div className="pt-2">
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            {...register("acceptTerms")}
            type="checkbox"
            className="mt-1 w-4 h-4 rounded border-brand-gray/30 text-brand-green focus:ring-brand-green cursor-pointer accent-brand-green shrink-0"
          />
          <span className="text-sm text-brand-gray group-hover:text-[#0D1B2A] transition-colors leading-relaxed">
            I agree to the <Link href="/terms" className="text-brand-green hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-brand-green hover:underline">Privacy Policy</Link>.
          </span>
        </label>
        {errors.acceptTerms && <p className="mt-1.5 text-sm text-red-500 font-medium ml-7">{errors.acceptTerms.message}</p>}
      </div>

      {errors.root && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium text-center mt-4">
          {errors.root.message}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#0F6B46] hover:bg-[#148356] text-white font-semibold py-3.5 px-4 rounded-xl transition-colors shadow-sm flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed mt-4"
      >
        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
      </button>

      <p className="text-center text-sm text-brand-gray mt-6">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-[#0D1B2A] hover:text-brand-green transition-colors">
          Sign In
        </Link>
      </p>
    </form>
  );
}
