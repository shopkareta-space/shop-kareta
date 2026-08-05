-- Create Homepage CMS tables

CREATE TABLE IF NOT EXISTS public.homepage_revisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version_name TEXT NOT NULL,
    content JSONB NOT NULL,
    status TEXT DEFAULT 'draft' NOT NULL, -- 'draft', 'published', 'archived'
    created_by UUID, -- Can link to auth.users if needed
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    published_at TIMESTAMPTZ
);
