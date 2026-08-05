import { getAdminCustomer } from "@/lib/services/admin-customer.service";
import { notFound } from "next/navigation";
import CustomerProfileClient from "./CustomerProfileClient";

export default async function CustomerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const customer = await getAdminCustomer(id);

  if (!customer) {
    notFound();
  }

  return <CustomerProfileClient initialCustomer={customer} />;
}
