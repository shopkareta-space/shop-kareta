"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useOrderStore } from "@/store/orderStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { addressService } from "@/lib/services/address.service";
import { SummaryCard } from "@/components/account/SummaryCard";
import { ShoppingBag, Heart, MapPin, Package } from "lucide-react";
import BlurFade from "@/components/ui/blur-fade";
import Link from "next/link";
import { OrderCard } from "@/components/account/OrderCard";

export default function AccountDashboardPage() {
  const { user } = useAuthStore();
  const { orders } = useOrderStore();
  const { items: wishlistItems } = useWishlistStore();
  const [addressCount, setAddressCount] = useState(0);

  useEffect(() => {
    if (!user?.id) return;
    addressService.getAddresses(user.id).then((data) => setAddressCount(data.length));
  }, [user?.id]);

  const activeOrders = orders.filter(o => o.status === "processing" || o.status === "shipped");
  const recentOrders = [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 2);

  return (
    <div className="space-y-10">
      <BlurFade delay={0.1}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-brand-gray/10 pb-6">
          <div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-brand-blue mb-2">
              Dashboard
            </h1>
            <p className="text-brand-gray">
              Manage your orders, profile, and preferences.
            </p>
          </div>
          <Link 
            href="/shop"
            className="bg-brand-green/10 text-brand-green font-semibold py-2 px-6 rounded-xl hover:bg-brand-green/20 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </BlurFade>

      <BlurFade delay={0.2} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard 
          title="Total Orders" 
          value={orders.length} 
          icon={ShoppingBag} 
        />
        <SummaryCard 
          title="Active Orders" 
          value={activeOrders.length} 
          icon={Package} 
        />
        <SummaryCard 
          title="Wishlist Items" 
          value={wishlistItems.length} 
          icon={Heart} 
        />
        <SummaryCard 
          title="Saved Addresses" 
          value={addressCount} 
          icon={MapPin} 
        />
      </BlurFade>

      <BlurFade delay={0.3}>
        <div className="bg-white rounded-3xl border border-brand-gray/10 p-6 md:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-2xl font-bold text-brand-blue">Recent Orders</h2>
            {orders.length > 0 && (
              <Link href="/account/orders" className="text-sm font-semibold text-brand-green hover:text-brand-blue transition-colors">
                View All
              </Link>
            )}
          </div>

          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-brand-gray mb-4">You haven't placed any orders yet.</p>
              <Link href="/shop" className="text-brand-green font-semibold hover:underline">Start Shopping</Link>
            </div>
          )}
        </div>
      </BlurFade>
    </div>
  );
}
