-- =========================================================================
-- Supabase Marketplace Seed Data (Categories, Vendors, Books, Reviews)
-- Dedicated to RTDS Platform & Bangladeshi Book Marketplace (Currency: BDT)
-- =========================================================================

-- 1. Create Core Categories Hierarchy
DO $$
DECLARE
    v_admission_id UUID := '11111111-1111-1111-1111-111111111103';
    v_academic_id UUID := '11111111-1111-1111-1111-111111111106';
    v_fiction_id UUID := '11111111-1111-1111-1111-111111111101';
    v_nonfiction_id UUID := '11111111-1111-1111-1111-111111111102';
    v_rare_id UUID := '11111111-1111-1111-1111-111111111104';
    v_islamic_id UUID := '11111111-1111-1111-1111-111111111105';
BEGIN
    -- Parent Categories
    INSERT INTO public.categories (id, name, slug, parent_id, sort_order) VALUES
        (v_admission_id, 'মেডিকেল ও ভর্তি সহায়িকা', 'medical-engineering-admission', NULL, 1),
        (v_academic_id, 'এইচএসসি ও এসএসসি', 'academic-hsc-ssc', NULL, 2),
        (v_fiction_id, 'উপন্যাস ও সাহিত্য', 'fiction-literature', NULL, 3),
        (v_nonfiction_id, 'বিজ্ঞান ও প্রযুক্তি', 'computer-science-engineering', NULL, 4),
        (v_islamic_id, 'ইসলামি সাহিত্য ও ধর্মদর্শন', 'islamic-theological', NULL, 5),
        (v_rare_id, 'দুষ্প্রাপ্য ও পুরাতন ক্লাসিক', 'rare-collectibles', NULL, 6)
    ON CONFLICT (id) DO NOTHING;

    -- Subcategories: Admission & Academic
    INSERT INTO public.categories (id, name, slug, parent_id, sort_order) VALUES
        ('22222222-2222-2222-2222-222222222203', 'মেডিকেল ভর্তি প্রশ্নব্যাংক ও হ্যান্ডবুক', 'medical-question-banks', v_admission_id, 10),
        ('22222222-2222-2222-2222-222222222204', 'প্রকৌশল ও বিশ্ববিদ্যালয় ভর্তি', 'engineering-varsity', v_admission_id, 11)
    ON CONFLICT (id) DO NOTHING;

    -- Subcategories: Fiction
    INSERT INTO public.categories (id, name, slug, parent_id, sort_order) VALUES
        ('22222222-2222-2222-2222-222222222201', 'ধ্রুপদী বাংলা সাহিত্য', 'bangla-classics', v_fiction_id, 20),
        ('22222222-2222-2222-2222-222222222202', 'সায়েন্স ফিকশন ও ফ্যান্টাসি', 'sci-fi-fantasy', v_fiction_id, 21)
    ON CONFLICT (id) DO NOTHING;

    -- Subcategories: Tech & Science
    INSERT INTO public.categories (id, name, slug, parent_id, sort_order) VALUES
        ('22222222-2222-2222-2222-222222222207', 'কম্পিউটার সায়েন্স ও প্রোগ্রামিং', 'computer-science-tech', v_nonfiction_id, 30),
        ('22222222-2222-2222-2222-222222222206', 'দর্শন ও চিন্তাধারা', 'philosophy-ideas', v_nonfiction_id, 31)
    ON CONFLICT (id) DO NOTHING;
END $$;

