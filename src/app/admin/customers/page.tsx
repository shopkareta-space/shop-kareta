import { getAdminCustomers, getCustomerStats } from "@/lib/services/admin-customer.service";
import CustomerListClient from "./CustomerListClient";
import { Users, UserPlus, UserCheck, UserX, DollarSign, Activity } from "lucide-react";

export default async function AdminCustomersPage() {
  const [customers, stats] = await Promise.all([
    getAdminCustomers(),
    getCustomerStats()
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 font-heading">Customers</h2>
        <p className="text-sm text-gray-500">Manage customer accounts and analyze segments.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-xs font-medium text-gray-500 uppercase">Total Customers</p>
            <Users className="w-4 h-4 text-[#0D1B2A]" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">{stats?.total || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-xs font-medium text-gray-500 uppercase">New This Month</p>
            <UserPlus className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">{stats?.newThisMonth || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-xs font-medium text-gray-500 uppercase">Active</p>
            <UserCheck className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">{stats?.active || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-xs font-medium text-gray-500 uppercase">Blocked</p>
            <UserX className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">{stats?.blocked || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-xs font-medium text-gray-500 uppercase">Total Revenue</p>
            <DollarSign className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-xl font-bold text-gray-900 mt-2">₹{stats?.revenue?.toLocaleString() || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-xs font-medium text-gray-500 uppercase">Avg Order Val</p>
            <Activity className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-xl font-bold text-gray-900 mt-2">₹{stats?.aov?.toLocaleString(undefined, {maximumFractionDigits:0}) || 0}</p>
        </div>
      </div>

      <CustomerListClient initialCustomers={customers || []} />
    </div>
  );
}
