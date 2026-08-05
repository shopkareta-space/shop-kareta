import { CategoryForm } from "@/components/admin/CategoryForm";

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <div className="max-w-4xl mx-auto">
        <CategoryForm isEdit={false} />
      </div>
    </div>
  );
}
