import { create } from "zustand";

export type NotificationType = "order" | "promo" | "alert" | "system";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  link?: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "notif_1",
    type: "order",
    title: "Order Shipped",
    message: "Your order ORD-98234 has been shipped and is on its way.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    isRead: false,
    link: "/account/orders/ORD-98234",
  },
  {
    id: "notif_2",
    type: "promo",
    title: "Exclusive Offer",
    message: "Get 20% off on all Ayurvedic serums this weekend!",
    date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    isRead: true,
  },
  {
    id: "notif_3",
    type: "alert",
    title: "Security Alert",
    message: "New login detected from a different device (Chrome on Windows).",
    date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    isRead: true,
  }
];

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: MOCK_NOTIFICATIONS,
  get unreadCount() {
    return MOCK_NOTIFICATIONS.filter((n) => !n.isRead).length;
  },
  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map((n) => 
      n.id === id ? { ...n, isRead: true } : n
    )
  })),
  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map((n) => ({ ...n, isRead: true }))
  }))
}));
