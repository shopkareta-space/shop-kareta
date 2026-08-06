import { getAdminOrder } from "@/lib/services/admin-order.service";
import { notFound } from "next/navigation";
import OrderDetailClient from "./OrderDetailClient";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const order = await getAdminOrder(id);

  if (!order) {
    notFound();
  }

  return <OrderDetailClient initialOrder={order} />;
}
