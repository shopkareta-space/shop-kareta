"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Loader2 } from "lucide-react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isLoading && !isAuthenticated) {
      router.push(`/login?returnUrl=${encodeURIComponent(pathname)}`);
    }
  }, [isMounted, isLoading, isAuthenticated, router, pathname]);

  if (!isMounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-light">
        <Loader2 className="w-8 h-8 animate-spin text-brand-green" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}
