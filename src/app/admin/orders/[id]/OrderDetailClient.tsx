"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Printer, FileText, Package, Truck, CheckCircle, Clock, MapPin, CreditCard, ChevronRight, Activity } from "lucide-react";
import Image from "next/image";
import { updateOrderStatus, updatePaymentStatus, updateOrderShipping, updateOrderNotes } from "@/lib/services/admin-order.service";
import { useSearchParams } from "next/navigation";

export default function OrderDetailClient({ initialOrder }: { initialOrder: any }) {
  const [order, setOrder] = useState(initialOrder);
  const searchParams = useSearchParams();
  const isPrint = searchParams.get('print') === 'true';
  const isPackingSlip = searchParams.get('packing_slip') === 'true';

  const [statusUpdating, setStatusUpdating] = useState(false);
  const [shippingUpdating, setShippingUpdating] = useState(false);

  const [shippingData, setShippingData] = useState({
    courier_name: order.courier_name || "",
    tracking_number: order.tracking_number || "",
    tracking_url: order.tracking_url || "",
    estimated_delivery: order.estimated_delivery ? new Date(order.estimated_delivery).toISOString().split('T')[0] : ""
  });

  const [notes, setNotes] = useState({
    admin_notes: order.admin_notes || ""
  });

  useEffect(() => {
    if (isPrint || isPackingSlip) {
      setTimeout(() => {
        window.print();
      }, 500);
    }
  }, [isPrint, isPackingSlip]);

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      setStatusUpdating(true);
      await updateOrderStatus(order.id, newStatus);
      setOrder({ ...order, status: newStatus });
      window.location.reload();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setStatusUpdating(false);
    }
  };

  const handlePaymentUpdate = async (newStatus: string) => {
    try {
      await updatePaymentStatus(order.id, newStatus);
      setOrder({ ...order, payment_status: newStatus });
      window.location.reload();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleShippingUpdate = async () => {
    try {
      setShippingUpdating(true);
      await updateOrderShipping(order.id, shippingData);
      setOrder({ ...order, ...shippingData });
      alert("Shipping info updated!");
      window.location.reload();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setShippingUpdating(false);
    }
  };

  const handleNotesUpdate = async () => {
    try {
      await updateOrderNotes(order.id, notes);
      alert("Notes updated!");
      window.location.reload();
    } catch (error: any) {
      alert(error.message);
    }
  };

  if (isPrint || isPackingSlip) {
    return (
      <div className="bg-white p-8 max-w-4xl mx-auto text-black">
        <div className="flex justify-between items-start border-b pb-6 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#0D1B2A]">{isPackingSlip ? 'PACKING SLIP' : 'INVOICE'}</h1>
            <p className="text-gray-500 mt-1">Order #{order.id.split('-')[0].toUpperCase()}</p>
            <p className="text-sm text-gray-500">Date: {new Date(order.created_at).toLocaleDateString()}</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-[#0D1B2A]">Shop Kareta</h2>
            <p className="text-sm text-gray-600">123 Wellness Avenue</p>
            <p className="text-sm text-gray-600">New Delhi, 110001, India</p>
            <p className="text-sm text-gray-600">support@shopkareta.com</p>
          </div>
        </div>

        <div className="flex justify-between mb-8">
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-2">Billed To</h3>
            <p className="font-medium text-gray-900">{order.contact_info?.name}</p>
            <p className="text-gray-600 text-sm">{order.contact_info?.email}</p>
            <p className="text-gray-600 text-sm">{order.contact_info?.phone}</p>
          </div>
          <div className="text-right">
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-2">Shipped To</h3>
            <p className="font-medium text-gray-900">{order.shipping_address?.full_name}</p>
            <p className="text-gray-600 text-sm">{order.shipping_address?.line1}</p>
            {order.shipping_address?.line2 && <p className="text-gray-600 text-sm">{order.shipping_address?.line2}</p>}
            <p className="text-gray-600 text-sm">
              {order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.postal_code}
            </p>
          </div>
        </div>

        <table className="w-full mb-8">
          <thead className="bg-gray-50 border-y border-gray-200">
            <tr>
              <th className="py-3 text-left text-sm font-semibold text-gray-600 uppercase">Item</th>
              <th className="py-3 text-center text-sm font-semibold text-gray-600 uppercase">Qty</th>
              {!isPackingSlip && <th className="py-3 text-right text-sm font-semibold text-gray-600 uppercase">Price</th>}
              {!isPackingSlip && <th className="py-3 text-right text-sm font-semibold text-gray-600 uppercase">Total</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {order.order_items?.map((item: any) => (
              <tr key={item.id}>
                <td className="py-4">
                  <p className="font-medium text-gray-900">{item.product_name}</p>
                  {item.variant_name && <p className="text-sm text-gray-500">{item.variant_name}</p>}
                </td>
                <td className="py-4 text-center text-gray-600">{item.quantity}</td>
                {!isPackingSlip && <td className="py-4 text-right text-gray-600">₹{Number(item.price).toFixed(2)}</td>}
                {!isPackingSlip && <td className="py-4 text-right font-medium text-gray-900">₹{(Number(item.price) * item.quantity).toFixed(2)}</td>}
              </tr>
            ))}
          </tbody>
        </table>

        {!isPackingSlip && (
          <div className="flex justify-end">
            <div className="w-64 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">₹{Number(order.total_amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-gray-900">₹0.00</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-3">
                <span className="text-gray-900">Total</span>
                <span className="text-[#0D1B2A]">₹{Number(order.total_amount).toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending':
      case 'placed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-amber-100 text-amber-800';
      case 'packed': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const nextStatusOptions: any = {
    'pending': ['processing', 'cancelled'],
    'placed': ['processing', 'cancelled'],
    'processing': ['packed', 'cancelled'],
    'packed': ['shipped', 'cancelled'],
    'shipped': ['delivered', 'cancelled'],
    'delivered': ['cancelled'],
    'cancelled': []
  };

  const getStatusLabel = (status: string) => {
    if (status === 'shipped') return 'Out for Delivery';
    return status;
  };

  // Separate order timeline (status changes only) from full audit log
  const statusHistory = order.order_status_history?.filter((h: any) => h.previous_status !== 'same') || [];
  const fullAuditLog = order.order_status_history || [];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link href="/admin/orders" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-2">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Orders
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 font-heading">Order #{order.id.split('-')[0].toUpperCase()}</h1>
            <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
              {getStatusLabel(order.status)}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">{new Date(order.created_at).toLocaleString()}</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => window.open(`?packing_slip=true`, '_blank')} className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
            <Package className="w-4 h-4 mr-2" /> Print Packing Slip
          </button>
          <Link href={`/invoice/${order.id}`} target="_blank" className="inline-flex items-center px-4 py-2 bg-[#0D1B2A] border border-transparent text-white rounded-xl text-sm font-medium hover:bg-opacity-90 transition-colors">
            <Printer className="w-4 h-4 mr-2" /> Download Invoice PDF
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Order Items */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">Ordered Items ({order.order_items?.length || 0})</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {order.order_items?.map((item: any) => (
                <div key={item.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden relative flex-shrink-0 border border-gray-200">
                    {item.image ? (
                      <Image src={item.image} alt={item.product_name} fill className="object-cover" />
                    ) : (
                      <Package className="w-6 h-6 text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{item.product_name}</h4>
                    {item.variant_name && <p className="text-sm text-gray-500">{item.variant_name}</p>}
                    <p className="text-sm font-medium text-gray-900 mt-1">₹{Number(item.price).toFixed(2)} × {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">₹{(Number(item.price) * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Totals */}
            <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">₹{Number(order.total_amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-gray-900">₹0.00</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200 mt-2">
                  <span>Total</span>
                  <span className="text-[#0D1B2A]">₹{Number(order.total_amount).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-6">Order Timeline</h3>
            <div className="relative border-l-2 border-gray-100 pl-6 space-y-8 ml-3">
              {statusHistory.map((history: any, index: number) => {
                const date = new Date(history.created_at);
                // Try to extract admin email if present (usually appended in parentheses)
                const adminMatch = history.comment?.match(/\(by (.*?)\)/);
                const adminEmail = adminMatch ? adminMatch[1] : 'System';
                
                return (
                  <div key={history.id} className="relative">
                    <div className="absolute -left-[35px] top-1 w-4 h-4 rounded-full bg-[#0D1B2A] border-4 border-white shadow-sm" />
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Status changed to <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${getStatusColor(history.new_status)}`}>{getStatusLabel(history.new_status)}</span>
                        </p>
                        <p className="text-xs font-medium text-gray-500 mt-1">
                          {date.toLocaleDateString()} at {date.toLocaleTimeString()} • <span className="text-blue-600">{adminEmail}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* Initial Event */}
              <div className="relative">
                <div className="absolute -left-[35px] top-1 w-4 h-4 rounded-full bg-gray-300 border-4 border-white shadow-sm" />
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Order Placed</p>
                    <p className="text-xs font-medium text-gray-500 mt-1">
                      {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()} • Customer
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Audit Log */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
              <Activity className="w-4 h-4 text-gray-500" />
              <h3 className="font-semibold text-gray-900">Audit Log</h3>
            </div>
            <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
              {fullAuditLog.map((log: any) => {
                const date = new Date(log.created_at);
                return (
                  <div key={log.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <p className="text-sm text-gray-900 font-medium">{log.comment}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                      <span>{date.toLocaleDateString()} {date.toLocaleTimeString()}</span>
                      {log.previous_status !== 'same' && (
                        <>
                          <span>•</span>
                          <span>{log.previous_status} → {log.new_status}</span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
              {fullAuditLog.length === 0 && (
                <div className="p-4 text-center text-sm text-gray-500">No activity logged yet.</div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Update Status</h3>
            <div className="flex flex-wrap gap-2">
              {nextStatusOptions[order.status]?.map((status: string) => (
                <button
                  key={status}
                  onClick={() => handleStatusUpdate(status)}
                  disabled={statusUpdating}
                  className="flex-1 min-w-[120px] py-2 px-3 text-sm font-medium bg-gray-50 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors capitalize text-center"
                >
                  Mark as {getStatusLabel(status)}
                </button>
              ))}
              {nextStatusOptions[order.status]?.length === 0 && (
                <p className="text-sm text-gray-500 italic">No further status transitions available.</p>
              )}
            </div>
          </div>

          {/* Customer & Shipping Address */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <h3 className="font-semibold text-gray-900">Customer & Shipping</h3>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase mb-1">Contact Information</p>
                <p className="text-sm font-medium text-gray-900">{order.contact_info?.name}</p>
                <a href={`mailto:${order.contact_info?.email}`} className="text-sm text-blue-600 hover:underline block mt-0.5">{order.contact_info?.email}</a>
                <a href={`tel:${order.contact_info?.phone}`} className="text-sm text-gray-600 hover:underline block mt-0.5">{order.contact_info?.phone}</a>
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-500 uppercase mb-1">Shipping Address</p>
                <p className="text-sm font-medium text-gray-900">{order.shipping_address?.full_name}</p>
                <p className="text-sm text-gray-600 mt-0.5">{order.shipping_address?.line1}</p>
                {order.shipping_address?.line2 && <p className="text-sm text-gray-600 mt-0.5">{order.shipping_address?.line2}</p>}
                <p className="text-sm text-gray-600 mt-0.5">
                  {order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.postal_code}
                </p>
                <p className="text-sm text-gray-600 mt-0.5">{order.shipping_address?.country}</p>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-gray-500" />
              <h3 className="font-semibold text-gray-900">Payment Details</h3>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Method</span>
                <span className="text-sm font-medium text-gray-900 uppercase">{order.payment_method}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status</span>
                <select 
                  value={order.payment_status}
                  onChange={(e) => handlePaymentUpdate(e.target.value)}
                  className="text-sm font-medium bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-[#0D1B2A]"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                  <option value="cod">COD</option>
                </select>
              </div>
            </div>
          </div>

          {/* Shipping & Tracking */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-gray-500" />
                <h3 className="font-semibold text-gray-900">Shipping Info</h3>
              </div>
              <button 
                onClick={handleShippingUpdate}
                disabled={shippingUpdating}
                className="text-xs font-semibold text-[#0D1B2A] hover:underline"
              >
                Save
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Courier Name</label>
                <input 
                  type="text" 
                  value={shippingData.courier_name}
                  onChange={e => setShippingData({...shippingData, courier_name: e.target.value})}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0D1B2A]"
                  placeholder="e.g. BlueDart"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Tracking Number</label>
                <input 
                  type="text" 
                  value={shippingData.tracking_number}
                  onChange={e => setShippingData({...shippingData, tracking_number: e.target.value})}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0D1B2A]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Tracking URL</label>
                <input 
                  type="url" 
                  value={shippingData.tracking_url}
                  onChange={e => setShippingData({...shippingData, tracking_url: e.target.value})}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0D1B2A]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Estimated Delivery</label>
                <input 
                  type="date" 
                  value={shippingData.estimated_delivery}
                  onChange={e => setShippingData({...shippingData, estimated_delivery: e.target.value})}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0D1B2A]"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-500" />
                <h3 className="font-semibold text-gray-900">Notes</h3>
              </div>
              <button 
                onClick={handleNotesUpdate}
                className="text-xs font-semibold text-[#0D1B2A] hover:underline"
              >
                Save
              </button>
            </div>
            <div className="p-5 space-y-4">
              {order.customer_notes && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Customer Notes</label>
                  <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    {order.customer_notes}
                  </div>
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Admin Notes (Internal)</label>
                <textarea 
                  rows={4}
                  value={notes.admin_notes}
                  onChange={e => setNotes({ admin_notes: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0D1B2A]"
                  placeholder="Private notes about this order..."
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
