-- =========================================================================
-- Supabase RLS Multi-Tenant Security Audit Script
-- Verifies positive and negative access control across all roles
-- =========================================================================

BEGIN;

-- 1. Setup Test Users in pg_temp or mock auth contexts
DO $$
DECLARE
    v_admin_id UUID := 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
    v_vendor_a_id UUID := 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
    v_vendor_b_id UUID := 'cccccccc-cccc-cccc-cccc-cccccccccccc';
    v_buyer_a_id UUID := 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee';
    v_buyer_b_id UUID := 'dddddddd-dddd-dddd-dddd-dddddddddddd';
    v_book_a_id UUID := '44444444-4444-4444-4444-444444444401';
    v_book_b_id UUID := '44444444-4444-4444-4444-444444444405';
    v_cart_a_id UUID;
    v_unauthorized_count INTEGER;
BEGIN
    RAISE NOTICE '--- Starting RLS Multi-Tenant Audit ---';

    -- Test 1: Anonymous Access Controls
    -- Anonymous should NOT be able to insert books
    BEGIN
        PERFORM set_config('request.jwt.claims', '{"sub": null}', true);
        INSERT INTO public.books (
            vendor_id, title, author, category_id, condition, price_minor, stock, status
        ) VALUES (
            '33333333-3333-3333-3333-333333333301', 'Hacked Title', 'Anon',
            '22222222-2222-2222-2222-222222222201', 'new', 1000, 10, 'active'
        );
        RAISE EXCEPTION 'FAIL: Anonymous was able to insert a book!';
    EXCEPTION
        WHEN insufficient_privilege OR check_violation THEN
            RAISE NOTICE 'PASS: Anonymous blocked from inserting book.';
    END;

    -- Test 2: Role Self-Elevation Defense
    -- Buyer A should NOT be able to change their role to admin
    BEGIN
        PERFORM set_config('request.jwt.claims', json_build_object('sub', v_buyer_a_id)::text, true);
        UPDATE public.profiles
        SET role = 'admin'
        WHERE id = v_buyer_a_id;

        -- Check if role changed
        IF (SELECT role FROM public.profiles WHERE id = v_buyer_a_id) = 'admin' THEN
            RAISE EXCEPTION 'FAIL: Buyer was able to elevate role to admin!';
        END IF;
    EXCEPTION
        WHEN insufficient_privilege OR check_violation THEN
            RAISE NOTICE 'PASS: Buyer blocked from self-elevating to admin.';
    END;

    -- Test 3: Vendor Cross-Tenant Isolation
    -- Vendor B should NOT be able to update Vendor A's book
    BEGIN
        PERFORM set_config('request.jwt.claims', json_build_object('sub', v_vendor_b_id)::text, true);
        UPDATE public.books
        SET price_minor = 100
        WHERE id = v_book_a_id;

        IF (SELECT price_minor FROM public.books WHERE id = v_book_a_id) = 100 THEN
            RAISE EXCEPTION 'FAIL: Vendor B updated Vendor A''s book!';
        END IF;
        RAISE NOTICE 'PASS: Vendor B cannot update Vendor A''s book.';
    EXCEPTION
        WHEN insufficient_privilege THEN
            RAISE NOTICE 'PASS: Vendor B blocked from modifying Vendor A''s book.';
    END;

    -- Test 4: Buyer Cart Isolation
    -- Buyer B should NOT be able to read Buyer A's cart items
    PERFORM set_config('request.jwt.claims', json_build_object('sub', v_buyer_a_id)::text, true);
    INSERT INTO public.carts (user_id) VALUES (v_buyer_a_id)
    ON CONFLICT (user_id) DO NOTHING
    RETURNING id INTO v_cart_a_id;

    IF v_cart_a_id IS NULL THEN
        SELECT id INTO v_cart_a_id FROM public.carts WHERE user_id = v_buyer_a_id;
    END IF;

    -- Switch to Buyer B
    PERFORM set_config('request.jwt.claims', json_build_object('sub', v_buyer_b_id)::text, true);
    SELECT COUNT(*) INTO v_unauthorized_count
    FROM public.cart_items
    WHERE cart_id = v_cart_a_id;

    IF v_unauthorized_count > 0 THEN
        RAISE EXCEPTION 'FAIL: Buyer B can inspect Buyer A''s cart items!';
    ELSE
        RAISE NOTICE 'PASS: Buyer B cannot see Buyer A''s cart items.';
    END IF;

    -- Test 5: Verified Review Guard
    -- Buyer B has NOT purchased Dune (v_book_a_id). Inserting review must fail!
    BEGIN
        INSERT INTO public.reviews (book_id, buyer_id, rating, body)
        VALUES (v_book_a_id, v_buyer_b_id, 1, 'Fake unverified review!');

        RAISE EXCEPTION 'FAIL: Unverified buyer was able to insert a review!';
    EXCEPTION
        WHEN insufficient_privilege OR check_violation THEN
            RAISE NOTICE 'PASS: Unverified buyer blocked from reviewing book.';
    END;

    RAISE NOTICE '--- All RLS Security Tests Passed Successfully ---';
END $$;

ROLLBACK;

