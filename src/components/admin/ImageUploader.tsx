"use client";

import { useState, useRef } from "react";
import { UploadCloud, X, Loader2, Image as ImageIcon } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import { MediaPickerModal } from "./MediaPickerModal";
import { recordMediaAsset } from "@/lib/services/admin-media.service";
import Image from "next/image";

interface ImageUploaderProps {
  images: any[];
  setImages: (images: any[]) => void;
}

export function ImageUploader({ images, setImages }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsUploading(true);
      if (!e.target.files || e.target.files.length === 0) return;

      const newImages = [];
      
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        // Record to media_assets
        let width = null;
        let height = null;
        if (file.type.startsWith('image/')) {
          const img = document.createElement('img');
          img.src = URL.createObjectURL(file);
          await new Promise(resolve => { img.onload = resolve; });
          width = img.width;
          height = img.height;
        }
        
        try {
          await recordMediaAsset({
            file_name: file.name,
            url: publicUrl,
            storage_path: filePath,
            mime_type: file.type,
            size_bytes: file.size,
            width,
            height,
            folder: "Products",
          });
        } catch (err) {
          console.error("Failed to record media asset metadata:", err);
        }

        newImages.push({ url: publicUrl });
      }

      setImages([...images, ...newImages]);
    } catch (error) {
      console.error('Error uploading image: ', error);
      alert('Error uploading image!');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = (indexToRemove: number) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  const makePrimary = (index: number) => {
    if (index === 0) return;
    const newImages = [...images];
    const item = newImages.splice(index, 1)[0];
    newImages.unshift(item);
    setImages(newImages);
  };

  const handleLibrarySelect = (url: string) => {
    setImages([...images, { url }]);
  };

  return (
    <div className="space-y-6">
      <div className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-gray-50/50 hover:bg-gray-50 transition-colors">
        <input 
          id="dropzone-file-multi" 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          accept="image/*" 
          multiple
          onChange={handleUpload} 
        />
        
        {isUploading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="w-10 h-10 text-[#0D1B2A] animate-spin mb-4" />
            <p className="text-sm font-medium text-gray-900">Uploading...</p>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center mb-4 shadow-sm">
              <UploadCloud className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">Add Media</p>
            <div className="flex gap-2 mt-4">
              <label 
                htmlFor="dropzone-file-multi" 
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer shadow-sm transition-colors"
              >
                Upload Files
              </label>
              <button 
                type="button"
                onClick={() => setIsPickerOpen(true)}
                className="px-4 py-2 bg-[#0D1B2A] border border-[#0D1B2A] rounded-lg text-sm font-medium text-white hover:bg-[#1a3553] shadow-sm transition-colors cursor-pointer"
              >
                Browse Library
              </button>
            </div>
          </>
        )}
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img, index) => (
            <div key={index} className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-square">
              <Image src={img.url} alt={`Uploaded ${index}`} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
              
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="p-2 bg-white text-red-600 rounded-lg shadow-sm hover:bg-red-50 transition-colors"
                  title="Remove image"
                >
                  <X className="w-5 h-5" />
                </button>
                {index !== 0 && (
                  <button
                    type="button"
                    onClick={() => makePrimary(index)}
                    className="px-3 py-1.5 bg-white text-[#0D1B2A] rounded-lg shadow-sm hover:bg-gray-50 transition-colors text-xs font-bold"
                    title="Make Primary"
                  >
                    Set Primary
                  </button>
                )}
              </div>

              {index === 0 && (
                <div className="absolute bottom-0 left-0 right-0 bg-[#0D1B2A]/90 backdrop-blur-sm text-white text-xs text-center py-1.5 font-medium">
                  Primary Image
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <MediaPickerModal 
        isOpen={isPickerOpen} 
        onClose={() => setIsPickerOpen(false)} 
        onSelect={handleLibrarySelect}
        defaultFolder="Products"
      />
    </div>
  );
}
