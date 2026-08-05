"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Type definitions
export interface CustomerSegment {
  isNew: boolean;
  isReturning: boolean;
  isVIP: boolean;
  isInactive: boolean;
}

export interface CustomerStats {
  total: number;
  newThisMonth: number;
  active: number;
  blocked: number;
  revenue: number;
  aov: number;
}

function calculateSegments(profile: any, orders: any[]): CustomerSegment {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const createdAt = new Date(profile.created_at);
  const lastLogin = profile.last_login ? new Date(profile.last_login) : createdAt;

  const validOrders = orders.filter(o => o.status !== 'cancelled');
  const totalSpend = validOrders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0);

  const isNew = createdAt > thirtyDaysAgo;
  const isReturning = validOrders.length > 1;
  const isVIP = totalSpend > 10000 || validOrders.length > 5;
  const isInactive = validOrders.length === 0 && lastLogin < ninetyDaysAgo;

  return { isNew, isReturning, isVIP, isInactive };
}

export async function getAdminCustomers(filters?: { status?: string, search?: string }) {
  const supabase = await createClient();
  
  let query = supabase
    .from("profiles")
    .select(`
      *,
      orders (id, total_amount, status, created_at)
    `)
    .order("created_at", { ascending: false });

  if (filters?.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }

  const { data, error } = await query;
  
  if (error) {
    console.error("Error fetching customers:", error);
    return [];
  }

  let enrichedData = data.map(profile => {
    const validOrders = (profile.orders || []).filter((o: any) => o.status !== 'cancelled');
    const totalSpend = validOrders.reduce((sum: number, order: any) => sum + Number(order.total_amount || 0), 0);
    
    // Find last order
    let lastOrder = null;
    if (profile.orders && profile.orders.length > 0) {
      lastOrder = [...profile.orders].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
    }

    const segments = calculateSegments(profile, profile.orders || []);

    return {
      ...profile,
      total_orders: profile.orders?.length || 0,
      total_spent: totalSpend,
      last_order: lastOrder,
      segments
    };
  });

  if (filters?.search) {
    const s = filters.search.toLowerCase();
    enrichedData = enrichedData.filter((c: any) => 
      (c.full_name && c.full_name.toLowerCase().includes(s)) || 
      (c.email && c.email.toLowerCase().includes(s)) ||
      (c.mobile && c.mobile.toLowerCase().includes(s))
    );
  }

  return enrichedData;
}

export async function getCustomerStats(): Promise<CustomerStats> {
  const supabase = await createClient();
  
  // We need to fetch profiles and all non-cancelled orders for accurate AOV and Revenue
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, status, created_at");

  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("total_amount")
    .neq("status", "cancelled");

  if (profilesError || ordersError) {
    console.error("Error fetching stats:", profilesError || ordersError);
    return { total: 0, newThisMonth: 0, active: 0, blocked: 0, revenue: 0, aov: 0 };
  }

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  let newThisMonth = 0;
  let active = 0;
  let blocked = 0;

  profiles.forEach(p => {
    if (new Date(p.created_at) > thirtyDaysAgo) newThisMonth++;
    if (p.status === 'blocked') blocked++;
    else if (p.status === 'active') active++;
  });

  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0);
  const aov = orders.length > 0 ? totalRevenue / orders.length : 0;

  return {
    total: profiles.length,
    newThisMonth,
    active,
    blocked,
    revenue: totalRevenue,
    aov
  };
}

export async function getAdminCustomer(id: string) {
  const supabase = await createClient();
  
  const { data: profile, error } = await supabase
    .from("profiles")
    .select(`
      *,
      orders (
        *,
        order_items (*)
      ),
      addresses (*)
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching customer:", error);
    return null;
  }

  const validOrders = (profile.orders || []).filter((o: any) => o.status !== 'cancelled');
  const totalSpend = validOrders.reduce((sum: number, order: any) => sum + Number(order.total_amount || 0), 0);
  const highestOrder = validOrders.length > 0 ? Math.max(...validOrders.map((o: any) => Number(o.total_amount || 0))) : 0;
  const aov = validOrders.length > 0 ? totalSpend / validOrders.length : 0;
  
  const segments = calculateSegments(profile, profile.orders || []);

  // Calculate most purchased category and brand if we had full product data, 
  // but for now we will skip or mock it, as order_items doesn't denormalize brand/category name natively.

  return {
    ...profile,
    total_orders: profile.orders?.length || 0,
    total_spent: totalSpend,
    highest_order: highestOrder,
    aov,
    segments
  };
}

export async function updateCustomerStatus(id: string, status: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("profiles")
    .update({ status })
    .eq("id", id);
    
  if (error) throw error;

  revalidatePath(`/admin/customers/${id}`);
  revalidatePath(`/admin/customers`);
}

export async function updateCustomerNotes(id: string, admin_notes: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("profiles")
    .update({ admin_notes })
    .eq("id", id);
    
  if (error) throw error;

  revalidatePath(`/admin/customers/${id}`);
}
