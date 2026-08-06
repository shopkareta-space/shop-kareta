"use server";

import { createClient } from "@supabase/supabase-js";

// Initialize Supabase admin client here to avoid build-time environment variable errors
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy'; 
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function getOrderById(orderId: string) {
  if (!orderId) {
    throw new Error("Order ID is required");
  }

  // Fetch the order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (orderError || !order) {
    console.error("Fetch order error:", orderError);
    return null;
  }

  // Fetch the items
  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderId);

  if (itemsError) {
    console.error("Fetch order items error:", itemsError);
    return null;
  }

  return {
    ...order,
    items: items || [],
  };
}

export async function cancelOrder(orderId: string) {
  if (!orderId) {
    throw new Error("Order ID is required");
  }

  // First verify the order exists and is in "processing" state
  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select("status")
    .eq("id", orderId)
    .single();

  if (fetchError || !order) {
    throw new Error("Order not found");
  }

  if (order.status !== "processing") {
    throw new Error("Order cannot be cancelled at this stage.");
  }

  // Update order status to cancelled
  const { error: updateError } = await supabase
    .from("orders")
    .update({ status: "cancelled" })
    .eq("id", orderId);

  if (updateError) {
    console.error("Cancel order error:", updateError);
    throw new Error("Failed to cancel order");
  }

  return { success: true };
}
