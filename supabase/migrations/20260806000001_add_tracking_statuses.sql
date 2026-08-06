-- Migration to add 'placed' and 'packed' to order_status ENUM
-- We use ALTER TYPE ... ADD VALUE to add new enum values.

-- Add 'placed' 
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'placed' BEFORE 'processing';

-- Add 'packed' 
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'packed' AFTER 'processing';

-- Update existing default from 'processing' to 'placed'
ALTER TABLE public.orders ALTER COLUMN status SET DEFAULT 'placed'::public.order_status;
