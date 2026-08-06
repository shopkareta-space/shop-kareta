import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// We use the service role key to reliably fetch product inventory regardless of RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 
  process.env.SUPABASE_SERVICE_KEY || 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  'dummy'
);

export async function POST(req: Request) {
  try {
    const { items } = await req.json();

    if (!items || !items.length) {
      return NextResponse.json({ success: false, error: "Cart is empty" }, { status: 400 });
    }

    // 1. Fetch current status of products based on slugs
    const slugs = items.map((item: any) => item.product.id); // product.id is the slug in frontend
    
    const { data: productsData, error } = await supabase
      .from('products')
      .select('id, slug, price, inventory_count, is_active')
      .in('slug', slugs);

    if (error) {
      console.error("Cart validation DB error:", error);
      return NextResponse.json({ success: false, error: "Failed to validate products." }, { status: 500 });
    }

    const issues: string[] = [];

    // 2. Validate each item
    for (const item of items) {
      const dbProduct = productsData?.find(p => p.slug === item.product.id);
      
      if (!dbProduct) {
        issues.push(`"${item.product.name}" is no longer available.`);
        continue;
      }

      if (dbProduct.is_active === false) {
        issues.push(`"${item.product.name}" has been deactivated.`);
      }

      // We allow price variations if discounts are applied, but generally strict validation is better.
      // For now, let's just log or ignore price if they match, or warn if they don't.
      if (dbProduct.price !== item.product.price) {
        issues.push(`The price of "${item.product.name}" has changed from ₹${item.product.price} to ₹${dbProduct.price}.`);
      }

      if (dbProduct.inventory_count < item.quantity) {
        if (dbProduct.inventory_count === 0) {
          issues.push(`"${item.product.name}" is out of stock.`);
        } else {
          issues.push(`Only ${dbProduct.inventory_count} units of "${item.product.name}" are available.`);
        }
      }
    }

    if (issues.length > 0) {
      return NextResponse.json({ success: false, issues }, { status: 400 });
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Cart Validation API Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
