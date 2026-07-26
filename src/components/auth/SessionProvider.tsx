"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { createClient } from "@/lib/supabase/client";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const { login, logout } = useAuthStore();
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);

    const initializeSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      
      if (session?.user) {
        login({
          id: session.user.id,
          email: session.user.email!,
          fullName: session.user.user_metadata?.full_name || "",
          avatarUrl: session.user.user_metadata?.avatar_url || "",
        });
      } else {
        logout();
      }
    };

    initializeSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        login({
          id: session.user.id,
          email: session.user.email!,
          fullName: session.user.user_metadata?.full_name || "",
          avatarUrl: session.user.user_metadata?.avatar_url || "",
        });
      } else {
        logout();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [login, logout, supabase.auth]);

  // Avoid hydration mismatch by waiting for mount
  if (!mounted) {
    return null;
  }

  return <>{children}</>;
}
