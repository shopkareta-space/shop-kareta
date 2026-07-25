"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, FileText, Heart, MapPin, Settings } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export function AccountDropdown() {
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:bg-brand-gray/5 p-1 pr-3 rounded-full transition-colors border border-transparent hover:border-brand-gray/10"
      >
        <img 
          src={user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName}`} 
          alt={user.fullName} 
          className="w-8 h-8 rounded-full border border-brand-gray/20 bg-white"
        />
        <span className="text-sm font-medium text-brand-blue hidden sm:block">
          {user.fullName.split(' ')[0]}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-brand-gray/10 py-2 z-50 overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-brand-gray/5 mb-1">
              <p className="text-sm font-semibold text-brand-blue truncate">{user.fullName}</p>
              <p className="text-xs text-brand-gray truncate">{user.email}</p>
            </div>
            
            <div className="px-2">
              <Link href="/account" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-brand-gray/5 text-sm font-medium text-brand-gray hover:text-brand-blue transition-colors">
                <User className="w-4 h-4 text-brand-green" /> My Profile
              </Link>
              <Link href="/account/orders" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-brand-gray/5 text-sm font-medium text-brand-gray hover:text-brand-blue transition-colors">
                <FileText className="w-4 h-4 text-brand-green" /> Orders
              </Link>
              <Link href="/account/wishlist" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-brand-gray/5 text-sm font-medium text-brand-gray hover:text-brand-blue transition-colors">
                <Heart className="w-4 h-4 text-brand-green" /> Wishlist
              </Link>
              <Link href="/account/addresses" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-brand-gray/5 text-sm font-medium text-brand-gray hover:text-brand-blue transition-colors">
                <MapPin className="w-4 h-4 text-brand-green" /> Saved Addresses
              </Link>
              <Link href="/account/settings" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-brand-gray/5 text-sm font-medium text-brand-gray hover:text-brand-blue transition-colors">
                <Settings className="w-4 h-4 text-brand-green" /> Account Settings
              </Link>
            </div>

            <div className="px-2 mt-1 border-t border-brand-gray/5 pt-1">
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 text-sm font-medium text-brand-gray hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4 text-red-500" /> Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
