const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testCheckout() {
  try {
    console.log("Fetching a valid product...");
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, price, category_id, inventory_count')
      .gt('inventory_count', 0)
      .limit(1);
      
    if (error || !products || products.length === 0) {
      console.error("No valid product found:", error);
      return;
    }
    
    const product = products[0];
    console.log("Found product:", product.name);

    const payload = {
      contact: {
        email: "test@example.com",
        phone: "1234567890",
        firstName: "Test",
        lastName: "User"
      },
      shippingAddress: {
        firstName: "Test",
        lastName: "User",
        addressLine1: "123 Test St",
        city: "Test City",
        state: "Test State",
        pincode: "123456",
        phone: "1234567890"
      },
      deliveryMethod: "standard",
      paymentMethod: "cod",
      totalAmount: 199,
      items: [
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: "test.png",
          categoryId: product.category_id
        }
      ]
    };

    console.log("Sending payload to /api/checkout...");
    const res = await fetch('http://localhost:3000/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Response:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error:", err);
  }
}

testCheckout();
