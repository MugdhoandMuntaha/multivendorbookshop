import { getStorefrontSettingsAdmin } from "@/server/queries/admin";
import { AnnouncementForm } from "@/components/storefront/announcement-form";

export default async function AdminAnnouncementPage() {
  const settings = await getStorefrontSettingsAdmin();

  return (
    <div className="space-y-6">
      <AnnouncementForm initialSettings={settings} />
    </div>
  );
}
