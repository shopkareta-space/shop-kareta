import { CategoryShowcase } from "@/components/storefront/CategoryShowcase";
import { CategorySearch } from "@/components/storefront/CategorySearch";

export const metadata = {
  title: "Categories | Shop Kareta",
  description: "Browse our curated selection of premium wellness and beauty categories.",
};

interface CategoriesPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function CategoriesPage({ searchParams }: CategoriesPageProps) {
  const qParam = searchParams.q;
  const query = typeof qParam === 'string' ? qParam : (Array.isArray(qParam) ? qParam[0] : undefined);

  return (
    <div className="flex flex-col bg-brand-light min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#0D1B2A] py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-4">
            Shop by Categories
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto text-lg">
            Find exactly what your body needs with our targeted wellness categories. From immunity to natural beauty, explore our premium collections.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <CategorySearch />

        {!query && (
          <section className="mb-20">
            <div className="flex flex-col items-center text-center mb-10">
              <span className="text-brand-green font-semibold tracking-wider uppercase text-sm mb-2 block">Premium Curations</span>
              <h2 className="font-heading text-3xl font-bold text-brand-blue">Featured Categories</h2>
            </div>
            <CategoryShowcase featuredOnly={true} />
          </section>
        )}

        <section>
          <div className="flex flex-col items-center text-center mb-10">
            <h2 className="font-heading text-3xl font-bold text-brand-blue">
              {query ? `Search Results for "${query}"` : "All Categories"}
            </h2>
          </div>
          <CategoryShowcase searchQuery={query} />
        </section>
      </div>
    </div>
  );
}
