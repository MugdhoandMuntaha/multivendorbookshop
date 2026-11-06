import { Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BuyerWishlistPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Saved Wishlist</h1>
      <div className="space-y-4 rounded-2xl border border-dashed p-12 text-center">
        <Heart className="text-muted-foreground mx-auto h-12 w-12" />
        <h2 className="text-xl font-semibold">Your wishlist is empty</h2>
        <p className="text-muted-foreground mx-auto max-w-sm text-sm">
          Save rare finds and upcoming reads to keep an eye on them.
        </p>
        <Link href="/">
          <Button className="mt-2">Discover Titles</Button>
        </Link>
      </div>
    </div>
  );
}
