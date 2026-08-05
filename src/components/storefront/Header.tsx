"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, ShoppingCart, User, Menu, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { premiumSpring } from "@/lib/motion";
import { Drawer, DrawerTrigger, DrawerContent, DrawerClose } from "@/components/ui/drawer";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { AccountDropdown } from "./AccountDropdown";
import { useEffect } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/categories", label: "Categories" },
  { href: "/about", label: "Our Story" },
  { href: "/investor", label: "Investor" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const items = useCartStore((state) => state.items);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const isHome = pathname === "/";

  return (
    <header className={`sticky top-0 z-50 w-full border-b backdrop-blur-md transition-colors duration-300 ${isHome ? 'bg-[#0D1B2A]/95 border-white/10' : 'bg-[#F6F3EC]/90 border-brand-gray/20'}`}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Mobile Menu & Logo */}
        <div className="flex items-center gap-4 lg:hidden">
          <Drawer shouldScaleBackground={true}>
            <DrawerTrigger asChild>
              <button aria-label="Toggle Menu" className={`p-2 -ml-2 active:scale-95 transition-transform ${isHome ? 'text-white' : 'text-[#0D1B2A]'}`}>
                <Menu className="w-6 h-6" />
              </button>
            </DrawerTrigger>
            <DrawerContent side="left" className="h-full bg-brand-light border-r border-brand-gray/10 rounded-none w-[80%] max-w-sm">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-6 border-b border-brand-gray/10 bg-white">
                  <span className="font-heading font-semibold text-xl text-brand-blue">Menu</span>
                  <DrawerClose asChild>
                    <button className="p-2 -mr-2 text-brand-gray hover:bg-brand-gray/10 rounded-full transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </DrawerClose>
                </div>
                <div className="flex-1 overflow-y-auto py-4 bg-white">
                  <nav className="flex flex-col px-4">
                    {navLinks.map((link) => (
                      <Link 
                        key={link.href} 
                        href={link.href}
                        className="flex items-center justify-between py-4 text-base font-medium text-brand-blue border-b border-brand-gray/5 last:border-0"
                      >
                        {link.label}
                        <ChevronRight className="w-4 h-4 text-brand-gray/50" />
                      </Link>
                    ))}
                  </nav>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
          
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/logos/shop-kareta-logo.svg"
              alt="Shop Kareta Logo" 
              width={160} 
              height={48} 
              className="h-8 w-auto" 
              priority
            />
          </Link>
        </div>

        {/* Desktop Logo */}
        <div className="hidden lg:flex items-center">
          <Link href="/" className="flex items-center gap-3">
            <Image 
              src="/logos/shop-kareta-logo.svg"
              alt="Shop Kareta Logo" 
              width={50} 
              height={50} 
              className="h-10 w-auto" 
              priority
            />
            <div className="flex flex-col">
              <span className={`font-heading font-semibold text-xl leading-none tracking-tight ${isHome ? 'text-white' : 'text-[#0D1B2A]'}`}>
                Shop Kareta
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href} 
                href={link.href} 
                className={`relative px-4 py-2 text-sm font-medium transition-colors hover:text-[#0F6B46] ${isHome && !isActive ? 'text-white/90' : ''}`}
                style={{ color: isActive ? "#0F6B46" : (isHome ? "rgba(255,255,255,0.9)" : "#0D1B2A") }}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0F6B46] rounded-t-full"
                    transition={premiumSpring}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Actions & Search */}
        <div className="flex items-center gap-2 sm:gap-4 relative">
          <AnimatePresence mode="wait">
            {!isSearchOpen ? (
              <motion.button 
                key="search-btn"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                aria-label="Search" 
                onClick={() => setIsSearchOpen(true)}
                className={`p-2 transition-colors hover:text-[#0F6B46] ${isHome ? 'text-white' : 'text-[#0D1B2A]'}`}
              >
                <Search className="w-5 h-5 sm:w-6 sm:h-6" />
              </motion.button>
            ) : (
              <motion.div 
                key="search-input"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 250 }}
                exit={{ opacity: 0, width: 0 }}
                transition={premiumSpring}
                className={`absolute right-full mr-2 sm:mr-4 top-1/2 -translate-y-1/2 flex items-center rounded-full px-4 py-2 shadow-sm overflow-hidden ${isHome ? 'bg-white/10 border border-white/20' : 'bg-white border border-brand-gray/20'}`}
              >
                <Search className={`w-4 h-4 mr-2 shrink-0 ${isHome ? 'text-white/70' : 'text-brand-gray'}`} />
                <input 
                  type="text" 
                  placeholder="Search premium products..." 
                  className={`w-full bg-transparent border-none outline-none text-sm ${isHome ? 'text-white placeholder:text-white/50' : 'text-[#0D1B2A] placeholder:text-brand-gray/50'}`}
                  autoFocus
                />
                <button onClick={() => setIsSearchOpen(false)} className={`ml-2 hover:text-[#0F6B46] ${isHome ? 'text-white/70' : 'text-brand-gray hover:text-[#0D1B2A]'}`}>
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {isMounted && isAuthenticated ? (
            <div className="hidden sm:block">
              <AccountDropdown />
            </div>
          ) : (
            <Link href="/login" aria-label="Login" className={`p-2 transition-colors hidden sm:block hover:text-[#0F6B46] ${isHome ? 'text-white' : 'text-[#0D1B2A]'}`}>
              <User className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>
          )}
          
          <Link href="/cart" aria-label="Cart" className={`relative p-2 transition-colors hover:text-[#0F6B46] ${isHome ? 'text-white' : 'text-[#0D1B2A]'}`}>
            <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
            {isMounted && totalItems > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-0 right-0 bg-[#D4AF37] text-[#0D1B2A] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm"
              >
                {totalItems}
              </motion.span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
