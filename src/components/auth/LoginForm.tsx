"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { useAuthStore } from "@/store/authStore";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const login = useAuthStore((state) => state.login);
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Mock successful login
    login({
      id: "usr_123",
      email: data.email,
      fullName: "Demo User",
      avatarUrl: "https://i.pravatar.cc/150?u=demo",
    });
    
    router.push(returnUrl);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
        {errors.password && (
          <p className="mt-1.5 text-sm text-red-500 font-medium">{errors.password.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            {...register("rememberMe")}
            type="checkbox"
            className="w-4 h-4 rounded border-brand-gray/30 text-brand-green focus:ring-brand-green cursor-pointer accent-brand-green"
          />
          <span className="text-sm text-brand-gray group-hover:text-[#0D1B2A] transition-colors">Remember me</span>
        </label>
        <Link 
          href="/forgot-password"
          className="text-sm font-medium text-brand-green hover:text-brand-blue transition-colors"
        >
          Forgot Password?
        </Link>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#0F6B46] hover:bg-[#148356] text-white font-semibold py-3.5 px-4 rounded-xl transition-colors shadow-sm flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          "Sign In"
        )}
      </button>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-brand-gray/10"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-brand-gray/60">Or continue as</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => router.push(returnUrl)}
        className="w-full bg-white hover:bg-brand-gray/5 text-[#0D1B2A] font-semibold py-3.5 px-4 rounded-xl border border-brand-gray/20 transition-colors shadow-sm"
      >
        Guest User
      </button>

      <p className="text-center text-sm text-brand-gray mt-8">
        Don't have an account?{" "}
        <Link href="/register" className="font-semibold text-[#0D1B2A] hover:text-brand-green transition-colors">
          Create one now
        </Link>
      </p>
    </form>
  );
}
