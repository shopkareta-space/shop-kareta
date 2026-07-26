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

// Mock Data
const MOCK_ORDERS: Order[] = [
  {
    id: "ORD-98234",
    date: "2026-07-20T10:30:00Z",
    total: 3250.00,
    status: "delivered",
    paymentStatus: "paid",
    items: [
      {
        id: "item_1",
        productId: "cellogen-anti-aging",
        name: "Cellogen Anti-Aging Cream",
        quantity: 1,
        price: 1850.00,
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800",
      }
    ]
  },
  {
    id: "ORD-98210",
    date: "2026-07-15T14:45:00Z",
    total: 1450.00,
    status: "processing",
    paymentStatus: "paid",
    items: [
      {
        id: "item_2",
        productId: "ayurvedic-glow-serum",
        name: "Ayurvedic Glow Serum",
        quantity: 1,
        price: 1450.00,
        image: "https://images.unsplash.com/photo-1608248593802-861c8a6fdf9e?auto=format&fit=crop&q=80&w=800",
      }
    ]
  }
];

export const useOrderStore = create<OrderState>((set) => ({
  orders: MOCK_ORDERS,
  isLoading: false,
  fetchOrders: () => {
    set({ isLoading: true });
    setTimeout(() => {
      set({ orders: MOCK_ORDERS, isLoading: false });
    }, 800);
  }
}));
