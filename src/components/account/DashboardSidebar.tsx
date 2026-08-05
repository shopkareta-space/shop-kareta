"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Heart, MapPin, User, Settings, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/account", label: "Dashboard", icon: LayoutDashboard },
  { href: "/account/orders", label: "My Orders", icon: ShoppingBag },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account/addresses", label: "Saved Addresses", icon: MapPin },
  { href: "/account/profile", label: "My Profile", icon: User },
  { href: "/account/settings", label: "Settings", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const router = useRouter();

  return (
    <div className="w-full h-full bg-white rounded-3xl border border-brand-gray/10 p-6 shadow-sm sticky top-28 hidden lg:block">
      <div className="flex items-center gap-4 mb-8 pb-8 border-b border-brand-gray/10">
        <img 
          src={user?.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.fullName || 'User'}`} 
          alt="Avatar" 
          className="w-14 h-14 rounded-full border border-brand-gray/20 bg-brand-light"
        />
        <div>
          <p className="text-sm text-brand-gray">Welcome back,</p>
          <p className="font-heading font-bold text-lg text-brand-blue truncate w-32">{user?.fullName}</p>
        </div>
      </div>

      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm overflow-hidden group ${
                isActive ? "text-brand-green bg-brand-green/10" : "text-brand-gray hover:text-brand-blue hover:bg-brand-gray/5"
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? "text-brand-green" : "text-brand-gray/70"}`} />
              <span className="relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 pt-8 border-t border-brand-gray/10">
        <button
          onClick={async () => {
            const supabase = createClient();
            await supabase.auth.signOut();
            router.push("/");
            router.refresh();
          }}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl transition-colors font-medium text-sm text-brand-gray hover:text-red-600 hover:bg-red-50 group"
        >
          <LogOut className="w-5 h-5 text-brand-gray/70 group-hover:text-red-500 transition-transform group-hover:-translate-x-1" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
