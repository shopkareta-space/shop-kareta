import { CategoryForm } from "@/components/admin/CategoryForm";
import { getAdminCategory } from "@/lib/services/admin-category.service";
import { notFound } from "next/navigation";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  try {
    const category = await getAdminCategory(id);
    if (!category) {
      notFound();
    }

    return (
      <div className="space-y-6">
        <div className="max-w-4xl mx-auto">
          <CategoryForm initialData={category} isEdit={true} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading category:", error);
    notFound();
  }
}
