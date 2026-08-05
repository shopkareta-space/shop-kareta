"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Package, Tag, ShoppingBag, MessageSquare, CheckCircle2, X } from "lucide-react";
import { getAdminNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "@/lib/services/admin-notification.service";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  link_url: string | null;
  is_read: boolean;
  created_at: string;
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const fetchNotifications = async () => {
    try {
      const data = await getAdminNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Failed to load notifications", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Optional: Set up polling every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkAsRead = async (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    await markNotificationAsRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      handleMarkAsRead(notification.id);
    }
    setIsOpen(false);
    if (notification.link_url) {
      router.push(notification.link_url);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'product': return <Package className="w-5 h-5 text-blue-500" />;
      case 'brand': return <Tag className="w-5 h-5 text-purple-500" />;
      case 'order': return <ShoppingBag className="w-5 h-5 text-green-500" />;
      case 'message': return <MessageSquare className="w-5 h-5 text-amber-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-xl transition-colors relative ${isOpen ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
      >
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border-2 border-white"></span>
          </span>
        )}
        <Bell className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-bold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllRead}
                className="text-xs font-medium text-brand-blue hover:text-[#0D1B2A] flex items-center gap-1 transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>
          
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 flex flex-col items-center justify-center">
                <Bell className="w-8 h-8 text-gray-300 mb-3" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 flex gap-4 cursor-pointer hover:bg-gray-50 transition-colors ${!notification.is_read ? 'bg-brand-blue/5' : ''}`}
                  >
                    <div className="shrink-0 mt-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${!notification.is_read ? 'bg-white shadow-sm' : 'bg-gray-100'}`}>
                        {getIcon(notification.type)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <p className={`text-sm font-semibold truncate ${!notification.is_read ? 'text-gray-900' : 'text-gray-600'}`}>
                          {notification.title}
                        </p>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap shrink-0 mt-0.5">
                          {new Date(notification.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className={`text-xs line-clamp-2 ${!notification.is_read ? 'text-gray-700' : 'text-gray-500'}`}>
                        {notification.message}
                      </p>
                    </div>
                    {!notification.is_read && (
                      <button 
                        onClick={(e) => handleMarkAsRead(notification.id, e)}
                        className="shrink-0 text-brand-blue hover:text-[#0D1B2A] opacity-0 group-hover:opacity-100 md:opacity-100"
                        title="Mark as read"
                      >
                        <span className="w-2 h-2 rounded-full bg-brand-blue block"></span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-3 border-t border-gray-100 bg-gray-50 text-center">
            <Link href="/admin" onClick={() => setIsOpen(false)} className="text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors">
              Go to Dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
