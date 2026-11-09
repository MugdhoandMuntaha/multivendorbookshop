-- =========================================================================
-- Supabase Marketplace Seed Data (Categories, Vendors, Books, Reviews)
-- =========================================================================

-- 1. Create Core Categories Hierarchy
DO $$
DECLARE
    v_fiction_id UUID := '11111111-1111-1111-1111-111111111101';
    v_nonfiction_id UUID := '11111111-1111-1111-1111-111111111102';
    v_academic_id UUID := '11111111-1111-1111-1111-111111111103';
    v_rare_id UUID := '11111111-1111-1111-1111-111111111104';
    v_children_id UUID := '11111111-1111-1111-1111-111111111105';
BEGIN
    -- Parent Categories
    INSERT INTO public.categories (id, name, slug, parent_id, sort_order) VALUES
        (v_fiction_id, 'Fiction', 'fiction', NULL, 1),
        (v_nonfiction_id, 'Non-Fiction', 'non-fiction', NULL, 2),
        (v_academic_id, 'Academic & Reference', 'academic-reference', NULL, 3),
        (v_rare_id, 'Rare & Collectibles', 'rare-collectibles', NULL, 4),
        (v_children_id, 'Young Adult & Children', 'children-ya', NULL, 5)
    ON CONFLICT (id) DO NOTHING;

    -- Subcategories: Fiction
    INSERT INTO public.categories (id, name, slug, parent_id, sort_order) VALUES
        ('22222222-2222-2222-2222-222222222201', 'Classic Literature', 'classic-literature', v_fiction_id, 10),
        ('22222222-2222-2222-2222-222222222202', 'Sci-Fi & Fantasy', 'sci-fi-fantasy', v_fiction_id, 11),
        ('22222222-2222-2222-2222-222222222203', 'Mystery & Detective', 'mystery-detective', v_fiction_id, 12),
        ('22222222-2222-2222-2222-222222222204', 'Historical Fiction', 'historical-fiction', v_fiction_id, 13)
    ON CONFLICT (id) DO NOTHING;

    -- Subcategories: Non-Fiction
    INSERT INTO public.categories (id, name, slug, parent_id, sort_order) VALUES
        ('22222222-2222-2222-2222-222222222205', 'History & Warfare', 'history-warfare', v_nonfiction_id, 20),
        ('22222222-2222-2222-2222-222222222206', 'Philosophy & Ideas', 'philosophy-ideas', v_nonfiction_id, 21),
        ('22222222-2222-2222-2222-222222222207', 'Computer Science & Tech', 'computer-science-tech', v_nonfiction_id, 22),
        ('22222222-2222-2222-2222-222222222208', 'Biography & Memoir', 'biography-memoir', v_nonfiction_id, 23)
    ON CONFLICT (id) DO NOTHING;

    -- Subcategories: Rare
    INSERT INTO public.categories (id, name, slug, parent_id, sort_order) VALUES
        ('22222222-2222-2222-2222-222222222209', 'First Editions', 'first-editions', v_rare_id, 30),
        ('22222222-2222-2222-2222-222222222210', 'Signed & Inscribed', 'signed-inscribed', v_rare_id, 31)
    ON CONFLICT (id) DO NOTHING;
END $$;

-- 2. Mock User Profiles for Vendors, Admins, and Buyers
INSERT INTO public.profiles (id, full_name, role) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Alice Marketplace Admin', 'admin'),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Arthur Hastings (Old Paper Mill)', 'vendor'),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Clara Oswald (Beacon Hill Books)', 'vendor'),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'David Scholar (Academic Exchange)', 'buyer'),
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Emily Reader (Book Collector)', 'buyer')
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role;

