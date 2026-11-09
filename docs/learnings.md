# Project Learnings & Architecture Conventions

## Framework & Tooling Conventions

1. **Next.js 16 Proxy Convention**:
   - The file convention `middleware.ts` is deprecated in Next.js 16. Use `src/proxy.ts` exporting `export async function proxy(request: NextRequest)` and `export const config = { matcher: [...] }`.
2. **Prerender & Dynamic Rules**:
   - Do not call `new Date()` without memoization or pass dynamic runtime functions in statically prerendered shells.
   - Any layout accessing `cookies()` directly must either wrap the dynamic boundary in `<Suspense>` or live in a route that permits dynamic streaming.

## Security & Data Rules

1. **Integer Minor Units**:
   - Never store money as floats. Always store integer minor units (`price_minor`, `shipping_fee_minor`, `subtotal_minor`, `total_minor`, `commission_amount_minor`).
2. **Strict Row Level Security (RLS)**:
   - Every single table in Postgres has RLS enabled with explicit policies.
   - Cross-tenant data isolation: Vendors can only view their own inventory and their own portion of order items. Buyers can only access their own cart and orders.
   - Reviews require verified purchase verification (`payment_status = 'paid'`).
3. **Direct-to-R2 Storage**:
   - Next.js server never accepts binary file streams.
   - The client requests presigned PUT URLs validated by server actions (MIME types, max 5MB size limit), uploads directly to Cloudflare R2, and persists only the object key.
4. **Atomic Concurrency (RPC)**:
   - Order creation and inventory decrement must execute via `create_order_atomic` with `SELECT ... FOR UPDATE` locks to prevent overselling of rare/single-copy books.
