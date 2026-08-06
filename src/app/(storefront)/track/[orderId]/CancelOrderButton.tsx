"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { XCircle, Loader2 } from "lucide-react";
import { cancelOrder } from "@/lib/services/order.service";

export default function CancelOrderButton({ orderId }: { orderId: string }) {
  const [isCancelling, setIsCancelling] = useState(false);
  const router = useRouter();

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this order? This action cannot be undone.")) return;

    setIsCancelling(true);
    try {
      await cancelOrder(orderId);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to cancel order. Please try again.");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <button
      onClick={handleCancel}
      disabled={isCancelling}
      className="w-full sm:w-auto h-12 px-6 bg-white border-2 border-red-100 text-red-500 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-red-50 hover:border-red-200 transition-colors disabled:opacity-50"
    >
      {isCancelling ? <Loader2 className="w-5 h-5 animate-spin" /> : <XCircle className="w-5 h-5" />}
      <span>{isCancelling ? "Cancelling..." : "Cancel Order"}</span>
    </button>
  );
}
