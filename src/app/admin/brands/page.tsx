import Link from "next/link";
import { Plus } from "lucide-react";
import { getAdminBrands } from "@/lib/services/admin-brand.service";
import BrandListClient from "./BrandListClient";

export default async function AdminBrandsPage() {
  const brands = await getAdminBrands();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 font-heading">Brands</h2>
          <p className="text-sm text-gray-500">Manage your product brands and manufacturers.</p>
        </div>
        <Link 
          href="/admin/brands/new"
          className="inline-flex items-center justify-center px-4 py-2 bg-[#0D1B2A] text-white rounded-xl text-sm font-medium hover:bg-[#1a3553] transition-colors"
        >
          <Plus className="w-5 h-5 mr-1.5" />
          Add Brand
        </Link>
      </div>

      <BrandListClient initialBrands={brands || []} />
    </div>
  );
}
