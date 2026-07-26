"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardSidebar } from "@/components/account/DashboardSidebar";
import { MobileAccountNav } from "@/components/account/MobileAccountNav";
import BlurFade from "@/components/ui/blur-fade";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-brand-light pb-20">
        {/* Mobile Header/Nav */}
        <div className="lg:hidden sticky top-20 z-40 bg-white border-b border-brand-gray/10 shadow-sm px-4 py-3 flex items-center justify-between">
          <span className="font-heading font-semibold text-lg text-brand-blue">My Account</span>
          <MobileAccountNav />
        </div>

        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Desktop Sidebar */}
            <div className="w-full lg:w-1/4 xl:w-1/5 shrink-0 hidden lg:block">
              <BlurFade delay={0.1}>
                <DashboardSidebar />
              </BlurFade>
            </div>

            {/* Main Content Area */}
            <div className="w-full lg:flex-1 min-w-0">
              <BlurFade delay={0.15}>
                {children}
              </BlurFade>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
