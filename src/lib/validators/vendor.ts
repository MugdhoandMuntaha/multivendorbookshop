import { z } from "zod";

export const vendorApplySchema = z.object({
  shopName: z
    .string()
    .min(2, "Shop name must be at least 2 characters")
    .max(60, "Shop name cannot exceed 60 characters"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(50, "Slug cannot exceed 50 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers, and single hyphens (e.g. my-bookshop)"
    ),
  description: z
    .string()
    .min(10, "Please provide at least 10 characters describing your bookshop")
    .max(500, "Description cannot exceed 500 characters"),
  shippingFee: z.number().min(0, "Shipping fee cannot be negative"),
  phone: z
    .string()
    .min(10, "Valid phone number is required")
    .max(15, "Phone number is too long"),
  logoKey: z.string().optional(),
  bannerKey: z.string().optional(),
});

export type VendorApplyInput = z.infer<typeof vendorApplySchema>;

export const vendorProfileSchema = z.object({
  shopName: z.string().min(2).max(60),
  description: z.string().min(10).max(500),
  shippingFee: z.number().min(0),
  logoKey: z.string().optional(),
  bannerKey: z.string().optional(),
});

export type VendorProfileInput = z.infer<typeof vendorProfileSchema>;
