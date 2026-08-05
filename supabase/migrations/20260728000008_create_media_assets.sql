-- Create Media Assets table for centralized Media Library

CREATE TABLE IF NOT EXISTS public.media_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name TEXT NOT NULL,
    url TEXT UNIQUE NOT NULL,
    storage_path TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size_bytes BIGINT NOT NULL,
    width INTEGER,
    height INTEGER,
    folder TEXT DEFAULT 'General',
    uploaded_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

DROP TRIGGER IF EXISTS handle_updated_at_media_assets ON public.media_assets;
CREATE TRIGGER handle_updated_at_media_assets
    BEFORE UPDATE ON public.media_assets
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Add RLS policies (optional, defaulting to public read for admin ease)
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on media_assets" ON public.media_assets;
CREATE POLICY "Allow public read access on media_assets"
ON public.media_assets FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Allow authenticated full access on media_assets" ON public.media_assets;
CREATE POLICY "Allow authenticated full access on media_assets"
ON public.media_assets FOR ALL TO authenticated USING (true) WITH CHECK (true);
