"use client";

import { useOrderStore } from "@/store/orderStore";
import { OrderCard } from "@/components/account/OrderCard";
import { EmptyState } from "@/components/account/EmptyState";
import { ShoppingBag } from "lucide-react";
import BlurFade from "@/components/ui/blur-fade";

import { useEffect } from "react";

export default function OrdersPage() {
  const { orders, isLoading, fetchOrders } = useOrderStore();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="space-y-8">
      <BlurFade delay={0.1}>
        <div className="border-b border-brand-gray/10 pb-6">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-brand-blue mb-2">
            My Orders
          </h1>
          <p className="text-brand-gray">
            View and track your order history.
          </p>
        </div>
      </BlurFade>

      <BlurFade delay={0.2}>
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-brand-green/30 border-t-brand-green rounded-full animate-spin" />
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <EmptyState 
            icon={ShoppingBag}
            title="No orders yet"
            description="You haven't placed any orders yet. Start exploring our premium wellness collection."
            actionLabel="Start Shopping"
            actionHref="/shop"
          />
        )}
      </BlurFade>
    </div>
  );
}
