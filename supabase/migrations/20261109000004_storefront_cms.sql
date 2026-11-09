-- =========================================================================
-- Migration: 20261109000004_storefront_cms.sql
-- Description: Storefront Customization System (CMS) for RTDS Bookshop Admin
-- =========================================================================

-- 1. Create storefront_settings table (singleton configuration)
CREATE TABLE IF NOT EXISTS public.storefront_settings (
    id VARCHAR(32) PRIMARY KEY DEFAULT 'global',
    site_name TEXT NOT NULL DEFAULT 'RTDS Bookshop',
    tagline TEXT DEFAULT 'Official Book Marketplace of RTDS Platform',
    announcement_text TEXT DEFAULT '⚡ সারা দেশে ক্যাশ অন ডেলিভারি | ৳১,০০০ টাকার অর্ডারে ফ্রি ডেলিভারি',
    announcement_enabled BOOLEAN NOT NULL DEFAULT true,
    helpline_phone VARCHAR(30) DEFAULT '০৯৬১২-০০৭৮৩৭',
    helpline_hours VARCHAR(50) DEFAULT 'সকাল ৯টা - রাত ১০টা',
    free_shipping_threshold_minor INTEGER NOT NULL DEFAULT 100000, -- ৳ 1,000 in paisa
    flat_shipping_rate_minor INTEGER NOT NULL DEFAULT 7000,        -- ৳ 70 in paisa
    emergency_alert TEXT,
    emergency_alert_enabled BOOLEAN NOT NULL DEFAULT false,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 2. Create hero_slides table (dynamic campaign slider)
CREATE TABLE IF NOT EXISTS public.hero_slides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle TEXT,
    badge_text VARCHAR(60),
    cta_text VARCHAR(40) NOT NULL DEFAULT 'বইয়ের তালিকা দেখুন',
    cta_link TEXT NOT NULL DEFAULT '/books',
    image_r2_key TEXT,
    bg_gradient VARCHAR(100) DEFAULT 'from-emerald-800 via-emerald-700 to-teal-800',
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 3. Create curated_shelves table (dynamic homepage sections)
CREATE TABLE IF NOT EXISTS public.curated_shelves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle TEXT,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    shelf_type VARCHAR(30) NOT NULL DEFAULT 'custom', -- 'bestseller', 'admission_special', 'literature_rare', 'custom'
    icon_name VARCHAR(30) NOT NULL DEFAULT 'BookOpen',
    max_items INTEGER NOT NULL DEFAULT 8,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Indexes for fast storefront reads
CREATE INDEX IF NOT EXISTS idx_hero_slides_active_order ON public.hero_slides(is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_curated_shelves_active_order ON public.curated_shelves(is_active, sort_order);

-- Apply updated_at trigger
DROP TRIGGER IF EXISTS trg_storefront_settings_updated_at ON public.storefront_settings;
CREATE TRIGGER trg_storefront_settings_updated_at
    BEFORE UPDATE ON public.storefront_settings
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_hero_slides_updated_at ON public.hero_slides;
CREATE TRIGGER trg_hero_slides_updated_at
    BEFORE UPDATE ON public.hero_slides
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_curated_shelves_updated_at ON public.curated_shelves;
CREATE TRIGGER trg_curated_shelves_updated_at
    BEFORE UPDATE ON public.curated_shelves
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

ALTER TABLE public.storefront_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curated_shelves ENABLE ROW LEVEL SECURITY;

-- storefront_settings: Public read, Admin write
DROP POLICY IF EXISTS "Storefront settings viewable by everyone" ON public.storefront_settings;
CREATE POLICY "Storefront settings viewable by everyone"
    ON public.storefront_settings FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admins manage storefront settings" ON public.storefront_settings;
CREATE POLICY "Admins manage storefront settings"
    ON public.storefront_settings FOR ALL
    USING (public.is_admin());

-- hero_slides: Public read active, Admin read/write all
DROP POLICY IF EXISTS "Active hero slides viewable by public" ON public.hero_slides;
CREATE POLICY "Active hero slides viewable by public"
    ON public.hero_slides FOR SELECT
    USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins manage hero slides" ON public.hero_slides;
CREATE POLICY "Admins manage hero slides"
    ON public.hero_slides FOR ALL
    USING (public.is_admin());

-- curated_shelves: Public read active, Admin read/write all
DROP POLICY IF EXISTS "Active curated shelves viewable by public" ON public.curated_shelves;
CREATE POLICY "Active curated shelves viewable by public"
    ON public.curated_shelves FOR SELECT
    USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins manage curated shelves" ON public.curated_shelves;
CREATE POLICY "Admins manage curated shelves"
    ON public.curated_shelves FOR ALL
    USING (public.is_admin());

-- =========================================================================
-- INITIAL SEED FOR STOREFRONT CMS
-- =========================================================================

-- Seed global settings
INSERT INTO public.storefront_settings (
    id, site_name, tagline, announcement_text, announcement_enabled,
    helpline_phone, helpline_hours, free_shipping_threshold_minor, flat_shipping_rate_minor
) VALUES (
    'global',
    'RTDS Bookshop',
    'Official Book Marketplace of RTDS Platform',
    '⚡ সারা দেশে ক্যাশ অন ডেলিভারি | ৳১,০০০ টাকার অর্ডারে ফ্রি ডেলিভারি',
    true,
    '০৯৬১২-০০৭৮৩৭',
    'সকাল ৯টা - রাত ১০টা',
    100000,
    7000
) ON CONFLICT (id) DO NOTHING;

-- Seed default hero campaign slide
INSERT INTO public.hero_slides (
    id, title, subtitle, badge_text, cta_text, cta_link, bg_gradient, sort_order, is_active
) VALUES (
    '66666666-6666-6666-6666-666666666601',
    'মেডিকেল, প্রকৌশল ও একাডেমিক বইয়ের বিশ্বস্ত মার্কেটপ্লেস',
    'RTDS মেডিকেল মাস্টার সিরিজ, ইঞ্জিনিয়ারিং ভর্তি সহায়িকা, একাডেমিক গাইড এবং সাহিত্য এক কার্টে অর্ডার করুন সরাসরি নির্ভরযোগ্য প্রকাশক ও বুকশপ থেকে।',
    'RTDS জাতীয় বইমেলা ও ভর্তি উৎসব ২০২৬',
    'বইয়ের তালিকা দেখুন (Catalog)',
    '/books',
    'from-emerald-800 via-emerald-700 to-teal-800',
    0,
    true
) ON CONFLICT (id) DO NOTHING;

-- Seed default curated shelves
INSERT INTO public.curated_shelves (
    id, title, subtitle, shelf_type, icon_name, max_items, sort_order, is_active
) VALUES
    (
        '77777777-7777-7777-7777-777777777701',
        'সর্বাধিক বিক্রিত বইসমূহ (Trending Bestsellers)',
        'দেশজুড়ে হাজারো পাঠকের পছন্দের তালিকায় থাকা সেরা বইসমূহ',
        'bestseller',
        'Flame',
        4,
        0,
        true
    ),
    (
        '77777777-7777-7777-7777-777777777702',
        'মেডিকেল ও বিশ্ববিদ্যালয় ভর্তি প্রস্তুতি (RTDS Master Series)',
        'RTDS অফিসিয়াল প্রশ্নব্যাংক, শর্টকাট টেকনিক ও পূর্ণাঙ্গ মডেল টেস্ট পেপার',
        'admission_special',
        'GraduationCap',
        4,
        1,
        true
    ),
    (
        '77777777-7777-7777-7777-777777777703',
        'সাহিত্য, দর্শন ও ধ্রুপদী সংগ্রহ (Literature & Classics)',
        'ধ্রুপদী বাংলা উপন্যাস, নোবেলজয়ী আন্তর্জাতিক সাহিত্য ও সংগ্রাহকদের বিশেষ বাঁধাইকৃত সংস্করণ',
        'literature_rare',
        'Sparkles',
        4,
        2,
        true
    )
ON CONFLICT (id) DO NOTHING;
