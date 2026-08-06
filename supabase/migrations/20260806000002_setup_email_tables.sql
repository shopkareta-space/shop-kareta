-- ==============================================================================
-- PHASE 6: EMAIL NOTIFICATION SYSTEM
-- Please run this script in your Supabase SQL Editor.
-- ==============================================================================

-- 1. Create email_logs table
CREATE TABLE IF NOT EXISTS public.email_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    recipient TEXT NOT NULL,
    template_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'sent', 'failed'
    subject TEXT,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    sent_time TIMESTAMP WITH TIME ZONE,
    failed_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS to email_logs (Admins only)
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view email logs" ON public.email_logs
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- Allow service role to do everything (handled automatically by Supabase)

-- 2. Create store_settings table (generic key-value store for admin settings)
CREATE TABLE IF NOT EXISTS public.store_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default email settings
INSERT INTO public.store_settings (key, value)
VALUES (
    'email_config', 
    '{"provider": "resend", "sender_name": "Shop Kareta", "sender_email": "orders@shopkareta.com", "reply_to": "support@shopkareta.com"}'::jsonb
)
ON CONFLICT (key) DO NOTHING;

-- Add RLS to store_settings
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read store settings" ON public.store_settings
    FOR SELECT
    USING (true);

CREATE POLICY "Admins can update store settings" ON public.store_settings
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );
