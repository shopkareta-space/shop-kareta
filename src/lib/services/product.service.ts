import { createClient } from "@/lib/supabase/server";
import { Product } from "@/types/product";

export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient();
  
  const { data: products, error } = await supabase
    .from('products')
    .select(`
      *,
      brands ( name ),
      categories ( name ),
      product_images ( url, is_primary )
    `)
    .eq('is_active', true);

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return products.map(mapDatabaseProductToFrontend);
}

export async function getFeaturedProducts(limit: number = 4): Promise<Product[]> {
  const supabase = await createClient();
  
  // We can order by created_at or some other featured logic
  const { data: products, error } = await supabase
    .from('products')
    .select(`
      *,
      brands ( name ),
      categories ( name ),
      product_images ( url, is_primary )
    `)
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }

  return products.map(mapDatabaseProductToFrontend);
}

export async function getRandomProducts(limit: number = 4): Promise<Product[]> {
  const supabase = await createClient();
  
  // Fetch up to 100 active products
  const { data: products, error } = await supabase
    .from('products')
    .select(`
      *,
      brands ( name ),
      categories ( name ),
      product_images ( url, is_primary )
    `)
    .eq('is_active', true)
    .limit(100);

  if (error) {
    console.error("Error fetching random products:", error);
    return [];
  }

  // Shuffle the products using Fisher-Yates
  for (let i = products.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [products[i], products[j]] = [products[j], products[i]];
  }

  return products.slice(0, limit).map(mapDatabaseProductToFrontend);
}

export async function getProductsByCategory(categoryName: string): Promise<Product[]> {
  const supabase = await createClient();
  
  // Need to first get category ID or filter by joined category name
  const { data: products, error } = await supabase
    .from('products')
    .select(`
      *,
      brands ( name ),
      categories!inner ( name ),
      product_images ( url, is_primary )
    `)
    .eq('is_active', true)
    .eq('categories.name', categoryName);

  if (error) {
    console.error(`Error fetching products by category ${categoryName}:`, error);
    return [];
  }

  return products.map(mapDatabaseProductToFrontend);
}

export async function getProductsByBrand(brandName: string): Promise<Product[]> {
  const supabase = await createClient();
  
  const { data: products, error } = await supabase
    .from('products')
    .select(`
      *,
      brands!inner ( name ),
      categories ( name ),
      product_images ( url, is_primary )
    `)
    .eq('is_active', true)
    .eq('brands.name', brandName);

  if (error) {
    console.error(`Error fetching products by brand ${brandName}:`, error);
    return [];
  }

  return products.map(mapDatabaseProductToFrontend);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  
  const { data: product, error } = await supabase
    .from('products')
    .select(`
      *,
      brands ( name ),
      categories ( name ),
      product_images ( url, is_primary, display_order )
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error || !product) {
    console.error(`Error fetching product by slug ${slug}:`, error);
    return null;
  }

  // Ensure images are sorted by display_order
  if (product.product_images && Array.isArray(product.product_images)) {
      product.product_images.sort((a: any, b: any) => a.display_order - b.display_order);
  }

  return mapDatabaseProductToFrontend(product);
}

export async function getRelatedProducts(productId: string, limit: number = 4): Promise<Product[]> {
  const supabase = await createClient();
  
  const { data: products, error } = await supabase
    .from('products')
    .select(`
      *,
      brands ( name ),
      categories ( name ),
      product_images ( url, is_primary )
    `)
    .neq('slug', productId)
    .eq('is_active', true)
    .limit(limit);

  if (error) {
    console.error("Error fetching related products:", error);
    return [];
  }

  return products.map(mapDatabaseProductToFrontend);
}

export async function getCategories(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('categories').select('name');
  if (error) return [];
  return data.map(d => d.name);
}

export async function getBrands(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('brands').select('name');
  if (error) return [];
  return data.map(d => d.name);
}

export async function getProductVariants(productId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('product_variants')
    .select('*')
    .eq('product_id', productId);

  if (error) {
    console.error(`Error fetching variants for product ${productId}:`, error);
    return [];
  }
  return data;
}

export async function getComboProducts(bundleProductId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('product_bundle_items')
    .select(`
      quantity,
      child_product:products (
        slug,
        name,
        price,
        brands ( name ),
        product_images ( url, is_primary )
      )
    `)
    .eq('bundle_product_id', bundleProductId);

  if (error) {
    console.error(`Error fetching combo products for bundle ${bundleProductId}:`, error);
    return [];
  }
  
  return data;
}

// Helper to map DB record to Frontend interface
function mapDatabaseProductToFrontend(dbProduct: any): Product {
  // Extract images
  const images = dbProduct.product_images
    ? dbProduct.product_images.map((img: any) => img.url)
    : [];

  // Determine stock status
  let stockStatus: Product["stockStatus"] = "In Stock";
  if (dbProduct.inventory_count === 0) stockStatus = "Out of Stock";
  else if (dbProduct.inventory_count < 10) stockStatus = "Low Stock";

  return {
    id: dbProduct.slug, // Frontend uses 'id' parameter for slug in components
    name: dbProduct.name,
    brand: dbProduct.brands?.name || "Unknown Brand",
    category: dbProduct.categories?.name || "Uncategorized",
    price: Number(dbProduct.price),
    originalPrice: dbProduct.original_price ? Number(dbProduct.original_price) : undefined,
    badge: getBadge(dbProduct),
    stockStatus,
    sku: dbProduct.sku || undefined,
    productCode: dbProduct.product_code || undefined,
    shortIntroduction: dbProduct.short_introduction || undefined,
    description: dbProduct.description,
    benefits: dbProduct.benefits || [],
    ingredients: dbProduct.ingredients || undefined,
    nutritionalInfo: dbProduct.nutritional_info || undefined,
    contents: dbProduct.contents || [],
    directions: dbProduct.directions || [],
    dosage: dbProduct.dosage || undefined,
    storage: dbProduct.storage || undefined,
    precautions: dbProduct.precautions || undefined,
    suitableFor: dbProduct.suitable_for || [],
    certifications: dbProduct.certifications || [],
    claims: dbProduct.claims || [],
    manufacturing: dbProduct.manufacturing || undefined,
    packaging: dbProduct.packaging || undefined,
    faq: dbProduct.faq || [],
    additionalNotes: dbProduct.additional_notes || undefined,
    images: images.length > 0 ? images : ["/images/placeholder-main.jpg"],
  };
}

// Simple logic to determine badge if needed
function getBadge(product: any): string | undefined {
  if (product.original_price && product.original_price > product.price) {
    const discount = Math.round(((product.original_price - product.price) / product.original_price) * 100);
    if (discount > 20) return `${discount}% OFF`;
  }
  return undefined;
}
