import { getAdminVendors } from "@/server/queries/admin";
import { VendorsManager } from "@/components/governance/vendors-manager";

export default async function AdminVendorsPage() {
  const vendors = await getAdminVendors();

  return (
    <div className="space-y-6">
      <VendorsManager initialVendors={vendors} />
    </div>
  );
}

