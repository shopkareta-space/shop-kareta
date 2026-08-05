import { BrandForm } from "@/components/admin/BrandForm";
import { getAdminBrand } from "@/lib/services/admin-brand.service";
import { notFound } from "next/navigation";

export default async function EditBrandPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  try {
    const brand = await getAdminBrand(id);
    if (!brand) {
      notFound();
    }

    return (
      <div className="space-y-6">
        <div className="max-w-4xl mx-auto">
          <BrandForm initialData={brand} isEdit={true} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading brand:", error);
    notFound();
  }
}
