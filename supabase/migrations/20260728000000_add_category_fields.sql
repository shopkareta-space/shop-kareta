-- Add missing fields to categories table for Phase 9.3

ALTER TABLE public.categories
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Update existing records to ensure they have default values applied if needed
UPDATE public.categories
SET 
  featured = false,
  display_order = 0,
  is_active = true
WHERE featured IS NULL OR display_order IS NULL OR is_active IS NULL;
