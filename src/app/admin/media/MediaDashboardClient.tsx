"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Search, Filter, UploadCloud, Copy, Edit2, Trash2, Download, Image as ImageIcon, Loader2 } from "lucide-react";
import { deleteMediaAsset, updateMediaAsset, recordMediaAsset } from "@/lib/services/admin-media.service";
import { createBrowserClient } from "@supabase/ssr";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function MediaDashboardClient({ initialAssets }: { initialAssets: any[] }) {
  const [assets, setAssets] = useState(initialAssets);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFolder, setActiveFolder] = useState("All");
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
  
  // Upload State
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit State
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState("");
  const [newFolder, setNewFolder] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const folders = ["All", "Products", "Brands", "Categories", "Homepage", "Banners", "Blog", "General"];

  const filteredAssets = assets.filter(asset => {
    const matchesFolder = activeFolder === "All" || asset.folder === activeFolder;
    const matchesSearch = asset.file_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsUploading(true);
      if (!e.target.files || e.target.files.length === 0) return;

      const newUploadedAssets = [];
      
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        // Get image dimensions if it's an image
        let width = null;
        let height = null;
        if (file.type.startsWith('image/')) {
          const img = document.createElement('img');
          img.src = URL.createObjectURL(file);
          await new Promise(resolve => {
            img.onload = resolve;
          });
          width = img.width;
          height = img.height;
        }

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        const assetRecord = await recordMediaAsset({
          file_name: file.name,
          url: publicUrl,
          storage_path: filePath,
          mime_type: file.type,
          size_bytes: file.size,
          width,
          height,
          folder: activeFolder === "All" ? "General" : activeFolder,
        });

        newUploadedAssets.push(assetRecord);
      }

      setAssets(prev => [...newUploadedAssets, ...prev]);
    } catch (error) {
      console.error('Error uploading image: ', error);
      alert('Error uploading image!');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSaveEdit = async () => {
    try {
      if (!selectedAsset) return;
      const updated = await updateMediaAsset(selectedAsset.id, {
        file_name: newName,
        folder: newFolder,
      });
      setAssets(prev => prev.map(a => a.id === selectedAsset.id ? updated : a));
      setSelectedAsset(updated);
      setIsRenaming(false);
    } catch (error: any) {
      alert("Failed to save changes: " + error.message);
    }
  };

  const handleDelete = async (force = false) => {
    if (!selectedAsset) return;
    try {
      setIsDeleting(true);
      await deleteMediaAsset(selectedAsset.id, selectedAsset.url, selectedAsset.storage_path, force);
      setAssets(prev => prev.filter(a => a.id !== selectedAsset.id));
      setSelectedAsset(null);
    } catch (error: any) {
      if (error.message.includes("currently in use") && !force) {
        if (confirm(`${error.message}\n\nDo you want to FORCE delete anyway? This may cause broken images on the site.`)) {
          handleDelete(true);
        }
      } else {
        alert("Failed to delete: " + error.message);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCopyUrl = () => {
    if (selectedAsset) {
      navigator.clipboard.writeText(selectedAsset.url);
      alert("URL copied to clipboard!");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-12rem)] min-h-[600px]">
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative flex-1 max-w-md w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0D1B2A] focus:ring-1 focus:ring-[#0D1B2A] bg-white transition-all"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select 
              value={activeFolder} 
              onChange={e => setActiveFolder(e.target.value)}
              className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0D1B2A] appearance-none"
            >
              {folders.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
            
            <div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleUpload} 
                className="hidden" 
                multiple 
                accept="image/*"
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="inline-flex items-center justify-center px-4 py-2.5 bg-[#0D1B2A] text-white rounded-xl text-sm font-medium hover:bg-[#1a3553] transition-colors disabled:opacity-70 whitespace-nowrap"
              >
                {isUploading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <UploadCloud className="w-5 h-5 mr-2" />}
                {isUploading ? 'Uploading...' : 'Upload Media'}
              </button>
            </div>
          </div>
        </div>

        {/* Grid View */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {filteredAssets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <ImageIcon className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No media found</h3>
              <p className="mt-1">Upload some files or change your search filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredAssets.map((asset) => (
                <div 
                  key={asset.id}
                  onClick={() => {
                    setSelectedAsset(asset);
                    setIsRenaming(false);
                    setNewName(asset.file_name);
                    setNewFolder(asset.folder || "General");
                  }}
                  className={`group relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer bg-white ${
                    selectedAsset?.id === asset.id ? 'border-[#0D1B2A] ring-2 ring-[#0D1B2A] ring-opacity-20' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Image 
                    src={asset.url} 
                    alt={asset.file_name} 
                    fill 
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                    <p className="text-white text-xs truncate font-medium">{asset.file_name}</p>
                    <p className="text-white/80 text-[10px]">{formatBytes(asset.size_bytes)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Side Panel (Details) */}
      {selectedAsset ? (
        <div className="w-full lg:w-80 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-y-auto flex flex-col shrink-0">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
            <h3 className="font-semibold text-gray-900">File Details</h3>
            <button onClick={() => setSelectedAsset(null)} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-4 flex flex-col gap-6">
            {/* Preview */}
            <div className="aspect-video relative rounded-lg border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center p-2">
              <Image 
                src={selectedAsset.url} 
                alt="Preview" 
                fill 
                className="object-contain"
              />
            </div>

            {/* Editable Details */}
            {isRenaming ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">File Name</label>
                  <input 
                    type="text" 
                    value={newName} 
                    onChange={e => setNewName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0D1B2A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Folder</label>
                  <select 
                    value={newFolder} 
                    onChange={e => setNewFolder(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0D1B2A]"
                  >
                    {folders.filter(f => f !== "All").map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setIsRenaming(false)} className="flex-1 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Cancel</button>
                  <button onClick={handleSaveEdit} className="flex-1 py-1.5 text-xs font-medium bg-[#0D1B2A] text-white rounded-lg hover:bg-[#1a3553]">Save</button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-gray-900 break-all pr-4">{selectedAsset.file_name}</h4>
                    <button onClick={() => setIsRenaming(true)} className="text-gray-400 hover:text-[#0D1B2A]">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Folder: {selectedAsset.folder || "General"}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Uploaded on</p>
                    <p className="text-sm text-gray-900 mt-1">{new Date(selectedAsset.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">File size</p>
                    <p className="text-sm text-gray-900 mt-1">{formatBytes(selectedAsset.size_bytes)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Dimensions</p>
                    <p className="text-sm text-gray-900 mt-1">{selectedAsset.width ? `${selectedAsset.width} × ${selectedAsset.height}` : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Type</p>
                    <p className="text-sm text-gray-900 mt-1">{selectedAsset.mime_type.split('/')[1]?.toUpperCase()}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <button onClick={handleCopyUrl} className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors">
                    <Copy className="w-4 h-4" /> Copy URL
                  </button>
                  <a href={selectedAsset.url} download target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors">
                    <Download className="w-4 h-4" /> Download
                  </a>
                  <button 
                    onClick={() => handleDelete(false)}
                    disabled={isDeleting}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" /> {isDeleting ? 'Deleting...' : 'Delete File'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="hidden lg:flex w-80 bg-gray-50 rounded-2xl border border-gray-100 items-center justify-center shrink-0 p-6 text-center">
          <div>
            <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500 font-medium">Select a file to view details</p>
          </div>
        </div>
      )}

    </div>
  );
}
