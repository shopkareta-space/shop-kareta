-- Fix product audit log foreign key constraint
ALTER TABLE public.product_audit_logs 
DROP CONSTRAINT IF EXISTS product_audit_logs_product_id_fkey;

ALTER TABLE public.product_audit_logs 
ADD CONSTRAINT product_audit_logs_product_id_fkey 
FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL;

-- Update trigger function to handle DELETE gracefully without violating FK constraint
CREATE OR REPLACE FUNCTION public.handle_product_audit()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'DELETE') THEN
        INSERT INTO public.product_audit_logs (product_id, admin_id, action, old_data)
        VALUES (NULL, auth.uid(), 'DELETE', row_to_json(OLD));
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO public.product_audit_logs (product_id, admin_id, action, old_data, new_data)
        VALUES (NEW.id, auth.uid(), 'UPDATE', row_to_json(OLD), row_to_json(NEW));
        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO public.product_audit_logs (product_id, admin_id, action, new_data)
        VALUES (NEW.id, auth.uid(), 'INSERT', row_to_json(NEW));
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
