import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RTDS Bookshop - Admin Control Center",
  description:
    "Executive administration and storefront customization suite for RTDS Platform book marketplace.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn">
      <body className="min-h-screen bg-[oklch(0.985_0.006_155)] font-sans antialiased text-slate-800">
        {children}
      </body>
    </html>
  );
}

