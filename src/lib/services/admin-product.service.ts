"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getAdminProducts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      price,
      inventory_count,
      is_active,
      is_featured,
      brands(name),
      categories(name),
      product_images(url)
    `)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching admin products:", error);
    throw new Error(error.message);
  }
  return data;
}

export async function getAdminProduct(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      product_images(*),
      product_variants(*),
      product_tags(
        tags(*)
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching admin product:", error);
    throw new Error(error.message);
  }
  
  const formattedData = {
    ...data,
    tags: data.product_tags?.map((pt: any) => pt.tags?.name).filter(Boolean) || []
  };

  return formattedData;
}

async function handleTags(supabase: any, productId: string, tagNames: string[]) {
  if (!tagNames || tagNames.length === 0) return;
  
  const formattedTags = tagNames.map(name => ({
    name: name.trim(),
    slug: name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
  }));

  const { data: existingTags } = await supabase
    .from("tags")
    .select("id, name")
    .in("name", formattedTags.map(t => t.name));

  const existingTagNames = existingTags?.map((t: any) => t.name) || [];
  const tagsToCreate = formattedTags.filter(t => !existingTagNames.includes(t.name));

  let createdTags = [];
  if (tagsToCreate.length > 0) {
    const { data } = await supabase.from("tags").insert(tagsToCreate).select("id, name");
    if (data) createdTags = data;
  }

  const allTagIds = [
    ...(existingTags?.map((t: any) => t.id) || []),
    ...(createdTags?.map((t: any) => t.id) || [])
  ];

  if (allTagIds.length > 0) {
    const productTagsToInsert = allTagIds.map(tag_id => ({
      product_id: productId,
      tag_id
    }));
    await supabase.from("product_tags").insert(productTagsToInsert);
  }
}

async function handleVariants(supabase: any, productId: string, variants: any[]) {
  if (!variants || variants.length === 0) return;
  
  const variantsToInsert = variants.map(v => ({
    product_id: productId,
    variant_name: v.variant_name,
    sku: v.sku || `${productId.substring(0,8)}-${v.variant_name.substring(0,4)}`,
    price: v.price,
    original_price: v.original_price || null,
    inventory_count: v.inventory_count || 0,
    is_default: v.is_default || false
  }));

  const { error } = await supabase.from("product_variants").insert(variantsToInsert);
  if (error) console.error("Error inserting variants:", error);
}

function prepareProductPayload(productData: any) {
  return {
    name: productData.name,
    slug: productData.slug,
    product_type: productData.product_type || "single",
    short_introduction: productData.short_introduction || null,
    description: productData.description || "",
    price: productData.price,
    original_price: productData.original_price || null,
    sku: productData.sku || null,
    inventory_count: productData.inventory_count || 0,
    is_active: productData.is_active,
    is_featured: productData.is_featured || false,
    brand_id: productData.brand_id || null,
    category_id: productData.category_id || null,
    seo_title: productData.seo_title || null,
    seo_description: productData.seo_description || null,
    seo_keywords: productData.seo_keywords || null,
    canonical_url: productData.canonical_url || null,
    
    // PIM Fields & Original Array/Text fields
    benefits: productData.benefits || [],
    ingredients: productData.ingredients || null,
    storage: productData.storage || null,
    suitable_for: productData.suitable_for || [],
    discount: productData.discount || null,
    gst: productData.gst || null,
    low_stock_alert: productData.low_stock_alert || 10,
    weight: productData.weight || null,
    dimensions: productData.dimensions || null,
    product_video_url: productData.product_video_url || null,
    how_to_use: productData.how_to_use || null,
    safety_warnings: productData.safety_warnings || null,
    who_should_avoid: productData.who_should_avoid || null,
    package_contents: productData.package_contents || null,
    net_quantity: productData.net_quantity || null,
    country_of_origin: productData.country_of_origin || null,
    manufacturer: productData.manufacturer || null,
    marketed_by: productData.marketed_by || null,
    batch_number: productData.batch_number || null,
    expiry_date: productData.expiry_date || null,
    shelf_life: productData.shelf_life || null,
    fssai_license: productData.fssai_license || null,
    hsn_code: productData.hsn_code || null,
    is_bestseller: productData.is_bestseller || false,
    is_new_arrival: productData.is_new_arrival || false,
    is_trending: productData.is_trending || false,
  };
}

export async function createAdminProduct(productData: any, images: any[], variants?: any[], tags?: string[]) {
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .insert([prepareProductPayload(productData)])
    .select()
    .single();

  if (error) {
    console.error("Error creating product:", error);
    throw new Error(error.message);
  }

  if (images && images.length > 0) {
    const imagesToInsert = images.map((img: any, index: number) => ({
      product_id: product.id,
      url: img.url,
      display_order: index,
      is_primary: index === 0,
    }));
    await supabase.from("product_images").insert(imagesToInsert);
  }

  if (variants) await handleVariants(supabase, product.id, variants);
  if (tags) await handleTags(supabase, product.id, tags);

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return product;
}

export async function updateAdminProduct(id: string, productData: any, images: any[], variants?: any[], tags?: string[]) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("products")
    .update(prepareProductPayload(productData))
    .eq("id", id);

  if (error) {
    console.error("Error updating product:", error);
    throw new Error(error.message);
  }

  if (images) {
    await supabase.from("product_images").delete().eq("product_id", id);
    if (images.length > 0) {
      const imagesToInsert = images.map((img: any, index: number) => ({
        product_id: id,
        url: img.url,
        display_order: index,
        is_primary: index === 0,
      }));
      await supabase.from("product_images").insert(imagesToInsert);
    }
  }

  if (variants) {
    await supabase.from("product_variants").delete().eq("product_id", id);
    await handleVariants(supabase, id, variants);
  }

  if (tags) {
    await supabase.from("product_tags").delete().eq("product_id", id);
    await handleTags(supabase, id, tags);
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath(`/products/${productData.slug}`);
}

export async function deleteAdminProduct(id: string) {
  const supabase = await createClient();
  
  // Soft delete the product by setting deleted_at to current timestamp
  const { error } = await supabase
    .from("products")
    .update({ 
      deleted_at: new Date().toISOString(),
      is_active: false // Also deactivate it
    })
    .eq("id", id);
    
  if (error) {
    console.error("Error deleting product:", error);
    throw new Error(error.message);
  }
  
  revalidatePath("/admin/products");
  revalidatePath("/shop");
}
