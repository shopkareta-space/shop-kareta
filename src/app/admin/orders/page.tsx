import { getAdminOrders, getOrderStats } from "@/lib/services/admin-order.service";
import OrderListClient from "./OrderListClient";
import { Package, Truck, CheckCircle, XCircle, Clock, DollarSign } from "lucide-react";

export default async function AdminOrdersPage() {
  const [orders, stats] = await Promise.all([
    getAdminOrders(),
    getOrderStats()
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 font-heading">Orders</h2>
        <p className="text-sm text-gray-500">Manage and fulfill customer orders.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-xs font-medium text-gray-500 uppercase">Total Orders</p>
            <Package className="w-4 h-4 text-[#0D1B2A]" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">{stats?.total || 0}</p>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-xs font-medium text-gray-500 uppercase">Pending</p>
            <Clock className="w-4 h-4 text-yellow-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">{stats?.pending || 0}</p>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-xs font-medium text-gray-500 uppercase">Processing</p>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">{stats?.processing || 0}</p>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-xs font-medium text-gray-500 uppercase">Packed</p>
            <Package className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">{stats?.packed || 0}</p>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-xs font-medium text-gray-500 uppercase">Shipped</p>
            <Truck className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">{stats?.shipped || 0}</p>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-xs font-medium text-gray-500 uppercase">Delivered</p>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">{stats?.delivered || 0}</p>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-xs font-medium text-gray-500 uppercase">Cancelled</p>
            <XCircle className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">{stats?.cancelled || 0}</p>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-xs font-medium text-gray-500 uppercase">Today's Rev.</p>
            <DollarSign className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">₹{stats?.today_revenue?.toLocaleString() || 0}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-xs font-medium text-gray-500 uppercase">Total Rev.</p>
            <DollarSign className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">₹{stats?.revenue?.toLocaleString() || 0}</p>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-xs font-medium text-gray-500 uppercase">Avg Value</p>
            <DollarSign className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">₹{Math.round(stats?.avg_order_value || 0).toLocaleString()}</p>
        </div>
      </div>

      <OrderListClient initialOrders={orders || []} />
    </div>
  );
}
