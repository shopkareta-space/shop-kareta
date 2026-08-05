"use client";

import { useState, useRef } from 'react';
import Image from 'next/image';
import { UploadCloud, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { MediaPickerModal } from './MediaPickerModal';
import { recordMediaAsset } from '@/lib/services/admin-media.service';

export function SingleImageUploader({
  value,
  onChange,
  label = "Upload Image",
  bucket = "product-images"
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  bucket?: string;
}) {
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
      if (!e.target.files || e.target.files.length === 0) {
        return;
      }
      
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
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
          folder: "General",
        });
      } catch (err) {
        console.error("Failed to record media asset metadata:", err);
      }

      onChange(publicUrl);
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

  return (
    <div>
      {value ? (
        <div className="relative w-full max-w-sm aspect-video rounded-xl overflow-hidden border border-gray-200 group">
          <Image src={value} alt="Preview" fill className="object-cover" sizes="(max-width: 768px) 100vw, 384px" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setIsPickerOpen(true)}
              className="p-2 bg-white rounded-lg text-gray-700 hover:text-[#0D1B2A] shadow-sm"
              title="Replace"
            >
              <ImageIcon className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="p-2 bg-white rounded-lg text-gray-700 hover:text-red-600 shadow-sm"
              title="Remove"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-sm border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-gray-50/50 hover:bg-gray-50 transition-colors">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUpload}
            className="hidden"
            accept="image/*"
            id={`single-upload-${label.replace(/\s+/g, '-')}`}
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
              <p className="text-sm font-medium text-gray-900 mb-1">{label}</p>
              <div className="flex gap-2 mt-4">
                <label
                  htmlFor={`single-upload-${label.replace(/\s+/g, '-')}`}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer shadow-sm transition-colors"
                >
                  Upload
                </label>
                <button
                  type="button"
                  onClick={() => setIsPickerOpen(true)}
                  className="px-4 py-2 bg-[#0D1B2A] border border-[#0D1B2A] rounded-lg text-sm font-medium text-white hover:bg-[#1a3553] cursor-pointer shadow-sm transition-colors"
                >
                  Browse Library
                </button>
              </div>
            </>
          )}
        </div>
      )}
      
      <MediaPickerModal 
        isOpen={isPickerOpen} 
        onClose={() => setIsPickerOpen(false)} 
        onSelect={onChange} 
      />
    </div>
  );
}
