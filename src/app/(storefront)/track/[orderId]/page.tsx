import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/services/order.service";
import CancelOrderButton from "./CancelOrderButton";
import { Package, Clock, CheckCircle2, XCircle, MapPin, CreditCard, ChevronLeft } from "lucide-react";
import BlurFade from "@/components/ui/blur-fade";

const statusConfig = {
  processing: { icon: Clock, color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-100", label: "Processing", message: "Your order is being prepared for dispatch." },
  shipped: { icon: Package, color: "text-brand-blue", bg: "bg-brand-blue/5", border: "border-brand-blue/10", label: "Shipped", message: "Your order is on the way!" },
  delivered: { icon: CheckCircle2, color: "text-brand-green", bg: "bg-brand-green/10", border: "border-brand-green/20", label: "Delivered", message: "Your order has been delivered successfully." },
  cancelled: { icon: XCircle, color: "text-red-500", bg: "bg-red-50", border: "border-red-100", label: "Cancelled", message: "This order was cancelled." },
};

export const revalidate = 0; // Dynamic page

export default async function TrackOrderPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  const order = await getOrderById(orderId);

  if (!order) {
    notFound();
  }

  const deliveryId = `SK-${order.id.substring(0, 8).toUpperCase()}`;
  const config = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.processing;
  const Icon = config.icon;

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <BlurFade delay={0.1}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Link href="/shop" className="inline-flex items-center gap-2 text-sm text-brand-gray hover:text-brand-blue mb-4 transition-colors">
                <ChevronLeft className="w-4 h-4" />
                Return to Shop
              </Link>
              <h1 className="font-heading text-3xl font-bold text-brand-blue flex items-center gap-3">
                Order Tracking
              </h1>
              <p className="text-brand-gray mt-2">
                Order <span className="font-bold text-brand-blue">{deliveryId}</span> • Placed on {new Date(order.created_at).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            {order.status === "processing" && (
              <CancelOrderButton orderId={order.id} />
            )}
          </div>
        </BlurFade>

        {/* Status Card */}
        <BlurFade delay={0.2}>
          <div className={`bg-white rounded-2xl p-6 md:p-8 border ${config.border} shadow-sm relative overflow-hidden`}>
            <div className={`absolute top-0 right-0 w-32 h-32 ${config.bg} rounded-bl-full -z-10 opacity-50`} />
            <div className="flex items-center gap-6">
              <div className={`w-16 h-16 ${config.bg} ${config.color} rounded-full flex items-center justify-center shrink-0`}>
                <Icon className="w-8 h-8" />
              </div>
              <div>
                <h2 className={`font-heading text-2xl font-bold ${config.color} mb-1`}>
                  {config.label}
                </h2>
                <p className="text-brand-gray">
                  {config.message}
                </p>
              </div>
            </div>
          </div>
        </BlurFade>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <BlurFade delay={0.3} className="lg:col-span-2 space-y-6">
            <h3 className="font-heading text-xl font-bold text-brand-blue">Order Items</h3>
            <div className="bg-white rounded-2xl border border-brand-gray/10 overflow-hidden shadow-sm">
              <div className="divide-y divide-brand-gray/10">
                {order.items.map((item: any) => (
                  <div key={item.id} className="p-6 flex gap-6">
                    <div className="w-24 h-24 bg-brand-light rounded-xl overflow-hidden shrink-0">
                      {item.image ? (
                        <Image src={item.image} alt={item.product_name} width={96} height={96} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-brand-gray/30">
                          <Package className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <Link href={`/products/${item.product_id}`} className="font-bold text-brand-blue hover:text-brand-green transition-colors truncate block">
                        {item.product_name}
                      </Link>
                      <p className="text-brand-gray mt-1">Qty: {item.quantity}</p>
                      <p className="font-bold text-brand-blue mt-2">₹{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-brand-light/30 p-6 border-t border-brand-gray/10 flex justify-between items-center">
                <span className="font-bold text-brand-gray">Total Amount</span>
                <span className="font-heading text-2xl font-bold text-brand-blue">₹{order.total_amount}</span>
              </div>
            </div>
          </BlurFade>

          {/* Details Sidebar */}
          <BlurFade delay={0.4} className="space-y-6">
            <h3 className="font-heading text-xl font-bold text-brand-blue">Order Details</h3>
            
            <div className="bg-white rounded-2xl p-6 border border-brand-gray/10 shadow-sm space-y-6">
              
              <div>
                <div className="flex items-center gap-2 text-brand-blue font-bold mb-3">
                  <MapPin className="w-5 h-5" />
                  <h4>Shipping Address</h4>
                </div>
                <div className="text-brand-gray space-y-1 text-sm pl-7">
                  <p className="font-medium text-brand-blue">{order.contact_info.firstName} {order.contact_info.lastName}</p>
                  <p>{order.shipping_address.addressLine1}</p>
                  {order.shipping_address.addressLine2 && <p>{order.shipping_address.addressLine2}</p>}
                  <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postalCode}</p>
                  <p className="pt-2">{order.contact_info.phone}</p>
                  <p>{order.contact_info.email}</p>
                </div>
              </div>

              <div className="w-full h-px bg-brand-gray/10" />

              <div>
                <div className="flex items-center gap-2 text-brand-blue font-bold mb-3">
                  <CreditCard className="w-5 h-5" />
                  <h4>Payment Method</h4>
                </div>
                <div className="pl-7">
                  <p className="text-brand-gray text-sm uppercase tracking-wider font-semibold">
                    {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                  </p>
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${
                    order.payment_status === 'paid' ? 'bg-brand-green/10 text-brand-green' : 'bg-amber-100 text-amber-600'
                  }`}>
                    {order.payment_status === 'paid' ? 'Paid' : 'Pending'}
                  </span>
                </div>
              </div>

            </div>
          </BlurFade>
        </div>

      </div>
    </div>
  );
}
