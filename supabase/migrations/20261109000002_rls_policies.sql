-- Migration: 20261109000002_rls_policies.sql
-- Description: Complete Row Level Security (RLS) policies for all marketplace tables.

-- Helper function: Check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Helper function: Get vendor id owned by current user
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

-- 1. Enable RLS on all tables
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

-- =========================================================================
-- 2. VENDORS POLICIES
-- =========================================================================

-- Anyone can view approved vendors; owners can view their own; admins can view all
CREATE POLICY "Vendors viewable by public if approved, or by owner, or admin"
    ON public.vendors FOR SELECT
    USING (
        status = 'approved' OR
        owner_id = auth.uid() OR
        public.is_admin()
    );

-- Any authenticated user can submit a pending vendor application
CREATE POLICY "Authenticated users can apply for vendor status"
    ON public.vendors FOR INSERT
    WITH CHECK (
        auth.uid() IS NOT NULL AND
        owner_id = auth.uid() AND
        status = 'pending' AND
        commission_bps = 1000
    );

-- Vendor owner can update shop details, but CANNOT self-approve or alter commissions
CREATE POLICY "Vendors can update own profile"
    ON public.vendors FOR UPDATE
    USING (owner_id = auth.uid() OR public.is_admin())
    WITH CHECK (
        public.is_admin() OR (
            owner_id = auth.uid() AND
            status = (SELECT v.status FROM public.vendors v WHERE v.id = vendors.id) AND
            commission_bps = (SELECT v.commission_bps FROM public.vendors v WHERE v.id = vendors.id)
        )
    );

-- Only admins can delete vendors
CREATE POLICY "Admins can delete vendors"
    ON public.vendors FOR DELETE
    USING (public.is_admin());

-- =========================================================================
-- 3. CATEGORIES POLICIES
-- =========================================================================

-- Anyone can view categories
CREATE POLICY "Categories viewable by everyone"
    ON public.categories FOR SELECT
    USING (true);

-- Only admins can insert, update, or delete categories
CREATE POLICY "Admins manage categories"
    ON public.categories FOR ALL
    USING (public.is_admin());

-- =========================================================================
-- 4. BOOKS POLICIES
-- =========================================================================

-- Public can view active books from approved vendors; vendors view their own; admins view all
CREATE POLICY "Books viewable by public if active and vendor approved, or by vendor, or admin"
    ON public.books FOR SELECT
    USING (
        (status = 'active' AND EXISTS (
            SELECT 1 FROM public.vendors v
            WHERE v.id = books.vendor_id AND v.status = 'approved'
        )) OR
        vendor_id = public.get_my_vendor_id() OR
        public.is_admin()
    );

-- Approved vendors can create books for their own shop; admins can insert
CREATE POLICY "Approved vendors can insert books"
    ON public.books FOR INSERT
    WITH CHECK (
        public.is_admin() OR (
            vendor_id = public.get_my_vendor_id() AND
            EXISTS (
                SELECT 1 FROM public.vendors v
                WHERE v.id = books.vendor_id AND v.status = 'approved'
            )
        )
    );

-- Vendors can update their own books; admins can update all
CREATE POLICY "Vendors can update own books"
    ON public.books FOR UPDATE
    USING (vendor_id = public.get_my_vendor_id() OR public.is_admin())
    WITH CHECK (vendor_id = public.get_my_vendor_id() OR public.is_admin());

-- Vendors can delete/archive their own books; admins can delete
CREATE POLICY "Vendors can delete own books"
    ON public.books FOR DELETE
    USING (vendor_id = public.get_my_vendor_id() OR public.is_admin());

-- =========================================================================
-- 5. BOOK IMAGES POLICIES
-- =========================================================================

CREATE POLICY "Book images viewable if parent book is viewable"
    ON public.book_images FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.books b
            WHERE b.id = book_images.book_id AND (
                (b.status = 'active' AND EXISTS (
                    SELECT 1 FROM public.vendors v WHERE v.id = b.vendor_id AND v.status = 'approved'
                )) OR
                b.vendor_id = public.get_my_vendor_id() OR
                public.is_admin()
            )
        )
    );

CREATE POLICY "Vendors manage book images for own books"
    ON public.book_images FOR ALL
    USING (
        public.is_admin() OR
        EXISTS (
            SELECT 1 FROM public.books b
            WHERE b.id = book_images.book_id AND b.vendor_id = public.get_my_vendor_id()
        )
    );

