-- Create Store Settings table

CREATE TABLE IF NOT EXISTS public.store_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Insert default settings
INSERT INTO public.store_settings (key, value) VALUES 
('general', '{"store_name": "Shop Kareta", "store_logo": "", "favicon": "", "store_description": "Premium e-commerce store"}'::jsonb),
('business', '{"company_name": "Shop Kareta Pvt Ltd", "gst_number": "", "email": "support@shopkareta.com", "phone": "", "address": ""}'::jsonb),
('shipping', '{"free_shipping_threshold": 500, "default_shipping_charge": 50}'::jsonb),
('social', '{"facebook": "", "instagram": "", "youtube": "", "linkedin": "", "whatsapp": ""}'::jsonb),
('seo', '{"meta_title": "Shop Kareta - Premium Products", "meta_description": "", "keywords": ""}'::jsonb),
('footer', '{"copyright_text": "© 2026 Shop Kareta. All rights reserved.", "footer_description": ""}'::jsonb)
ON CONFLICT (key) DO NOTHING;
