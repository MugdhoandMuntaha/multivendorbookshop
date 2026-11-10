"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sliders,
  Image as ImageIcon,
  Bell,
  Layers,
  Users,
  BookOpen,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    group: "Overview",
    items: [
      {
        href: "/",
        label: "Dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    group: "Storefront CMS",
    items: [
      {
        href: "/storefront/hero",
        label: "Hero Slides",
        icon: ImageIcon,
      },
      {
        href: "/storefront/announcement",
        label: "Announcement & Helpline",
        icon: Bell,
      },
      {
        href: "/storefront/shelves",
        label: "Homepage Shelves",
        icon: Layers,
      },
    ],
  },
  {
    group: "Marketplace Governance",
    items: [
      {
        href: "/vendors",
        label: "Vendors & Commission",
        icon: Users,
      },
      {
        href: "/books",
        label: "Book Catalog Moderation",
        icon: BookOpen,
      },
      {
        href: "/orders",
        label: "Orders & Logistics",
        icon: ShoppingBag,
      },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const storefrontUrl =
    process.env.NEXT_PUBLIC_STOREFRONT_URL || "http://localhost:3000";

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-emerald-100/80 bg-white/90 shadow-sm backdrop-blur-md">
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-3 border-b border-emerald-100/80 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-base font-black tracking-tight text-slate-900">
            RTDS <span className="text-emerald-600">Admin</span>
          </span>
          <span className="text-[10px] font-semibold tracking-wider text-emerald-700 uppercase">
            Marketplace Control
          </span>
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 space-y-6 overflow-y-auto px-4 py-6">
        {NAV_ITEMS.map((section) => (
          <div key={section.group} className="space-y-1.5">
            <span className="px-3 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              {section.group}
            </span>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition-all",
                      isActive
                        ? "neo-pill-mint bg-emerald-50 text-emerald-800 font-bold shadow-xs"
                        : "text-slate-600 hover:bg-emerald-50/50 hover:text-emerald-700"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4",
                        isActive ? "text-emerald-700" : "text-slate-400"
                      )}
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Storefront Cross-link */}
      <div className="border-t border-emerald-100/80 p-4">
        <a
          href={storefrontUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="neo-button-light flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold"
        >
          <span>View Storefront</span>
          <ExternalLink className="h-3.5 w-3.5 text-emerald-600" />
        </a>
      </div>
    </aside>
  );
}
