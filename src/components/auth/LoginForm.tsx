"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { useAuthStore } from "@/store/authStore";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const login = useAuthStore((state) => state.login);
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/";

  const {
    register,
    handleSubmit,
    setError,
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
    const supabase = createClient();
    
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        return setError("root", { type: "manual", message: "Invalid email or password." });
      }
      return setError("root", { type: "manual", message: error.message });
    }
    
    // Successful login, onAuthStateChange in SessionProvider will handle Zustand state
    router.push(returnUrl);
    router.refresh(); // Ensure layout re-evaluates session
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[#0D1B2A] mb-1.5">Email Address</label>
        <input
          id="email"
          {...register("email")}
          type="email"
          placeholder="you@example.com"
          aria-invalid={errors.email ? "true" : "false"}
          aria-describedby={errors.email ? "email-error" : undefined}
          className="w-full px-4 py-3 rounded-xl border border-brand-gray/20 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-colors bg-white text-[#0D1B2A] placeholder:text-gray-400 scroll-m-20"
        />
        {errors.email && (
          <p id="email-error" role="alert" className="mt-1.5 text-sm text-red-500 font-medium">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-[#0D1B2A] mb-1.5">Password</label>
        <div className="relative">
          <input
            id="password"
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            aria-invalid={errors.password ? "true" : "false"}
            aria-describedby={errors.password ? "password-error" : undefined}
            className="w-full px-4 py-3 rounded-xl border border-brand-gray/20 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-colors bg-white text-[#0D1B2A] placeholder:text-gray-400 pr-12 scroll-m-20"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-gray transition-colors min-w-[44px] min-h-[44px] p-2 flex items-center justify-center rounded-lg"
          >
            {showPassword ? <EyeOff className="w-5 h-5" aria-hidden="true" /> : <Eye className="w-5 h-5" aria-hidden="true" />}
          </button>
        </div>
        {errors.password && (
          <p id="password-error" role="alert" className="mt-1.5 text-sm text-red-500 font-medium">{errors.password.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <label htmlFor="rememberMe" className="flex items-center gap-2 cursor-pointer group">
          <input
            id="rememberMe"
            {...register("rememberMe")}
            type="checkbox"
            className="w-4 h-4 rounded border-brand-gray/30 text-brand-green focus:ring-brand-green cursor-pointer accent-brand-green min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 sm:w-4 sm:h-4 m-[-14px] sm:m-0"
          />
          <span className="text-sm text-brand-gray group-hover:text-[#0D1B2A] transition-colors ml-3 sm:ml-0">Remember me</span>
        </label>
        <Link 
          href="/forgot-password"
          className="text-sm font-medium text-brand-green hover:text-brand-blue transition-colors"
        >
          Forgot Password?
        </Link>
      </div>

      {errors.root && (
        <div role="alert" aria-live="assertive" className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium text-center">
          {errors.root.message}
        </div>
      )}

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
