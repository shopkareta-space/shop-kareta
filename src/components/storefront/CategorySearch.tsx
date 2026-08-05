"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, FormEvent } from "react";

export function CategorySearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/categories?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/categories");
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-16">
      <div className="relative flex items-center">
        <Search className="absolute left-6 w-5 h-5 text-brand-gray" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search categories by name..."
          className="w-full pl-14 pr-6 py-4 rounded-full border border-brand-gray/20 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all text-lg"
        />
        <button 
          type="submit"
          className="absolute right-3 bg-brand-green text-white px-6 py-2 rounded-full font-semibold hover:bg-[#148356] transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  );
}
