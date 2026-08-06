"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import React from "react";
import { notificationService } from "@/lib/notifications/email/services/NotificationService";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Initialize Supabase admin client — requires SUPABASE_SERVICE_ROLE_KEY
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL is missing. Admin actions cannot execute.");
}
if (!supabaseServiceKey) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY is missing. Admin actions cannot execute.");
}

const supabaseAdmin = createSupabaseClient(supabaseUrl, supabaseServiceKey);

// Helper to verify admin access and get current admin email for logging
async function verifyAdminAccess() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    throw new Error("Forbidden: Admin access required");
  }

  return user.email || "System/Unknown Admin";
}

export async function getAdminOrders(filters?: { 
  status?: string, 
  payment_status?: string, 
  search?: string,
  date_range?: string,
  custom_start?: string,
  custom_end?: string
}) {
  await verifyAdminAccess();
  const supabase = supabaseAdmin;
  
  let query = supabase
    .from("orders")
    .select(`
      *,
      order_items (id, quantity)
    `)
    .or("is_archived.eq.false,is_archived.is.null")
    .order("created_at", { ascending: false });

  if (filters?.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }

  if (filters?.payment_status && filters.payment_status !== "all") {
    query = query.eq("payment_status", filters.payment_status);
  }

  if (filters?.date_range) {
    const today = new Date();
    if (filters.date_range === 'today') {
      today.setHours(0, 0, 0, 0);
      query = query.gte("created_at", today.toISOString());
    } else if (filters.date_range === '7days') {
      const last7 = new Date();
      last7.setDate(last7.getDate() - 7);
      query = query.gte("created_at", last7.toISOString());
    } else if (filters.date_range === '30days') {
      const last30 = new Date();
      last30.setDate(last30.getDate() - 30);
      query = query.gte("created_at", last30.toISOString());
    } else if (filters.date_range === 'custom' && filters.custom_start && filters.custom_end) {
      query = query.gte("created_at", filters.custom_start).lte("created_at", filters.custom_end);
    }
  }

  // Very basic search simulation (JSONB searching requires specific syntaxes in Supabase but we'll try)
  // For production, a dedicated text-search column or edge function is better.
  if (filters?.search) {
    query = query.textSearch('contact_info->>email', filters.search, { type: 'websearch' });
    // Note: Due to limitations of simple REST filtering on JSONB, complex text searches might require an RPC.
    // For this prototype, if it fails, we fall back to a simple fetch and filter.
  }

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
  
  let filteredData = data;
  if (filters?.search) {
    const s = filters.search.toLowerCase();
    filteredData = data.filter((o: any) => 
      o.id.toLowerCase().includes(s) || 
      (o.contact_info?.email && o.contact_info.email.toLowerCase().includes(s)) ||
      (o.contact_info?.name && o.contact_info.name.toLowerCase().includes(s)) ||
      (o.contact_info?.phone && o.contact_info.phone.toLowerCase().includes(s))
    );
  }

  return filteredData;
}

export async function getAdminOrder(id: string) {
  await verifyAdminAccess();
  const supabase = supabaseAdmin;
  
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (*),
      order_status_history (*)
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching order:", error);
    return null;
  }
  
  // Sort history newest first
  if (data.order_status_history) {
    data.order_status_history.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
  
  return data;
}

export async function getOrderStats() {
  await verifyAdminAccess();
  const supabase = supabaseAdmin;
  
  const { data, error } = await supabase
    .from("orders")
    .select("status, total_amount, created_at")
    .or("is_archived.eq.false,is_archived.is.null");

  if (error) {
    console.error("Error fetching order stats:", error);
    return null;
  }

  const stats = {
    total: data.length,
    pending: 0,
    processing: 0,
    packed: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    revenue: 0,
    today_revenue: 0,
    avg_order_value: 0
  };

  const todayStr = new Date().toISOString().split('T')[0];

  data.forEach((order: any) => {
    if (order.status === 'placed' || order.status === 'pending') stats.pending++;
    if (order.status === 'processing') stats.processing++;
    if (order.status === 'packed') stats.packed++;
    if (order.status === 'shipped') stats.shipped++;
    if (order.status === 'delivered') stats.delivered++;
    if (order.status === 'cancelled') stats.cancelled++;
    
    if (order.status !== 'cancelled') {
       const amount = Number(order.total_amount || 0);
       stats.revenue += amount;
       
       if (order.created_at && order.created_at.startsWith(todayStr)) {
         stats.today_revenue += amount;
       }
    }
  });
  
  const nonCancelledCount = data.length - stats.cancelled;
  if (nonCancelledCount > 0) {
    stats.avg_order_value = stats.revenue / nonCancelledCount;
  }

  return stats;
}

