import InvoiceDocument from "@/components/invoice/InvoiceDocument";

export default async function AdminInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <InvoiceDocument orderId={id} viewContext="admin" />;
}
