import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Shopping Cart</h1>
      <div className="space-y-4 rounded-2xl border border-dashed p-12 text-center">
        <ShoppingBag className="text-muted-foreground mx-auto h-12 w-12" />
        <h2 className="text-xl font-semibold">Your cart is empty</h2>
        <p className="text-muted-foreground mx-auto max-w-sm text-sm">
          Explore independent booksellers and add titles to your unified cart.
        </p>
        <Link href="/">
          <Button className="mt-2">Browse Books</Button>
        </Link>
      </div>
    </div>
  );
}
