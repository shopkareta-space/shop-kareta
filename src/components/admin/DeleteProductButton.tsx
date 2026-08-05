"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteAdminProduct } from "@/lib/services/admin-product.service";

interface DeleteProductButtonProps {
  productId: string;
  productName: string;
}

export function DeleteProductButton({ productId, productName }: DeleteProductButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      setIsDeleting(true);
      try {
        await deleteAdminProduct(productId);
      } catch (error) {
        console.error("Failed to delete product:", error);
        alert("Failed to delete product. Please try again.");
        setIsDeleting(false);
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-500 hover:text-red-700 transition-colors inline-flex items-center gap-1 ml-4 disabled:opacity-50"
      title="Delete Product"
    >
      <Trash2 className="w-4 h-4" />
      <span>{isDeleting ? "Deleting..." : "Delete"}</span>
    </button>
  );
}
