import { notFound } from "next/navigation";
import { requireRole } from "@/server/queries/auth";
import {
  getCurrentVendor,
  getVendorBookById,
  getCategories,
} from "@/server/queries/vendor";
import { BookForm } from "@/components/features/vendor/book-form";

interface EditBookPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditBookPage({ params }: EditBookPageProps) {
  const { id } = await params;
  await requireRole(["vendor", "admin"], `/vendor/books/${id}/edit`);
  const vendor = await getCurrentVendor();

  if (!vendor) {
    notFound();
  }

  const [book, categories] = await Promise.all([
    getVendorBookById(vendor.id, id),
    getCategories(),
  ]);

  if (!book) {
    notFound();
  }

  const initialData = {
    id: book.id,
    title: book.title,
    author: book.author,
    isbn: book.isbn || "",
    description: book.description || "",
    categoryId: book.category_id,
    condition: book.condition,
    price: book.price_minor / 100,
    stock: book.stock,
    status: book.status,
    images: (book.book_images || []).map((img, idx) => ({
      r2_key: img.r2_key,
      position: img.position ?? idx,
    })),
  };

  return (
    <div className="space-y-6">
      <BookForm
        initialData={initialData}
        categories={categories}
        isEditing={true}
      />
    </div>
  );
}
