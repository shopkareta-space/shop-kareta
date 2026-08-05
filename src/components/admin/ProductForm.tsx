"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createAdminProduct, updateAdminProduct } from "@/lib/services/admin-product.service";
import { getAdminCategories, createAdminCategory } from "@/lib/services/admin-category.service";
import { getAdminBrands, createAdminBrand } from "@/lib/services/admin-brand.service";
import { ImageUploader } from "./ImageUploader";
import { Save, X, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export function ProductForm({ initialData = null, isEdit = false }: { initialData?: any, isEdit?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isLoadingDropdowns, setIsLoadingDropdowns] = useState(true);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [brands, setBrands] = useState<{id: string, name: string}[]>([]);
  
  const [images, setImages] = useState<any[]>(initialData?.product_images || []);

  const [brandModalOpen, setBrandModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState({
    // Basic Info
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    brand_id: initialData?.brand_id || "",
    category_id: initialData?.category_id || "",
    product_type: initialData?.product_type || "single",
    sku: initialData?.sku || "",
    short_introduction: initialData?.short_introduction || "",
    description: initialData?.description || "",
    
    // Pricing & Inventory
    original_price: initialData?.original_price || "",
    price: initialData?.price || "",
    discount: initialData?.discount || "",
    gst: initialData?.gst || "",
    inventory_count: initialData?.inventory_count || 0,
    low_stock_alert: initialData?.low_stock_alert || 10,
    weight: initialData?.weight || "",

    // Product Details
    benefits: (initialData?.benefits || []).join("\n"),
    ingredients: initialData?.ingredients || "",
    how_to_use: initialData?.how_to_use || (initialData?.directions || []).join("\n"),
    storage: initialData?.storage || "",
    safety_warnings: initialData?.safety_warnings || initialData?.precautions || "",
    suitable_for: (initialData?.suitable_for || []).join("\n"),
    who_should_avoid: initialData?.who_should_avoid || "",
    package_contents: initialData?.package_contents || (initialData?.contents || []).join("\n"),

    // Specifications
    net_quantity: initialData?.net_quantity || "",
    manufacturer: initialData?.manufacturer || "",
    country_of_origin: initialData?.country_of_origin || "",
    shelf_life: initialData?.shelf_life || "",
    expiry_date: initialData?.expiry_date || "",
    batch_number: initialData?.batch_number || "",
    hsn_code: initialData?.hsn_code || "",
    fssai_license: initialData?.fssai_license || "",

    // SEO
    seo_title: initialData?.seo_title || "",
    seo_description: initialData?.seo_description || "",
    seo_keywords: initialData?.seo_keywords || "",
    canonical_url: initialData?.canonical_url || "",

    // Publishing
    is_active: initialData?.is_active ?? true,
    is_featured: initialData?.is_featured ?? false,
    is_bestseller: initialData?.is_bestseller ?? false,
    is_new_arrival: initialData?.is_new_arrival ?? false,
    is_trending: initialData?.is_trending ?? false,
  });

  useEffect(() => {
    async function loadDropdowns() {
      setIsLoadingDropdowns(true);
      try {
        const [cats, brnds] = await Promise.all([getAdminCategories(), getAdminBrands()]);
        // Data from Supabase will come already sorted if the service orders it, but we'll sort here to be safe
        setCategories((cats || []).sort((a: any, b: any) => a.name.localeCompare(b.name)));
        setBrands((brnds || []).sort((a: any, b: any) => a.name.localeCompare(b.name)));
      } catch (error) {
        console.error("Failed to load dropdowns:", error);
      } finally {
        setIsLoadingDropdowns(false);
      }
    }
    loadDropdowns();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const generateSlug = () => {
    if (!formData.name) return;
    const generated = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setFormData(prev => ({ ...prev, slug: generated }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Parse multi-line strings into arrays for Supabase text[] columns
      const payload = {
        ...formData,
        benefits: formData.benefits.split("\n").filter(Boolean),
        suitable_for: formData.suitable_for.split("\n").filter(Boolean),
      };

      if (isEdit && initialData?.id) {
        await updateAdminProduct(initialData.id, payload, images, [], []);
        alert("Product updated successfully!");
      } else {
        await createAdminProduct(payload, images, [], []);
        alert("Product created successfully!");
      }
      router.push("/admin/products");
      router.refresh();
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Error saving product");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName.trim()) return;
    setIsCreating(true);
    try {
      const brand = await createAdminBrand({ name: newBrandName });
      setBrands(prev => [...prev, brand].sort((a: any, b: any) => a.name.localeCompare(b.name)));
      setFormData(prev => ({ ...prev, brand_id: brand.id }));
      setBrandModalOpen(false);
      setNewBrandName("");
    } catch (e: any) {
      alert("Failed to create brand: " + e.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setIsCreating(true);
    try {
      const category = await createAdminCategory({ name: newCategoryName });
      setCategories(prev => [...prev, category].sort((a: any, b: any) => a.name.localeCompare(b.name)));
      setFormData(prev => ({ ...prev, category_id: category.id }));
      setCategoryModalOpen(false);
      setNewCategoryName("");
    } catch (e: any) {
      alert("Failed to create category: " + e.message);
    } finally {
      setIsCreating(false);
    }
  };

  // Custom Searchable Dropdown
  const SearchableSelect = ({ label, options, value, onChange, isLoading, emptyMessage, onNew, newLabel }: { label: string, options: {id: string, name: string}[], value: string, onChange: (val: string) => void, isLoading: boolean, emptyMessage: string, onNew?: () => void, newLabel?: string }) => {
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const filteredOptions = options.filter(opt => opt.name.toLowerCase().includes(search.toLowerCase()));
    const selectedOption = options.find(opt => opt.id === value);

    return (
      <div className="relative w-full">
        <div className="flex justify-between items-end mb-1">
          <label className="block text-sm font-medium text-gray-700">{label}</label>
          {onNew && (
            <button type="button" onClick={onNew} className="text-[#0D1B2A] text-xs font-semibold hover:underline">
              {newLabel}
            </button>
          )}
        </div>
        <div className="relative">
          <div 
            onClick={() => setOpen(!open)}
            className="w-full px-4 py-2 bg-white rounded-lg border border-gray-200 cursor-pointer flex justify-between items-center"
          >
            <span className={selectedOption ? "text-gray-900" : "text-gray-500"}>
              {isLoading ? "Loading..." : (selectedOption ? selectedOption.name : `Select ${label}`)}
            </span>
            {isLoading ? <Loader2 className="w-4 h-4 text-gray-400 animate-spin" /> : <span className="text-gray-400">▼</span>}
          </div>
          {open && !isLoading && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              <div className="p-2 border-b sticky top-0 bg-white">
                <input
                  type="text"
                  placeholder={`Search ${label}...`}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border rounded outline-none focus:ring-1 focus:ring-[#0D1B2A]"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              {options.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">{emptyMessage}</div>
              ) : filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => (
                  <div
                    key={opt.id}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-50 text-sm ${opt.id === value ? 'bg-gray-50 font-medium text-[#0D1B2A]' : ''}`}
                    onClick={() => {
                      onChange(opt.id);
                      setOpen(false);
                      setSearch("");
                    }}
                  >
                    {opt.name}
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">No results found</div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="pb-20">
        <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100 sticky top-0 z-50 mb-6">
        <h2 className="text-xl font-bold text-gray-900">{isEdit ? 'Edit Product' : 'Create Product'}</h2>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => router.push("/admin/products")} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
            <X className="w-4 h-4 mr-2" /> Cancel
          </button>
          <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-[#0D1B2A] rounded-lg hover:bg-[#1a3553] transition-colors disabled:opacity-70 flex items-center">
            <Save className="w-4 h-4 mr-2" /> {loading ? "Saving..." : "Save Product"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <Tabs defaultValue="basic" className="w-full flex flex-col gap-8">
          <TabsList className="flex flex-col lg:flex-row h-auto w-full bg-transparent shrink-0 items-start lg:items-end space-y-1 lg:space-y-0 lg:space-x-8 lg:border-b lg:border-gray-200 lg:rounded-none lg:p-0 lg:overflow-x-auto">
            <TabsTrigger value="basic" className="w-full lg:w-auto justify-start text-left data-[state=active]:bg-gray-100 lg:data-[state=active]:bg-transparent lg:data-[state=active]:shadow-none lg:border-b-2 lg:border-transparent lg:data-[state=active]:border-[#0D1B2A] lg:rounded-none lg:pb-3 lg:pt-3 lg:-mb-[1px] data-[state=active]:text-[#0D1B2A]">Basic Information</TabsTrigger>
            <TabsTrigger value="pricing" className="w-full lg:w-auto justify-start text-left data-[state=active]:bg-gray-100 lg:data-[state=active]:bg-transparent lg:data-[state=active]:shadow-none lg:border-b-2 lg:border-transparent lg:data-[state=active]:border-[#0D1B2A] lg:rounded-none lg:pb-3 lg:pt-3 lg:-mb-[1px] data-[state=active]:text-[#0D1B2A]">Pricing & Inventory</TabsTrigger>
            <TabsTrigger value="media" className="w-full lg:w-auto justify-start text-left data-[state=active]:bg-gray-100 lg:data-[state=active]:bg-transparent lg:data-[state=active]:shadow-none lg:border-b-2 lg:border-transparent lg:data-[state=active]:border-[#0D1B2A] lg:rounded-none lg:pb-3 lg:pt-3 lg:-mb-[1px] data-[state=active]:text-[#0D1B2A]">Media</TabsTrigger>
            <TabsTrigger value="details" className="w-full lg:w-auto justify-start text-left data-[state=active]:bg-gray-100 lg:data-[state=active]:bg-transparent lg:data-[state=active]:shadow-none lg:border-b-2 lg:border-transparent lg:data-[state=active]:border-[#0D1B2A] lg:rounded-none lg:pb-3 lg:pt-3 lg:-mb-[1px] data-[state=active]:text-[#0D1B2A]">Product Details</TabsTrigger>
            <TabsTrigger value="specs" className="w-full lg:w-auto justify-start text-left data-[state=active]:bg-gray-100 lg:data-[state=active]:bg-transparent lg:data-[state=active]:shadow-none lg:border-b-2 lg:border-transparent lg:data-[state=active]:border-[#0D1B2A] lg:rounded-none lg:pb-3 lg:pt-3 lg:-mb-[1px] data-[state=active]:text-[#0D1B2A]">Specifications</TabsTrigger>
            <TabsTrigger value="seo" className="w-full lg:w-auto justify-start text-left data-[state=active]:bg-gray-100 lg:data-[state=active]:bg-transparent lg:data-[state=active]:shadow-none lg:border-b-2 lg:border-transparent lg:data-[state=active]:border-[#0D1B2A] lg:rounded-none lg:pb-3 lg:pt-3 lg:-mb-[1px] data-[state=active]:text-[#0D1B2A]">SEO</TabsTrigger>
            <TabsTrigger value="publishing" className="w-full lg:w-auto justify-start text-left data-[state=active]:bg-gray-100 lg:data-[state=active]:bg-transparent lg:data-[state=active]:shadow-none lg:border-b-2 lg:border-transparent lg:data-[state=active]:border-[#0D1B2A] lg:rounded-none lg:pb-3 lg:pt-3 lg:-mb-[1px] data-[state=active]:text-[#0D1B2A]">Publishing</TabsTrigger>
          </TabsList>

          <div className="w-full min-w-0">
            {/* Basic Information */}
            <TabsContent value="basic" className="mt-0 outline-none space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#0D1B2A] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                  <div className="flex gap-2">
                    <input type="text" name="slug" required value={formData.slug} onChange={handleChange} className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#0D1B2A] outline-none" />
                    <button type="button" onClick={generateSlug} className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200">Generate</button>
                  </div>
                </div>
                
                <SearchableSelect label="Brand" options={brands} value={formData.brand_id} onChange={(val) => setFormData(prev => ({ ...prev, brand_id: val }))} isLoading={isLoadingDropdowns} emptyMessage="No brands found. Create one first." onNew={() => setBrandModalOpen(true)} newLabel="+ New Brand" />
                <SearchableSelect label="Category" options={categories} value={formData.category_id} onChange={(val) => setFormData(prev => ({ ...prev, category_id: val }))} isLoading={isLoadingDropdowns} emptyMessage="No categories found. Create one first." onNew={() => setCategoryModalOpen(true)} newLabel="+ New Category" />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Type</label>
                  <select name="product_type" value={formData.product_type} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#0D1B2A] outline-none">
                    <option value="single">Single</option>
                    <option value="combo">Combo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                  <input type="text" name="sku" value={formData.sku} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#0D1B2A] outline-none" />
                </div>
              </div>

              {/* Full width textareas outside the 2-column grid */}
              <div className="space-y-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                  <textarea name="short_introduction" rows={2} value={formData.short_introduction} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#0D1B2A] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Description (Product Overview)</label>
                  <textarea name="description" rows={5} value={formData.description} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#0D1B2A] outline-none" />
                </div>
              </div>
            </TabsContent>

            {/* Pricing & Inventory */}
            <TabsContent value="pricing" className="mt-0 outline-none space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Pricing & Inventory</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">MRP (Original Price) (₹)</label>
                  <input type="number" name="original_price" min="0" step="0.01" value={formData.original_price} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#0D1B2A] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price (₹) *</label>
                  <input type="number" name="price" required min="0" step="0.01" value={formData.price} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#0D1B2A] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount %</label>
                  <input type="number" name="discount" min="0" max="100" step="0.1" value={formData.discount} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#0D1B2A] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GST %</label>
                  <input type="number" name="gst" min="0" max="100" step="0.1" value={formData.gst} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#0D1B2A] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
                  <input type="number" name="inventory_count" required min="0" value={formData.inventory_count} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#0D1B2A] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Alert Level</label>
                  <input type="number" name="low_stock_alert" min="0" value={formData.low_stock_alert} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#0D1B2A] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight (e.g. 500g, 1kg)</label>
                  <input type="text" name="weight" value={formData.weight} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#0D1B2A] outline-none" />
                </div>
              </div>
            </TabsContent>

            {/* Media */}
            <TabsContent value="media" className="mt-0 outline-none space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Media</h3>
              <p className="text-sm text-gray-500">Upload multiple images, drag to reorder, and select a thumbnail.</p>
              <ImageUploader images={images} setImages={setImages} />
            </TabsContent>

            {/* Product Details */}
            <TabsContent value="details" className="mt-0 outline-none space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Product Details</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Key Benefits (One per line)</label>
                  <textarea name="benefits" rows={4} value={formData.benefits} onChange={handleChange} placeholder="Boosts immunity&#10;Improves skin health" className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-[#0D1B2A]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ingredients</label>
                  <textarea name="ingredients" rows={4} value={formData.ingredients} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-[#0D1B2A]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">How to Use</label>
                  <textarea name="how_to_use" rows={3} value={formData.how_to_use} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-[#0D1B2A]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Storage Instructions</label>
                  <textarea name="storage" rows={2} value={formData.storage} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-[#0D1B2A]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Safety & Warnings</label>
                  <textarea name="safety_warnings" rows={3} value={formData.safety_warnings} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-[#0D1B2A]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Suitable For (One per line)</label>
                  <textarea name="suitable_for" rows={2} value={formData.suitable_for} onChange={handleChange} placeholder="Adults&#10;Seniors" className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-[#0D1B2A]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Who Should Avoid</label>
                  <textarea name="who_should_avoid" rows={2} value={formData.who_should_avoid} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-[#0D1B2A]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Package Contents</label>
                  <textarea name="package_contents" rows={2} value={formData.package_contents} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-[#0D1B2A]" />
                </div>
              </div>
            </TabsContent>

            {/* Specifications */}
            <TabsContent value="specs" className="mt-0 outline-none space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Specifications</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Net Quantity</label>
                  <input type="text" name="net_quantity" value={formData.net_quantity} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-[#0D1B2A]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
                  <input type="text" name="manufacturer" value={formData.manufacturer} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-[#0D1B2A]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country of Origin</label>
                  <input type="text" name="country_of_origin" value={formData.country_of_origin} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-[#0D1B2A]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shelf Life</label>
                  <input type="text" name="shelf_life" value={formData.shelf_life} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-[#0D1B2A]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
                  <input type="text" name="expiry_date" value={formData.expiry_date} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-[#0D1B2A]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Batch Number</label>
                  <input type="text" name="batch_number" value={formData.batch_number} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-[#0D1B2A]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">HSN Code</label>
                  <input type="text" name="hsn_code" value={formData.hsn_code} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-[#0D1B2A]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">FSSAI / AYUSH License</label>
                  <input type="text" name="fssai_license" value={formData.fssai_license} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-[#0D1B2A]" />
                </div>
              </div>
            </TabsContent>

            {/* SEO */}
            <TabsContent value="seo" className="mt-0 outline-none space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">SEO</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                  <input type="text" name="seo_title" value={formData.seo_title} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-[#0D1B2A]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                  <textarea name="seo_description" rows={3} value={formData.seo_description} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-[#0D1B2A]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
                  <input type="text" name="seo_keywords" value={formData.seo_keywords} onChange={handleChange} placeholder="Comma separated keywords" className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-[#0D1B2A]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Canonical URL</label>
                  <input type="url" name="canonical_url" value={formData.canonical_url} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-[#0D1B2A]" />
                </div>
              </div>
            </TabsContent>

            {/* Publishing */}
            <TabsContent value="publishing" className="mt-0 outline-none space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Publishing</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <label className="flex items-start gap-4 p-4 border rounded-xl cursor-pointer hover:bg-gray-50">
                  <div className="mt-0.5">
                    <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className="w-5 h-5 text-[#0D1B2A] rounded border-gray-300 focus:ring-[#0D1B2A]" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Publish Product</div>
                    <div className="text-sm text-gray-500">Make this product visible to customers.</div>
                  </div>
                </label>
                <label className="flex items-start gap-4 p-4 border rounded-xl cursor-pointer hover:bg-gray-50">
                  <div className="mt-0.5">
                    <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleChange} className="w-5 h-5 text-amber-500 rounded border-gray-300 focus:ring-amber-500" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Featured Product</div>
                    <div className="text-sm text-gray-500">Showcase on the homepage and top sections.</div>
                  </div>
                </label>
                <label className="flex items-start gap-4 p-4 border rounded-xl cursor-pointer hover:bg-gray-50">
                  <div className="mt-0.5">
                    <input type="checkbox" name="is_bestseller" checked={formData.is_bestseller} onChange={handleChange} className="w-5 h-5 text-green-600 rounded border-gray-300 focus:ring-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Bestseller Badge</div>
                    <div className="text-sm text-gray-500">Display the 'Bestseller' badge on the card.</div>
                  </div>
                </label>
                <label className="flex items-start gap-4 p-4 border rounded-xl cursor-pointer hover:bg-gray-50">
                  <div className="mt-0.5">
                    <input type="checkbox" name="is_new_arrival" checked={formData.is_new_arrival} onChange={handleChange} className="w-5 h-5 text-blue-500 rounded border-gray-300 focus:ring-blue-500" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">New Arrival</div>
                    <div className="text-sm text-gray-500">Display the 'New Arrival' badge.</div>
                  </div>
                </label>
                <label className="flex items-start gap-4 p-4 border rounded-xl cursor-pointer hover:bg-gray-50">
                  <div className="mt-0.5">
                    <input type="checkbox" name="is_trending" checked={formData.is_trending} onChange={handleChange} className="w-5 h-5 text-pink-500 rounded border-gray-300 focus:ring-pink-500" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Trending Now</div>
                    <div className="text-sm text-gray-500">Highlight as a trending item.</div>
                  </div>
                </label>
              </div>
            </TabsContent>

          </div>
        </Tabs>
      </div>
    </form>

      <Dialog open={brandModalOpen} onOpenChange={setBrandModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Brand</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateBrand} className="space-y-4 pt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name *</label>
              <input type="text" required value={newBrandName} onChange={e => setNewBrandName(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#0D1B2A] outline-none" placeholder="e.g. Vedique Nutrition" />
            </div>
            <DialogFooter>
              <button type="button" onClick={() => setBrandModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
              <button type="submit" disabled={isCreating || !newBrandName.trim()} className="px-4 py-2 text-sm font-medium text-white bg-[#0D1B2A] rounded-lg hover:bg-[#1a3553] disabled:opacity-70">
                {isCreating ? "Creating..." : "Create Brand"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={categoryModalOpen} onOpenChange={setCategoryModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateCategory} className="space-y-4 pt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category Name *</label>
              <input type="text" required value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#0D1B2A] outline-none" placeholder="e.g. Health & Wellness" />
            </div>
            <DialogFooter>
              <button type="button" onClick={() => setCategoryModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
              <button type="submit" disabled={isCreating || !newCategoryName.trim()} className="px-4 py-2 text-sm font-medium text-white bg-[#0D1B2A] rounded-lg hover:bg-[#1a3553] disabled:opacity-70">
                {isCreating ? "Creating..." : "Create Category"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