-- 3. Mock Vendors
INSERT INTO public.vendors (id, owner_id, shop_name, slug, description, status, commission_bps, shipping_fee_minor) VALUES
    (
        '33333333-3333-3333-3333-333333333301',
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        'The Old Paper Mill',
        'the-old-paper-mill',
        'Purveyors of rare, vintage, and antiquarian books since 1984. Specializing in first editions and signed classics.',
        'approved',
        1000, -- 10%
        500   -- $5.00 flat shipping
    ),
    (
        '33333333-3333-3333-3333-333333333302',
        'cccccccc-cccc-cccc-cccc-cccccccccccc',
        'Beacon Hill Bookshop',
        'beacon-hill-books',
        'An independent neighbourhood bookshop curating exceptional literary fiction, philosophy, and modern classics.',
        'approved',
        1000, -- 10%
        399   -- $3.99 flat shipping
    ),
    (
        '33333333-3333-3333-3333-333333333303',
        'dddddddd-dddd-dddd-dddd-dddddddddddd',
        'Academic Book Exchange',
        'academic-exchange',
        'University textbooks, scholarly monographs, and computer science references in like-new and good conditions.',
        'pending', -- Pending vendor application
        1000,
        450
    )
ON CONFLICT (id) DO UPDATE SET
    shop_name = EXCLUDED.shop_name,
    slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    status = EXCLUDED.status;

-- 4. Mock Books Catalog
INSERT INTO public.books (id, vendor_id, title, author, isbn, description, category_id, condition, price_minor, currency, stock, status) VALUES
    -- Books from Vendor 1: The Old Paper Mill (Approved)
    (
        '44444444-4444-4444-4444-444444444401',
        '33333333-3333-3333-3333-333333333301',
        'Dune (First Edition Reproduction)',
        'Frank Herbert',
        '9780441172719',
        'Classic science fiction masterpiece with embossed spine, pristine dust jacket, and archival preservation sleeve.',
        '22222222-2222-2222-2222-222222222202',
        'like_new',
        4500, -- $45.00
        'USD',
        4,
        'active'
    ),
    (
        '44444444-4444-4444-4444-444444444402',
        '33333333-3333-3333-3333-333333333301',
        'The Great Gatsby (1953 Scribner Printing)',
        'F. Scott Fitzgerald',
        '9780743273565',
        'Early printing of Fitzgerald''s tragic portrait of the Jazz Age. Minor shelf wear on corner cloth, interior unmarked.',
        '22222222-2222-2222-2222-222222222201',
        'good',
        6500, -- $65.00
        'USD',
        1,
        'active'
    ),
    (
        '44444444-4444-4444-4444-444444444403',
        '33333333-3333-3333-3333-333333333301',
        'Meditations (Hardcover Clothbound)',
        'Marcus Aurelius',
        '9780140449334',
        'Personal writings of the Roman Emperor translated by Gregory Hays. Gilt lettering on crimson cloth.',
        '22222222-2222-2222-2222-222222222206',
        'new',
        2800, -- $28.00
        'USD',
        8,
        'active'
    ),
    (
        '44444444-4444-4444-4444-444444444404',
        '33333333-3333-3333-3333-333333333301',
        'The Adventures of Sherlock Holmes',
        'Arthur Conan Doyle',
        '9780141034355',
        'Vintage edition containing the 12 original Baker Street mysteries with classic Sidney Paget illustrations.',
        '22222222-2222-2222-2222-222222222203',
        'fair',
        1850, -- $18.50
        'USD',
        3,
        'active'
    ),
    -- Books from Vendor 2: Beacon Hill Bookshop (Approved)
    (
        '44444444-4444-4444-4444-444444444405',
        '33333333-3333-3333-3333-333333333302',
        'Designing Data-Intensive Applications',
        'Martin Kleppmann',
        '9781449373320',
        'The definitive handbook on distributed systems, storage engines, stream processing, and data reliability.',
        '22222222-2222-2222-2222-222222222207',
        'new',
        4200, -- $42.00
        'USD',
        12,
        'active'
    ),
    (
        '44444444-4444-4444-4444-444444444406',
        '33333333-3333-3333-3333-333333333302',
        'Neuromancer',
        'William Gibson',
        '9780441569595',
        'The seminal cyberpunk classic that won the Hugo, Nebula, and Philip K. Dick awards.',
        '22222222-2222-2222-2222-222222222202',
        'like_new',
        1600, -- $16.00
        'USD',
        5,
        'active'
    ),
    (
        '44444444-4444-4444-4444-444444444407',
        '33333333-3333-3333-3333-333333333302',
        'Structure and Interpretation of Computer Programs',
        'Harold Abelson, Gerald Jay Sussman',
        '9780262510875',
        'MIT Press classic text on computer programming and computational problem-solving using Scheme.',
        '22222222-2222-2222-2222-222222222207',
        'good',
        5500, -- $55.00
        'USD',
        2,
        'active'
    ),
    (
        '44444444-4444-4444-4444-444444444408',
        '33333333-3333-3333-3333-333333333302',
        'One Hundred Years of Solitude',
        'Gabriel García Márquez',
        '9780060883287',
        'The brilliant multi-generational story of the Buendía family in the fictional town of Macondo.',
        '22222222-2222-2222-2222-222222222201',
        'like_new',
        2100, -- $21.00
        'USD',
        7,
        'active'
    )
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    price_minor = EXCLUDED.price_minor,
    stock = EXCLUDED.stock,
    status = EXCLUDED.status;

