import { create } from "zustand";

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "placed" | "packed";
export type PaymentStatus = "paid" | "pending" | "failed" | "cod";

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
  cancelOrder: (orderId: string) => Promise<void>;
  subscribeToOrders: () => void;
  unsubscribeFromOrders: () => void;
  subscription: any | null;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  isLoading: false,
  subscription: null,
  
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
          order_number,
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
        id: d.order_number || `SK-${d.id.substring(0, 8).toUpperCase()}`,
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
    }
  },

  cancelOrder: async (orderId: string) => {
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const isInternalId = orderId.startsWith('SK-');
      let query = supabase.from('orders').update({ status: 'cancelled' }).eq('user_id', user.id);
      
      if (isInternalId) {
        query = query.eq('order_number', orderId);
      } else {
        query = query.eq('id', orderId);
      }

      const { error } = await query;
      if (error) throw error;

      set((state) => ({
        orders: state.orders.map((o) => 
          o.id === orderId ? { ...o, status: 'cancelled' } : o
        )
      }));
    } catch (error) {
      console.error("Failed to cancel order:", error);
      throw error;
    }
  },

  subscribeToOrders: async () => {
    const { subscription, fetchOrders } = get();
    if (subscription) return; // Already subscribed
    
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const newSubscription = supabase
        .channel('public:orders')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'orders',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Order update received in real-time:', payload);
            // Fetch everything again to ensure data consistency,
            // or we could manually patch it in state:
            const updatedOrder = payload.new;
            const orderId = updatedOrder.order_number || `SK-${updatedOrder.id.substring(0, 8).toUpperCase()}`;
            
            set((state) => ({
              orders: state.orders.map((o) =>
                o.id === orderId
                  ? { ...o, status: updatedOrder.status, paymentStatus: updatedOrder.payment_status }
                  : o
              )
            }));
          }
        )
        .subscribe();
        
      set({ subscription: newSubscription });
    } catch (error) {
      console.error("Failed to subscribe to orders realtime:", error);
    }
  },

  unsubscribeFromOrders: async () => {
    const { subscription } = get();
    if (subscription) {
      try {
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();
        await supabase.removeChannel(subscription);
        set({ subscription: null });
      } catch (error) {
        console.error("Failed to unsubscribe:", error);
      }
    }
  }
}));
