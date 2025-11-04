import { z } from 'zod';

// Create Product DTO
export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(255),
  unitId: z.number().int().positive('Unit ID must be positive'),
  categoryId: z.number().int().positive('Category ID must be positive'),
  amount: z.number().nonnegative('Amount must be non-negative').default(0),
  price: z.number().positive('Price must be positive').optional(),
  purchasePrice: z.number().positive('Purchase price must be positive').optional(),
  receivedDate: z.string().datetime().or(z.date()),
  expirationDate: z.string().datetime().or(z.date()),
  minimumStock: z.number().nonnegative('Minimum stock must be non-negative').default(0),
});

// Update Product DTO
export const updateProductSchema = createProductSchema.partial();

// Query/Filter DTO
export const productQuerySchema = z.object({
  categoryId: z.string().optional().transform(Number),
  unitId: z.string().optional().transform(Number),
  minStock: z.string().optional().transform(Number),
  page: z.string().optional().default('1').transform(Number),
  limit: z.string().optional().default('10').transform(Number),
});

export type CreateProductDto = z.infer<typeof createProductSchema>;
export type UpdateProductDto = z.infer<typeof updateProductSchema>;
export type ProductQueryDto = z.infer<typeof productQuerySchema>;