-- 5. Mock Book Images (R2 Keys)
INSERT INTO public.book_images (book_id, r2_key, position) VALUES
    ('44444444-4444-4444-4444-444444444401', 'books/dune-cover-1.webp', 0),
    ('44444444-4444-4444-4444-444444444401', 'books/dune-spine-2.webp', 1),
    ('44444444-4444-4444-4444-444444444402', 'books/gatsby-1953.webp', 0),
    ('44444444-4444-4444-4444-444444444403', 'books/meditations-cloth.webp', 0),
    ('44444444-4444-4444-4444-444444444405', 'books/ddia-oreilly.webp', 0),
    ('44444444-4444-4444-4444-444444444406', 'books/neuromancer-cover.webp', 0),
    ('44444444-4444-4444-4444-444444444407', 'books/sicp-mit.webp', 0),
    ('44444444-4444-4444-4444-444444444408', 'books/marquez-solitude.webp', 0)
ON CONFLICT DO NOTHING;

-- 6. Mock Completed Order & Verified Review
DO $$
DECLARE
    v_sample_order_id UUID := '55555555-5555-5555-5555-555555555501';
    v_buyer_id UUID := 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'; -- Emily Reader
    v_book_id UUID := '44444444-4444-4444-4444-444444444405'; -- DDIA book
    v_vendor_id UUID := '33333333-3333-3333-3333-333333333302'; -- Beacon Hill
BEGIN
    -- Create paid order
    INSERT INTO public.orders (
        id, buyer_id, subtotal_minor, shipping_minor, total_minor,
        currency, status, payment_status, payment_provider, shipping_address
    ) VALUES (
        v_sample_order_id,
        v_buyer_id,
        4200,
        399,
        4599,
        'USD',
        'completed',
        'paid',
        'mock',
        '{"name": "Emily Reader", "street": "42 Beacon St", "city": "Boston", "state": "MA", "zip": "02108"}'::jsonb
    ) ON CONFLICT (id) DO NOTHING;

    -- Create order item
    INSERT INTO public.order_items (
        order_id, book_id, vendor_id, qty, unit_price_minor,
        commission_bps, commission_amount_minor, fulfillment_status, tracking_number
    ) VALUES (
        v_sample_order_id,
        v_book_id,
        v_vendor_id,
        1,
        4200,
        1000,
        420,
        'delivered',
        'USPS9400111899223344556677'
    ) ON CONFLICT DO NOTHING;

    -- Create verified buyer review
    INSERT INTO public.reviews (
        book_id, buyer_id, rating, body
    ) VALUES (
        v_book_id,
        v_buyer_id,
        5,
        'Arrived in pristine condition exactly as described. One of the best software engineering books ever written!'
    ) ON CONFLICT (book_id, buyer_id) DO NOTHING;
END $$;
