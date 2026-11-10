import { getAdminBooks } from "@/server/queries/admin";
import { BooksManager } from "@/components/governance/books-manager";

export default async function AdminBooksPage() {
  const books = await getAdminBooks();

  return (
    <div className="space-y-6">
      <BooksManager initialBooks={books} />
    </div>
  );
}

