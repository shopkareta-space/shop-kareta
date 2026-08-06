ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'placed' BEFORE 'processing';
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'packed' AFTER 'processing';
