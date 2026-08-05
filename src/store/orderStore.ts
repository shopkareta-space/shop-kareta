import { create } from "zustand";

export type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled";
export type PaymentStatus = "paid" | "pending" | "failed";

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  items: OrderItem[];
}

interface OrderState {
  orders: Order[];
  isLoading: boolean;
  fetchOrders: () => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  isLoading: false,
  fetchOrders: async () => {
    set({ isLoading: true });
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        set({ orders: [], isLoading: false });
        return;
      }

      // Fetch orders and their items
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          created_at,
          total_amount,
          status,
          payment_status,
          order_items (
            id,
            product_id,
            product_name,
            quantity,
            price,
            image
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedOrders: Order[] = data.map((d: any) => ({
        id: `SK-${d.id.substring(0, 8).toUpperCase()}`, // Using the short Delivery ID format
        date: d.created_at,
        total: Number(d.total_amount),
        status: d.status,
        paymentStatus: d.payment_status,
        items: d.order_items.map((i: any) => ({
          id: i.id,
          productId: i.product_id,
          name: i.product_name,
          quantity: i.quantity,
          price: Number(i.price),
          image: i.image || "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800"
        }))
      }));

      set({ orders: mappedOrders, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      set({ isLoading: false });
    }
  }
}));
