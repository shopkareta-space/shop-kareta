"use client";

import { useState } from "react";
import { Trash2, AlertTriangle, X, CheckCircle2 } from "lucide-react";
import { deleteAdminProduct } from "@/lib/services/admin-product.service";

interface DeleteProductButtonProps {
  productId: string;
  productName: string;
}

export function DeleteProductButton({ productId, productName }: DeleteProductButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success'|'error'} | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteAdminProduct(productId);
      setToast({ message: "Product deleted successfully", type: 'success' });
      setShowModal(false);
      setTimeout(() => setToast(null), 3000);
    } catch (error) {
      console.error("Failed to delete product:", error);
      setToast({ message: "Failed to delete product. Database constraints may be blocking this action.", type: 'error' });
      setShowModal(false);
      setTimeout(() => setToast(null), 5000);
    }
    setIsDeleting(false);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        disabled={isDeleting}
        className="text-red-500 hover:text-red-700 transition-colors inline-flex items-center gap-1 ml-4 disabled:opacity-50"
        title="Delete Product"
      >
        <Trash2 className="w-4 h-4" />
        <span>{isDeleting ? "Deleting..." : "Delete"}</span>
      </button>

      {/* Custom Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Delete Product</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <span className="font-semibold text-gray-900">"{productName}"</span>? This action cannot be undone and will remove all associated data.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button 
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Deleting...
                  </>
                ) : (
                  "Yes, Delete Product"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border ${
            toast.type === 'success' ? 'bg-white border-green-100 text-gray-800' : 'bg-red-50 border-red-100 text-red-800'
          }`}>
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
            )}
            <p className="text-sm font-medium pr-2">{toast.message}</p>
            <button onClick={() => setToast(null)} className="opacity-50 hover:opacity-100 transition-opacity">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
