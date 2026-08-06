"use client";

import Link from "next/link";
import { Search, Filter, Eye, Archive, Download, Printer, ChevronLeft, ChevronRight, CheckSquare } from "lucide-react";
import { useState, useMemo } from "react";
import { archiveOrder, bulkUpdateOrderStatus } from "@/lib/services/admin-order.service";

export default function OrderListClient({ initialOrders }: { initialOrders: any[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortOption, setSortOption] = useState("newest");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Bulk Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkAction, setBulkAction] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Filters & Sorting
  const processedOrders = useMemo(() => {
    const filtered = orders.filter(order => {
      let matchesSearch = true;
      if (searchTerm) {
        const s = searchTerm.toLowerCase();
        matchesSearch = order.id.toLowerCase().includes(s) || 
          (order.contact_info?.email && order.contact_info.email.toLowerCase().includes(s)) ||
          (order.contact_info?.name && order.contact_info.name.toLowerCase().includes(s)) ||
          (order.contact_info?.phone && order.contact_info.phone.toLowerCase().includes(s));
      }

      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      const matchesPayment = paymentFilter === "all" || order.payment_status === paymentFilter;
      
      let matchesDate = true;
      if (dateFilter !== "all") {
        const orderDate = new Date(order.created_at);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (dateFilter === "today") {
          matchesDate = orderDate >= today;
        } else if (dateFilter === "7days") {
          const last7 = new Date(today);
          last7.setDate(last7.getDate() - 7);
          matchesDate = orderDate >= last7;
        } else if (dateFilter === "30days") {
          const last30 = new Date(today);
          last30.setDate(last30.getDate() - 30);
          matchesDate = orderDate >= last30;
        }
      }

      return matchesSearch && matchesStatus && matchesPayment && matchesDate;
    });

    // Sort
    filtered.sort((a, b) => {
      if (sortOption === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortOption === "oldest") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (sortOption === "highest") return Number(b.total_amount) - Number(a.total_amount);
      if (sortOption === "lowest") return Number(a.total_amount) - Number(b.total_amount);
      return 0;
    });

    return filtered;
  }, [orders, searchTerm, statusFilter, paymentFilter, dateFilter, sortOption]);

  const totalPages = Math.ceil(processedOrders.length / itemsPerPage);
  const currentOrders = processedOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleArchive = async (id: string) => {
    if (confirm("Are you sure you want to archive this order?")) {
      try {
        await archiveOrder(id);
        setOrders(prev => prev.filter(o => o.id !== id));
      } catch (error: any) {
        alert("Failed to archive order: " + error.message);
      }
    }
  };
  
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const newSelected = new Set(currentOrders.map(o => o.id));
      setSelectedIds(newSelected);
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };
  
  const handleBulkAction = async () => {
    if (selectedIds.size === 0 || !bulkAction) return;
    
    if (bulkAction === "export_csv") {
      exportToCSV();
      return;
    }
    
    if (bulkAction === "print_invoices") {
      selectedIds.forEach(id => {
        window.open(`/admin/orders/${id}?print=true`, '_blank');
      });
      return;
    }

    if (bulkAction.startsWith("status_")) {
      const newStatus = bulkAction.replace("status_", "");
      if (confirm(`Update ${selectedIds.size} orders to ${newStatus}?`)) {
        setIsUpdating(true);
        try {
          await bulkUpdateOrderStatus(Array.from(selectedIds), newStatus);
          // Refresh list locally
          setOrders(prev => prev.map(o => selectedIds.has(o.id) ? { ...o, status: newStatus } : o));
          setSelectedIds(new Set());
          setBulkAction("");
          alert("Orders updated successfully");
        } catch (e: any) {
          alert("Error updating orders");
        } finally {
          setIsUpdating(false);
        }
      }
    }
  };
  
  const exportToCSV = () => {
    const selectedOrders = processedOrders.filter(o => selectedIds.has(o.id));
    if (selectedOrders.length === 0) return;
    
    const csvRows = [
      ["Order ID", "Date", "Customer Name", "Customer Email", "Customer Phone", "Total Amount", "Status", "Payment Status"]
    ];
    
    selectedOrders.forEach(o => {
      csvRows.push([
        o.id,
        new Date(o.created_at).toISOString(),
        o.contact_info?.name || "",
        o.contact_info?.email || "",
        o.contact_info?.phone || "",
        o.total_amount,
        o.status,
        o.payment_status
      ]);
    });
    
    const csvString = csvRows.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders_export_${new Date().getTime()}.csv`;
    a.click();
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'placed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-amber-100 text-amber-800';
      case 'packed': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentColor = (status: string) => {
    switch(status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4">
        
        {/* Top Row: Search & Bulk */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative flex-1 w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by ID, name, email, phone..."
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0D1B2A] focus:ring-1 focus:ring-[#0D1B2A] bg-gray-50 transition-all"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            {selectedIds.size > 0 && (
              <>
                <span className="text-sm font-medium text-gray-600">{selectedIds.size} selected</span>
                <select
                  value={bulkAction}
                  onChange={e => setBulkAction(e.target.value)}
                  className="px-4 py-2 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0D1B2A]"
                >
                  <option value="">Choose bulk action...</option>
                  <optgroup label="Update Status">
                    <option value="status_processing">Mark Processing</option>
                    <option value="status_packed">Mark Packed</option>
                    <option value="status_shipped">Mark Shipped</option>
                    <option value="status_delivered">Mark Delivered</option>
                    <option value="status_cancelled">Mark Cancelled</option>
                  </optgroup>
                  <optgroup label="Other">
                    <option value="print_invoices">Print Invoices</option>
                    <option value="export_csv">Export CSV</option>
                  </optgroup>
                </select>
                <button
                  onClick={handleBulkAction}
                  disabled={!bulkAction || isUpdating}
                  className="px-4 py-2 bg-[#0D1B2A] text-white rounded-xl text-sm font-medium hover:bg-opacity-90 disabled:opacity-50"
                >
                  Apply
                </button>
              </>
            )}
            
            {selectedIds.size === 0 && (
              <button 
                onClick={() => {
                  setSelectedIds(new Set(processedOrders.map(o => o.id)));
                  setBulkAction("export_csv");
                }}
                className="inline-flex items-center justify-center px-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors shrink-0"
              >
                <Download className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Export All</span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom Row: Filters & Sort */}
        <div className="flex flex-wrap items-center gap-3 w-full">
          <select 
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="flex-1 min-w-[140px] px-3 py-2 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0D1B2A]"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="placed">Placed</option>
            <option value="processing">Processing</option>
            <option value="packed">Packed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          
          <select 
            value={paymentFilter}
            onChange={e => { setPaymentFilter(e.target.value); setCurrentPage(1); }}
            className="flex-1 min-w-[140px] px-3 py-2 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0D1B2A]"
          >
            <option value="all">All Payments</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
            <option value="cod">COD</option>
          </select>

          <select 
            value={dateFilter}
            onChange={e => { setDateFilter(e.target.value); setCurrentPage(1); }}
            className="flex-1 min-w-[140px] px-3 py-2 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0D1B2A]"
          >
            <option value="all">Any Date</option>
            <option value="today">Today</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
          </select>

          <select 
            value={sortOption}
            onChange={e => { setSortOption(e.target.value); setCurrentPage(1); }}
            className="flex-1 min-w-[140px] px-3 py-2 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0D1B2A]"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Amount</option>
            <option value="lowest">Lowest Amount</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left">
                  <input 
                    type="checkbox"
                    checked={currentOrders.length > 0 && selectedIds.size === currentOrders.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-[#0D1B2A] focus:ring-[#0D1B2A]"
                  />
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Fulfillment</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
                <th scope="col" className="relative px-6 py-4"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentOrders.map((order: any) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input 
                      type="checkbox"
                      checked={selectedIds.has(order.id)}
                      onChange={() => handleSelectOne(order.id)}
                      className="w-4 h-4 rounded border-gray-300 text-[#0D1B2A] focus:ring-[#0D1B2A]"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link href={`/admin/orders/${order.id}`} className="text-sm font-medium text-[#0D1B2A] hover:underline">
                      #{order.id.split('-')[0].toUpperCase()}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.contact_info?.name || "Unknown"}</div>
                    <div className="text-sm text-gray-500">{order.contact_info?.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ₹{Number(order.total_amount).toFixed(2)}
                    <div className="text-xs text-gray-500 font-normal">{order.order_items?.length || 0} items</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide ${getPaymentColor(order.payment_status)}`}>
                      {order.payment_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/admin/orders/${order.id}`} className="text-gray-400 hover:text-[#0D1B2A] transition-colors" title="View Order">
                        <Eye className="w-5 h-5" />
                      </Link>
                      <button onClick={() => window.open(`/admin/orders/${order.id}?print=true`, '_blank')} className="text-gray-400 hover:text-[#0D1B2A] transition-colors" title="Print Invoice">
                        <Printer className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleArchive(order.id)} className="text-gray-400 hover:text-red-600 transition-colors" title="Archive Order">
                        <Archive className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {currentOrders.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-sm text-gray-500">
                    No orders found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
            <span className="text-sm text-gray-600">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, processedOrders.length)} of {processedOrders.length} entries
            </span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
              <span className="text-sm font-medium text-gray-900">
                Page {currentPage} of {totalPages}
              </span>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

