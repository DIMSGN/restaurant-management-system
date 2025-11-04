import { prisma } from '../../config/database';
import { Recipe, Prisma } from '@prisma/client';

export class RecipeRepository {
  // Create recipe with ingredients
  async create(data: Prisma.RecipeCreateInput): Promise<Recipe> {
    return await prisma.recipe.create({
      data,
      include: {
        ingredients: {
          include: {
            product: {
              include: {
                unit: true,
              },
            },
          },
        },
      },
    });
  }

  // Find all recipes with pagination
  async findAll(filters: {
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ recipes: Recipe[]; total: number }> {
    const { search, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.RecipeWhereInput = {};
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    const [recipes, total] = await Promise.all([
      prisma.recipe.findMany({
        where,
        include: {
          ingredients: {
            include: {
              product: {
                include: {
                  unit: true,
                },
              },
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.recipe.count({ where }),
    ]);

    return { recipes, total };
  }

  // Find by ID
  async findById(id: number): Promise<Recipe | null> {
    return await prisma.recipe.findUnique({
      where: { id },
      include: {
        ingredients: {
          include: {
            product: {
              include: {
                unit: true,
                category: true,
              },
            },
          },
        },
      },
    });
  }

  // Update recipe
  async update(id: number, data: Prisma.RecipeUpdateInput): Promise<Recipe> {
    return await prisma.recipe.update({
      where: { id },
      data,
      include: {
        ingredients: {
          include: {
            product: {
              include: {
                unit: true,
              },
            },
          },
        },
      },
    });
  }

  // Delete recipe
  async delete(id: number): Promise<Recipe> {
    return await prisma.recipe.delete({
      where: { id },
    });
  }

  // Delete all ingredients for a recipe
  async deleteIngredients(recipeId: number): Promise<void> {
    await prisma.recipeIngredient.deleteMany({
      where: { recipeId },
    });
  }

  // Add ingredients to recipe
  async addIngredients(
    recipeId: number,
    ingredients: { productId: number; amount: number }[]
  ): Promise<void> {
    await prisma.recipeIngredient.createMany({
      data: ingredients.map((ing) => ({
        recipeId,
        productId: ing.productId,
        amount: ing.amount,
      })),
    });
  }
}
