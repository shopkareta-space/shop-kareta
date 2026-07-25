"use client";

import { X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion, AnimatePresence } from "framer-motion";
import { scaleUp } from "@/lib/motion";

interface ShopFiltersProps {
  categories: string[];
  brands: string[];
  selectedCategories: string[];
  selectedBrands: string[];
  priceRange: number[];
  onCategoryChange: (category: string) => void;
  onBrandChange: (brand: string) => void;
  onPriceChange: (value: number[]) => void;
  onClearAll?: () => void;
}

export function ShopFilters({
  categories,
  brands,
  selectedCategories,
  selectedBrands,
  priceRange,
  onCategoryChange,
  onBrandChange,
  onPriceChange,
  onClearAll,
}: ShopFiltersProps) {
  const hasActiveFilters = selectedCategories.length > 0 || selectedBrands.length > 0 || priceRange[0] > 0 || priceRange[1] < 5000;

  return (
    <div className="w-full space-y-8">
      {/* Header & Clear All */}
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-semibold text-xl text-brand-blue">Filters</h3>
        {hasActiveFilters && onClearAll && (
          <button 
            onClick={onClearAll}
            className="text-xs font-medium text-brand-gray hover:text-brand-green transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Active Filter Chips */}
      <div className="min-h-[2rem]">
        <AnimatePresence mode="popLayout">
          {hasActiveFilters && (
            <motion.div layout className="flex flex-wrap gap-2">
              {selectedCategories.map((cat) => (
                <motion.div
                  key={`active-cat-${cat}`}
                  layout
                  variants={scaleUp}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="flex items-center gap-1.5 bg-brand-light border border-brand-green/20 text-brand-blue text-xs font-medium py-1.5 px-3 rounded-full"
                >
                  <span>{cat}</span>
                  <button onClick={() => onCategoryChange(cat)} className="hover:text-brand-green transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ))}
              {selectedBrands.map((brand) => (
                <motion.div
                  key={`active-brand-${brand}`}
                  layout
                  variants={scaleUp}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="flex items-center gap-1.5 bg-brand-light border border-brand-green/20 text-brand-blue text-xs font-medium py-1.5 px-3 rounded-full"
                >
                  <span>{brand}</span>
                  <button onClick={() => onBrandChange(brand)} className="hover:text-brand-green transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Filter Accordions */}
      <Accordion defaultValue={["categories", "brands", "price"]} className="w-full">
        <AccordionItem value="categories" className="border-brand-gray/10 py-2">
          <AccordionTrigger className="text-sm font-semibold hover:text-brand-green">
            <span className="flex items-center gap-2">
              Categories
              <AnimatePresence>
                {selectedCategories.length > 0 && (
                  <motion.span 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-green/10 text-[10px] text-brand-green"
                  >
                    {selectedCategories.length}
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-4 pb-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-3">
                  <Checkbox 
                    id={`cat-${category}`} 
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => onCategoryChange(category)}
                    className="rounded-sm border-brand-gray/30 text-brand-green focus:ring-brand-green"
                  />
                  <label
                    htmlFor={`cat-${category}`}
                    className="text-sm text-brand-blue/80 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer hover:text-brand-green transition-colors"
                  >
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="brands" className="border-brand-gray/10 py-2">
          <AccordionTrigger className="text-sm font-semibold hover:text-brand-green">
            <span className="flex items-center gap-2">
              Brands
              <AnimatePresence>
                {selectedBrands.length > 0 && (
                  <motion.span 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-green/10 text-[10px] text-brand-green"
                  >
                    {selectedBrands.length}
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-4 pb-2">
              {brands.map((brand) => (
                <div key={brand} className="flex items-center space-x-3">
                  <Checkbox 
                    id={`brand-${brand}`} 
                    checked={selectedBrands.includes(brand)}
                    onCheckedChange={() => onBrandChange(brand)}
                    className="rounded-sm border-brand-gray/30 text-brand-green focus:ring-brand-green"
                  />
                  <label
                    htmlFor={`brand-${brand}`}
                    className="text-sm text-brand-blue/80 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer hover:text-brand-green transition-colors"
                  >
                    {brand}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price" className="border-brand-gray/10 py-2">
          <AccordionTrigger className="text-sm font-semibold hover:text-brand-green">Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="pt-6 pb-4 px-2">
              <Slider
                defaultValue={[0, 5000]}
                value={priceRange}
                max={5000}
                step={100}
                onValueChange={(val) => onPriceChange(val as number[])}
                className="my-4 cursor-pointer"
              />
              <div className="flex items-center justify-between mt-6">
                <div className="bg-brand-light px-3 py-1.5 rounded-md border border-brand-gray/20">
                  <span className="text-xs font-semibold text-brand-blue">₹{priceRange[0]}</span>
                </div>
                <span className="text-brand-gray/50">-</span>
                <div className="bg-brand-light px-3 py-1.5 rounded-md border border-brand-gray/20">
                  <span className="text-xs font-semibold text-brand-blue">₹{priceRange[1]}</span>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
