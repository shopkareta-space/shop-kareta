"use client";

import { usePathname } from "next/navigation";
import { Bell, Menu, Search, User } from "lucide-react";

export function Header() {
  const pathname = usePathname();

  // Do not show header on the login page
  if (pathname === "/admin/login") {
    return null;
  }

  // Generate a title based on pathname
  const getPageTitle = () => {
    if (pathname === "/admin") return "Dashboard";
    const segment = pathname.split("/").pop();
    if (segment) {
      return segment.charAt(0).toUpperCase() + segment.slice(1).replace("-", " ");
    }
    return "Admin";
  };

  return (
    <header className="bg-white border-b border-gray-200 h-20 flex-shrink-0 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      <div className="flex items-center">
        <button className="md:hidden p-2 -ml-2 mr-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md">
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-bold text-gray-900 font-heading">{getPageTitle()}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="block w-64 pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:border-[#0D1B2A] focus:ring-1 focus:ring-[#0D1B2A] bg-gray-50 transition-colors"
          />
        </div>

        <button className="p-2 text-gray-400 hover:text-gray-500 relative">
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
          <Bell className="h-6 w-6" />
        </button>

        <div className="h-8 w-8 rounded-full bg-[#0D1B2A] text-white flex items-center justify-center font-bold shadow-sm">
          A
        </div>
      </div>
    </header>
  );
}
