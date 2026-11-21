export interface WishlistItem {
  bookId: string;
  vendorId?: string;
  vendorName: string;
  vendorSlug: string;
  title: string;
  author: string;
  priceMinor: number;
  currency: string;
  condition: string;
  stock: number;
  coverUrl: string;
  addedAt: string;
}

export interface WishlistContextType {
  items: WishlistItem[];
  toggleWishlist: (item: Omit<WishlistItem, "addedAt">) => void;
  removeItem: (bookId: string) => void;
  isWishlisted: (bookId: string) => boolean;
  clearWishlist: () => void;
  isLoaded: boolean;
}
