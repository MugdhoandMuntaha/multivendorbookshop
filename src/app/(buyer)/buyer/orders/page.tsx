import { getBuyerOrders } from "@/server/queries/orders";
import { BuyerOrdersClient } from "@/components/orders/buyer-orders-client";

export const metadata = {
  title: "Order History & Tracking | RTDS Bookshop Platform",
  description:
    "Track your multi-vendor book orders, courier consignments, and download receipts.",
};

export default async function BuyerOrdersPage() {
  const orders = await getBuyerOrders();

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <BuyerOrdersClient initialOrders={orders} />
    </div>
  );
}
