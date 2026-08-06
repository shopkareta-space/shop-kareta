import { Suspense } from "react";
import { searchProducts } from "@/lib/services/product.service";
import ProductGrid from "@/components/storefront/ProductGrid";
import { Search, SlidersHorizontal } from "lucide-react";

export const metadata = {
  title: "Search Results | Shop Kareta",
  description: "Search for premium health and wellness products on Shop Kareta.",
};

export default async function SearchResultsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const query = typeof searchParams.q === "string" ? searchParams.q : "";
  const sort = typeof searchParams.sort === "string" ? searchParams.sort : "newest";
  
  if (!query) {
    return (
      <div className="container mx-auto px-4 py-20 min-h-[60vh] flex flex-col items-center justify-center text-center">
        <Search className="w-16 h-16 text-brand-gray/30 mb-6" />
        <h1 className="text-3xl font-heading font-bold text-brand-blue mb-4">Search Shop Kareta</h1>
        <p className="text-brand-gray">Enter a product name, brand, or category to start searching.</p>
      </div>
    );
  }

  // Fetch all matching products
  let products = await searchProducts(query, 100);

  // Apply sorting
  if (sort === "price-asc") {
    products.sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    products.sort((a, b) => b.price - a.price);
  } else if (sort === "a-z") {
    products.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === "z-a") {
    products.sort((a, b) => b.name.localeCompare(a.name));
  } else {
    // "newest" or default - assuming already sorted by DB created_at implicitly or no-op
  }

  return (
    <div className="min-h-screen bg-brand-light pb-20">
      {/* Header Section */}
      <section className="bg-[#0D1B2A] text-white pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="font-heading font-bold text-3xl md:text-5xl mb-4">
            Search Results for "{query}"
          </h1>
          <p className="text-white/80 text-lg">
            Found {products.length} {products.length === 1 ? 'product' : 'products'}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 max-w-7xl -mt-8">
        <div className="bg-white rounded-2xl shadow-xl shadow-brand-blue/5 border border-brand-gray/10 p-6 md:p-8">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 pb-6 border-b border-brand-gray/10">
            <div className="flex items-center gap-2 text-brand-blue font-semibold">
              <SlidersHorizontal className="w-5 h-5" />
              <span>Filters</span>
            </div>
            
            <form method="GET" action="/search" className="flex items-center gap-2">
              <input type="hidden" name="q" value={query} />
              <label htmlFor="sort" className="text-sm font-medium text-brand-gray">Sort by:</label>
              <select 
                id="sort" 
                name="sort"
                defaultValue={sort}
                onChange={(e) => e.target.form?.submit()}
                className="bg-brand-light/50 border border-brand-gray/20 rounded-md py-1.5 px-3 text-sm text-brand-blue font-medium focus:outline-none focus:ring-2 focus:ring-[#0F6B46]/50"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="a-z">A-Z</option>
                <option value="z-a">Z-A</option>
              </select>
            </form>
          </div>

          {/* Results Grid */}
          <Suspense fallback={<div className="min-h-[40vh] flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#0F6B46]/30 border-t-[#0F6B46] rounded-full animate-spin" /></div>}>
            {products.length > 0 ? (
              <ProductGrid products={products} columns={4} />
            ) : (
              <div className="py-20 text-center">
                <Search className="w-12 h-12 text-brand-gray/30 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-brand-blue mb-2">No exact matches found</h3>
                <p className="text-brand-gray mb-6 max-w-md mx-auto">
                  We couldn't find anything matching "{query}". Try checking your spelling or using more general terms.
                </p>
                <div className="flex items-center justify-center gap-4">
                  <a href="/categories" className="px-6 py-2 rounded-full border border-brand-gray/20 font-semibold text-brand-blue hover:bg-brand-gray/5 transition-colors">
                    Browse Categories
                  </a>
                  <a href="/shop" className="px-6 py-2 rounded-full bg-[#0F6B46] font-semibold text-white hover:bg-[#0F6B46]/90 transition-colors">
                    Continue Shopping
                  </a>
                </div>
              </div>
            )}
          </Suspense>
        </div>
      </section>
    </div>
  );
}
