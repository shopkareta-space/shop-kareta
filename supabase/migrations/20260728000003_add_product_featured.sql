-- Add is_featured column to products table
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Update existing records if necessary
UPDATE public.products
SET is_featured = false
WHERE is_featured IS NULL;
