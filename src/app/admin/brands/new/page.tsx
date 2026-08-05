import { BrandForm } from "@/components/admin/BrandForm";

export default function NewBrandPage() {
  return (
    <div className="space-y-6">
      <div className="max-w-4xl mx-auto">
        <BrandForm isEdit={false} />
      </div>
    </div>
  );
}
