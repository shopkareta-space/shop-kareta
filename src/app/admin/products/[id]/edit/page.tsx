import { ProductForm } from "@/components/admin/ProductForm";
import { getAdminProduct } from "@/lib/services/admin-product.service";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  let product;
  try {
    product = await getAdminProduct(id);
  } catch (error: any) {
    return (
      <div className="p-6 bg-red-50 text-red-700 rounded-xl">
        <h2 className="font-bold">Error loading product</h2>
        <p>{error.message}</p>
        <p className="text-sm mt-2 opacity-80">ID: {id}</p>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-heading">Edit Product</h1>
        <p className="text-gray-500 mt-2">Update inventory, pricing, and details for {product.name}.</p>
      </div>
      
      <ProductForm initialData={product} isEdit={true} />
    </div>
  );
}
