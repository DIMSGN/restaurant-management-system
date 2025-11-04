import { z } from 'zod';
import { SaleCategory, PaymentMethod } from '@prisma/client';

// Create Sale DTO
export const createSaleSchema = z.object({
  recipeId: z.number().int().positive().optional(),
  productId: z.number().int().positive().optional(),
  quantitySold: z.number().positive('Quantity must be positive'),
  category: z.nativeEnum(SaleCategory).default(SaleCategory.food),
  paymentMethod: z.nativeEnum(PaymentMethod).default(PaymentMethod.cash),
  notes: z.string().max(255).optional(),
}).refine(
  (data) => data.recipeId || data.productId,
  { message: 'Either recipeId or productId must be provided' }
);

// Query DTO
export const saleQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  category: z.nativeEnum(SaleCategory).optional(),
  paymentMethod: z.nativeEnum(PaymentMethod).optional(),
  page: z.string().optional().default('1').transform(Number),
  limit: z.string().optional().default('10').transform(Number),
});

// Sales Report DTO
export const salesReportSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
  groupBy: z.enum(['day', 'category', 'payment']).optional().default('day'),
});

export type CreateSaleDto = z.infer<typeof createSaleSchema>;
export type SaleQueryDto = z.infer<typeof saleQuerySchema>;
export type SalesReportDto = z.infer<typeof salesReportSchema>;
