export interface CartItem {
  bookId: string;
  vendorId: string;
  vendorName: string;
  vendorSlug: string;
  title: string;
  author: string;
  priceMinor: number;
  currency: string;
  condition: string;
  stock: number;
  coverUrl: string;
  shippingFeeMinor?: number;
  qty: number;
}

export interface VendorCartGroup {
  vendorId: string;
  vendorName: string;
  vendorSlug: string;
  shippingFeeMinor: number;
  items: CartItem[];
  subtotalMinor: number;
}

export interface CartCalculations {
  itemsCount: number;
  subtotalMinor: number;
  shippingTotalMinor: number;
  totalMinor: number;
  isFreeShipping: boolean;
  freeShippingRemainingMinor: number;
  groups: VendorCartGroup[];
}

export interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeItem: (bookId: string) => void;
  updateQuantity: (bookId: string, qty: number) => void;
  clearCart: () => void;
  getItem: (bookId: string) => CartItem | undefined;
  calculations: CartCalculations;
  isLoaded: boolean;
}
