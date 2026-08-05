"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAdminBrand, updateAdminBrand } from "@/lib/services/admin-brand.service";
import { SingleImageUploader } from "./SingleImageUploader";
import { Save, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function BrandForm({ initialData = null, isEdit = false }: { initialData?: any, isEdit?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    short_description: initialData?.short_description || "",
    logo_url: initialData?.logo_url || "",
    banner_url: initialData?.banner_url || "",
    thumbnail_url: initialData?.thumbnail_url || "",
    founder: initialData?.founder || "",
    established_year: initialData?.established_year || "",
    country_of_origin: initialData?.country_of_origin || "",
    website: initialData?.website || "",
    support_email: initialData?.support_email || "",
    support_phone: initialData?.support_phone || "",
    social_instagram: initialData?.social_instagram || "",
    social_facebook: initialData?.social_facebook || "",
    social_youtube: initialData?.social_youtube || "",
    social_twitter: initialData?.social_twitter || "",
    social_linkedin: initialData?.social_linkedin || "",
    display_order: initialData?.display_order || 0,
    featured: initialData?.featured || false,
    show_on_homepage: initialData?.show_on_homepage || false,
    seo_title: initialData?.seo_title || "",
    seo_description: initialData?.seo_description || "",
    seo_keywords: initialData?.seo_keywords || "",
    is_active: initialData?.is_active ?? true,
    is_public: initialData?.is_public ?? true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      if (isEdit && initialData?.id) {
        await updateAdminBrand(initialData.id, formData);
        alert("Brand updated successfully!");
      } else {
        await createAdminBrand(formData);
        alert("Brand created successfully!");
      }
      router.push("/admin/brands");
      router.refresh();
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Error saving brand");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="pb-20">
        <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100 sticky top-0 z-50 mb-6">
          <h2 className="text-xl font-bold text-gray-900">{isEdit ? 'Edit Brand' : 'Create Brand'}</h2>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => router.push("/admin/brands")} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
              <X className="w-4 h-4 mr-2" /> Cancel
            </button>
            <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-[#0D1B2A] rounded-lg hover:bg-[#1a3553] transition-colors disabled:opacity-70 flex items-center">
              <Save className="w-4 h-4 mr-2" /> {loading ? "Saving..." : "Save Brand"}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <Tabs defaultValue="basic" className="w-full flex flex-col gap-8">
            <TabsList className="flex flex-col lg:flex-row h-auto w-full bg-transparent shrink-0 items-start lg:items-end space-y-1 lg:space-y-0 lg:space-x-8 lg:border-b lg:border-gray-200 lg:rounded-none lg:p-0 lg:overflow-x-auto">
              <TabsTrigger value="basic" className="w-full lg:w-auto justify-start text-left data-[state=active]:bg-gray-100 lg:data-[state=active]:bg-transparent lg:data-[state=active]:shadow-none lg:border-b-2 lg:border-transparent lg:data-[state=active]:border-[#0D1B2A] lg:rounded-none lg:pb-3 lg:pt-3 lg:-mb-[1px] data-[state=active]:text-[#0D1B2A]">Basic Information</TabsTrigger>
              <TabsTrigger value="media" className="w-full lg:w-auto justify-start text-left data-[state=active]:bg-gray-100 lg:data-[state=active]:bg-transparent lg:data-[state=active]:shadow-none lg:border-b-2 lg:border-transparent lg:data-[state=active]:border-[#0D1B2A] lg:rounded-none lg:pb-3 lg:pt-3 lg:-mb-[1px] data-[state=active]:text-[#0D1B2A]">Media</TabsTrigger>
              <TabsTrigger value="details" className="w-full lg:w-auto justify-start text-left data-[state=active]:bg-gray-100 lg:data-[state=active]:bg-transparent lg:data-[state=active]:shadow-none lg:border-b-2 lg:border-transparent lg:data-[state=active]:border-[#0D1B2A] lg:rounded-none lg:pb-3 lg:pt-3 lg:-mb-[1px] data-[state=active]:text-[#0D1B2A]">Brand Details</TabsTrigger>
              <TabsTrigger value="social" className="w-full lg:w-auto justify-start text-left data-[state=active]:bg-gray-100 lg:data-[state=active]:bg-transparent lg:data-[state=active]:shadow-none lg:border-b-2 lg:border-transparent lg:data-[state=active]:border-[#0D1B2A] lg:rounded-none lg:pb-3 lg:pt-3 lg:-mb-[1px] data-[state=active]:text-[#0D1B2A]">Social Media</TabsTrigger>
              <TabsTrigger value="homepage" className="w-full lg:w-auto justify-start text-left data-[state=active]:bg-gray-100 lg:data-[state=active]:bg-transparent lg:data-[state=active]:shadow-none lg:border-b-2 lg:border-transparent lg:data-[state=active]:border-[#0D1B2A] lg:rounded-none lg:pb-3 lg:pt-3 lg:-mb-[1px] data-[state=active]:text-[#0D1B2A]">Homepage</TabsTrigger>
              <TabsTrigger value="seo" className="w-full lg:w-auto justify-start text-left data-[state=active]:bg-gray-100 lg:data-[state=active]:bg-transparent lg:data-[state=active]:shadow-none lg:border-b-2 lg:border-transparent lg:data-[state=active]:border-[#0D1B2A] lg:rounded-none lg:pb-3 lg:pt-3 lg:-mb-[1px] data-[state=active]:text-[#0D1B2A]">SEO</TabsTrigger>
              <TabsTrigger value="publishing" className="w-full lg:w-auto justify-start text-left data-[state=active]:bg-gray-100 lg:data-[state=active]:bg-transparent lg:data-[state=active]:shadow-none lg:border-b-2 lg:border-transparent lg:data-[state=active]:border-[#0D1B2A] lg:rounded-none lg:pb-3 lg:pt-3 lg:-mb-[1px] data-[state=active]:text-[#0D1B2A]">Publishing</TabsTrigger>
            </TabsList>

            <div className="w-full min-w-0">
              {/* Basic Information */}
              <TabsContent value="basic" className="mt-0 outline-none space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name *</label>
                    <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#0D1B2A] outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                    <div className="flex gap-2">
                      <input type="text" name="slug" required value={formData.slug} onChange={handleChange} className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#0D1B2A] outline-none" />
                      <button type="button" onClick={generateSlug} className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200">Generate</button>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                    <textarea name="short_description" rows={2} value={formData.short_description} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#0D1B2A] outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">About Brand (Full Description)</label>
                    <textarea name="description" rows={4} value={formData.description} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#0D1B2A] outline-none" />
                  </div>
                </div>
              </TabsContent>

              {/* Media */}
              <TabsContent value="media" className="mt-0 outline-none space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Media</h3>
                
                <div className="space-y-8">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Brand Logo</h4>
                    <SingleImageUploader value={formData.logo_url} onChange={(url) => setFormData(prev => ({ ...prev, logo_url: url }))} label="Upload Logo" bucket="product-images" />
                  </div>
                  <hr />
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Brand Banner (For Brand Page Header)</h4>
                    <SingleImageUploader value={formData.banner_url} onChange={(url) => setFormData(prev => ({ ...prev, banner_url: url }))} label="Upload Banner" bucket="product-images" />
                  </div>
                  <hr />
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Brand Thumbnail (For Cards/Grids)</h4>
                    <SingleImageUploader value={formData.thumbnail_url} onChange={(url) => setFormData(prev => ({ ...prev, thumbnail_url: url }))} label="Upload Thumbnail" bucket="product-images" />
                  </div>
                </div>
              </TabsContent>

              {/* Brand Details */}
              <TabsContent value="details" className="mt-0 outline-none space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Brand Details</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Founder (Optional)</label>
                    <input type="text" name="founder" value={formData.founder} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#0D1B2A] outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Established Year (Optional)</label>
                    <input type="number" name="established_year" value={formData.established_year} onChange={handleChange} placeholder="e.g. 2010" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#0D1B2A] outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country of Origin</label>
                    <input type="text" name="country_of_origin" value={formData.country_of_origin} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#0D1B2A] outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <input type="url" name="website" value={formData.website} onChange={handleChange} placeholder="https://" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#0D1B2A] outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
                    <input type="email" name="support_email" value={formData.support_email} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#0D1B2A] outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Support Phone</label>
                    <input type="tel" name="support_phone" value={formData.support_phone} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#0D1B2A] outline-none" />
                  </div>
                </div>
              </TabsContent>

              {/* Social Media */}
              <TabsContent value="social" className="mt-0 outline-none space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Social Media</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
                    <input type="url" name="social_instagram" value={formData.social_instagram} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#0D1B2A] outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
                    <input type="url" name="social_facebook" value={formData.social_facebook} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#0D1B2A] outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL</label>
                    <input type="url" name="social_youtube" value={formData.social_youtube} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#0D1B2A] outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">X (Twitter) URL</label>
                    <input type="url" name="social_twitter" value={formData.social_twitter} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#0D1B2A] outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                    <input type="url" name="social_linkedin" value={formData.social_linkedin} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#0D1B2A] outline-none" />
                  </div>
                </div>
              </TabsContent>

              {/* Homepage */}
              <TabsContent value="homepage" className="mt-0 outline-none space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Homepage</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <label className="flex items-start gap-4 p-4 border rounded-xl cursor-pointer hover:bg-gray-50">
                    <div className="mt-0.5">
                      <input type="checkbox" name="show_on_homepage" checked={formData.show_on_homepage} onChange={handleChange} className="w-5 h-5 text-[#0D1B2A] rounded border-gray-300 focus:ring-[#0D1B2A]" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Show on Homepage</div>
                      <div className="text-sm text-gray-500">Include this brand in homepage brand carousels/grids.</div>
                    </div>
                  </label>
                  <label className="flex items-start gap-4 p-4 border rounded-xl cursor-pointer hover:bg-gray-50">
                    <div className="mt-0.5">
                      <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="w-5 h-5 text-amber-500 rounded border-gray-300 focus:ring-amber-500" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Featured Brand</div>
                      <div className="text-sm text-gray-500">Highlight this brand in special featured sections.</div>
                    </div>
                  </label>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Homepage Display Order</label>
                    <input type="number" name="display_order" value={formData.display_order} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#0D1B2A] outline-none" placeholder="0" />
                    <p className="text-xs text-gray-500 mt-1">Lower numbers appear first in lists.</p>
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
                </div>
              </TabsContent>

              {/* Publishing */}
              <TabsContent value="publishing" className="mt-0 outline-none space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Publishing</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <label className="flex items-start gap-4 p-4 border rounded-xl cursor-pointer hover:bg-gray-50">
                    <div className="mt-0.5">
                      <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className="w-5 h-5 text-green-600 rounded border-gray-300 focus:ring-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Active Brand</div>
                      <div className="text-sm text-gray-500">Enable this brand across the platform.</div>
                    </div>
                  </label>
                  <label className="flex items-start gap-4 p-4 border rounded-xl cursor-pointer hover:bg-gray-50">
                    <div className="mt-0.5">
                      <input type="checkbox" name="is_public" checked={formData.is_public} onChange={handleChange} className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Public Visibility</div>
                      <div className="text-sm text-gray-500">Allow customers to view this brand's public page.</div>
                    </div>
                  </label>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </form>
    </>
  );
}
