"use server";

import { createClient } from "@supabase/supabase-js";

// Initialize Supabase admin client here to avoid build-time environment variable errors
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co';
const supabaseServiceKey = 
  process.env.SUPABASE_SERVICE_ROLE_KEY || 
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || 
  process.env.SUPABASE_SERVICE_KEY || 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  'dummy'; 
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function getOrderById(orderId: string) {
  if (!orderId) {
    throw new Error("Order ID is required");
  }

  // Fetch the order
  const isOrderNumber = orderId.startsWith("SK-");
  
  let orderData;
  let orderError;

  if (isOrderNumber) {
    // Try by order_number first
    const res = await supabase.from("orders").select("*").eq("order_number", orderId).single();
    if (res.data) {
      orderData = res.data;
    } else {
      // Fallback: If order_number is missing, it might be the SK-UUID fallback format from older API responses
      const uuidPart = orderId.replace("SK-", "").toLowerCase();
      // Only attempt if it looks like a hex string
      if (uuidPart.length >= 8) {
        const fallbackRes = await supabase.from("orders").select("*").ilike("id", `${uuidPart}%`).limit(1).single();
        orderData = fallbackRes.data;
        orderError = fallbackRes.error;
      }
    }
  } else {
    // UUID lookup
    const res = await supabase.from("orders").select("*").eq("id", orderId).single();
    orderData = res.data;
    orderError = res.error;
  }

  if (!orderData) {
    console.error("Fetch order error:", orderError);
    return null;
  }
  
  const order = orderData;

  // Fetch the items
  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", order.id);

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

  // Fetch the order items to restore inventory
  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select("product_id, quantity")
    .eq("order_id", orderId);

  if (itemsError) {
    console.error("Fetch items error during cancellation:", itemsError);
    throw new Error("Failed to process cancellation");
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

  // Log status history
  await supabase.from("order_status_history").insert({
    order_id: orderId,
    previous_status: "processing",
    new_status: "cancelled",
    comment: "Cancelled by customer"
  });

  // Restore inventory
  if (items && items.length > 0) {
    for (const item of items) {
      if (item.product_id) {
        // Fetch current inventory
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

  return { success: true };
}
