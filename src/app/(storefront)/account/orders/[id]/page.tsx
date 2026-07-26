"use client";

import { use } from "react";
import Link from "next/link";
import { useOrderStore, type Order } from "@/store/orderStore";
import { ArrowLeft, Package, Clock, CheckCircle2, XCircle, MapPin, CreditCard, ChevronRight } from "lucide-react";
import BlurFade from "@/components/ui/blur-fade";

const statusConfig = {
  processing: { icon: Clock, color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-100", label: "Processing" },
  shipped: { icon: Package, color: "text-brand-blue", bg: "bg-brand-blue/5", border: "border-brand-blue/10", label: "Shipped" },
  delivered: { icon: CheckCircle2, color: "text-brand-green", bg: "bg-brand-green/10", border: "border-brand-green/20", label: "Delivered" },
  cancelled: { icon: XCircle, color: "text-red-500", bg: "bg-red-50", border: "border-red-100", label: "Cancelled" },
};

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { orders } = useOrderStore();
  const order = orders.find(o => o.id === id);

  if (!order) {
    return (
      <div className="text-center py-20">
        <h2 className="font-heading text-2xl font-bold text-brand-blue mb-4">Order Not Found</h2>
        <Link href="/account/orders" className="text-brand-green font-semibold hover:underline">
          Return to Orders
        </Link>
      </div>
    );
  }

  const config = statusConfig[order.status];
  const Icon = config.icon;

  return (
    <div className="space-y-8">
      <BlurFade delay={0.1}>
        <div className="flex items-center gap-4 border-b border-brand-gray/10 pb-6">
          <Link href="/account/orders" className="p-2 -ml-2 text-brand-gray hover:text-brand-blue hover:bg-brand-gray/5 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-brand-blue">
              Order {order.id}
            </h1>
            <p className="text-sm text-brand-gray mt-1">
              Placed on {new Date(order.date).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
      </BlurFade>

      <BlurFade delay={0.2}>
        <div className="bg-white rounded-3xl border border-brand-gray/10 p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${config.bg} ${config.border} border`}>
              <Icon className={`w-7 h-7 ${config.color}`} />
            </div>
            <div>
              <p className="text-sm text-brand-gray font-medium mb-1">Current Status</p>
              <p className={`font-heading font-bold text-xl ${config.color}`}>{config.label}</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="bg-white border border-brand-gray/20 hover:bg-brand-gray/5 text-brand-blue font-semibold py-2.5 px-6 rounded-xl transition-colors">
              Download Invoice
            </button>
            <button className="bg-brand-gray/5 hover:bg-brand-gray/10 text-brand-blue font-semibold py-2.5 px-6 rounded-xl transition-colors">
              Track Shipment
            </button>
          </div>
        </div>
      </BlurFade>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <BlurFade delay={0.3}>
            <div className="bg-white rounded-3xl border border-brand-gray/10 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-brand-gray/10">
                <h2 className="font-heading text-xl font-bold text-brand-blue">Order Items</h2>
              </div>
              <div className="p-6 space-y-6">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 sm:gap-6">
                    <Link href={`/products/${item.productId}`} className="shrink-0">
                      <img src={item.image} alt={item.name} className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-2xl bg-brand-light" />
                    </Link>
                    <div className="flex-1 flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-4">
                      <div>
                        <Link href={`/products/${item.productId}`} className="font-heading font-bold text-lg text-brand-blue hover:text-brand-green transition-colors line-clamp-2">
                          {item.name}
                        </Link>
                        <p className="text-sm text-brand-gray mt-1">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="font-bold text-brand-blue text-lg">₹{(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-sm text-brand-gray">₹{item.price.toFixed(2)} each</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </BlurFade>
        </div>

        <div className="space-y-8">
          <BlurFade delay={0.4}>
            <div className="bg-white rounded-3xl border border-brand-gray/10 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-brand-gray/10">
                <h2 className="font-heading text-lg font-bold text-brand-blue">Order Summary</h2>
              </div>
              <div className="p-6 space-y-4 text-sm">
                <div className="flex justify-between text-brand-gray">
                  <span>Subtotal</span>
                  <span className="text-brand-blue font-medium">₹{order.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-brand-gray">
                  <span>Shipping</span>
                  <span className="text-brand-green font-medium">Free</span>
                </div>
                <div className="flex justify-between text-brand-gray">
                  <span>Tax</span>
                  <span className="text-brand-blue font-medium">₹0.00</span>
                </div>
                <div className="border-t border-brand-gray/10 pt-4 flex justify-between">
                  <span className="font-bold text-brand-blue text-base">Total</span>
                  <span className="font-heading font-bold text-brand-blue text-xl">₹{order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </BlurFade>

          <BlurFade delay={0.5}>
            <div className="bg-white rounded-3xl border border-brand-gray/10 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-brand-gray/10">
                <h2 className="font-heading text-lg font-bold text-brand-blue">Delivery Info</h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex gap-4">
                  <MapPin className="w-5 h-5 text-brand-gray shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-brand-blue mb-1">Shipping Address</p>
                    <p className="text-sm text-brand-gray leading-relaxed">
                      Demo User<br />
                      123 Wellness Avenue<br />
                      Apt 4B<br />
                      Mumbai, Maharashtra 400001<br />
                      India
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CreditCard className="w-5 h-5 text-brand-gray shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-brand-blue mb-1">Payment Method</p>
                    <p className="text-sm text-brand-gray">Credit Card ending in 4242</p>
                  </div>
                </div>
              </div>
            </div>
          </BlurFade>
        </div>
      </div>
    </div>
  );
}
