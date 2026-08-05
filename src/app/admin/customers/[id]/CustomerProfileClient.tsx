"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, User, Mail, Phone, Calendar, Clock, MapPin, Package, ShieldAlert, CheckCircle, Activity, FileText } from "lucide-react";
import { updateCustomerStatus, updateCustomerNotes } from "@/lib/services/admin-customer.service";

export default function CustomerProfileClient({ initialCustomer }: { initialCustomer: any }) {
  const [customer, setCustomer] = useState(initialCustomer);
  const [isUpdating, setIsUpdating] = useState(false);
  const [adminNotes, setAdminNotes] = useState(customer.admin_notes || "");
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    if (!confirm(`Are you sure you want to mark this customer as ${newStatus}?`)) return;
    
    try {
      setIsUpdating(true);
      await updateCustomerStatus(customer.id, newStatus);
      setCustomer({ ...customer, status: newStatus });
    } catch (error: any) {
      alert("Failed to update status: " + error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveNotes = async () => {
    try {
      setIsSavingNotes(true);
      await updateCustomerNotes(customer.id, adminNotes);
      setCustomer({ ...customer, admin_notes: adminNotes });
      alert("Notes saved successfully");
    } catch (error: any) {
      alert("Failed to save notes: " + error.message);
    } finally {
      setIsSavingNotes(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'blocked': return 'bg-red-100 text-red-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch(status) {
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link href="/admin/customers" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-2">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Customers
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">Customer Profile</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column: Identity & Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200 mb-4">
              {customer.avatar_url ? (
                <Image src={customer.avatar_url} alt={customer.full_name} width={96} height={96} className="object-cover w-full h-full" />
              ) : (
                <User className="h-10 w-10 text-gray-400" />
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-900">{customer.full_name}</h2>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${getStatusColor(customer.status || 'active')}`}>
                {customer.status || 'active'}
              </span>
              {customer.segments?.isVIP && (
                <span className="px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-800">VIP</span>
              )}
            </div>
            
            <div className="w-full mt-6 space-y-3 text-left">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Mail className="w-4 h-4 text-gray-400" />
                <a href={`mailto:${customer.email}`} className="hover:text-blue-600 transition-colors truncate">{customer.email}</a>
              </div>
              {customer.mobile && (
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <a href={`tel:${customer.mobile}`} className="hover:text-blue-600 transition-colors">{customer.mobile}</a>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>Joined {new Date(customer.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Clock className="w-4 h-4 text-gray-400" />
                <span>Last login {customer.last_login ? new Date(customer.last_login).toLocaleDateString() : 'Unknown'}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-gray-500" />
              <h3 className="font-semibold text-gray-900">Account Controls</h3>
            </div>
            <div className="p-4 space-y-3">
              {customer.status === 'blocked' ? (
                <button
                  onClick={() => handleStatusChange('active')}
                  disabled={isUpdating}
                  className="w-full py-2 px-4 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" /> Unblock Account
                </button>
              ) : (
                <button
                  onClick={() => handleStatusChange('blocked')}
                  disabled={isUpdating}
                  className="w-full py-2 px-4 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <ShieldAlert className="w-4 h-4" /> Block Account
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Middle Column: Orders & Addresses */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
              <Package className="w-4 h-4 text-gray-500" />
              <h3 className="font-semibold text-gray-900">Order History ({customer.orders?.length || 0})</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {customer.orders?.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((order: any) => (
                <div key={order.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div>
                    <Link href={`/admin/orders/${order.id}`} className="font-semibold text-[#0D1B2A] hover:underline">
                      #{order.id.split('-')[0].toUpperCase()}
                    </Link>
                    <div className="text-sm text-gray-500 mt-1">{new Date(order.created_at).toLocaleDateString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">₹{Number(order.total_amount).toFixed(2)}</div>
                    <div className="mt-1">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getOrderStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {(!customer.orders || customer.orders.length === 0) && (
                <div className="p-8 text-center text-gray-500 text-sm">
                  This customer has not placed any orders yet.
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <h3 className="font-semibold text-gray-900">Saved Addresses</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              {customer.addresses?.map((address: any) => (
                <div key={address.id} className="p-4 border border-gray-200 rounded-xl bg-gray-50 relative">
                  {address.is_default && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold uppercase rounded">Default</span>
                  )}
                  <p className="font-semibold text-gray-900 text-sm">{address.full_name}</p>
                  <p className="text-sm text-gray-600 mt-1">{address.line1}</p>
                  {address.line2 && <p className="text-sm text-gray-600">{address.line2}</p>}
                  <p className="text-sm text-gray-600">{address.city}, {address.state} {address.postal_code}</p>
                  <p className="text-sm text-gray-600">{address.country}</p>
                  <p className="text-sm text-gray-500 mt-2 flex items-center gap-1"><Phone className="w-3 h-3" /> {address.mobile}</p>
                </div>
              ))}
              {(!customer.addresses || customer.addresses.length === 0) && (
                <div className="col-span-full py-4 text-center text-gray-500 text-sm">
                  No saved addresses.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Analytics & Notes */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
              <Activity className="w-4 h-4 text-gray-500" />
              <h3 className="font-semibold text-gray-900">Analytics</h3>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Total Spend</p>
                <p className="text-xl font-bold text-[#0D1B2A]">₹{customer.total_spent?.toLocaleString() || 0}</p>
              </div>
              <div className="border-t border-gray-100 pt-3">
                <p className="text-xs font-medium text-gray-500 uppercase">Average Order Value</p>
                <p className="text-lg font-semibold text-gray-900">₹{customer.aov?.toLocaleString(undefined, {maximumFractionDigits: 0}) || 0}</p>
              </div>
              <div className="border-t border-gray-100 pt-3">
                <p className="text-xs font-medium text-gray-500 uppercase">Highest Order</p>
                <p className="text-lg font-semibold text-gray-900">₹{customer.highest_order?.toLocaleString() || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-500" />
                <h3 className="font-semibold text-gray-900">Internal Notes</h3>
              </div>
              <button 
                onClick={handleSaveNotes}
                disabled={isSavingNotes}
                className="text-xs font-semibold text-[#0D1B2A] hover:underline"
              >
                Save
              </button>
            </div>
            <div className="p-4 flex-1">
              <textarea 
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Private notes about this customer..."
                className="w-full h-full min-h-[150px] p-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0D1B2A] resize-y"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
