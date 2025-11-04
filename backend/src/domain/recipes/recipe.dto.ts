import { z } from 'zod';

// Create Recipe DTO
export const createRecipeSchema = z.object({
  name: z.string().min(1, 'Recipe name is required').max(255),
  description: z.string().optional(),
  salePrice: z.number().positive('Sale price must be positive'),
  ingredients: z.array(
    z.object({
      productId: z.number().int().positive('Product ID must be positive'),
      amount: z.number().positive('Amount must be positive'),
    })
  ).min(1, 'At least one ingredient is required'),
});

// Update Recipe DTO
export const updateRecipeSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  salePrice: z.number().positive().optional(),
  ingredients: z.array(
    z.object({
      productId: z.number().int().positive(),
      amount: z.number().positive(),
    })
  ).optional(),
});

// Query DTO
export const recipeQuerySchema = z.object({
  search: z.string().optional(),
  page: z.string().optional().default('1').transform(Number),
  limit: z.string().optional().default('10').transform(Number),
});

export type CreateRecipeDto = z.infer<typeof createRecipeSchema>;
export type UpdateRecipeDto = z.infer<typeof updateRecipeSchema>;
export type RecipeQueryDto = z.infer<typeof recipeQuerySchema>;
