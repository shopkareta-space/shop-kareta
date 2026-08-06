"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RealtimeOrderSync({ orderId }: { orderId: string }) {
  const router = useRouter();

  useEffect(() => {
    if (!orderId) return;

    const supabase = createClient();
    
    const channel = supabase
      .channel(`public:orders:${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`
        },
        (payload) => {
          console.log("Order updated in DB, refreshing page...", payload);
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, router]);

  return null;
}
