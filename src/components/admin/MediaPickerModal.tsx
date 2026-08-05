"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, UploadCloud, Loader2, Image as ImageIcon } from "lucide-react";
import { getMediaAssets, recordMediaAsset } from "@/lib/services/admin-media.service";
import { createBrowserClient } from "@supabase/ssr";

export function MediaPickerModal({ 
  isOpen, 
  onClose, 
  onSelect,
  defaultFolder = "General"
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSelect: (url: string) => void;
  defaultFolder?: string;
}) {
  const [assets, setAssets] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    if (isOpen) {
      fetchAssets();
    }
  }, [isOpen]);

  const fetchAssets = async () => {
    setIsLoading(true);
    try {
      const data = await getMediaAssets();
      setAssets(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsUploading(true);
      if (!e.target.files || e.target.files.length === 0) return;

      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      let width = null;
      let height = null;
      if (file.type.startsWith('image/')) {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        await new Promise(resolve => { img.onload = resolve; });
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
        folder: defaultFolder,
      });

      setAssets(prev => [assetRecord, ...prev]);
      onSelect(publicUrl);
      onClose();
    } catch (error) {
      console.error('Error uploading image: ', error);
      alert('Error uploading image!');
    } finally {
      setIsUploading(false);
    }
  };

  const filteredAssets = assets.filter(asset => 
    asset.file_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col p-0 overflow-hidden bg-gray-50">
        <DialogHeader className="p-6 bg-white border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold font-heading text-gray-900">Select Media</DialogTitle>
            <div className="flex gap-4 items-center mr-8">
              <div className="relative w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0D1B2A]"
                />
              </div>
              <div className="relative">
                <input type="file" onChange={handleUpload} className="hidden" id="modal-upload" accept="image/*" />
                <label 
                  htmlFor="modal-upload" 
                  className="flex items-center justify-center px-4 py-2 bg-[#0D1B2A] text-white rounded-lg text-sm font-medium hover:bg-[#1a3553] transition-colors cursor-pointer disabled:opacity-70"
                >
                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <UploadCloud className="w-4 h-4 mr-2" />}
                  {isUploading ? 'Uploading...' : 'Upload New'}
                </label>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <ImageIcon className="w-12 h-12 text-gray-300 mb-3" />
              <p>No media found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {filteredAssets.map(asset => (
                <div 
                  key={asset.id} 
                  onClick={() => {
                    onSelect(asset.url);
                    onClose();
                  }}
                  className="group relative aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-[#0D1B2A] cursor-pointer bg-white shadow-sm transition-all"
                >
                  <Image 
                    src={asset.url} 
                    alt={asset.file_name} 
                    fill 
                    className="object-cover"
                    sizes="20vw"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 translate-y-full group-hover:translate-y-0 transition-transform">
                    <p className="text-white text-[10px] truncate">{asset.file_name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
