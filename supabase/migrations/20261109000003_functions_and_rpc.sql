-- Migration: 20261109000003_functions_and_rpc.sql
-- Description: Full-text search trigger, updated_at automation, and atomic checkout RPC function.

-- 1. Full-Text Search Vector Auto-Generator Trigger for Books
CREATE OR REPLACE FUNCTION public.books_search_tsv_update()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_tsv :=
        setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.author, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(NEW.isbn, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'C');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_books_search_tsv ON public.books;
CREATE TRIGGER trg_books_search_tsv
    BEFORE INSERT OR UPDATE OF title, author, isbn, description ON public.books
    FOR EACH ROW EXECUTE FUNCTION public.books_search_tsv_update();

-- 2. Automation for updated_at timestamps
DROP TRIGGER IF EXISTS set_vendors_updated_at ON public.vendors;
CREATE TRIGGER set_vendors_updated_at
    BEFORE UPDATE ON public.vendors
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_books_updated_at ON public.books;
CREATE TRIGGER set_books_updated_at
    BEFORE UPDATE ON public.books
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_orders_updated_at ON public.orders;
CREATE TRIGGER set_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_order_items_updated_at ON public.order_items;
CREATE TRIGGER set_order_items_updated_at
    BEFORE UPDATE ON public.order_items
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_reviews_updated_at ON public.reviews;
CREATE TRIGGER set_reviews_updated_at
    BEFORE UPDATE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 3. Atomic Order Checkout Transaction (RPC)
-- Ensures race-condition-free checkout with row locks (FOR UPDATE)
CREATE OR REPLACE FUNCTION public.create_order_atomic(
    p_buyer_id UUID,
    p_items JSONB, -- Array of {"book_id": "...", "qty": 1}
    p_shipping_address JSONB,
    p_payment_provider TEXT DEFAULT 'mock'
)
RETURNS UUID AS $$
DECLARE
    v_order_id UUID;
    v_item RECORD;
    v_book RECORD;
    v_vendor RECORD;
    v_subtotal_minor INTEGER := 0;
    v_shipping_minor INTEGER := 0;
    v_total_minor INTEGER := 0;
    v_vendors_seen UUID[] := ARRAY[]::UUID[];
    v_cart_id UUID;
BEGIN
    -- Security guard: Caller must be buyer or admin
    IF auth.uid() IS NOT NULL AND auth.uid() <> p_buyer_id AND NOT public.is_admin() THEN
        RAISE EXCEPTION 'Unauthorized: Caller cannot create order for another user.';
    END IF;

    -- Validate input items
    IF jsonb_array_length(p_items) = 0 THEN
        RAISE EXCEPTION 'Cannot checkout an empty item list.';
    END IF;

    -- 1. First pass: Lock all books, check availability, calculate subtotal and shipping
    FOR v_item IN SELECT * FROM jsonb_to_recordset(p_items) AS x(book_id UUID, qty INTEGER)
    LOOP
        IF v_item.qty <= 0 THEN
            RAISE EXCEPTION 'Item quantity must be greater than zero.';
        END IF;

        -- Lock book row for update to eliminate overselling race conditions
        SELECT b.*, v.status AS vendor_status, v.commission_bps, v.shipping_fee_minor
        INTO v_book
        FROM public.books b
        JOIN public.vendors v ON v.id = b.vendor_id
        WHERE b.id = v_item.book_id
        FOR UPDATE OF b;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Book with ID % not found.', v_item.book_id;
        END IF;

        IF v_book.status <> 'active' OR v_book.vendor_status <> 'approved' THEN
            RAISE EXCEPTION 'Book "%" is currently not available for purchase.', v_book.title;
        END IF;

        IF v_book.stock < v_item.qty THEN
            RAISE EXCEPTION 'Insufficient inventory for book "%". Available: %, Requested: %',
                v_book.title, v_book.stock, v_item.qty;
        END IF;

        -- Decrement stock immediately
        UPDATE public.books
        SET stock = stock - v_item.qty
        WHERE id = v_book.id;

        -- Subtotal calculation
        v_subtotal_minor := v_subtotal_minor + (v_book.price_minor * v_item.qty);

        -- Add vendor shipping fee once per unique vendor present in order
        IF NOT (v_book.vendor_id = ANY(v_vendors_seen)) THEN
            v_vendors_seen := array_append(v_vendors_seen, v_book.vendor_id);
            v_shipping_minor := v_shipping_minor + COALESCE(v_book.shipping_fee_minor, 0);
        END IF;
    END LOOP;

    v_total_minor := v_subtotal_minor + v_shipping_minor;

    -- 2. Insert parent order
    INSERT INTO public.orders (
        buyer_id,
        subtotal_minor,
        shipping_minor,
        total_minor,
        currency,
        status,
        payment_status,
        payment_provider,
        shipping_address
    ) VALUES (
        p_buyer_id,
        v_subtotal_minor,
        v_shipping_minor,
        v_total_minor,
        'BDT',
        'pending',
        'pending',
        p_payment_provider,
        p_shipping_address
    )
    RETURNING id INTO v_order_id;

    -- 3. Insert order items with per-vendor commission calculated
    FOR v_item IN SELECT * FROM jsonb_to_recordset(p_items) AS x(book_id UUID, qty INTEGER)
    LOOP
        SELECT b.vendor_id, b.price_minor, v.commission_bps
        INTO v_book
        FROM public.books b
        JOIN public.vendors v ON v.id = b.vendor_id
        WHERE b.id = v_item.book_id;

        INSERT INTO public.order_items (
            order_id,
            book_id,
            vendor_id,
            qty,
            unit_price_minor,
            commission_bps,
            commission_amount_minor,
            fulfillment_status
        ) VALUES (
            v_order_id,
            v_item.book_id,
            v_book.vendor_id,
            v_item.qty,
            v_book.price_minor,
            v_book.commission_bps,
            ROUND((v_book.price_minor * v_item.qty * v_book.commission_bps)::NUMERIC / 10000),
            'pending'
        );
    END LOOP;

    -- 4. Clean up purchased items from buyer's cart if exists
    SELECT id INTO v_cart_id FROM public.carts WHERE user_id = p_buyer_id;
    IF v_cart_id IS NOT NULL THEN
        DELETE FROM public.cart_items
        WHERE cart_id = v_cart_id
          AND book_id IN (
              SELECT (value->>'book_id')::UUID FROM jsonb_array_elements(p_items)
          );
    END IF;

    RETURN v_order_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

