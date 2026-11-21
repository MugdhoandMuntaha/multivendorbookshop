import { Suspense } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header, HeaderFallback } from "@/components/common/header";
import { Footer } from "@/components/common/footer";
import { getServerLocale } from "@/lib/i18n/server";
import { LanguageProvider } from "@/lib/i18n/context";
import { CartProvider } from "@/lib/cart/context";
import { WishlistProvider } from "@/lib/wishlist/context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | RTDS Bookshop",
    default: "RTDS Bookshop - Official Book Marketplace of RTDS Platform",
  },
  description:
    "Order RTDS Medical Master Series, Engineering Guides, Academic Textbooks, and Literature directly from verified publishers and bookshops.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getServerLocale();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="bg-background text-foreground flex min-h-full flex-col">
        <LanguageProvider initialLocale={locale}>
          <CartProvider>
            <WishlistProvider>
              <Suspense fallback={<HeaderFallback />}>
                <Header />
              </Suspense>
              <main className="flex-1">{children}</main>
              <Footer />
            </WishlistProvider>
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
