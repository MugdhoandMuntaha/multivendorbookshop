import { Metadata } from "next";
import { WishlistView } from "@/components/features/wishlist/wishlist-view";

export const metadata: Metadata = {
  title: "My Wishlist | RTDS Bookshop",
  description: "View and manage your saved books on RTDS Bookshop.",
};

export default function BuyerWishlistPage() {
  return <WishlistView />;
}
