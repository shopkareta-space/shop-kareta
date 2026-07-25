"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  // Currently, Zustand persist handles hydration, but this wrapper
  // prepares us for Supabase session initialization (onAuthStateChange)
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Future Supabase auth initialization goes here
    // supabase.auth.getSession().then(({ data: { session } }) => ...)
    // supabase.auth.onAuthStateChange((_event, session) => ...)
  }, []);

  // Avoid hydration mismatch by waiting for mount
  if (!mounted) {
    return null;
  }

  return <>{children}</>;
}
