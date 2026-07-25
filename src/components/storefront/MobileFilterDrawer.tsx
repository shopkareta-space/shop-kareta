"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ShopFilters } from "./ShopFilters";

interface MobileFilterDrawerProps {
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

export function MobileFilterDrawer(props: MobileFilterDrawerProps) {
  return (
    <Drawer shouldScaleBackground={true}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm" className="lg:hidden flex items-center gap-2 border-brand-gray/20">
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filters</span>
        </Button>
      </DrawerTrigger>
      
      <DrawerContent side="left" className="h-full bg-brand-light border-r border-brand-gray/10">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-brand-gray/10 bg-white">
            <h2 className="font-heading text-lg font-semibold text-brand-blue">Filters</h2>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-brand-gray hover:bg-brand-gray/10">
                <X className="w-4 h-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DrawerClose>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 bg-white">
            <ShopFilters {...props} />
          </div>
          
          <div className="p-4 border-t border-brand-gray/10 bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
            <DrawerClose asChild>
              <Button className="w-full bg-brand-green hover:bg-[#0c593a] text-white">
                Show Results
              </Button>
            </DrawerClose>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
