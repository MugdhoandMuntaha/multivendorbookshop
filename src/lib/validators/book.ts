import { z } from "zod";

export const bookConditionEnum = z.enum(["new", "like_new", "good", "fair"]);
export const bookStatusEnum = z.enum(["draft", "active", "archived"]);

export const bookSchema = z.object({
  title: z
    .string()
    .min(2, "Book title must be at least 2 characters")
    .max(200, "Book title cannot exceed 200 characters"),
  author: z
    .string()
    .min(2, "Author name must be at least 2 characters")
    .max(100, "Author name cannot exceed 100 characters"),
  isbn: z
    .string()
    .max(20, "ISBN cannot exceed 20 characters")
    .optional()
    .or(z.literal("")),
  description: z
    .string()
    .min(10, "Please provide at least a brief 10-character description")
    .max(3000, "Description cannot exceed 3000 characters"),
  categoryId: z.string().uuid("Please select a valid category"),
  condition: bookConditionEnum,
  price: z.number().min(0.01, "Price must be greater than zero"),
  stock: z
    .number()
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative"),
  status: bookStatusEnum,
  images: z
    .array(
      z.object({
        r2_key: z.string().min(1),
        position: z.number().int(),
      })
    )
    .min(1, "At least one book cover image is required"),
});

export type BookInput = z.infer<typeof bookSchema>;
