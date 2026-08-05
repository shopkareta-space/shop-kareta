"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getAdminOrders(filters?: { status?: string, payment_status?: string, search?: string }) {
  const supabase = await createClient();
  
  let query = supabase
    .from("orders")
    .select(`
      *,
      order_items (id, quantity)
    `)
    .eq("is_archived", false)
    .order("created_at", { ascending: false });

  if (filters?.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }

  if (filters?.payment_status && filters.payment_status !== "all") {
    query = query.eq("payment_status", filters.payment_status);
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
  const supabase = await createClient();
  
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
  return data;
}

export async function getOrderStats() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("orders")
    .select("status, total_amount")
    .eq("is_archived", false);

  if (error) {
    console.error("Error fetching order stats:", error);
    return null;
  }

  const stats = {
    total: data.length,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    revenue: 0
  };

  data.forEach((order: any) => {
    if (order.status === 'pending') stats.pending++;
    if (order.status === 'processing') stats.processing++;
    if (order.status === 'shipped') stats.shipped++;
    if (order.status === 'delivered') {
      stats.delivered++;
      stats.revenue += Number(order.total_amount || 0); // Only count delivered revenue? Or processing? We'll count all non-cancelled.
    }
    if (order.status === 'cancelled') stats.cancelled++;
    
    if (order.status !== 'cancelled' && order.status !== 'delivered') {
       stats.revenue += Number(order.total_amount || 0);
    }
  });

  return stats;
}

export async function updateOrderStatus(id: string, newStatus: string, comment?: string) {
  const supabase = await createClient();
  
  // 1. Get current order
  const { data: order } = await supabase.from("orders").select("status").eq("id", id).single();
  if (!order) throw new Error("Order not found");

  const prevStatus = order.status;
  
  // Validation (Prevent invalid transitions)
  const validTransitions: any = {
    'pending': ['processing', 'cancelled'],
    'processing': ['shipped', 'cancelled'],
    'shipped': ['delivered', 'cancelled'],
    'delivered': ['cancelled'], // Sometimes returns/refunds map to cancelled or a new status
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

  // 3. Log history
  await supabase
    .from("order_status_history")
    .insert([{
      order_id: id,
      previous_status: prevStatus,
      new_status: newStatus,
      comment: comment || `Status updated from ${prevStatus} to ${newStatus}`
    }]);

  revalidatePath(`/admin/orders/${id}`);
  revalidatePath(`/admin/orders`);
}

export async function updatePaymentStatus(id: string, paymentStatus: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("orders")
    .update({ payment_status: paymentStatus })
    .eq("id", id);
    
  if (error) throw error;

  revalidatePath(`/admin/orders/${id}`);
  revalidatePath(`/admin/orders`);
}

export async function updateOrderShipping(id: string, payload: { courier_name?: string, tracking_number?: string, tracking_url?: string, estimated_delivery?: string }) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("orders")
    .update(payload)
    .eq("id", id);
    
  if (error) throw error;

  revalidatePath(`/admin/orders/${id}`);
}

export async function updateOrderNotes(id: string, payload: { admin_notes?: string }) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("orders")
    .update(payload)
    .eq("id", id);
    
  if (error) throw error;

  revalidatePath(`/admin/orders/${id}`);
}

export async function archiveOrder(id: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("orders")
    .update({ is_archived: true })
    .eq("id", id);
    
  if (error) throw error;

  revalidatePath(`/admin/orders`);
}
