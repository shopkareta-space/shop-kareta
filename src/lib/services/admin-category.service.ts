"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getAdminCategories() {
  const supabase = await createClient();
  // Fetch categories along with the count of associated products
  const { data, error } = await supabase
    .from("categories")
    .select(`
      *,
      products(count)
    `)
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching admin categories:", error);
    throw new Error(error.message);
  }

  return data.map((cat: any) => ({
    ...cat,
    product_count: cat.products[0]?.count || 0
  }));
}

export async function getAdminCategory(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching admin category:", error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function createAdminCategory(categoryData: any) {
  const supabase = await createClient();

  const slug = categoryData.slug || categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const payload = {
    name: categoryData.name,
    slug: slug,
    description: categoryData.description || null,
    short_description: categoryData.short_description || null,
    icon_url: categoryData.icon_url || null,
    banner_url: categoryData.banner_url || null,
    card_url: categoryData.card_url || null,
    parent_id: categoryData.parent_id || null,
    display_order: categoryData.display_order || 0,
    featured: categoryData.featured || false,
    show_on_homepage: categoryData.show_on_homepage || false,
    seo_title: categoryData.seo_title || null,
    seo_description: categoryData.seo_description || null,
    seo_keywords: categoryData.seo_keywords || null,
    is_active: categoryData.is_active ?? true,
    is_public: categoryData.is_public ?? true,
  };

  const { data, error } = await supabase
    .from("categories")
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error("Error creating category:", error);
    throw new Error(error.message);
  }

  revalidatePath("/admin/categories");
  return data;
}

export async function updateAdminCategory(id: string, categoryData: any) {
  const supabase = await createClient();

  const payload = {
    name: categoryData.name,
    slug: categoryData.slug,
    description: categoryData.description || null,
    short_description: categoryData.short_description || null,
    icon_url: categoryData.icon_url || null,
    banner_url: categoryData.banner_url || null,
    card_url: categoryData.card_url || null,
    parent_id: categoryData.parent_id || null,
    display_order: categoryData.display_order || 0,
    featured: categoryData.featured || false,
    show_on_homepage: categoryData.show_on_homepage || false,
    seo_title: categoryData.seo_title || null,
    seo_description: categoryData.seo_description || null,
    seo_keywords: categoryData.seo_keywords || null,
    is_active: categoryData.is_active ?? true,
    is_public: categoryData.is_public ?? true,
  };

  const { data, error } = await supabase
    .from("categories")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating category:", error);
    throw new Error(error.message);
  }

  revalidatePath("/admin/categories");
  revalidatePath(`/shop`);
  return data;
}

export async function deleteAdminCategory(id: string) {
  const supabase = await createClient();
  
  // Verify product count first
  const { count, error: countError } = await supabase
    .from("products")
    .select("*", { count: 'exact', head: true })
    .eq("category_id", id);
    
  if (countError) throw new Error(countError.message);
  
  if (count && count > 0) {
    throw new Error(`Cannot delete category because it contains ${count} products. Please reassign or delete these products first.`);
  }

  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) {
    console.error("Error deleting category:", error);
    throw new Error(error.message);
  }
  
  revalidatePath("/admin/categories");
}
