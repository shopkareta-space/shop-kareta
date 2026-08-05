"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getAdminNewsletterSubscribers() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching subscribers:", error);
    return [];
  }
  return data;
}

export async function deleteSubscriber(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("newsletter_subscribers")
    .delete()
    .eq("id", id);
    
  if (error) throw error;
  revalidatePath("/admin/newsletter");
}