-- =========================================================================
-- 6. CARTS & CART ITEMS POLICIES
-- =========================================================================

CREATE POLICY "Users can only view and manage their own cart"
    ON public.carts FOR ALL
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can only view and manage their own cart items"
    ON public.cart_items FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.carts c
            WHERE c.id = cart_items.cart_id AND c.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.carts c
            WHERE c.id = cart_items.cart_id AND c.user_id = auth.uid()
        )
    );

-- =========================================================================
-- 7. WISHLISTS POLICIES
-- =========================================================================

CREATE POLICY "Users can only view and manage their own wishlist"
    ON public.wishlists FOR ALL
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- =========================================================================
-- 8. ORDERS POLICIES
-- =========================================================================

-- Buyers view own orders; Admins view all
CREATE POLICY "Buyers view own orders, admins view all"
    ON public.orders FOR SELECT
    USING (buyer_id = auth.uid() OR public.is_admin());

-- Buyers can insert own orders
CREATE POLICY "Buyers can insert own orders"
    ON public.orders FOR INSERT
    WITH CHECK (buyer_id = auth.uid());

-- Only admins can update orders (status, payment_status)
CREATE POLICY "Admins can update orders"
    ON public.orders FOR UPDATE
    USING (public.is_admin());

-- =========================================================================
-- 9. ORDER ITEMS POLICIES
-- =========================================================================

-- Buyers view items in their orders; Vendors view items sold by them; Admins view all
CREATE POLICY "Order items viewable by buyer, vendor, or admin"
    ON public.order_items FOR SELECT
    USING (
        public.is_admin() OR
        vendor_id = public.get_my_vendor_id() OR
        EXISTS (
            SELECT 1 FROM public.orders o
            WHERE o.id = order_items.order_id AND o.buyer_id = auth.uid()
        )
    );

-- Order items can be created when order is created by buyer or atomic RPC
CREATE POLICY "Order items insertable for own order or admin"
    ON public.order_items FOR INSERT
    WITH CHECK (
        public.is_admin() OR
        EXISTS (
            SELECT 1 FROM public.orders o
            WHERE o.id = order_items.order_id AND o.buyer_id = auth.uid()
        )
    );

-- Vendors can update fulfillment status & tracking number for their own items; admins can update all
CREATE POLICY "Vendors can update fulfillment on own items"
    ON public.order_items FOR UPDATE
    USING (vendor_id = public.get_my_vendor_id() OR public.is_admin())
    WITH CHECK (
        public.is_admin() OR (
            vendor_id = public.get_my_vendor_id() AND
            order_id = (SELECT oi.order_id FROM public.order_items oi WHERE oi.id = order_items.id) AND
            book_id = (SELECT oi.book_id FROM public.order_items oi WHERE oi.id = order_items.id) AND
            qty = (SELECT oi.qty FROM public.order_items oi WHERE oi.id = order_items.id) AND
            unit_price_minor = (SELECT oi.unit_price_minor FROM public.order_items oi WHERE oi.id = order_items.id)
        )
    );

-- =========================================================================
-- 10. REVIEWS POLICIES
-- =========================================================================

-- Anyone can view reviews
CREATE POLICY "Reviews viewable by everyone"
    ON public.reviews FOR SELECT
    USING (true);

-- Only verified buyers who ordered and paid for the book can review it
CREATE POLICY "Only verified buyers can insert reviews"
    ON public.reviews FOR INSERT
    WITH CHECK (
        buyer_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM public.orders o
            JOIN public.order_items oi ON oi.order_id = o.id
            WHERE o.buyer_id = auth.uid()
              AND o.payment_status = 'paid'
              AND oi.book_id = reviews.book_id
        )
    );

-- Buyers can update own reviews
CREATE POLICY "Buyers can update own reviews"
    ON public.reviews FOR UPDATE
    USING (buyer_id = auth.uid() OR public.is_admin())
    WITH CHECK (buyer_id = auth.uid() OR public.is_admin());

-- Buyers can delete own review; admins can delete any
CREATE POLICY "Buyers or admins can delete reviews"
    ON public.reviews FOR DELETE
    USING (buyer_id = auth.uid() OR public.is_admin());
