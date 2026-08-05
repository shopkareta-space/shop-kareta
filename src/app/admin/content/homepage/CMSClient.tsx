"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, GripVertical, Trash2, Eye, EyeOff, Save, Globe, History, ArrowLeft, Image as ImageIcon } from "lucide-react";
import { saveRevision, getRevisionHistory } from "@/lib/services/admin-cms.service";
import { MediaPickerModal } from "@/components/admin/MediaPickerModal";
import Image from "next/image";

type SectionType = 'hero_banner' | 'featured_categories' | 'featured_products' | 'shop_by_brand' | 'best_sellers' | 'flash_sale' | 'promotional_banner' | 'why_shop_kareta' | 'testimonials' | 'instagram_feed' | 'newsletter' | 'footer_banner';

interface CMSSection {
  id: string;
  type: SectionType;
  enabled: boolean;
  heading?: string;
  subheading?: string;
  data: any;
}

export default function CMSClient({ initialRevision, referenceData }: { initialRevision: any, referenceData: any }) {
  const [sections, setSections] = useState<CMSSection[]>(
    initialRevision?.content || []
  );
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [versionName, setVersionName] = useState(initialRevision?.version_name || "Draft v1");
  const [mediaPickerConfig, setMediaPickerConfig] = useState<{isOpen: boolean, onSelect: (url: string) => void} | null>(null);

  // Drag state
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  const activeSection = sections.find(s => s.id === activeSectionId);
  const activeSectionIndex = sections.findIndex(s => s.id === activeSectionId);

  const updateActiveSection = (updates: Partial<CMSSection>) => {
    if (activeSectionIndex === -1) return;
    const newSections = [...sections];
    newSections[activeSectionIndex] = { ...newSections[activeSectionIndex], ...updates };
    setSections(newSections);
  };

  const addSection = (type: SectionType) => {
    const newSection: CMSSection = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      enabled: true,
      heading: type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      subheading: "",
      data: {}
    };
    
    // Initialize default data based on type
    if (type === 'hero_banner') newSection.data.banners = [];
    if (type === 'featured_products' || type === 'best_sellers' || type === 'flash_sale') newSection.data.productIds = [];
    if (type === 'featured_categories') newSection.data.categoryIds = [];
    if (type === 'shop_by_brand') newSection.data.brandIds = [];
    if (type === 'promotional_banner') {
      newSection.data.desktopImage = "";
      newSection.data.mobileImage = "";
      newSection.data.link = "";
    }

    setSections([...sections, newSection]);
    setActiveSectionId(newSection.id);
  };

  const removeSection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if(confirm("Remove this section?")) {
      setSections(sections.filter(s => s.id !== id));
      if (activeSectionId === id) setActiveSectionId(null);
    }
  };

  const toggleSection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSections(sections.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  // HTML5 Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === index) return;

    const newSections = [...sections];
    const draggedItem = newSections[draggedIdx];
    newSections.splice(draggedIdx, 1);
    newSections.splice(index, 0, draggedItem);
    
    setDraggedIdx(index);
    setSections(newSections);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
  };

  const handleSave = async (publish: boolean) => {
    try {
      if (publish) setIsPublishing(true);
      else setIsSaving(true);

      const name = publish ? `Published on ${new Date().toLocaleDateString()}` : versionName;
      await saveRevision(name, sections, publish);
      
      alert(publish ? "Homepage Published Successfully!" : "Draft Saved Successfully!");
    } catch (error: any) {
      alert("Error saving: " + error.message);
    } finally {
      setIsSaving(false);
      setIsPublishing(false);
    }
  };

  // Section Type Names
  const sectionTypeNames: Record<SectionType, string> = {
    hero_banner: "Hero Banner",
    featured_categories: "Featured Categories",
    featured_products: "Featured Products",
    shop_by_brand: "Shop By Brand",
    best_sellers: "Best Sellers",
    flash_sale: "Flash Sale",
    promotional_banner: "Promotional Banner",
    why_shop_kareta: "Why Shop Kareta",
    testimonials: "Testimonials",
    instagram_feed: "Instagram Feed",
    newsletter: "Newsletter",
    footer_banner: "Footer Banner"
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center sticky top-0 z-10">
        <div>
          <h2 className="text-xl font-bold text-gray-900 font-heading">Homepage CMS</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className={`w-2 h-2 rounded-full ${initialRevision?.status === 'published' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
            <span className="text-sm font-medium text-gray-600 capitalize">Current: {initialRevision?.status || 'Draft'}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <input 
            type="text" 
            value={versionName} 
            onChange={(e) => setVersionName(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm w-48"
            placeholder="Version Name"
          />
          <button 
            onClick={() => handleSave(false)}
            disabled={isSaving || isPublishing}
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <Save className="w-4 h-4 mr-2" /> {isSaving ? "Saving..." : "Save Draft"}
          </button>
          <button 
            onClick={() => handleSave(true)}
            disabled={isSaving || isPublishing}
            className="inline-flex items-center px-4 py-2 bg-[#0D1B2A] border border-[#0D1B2A] text-white rounded-xl text-sm font-medium hover:bg-[#1a3553] transition-colors"
          >
            <Globe className="w-4 h-4 mr-2" /> {isPublishing ? "Publishing..." : "Publish to Storefront"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Sidebar - Section Manager */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Active Sections</h3>
            <div className="space-y-2">
              {sections.length === 0 && (
                <div className="text-center p-6 text-sm text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  No sections added yet. Build your homepage below.
                </div>
              )}
              {sections.map((section, index) => (
                <div 
                  key={section.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  onClick={() => setActiveSectionId(section.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer group ${
                    activeSectionId === section.id 
                      ? 'border-[#0D1B2A] bg-[#0D1B2A]/5' 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  } ${!section.enabled ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 p-1">
                      <GripVertical className="w-4 h-4" />
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${activeSectionId === section.id ? 'text-[#0D1B2A]' : 'text-gray-900'}`}>
                        {section.heading || sectionTypeNames[section.type]}
                      </p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">{sectionTypeNames[section.type]}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => toggleSection(section.id, e)} className="p-1.5 text-gray-500 hover:text-gray-900 rounded-md hover:bg-gray-100">
                      {section.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button onClick={(e) => removeSection(section.id, e)} className="p-1.5 text-red-500 hover:text-red-700 rounded-md hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Add Section</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(sectionTypeNames).map((key) => (
                <button
                  key={key}
                  onClick={() => addSection(key as SectionType)}
                  className="flex flex-col items-center justify-center p-3 text-center border border-gray-200 rounded-xl hover:border-[#0D1B2A] hover:bg-[#0D1B2A]/5 transition-colors group"
                >
                  <Plus className="w-5 h-5 text-gray-400 group-hover:text-[#0D1B2A] mb-1" />
                  <span className="text-xs font-medium text-gray-600 group-hover:text-[#0D1B2A]">{sectionTypeNames[key as SectionType]}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Pane - Block Editor */}
        <div className="lg:col-span-8">
          {activeSection ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 font-heading">Editing: {sectionTypeNames[activeSection.type]}</h3>
                  <p className="text-xs text-gray-500">Changes auto-save to draft state locally.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">Visible</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={activeSection.enabled}
                      onChange={() => updateActiveSection({ enabled: !activeSection.enabled })}
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0D1B2A]"></div>
                  </label>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                
                {/* Standard Heading Controls */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Section Heading</label>
                    <input 
                      type="text" 
                      value={activeSection.heading || ""}
                      onChange={e => updateActiveSection({ heading: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#0D1B2A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Subheading</label>
                    <input 
                      type="text" 
                      value={activeSection.subheading || ""}
                      onChange={e => updateActiveSection({ subheading: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#0D1B2A]"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  {/* Dynamic Editor Components based on Type */}
                  
                  {activeSection.type === 'hero_banner' && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold text-gray-900">Banners</h4>
                        <button 
                          onClick={() => {
                            const banners = activeSection.data.banners || [];
                            updateActiveSection({ data: { ...activeSection.data, banners: [...banners, { id: Math.random(), title: 'New Banner' }] } });
                          }}
                          className="text-xs font-semibold text-[#0D1B2A] bg-[#0D1B2A]/10 px-3 py-1.5 rounded-lg hover:bg-[#0D1B2A]/20 transition-colors"
                        >
                          + Add Banner
                        </button>
                      </div>
                      
                      {(activeSection.data.banners || []).map((banner: any, i: number) => (
                        <div key={i} className="p-4 border border-gray-200 rounded-xl space-y-4 relative bg-gray-50/50">
                          <button 
                            onClick={() => {
                              const banners = [...activeSection.data.banners];
                              banners.splice(i, 1);
                              updateActiveSection({ data: { ...activeSection.data, banners } });
                            }}
                            className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">Desktop Image URL</label>
                              <div className="flex gap-2">
                                <input 
                                  type="text" 
                                  value={banner.desktopImage || ""}
                                  onChange={(e) => {
                                    const banners = [...activeSection.data.banners];
                                    banners[i].desktopImage = e.target.value;
                                    updateActiveSection({ data: { ...activeSection.data, banners } });
                                  }}
                                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                />
                                <button 
                                  onClick={() => setMediaPickerConfig({ 
                                    isOpen: true, 
                                    onSelect: (url) => {
                                      const banners = [...activeSection.data.banners];
                                      banners[i].desktopImage = url;
                                      updateActiveSection({ data: { ...activeSection.data, banners } });
                                    } 
                                  })}
                                  className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-200"
                                >
                                  <ImageIcon className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">Mobile Image URL (Optional)</label>
                              <div className="flex gap-2">
                                <input 
                                  type="text" 
                                  value={banner.mobileImage || ""}
                                  onChange={(e) => {
                                    const banners = [...activeSection.data.banners];
                                    banners[i].mobileImage = e.target.value;
                                    updateActiveSection({ data: { ...activeSection.data, banners } });
                                  }}
                                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                />
                                <button 
                                  onClick={() => setMediaPickerConfig({ 
                                    isOpen: true, 
                                    onSelect: (url) => {
                                      const banners = [...activeSection.data.banners];
                                      banners[i].mobileImage = url;
                                      updateActiveSection({ data: { ...activeSection.data, banners } });
                                    } 
                                  })}
                                  className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-200"
                                >
                                  <ImageIcon className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                              <input 
                                type="text" 
                                value={banner.title || ""}
                                onChange={(e) => {
                                  const banners = [...activeSection.data.banners];
                                  banners[i].title = e.target.value;
                                  updateActiveSection({ data: { ...activeSection.data, banners } });
                                }}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">Subtitle</label>
                              <input 
                                type="text" 
                                value={banner.subtitle || ""}
                                onChange={(e) => {
                                  const banners = [...activeSection.data.banners];
                                  banners[i].subtitle = e.target.value;
                                  updateActiveSection({ data: { ...activeSection.data, banners } });
                                }}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">CTA Text</label>
                              <input 
                                type="text" 
                                value={banner.ctaText || ""}
                                onChange={(e) => {
                                  const banners = [...activeSection.data.banners];
                                  banners[i].ctaText = e.target.value;
                                  updateActiveSection({ data: { ...activeSection.data, banners } });
                                }}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">CTA URL</label>
                              <input 
                                type="text" 
                                value={banner.ctaUrl || ""}
                                onChange={(e) => {
                                  const banners = [...activeSection.data.banners];
                                  banners[i].ctaUrl = e.target.value;
                                  updateActiveSection({ data: { ...activeSection.data, banners } });
                                }}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {(activeSection.type === 'featured_products' || activeSection.type === 'best_sellers' || activeSection.type === 'flash_sale') && (
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">Select Products</h4>
                      <p className="text-xs text-gray-500">Hold Ctrl/Cmd to select multiple products.</p>
                      
                      <select 
                        multiple 
                        className="w-full h-64 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#0D1B2A]"
                        value={activeSection.data.productIds || []}
                        onChange={(e) => {
                          const selected = Array.from(e.target.selectedOptions, option => option.value);
                          updateActiveSection({ data: { ...activeSection.data, productIds: selected } });
                        }}
                      >
                        {referenceData.products?.map((p: any) => (
                          <option key={p.id} value={p.id} className="p-2 border-b border-gray-50">{p.name}</option>
                        ))}
                      </select>
                      
                      <div className="flex flex-wrap gap-2 pt-2">
                        {(activeSection.data.productIds || []).map((id: string) => {
                          const product = referenceData.products?.find((p: any) => p.id === id);
                          return product ? (
                            <div key={id} className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full text-xs font-medium text-gray-700">
                              {product.name}
                              <button 
                                onClick={() => {
                                  const productIds = activeSection.data.productIds.filter((pId: string) => pId !== id);
                                  updateActiveSection({ data: { ...activeSection.data, productIds } });
                                }}
                                className="text-red-500 hover:text-red-700"
                              ><X size={14}/></button>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}

                  {activeSection.type === 'featured_categories' && (
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">Select Categories</h4>
                      
                      <select 
                        multiple 
                        className="w-full h-48 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#0D1B2A]"
                        value={activeSection.data.categoryIds || []}
                        onChange={(e) => {
                          const selected = Array.from(e.target.selectedOptions, option => option.value);
                          updateActiveSection({ data: { ...activeSection.data, categoryIds: selected } });
                        }}
                      >
                        {referenceData.categories?.map((c: any) => (
                          <option key={c.id} value={c.id} className="p-2 border-b border-gray-50">{c.name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {activeSection.type === 'shop_by_brand' && (
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">Select Brands</h4>
                      
                      <select 
                        multiple 
                        className="w-full h-48 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#0D1B2A]"
                        value={activeSection.data.brandIds || []}
                        onChange={(e) => {
                          const selected = Array.from(e.target.selectedOptions, option => option.value);
                          updateActiveSection({ data: { ...activeSection.data, brandIds: selected } });
                        }}
                      >
                        {referenceData.brands?.map((b: any) => (
                          <option key={b.id} value={b.id} className="p-2 border-b border-gray-50">{b.name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {activeSection.type === 'promotional_banner' && (
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">Banner Details</h4>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Desktop Image URL</label>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={activeSection.data.desktopImage || ""}
                            onChange={(e) => updateActiveSection({ data: { ...activeSection.data, desktopImage: e.target.value } })}
                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#0D1B2A]"
                          />
                          <button 
                            onClick={() => setMediaPickerConfig({ 
                              isOpen: true, 
                              onSelect: (url) => updateActiveSection({ data: { ...activeSection.data, desktopImage: url } }) 
                            })}
                            className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-200"
                          >
                            <ImageIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Mobile Image URL (Optional)</label>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={activeSection.data.mobileImage || ""}
                            onChange={(e) => updateActiveSection({ data: { ...activeSection.data, mobileImage: e.target.value } })}
                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#0D1B2A]"
                          />
                          <button 
                            onClick={() => setMediaPickerConfig({ 
                              isOpen: true, 
                              onSelect: (url) => updateActiveSection({ data: { ...activeSection.data, mobileImage: url } }) 
                            })}
                            className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-200"
                          >
                            <ImageIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Link URL</label>
                        <input 
                          type="text" 
                          value={activeSection.data.link || ""}
                          onChange={(e) => updateActiveSection({ data: { ...activeSection.data, link: e.target.value } })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#0D1B2A]"
                        />
                      </div>
                    </div>
                  )}
                  
                  {activeSection.type === 'instagram_feed' && (
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-600 text-center">
                      <p>This section is a future-ready placeholder.</p>
                      <p className="text-xs text-gray-500 mt-2">When enabled on the storefront, it will display a static mockup or connect to the Instagram Graph API once configured.</p>
                    </div>
                  )}

                  {activeSection.type === 'newsletter' && (
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-600 text-center">
                      <p>Newsletter sign-up block.</p>
                      <p className="text-xs text-gray-500 mt-2">Use the Heading and Subheading fields above to customize the call to action.</p>
                    </div>
                  )}

                  {activeSection.type === 'why_shop_kareta' && (
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-600 text-center">
                      <p>Value Propositions block (Static Content).</p>
                    </div>
                  )}
                  
                  {activeSection.type === 'footer_banner' && (
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-600 text-center">
                      <p>Footer Banner block.</p>
                    </div>
                  )}

                  {activeSection.type === 'testimonials' && (
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-600 text-center">
                      <p>Testimonials block (pulls top reviews).</p>
                    </div>
                  )}

                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center h-full flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <GripVertical className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Section</h3>
              <p className="text-sm text-gray-500 max-w-sm">Click on a section in the left sidebar to edit its content and properties here.</p>
            </div>
          )}
        </div>
      </div>
      
      {mediaPickerConfig && mediaPickerConfig.isOpen && (
        <MediaPickerModal 
          isOpen={mediaPickerConfig.isOpen}
          onClose={() => setMediaPickerConfig(null)}
          onSelect={(url) => {
            mediaPickerConfig.onSelect(url);
            setMediaPickerConfig(null);
          }}
          defaultFolder="Homepage"
        />
      )}
    </div>
  );
}

// X icon helper
function X(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}
