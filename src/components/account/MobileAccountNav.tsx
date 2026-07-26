"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Drawer, DrawerTrigger, DrawerContent, DrawerClose } from "@/components/ui/drawer";
import { Menu, X, LayoutDashboard, ShoppingBag, Heart, MapPin, User, Settings, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const navItems = [
  { href: "/account", label: "Dashboard", icon: LayoutDashboard },
  { href: "/account/orders", label: "My Orders", icon: ShoppingBag },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account/addresses", label: "Saved Addresses", icon: MapPin },
  { href: "/account/profile", label: "My Profile", icon: User },
  { href: "/account/settings", label: "Settings", icon: Settings },
];

export function MobileAccountNav() {
  const pathname = usePathname();
  const { logout, user } = useAuthStore();

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button className="p-2 -mr-2 text-brand-blue active:scale-95 transition-transform bg-brand-gray/5 rounded-full">
          <Menu className="w-5 h-5" />
        </button>
      </DrawerTrigger>
      <DrawerContent side="right" className="h-full bg-brand-light border-l border-brand-gray/10 rounded-none w-[80%] max-w-sm">
        <div className="flex flex-col h-full bg-white">
          <div className="flex items-center justify-between p-6 border-b border-brand-gray/10">
            <span className="font-heading font-semibold text-xl text-brand-blue">My Account</span>
            <DrawerClose asChild>
              <button className="p-2 -mr-2 text-brand-gray hover:bg-brand-gray/10 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </DrawerClose>
          </div>
          
          <div className="flex items-center gap-4 p-6 border-b border-brand-gray/5 bg-brand-light/30">
            <img 
              src={user?.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.fullName || 'User'}`} 
              alt="Avatar" 
              className="w-12 h-12 rounded-full border border-brand-gray/20 bg-white"
            />
            <div>
              <p className="font-heading font-bold text-base text-brand-blue truncate w-32">{user?.fullName}</p>
              <p className="text-xs text-brand-gray truncate w-32">{user?.email}</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <DrawerClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-colors font-medium text-sm ${
                        isActive ? "text-brand-green bg-brand-green/10" : "text-[#0D1B2A] hover:bg-brand-gray/5"
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? "text-brand-green" : "text-brand-gray/60"}`} />
                      {item.label}
                    </Link>
                  </DrawerClose>
                );
              })}
            </nav>
          </div>
          
          <div className="p-6 border-t border-brand-gray/10">
            <button
              onClick={logout}
              className="flex items-center gap-4 px-4 py-3.5 w-full rounded-xl transition-colors font-medium text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-5 h-5 text-red-500" />
              Sign Out
            </button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
