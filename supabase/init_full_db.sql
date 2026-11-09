-- =========================================================================
-- COMPLETE MULTIVENDOR BOOK MARKETPLACE DATABASE INITIALIZATION SCRIPT
-- Execute this script in your Supabase Dashboard -> SQL Editor -> Run
-- =========================================================================

-- -------------------------------------------------------------------------
-- PART 1: Enums & Profiles Schema
-- -------------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('buyer', 'vendor', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE vendor_status AS ENUM ('pending', 'approved', 'suspended', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE book_condition AS ENUM ('new', 'like_new', 'good', 'fair');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE book_status AS ENUM ('draft', 'active', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('pending', 'processing', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE fulfillment_status AS ENUM ('pending', 'shipped', 'delivered', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role public.user_role NOT NULL DEFAULT 'buyer',
    full_name TEXT NOT NULL,
    avatar_key TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- -------------------------------------------------------------------------
-- PART 2: Marketplace Core Tables
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE RESTRICT,
    shop_name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    logo_key TEXT,
    banner_key TEXT,
    status public.vendor_status NOT NULL DEFAULT 'pending',
    commission_bps INTEGER NOT NULL DEFAULT 1000 CHECK (commission_bps >= 0 AND commission_bps <= 10000),
    shipping_fee_minor INTEGER NOT NULL DEFAULT 0 CHECK (shipping_fee_minor >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    isbn TEXT,
    description TEXT,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    condition public.book_condition NOT NULL DEFAULT 'good',
    price_minor INTEGER NOT NULL CHECK (price_minor >= 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    status public.book_status NOT NULL DEFAULT 'draft',
    search_tsv TSVECTOR,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.book_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    r2_key TEXT NOT NULL,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id UUID NOT NULL REFERENCES public.carts(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    qty INTEGER NOT NULL CHECK (qty > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    UNIQUE(cart_id, book_id)
);

CREATE TABLE IF NOT EXISTS public.wishlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    UNIQUE(user_id, book_id)
);

CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    subtotal_minor INTEGER NOT NULL CHECK (subtotal_minor >= 0),
    shipping_minor INTEGER NOT NULL DEFAULT 0 CHECK (shipping_minor >= 0),
    total_minor INTEGER NOT NULL CHECK (total_minor >= 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    status public.order_status NOT NULL DEFAULT 'pending',
    payment_status public.payment_status NOT NULL DEFAULT 'pending',
    payment_provider TEXT NOT NULL DEFAULT 'mock',
    payment_reference TEXT,
    shipping_address JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE RESTRICT,
    vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE RESTRICT,
    qty INTEGER NOT NULL CHECK (qty > 0),
    unit_price_minor INTEGER NOT NULL CHECK (unit_price_minor >= 0),
    commission_bps INTEGER NOT NULL DEFAULT 1000 CHECK (commission_bps >= 0 AND commission_bps <= 10000),
    commission_amount_minor INTEGER NOT NULL DEFAULT 0 CHECK (commission_amount_minor >= 0),
    fulfillment_status public.fulfillment_status NOT NULL DEFAULT 'pending',
    tracking_number TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    body TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    UNIQUE(book_id, buyer_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_vendors_slug ON public.vendors(slug);
CREATE INDEX IF NOT EXISTS idx_vendors_owner ON public.vendors(owner_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON public.categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_books_vendor ON public.books(vendor_id);
CREATE INDEX IF NOT EXISTS idx_books_category ON public.books(category_id);
CREATE INDEX IF NOT EXISTS idx_books_status ON public.books(status);
CREATE INDEX IF NOT EXISTS idx_books_condition ON public.books(condition);
CREATE INDEX IF NOT EXISTS idx_books_search_tsv ON public.books USING gin(search_tsv);
CREATE INDEX IF NOT EXISTS idx_book_images_book ON public.book_images(book_id, position);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_vendor ON public.order_items(vendor_id);
CREATE INDEX IF NOT EXISTS idx_reviews_book ON public.reviews(book_id);

-- -------------------------------------------------------------------------
-- PART 3: Helper Functions & Triggers
-- -------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc', now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.get_my_vendor_id()
RETURNS UUID AS $$
BEGIN
    RETURN (
        SELECT id FROM public.vendors
        WHERE owner_id = auth.uid()
        LIMIT 1
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Trigger: auto-create profiles on auth.users insert
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, role)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        'buyer'::public.user_role
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger: Full-Text Search Vector
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

-- -------------------------------------------------------------------------
-- PART 4: Atomic Order Checkout RPC
-- -------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.create_order_atomic(
    p_buyer_id UUID,
    p_items JSONB,
    p_shipping_address JSONB,
    p_payment_provider TEXT DEFAULT 'mock'
)
RETURNS UUID AS $$
DECLARE
    v_order_id UUID;
    v_item RECORD;
    v_book RECORD;
    v_subtotal_minor INTEGER := 0;
    v_shipping_minor INTEGER := 0;
    v_total_minor INTEGER := 0;
    v_vendors_seen UUID[] := ARRAY[]::UUID[];
    v_cart_id UUID;
BEGIN
    IF auth.uid() IS NOT NULL AND auth.uid() <> p_buyer_id AND NOT public.is_admin() THEN
        RAISE EXCEPTION 'Unauthorized: Caller cannot create order for another user.';
    END IF;

    IF jsonb_array_length(p_items) = 0 THEN
        RAISE EXCEPTION 'Cannot checkout an empty item list.';
    END IF;

    FOR v_item IN SELECT * FROM jsonb_to_recordset(p_items) AS x(book_id UUID, qty INTEGER)
    LOOP
        IF v_item.qty <= 0 THEN
            RAISE EXCEPTION 'Item quantity must be greater than zero.';
        END IF;

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

        UPDATE public.books
        SET stock = stock - v_item.qty
        WHERE id = v_book.id;

        v_subtotal_minor := v_subtotal_minor + (v_book.price_minor * v_item.qty);

        IF NOT (v_book.vendor_id = ANY(v_vendors_seen)) THEN
            v_vendors_seen := array_append(v_vendors_seen, v_book.vendor_id);
            v_shipping_minor := v_shipping_minor + COALESCE(v_book.shipping_fee_minor, 0);
        END IF;
    END LOOP;

    v_total_minor := v_subtotal_minor + v_shipping_minor;

    INSERT INTO public.orders (
        buyer_id, subtotal_minor, shipping_minor, total_minor,
        currency, status, payment_status, payment_provider, shipping_address
    ) VALUES (
        p_buyer_id, v_subtotal_minor, v_shipping_minor, v_total_minor,
        'USD', 'pending', 'pending', p_payment_provider, p_shipping_address
    )
    RETURNING id INTO v_order_id;

    FOR v_item IN SELECT * FROM jsonb_to_recordset(p_items) AS x(book_id UUID, qty INTEGER)
    LOOP
        SELECT b.vendor_id, b.price_minor, v.commission_bps
        INTO v_book
        FROM public.books b
        JOIN public.vendors v ON v.id = b.vendor_id
        WHERE b.id = v_item.book_id;

        INSERT INTO public.order_items (
            order_id, book_id, vendor_id, qty, unit_price_minor,
            commission_bps, commission_amount_minor, fulfillment_status
        ) VALUES (
            v_order_id, v_item.book_id, v_book.vendor_id, v_item.qty, v_book.price_minor,
            v_book.commission_bps,
            ROUND((v_book.price_minor * v_item.qty * v_book.commission_bps)::NUMERIC / 10000),
            'pending'
        );
    END LOOP;

    SELECT id INTO v_cart_id FROM public.carts WHERE user_id = p_buyer_id;
    IF v_cart_id IS NOT NULL THEN
        DELETE FROM public.cart_items
        WHERE cart_id = v_cart_id
          AND book_id IN (SELECT (value->>'book_id')::UUID FROM jsonb_array_elements(p_items));
    END IF;

    RETURN v_order_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- -------------------------------------------------------------------------
-- PART 5: Row Level Security (RLS) Enablement & Policies
-- -------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Profiles
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id AND role = (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid()));

DROP POLICY IF EXISTS "Admins have full access to profiles" ON public.profiles;
CREATE POLICY "Admins have full access to profiles" ON public.profiles FOR ALL
USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- Vendors
DROP POLICY IF EXISTS "Vendors viewable by public if approved, or by owner, or admin" ON public.vendors;
CREATE POLICY "Vendors viewable by public if approved, or by owner, or admin" ON public.vendors FOR SELECT
USING (status = 'approved' OR owner_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Authenticated users can apply for vendor status" ON public.vendors;
CREATE POLICY "Authenticated users can apply for vendor status" ON public.vendors FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL AND owner_id = auth.uid() AND status = 'pending' AND commission_bps = 1000);

DROP POLICY IF EXISTS "Vendors can update own profile" ON public.vendors;
CREATE POLICY "Vendors can update own profile" ON public.vendors FOR UPDATE
USING (owner_id = auth.uid() OR public.is_admin())
WITH CHECK (public.is_admin() OR (owner_id = auth.uid() AND status = (SELECT v.status FROM public.vendors v WHERE v.id = vendors.id) AND commission_bps = (SELECT v.commission_bps FROM public.vendors v WHERE v.id = vendors.id)));

-- Categories
DROP POLICY IF EXISTS "Categories viewable by everyone" ON public.categories;
CREATE POLICY "Categories viewable by everyone" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage categories" ON public.categories;
CREATE POLICY "Admins manage categories" ON public.categories FOR ALL USING (public.is_admin());

-- Books
DROP POLICY IF EXISTS "Books viewable by public if active and vendor approved, or by vendor, or admin" ON public.books;
CREATE POLICY "Books viewable by public if active and vendor approved, or by vendor, or admin" ON public.books FOR SELECT
USING ((status = 'active' AND EXISTS (SELECT 1 FROM public.vendors v WHERE v.id = books.vendor_id AND v.status = 'approved')) OR vendor_id = public.get_my_vendor_id() OR public.is_admin());

DROP POLICY IF EXISTS "Approved vendors can insert books" ON public.books;
CREATE POLICY "Approved vendors can insert books" ON public.books FOR INSERT
WITH CHECK (public.is_admin() OR (vendor_id = public.get_my_vendor_id() AND EXISTS (SELECT 1 FROM public.vendors v WHERE v.id = books.vendor_id AND v.status = 'approved')));

DROP POLICY IF EXISTS "Vendors can update own books" ON public.books;
CREATE POLICY "Vendors can update own books" ON public.books FOR UPDATE
USING (vendor_id = public.get_my_vendor_id() OR public.is_admin())
WITH CHECK (vendor_id = public.get_my_vendor_id() OR public.is_admin());

DROP POLICY IF EXISTS "Vendors can delete own books" ON public.books;
CREATE POLICY "Vendors can delete own books" ON public.books FOR DELETE
USING (vendor_id = public.get_my_vendor_id() OR public.is_admin());

-- Book Images
DROP POLICY IF EXISTS "Book images viewable if parent book is viewable" ON public.book_images;
CREATE POLICY "Book images viewable if parent book is viewable" ON public.book_images FOR SELECT
USING (EXISTS (SELECT 1 FROM public.books b WHERE b.id = book_images.book_id AND ((b.status = 'active' AND EXISTS (SELECT 1 FROM public.vendors v WHERE v.id = b.vendor_id AND v.status = 'approved')) OR b.vendor_id = public.get_my_vendor_id() OR public.is_admin())));

DROP POLICY IF EXISTS "Vendors manage book images for own books" ON public.book_images;
CREATE POLICY "Vendors manage book images for own books" ON public.book_images FOR ALL
USING (public.is_admin() OR EXISTS (SELECT 1 FROM public.books b WHERE b.id = book_images.book_id AND b.vendor_id = public.get_my_vendor_id()));

-- Carts
DROP POLICY IF EXISTS "Users can only view and manage their own cart" ON public.carts;
CREATE POLICY "Users can only view and manage their own cart" ON public.carts FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can only view and manage their own cart items" ON public.cart_items;
CREATE POLICY "Users can only view and manage their own cart items" ON public.cart_items FOR ALL USING (EXISTS (SELECT 1 FROM public.carts c WHERE c.id = cart_items.cart_id AND c.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM public.carts c WHERE c.id = cart_items.cart_id AND c.user_id = auth.uid()));

-- Wishlists
DROP POLICY IF EXISTS "Users can only view and manage their own wishlist" ON public.wishlists;
CREATE POLICY "Users can only view and manage their own wishlist" ON public.wishlists FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Orders & Items
DROP POLICY IF EXISTS "Buyers view own orders, admins view all" ON public.orders;
CREATE POLICY "Buyers view own orders, admins view all" ON public.orders FOR SELECT USING (buyer_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Buyers can insert own orders" ON public.orders;
CREATE POLICY "Buyers can insert own orders" ON public.orders FOR INSERT WITH CHECK (buyer_id = auth.uid());

DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
CREATE POLICY "Admins can update orders" ON public.orders FOR UPDATE USING (public.is_admin());

DROP POLICY IF EXISTS "Order items viewable by buyer, vendor, or admin" ON public.order_items;
CREATE POLICY "Order items viewable by buyer, vendor, or admin" ON public.order_items FOR SELECT
USING (public.is_admin() OR vendor_id = public.get_my_vendor_id() OR EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_items.order_id AND o.buyer_id = auth.uid()));

DROP POLICY IF EXISTS "Order items insertable for own order or admin" ON public.order_items;
CREATE POLICY "Order items insertable for own order or admin" ON public.order_items FOR INSERT
WITH CHECK (public.is_admin() OR EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_items.order_id AND o.buyer_id = auth.uid()));

DROP POLICY IF EXISTS "Vendors can update fulfillment on own items" ON public.order_items;
CREATE POLICY "Vendors can update fulfillment on own items" ON public.order_items FOR UPDATE
USING (vendor_id = public.get_my_vendor_id() OR public.is_admin())
WITH CHECK (public.is_admin() OR (vendor_id = public.get_my_vendor_id() AND order_id = (SELECT oi.order_id FROM public.order_items oi WHERE oi.id = order_items.id) AND book_id = (SELECT oi.book_id FROM public.order_items oi WHERE oi.id = order_items.id) AND qty = (SELECT oi.qty FROM public.order_items oi WHERE oi.id = order_items.id) AND unit_price_minor = (SELECT oi.unit_price_minor FROM public.order_items oi WHERE oi.id = order_items.id)));

-- Reviews
DROP POLICY IF EXISTS "Reviews viewable by everyone" ON public.reviews;
CREATE POLICY "Reviews viewable by everyone" ON public.reviews FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only verified buyers can insert reviews" ON public.reviews;
CREATE POLICY "Only verified buyers can insert reviews" ON public.reviews FOR INSERT
WITH CHECK (buyer_id = auth.uid() AND EXISTS (SELECT 1 FROM public.orders o JOIN public.order_items oi ON oi.order_id = o.id WHERE o.buyer_id = auth.uid() AND o.payment_status = 'paid' AND oi.book_id = reviews.book_id));

DROP POLICY IF EXISTS "Buyers can update own reviews" ON public.reviews;
CREATE POLICY "Buyers can update own reviews" ON public.reviews FOR UPDATE USING (buyer_id = auth.uid() OR public.is_admin()) WITH CHECK (buyer_id = auth.uid() OR public.is_admin());

-- -------------------------------------------------------------------------
-- PART 6: Seed Categories & Catalog
-- -------------------------------------------------------------------------
DO $$
DECLARE
    v_fiction_id UUID := '11111111-1111-1111-1111-111111111101';
    v_nonfiction_id UUID := '11111111-1111-1111-1111-111111111102';
    v_academic_id UUID := '11111111-1111-1111-1111-111111111103';
    v_rare_id UUID := '11111111-1111-1111-1111-111111111104';
    v_children_id UUID := '11111111-1111-1111-1111-111111111105';
BEGIN
    INSERT INTO public.categories (id, name, slug, parent_id, sort_order) VALUES
        (v_fiction_id, 'Fiction', 'fiction', NULL, 1),
        (v_nonfiction_id, 'Non-Fiction', 'non-fiction', NULL, 2),
        (v_academic_id, 'Academic & Reference', 'academic-reference', NULL, 3),
        (v_rare_id, 'Rare & Collectibles', 'rare-collectibles', NULL, 4),
        (v_children_id, 'Young Adult & Children', 'children-ya', NULL, 5)
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.categories (id, name, slug, parent_id, sort_order) VALUES
        ('22222222-2222-2222-2222-222222222201', 'Classic Literature', 'classic-literature', v_fiction_id, 10),
        ('22222222-2222-2222-2222-222222222202', 'Sci-Fi & Fantasy', 'sci-fi-fantasy', v_fiction_id, 11),
        ('22222222-2222-2222-2222-222222222203', 'Mystery & Detective', 'mystery-detective', v_fiction_id, 12),
        ('22222222-2222-2222-2222-222222222204', 'Historical Fiction', 'historical-fiction', v_fiction_id, 13),
        ('22222222-2222-2222-2222-222222222205', 'History & Warfare', 'history-warfare', v_nonfiction_id, 20),
        ('22222222-2222-2222-2222-222222222206', 'Philosophy & Ideas', 'philosophy-ideas', v_nonfiction_id, 21),
        ('22222222-2222-2222-2222-222222222207', 'Computer Science & Tech', 'computer-science-tech', v_nonfiction_id, 22),
        ('22222222-2222-2222-2222-222222222208', 'Biography & Memoir', 'biography-memoir', v_nonfiction_id, 23),
        ('22222222-2222-2222-2222-222222222209', 'First Editions', 'first-editions', v_rare_id, 30),
        ('22222222-2222-2222-2222-222222222210', 'Signed & Inscribed', 'signed-inscribed', v_rare_id, 31)
    ON CONFLICT (id) DO NOTHING;
END $$;
