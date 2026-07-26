import { notFound } from "next/navigation";
import { products } from "@/data/products";
import { SatvamTemplate } from "@/components/storefront/brands/SatvamTemplate";
import { VediqueTemplate } from "@/components/storefront/brands/VediqueTemplate";
import { LaskoviaTemplate } from "@/components/storefront/brands/LaskoviaTemplate";
import type { Metadata } from "next";

interface BrandPageProps {
  params: Promise<{ brand: string }>;
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { brand } = await params;
  
  const brandTitles: Record<string, string> = {
    "satvam": "Satvam Wellness | Shop Kareta",
    "vedique": "Vedique Nutrition | Shop Kareta",
    "laskovia": "La'Skovia Luxury Beauty | Shop Kareta",
  };

  if (!brandTitles[brand]) {
    return { title: "Brand Not Found | Shop Kareta" };
  }

  return { title: brandTitles[brand] };
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { brand } = await params;

  // Map URL slugs to exact brand strings in the product catalog
  let brandFilter = "";
  if (brand === "satvam") brandFilter = "Satvam Wellness";
  else if (brand === "vedique") brandFilter = "Vedique Nutrition";
  else if (brand === "laskovia") brandFilter = "L'Aveira"; // Data mapping for La'Skovia

  if (!brandFilter) {
    notFound();
  }

  const brandProducts = products.filter(p => p.brand === brandFilter);

  // Render the specific template
  if (brand === "satvam") {
    return <SatvamTemplate products={brandProducts} />;
  }
  
  if (brand === "vedique") {
    return <VediqueTemplate products={brandProducts} />;
  }
  
  if (brand === "laskovia") {
    return <LaskoviaTemplate products={brandProducts} />;
  }

  return notFound();
}
