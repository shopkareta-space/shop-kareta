import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-heading">Add New Product</h1>
        <p className="text-gray-500 mt-2">Fill in the information below to add a new product to your catalog.</p>
      </div>
      
      <ProductForm />
    </div>
  );
}
