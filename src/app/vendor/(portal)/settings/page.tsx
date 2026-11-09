import { notFound } from "next/navigation";
import { requireRole } from "@/server/queries/auth";
import { getCurrentVendor } from "@/server/queries/vendor";
import { VendorSettingsForm } from "@/components/features/vendor/settings-form";

export default async function VendorSettingsPage() {
  await requireRole(["vendor", "admin"], "/vendor/settings");
  const vendor = await getCurrentVendor();

  if (!vendor) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Shop Settings</h1>
        <p className="text-muted-foreground text-sm">
          Manage your storefront profile, shipping policies, and store
          information.
        </p>
      </div>

      <VendorSettingsForm
        initialData={{
          shopName: vendor.shop_name,
          description: vendor.description || "",
          shippingFee: vendor.shipping_fee_minor / 100,
          logoKey: vendor.logo_key,
          bannerKey: vendor.banner_key,
        }}
      />
    </div>
  );
}
