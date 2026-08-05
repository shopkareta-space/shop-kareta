import Link from "next/link";
import { Plus } from "lucide-react";
import { getAdminCategories } from "@/lib/services/admin-category.service";
import CategoryListClient from "./CategoryListClient";

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 font-heading">Categories</h2>
          <p className="text-sm text-gray-500">Organize your products into nested hierarchies and collections.</p>
        </div>
        <Link 
          href="/admin/categories/new"
          className="inline-flex items-center justify-center px-4 py-2 bg-[#0D1B2A] text-white rounded-xl text-sm font-medium hover:bg-[#1a3553] transition-colors"
        >
          <Plus className="w-5 h-5 mr-1.5" />
          Add Category
        </Link>
      </div>

      <CategoryListClient initialCategories={categories || []} />
    </div>
  );
}
