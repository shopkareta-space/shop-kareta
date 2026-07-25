"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SortDropdownProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function SortDropdown({ value, onValueChange }: SortDropdownProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-brand-gray hidden sm:inline-block">Sort by:</span>
      <Select value={value} onValueChange={(val) => { if (val) onValueChange(val); }}>
        <SelectTrigger className="w-[160px] sm:w-[180px] h-9 border-brand-gray/20 text-sm focus:ring-brand-green">
          <SelectValue placeholder="Recommended" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="recommended">Recommended</SelectItem>
          <SelectItem value="price-asc">Price: Low to High</SelectItem>
          <SelectItem value="price-desc">Price: High to Low</SelectItem>
          <SelectItem value="name-asc">Name: A to Z</SelectItem>
          <SelectItem value="name-desc">Name: Z to A</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
