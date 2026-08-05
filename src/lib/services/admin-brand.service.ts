"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getAdminBrands() {
  const supabase = await createClient();
  // Fetch brands along with the count of associated products
  const { data, error } = await supabase
    .from("brands")
    .select(`
      *,
      products(count)
    `)
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching admin brands:", error);
    throw new Error(error.message);
  }

  return data.map((brand: any) => ({
    ...brand,
    product_count: brand.products[0]?.count || 0
  }));
}

export async function getAdminBrand(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching admin brand:", error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function createAdminBrand(brandData: any) {
  const supabase = await createClient();

  const slug = brandData.slug || brandData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const payload = {
    name: brandData.name,
    slug: slug,
    description: brandData.description || null,
    short_description: brandData.short_description || null,
    logo_url: brandData.logo_url || null,
    banner_url: brandData.banner_url || null,
    thumbnail_url: brandData.thumbnail_url || null,
    founder: brandData.founder || null,
    established_year: brandData.established_year ? parseInt(brandData.established_year, 10) : null,
    country_of_origin: brandData.country_of_origin || null,
    website: brandData.website || null,
    support_email: brandData.support_email || null,
    support_phone: brandData.support_phone || null,
    social_instagram: brandData.social_instagram || null,
    social_facebook: brandData.social_facebook || null,
    social_youtube: brandData.social_youtube || null,
    social_twitter: brandData.social_twitter || null,
    social_linkedin: brandData.social_linkedin || null,
    display_order: brandData.display_order ? parseInt(brandData.display_order, 10) : 0,
    featured: brandData.featured || false,
    show_on_homepage: brandData.show_on_homepage || false,
    seo_title: brandData.seo_title || null,
    seo_description: brandData.seo_description || null,
    seo_keywords: brandData.seo_keywords || null,
    is_active: brandData.is_active ?? true,
    is_public: brandData.is_public ?? true,
  };

  const { data, error } = await supabase
    .from("brands")
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error("Error creating brand:", error);
    throw new Error(error.message);
  }

  revalidatePath("/admin/brands");
  return data;
}

export async function updateAdminBrand(id: string, brandData: any) {
  const supabase = await createClient();

  const payload = {
    name: brandData.name,
    slug: brandData.slug,
    description: brandData.description || null,
    short_description: brandData.short_description || null,
    logo_url: brandData.logo_url || null,
    banner_url: brandData.banner_url || null,
    thumbnail_url: brandData.thumbnail_url || null,
    founder: brandData.founder || null,
    established_year: brandData.established_year ? parseInt(brandData.established_year, 10) : null,
    country_of_origin: brandData.country_of_origin || null,
    website: brandData.website || null,
    support_email: brandData.support_email || null,
    support_phone: brandData.support_phone || null,
    social_instagram: brandData.social_instagram || null,
    social_facebook: brandData.social_facebook || null,
    social_youtube: brandData.social_youtube || null,
    social_twitter: brandData.social_twitter || null,
    social_linkedin: brandData.social_linkedin || null,
    display_order: brandData.display_order ? parseInt(brandData.display_order, 10) : 0,
    featured: brandData.featured || false,
    show_on_homepage: brandData.show_on_homepage || false,
    seo_title: brandData.seo_title || null,
    seo_description: brandData.seo_description || null,
    seo_keywords: brandData.seo_keywords || null,
    is_active: brandData.is_active ?? true,
    is_public: brandData.is_public ?? true,
  };

  const { data, error } = await supabase
    .from("brands")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating brand:", error);
    throw new Error(error.message);
  }

  revalidatePath("/admin/brands");
  revalidatePath(`/shop`);
  return data;
}

export async function deleteAdminBrand(id: string) {
  const supabase = await createClient();
  
  // Verify product count first
  const { count, error: countError } = await supabase
    .from("products")
    .select("*", { count: 'exact', head: true })
    .eq("brand_id", id);
    
  if (countError) throw new Error(countError.message);
  
  if (count && count > 0) {
    throw new Error(`Cannot delete brand because it contains ${count} products. Please reassign or delete these products first.`);
  }

  const { error } = await supabase.from("brands").delete().eq("id", id);
  if (error) {
    console.error("Error deleting brand:", error);
    throw new Error(error.message);
  }
  
  revalidatePath("/admin/brands");
}
