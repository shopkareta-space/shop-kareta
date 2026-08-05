export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          slug: string
          product_type: "single" | "combo"
          name: string
          brand_id: string | null
          category_id: string | null
          price: number
          original_price: number | null
          sku: string | null
          product_code: string | null
          inventory_count: number
          short_introduction: string | null
          description: string
          benefits: string[] | null
          ingredients: string | null
          nutritional_info: Json | null
          contents: string[] | null
          directions: string[] | null
          dosage: string | null
          storage: string | null
          precautions: string | null
          suitable_for: string[] | null
          certifications: string[] | null
          claims: string[] | null
          manufacturing: Json | null
          packaging: Json | null
          faq: Json | null
          additional_notes: string | null
          is_active: boolean
          seo_title: string | null
          seo_description: string | null
          seo_keywords: string | null
          canonical_url: string | null
          created_at: string
          updated_at: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          banner_url: string | null
          featured: boolean
          display_order: number
          is_active: boolean
          image_url: string | null
        }
      }
      brands: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          logo_url: string | null
          banner_url: string | null
        }
      }
      product_variants: {
        Row: {
          id: string
          product_id: string
          variant_name: string
          sku: string
          barcode: string | null
          price: number
          original_price: number | null
          inventory_count: number
          is_default: boolean
        }
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          url: string
          alt_text: string | null
          display_order: number
          is_primary: boolean
        }
      }
    product_bundle_items: {
        Row: {
          id: string
          bundle_product_id: string
          child_product_id: string
          child_variant_id: string | null
          quantity: number
        }
      }
      product_audit_logs: {
        Row: {
          id: string
          product_id: string | null
          admin_id: string | null
          action: string
          old_data: Json | null
          new_data: Json | null
          created_at: string
        }
      }
    }
  }
}
