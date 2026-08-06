import { createClient } from "@/lib/supabase/client";
import { AddressInfo } from "@/store/checkoutStore";

export interface SavedAddress extends AddressInfo {
  id: string;
  is_default: boolean;
  full_name: string;
  mobile: string;
}

export const addressService = {
  async getAddresses(userId: string): Promise<SavedAddress[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", userId)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching addresses:", error);
      return [];
    }

    return (data || []).map((row) => ({
      id: row.id,
      full_name: row.full_name,
      mobile: row.mobile,
      addressLine1: row.line1,
      addressLine2: row.line2 || "",
      landmark: row.landmark || "",
      city: row.city,
      state: row.state,
      pincode: row.postal_code,
      is_default: row.is_default,
    }));
  },

  async addAddress(userId: string, address: Omit<SavedAddress, "id">) {
    const supabase = createClient();
    
    // If setting as default, unset others first
    if (address.is_default) {
      await supabase
        .from("addresses")
        .update({ is_default: false })
        .eq("user_id", userId);
    }

    const { data, error } = await supabase
      .from("addresses")
      .insert({
        user_id: userId,
        full_name: address.full_name,
        mobile: address.mobile,
        line1: address.addressLine1,
        line2: address.addressLine2,
        landmark: address.landmark,
        city: address.city,
        state: address.state,
        postal_code: address.pincode,
        country: "India",
        is_default: address.is_default
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateAddress(userId: string, addressId: string, address: Partial<SavedAddress>) {
    const supabase = createClient();

    if (address.is_default) {
      await supabase
        .from("addresses")
        .update({ is_default: false })
        .eq("user_id", userId);
    }

    const updateData: any = {};
    if (address.full_name !== undefined) updateData.full_name = address.full_name;
    if (address.mobile !== undefined) updateData.mobile = address.mobile;
    if (address.addressLine1 !== undefined) updateData.line1 = address.addressLine1;
    if (address.addressLine2 !== undefined) updateData.line2 = address.addressLine2;
    if (address.landmark !== undefined) updateData.landmark = address.landmark;
    if (address.city !== undefined) updateData.city = address.city;
    if (address.state !== undefined) updateData.state = address.state;
    if (address.pincode !== undefined) updateData.postal_code = address.pincode;
    if (address.is_default !== undefined) updateData.is_default = address.is_default;

    const { data, error } = await supabase
      .from("addresses")
      .update(updateData)
      .eq("id", addressId)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteAddress(userId: string, addressId: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from("addresses")
      .delete()
      .eq("id", addressId)
      .eq("user_id", userId);

    if (error) throw error;
  }
};
