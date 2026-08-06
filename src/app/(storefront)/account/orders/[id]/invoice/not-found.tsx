export default function InvoiceNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Invoice Unavailable</h2>
      <p className="text-gray-600 mb-6">The requested invoice could not be found or has been deleted.</p>
    </div>
  );
}
