"use client";

import { useState, useMemo, useEffect } from "react";
import { useOrderStore, OrderStatus } from "@/store/orderStore";
import { OrderCard } from "@/components/account/OrderCard";
import { EmptyState } from "@/components/account/EmptyState";
import { ShoppingBag, Search, Filter, ChevronLeft, ChevronRight, Package, Truck, CheckCircle2, XCircle } from "lucide-react";
import BlurFade from "@/components/ui/blur-fade";

type SortOption = "newest" | "oldest" | "highest" | "lowest";

export default function OrdersPage() {
  const { orders, isLoading, fetchOrders, subscribeToOrders, unsubscribeFromOrders } = useOrderStore();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchOrders();
    subscribeToOrders();
    return () => {
      unsubscribeFromOrders();
    };
  }, [fetchOrders, subscribeToOrders, unsubscribeFromOrders]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, sortOption]);

  const filteredAndSortedOrders = useMemo(() => {
    let result = [...orders];

    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter(order => order.status === statusFilter);
    }

    // Filter by search query (order ID or product name)
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(order => {
        const matchId = order.id.toLowerCase().includes(query);
        const matchProducts = order.items.some(item => item.name.toLowerCase().includes(query));
        return matchId || matchProducts;
      });
    }

    // Sort
    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      
      switch (sortOption) {
        case "newest":
          return dateB - dateA;
        case "oldest":
          return dateA - dateB;
        case "highest":
          return b.total - a.total;
        case "lowest":
          return a.total - b.total;
        default:
          return 0;
      }
    });

    return result;
  }, [orders, searchQuery, statusFilter, sortOption]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedOrders.length / itemsPerPage));
  const paginatedOrders = filteredAndSortedOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Summary stats
  const totalOrdersCount = orders.length;
  const activeOrdersCount = orders.filter(o => ["placed", "processing", "packed", "shipped"].includes(o.status)).length;
  const deliveredOrdersCount = orders.filter(o => o.status === "delivered").length;
  const cancelledOrdersCount = orders.filter(o => o.status === "cancelled").length;

  return (
    <div className="space-y-8">
      <BlurFade delay={0.1}>
        <div className="border-b border-brand-gray/10 pb-6">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-brand-blue mb-2">
            My Orders
          </h1>
          <p className="text-brand-gray">
            Track, manage and review all your purchases.
          </p>
        </div>
      </BlurFade>

      {/* Summary Cards */}
      <BlurFade delay={0.2}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-brand-gray/10 rounded-2xl p-4 sm:p-6 shadow-sm">
            <div className="flex items-center gap-3 text-brand-gray mb-2">
              <Package className="w-5 h-5" />
              <span className="font-medium text-sm">Total Orders</span>
            </div>
            <p className="text-2xl sm:text-3xl font-heading font-bold text-brand-blue">{totalOrdersCount}</p>
          </div>
          <div className="bg-white border border-brand-gray/10 rounded-2xl p-4 sm:p-6 shadow-sm">
            <div className="flex items-center gap-3 text-blue-500 mb-2">
              <Truck className="w-5 h-5" />
              <span className="font-medium text-sm text-brand-gray">Active</span>
            </div>
            <p className="text-2xl sm:text-3xl font-heading font-bold text-brand-blue">{activeOrdersCount}</p>
          </div>
          <div className="bg-white border border-brand-gray/10 rounded-2xl p-4 sm:p-6 shadow-sm">
            <div className="flex items-center gap-3 text-brand-green mb-2">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium text-sm text-brand-gray">Delivered</span>
            </div>
            <p className="text-2xl sm:text-3xl font-heading font-bold text-brand-blue">{deliveredOrdersCount}</p>
          </div>
          <div className="bg-white border border-brand-gray/10 rounded-2xl p-4 sm:p-6 shadow-sm">
            <div className="flex items-center gap-3 text-red-500 mb-2">
              <XCircle className="w-5 h-5" />
              <span className="font-medium text-sm text-brand-gray">Cancelled</span>
            </div>
            <p className="text-2xl sm:text-3xl font-heading font-bold text-brand-blue">{cancelledOrdersCount}</p>
          </div>
        </div>
      </BlurFade>

      {/* Search and Filters */}
      <BlurFade delay={0.3}>
        <div className="bg-white rounded-3xl border border-brand-gray/10 p-4 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gray/50" />
              <input 
                type="text" 
                placeholder="Search by order number or product name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-brand-light rounded-xl border border-transparent focus:border-brand-blue/20 focus:bg-white outline-none transition-all text-sm font-medium"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <select 
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                  className="appearance-none pl-4 pr-10 py-3 bg-brand-light rounded-xl border border-transparent focus:border-brand-blue/20 focus:bg-white outline-none transition-all text-sm font-medium text-brand-blue min-w-[150px]"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest">Highest Amount</option>
                  <option value="lowest">Lowest Amount</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Filter className="w-4 h-4 text-brand-gray" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 gap-2 no-scrollbar">
            {["all", "placed", "processing", "packed", "shipped", "delivered", "cancelled"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status as OrderStatus | "all")}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  statusFilter === status 
                    ? "bg-brand-blue text-white" 
                    : "bg-brand-gray/5 text-brand-gray hover:bg-brand-gray/10 hover:text-brand-blue"
                }`}
              >
                {status === "shipped" ? "Out for Delivery" : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </BlurFade>

      <BlurFade delay={0.4}>
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-brand-green/30 border-t-brand-green rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <EmptyState 
            icon={ShoppingBag}
            title="No Orders Yet"
            description="You haven't placed any orders yet. Start exploring our premium wellness collection."
            actionLabel="Start Shopping"
            actionHref="/shop"
          />
        ) : filteredAndSortedOrders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-brand-gray/10 shadow-sm">
            <div className="w-16 h-16 bg-brand-gray/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-brand-gray/50" />
            </div>
            <h3 className="text-lg font-bold text-brand-blue mb-2">No matches found</h3>
            <p className="text-brand-gray">Try adjusting your search or filters.</p>
            <button 
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}
              className="mt-4 text-brand-green font-semibold hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
            
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-6 border-t border-brand-gray/10">
                <p className="text-sm text-brand-gray font-medium">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedOrders.length)} of {filteredAndSortedOrders.length} orders
                </p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-brand-gray/20 hover:border-brand-blue/30 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-brand-blue" />
                  </button>
                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-brand-gray/20 hover:border-brand-blue/30 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-brand-blue" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </BlurFade>
    </div>
  );
}
