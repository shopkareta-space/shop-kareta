"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

interface PasswordStrengthProps {
  password?: string;
}

export function PasswordStrength({ password = "" }: PasswordStrengthProps) {
  const strength = useMemo(() => {
    let score = 0;
    if (!password) return score;

    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    return score;
  }, [password]);

  const getStrengthData = () => {
    switch (strength) {
      case 0:
        return { label: "", color: "bg-gray-200" };
      case 1:
      case 2:
        return { label: "Weak", color: "bg-red-500", text: "text-red-500" };
      case 3:
      case 4:
        return { label: "Good", color: "bg-amber-500", text: "text-amber-500" };
      case 5:
        return { label: "Strong", color: "bg-brand-green", text: "text-brand-green" };
      default:
        return { label: "", color: "bg-gray-200", text: "text-gray-400" };
    }
  };

  const { label, color, text } = getStrengthData();

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1 h-1.5 w-full">
        {[1, 2, 3, 4, 5].map((index) => (
          <motion.div
            key={index}
            className={`flex-1 rounded-full ${index <= strength ? color : "bg-gray-100"}`}
            initial={{ opacity: 0.5, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          />
        ))}
      </div>
      <div className="flex justify-between items-center text-[10px] uppercase tracking-wider font-semibold">
        <span className="text-gray-400">Password Strength</span>
        <motion.span
          key={label}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className={text}
        >
          {label}
        </motion.span>
      </div>
    </div>
  );
}
