import {
  getCuratedShelvesAdmin,
  getCategoriesAdmin,
} from "@/server/queries/admin";
import { ShelvesManager } from "@/components/storefront/shelves-manager";

export default async function AdminCuratedShelvesPage() {
  const [shelves, categories] = await Promise.all([
    getCuratedShelvesAdmin(),
    getCategoriesAdmin(),
  ]);

  return (
    <div className="space-y-6">
      <ShelvesManager initialShelves={shelves} categories={categories} />
    </div>
  );
}

