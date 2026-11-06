import { requireUser } from "@/server/queries/auth";

export default async function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser();
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">{children}</div>
  );
}
