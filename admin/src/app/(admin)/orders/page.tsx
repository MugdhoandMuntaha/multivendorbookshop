import { getAdminOrders } from "@/server/queries/admin";
import { OrdersManager } from "@/components/governance/orders-manager";

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  return (
    <div className="space-y-6">
      <OrdersManager initialOrders={orders} />
    </div>
  );
}
