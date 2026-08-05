import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CartClient } from "./CartClient";
import { RelatedProducts } from "@/components/storefront/RelatedProducts";

export default function CartPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px]">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-medium text-brand-gray mb-8">
          <Link href="/" className="hover:text-brand-blue transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-brand-blue">Shopping Cart</span>
        </nav>

        <CartClient />
      </div>

      {/* Cross-Sell Recommendations */}
      <div className="mt-20">
        <RelatedProducts category="Wellness" currentProductId="" />
      </div>
    </div>
  );
}
