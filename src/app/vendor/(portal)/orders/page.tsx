import { requireUser } from "@/server/queries/auth";
import { getCurrentVendor } from "@/server/queries/vendor";
import { getVendorOrderItems } from "@/server/queries/orders";
import { VendorOrdersClient } from "@/components/vendor/vendor-orders-client";

export const metadata = {
  title: "Vendor Order Fulfillment | RTDS Bookshop Platform",
  description:
    "Manage multi-vendor order packaging, courier consignment tracking, and net merchant earnings.",
};

export default async function VendorOrdersPage() {
  await requireUser("/vendor/orders");
  const vendor = await getCurrentVendor();
  const orderItems = await getVendorOrderItems(vendor?.id);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <VendorOrdersClient
        initialItems={orderItems}
        vendorShopName={vendor?.shop_name || "Verified Bookstore"}
      />
    </div>
  );
}
