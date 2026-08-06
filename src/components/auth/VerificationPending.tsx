"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, MailCheck, ArrowLeft, RefreshCw } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface VerificationPendingProps {
  email: string;
  onCancel: () => void;
  onChangeEmail: () => void;
}

export function VerificationPending({ email, onCancel, onChangeEmail }: VerificationPendingProps) {
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleResend = async () => {
    if (timeLeft > 0 || isResending) return;
    
    setIsResending(true);
    setError(null);
    setSuccessMsg(null);
    const supabase = createClient();

    try {
      // In Supabase, if a user isn't confirmed yet, resending the signup confirmation 
      // can be done using resend({ type: 'signup', email })
      const { error: err } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
        }
      });

      if (err) throw err;
      
      setTimeLeft(60);
      setSuccessMsg("Verification email has been resent!");
    } catch (err: any) {
      setError(err.message || "Failed to resend verification email.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="flex flex-col items-center text-center space-y-6 w-full max-w-md mx-auto"
    >
      <div className="w-16 h-16 bg-[#0F6B46]/10 rounded-full flex items-center justify-center mx-auto mb-2">
        <MailCheck className="w-8 h-8 text-[#0F6B46]" />
      </div>
      
      <div>
        <h3 className="font-heading text-2xl font-bold text-[#0D1B2A] mb-2">Verification Pending</h3>
        <p className="text-brand-gray leading-relaxed text-sm">
          We have sent a verification email to
          <br />
          <span className="font-semibold text-[#0D1B2A]">{email}</span>
        </p>
        <p className="text-brand-gray leading-relaxed text-sm mt-3">
          Please check your inbox and click the link to verify your account.
        </p>
      </div>

      {error && (
        <div className="w-full p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="w-full p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-medium">
          {successMsg}
        </div>
      )}

      <div className="flex flex-col space-y-4 w-full pt-4">
        <button
          type="button"
          onClick={handleResend}
          disabled={timeLeft > 0 || isResending}
          className="w-full bg-[#0F6B46] hover:bg-[#148356] text-white font-semibold py-3.5 px-4 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isResending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <RefreshCw className="w-5 h-5" />
          )}
          {timeLeft > 0 ? `Resend Email in ${timeLeft}s` : "Resend Verification Email"}
        </button>

        <div className="flex items-center justify-center gap-4 text-sm font-medium pt-2">
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
