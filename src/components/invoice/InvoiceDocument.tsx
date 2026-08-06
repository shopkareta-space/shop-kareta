import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import InvoiceActions from "@/components/invoice/InvoiceActions";

interface InvoiceDocumentProps {
  orderId: string;
  viewContext: "admin" | "customer";
}

export default async function InvoiceDocument({ orderId, viewContext }: InvoiceDocumentProps) {
  const supabase = await createClient();

  // Get current user to verify access
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // If admin context, verify admin role
  if (viewContext === "admin") {
    const { data: adminProfile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (adminProfile?.role !== "admin") {
      return (
        <div className="flex items-center justify-center min-h-[50vh]">
          <h2 className="text-xl font-bold text-gray-700">Invoice unavailable (Access Denied)</h2>
        </div>
      );
    }
  }

  // Fetch the order
  const { data: order, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (*)
    `)
    .eq("id", orderId)
    .single();

  if (error || !order) {
    console.error("Invoice Error: Failed to fetch order", { orderId, error });
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <h2 className="text-xl font-bold text-gray-700">Invoice unavailable</h2>
      </div>
    );
  }

  // If customer context, verify ownership
  if (viewContext === "customer" && order.user_id !== user.id) {
    console.error("Invoice Error: Ownership mismatch", { orderUserId: order.user_id, userId: user.id });
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <h2 className="text-xl font-bold text-gray-700">Invoice unavailable</h2>
      </div>
    );
  }

  console.log("Invoice successfully fetched for order:", order.id);

  // Data processing
  const invoiceNumber = order.order_number || `INV-${order.id.substring(0, 8).toUpperCase()}`;
  const orderNumber = order.order_number || `SK-${order.id.substring(0, 8).toUpperCase()}`;
  
  // Format dates safely
  let orderDate = "N/A";
  if (order.created_at) {
    orderDate = new Date(order.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  const invoiceDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
  });

  const customerName = order.contact_info?.name || order.contact_info?.firstName || "Customer";
  const customerEmail = order.contact_info?.email || "N/A";
  const customerPhone = order.contact_info?.phone || "N/A";

  const paymentMethod = order.payment_status === "cod" ? "Cash on Delivery" : "Card/Online";
  const paymentStatus = order.payment_status ? order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1) : "Pending";
  const orderStatus = order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : "Pending";

  const backUrl = viewContext === "admin" ? `/admin/orders/${order.id}` : `/account/orders/${order.id}`;

  const subtotal = Number(order.total_amount || 0); // Assuming total_amount is subtotal for now since shipping/tax are 0
  const shipping = 0.00;
  const couponDiscount = 0.00;
  const tax = 0.00;
  const grandTotal = subtotal + shipping - couponDiscount + tax;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 print:bg-white print:pb-0">
      <InvoiceActions invoiceId={invoiceNumber} backUrl={backUrl} />

      {/* Invoice Container */}
      <div 
        id="invoice-container" 
        className="max-w-4xl mx-auto mt-24 print:mt-0 bg-white p-8 md:p-12 shadow-sm rounded-2xl print:shadow-none print:rounded-none"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-200 pb-8 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Shop Kareta</h1>
            <p className="text-sm font-semibold text-gray-600 mt-1">SK Holdings (Pvt) Ltd.</p>
            <div className="text-sm text-gray-500 mt-4 leading-relaxed">
              204, Third Floor, <br />
              Indraprastha Apartment, <br />
              Pawansut Nagar, Near HP Gas Godown, <br />
              Ramna Maroti, Nandanvan, <br />
              Nagpur – 440009
            </div>
            <div className="text-sm text-gray-500 mt-4 space-y-1">
              <p><strong>Phone:</strong> 9529285971</p>
              <p><strong>Email:</strong> shopkareta@gmail.com</p>
            </div>
          </div>
          
          <div className="text-left md:text-right">
            <h2 className="text-4xl font-black text-gray-200 uppercase tracking-widest mb-4">Invoice</h2>
            <div className="space-y-1 text-sm">
              <p className="text-gray-500">Invoice Number: <span className="font-semibold text-gray-900">{invoiceNumber}</span></p>
              <p className="text-gray-500">Invoice Date: <span className="font-semibold text-gray-900">{invoiceDate}</span></p>
              <p className="text-gray-500">Order Number: <span className="font-semibold text-gray-900">{orderNumber}</span></p>
              <p className="text-gray-500">Order Date: <span className="font-semibold text-gray-900">{orderDate}</span></p>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Customer Details */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Billed To</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-semibold text-gray-900">{customerName}</p>
              <p>{customerPhone}</p>
              <p>{customerEmail}</p>
              <p className="whitespace-pre-wrap mt-2">{order.shipping_address ? (typeof order.shipping_address === 'string' ? order.shipping_address : `${order.shipping_address.addressLine1 || ''} ${order.shipping_address.addressLine2 || ''}\n${order.shipping_address.city || ''}, ${order.shipping_address.state || ''} - ${order.shipping_address.pincode || ''}`) : "N/A"}</p>
            </div>
          </div>

          {/* Payment Details */}
          <div className="md:text-right">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Payment Information</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Method: <span className="font-medium text-gray-900">{paymentMethod}</span></p>
              <p>Payment Status: <span className={`font-semibold ${order.payment_status === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>{paymentStatus}</span></p>
              <p>Order Status: <span className="font-medium text-gray-900">{orderStatus}</span></p>
            </div>
          </div>
        </div>

        {/* GST Placeholders */}
        <div className="bg-gray-50 p-4 rounded-lg mb-8 text-xs text-gray-500 grid grid-cols-2 md:grid-cols-4 gap-4 print:bg-transparent print:border print:border-gray-200">
          <div>
            <p className="font-semibold text-gray-700">GST Number</p>
            <p>Not Available</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">CGST (0%)</p>
            <p>₹0.00</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">SGST (0%)</p>
            <p>₹0.00</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">IGST (0%)</p>
            <p>₹0.00</p>
          </div>
        </div>

        {/* Products Table */}
        <div className="mb-8 overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-900 font-semibold">
              <tr>
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3 hidden sm:table-cell">HSN</th>
                <th className="px-4 py-3 text-center">Qty</th>
                <th className="px-4 py-3 text-right">Price</th>
                <th className="px-4 py-3 text-right hidden sm:table-cell">Discount</th>
                <th className="px-4 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {order.order_items?.map((item: any) => {
                const itemTotal = (item.quantity * Number(item.price || 0)).toFixed(2);
                return (
                  <tr key={item.id} className="text-gray-700">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <img src={item.image} alt={item.product_name} className="w-10 h-10 object-cover rounded bg-gray-100 hidden sm:block" />
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{item.product_name}</p>
                          {/* Placeholder for variant if it existed */}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-400 hidden sm:table-cell">-</td>
                    <td className="px-4 py-4 text-center">{item.quantity}</td>
                    <td className="px-4 py-4 text-right">₹{Number(item.price || 0).toFixed(2)}</td>
                    <td className="px-4 py-4 text-right text-gray-500 hidden sm:table-cell">₹0.00</td>
                    <td className="px-4 py-4 text-right font-medium text-gray-900">₹{itemTotal}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-12">
          <div className="w-full sm:w-1/2 md:w-1/3 space-y-3">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Shipping</span>
              <span>₹{shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-green-600">
              <span>Coupon Discount</span>
              <span>-₹{couponDiscount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Tax (GST)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between font-bold text-lg text-gray-900">
              <span>Grand Total</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 pt-8 mt-auto">
          <p className="text-center font-semibold text-gray-900 mb-2">Thank you for shopping with Shop Kareta!</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-gray-500">
            <a href="https://shopkareta.com" className="hover:text-blue-600">www.shopkareta.com</a>
            <span>•</span>
            <a href="mailto:support@shopkareta.com" className="hover:text-blue-600">Customer Support</a>
            <span>•</span>
            <a href="/terms" className="hover:text-blue-600">Terms & Conditions</a>
            <span>•</span>
            <a href="/refunds" className="hover:text-blue-600">Refund Policy</a>
          </div>
        </div>
      </div>
    </div>
  );
}
