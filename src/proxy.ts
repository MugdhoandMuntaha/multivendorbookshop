import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Next.js 16 Proxy Boundary (formerly middleware.ts)
 * Intercepts requests, refreshes auth tokens, and enforces role-based route protection.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { supabaseResponse, user, supabase } = await updateSession(request);

  // Define route classifications
  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password");

  const isBuyerRoute =
    pathname.startsWith("/buyer") ||
    pathname.startsWith("/cart") ||
    pathname.startsWith("/checkout");

  const isVendorRoute = pathname.startsWith("/vendor");
  const isVendorApplyRoute = pathname === "/vendor/apply";
  const isAdminRoute = pathname.startsWith("/admin");

  // 1. If user is already authenticated and visits auth pages, redirect home
  if (isAuthRoute && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // 2. Buyer routes require an authenticated session
  if (isBuyerRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // 3. Vendor and Admin routes require role inspection
  if ((isVendorRoute || isAdminRoute) && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // If visiting vendor or admin area, fetch profile role
  if (user && (isVendorRoute || isAdminRoute)) {
    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const profile = data as { role?: string } | null;
    const role = profile?.role || "buyer";

    // Admin routes require admin role
    if (isAdminRoute && role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    // Vendor dashboard routes require vendor or admin role (allow /vendor/apply for all logged-in users)
    if (
      isVendorRoute &&
      !isVendorApplyRoute &&
      role !== "vendor" &&
      role !== "admin"
    ) {
      const url = request.nextUrl.clone();
      url.pathname = "/vendor/apply";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static assets)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon)
     * - public asset extensions (.svg, .png, .jpg, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
