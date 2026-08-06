import Link from "next/link";
import { Package, ChevronRight, CheckCircle2, Clock, XCircle, Download, RotateCcw } from "lucide-react";
import type { Order } from "@/store/orderStore";

const statusConfig = {
  pending: { icon: Clock, color: "text-yellow-500", bg: "bg-yellow-50", border: "border-yellow-100", label: "Pending" },
  placed: { icon: Clock, color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-100", label: "Placed" },
  processing: { icon: Clock, color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-100", label: "Processing" },
  packed: { icon: Package, color: "text-purple-500", bg: "bg-purple-50", border: "border-purple-100", label: "Packed" },
  shipped: { icon: Package, color: "text-brand-blue", bg: "bg-brand-blue/5", border: "border-brand-blue/10", label: "Out for Delivery" },
  delivered: { icon: CheckCircle2, color: "text-brand-green", bg: "bg-brand-green/10", border: "border-brand-green/20", label: "Delivered" },
  cancelled: { icon: XCircle, color: "text-red-500", bg: "bg-red-50", border: "border-red-100", label: "Cancelled" },
};

export function OrderCard({ order }: { order: Order }) {
  const config = statusConfig[order.status];
  const Icon = config.icon;

  // Mock estimated delivery (order date + 5 days)
  const estDeliveryDate = new Date(order.date);
  estDeliveryDate.setDate(estDeliveryDate.getDate() + 5);

  return (
    <div className="border border-brand-gray/10 rounded-2xl p-4 sm:p-6 hover:border-brand-gray/30 transition-colors bg-white group flex flex-col gap-4">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between border-b border-brand-gray/10 pb-4">
        <div className="flex gap-4 sm:gap-6 items-start sm:items-center">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${config.bg} ${config.border} border`}>
            <Icon className={`w-6 h-6 ${config.color}`} />
          </div>
          <div className="space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <h4 className="font-heading font-bold text-lg text-brand-blue">
                {order.id}
              </h4>
              <div className="flex gap-2">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold w-max ${config.color} ${config.bg}`}>
                  {config.label}
                </span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold w-max ${
                  order.paymentStatus === 'paid' ? 'bg-brand-green/10 text-brand-green' : 
                  order.paymentStatus === 'failed' ? 'bg-red-50 text-red-500' : 
                  'bg-amber-50 text-amber-500'
                }`}>
                  Payment: {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-brand-gray">
              <span>Placed: {new Date(order.date).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              <span className="hidden sm:inline">•</span>
              {order.status !== 'cancelled' && order.status !== 'delivered' && (
                <>
                  <span className="text-brand-blue font-medium">Est. Delivery: {estDeliveryDate.toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  <span className="hidden sm:inline">•</span>
                </>
              )}
              <span>{order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}</span>
              <span className="hidden sm:inline">•</span>
              <span className="font-semibold text-brand-blue">Total: ₹{order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Thumbnails and Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Thumbnails */}
        <div className="flex -space-x-3 rtl:space-x-reverse overflow-hidden">
          {order.items.slice(0, 4).map((item, idx) => (
            <img 
              key={item.id} 
              src={item.image} 
              alt={item.name} 
              title={item.name}
              className={`inline-block h-12 w-12 rounded-full ring-2 ring-white object-cover z-[${4-idx}] bg-brand-light`}
            />
          ))}
          {order.items.length > 4 && (
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full ring-2 ring-white bg-brand-gray/10 text-xs font-medium text-brand-gray z-0">
              +{order.items.length - 4}
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto">
          <Link 
            href={`/invoice/${order.id}`}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 text-sm font-semibold text-brand-blue bg-brand-blue/5 px-4 py-2 rounded-xl border border-transparent hover:bg-brand-blue/10 transition-colors"
          >
            <Download className="w-4 h-4" />
            Invoice
          </Link>
          
          <button 
            disabled
            className="flex-1 md:flex-none items-center justify-center gap-1.5 text-sm font-semibold text-brand-gray bg-brand-gray/5 px-4 py-2 rounded-xl border border-transparent cursor-not-allowed opacity-70"
            title="Coming Soon"
          >
            <RotateCcw className="w-4 h-4" />
            Buy Again
          </button>

          <Link 
            href={`/track/${order.id}`}
            className="flex-1 md:flex-none flex items-center justify-center gap-1 text-sm font-semibold text-brand-blue hover:text-brand-blue/80 transition-colors px-4 py-2 rounded-xl border border-brand-gray/20 hover:border-brand-blue/30"
          >
            Track Order
          </Link>

          <Link 
            href={`/account/orders/${order.id}`}
            className="flex-1 md:flex-none flex items-center justify-center gap-1 text-sm font-semibold text-white bg-brand-blue hover:bg-brand-blue/90 transition-colors px-4 py-2 rounded-xl shadow-sm"
          >
            View Details
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
