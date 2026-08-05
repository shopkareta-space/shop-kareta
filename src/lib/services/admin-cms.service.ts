"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getLatestRevision() {
  const supabase = await createClient();
  
  // Get the most recent revision regardless of status
  const { data, error } = await supabase
    .from("homepage_revisions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching latest revision:", error);
    return null;
  }
  
  return data;
}

export async function getRevisionHistory() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("homepage_revisions")
    .select("id, version_name, status, created_at, published_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching revision history:", error);
    return [];
  }
  
  return data;
}

export async function getRevisionById(id: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("homepage_revisions")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching revision:", error);
    return null;
  }
  
  return data;
}

export async function saveRevision(versionName: string, content: any[], publish: boolean = false) {
  const supabase = await createClient();
  
  const status = publish ? 'published' : 'draft';
  const publishedAt = publish ? new Date().toISOString() : null;

  if (publish) {
    // Archive currently published ones
    await supabase
      .from("homepage_revisions")
      .update({ status: 'archived' })
      .eq("status", "published");
  }

  const { data, error } = await supabase
    .from("homepage_revisions")
    .insert([{
      version_name: versionName,
      content,
      status,
      published_at: publishedAt
    }])
    .select()
    .single();
    
  if (error) throw error;

  revalidatePath(`/admin/content/homepage`);
  // Will revalidate storefront homepage later when it's built
  revalidatePath(`/`);
  
  return data;
}

// Helper to fetch dynamic reference data for the CMS
export async function getCmsReferenceData() {
  const supabase = await createClient();
  
  // Fetch active products
  const { data: products } = await supabase
    .from("products")
    .select("id, name, slug, price, product_images(url)")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
    
  // Fetch active categories
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug, banner_url")
    .is("deleted_at", null);
    
  // Fetch active brands
  const { data: brands } = await supabase
    .from("brands")
    .select("id, name, slug, logo_url")
    .is("deleted_at", null);
    
  return {
    products: products || [],
    categories: categories || [],
    brands: brands || []
  };
}
