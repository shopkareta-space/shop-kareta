import Link from "next/link";
import { Package, ChevronRight, CheckCircle2, Clock, XCircle } from "lucide-react";
import type { Order } from "@/store/orderStore";

const statusConfig = {
  processing: { icon: Clock, color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-100", label: "Processing" },
  shipped: { icon: Package, color: "text-brand-blue", bg: "bg-brand-blue/5", border: "border-brand-blue/10", label: "Shipped" },
  delivered: { icon: CheckCircle2, color: "text-brand-green", bg: "bg-brand-green/10", border: "border-brand-green/20", label: "Delivered" },
  cancelled: { icon: XCircle, color: "text-red-500", bg: "bg-red-50", border: "border-red-100", label: "Cancelled" },
};

export function OrderCard({ order }: { order: Order }) {
  const config = statusConfig[order.status];
  const Icon = config.icon;

  return (
    <div className="border border-brand-gray/10 rounded-2xl p-4 sm:p-6 hover:border-brand-gray/30 transition-colors bg-white group flex flex-col md:flex-row gap-4 md:items-center justify-between">
      <div className="flex gap-4 sm:gap-6 items-start sm:items-center flex-1">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${config.bg} ${config.border} border`}>
          <Icon className={`w-6 h-6 ${config.color}`} />
        </div>
        <div className="space-y-1 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
            <h4 className="font-heading font-bold text-lg text-brand-blue">
              {order.id}
            </h4>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold w-max ${config.color} ${config.bg}`}>
              {config.label}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-brand-gray">
            <span>{new Date(order.date).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span className="hidden sm:inline">•</span>
            <span>{order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}</span>
            <span className="hidden sm:inline">•</span>
            <span className="font-semibold text-brand-blue">₹{order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between md:justify-end gap-4 mt-2 md:mt-0 pt-4 md:pt-0 border-t border-brand-gray/5 md:border-0">
        <div className="flex -space-x-3 rtl:space-x-reverse overflow-hidden">
          {order.items.slice(0, 3).map((item, idx) => (
            <img 
              key={item.id} 
              src={item.image} 
              alt={item.name} 
              className={`inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover z-[${3-idx}] bg-brand-light`}
            />
          ))}
          {order.items.length > 3 && (
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full ring-2 ring-white bg-brand-gray/10 text-xs font-medium text-brand-gray z-0">
              +{order.items.length - 3}
            </div>
          )}
        </div>
        
        <Link 
          href={`/account/orders/${order.id}`}
          className="flex items-center gap-1 text-sm font-semibold text-brand-green hover:text-[#0F6B46] transition-colors"
        >
          Details <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
