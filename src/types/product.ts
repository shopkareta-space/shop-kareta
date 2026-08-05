export interface NutritionalInfo {
  energy?: string;
  carbohydrate?: string;
  protein?: string;
  totalFat?: string;
  vitaminC?: string;
  iron?: string;
  calcium?: string;
  [key: string]: string | undefined;
}

export interface Product {
  id: string; // Used as slug in Next.js routes
  name: string;
  variant?: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  stockStatus?: "In Stock" | "Out of Stock" | "Low Stock";
  sku?: string;
  productCode?: string;
  shortIntroduction?: string;
  description: string;
  benefits?: string[];
  ingredients?: string;
  nutritionalInfo?: NutritionalInfo;
  contents?: string[];
  directions?: string[];
  dosage?: string;
  storage?: string;
  precautions?: string;
  suitableFor?: string[];
  certifications?: string[];
  manufacturing?: {
    manufacturer?: string;
    marketedBy?: string;
    countryOfOrigin?: string;
    mfgLicNo?: string;
    shelfLife?: string;
    mfgDate?: string;
    batchNumber?: string;
  };
  packaging?: {
    netWeight?: string;
    netQuantity?: string;
    dimensions?: string;
    packagingType?: string;
    form?: string;
  };
  faq?: { question: string; answer: string }[];
  claims?: string[];
  additionalNotes?: string;
  images?: string[];
}
