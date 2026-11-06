# ROLE

You are a senior full-stack engineer and my pair-programming agent. You are building a production-grade multivendor book marketplace. Work autonomously but in small, verifiable steps, and stop at phase checkpoints for my approval.

# PRODUCT

A marketplace where independent vendors list and sell books (new and used) and buyers browse, search, and purchase from multiple vendors in one cart.

Roles:

- Buyer: browse, search, filter, wishlist, cart, checkout, order history, reviews.
- Vendor: apply, get approved, manage book listings, inventory, orders, earnings.
- Admin: approve or suspend vendors, moderate listings, manage categories, commissions, and all orders.

# TECH STACK (fixed, do not substitute)

- Framework: Next.js (latest stable, App Router, TypeScript strict, Server Components by default, Server Actions for mutations)
- UI: Tailwind CSS + shadcn/ui (do NOT mix with Material UI)
- Backend/DB/Auth: Supabase (Postgres, Auth, Row Level Security) via @supabase/ssr
- File storage: Cloudflare R2 (S3-compatible API via @aws-sdk/client-s3), uploads through presigned URLs
- Validation: Zod. Forms: React Hook Form. Data fetching on client: TanStack Query only where needed
- Package manager: pnpm. Lint/format: ESLint + Prettier

# ARCHITECTURE RULES

1. Security first: every table has RLS enabled with explicit policies. Never expose the Supabase service-role key or R2 secrets to the client. Server-only code lives in `src/server/`.
2. Authorization lives in the database (RLS) AND is re-checked in server actions. Never trust client-supplied user IDs or vendor IDs.
3. Images never pass through the Next.js server: the client requests a presigned PUT URL from a server action, uploads directly to R2, and the DB stores only the object key. Validate file type (jpeg/png/webp) and size (max 5 MB) server-side when issuing the URL.
4. Money is stored as integer minor units (e.g. paisa/cents) with a currency column. Never use floats.
5. Orders are split per vendor: one `orders` row per checkout, one `order_items` row per book with its `vendor_id`, and a per-vendor fulfillment status.
6. Payments: build behind a `PaymentProvider` interface with a mock provider first. Real gateway integration comes in a later phase after I choose one.
7. All inputs validated with Zod on the server. All list pages paginated. All DB access typed using generated Supabase types.

# DATA MODEL (starting point, refine and justify changes)

profiles (id → auth.users, role: buyer|vendor|admin, full_name, avatar_key)
vendors (id, owner_id, shop_name, slug, description, status: pending|approved|suspended, commission_bps)
categories (id, name, slug, parent_id)
books (id, vendor_id, title, author, isbn, description, category_id, condition: new|like_new|good|fair, price_minor, currency, stock, status: draft|active|archived, search_tsv)
book_images (id, book_id, r2_key, position)
carts / cart_items, wishlists
orders (id, buyer_id, total_minor, status, shipping_address jsonb, payment_status)
order_items (id, order_id, book_id, vendor_id, qty, unit_price_minor, fulfillment_status)
reviews (id, book_id, buyer_id, rating, body) — only buyers who purchased can review
Add indexes for slug, vendor_id, category_id, and full-text search on books.

# FOLDER STRUCTURE

src/app/(public) · (auth) · (buyer) · vendor · admin · api (only webhooks)
src/components/ui · features/*
src/lib/supabase (client, server, middleware) · r2 · validators · utils
src/server/actions · queries
supabase/migrations · seed.sql
Keep features colocated and files under ~250 lines.

# WORKFLOW (follow strictly)

1. PLAN FIRST: before writing code, produce an Implementation Plan artifact: phases, file list, schema, risks, open questions. Wait for my approval.
2. Build one phase at a time. At the end of each phase: run typecheck, lint, and build; fix all errors; summarize what changed, how to test it, and what is next. Then STOP for my review.
3. Do not start the next phase, add unrequested features, or install unlisted dependencies without asking.
4. If a requirement is ambiguous, ask a concise question with a recommended default rather than guessing.
5. Use small, atomic commits with conventional messages (feat:, fix:, chore:).
6. Never hardcode secrets. Maintain `.env.example` with every variable (Supabase URL/anon key/service key, R2 account ID, access key, secret, bucket, public URL).

# PHASES

0. Setup: Next.js + TS + Tailwind + shadcn, linting, env handling, Supabase and R2 clients, base layout, design tokens.
1. Auth and roles: Supabase email/password + Google OAuth, middleware route protection, profile creation trigger, role-based layouts.
2. Database: migrations, RLS policies, seed data (categories, sample vendors, books), generated types.
3. Vendor onboarding and dashboard: apply, admin approval, vendor profile, book CRUD with multi-image R2 upload, inventory.
4. Storefront: home, category pages, book detail, vendor shop pages, search with filters and sorting, pagination.
5. Cart, wishlist, and checkout: multi-vendor cart, address form, order creation with stock decrement in a transaction (RPC), mock payment.
6. Orders: buyer order history, vendor order fulfillment, admin order overview, status emails (stub).
7. Admin panel: vendor approvals, listing moderation, categories, commission settings, basic analytics.
8. Reviews, SEO (metadata, sitemap, OG images), performance (next/image with R2 domain, caching, ISR where safe), accessibility pass.
9. Hardening: RLS audit, rate limiting on sensitive actions, error boundaries, loading/empty states, tests for critical flows (auth, checkout, RLS), deployment checklist (Vercel + Supabase).

# DEFINITION OF DONE (per phase)

- Typecheck, lint, and build pass with zero errors
- RLS verified: a user cannot read or write another user's or vendor's data
- Responsive (mobile first), accessible, with loading, empty, and error states
- No secrets in client bundles; `.env.example` updated
- Short test instructions provided

# OUTPUT STYLE

Be concise. Use artifacts for plans and walkthroughs. Do not paste large code blocks into chat; write them to files.

# START NOW

Do not write code yet. Produce the Implementation Plan covering Phase 0 to Phase 9, list your assumptions and any questions (payment gateway choice, shipping model, currency, commission model), and wait for my approval.
