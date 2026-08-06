import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { OrderConfirmationEmail } from "@/components/emails/OrderConfirmationEmail";
import React from "react";

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY || 'mock_key');

export async function POST(req: Request) {
  try {
    // Initialize Supabase admin client here to avoid build-time environment variable errors
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''; 
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const body = await req.json();
    const { contact, shippingAddress, deliveryMethod, paymentMethod, items, totalAmount, userId } = body;

    if (!contact || !shippingAddress || !items || !items.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Insert into orders table
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId || null,
        total_amount: totalAmount,
        status: 'processing',
        payment_status: paymentMethod === 'cod' ? 'pending' : 'paid',
        payment_method: paymentMethod,
        delivery_method: deliveryMethod,
        shipping_address: shippingAddress,
        contact_info: contact
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error("Order insertion error:", orderError);
      throw new Error("Failed to create order");
    }

    // 2. Fetch product UUIDs based on the slugs (items.productId)
    const slugs = items.map((item: any) => item.productId);
    const { data: productsData } = await supabase
      .from('products')
      .select('id, slug')
      .in('slug', slugs);

    const productMap = new Map();
    if (productsData) {
      productsData.forEach((p: any) => productMap.set(p.slug, p.id));
    }

    // 3. Insert into order_items table
    const orderItemsToInsert = items.map((item: any) => ({
      order_id: order.id,
      product_id: productMap.get(item.productId) || null,
      variant_id: item.variantId || null,
      product_name: item.name,
      quantity: item.quantity,
      price: item.price,
      image: item.image
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItemsToInsert);

    if (itemsError) {
      console.error("Order items insertion error:", itemsError);
      throw new Error("Failed to create order items");
    }

    // 3. Generate Delivery ID
    const deliveryId = `SK-${order.id.substring(0, 8).toUpperCase()}`;

    // 4. Send Confirmation Email via Resend
    try {
      if (process.env.RESEND_API_KEY) {
        await resend.emails.send({
          from: "Shopkareta <orders@shopkareta.com>", // You must verify this domain in Resend
          to: [contact.email],
          subject: `Order Confirmed: #${deliveryId}`,
          react: React.createElement(OrderConfirmationEmail, {
            customerName: contact.firstName,
            orderId: order.id,
            deliveryId,
            totalAmount,
            shippingAddress,
            items
          }),
        });
      } else {
        console.log("No RESEND_API_KEY provided. Skipping email delivery.");
      }
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
      // We don't want to fail the checkout if email fails, so we just log it.
    }

    // 5. Return success response
    return NextResponse.json({
      success: true,
      orderId: order.id,
      deliveryId: deliveryId
    });

  } catch (error: any) {
    console.error("Checkout API Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
