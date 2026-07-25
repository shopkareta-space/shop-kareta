import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { products } from "@/data/products";
import { ProductGallery } from "@/components/storefront/ProductGallery";
import { PurchaseActions } from "@/components/storefront/PurchaseActions";
import { TrustBadges } from "@/components/storefront/TrustBadges";
import { ProductSections } from "@/components/storefront/ProductSections";
import { RelatedProducts } from "@/components/storefront/RelatedProducts";
import { ProductCertifications } from "@/components/storefront/ProductCertifications";
import { StickyPurchaseBar } from "@/components/storefront/StickyPurchaseBar";
import BlurFade from "@/components/ui/blur-fade";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(
  { params }: ProductPageProps
): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.id === slug);

  if (!product) {
    return {
      title: "Product Not Found | Shop Kareta",
    };
  }

  return {
    title: `${product.name} | Shop Kareta`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      type: "website",
      images: product.images ? [product.images[0]] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = products.find((p) => p.id === slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="bg-brand-light min-h-screen pb-20">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-6">
        <nav className="flex items-center text-xs font-medium text-brand-gray">
          <Link href="/" className="hover:text-brand-green transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 mx-2" />
          <Link href="/shop" className="hover:text-brand-green transition-colors">Shop</Link>
          <ChevronRight className="w-3 h-3 mx-2" />
          <Link href={`/categories/${product.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="hover:text-brand-green transition-colors">
            {product.category}
          </Link>
          <ChevronRight className="w-3 h-3 mx-2" />
          <span className="text-brand-blue line-clamp-1">{product.name}</span>
        </nav>
      </div>

      <div className="container mx-auto px-4">
        {/* Main Product Layout */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 mb-20">
          
          {/* Left Column: Gallery */}
          <div className="w-full lg:w-1/2">
            <div className="sticky top-28">
              <ProductGallery images={product.images} productName={product.name} />
            </div>
          </div>

          {/* Right Column: Info & Actions */}
          <div className="w-full lg:w-1/2 flex flex-col pt-2 lg:pt-0">
            {/* Badges & Title */}
            <div className="mb-4">
              {product.badge && (
                <div className="inline-block bg-[#D4AF37] text-[#0D1B2A] text-xs font-bold uppercase tracking-wider py-1.5 px-3 rounded-sm mb-4">
                  {product.badge}
                </div>
              )}
              <h2 className="text-sm uppercase tracking-widest text-brand-green font-semibold mb-2">
                {product.brand}
              </h2>
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-[#0D1B2A] leading-tight mb-2">
                {product.name}
              </h1>
              {product.variant && (
                <p className="text-xl text-brand-gray/80 font-medium">{product.variant}</p>
              )}
            </div>

            {/* Short Introduction */}
            {product.shortIntroduction && (
              <p className="text-[#0F6B46] font-medium text-lg mb-6">
                {product.shortIntroduction}
              </p>
            )}

            <div className="flex items-center gap-3 mb-6">
              <span className="bg-brand-gray/10 text-brand-gray text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide">
                {product.stockStatus || "In Stock"}
              </span>
            </div>

            {/* Pricing */}
            <div className="flex items-end gap-4 mb-8 pb-8 border-b border-brand-gray/10">
              <span className="font-heading text-4xl md:text-5xl font-bold text-[#0D1B2A]">
                <span className="text-2xl text-brand-gray/60 mr-1 font-sans">₹</span>
                {product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-brand-gray line-through mb-1 font-medium">
                    ₹{product.originalPrice.toFixed(2)}
                  </span>
                  <span className="bg-brand-green/10 text-brand-green text-sm font-bold px-2.5 py-1 rounded-sm mb-1.5">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            <hr className="border-brand-gray/10 mb-8" />

            {/* Actions (Quantity, Add to Cart, Buy Now, Wishlist) */}
            <div className="mb-10">
              <PurchaseActions product={product} />
            </div>

            {/* Product Certifications */}
            <ProductCertifications product={product} />

            {/* Trust Badges */}
            <div className="mb-10 mt-10">
              <TrustBadges />
            </div>
            
            {/* Additional Meta (SKU, Volume, Claims) */}
            <div className="flex flex-col gap-2 text-sm text-brand-gray bg-white rounded-xl p-5 border border-brand-gray/10 mb-6">
              {product.sku && (
                <div className="flex justify-between">
                  <span className="font-medium text-brand-blue">SKU</span>
                  <span>{product.sku}</span>
                </div>
              )}
              {product.productCode && (
                <div className="flex justify-between">
                  <span className="font-medium text-brand-blue">Product Code</span>
                  <span>{product.productCode}</span>
                </div>
              )}
              {product.packaging?.netQuantity && (
                <div className="flex justify-between">
                  <span className="font-medium text-brand-blue">Net Quantity</span>
                  <span>{product.packaging.netQuantity}</span>
                </div>
              )}
              {product.packaging?.netWeight && (
                <div className="flex justify-between">
                  <span className="font-medium text-brand-blue">Net Weight</span>
                  <span>{product.packaging.netWeight}</span>
                </div>
              )}
              {product.packaging?.dimensions && (
                <div className="flex justify-between">
                  <span className="font-medium text-brand-blue">Dimensions</span>
                  <span>{product.packaging.dimensions}</span>
                </div>
              )}
              {product.packaging?.packagingType && (
                <div className="flex justify-between">
                  <span className="font-medium text-brand-blue">Packaging</span>
                  <span>{product.packaging.packagingType}</span>
                </div>
              )}
              {product.packaging?.form && (
                <div className="flex justify-between">
                  <span className="font-medium text-brand-blue">Form</span>
                  <span>{product.packaging.form}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="font-medium text-brand-blue">Category</span>
                <Link href={`/categories/${product.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="hover:text-brand-green underline underline-offset-2">
                  {product.category}
                </Link>
              </div>
            </div>

            {/* Product Claims */}
            {product.claims && product.claims.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {product.claims.map((claim, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 bg-brand-green/5 text-brand-green text-xs font-semibold px-3 py-1.5 rounded-full border border-brand-green/10">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-green" />
                    {claim}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Deep-Scroll Catalog Information (Overview, Benefits, Ingredients, Usage) */}
      <ProductSections product={product} />

      {/* Cross-Selling */}
      <RelatedProducts currentProductId={product.id} category={product.category} />

      {/* Mobile Sticky Purchase Bar */}
      <StickyPurchaseBar product={product} />
    </div>
  );
}
