import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/services/order.service";
import CancelOrderButton from "./CancelOrderButton";
import { Package, Clock, CheckCircle2, XCircle, MapPin, CreditCard, ChevronLeft, Truck, Box, HelpCircle } from "lucide-react";
import BlurFade from "@/components/ui/blur-fade";

const statusConfig = {
  placed: { color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-100", label: "Order Placed" },
  processing: { color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-100", label: "Processing" },
  packed: { color: "text-purple-500", bg: "bg-purple-50", border: "border-purple-100", label: "Packed" },
  shipped: { color: "text-brand-blue", bg: "bg-brand-blue/5", border: "border-brand-blue/10", label: "Shipped" },
  delivered: { color: "text-brand-green", bg: "bg-brand-green/10", border: "border-brand-green/20", label: "Delivered" },
  cancelled: { color: "text-red-500", bg: "bg-red-50", border: "border-red-100", label: "Cancelled" },
};

export const revalidate = 0; // Dynamic page

export default async function TrackOrderPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  const order = await getOrderById(orderId);

  if (!order) {
    notFound();
  }

  const deliveryId = order.order_number || `SK-${order.id.substring(0, 8).toUpperCase()}`;
  const currentStatus = order.status as keyof typeof statusConfig || 'placed';
  const config = statusConfig[currentStatus] || statusConfig.placed;

  // Timeline logic
  const steps = ['placed', 'processing', 'packed', 'shipped', 'delivered'];
  const currentIndex = steps.indexOf(currentStatus);
  
  const timelineSteps = [
    { id: 'placed', label: 'Order Placed', icon: Box, date: new Date(order.created_at).toLocaleDateString(), time: new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), completed: currentIndex >= 0 || currentStatus === 'cancelled' },
    { id: 'processing', label: 'Processing', icon: Clock, date: currentIndex >= 1 ? 'In Progress' : '', time: '', completed: currentIndex >= 1 },
    { id: 'packed', label: 'Packed', icon: Package, date: currentIndex >= 2 ? 'Ready' : '', time: '', completed: currentIndex >= 2 },
    { id: 'shipped', label: 'Shipped', icon: Truck, date: currentIndex >= 3 ? 'Dispatched' : '', time: '', completed: currentIndex >= 3 },
    { id: 'delivered', label: 'Delivered', icon: CheckCircle2, date: currentIndex >= 4 ? 'Completed' : '', time: '', completed: currentIndex >= 4 }
  ];

  const estimatedDelivery = new Date(order.created_at);
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  const canCancel = currentStatus === 'placed' || currentStatus === 'processing';

  // Subtotal Calculation (Items * Price)
  const subtotal = order.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
  const discountAmount = subtotal + (subtotal >= 1000 ? 0 : 99) - order.total_amount; 

  return (
    <div className="min-h-screen bg-brand-light/30 pt-32 pb-20 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <BlurFade delay={0.1}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
            <div>
              <Link href="/account/orders" className="inline-flex items-center gap-2 text-sm text-brand-gray hover:text-brand-blue mb-4 transition-colors">
                <ChevronLeft className="w-4 h-4" />
                Back to My Orders
              </Link>
              <h1 className="font-heading text-3xl font-bold text-brand-blue">
                Track Your Order
              </h1>
            </div>
            <div className="flex items-center gap-3">
              {canCancel ? (
                <CancelOrderButton orderId={order.id} />
              ) : (
                <Link href="/contact">
                  <button className="h-10 px-6 bg-white border border-brand-gray/20 text-brand-gray rounded-full font-medium flex items-center justify-center gap-2 hover:border-brand-gray hover:text-brand-blue transition-colors">
                    <HelpCircle className="w-4 h-4" />
                    <span>Contact Support</span>
                  </button>
                </Link>
              )}
            </div>
          </div>
        </BlurFade>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Timeline Card */}
            <BlurFade delay={0.2}>
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-brand-gray/10 shadow-sm">
                <h3 className="font-heading text-xl font-bold text-brand-blue mb-8">Order Status</h3>
                
                {currentStatus === 'cancelled' ? (
                  <div className="flex items-center gap-4 bg-red-50 p-6 rounded-xl border border-red-100">
                    <XCircle className="w-10 h-10 text-red-500" />
                    <div>
                      <h3 className="font-bold text-red-600 text-lg">Order Cancelled</h3>
                      <p className="text-red-500/80">This order has been cancelled. If you have been charged, a refund will be initiated.</p>
                    </div>
                  </div>
                ) : (
                  <div className="relative pt-4 pb-8 overflow-x-auto no-scrollbar">
                    <div className="min-w-[600px] relative px-4">
                      {/* Progress Track Background */}
                      <div className="absolute top-[22px] left-[10%] right-[10%] h-1 bg-brand-gray/10 rounded-full" />
                      
                      {/* Active Progress Line */}
                      <div 
                        className="absolute top-[22px] left-[10%] h-1 bg-brand-green rounded-full transition-all duration-1000" 
                        style={{ 
                          width: currentIndex === 0 ? '0%' :
                                 currentIndex === 1 ? '25%' : 
                                 currentIndex === 2 ? '50%' :
                                 currentIndex === 3 ? '75%' : 
                                 currentIndex === 4 ? '100%' : '0%' 
                        }} 
                      />

                      <div className="flex justify-between relative z-10">
                        {timelineSteps.map((step, index) => {
                          const Icon = step.icon;
                          return (
                            <div key={step.id} className="flex flex-col items-center w-1/5 gap-3">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-sm z-10 transition-colors duration-500 ${
                                step.completed ? 'bg-brand-green text-white' : 'bg-brand-gray/10 text-brand-gray/40'
                              }`}>
                                <Icon className="w-5 h-5" />
                              </div>
                              <div className="text-center mt-1">
                                <h4 className={`font-bold text-sm ${step.completed ? 'text-brand-blue' : 'text-brand-gray/50'}`}>
                                  {step.label}
                                </h4>
                                <p className="text-xs text-brand-gray mt-1 font-medium">
                                  {step.date}
                                </p>
                                {step.time && (
                                  <p className="text-xs text-brand-gray/60">
                                    {step.time}
                                  </p>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </BlurFade>

            {/* Ordered Products */}
            <BlurFade delay={0.3}>
              <div className="bg-white rounded-2xl border border-brand-gray/10 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-brand-gray/10">
                  <h3 className="font-heading text-xl font-bold text-brand-blue">Ordered Products</h3>
                </div>
                <div className="divide-y divide-brand-gray/10">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-6">
                      <div className="w-24 h-24 bg-brand-light rounded-xl overflow-hidden shrink-0 border border-brand-gray/10">
                        {item.image ? (
                          <Image src={item.image} alt={item.product_name} width={96} height={96} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-brand-gray/30">
                            <Package className="w-8 h-8" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <Link href={`/products/${item.product_id}`} className="font-bold text-brand-blue text-lg hover:text-brand-green transition-colors truncate block">
                          {item.product_name}
                        </Link>
                        {item.variant_name && <p className="text-brand-gray text-sm mt-1">{item.variant_name}</p>}
                        
                        <div className="flex flex-wrap items-center justify-between mt-4 gap-4">
                          <div className="flex items-center gap-6 text-brand-gray text-sm">
                            <span className="bg-brand-light px-3 py-1 rounded-full">Qty: {item.quantity}</span>
                            <span>Price: ₹{item.price}</span>
                          </div>
                          <p className="font-bold text-brand-blue text-lg">₹{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </BlurFade>

            {/* Tracking Information */}
            <BlurFade delay={0.4}>
              <div className="bg-white rounded-2xl p-6 border border-brand-gray/10 shadow-sm">
                <h3 className="font-heading text-xl font-bold text-brand-blue mb-4">Tracking Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                  <div>
                    <span className="text-xs font-semibold text-brand-gray uppercase tracking-wider block mb-1">Courier Name</span>
                    <span className="font-medium text-brand-blue">{order.courier_name || 'Assigned after packing'}</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-brand-gray uppercase tracking-wider block mb-1">Tracking Number</span>
                    <span className="font-medium text-brand-blue">{order.tracking_number || 'Pending'}</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-brand-gray uppercase tracking-wider block mb-1">Tracking URL</span>
                    {order.tracking_url ? (
                      <a href={order.tracking_url} target="_blank" rel="noopener noreferrer" className="font-medium text-brand-green hover:underline">Track Package</a>
                    ) : (
                      <span className="font-medium text-brand-blue">Pending</span>
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-brand-gray uppercase tracking-wider block mb-1">Expected Delivery</span>
                    <span className="font-medium text-brand-blue">{order.estimated_delivery ? new Date(order.estimated_delivery).toLocaleDateString() : estimatedDelivery.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </BlurFade>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            
            {/* Order Summary */}
            <BlurFade delay={0.25}>
              <div className="bg-white rounded-2xl p-6 border border-brand-gray/10 shadow-sm">
                <h3 className="font-heading text-xl font-bold text-brand-blue mb-4">Order Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-brand-gray/10">
                    <span className="text-brand-gray text-sm">Order Number</span>
                    <span className="font-bold text-brand-blue">{deliveryId}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-brand-gray/10">
                    <span className="text-brand-gray text-sm">Order Date</span>
                    <span className="font-medium text-brand-blue text-sm">{new Date(order.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-brand-gray/10">
                    <span className="text-brand-gray text-sm">Order Status</span>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.color}`}>
                      {config.label}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-brand-gray/10">
                    <span className="text-brand-gray text-sm">Payment Status</span>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase ${
                      order.payment_status === 'paid' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {order.payment_status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-brand-gray text-sm">Est. Delivery</span>
                    <span className="font-bold text-brand-green text-sm">{estimatedDelivery.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </BlurFade>

            {/* Order Details (Pricing) */}
            <BlurFade delay={0.35}>
              <div className="bg-white rounded-2xl p-6 border border-brand-gray/10 shadow-sm">
                <h3 className="font-heading text-xl font-bold text-brand-blue mb-4">Order Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-brand-gray">Products ({order.items.length})</span>
                    <span className="font-medium text-brand-blue">₹{subtotal.toFixed(2)}</span>
                  </div>
                  
                  {discountAmount > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-brand-green">Discount {order.applied_coupon && `(${order.applied_coupon})`}</span>
                      <span className="font-medium text-brand-green">-₹{discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-sm pb-4 border-b border-brand-gray/10">
                    <span className="text-brand-gray">Shipping</span>
                    <span className="font-medium text-brand-blue">
                      {subtotal >= 1000 ? 'Free' : '₹99.00'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-bold text-brand-blue text-lg">Grand Total</span>
                    <span className="font-heading font-bold text-brand-green text-2xl">₹{order.total_amount}</span>
                  </div>
                  
                  <div className="pt-4 mt-4 border-t border-brand-gray/10 flex items-center gap-2 text-sm">
                    <CreditCard className="w-4 h-4 text-brand-gray" />
                    <span className="text-brand-gray">Paid via</span>
                    <span className="font-bold text-brand-blue uppercase">{order.payment_method}</span>
                  </div>
                </div>
              </div>
            </BlurFade>

            {/* Shipping Address */}
            <BlurFade delay={0.45}>
              <div className="bg-white rounded-2xl p-6 border border-brand-gray/10 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading text-xl font-bold text-brand-blue">Shipping Address</h3>
                  <MapPin className="w-5 h-5 text-brand-gray" />
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-brand-blue">{order.contact_info?.firstName} {order.contact_info?.lastName}</p>
                  <p className="text-brand-gray text-sm">{order.contact_info?.phone}</p>
                  <p className="text-brand-gray text-sm">{order.contact_info?.email}</p>
                  <div className="pt-3 mt-3 border-t border-brand-gray/10">
                    <p className="text-brand-gray text-sm leading-relaxed">
                      {order.shipping_address?.street}<br />
                      {order.shipping_address?.apartment && <>{order.shipping_address.apartment}<br /></>}
                      {order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.pinCode}<br />
                      {order.shipping_address?.country}
                    </p>
                  </div>
                </div>
              </div>
            </BlurFade>

          </div>
        </div>
      </div>
    </div>
  );
}
