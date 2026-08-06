-- Add order_number to orders table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS order_number TEXT UNIQUE;

-- Create sequence for order numbers if it doesn't exist
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    next_val INTEGER;
    year TEXT;
BEGIN
    SELECT nextval('order_number_seq') INTO next_val;
    SELECT to_char(CURRENT_DATE, 'YYYY') INTO year;
    RETURN 'SK-' || year || '-' || lpad(next_val::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically assign order_number on insert
CREATE OR REPLACE FUNCTION assign_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL THEN
        NEW.order_number := generate_order_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if it exists to avoid errors on reruns
DROP TRIGGER IF EXISTS set_order_number ON public.orders;
CREATE TRIGGER set_order_number
    BEFORE INSERT ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION assign_order_number();

-- Type for order items input to the RPC
DO $$ BEGIN
    CREATE TYPE order_item_input AS (
        product_id UUID,
        variant_id UUID,
        product_name TEXT,
        variant_name TEXT,
        quantity INTEGER,
        price NUMERIC,
        image TEXT
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- The grand process_checkout RPC
CREATE OR REPLACE FUNCTION process_checkout(
    p_user_id UUID,
    p_total_amount NUMERIC,
    p_payment_status public.payment_status,
    p_payment_method public.payment_method,
    p_delivery_method public.delivery_method,
    p_shipping_address JSONB,
    p_contact_info JSONB,
    p_items order_item_input[]
) RETURNS UUID AS $$
DECLARE
    new_order_id UUID;
    item order_item_input;
    current_stock INTEGER;
BEGIN
    -- 1. Validate Inventory (lock rows to prevent race conditions)
    FOREACH item IN ARRAY p_items
    LOOP
        SELECT inventory_count INTO current_stock
        FROM public.products
        WHERE id = item.product_id
        FOR UPDATE; -- Lock the row

        IF current_stock IS NULL THEN
            RAISE EXCEPTION 'Product % not found', item.product_id;
        END IF;

        IF current_stock < item.quantity THEN
            RAISE EXCEPTION 'Insufficient stock for product % (Available: %, Requested: %)', item.product_name, current_stock, item.quantity;
        END IF;
    END LOOP;

    -- 2. Create Order
    INSERT INTO public.orders (
        user_id,
        total_amount,
        status,
        payment_status,
        payment_method,
        delivery_method,
        shipping_address,
        contact_info
    ) VALUES (
        p_user_id,
        p_total_amount,
        'placed',
        p_payment_status,
        p_payment_method,
        p_delivery_method,
        p_shipping_address,
        p_contact_info
    ) RETURNING id INTO new_order_id;

    -- 3. Create Order Items and Deduct Inventory
    FOREACH item IN ARRAY p_items
    LOOP
        -- Insert order item
        INSERT INTO public.order_items (
            order_id,
            product_id,
            variant_id,
            product_name,
            variant_name,
            quantity,
            price,
            image
        ) VALUES (
            new_order_id,
            item.product_id,
            item.variant_id,
            item.product_name,
            item.variant_name,
            item.quantity,
            item.price,
            item.image
        );

        -- Deduct inventory
        UPDATE public.products
        SET inventory_count = inventory_count - item.quantity
        WHERE id = item.product_id;

        -- Log inventory change
        INSERT INTO public.inventory_logs (
            product_id,
            change_amount,
            reason,
            reference_id
        ) VALUES (
            item.product_id,
            -item.quantity,
            'order',
            'Order ' || new_order_id
        );
    END LOOP;

    -- 4. Write Audit Log (Initial Status)
    INSERT INTO public.order_status_history (
        order_id,
        previous_status,
        new_status,
        comment
    ) VALUES (
        new_order_id,
        NULL,
        'processing',
        'Order placed successfully'
    );

    RETURN new_order_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
