"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getStoreSettings() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("store_settings")
    .select("*");

  if (error) {
    console.error("Error fetching settings:", error);
    return [];
  }
  return data;
}

export async function updateStoreSetting(key: string, value: any) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("store_settings")
    .update({ value })
    .eq("key", key);
    
  if (error) throw error;
  
  revalidatePath("/admin/settings");
  // Also revalidate storefront
  revalidatePath("/");
}
