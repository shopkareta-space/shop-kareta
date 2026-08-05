"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getMediaAssets(folder?: string, search?: string) {
  const supabase = await createClient();
  
  let query = supabase
    .from("media_assets")
    .select("*")
    .order("created_at", { ascending: false });

  if (folder && folder !== "All") {
    query = query.eq("folder", folder);
  }

  if (search) {
    query = query.ilike("file_name", `%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching media assets:", error);
    throw new Error(error.message);
  }

  return data;
}

export async function recordMediaAsset(payload: any) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("media_assets")
    .insert([{
      file_name: payload.file_name,
      url: payload.url,
      storage_path: payload.storage_path,
      mime_type: payload.mime_type,
      size_bytes: payload.size_bytes,
      width: payload.width || null,
      height: payload.height || null,
      folder: payload.folder || 'General',
    }])
    .select()
    .single();

  if (error) {
    console.error("Error recording media asset:", error);
    throw new Error(error.message);
  }

  revalidatePath("/admin/media");
  return data;
}

export async function updateMediaAsset(id: string, payload: any) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("media_assets")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating media asset:", error);
    throw new Error(error.message);
  }

  revalidatePath("/admin/media");
  return data;
}

export async function getAssetUsage(url: string) {
  const supabase = await createClient();
  let usage: any[] = [];

  // Check product images
  const { data: productImages } = await supabase
    .from("product_images")
    .select("products(id, name)")
    .eq("url", url);
    
  if (productImages && productImages.length > 0) {
    productImages.forEach((pi: any) => {
      if (pi.products) usage.push({ type: 'Product', name: pi.products.name, id: pi.products.id });
    });
  }

  // Check brands (logo, banner, thumbnail)
  const { data: brands } = await supabase
    .from("brands")
    .select("id, name")
    .or(`logo_url.eq.${url},banner_url.eq.${url},thumbnail_url.eq.${url}`);
    
  if (brands && brands.length > 0) {
    brands.forEach((b: any) => usage.push({ type: 'Brand', name: b.name, id: b.id }));
  }

  // Check categories (icon, banner, card)
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .or(`icon_url.eq.${url},banner_url.eq.${url},card_url.eq.${url}`);
    
  if (categories && categories.length > 0) {
    categories.forEach((c: any) => usage.push({ type: 'Category', name: c.name, id: c.id }));
  }

  return usage;
}

export async function deleteMediaAsset(id: string, url: string, storagePath: string, force: boolean = false) {
  const supabase = await createClient();
  
  if (!force) {
    const usage = await getAssetUsage(url);
    if (usage.length > 0) {
      throw new Error(`Asset is currently in use in ${usage.length} places. Use force delete if you must.`);
    }
  }

  // 1. Delete from storage bucket (assuming bucket name is 'product-images' or passed as first part of storagePath)
  // Usually storagePath is something like "12345.png", so we use the default bucket.
  const { error: storageError } = await supabase.storage
    .from('product-images') // Hardcoding bucket for now as per previous uploads
    .remove([storagePath]);

  if (storageError) {
    console.error("Warning: Could not delete from storage, but continuing to delete DB record.", storageError);
  }

  // 2. Delete from DB
  const { error } = await supabase
    .from("media_assets")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting media asset:", error);
    throw new Error(error.message);
  }

  revalidatePath("/admin/media");
}
