"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft, RefreshCw, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface OTPVerificationProps {
  email: string;
  type: "signup" | "magiclink";
  onSuccess: () => void;
  onCancel: () => void;
  onChangeEmail: () => void;
}

const OTP_LENGTH = 6;

export function OTPVerification({
  email,
  type,
  onSuccess,
  onCancel,
  onChangeEmail,
}: OTPVerificationProps) {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Auto-verify when all 6 digits are entered
  useEffect(() => {
    const code = otp.join("");
    if (code.length === OTP_LENGTH && !isVerifying) {
      verifyOtp(code);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  const verifyOtp = useCallback(async (code: string) => {
    setIsVerifying(true);
    setError(null);
    const supabase = createClient();

    const { error: err } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type,
    });

    if (err) {
      setError(err.message.includes("expired") ? "Code expired. Please request a new one." : "Invalid code. Please try again.");
      setOtp(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
      setIsVerifying(false);
      return;
    }

    onSuccess();
  }, [email, type, onSuccess]);

  const handleInput = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only digits

    const newOtp = [...otp];

    // Handle paste of full code
    if (value.length > 1) {
      const digits = value.replace(/\D/g, "").slice(0, OTP_LENGTH).split("");
      const filled = [...digits, ...Array(OTP_LENGTH).fill("")].slice(0, OTP_LENGTH);
      setOtp(filled);
      inputRefs.current[Math.min(digits.length, OTP_LENGTH - 1)]?.focus();
      return;
    }

    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleResend = async () => {
    if (timeLeft > 0 || isResending) return;
    setIsResending(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to resend code.");
        return;
      }

      setOtp(Array(OTP_LENGTH).fill(""));
      setTimeLeft(60);
      inputRefs.current[0]?.focus();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const filledCount = otp.filter(Boolean).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center text-center space-y-6 w-full max-w-md mx-auto"
    >
      {/* Icon */}
      <div className="w-16 h-16 bg-[#0F6B46]/10 rounded-full flex items-center justify-center mx-auto mb-2">
        <ShieldCheck className="w-8 h-8 text-[#0F6B46]" />
      </div>

      {/* Heading */}
      <div>
        <h3 className="font-heading text-2xl font-bold text-[#0D1B2A] mb-2">
          Enter Verification Code
        </h3>
        <p className="text-brand-gray text-sm leading-relaxed">
          We sent a 6-digit code to
          <br />
          <span className="font-semibold text-[#0D1B2A]">{email}</span>
        </p>
      </div>

      {/* OTP Input Boxes */}
      <div className="flex gap-3 justify-center" role="group" aria-label="Verification code">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={OTP_LENGTH}
            value={digit}
            onChange={(e) => handleInput(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onFocus={(e) => e.target.select()}
            disabled={isVerifying}
            aria-label={`Digit ${index + 1}`}
            className={`
              w-12 h-14 text-center text-xl font-bold rounded-xl border-2 transition-all
              focus:outline-none focus:border-[#0F6B46] focus:ring-2 focus:ring-[#0F6B46]/20
              ${digit ? "border-[#0F6B46] bg-[#0F6B46]/5 text-[#0D1B2A]" : "border-brand-gray/20 bg-white text-[#0D1B2A]"}
              ${isVerifying ? "opacity-60 cursor-not-allowed" : ""}
            `}
          />
        ))}
      </div>

      {/* Progress indicator */}
      <p className="text-xs text-brand-gray/60">
        {filledCount}/{OTP_LENGTH} digits entered
      </p>

      {/* Error */}
      {error && (
        <div className="w-full p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      {/* Verifying state */}
      {isVerifying && (
        <div className="flex items-center gap-2 text-[#0F6B46] text-sm font-medium">
          <Loader2 className="w-4 h-4 animate-spin" />
          Verifying your code…
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col space-y-4 w-full pt-2">
        <button
          type="button"
          onClick={handleResend}
          disabled={timeLeft > 0 || isResending}
          className="w-full bg-[#0F6B46] hover:bg-[#148356] text-white font-semibold py-3.5 px-4 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isResending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <RefreshCw className="w-5 h-5" />
          )}
          {timeLeft > 0 ? `Resend Code in ${timeLeft}s` : "Resend Code"}
        </button>

        <div className="flex items-center justify-center gap-4 text-sm font-medium pt-1">
          <button
            type="button"
            onClick={onChangeEmail}
            className="text-brand-gray hover:text-[#0D1B2A] transition-colors"
          >
            Change Email
          </button>
          <span className="text-brand-gray/30">•</span>
          <button
            type="button"
            onClick={onCancel}
            className="text-brand-gray hover:text-[#0D1B2A] transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
          </button>
        </div>
      </div>
    </motion.div>
  );
}
