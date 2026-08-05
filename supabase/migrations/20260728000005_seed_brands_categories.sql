-- Seed initial Brands and Categories
INSERT INTO public.brands (name, slug)
VALUES 
    ('Vedique Nutrition', 'vedique-nutrition'),
    ('Satvam Wellness', 'satvam-wellness'),
    ('La''Skovia', 'la-skovia')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (name, slug)
VALUES 
    ('Health & Wellness', 'health-and-wellness'),
    ('Cosmetics', 'cosmetics'),
    ('Ortho Care', 'ortho-care')
ON CONFLICT (slug) DO NOTHING;
