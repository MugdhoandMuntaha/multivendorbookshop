import { Metadata } from "next";
import { CartView } from "@/components/features/cart/cart-view";

export const metadata: Metadata = {
  title: "Shopping Cart | RTDS Bookshop",
  description:
    "Review and manage books in your multi-vendor cart across verified publishers and booksellers in Bangladesh.",
};

export default function CartPage() {
  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      <CartView />
    </div>
  );
}
