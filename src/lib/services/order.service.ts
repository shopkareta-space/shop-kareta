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

  const isOrderNumber = orderId.startsWith("SK-");
  let query = supabase.from("orders").select("id, status");
  
  if (isOrderNumber) {
    query = query.eq("order_number", orderId);
  } else {
    query = query.eq("id", orderId);
  }

  // First verify the order exists
  const { data: order, error: fetchError } = await query.single();

  if (fetchError || !order) {
    // Try fallback for SK- UUID format
    if (isOrderNumber) {
      const uuidPart = orderId.replace("SK-", "").toLowerCase();
      if (uuidPart.length >= 8) {
        const { data: fallbackOrder, error: fallbackError } = await supabase
          .from("orders")
          .select("id, status")
          .ilike("id", `${uuidPart}%`)
          .limit(1)
          .single();
          
        if (!fallbackError && fallbackOrder) {
           return cancelOrder(fallbackOrder.id); // Recursively call with actual UUID
        }
      }
    }
    throw new Error("Order not found");
  }

  const actualOrderId = order.id;

  if (order.status !== "processing" && order.status !== "placed" && order.status !== "pending") {
    throw new Error("Order cannot be cancelled at this stage.");
  }

  // Fetch the order items to restore inventory
  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select("product_id, quantity")
    .eq("order_id", actualOrderId);

  if (itemsError) {
    console.error("Fetch items error during cancellation:", itemsError);
    throw new Error("Failed to process cancellation");
  }

  // Update order status to cancelled
  const { error: updateError } = await supabase
    .from("orders")
    .update({ status: "cancelled" })
    .eq("id", actualOrderId);

  if (updateError) {
    console.error("Cancel order error:", updateError);
    throw new Error("Failed to cancel order");
  }

  // Log status history
  await supabase.from("order_status_history").insert({
    order_id: actualOrderId,
    previous_status: order.status,
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