export async function updateOrderStatus(id: string, newStatus: string, comment?: string) {
  const adminEmail = await verifyAdminAccess();
  const supabase = supabaseAdmin;
  
  // 1. Get current order
  const { data: order } = await supabase.from("orders").select("status").eq("id", id).single();
  if (!order) throw new Error("Order not found");

  const prevStatus = order.status;
  
  if (prevStatus === newStatus) return; // No change
  
  // Validation (Prevent invalid transitions)
  const validTransitions: any = {
    'placed': ['processing', 'cancelled'],
    'pending': ['processing', 'cancelled'],
    'processing': ['packed', 'cancelled'],
    'packed': ['shipped', 'cancelled'],
    'shipped': ['delivered', 'cancelled'],
    'delivered': ['cancelled'],
    'cancelled': []
  };

  if (!validTransitions[prevStatus]?.includes(newStatus)) {
    throw new Error(`Invalid status transition from ${prevStatus} to ${newStatus}`);
  }

  // 2. Update status
  const { error } = await supabase
    .from("orders")
    .update({ status: newStatus })
    .eq("id", id);
    
  if (error) throw error;

  // Restore inventory if admin cancels the order
  if (newStatus === "cancelled") {
    const { data: items } = await supabase
      .from("order_items")
      .select("product_id, quantity")
      .eq("order_id", id);
      
    if (items && items.length > 0) {
      for (const item of items) {
        if (item.product_id) {
          const { data: product } = await supabase
            .from("products")
            .select("inventory_count")
            .eq("id", item.product_id)
            .single();

          if (product) {
            const restoredInventory = (product.inventory_count || 0) + item.quantity;
            await supabase
              .from("products")
              .update({ inventory_count: restoredInventory })
              .eq("id", item.product_id);
          }
        }
      }
    }
  }

  // Send status notification email
  if (["processing", "packed", "shipped", "delivered", "cancelled"].includes(newStatus)) {
    const { data: fullOrder } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();
      
    if (fullOrder && fullOrder.contact_info?.email) {
      try {
        await notificationService.sendOrderStatus(
          fullOrder.contact_info.email,
          fullOrder.contact_info.name || fullOrder.contact_info.firstName,
          fullOrder.id,
          newStatus,
          fullOrder.tracking_number,
          fullOrder.courier_name,
          fullOrder.tracking_url
        );
      } catch (err) {
        console.error("Failed to queue status email", err);
      }
    }
  }

  // 3. Log history
  await supabase
    .from("order_status_history")
    .insert([{
      order_id: id,
      previous_status: prevStatus,
      new_status: newStatus,
      comment: (comment || `Status updated from ${prevStatus} to ${newStatus}`) + ` (by ${adminEmail})`
    }]);

  revalidatePath(`/admin/orders/${id}`);
  revalidatePath(`/admin/orders`);
}

export async function bulkUpdateOrderStatus(ids: string[], newStatus: string) {
  if (!ids || ids.length === 0) return;
  for (const id of ids) {
    try {
      await updateOrderStatus(id, newStatus, `Bulk status update`);
    } catch (err: any) {
      console.error(`Failed to bulk update order ${id}: ${err.message}`);
    }
  }
}

export async function updatePaymentStatus(id: string, paymentStatus: string) {
  const adminEmail = await verifyAdminAccess();
  const supabase = supabaseAdmin;
  
  const { data: order } = await supabase.from("orders").select("payment_status").eq("id", id).single();
  const prevStatus = order?.payment_status || 'unknown';

  const { error } = await supabase
    .from("orders")
    .update({ payment_status: paymentStatus })
    .eq("id", id);
    
  if (error) throw error;
  
  await supabase
    .from("order_status_history")
    .insert([{
      order_id: id,
      previous_status: prevStatus,
      new_status: paymentStatus,
      comment: `Payment status updated from ${prevStatus} to ${paymentStatus} (by ${adminEmail})`
    }]);

  revalidatePath(`/admin/orders/${id}`);
  revalidatePath(`/admin/orders`);
}

export async function updateOrderShipping(id: string, payload: { courier_name?: string, tracking_number?: string, tracking_url?: string, estimated_delivery?: string }) {
  const adminEmail = await verifyAdminAccess();
  const supabase = supabaseAdmin;
  
  const { error } = await supabase
    .from("orders")
    .update(payload)
    .eq("id", id);
    
  if (error) throw error;
  
  await supabase
    .from("order_status_history")
    .insert([{
      order_id: id,
      previous_status: 'same',
      new_status: 'same',
      comment: `Shipping information updated (by ${adminEmail})`
    }]);

  revalidatePath(`/admin/orders/${id}`);
}

export async function updateOrderNotes(id: string, payload: { admin_notes?: string }) {
  const adminEmail = await verifyAdminAccess();
  const supabase = supabaseAdmin;
  
  const { error } = await supabase
    .from("orders")
    .update(payload)
    .eq("id", id);
    
  if (error) throw error;
  
  await supabase
    .from("order_status_history")
    .insert([{
      order_id: id,
      previous_status: 'same',
      new_status: 'same',
      comment: `Admin notes updated (by ${adminEmail})`
    }]);

  revalidatePath(`/admin/orders/${id}`);
}

export async function archiveOrder(id: string) {
  const adminEmail = await verifyAdminAccess();
  const supabase = supabaseAdmin;
  
  const { error } = await supabase
    .from("orders")
    .update({ is_archived: true })
    .eq("id", id);
    
  if (error) throw error;
  
  await supabase
    .from("order_status_history")
    .insert([{
      order_id: id,
      previous_status: 'same',
      new_status: 'archived',
      comment: `Order archived (by ${adminEmail})`
    }]);

  revalidatePath(`/admin/orders`);
}