-- 2. Mock Auth Users & User Profiles for Vendors, Admins, and Buyers
INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin@rtds.com.bd', crypt('Admin@12345', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"RTDS Platform Administrator"}', now(), now()),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'vendor1@rtds.com.bd', crypt('Vendor@12345', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"RTDS Central Depot Manager"}', now(), now()),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'vendor2@rtds.com.bd', crypt('Vendor@12345', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Banglabazar Boi Bhaban Officer"}', now(), now()),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'vendor3@rtds.com.bd', crypt('Vendor@12345', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nilkhet Book Corner"}', now(), now()),
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'buyer@rtds.com.bd', crypt('Buyer@12345', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Tahmid Hasan (Medical Aspirant)"}', now(), now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.profiles (id, full_name, role) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'RTDS Platform Administrator', 'admin'),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'RTDS Central Depot Manager', 'vendor'),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Banglabazar Boi Bhaban Officer', 'vendor'),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Nilkhet Book Corner', 'vendor'),
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Tahmid Hasan (Medical Aspirant)', 'buyer')
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role;

-- 3. Mock Vendors (Dedicated to RTDS & Bangladeshi Book Markets)
INSERT INTO public.vendors (id, owner_id, shop_name, slug, description, status, commission_bps, shipping_fee_minor) VALUES
    (
        '33333333-3333-3333-3333-333333333301',
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        'RTDS Publications Central Depot',
        'rtds-publications-depot',
        'Official central warehouse of RTDS Platform. Dedicated publisher of Medical Master Series, high-yield question banks, and complete admission guides.',
        'approved',
        1000, -- 10%
        7000  -- ৳ 70.00 flat courier shipping
    ),
    (
        '33333333-3333-3333-3333-333333333302',
        'cccccccc-cccc-cccc-cccc-cccccccccccc',
        'Banglabazar Boi Bhaban',
        'banglabazar-boi-bhaban',
        'Dhaka Banglabazar premier independent bookhub specializing in Bengali classics, history, literature, and rare first editions.',
        'approved',
        1000, -- 10%
        7000  -- ৳ 70.00 flat courier shipping
    ),
    (
        '33333333-3333-3333-3333-333333333303',
        'dddddddd-dddd-dddd-dddd-dddddddddddd',
        'Nilkhet Engineering Corner',
        'nilkhet-engineering-corner',
        'Nilkhet Dhaka specialized supplier for CSE textbooks, electrical engineering, competitive programming, and algorithm references.',
        'approved',
        1000,
        7000
    )
ON CONFLICT (id) DO UPDATE SET
    shop_name = EXCLUDED.shop_name,
    slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    status = EXCLUDED.status;

-- 4. Mock Books Catalog (Currency: BDT)
INSERT INTO public.books (id, vendor_id, title, author, isbn, description, category_id, condition, price_minor, currency, stock, status) VALUES
    -- Books from Vendor 1: RTDS Publications Depot
    (
        '44444444-4444-4444-4444-444444444409',
        '33333333-3333-3333-3333-333333333301',
        'RTDS Master Physics: Medical & Engineering Question Bank',
        'RTDS Editorial Board',
        '9789849281144',
        'Comprehensive question bank with chapter-wise shortcut formulas, past 20 years medical admission solutions, and model test papers.',
        '22222222-2222-2222-2222-222222222203',
        'new',
        65000, -- ৳ 650.00
        'BDT',
        40,
        'active'
    ),
    (
        '44444444-4444-4444-4444-444444444410',
        '33333333-3333-3333-3333-333333333301',
        'RTDS Medical Master Biology: Final Revision Set',
        'Dr. Hasan & RTDS Faculty Team',
        '9789849281199',
        'Complete medical biology handbook, high-yield diagrams, and memory mnemonics for medical admission test candidates.',
        '22222222-2222-2222-2222-222222222203',
        'new',
        58000, -- ৳ 580.00
        'BDT',
        50,
        'active'
    ),
    (
        '44444444-4444-4444-4444-444444444411',
        '33333333-3333-3333-3333-333333333301',
        'RTDS Chemistry Formula & Admission Shortcut Handbook',
        'Dr. Mahbub & RTDS Team',
        '9789849281151',
        'Organic and inorganic reactions, periodic trends, and shortcut numerical problem-solving formulas for competitive tests.',
        '22222222-2222-2222-2222-222222222203',
        'new',
        48000, -- ৳ 480.00
        'BDT',
        35,
        'active'
    ),
    -- Books from Vendor 2: Banglabazar Boi Bhaban
    (
        '44444444-4444-4444-4444-444444444401',
        '33333333-3333-3333-3333-333333333302',
        'Dune (Deluxe Hardcover Collector''s Edition)',
        'Frank Herbert',
        '9780441172719',
        'Archival clothbound edition of the seminal science fiction masterpiece with full-color map inserts and gilded edges.',
        '22222222-2222-2222-2222-222222222202',
        'new',
        125000, -- ৳ 1,250.00
        'BDT',
        6,
        'active'
    ),
    (
        '44444444-4444-4444-4444-444444444412',
        '33333333-3333-3333-3333-333333333302',
        'লালসালু (Lalsalu - Heritage Hardcover)',
        'সৈয়দ ওয়ালীউল্লাহ (Syed Waliullah)',
        '9789844120341',
        'বাংলা সাহিত্যের কালজয়ী উপন্যাস। উন্নত মুদ্রণ ও বাঁধাইকৃত বিশেষ সংস্করণ।',
        '22222222-2222-2222-2222-222222222201',
        'new',
        26000, -- ৳ 260.00
        'BDT',
        25,
        'active'
    ),
    (
        '44444444-4444-4444-4444-444444444403',
        '33333333-3333-3333-3333-333333333302',
        'Meditations (Crimson Clothbound)',
        'Marcus Aurelius',
        '9780140449334',
        'Stoic philosophy and royal personal reflections translated with critical notes and biographical preface.',
        '22222222-2222-2222-2222-222222222206',
        'new',
        45000, -- ৳ 450.00
        'BDT',
        12,
        'active'
    ),
    -- Books from Vendor 3: Nilkhet Engineering Corner
    (
        '44444444-4444-4444-4444-444444444405',
        '33333333-3333-3333-3333-333333333303',
        'Designing Data-Intensive Applications',
        'Martin Kleppmann',
        '9781449373320',
        'The definitive handbook on distributed systems, storage engines, stream processing, and data reliability.',
        '22222222-2222-2222-2222-222222222207',
        'new',
        85000, -- ৳ 850.00
        'BDT',
        18,
        'active'
    ),
    (
        '44444444-4444-4444-4444-444444444407',
        '33333333-3333-3333-3333-333333333303',
        'Structure and Interpretation of Computer Programs (SICP)',
        'Harold Abelson, Gerald Jay Sussman',
        '9780262510875',
        'MIT Press classic text on computer programming and computational problem-solving using Scheme.',
        '22222222-2222-2222-2222-222222222207',
        'good',
        92000, -- ৳ 920.00
        'BDT',
        4,
        'active'
    )
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    price_minor = EXCLUDED.price_minor,
    currency = EXCLUDED.currency,
    stock = EXCLUDED.stock,
    status = EXCLUDED.status;

-- 5. Mock Book Images (R2 Keys)
INSERT INTO public.book_images (book_id, r2_key, position) VALUES
    ('44444444-4444-4444-4444-444444444409', 'https://covers.openlibrary.org/b/isbn/9780134988689-L.jpg', 0),
    ('44444444-4444-4444-4444-444444444410', 'https://covers.openlibrary.org/b/isbn/9780134093413-L.jpg', 0),
    ('44444444-4444-4444-4444-444444444411', 'https://covers.openlibrary.org/b/isbn/9780073402680-L.jpg', 0),
    ('44444444-4444-4444-4444-444444444401', 'https://covers.openlibrary.org/b/isbn/9780441172719-L.jpg', 0),
    ('44444444-4444-4444-4444-444444444412', 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=800', 0),
    ('44444444-4444-4444-4444-444444444403', 'https://covers.openlibrary.org/b/isbn/9780140449334-L.jpg', 0),
    ('44444444-4444-4444-4444-444444444405', 'https://covers.openlibrary.org/b/isbn/9781449373320-L.jpg', 0),
    ('44444444-4444-4444-4444-444444444407', 'https://covers.openlibrary.org/b/isbn/9780262510875-L.jpg', 0),
    ('44444444-4444-4444-4444-444444444413', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800', 0),
    ('44444444-4444-4444-4444-444444444414', 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800', 0),
    ('44444444-4444-4444-4444-444444444415', 'https://covers.openlibrary.org/b/isbn/9780984782857-L.jpg', 0),
    ('44444444-4444-4444-4444-444444444416', 'https://covers.openlibrary.org/b/isbn/9780060555665-L.jpg', 0)
ON CONFLICT DO NOTHING;

-- 6. Mock Completed Order & Verified Review (BDT)
DO $$
DECLARE
    v_sample_order_id UUID := '55555555-5555-5555-5555-555555555501';
    v_buyer_id UUID := 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'; -- Tahmid Hasan
    v_book_id UUID := '44444444-4444-4444-4444-444444444410'; -- RTDS Biology
    v_vendor_id UUID := '33333333-3333-3333-3333-333333333301'; -- RTDS Depot
BEGIN
    -- Create paid order (58000 + 7000 shipping = 65000 paisa / ৳ 650)
    INSERT INTO public.orders (
        id, buyer_id, subtotal_minor, shipping_minor, total_minor,
        currency, status, payment_status, payment_provider, shipping_address
    ) VALUES (
        v_sample_order_id,
        v_buyer_id,
        58000,
        7000,
        65000,
        'BDT',
        'completed',
        'paid',
        'bkash',
        '{"name": "Tahmid Hasan", "phone": "01712345678", "street": "Road 4, Sector 11, Uttara", "city": "Dhaka", "division": "Dhaka", "postcode": "1230"}'::jsonb
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
        58000,
        1000,
        5800,
        'delivered',
        'STEADFAST-BD-948271'
    ) ON CONFLICT DO NOTHING;

    -- Create verified buyer review
    INSERT INTO public.reviews (
        book_id, buyer_id, rating, body
    ) VALUES (
        v_book_id,
        v_buyer_id,
        5,
        'অরিজিনাল RTDS প্রকাশনীর বই পেয়েছি। মেডিকেল ভর্তি পরীক্ষার জন্য হাই-ইল্ড ডায়াগ্রাম এবং বিগত বছরের ব্যাখ্যামূলক প্রশ্নোত্তরগুলো অসাধারণ!'
    ) ON CONFLICT (book_id, buyer_id) DO NOTHING;
END $$;
