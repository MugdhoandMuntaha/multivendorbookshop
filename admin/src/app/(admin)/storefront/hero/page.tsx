import { getHeroSlidesAdmin } from "@/server/queries/admin";
import { HeroManager } from "@/components/storefront/hero-manager";

export default async function AdminHeroSlidesPage() {
  const slides = await getHeroSlidesAdmin();

  return (
    <div className="space-y-6">
      <HeroManager initialSlides={slides} />
    </div>
  );
}

