"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, X, Loader2 } from "lucide-react";
import { useDebounce } from "use-debounce";
import { Product } from "@/types/product";

export function LiveSearch({ isHome, onClose }: { isHome: boolean, onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 300);
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    async function fetchResults() {
      if (!debouncedQuery.trim()) {
        setResults([]);
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}&limit=8`);
        const data = await res.json();
        setResults(data.products || []);
      } catch (error) {
        console.error("Failed to fetch search results", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchResults();
    setSelectedIndex(-1);
  }, [debouncedQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        // Navigate to selected product
        router.push(`/products/${results[selectedIndex].id}`);
        onClose();
      } else if (query.trim()) {
        // Search all
        router.push(`/search?q=${encodeURIComponent(query)}`);
        onClose();
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      onClose();
    }
  };

  return (
    <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-end z-50 w-[280px] sm:w-[400px]" ref={containerRef}>
      {/* Search Input Box */}
      <form 
        onSubmit={handleSearchSubmit}
        className={`flex items-center rounded-full px-4 py-2 shadow-md overflow-hidden w-full transition-all duration-300 ${
          isHome ? 'bg-white/10 border border-white/20 backdrop-blur-md' : 'bg-white border border-brand-gray/20'
        }`}
      >
        <Search className={`w-4 h-4 mr-2 shrink-0 ${isHome ? 'text-white/70' : 'text-brand-gray'}`} />
        <input 
          ref={inputRef}
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search premium products..." 
          className={`w-full bg-transparent border-none outline-none text-sm ${isHome ? 'text-white placeholder:text-white/50' : 'text-[#0D1B2A] placeholder:text-brand-gray/50'}`}
          autoComplete="off"
        />
        {isLoading ? (
          <Loader2 className={`w-4 h-4 animate-spin ml-2 shrink-0 ${isHome ? 'text-white/70' : 'text-brand-gray'}`} />
        ) : (
          <button type="button" onClick={onClose} className={`ml-2 hover:text-[#0F6B46] shrink-0 ${isHome ? 'text-white/70 hover:text-white' : 'text-brand-gray hover:text-[#0D1B2A]'}`}>
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Dropdown Results */}
      {query.trim().length > 0 && (
        <div className="absolute top-full right-0 mt-2 w-full bg-white rounded-xl shadow-xl border border-brand-gray/10 overflow-hidden max-h-[70vh] flex flex-col">
          <div className="overflow-y-auto flex-1 p-2">
            {results.length > 0 ? (
              <ul className="space-y-1">
                {results.map((product, index) => (
                  <li key={product.id}>
                    <Link 
                      href={`/products/${product.id}`}
                      onClick={onClose}
                      className={`flex items-center gap-3 p-2 rounded-lg transition-colors hover:bg-brand-gray/5 ${selectedIndex === index ? 'bg-brand-gray/10' : ''}`}
                    >
                      <div className="relative w-12 h-12 shrink-0 bg-brand-light rounded-md overflow-hidden">
                        <Image 
                          src={product.images[0] || '/images/placeholder.webp'} 
                          alt={product.name} 
                          fill 
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-brand-blue truncate">{product.name}</p>
                        <p className="text-xs text-brand-gray truncate">{product.brand} • {product.category}</p>
                      </div>
                      <div className="text-sm font-semibold text-brand-blue shrink-0">
                        ₹{product.price}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : !isLoading ? (
              <div className="p-6 text-center">
                <p className="text-sm text-brand-blue font-medium mb-1">No products found</p>
                <p className="text-xs text-brand-gray mb-4">Try checking your spelling or use more general terms</p>
                <div className="flex flex-col gap-2">
                  <Link href="/categories" onClick={onClose} className="text-xs font-semibold text-[#0F6B46] hover:underline">
                    Browse Categories
                  </Link>
                  <Link href="/shop" onClick={onClose} className="text-xs font-semibold text-[#0F6B46] hover:underline">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-brand-gray">
                Searching...
              </div>
            )}
          </div>
          
          {results.length > 0 && (
            <div className="p-2 border-t border-brand-gray/10 bg-brand-light/30">
              <Link 
                href={`/search?q=${encodeURIComponent(query)}`} 
                onClick={onClose}
                className="block text-center text-xs font-semibold text-[#0F6B46] hover:underline py-2"
              >
                View all results for "{query}"
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
