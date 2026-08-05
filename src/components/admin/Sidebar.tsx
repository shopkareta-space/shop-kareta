"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  Bookmark, 
  ShoppingCart, 
  Users, 
  MessageSquare, 
  Mail, 
  Settings,
  LogOut,
  Briefcase
} from "lucide-react";
import Image from "next/image";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Categories", href: "/admin/categories", icon: Tags },
  { name: "Brands", href: "/admin/brands", icon: Bookmark },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Contact Messages", href: "/admin/messages", icon: MessageSquare },
  { name: "Newsletter", href: "/admin/newsletter", icon: Mail },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  // Do not show sidebar on the login page
  if (pathname === "/admin/login") {
    return null;
  }

  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-full">
      <div className="flex items-center justify-center h-20 border-b border-gray-200 px-6">
        <Link href="/admin">
          <Image 
            src="/logos/sk-holding-logo.svg" 
            alt="SK Holdings Logo" 
            width={120} 
            height={40} 
            className="h-8 w-auto filter invert" // Assuming the logo is white text, invert for light mode or replace
          />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6">
        <nav className="space-y-1 px-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? "bg-[#0D1B2A] text-white"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 ${
                    isActive ? "text-white" : "text-gray-400 group-hover:text-gray-500"
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-gray-200 p-4">
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="group flex w-full items-center px-3 py-2.5 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5 flex-shrink-0 text-red-500 group-hover:text-red-600" aria-hidden="true" />
            Logout
          </button>
        </form>
      </div>
    </div>
  );
}
