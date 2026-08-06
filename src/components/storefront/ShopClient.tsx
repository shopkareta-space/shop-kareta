"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShopFilters } from "@/components/storefront/ShopFilters";
import { MobileFilterDrawer } from "@/components/storefront/MobileFilterDrawer";
import { SortDropdown } from "@/components/storefront/SortDropdown";
import { ProductGrid } from "@/components/storefront/ProductGrid";
import { Product } from "@/types/product";
import { ChevronRight } from "lucide-react";

interface ShopClientProps {
  initialProducts: Product[];
  categories: string[];
  brands: string[];
}

export function ShopClient({ initialProducts, categories, brands }: ShopClientProps) {
  const searchParams = useSearchParams();

  // Initialize selected categories from URL (e.g., ?category=health-wellness)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    const categoryQuery = searchParams?.getAll("category") || [];
    if (categoryQuery.length === 0) return [];
    return categories.filter(c => 
      categoryQuery.some(q => c.toLowerCase().includes(q.toLowerCase().replace(/-/g, ' '))) ||
      categoryQuery.some(q => c.toLowerCase().replace(/[^a-z0-9]+/g, '-') === q)
    );
  });

  // Initialize selected brands from URL (e.g., ?brand=vedique)
  const [selectedBrands, setSelectedBrands] = useState<string[]>(() => {
    const brandQuery = searchParams?.getAll("brand") || [];
    if (brandQuery.length === 0) return [];
    return brands.filter(b => 
      brandQuery.some(q => b.toLowerCase().includes(q.toLowerCase().replace(/-/g, ' '))) ||
      brandQuery.some(q => b.toLowerCase().replace(/[^a-z0-9]+/g, '-') === q)
    );
  });

  const [priceRange, setPriceRange] = useState<number[]>([0, 5000]);
  const [sortValue, setSortValue] = useState("recommended");

  // Sync state if URL changes (optional, useful for browser back/forward navigation)
  useEffect(() => {
    const categoryQuery = searchParams?.getAll("category") || [];
    if (categoryQuery.length > 0) {
      setSelectedCategories(categories.filter(c => 
        categoryQuery.some(q => c.toLowerCase().includes(q.toLowerCase().replace(/-/g, ' '))) ||
        categoryQuery.some(q => c.toLowerCase().replace(/[^a-z0-9]+/g, '-') === q)
      ));
    }

    const brandQuery = searchParams?.getAll("brand") || [];
    if (brandQuery.length > 0) {
      setSelectedBrands(brands.filter(b => 
        brandQuery.some(q => b.toLowerCase().includes(q.toLowerCase().replace(/-/g, ' '))) ||
        brandQuery.some(q => b.toLowerCase().replace(/[^a-z0-9]+/g, '-') === q)
      ));
    }
  }, [searchParams, categories, brands]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const handleClearAll = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, 5000]);
  };

  const filteredAndSortedProducts = useMemo(() => {
    const result = initialProducts.filter(product => {
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      return matchesCategory && matchesBrand && matchesPrice;
    });

    switch (sortValue) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // "recommended" - Keep original order or apply custom logic
        break;
    }

    return result;
  }, [initialProducts, selectedCategories, selectedBrands, priceRange, sortValue]);

  return (
    <div className="flex flex-col bg-brand-light">
      {/* Shop Hero */}
      <section className="bg-brand-blue py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-brand-light mb-4">
            Our Products
          </h1>
          <p className="text-brand-light/80 max-w-2xl mx-auto">
            Explore our premium collection of authentic Ayurvedic and wellness solutions, carefully crafted for your everyday health and vitality.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center text-sm text-brand-gray mb-8">
          <Link href="/" className="hover:text-brand-green transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-brand-blue font-medium">Shop</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block w-64 shrink-0 sticky top-28 self-start">
            <ShopFilters 
              categories={categories}
              brands={brands}
              selectedCategories={selectedCategories}
              selectedBrands={selectedBrands}
              priceRange={priceRange}
              onCategoryChange={handleCategoryChange}
              onBrandChange={handleBrandChange}
              onPriceChange={setPriceRange}
              onClearAll={handleClearAll}
            />
          </aside>

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Toolbar (Mobile Filter Trigger, Results Count, Sorting) */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-brand-gray/20">
              <div className="flex items-center gap-4">
                <MobileFilterDrawer 
                  categories={categories}
                  brands={brands}
                  selectedCategories={selectedCategories}
                  selectedBrands={selectedBrands}
                  priceRange={priceRange}
                  onCategoryChange={handleCategoryChange}
                  onBrandChange={handleBrandChange}
                  onPriceChange={setPriceRange}
                  onClearAll={handleClearAll}
                />
                <p className="text-sm text-brand-gray">
                  Showing <span className="font-medium text-brand-blue">{filteredAndSortedProducts.length}</span> results
                </p>
              </div>
              
              <SortDropdown value={sortValue} onValueChange={setSortValue} />
            </div>

            {/* Product Grid */}
            <ProductGrid 
              products={filteredAndSortedProducts} 
              hasActiveCategoryFilter={selectedCategories.length > 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
