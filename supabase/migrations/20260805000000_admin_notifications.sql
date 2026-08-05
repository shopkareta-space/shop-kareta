-- 1. Create admin_notifications table
CREATE TABLE IF NOT EXISTS public.admin_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL, -- 'product', 'brand', 'order', 'message'
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link_url TEXT,
    is_read BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. Enable RLS and Policies
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage notifications" ON public.admin_notifications
    FOR ALL
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
    )
    WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
    );

-- 3. Trigger Functions
CREATE OR REPLACE FUNCTION public.handle_new_product_notification()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.admin_notifications (type, title, message, link_url)
    VALUES ('product', 'New Product Added', 'A new product "' || NEW.name || '" has been added.', '/admin/products/' || NEW.id || '/edit');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.handle_new_brand_notification()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.admin_notifications (type, title, message, link_url)
    VALUES ('brand', 'New Brand Added', 'A new brand "' || NEW.name || '" has been created.', '/admin/brands/' || NEW.id || '/edit');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.handle_new_order_notification()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.admin_notifications (type, title, message, link_url)
    VALUES ('order', 'New Order Placed', 'Order #' || substr(NEW.id::text, 1, 8) || ' placed for ₹' || NEW.total_amount, '/admin/orders/' || NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.handle_new_contact_message_notification()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.admin_notifications (type, title, message, link_url)
    VALUES ('message', 'New Contact Message', 'New message received from ' || NEW.name || '.', '/admin/messages');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Triggers
DROP TRIGGER IF EXISTS on_new_product_notification ON public.products;
CREATE TRIGGER on_new_product_notification
    AFTER INSERT ON public.products
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_product_notification();

DROP TRIGGER IF EXISTS on_new_brand_notification ON public.brands;
CREATE TRIGGER on_new_brand_notification
    AFTER INSERT ON public.brands
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_brand_notification();

DROP TRIGGER IF EXISTS on_new_order_notification ON public.orders;
CREATE TRIGGER on_new_order_notification
    AFTER INSERT ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_order_notification();

DROP TRIGGER IF EXISTS on_new_contact_message_notification ON public.contact_messages;
CREATE TRIGGER on_new_contact_message_notification
    AFTER INSERT ON public.contact_messages
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_contact_message_notification();
