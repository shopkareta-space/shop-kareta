"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useOrderStore, type Order } from "@/store/orderStore";
import { ArrowLeft, Package, Clock, CheckCircle2, XCircle, MapPin, CreditCard, ChevronRight, MessageCircle, AlertTriangle } from "lucide-react";
import BlurFade from "@/components/ui/blur-fade";

const statusConfig = {
  pending: { icon: Clock, color: "text-yellow-500", bg: "bg-yellow-50", border: "border-yellow-100", label: "Pending" },
  placed: { icon: Clock, color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-100", label: "Placed" },
  processing: { icon: Clock, color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-100", label: "Processing" },
  packed: { icon: Package, color: "text-purple-500", bg: "bg-purple-50", border: "border-purple-100", label: "Packed" },
  shipped: { icon: Package, color: "text-brand-blue", bg: "bg-brand-blue/5", border: "border-brand-blue/10", label: "Shipped" },
  delivered: { icon: CheckCircle2, color: "text-brand-green", bg: "bg-brand-green/10", border: "border-brand-green/20", label: "Delivered" },
  cancelled: { icon: XCircle, color: "text-red-500", bg: "bg-red-50", border: "border-red-100", label: "Cancelled" },
};

const timelineSteps = [
  { status: 'pending', label: 'Pending' },
  { status: 'processing', label: 'Processing' },
  { status: 'packed', label: 'Packed' },
  { status: 'shipped', label: 'Shipped' },
  { status: 'delivered', label: 'Delivered' }
];

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { orders, cancelOrder, fetchOrders, subscribeToOrders, unsubscribeFromOrders } = useOrderStore();
  
  useEffect(() => {
    fetchOrders();
    subscribeToOrders();
    return () => {
      unsubscribeFromOrders();
    };
  }, [fetchOrders, subscribeToOrders, unsubscribeFromOrders]);

  const order = orders.find(o => o.id === id);
  
  const [isCancelling, setIsCancelling] = useState(false);

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

  const handleCancelOrder = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    try {
      setIsCancelling(true);
      await cancelOrder(order.id);
      router.refresh();
    } catch (error) {
      alert("Failed to cancel order. Please try again or contact support.");
    } finally {
      setIsCancelling(false);
    }
  };

  const showCancelButton = order.status === 'placed' || order.status === 'processing';
  const showSupportButton = order.status === 'shipped' || order.status === 'delivered';

  // Calculate active step index for timeline
  const activeStepIndex = order.status === 'cancelled' 
    ? -1 
    : timelineSteps.findIndex(step => step.status === order.status);

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
            <div className="flex gap-2 items-center mt-1">
              <p className="text-sm text-brand-gray">
                Placed on {new Date(order.date).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
              <span className="text-brand-gray/30">•</span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                order.paymentStatus === 'paid' ? 'bg-brand-green/10 text-brand-green' : 
                order.paymentStatus === 'failed' ? 'bg-red-50 text-red-500' : 
                'bg-amber-50 text-amber-500'
              }`}>
                Payment {order.paymentStatus}
              </span>
            </div>
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
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {showCancelButton && (
              <button 
                onClick={handleCancelOrder}
                disabled={isCancelling}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2.5 px-6 rounded-xl transition-colors disabled:opacity-50"
              >
                {isCancelling ? 'Cancelling...' : 'Cancel Order'}
              </button>
            )}
            
            {showSupportButton && (
              <Link href="/contact" className="flex-1 md:flex-none">
                <button className="w-full flex items-center justify-center gap-2 bg-brand-gray/5 hover:bg-brand-gray/10 text-brand-blue font-semibold py-2.5 px-6 rounded-xl transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  Need Help?
                </button>
              </Link>
            )}

            <Link href={`/invoice/${order.id}`} className="flex-1 md:flex-none">
              <button className="w-full flex items-center justify-center gap-2 bg-brand-blue/5 hover:bg-brand-blue/10 text-brand-blue font-semibold py-2.5 px-6 rounded-xl transition-colors">
                Download Invoice
              </button>
            </Link>
          </div>
        </div>
      </BlurFade>

      {/* Timeline */}
      {order.status !== 'cancelled' && (
        <BlurFade delay={0.25}>
          <div className="bg-white rounded-3xl border border-brand-gray/10 p-6 md:p-8 shadow-sm">
            <div className="relative">
              <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-1 bg-brand-gray/10 rounded-full hidden md:block"></div>
              
              {/* Dynamic progress bar */}
              <div 
                className="absolute top-1/2 -translate-y-1/2 left-0 h-1 bg-brand-green rounded-full hidden md:block transition-all duration-500 ease-in-out"
                style={{ width: `${(Math.max(0, activeStepIndex) / (timelineSteps.length - 1)) * 100}%` }}
              ></div>

              <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-0 relative z-10">
                {timelineSteps.map((step, index) => {
                  const isCompleted = index <= activeStepIndex;
                  const isActive = index === activeStepIndex;
                  return (
                    <div key={step.status} className="flex md:flex-col items-center gap-4 md:gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                        isCompleted 
                          ? 'bg-brand-green border-brand-green text-white shadow-sm' 
                          : 'bg-white border-brand-gray/20 text-brand-gray/30'
                      } ${isActive ? 'ring-4 ring-brand-green/20' : ''}`}>
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-2.5 h-2.5 rounded-full bg-current opacity-50" />}
                      </div>
                      <span className={`font-semibold text-sm ${
                        isActive ? 'text-brand-blue' :
                        isCompleted ? 'text-brand-blue/80' : 'text-brand-gray/50'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </BlurFade>
      )}

      {order.status === 'cancelled' && (
        <BlurFade delay={0.25}>
          <div className="bg-red-50 border border-red-100 rounded-3xl p-6 md:p-8 flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-red-700 mb-1">Order Cancelled</h3>
              <p className="text-red-600/80 text-sm">
                This order has been cancelled. Any payments made will be refunded to your original payment method within 5-7 business days.
              </p>
            </div>
          </div>
        </BlurFade>
      )}

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
