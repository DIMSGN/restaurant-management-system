import { RecipeRepository } from './recipe.repository';
import { CreateRecipeDto, UpdateRecipeDto } from './recipe.dto';
import { NotFoundError, ValidationError } from '../../shared/errors';
import { Recipe } from '@prisma/client';
import { prisma } from '../../config/database';

export class RecipeService {
  private repository: RecipeRepository;

  constructor() {
    this.repository = new RecipeRepository();
  }

  async createRecipe(dto: CreateRecipeDto): Promise<any> {
    // Validate that all products exist
    for (const ingredient of dto.ingredients) {
      const product = await prisma.product.findUnique({
        where: { id: ingredient.productId },
      });
      if (!product) {
        throw new NotFoundError(`Product with ID ${ingredient.productId} not found`);
      }
    }

    // Create recipe with ingredients
    const recipe = await this.repository.create({
      name: dto.name,
      description: dto.description,
      salePrice: dto.salePrice,
      ingredients: {
        create: dto.ingredients.map((ing) => ({
          productId: ing.productId,
          amount: ing.amount,
        })),
      },
    });

    // Calculate cost
    const recipeWithCost = await this.calculateRecipeCost(recipe.id);
    return recipeWithCost;
  }

  async getAllRecipes(filters: {
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ recipes: any[]; total: number }> {
    const { recipes, total } = await this.repository.findAll(filters);

    // Add cost calculation to each recipe
    const recipesWithCost = await Promise.all(
      recipes.map(async (recipe) => {
        const cost = this.calculateCostFromIngredients(recipe);
        const profit = recipe.salePrice ? Number(recipe.salePrice) - cost : 0;
        return {
          ...recipe,
          cost,
          profit,
          profitMargin: recipe.salePrice ? (profit / Number(recipe.salePrice)) * 100 : 0,
        };
      })
    );

    return { recipes: recipesWithCost, total };
  }

  async getRecipeById(id: number): Promise<any> {
    const recipe = await this.repository.findById(id);
    if (!recipe) {
      throw new NotFoundError(`Recipe with ID ${id} not found`);
    }

    const cost = this.calculateCostFromIngredients(recipe);
    const profit = recipe.salePrice ? Number(recipe.salePrice) - cost : 0;

    return {
      ...recipe,
      cost,
      profit,
      profitMargin: recipe.salePrice ? (profit / Number(recipe.salePrice)) * 100 : 0,
    };
  }

  async updateRecipe(id: number, dto: UpdateRecipeDto): Promise<any> {
    // Check if recipe exists
    await this.getRecipeById(id);

    // If updating ingredients, validate products exist
    if (dto.ingredients) {
      for (const ingredient of dto.ingredients) {
        const product = await prisma.product.findUnique({
          where: { id: ingredient.productId },
        });
        if (!product) {
          throw new NotFoundError(`Product with ID ${ingredient.productId} not found`);
        }
      }

      // Delete old ingredients and add new ones
      await this.repository.deleteIngredients(id);
      await this.repository.addIngredients(id, dto.ingredients);
    }

    // Update recipe basic info
    const updateData: any = {};
    if (dto.name) updateData.name = dto.name;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.salePrice) updateData.salePrice = dto.salePrice;

    const recipe = await this.repository.update(id, updateData);

    // Return with cost calculation
    return await this.calculateRecipeCost(recipe.id);
  }

  async deleteRecipe(id: number): Promise<void> {
    await this.getRecipeById(id);
    await this.repository.delete(id);
  }

  // Helper: Calculate cost from recipe ingredients
  private calculateCostFromIngredients(recipe: any): number {
    if (!recipe.ingredients || recipe.ingredients.length === 0) {
      return 0;
    }

    return recipe.ingredients.reduce((total: number, ingredient: any) => {
      const productCost = ingredient.product.purchasePrice || 0;
      const ingredientCost = Number(productCost) * Number(ingredient.amount);
      return total + ingredientCost;
    }, 0);
  }

  // Helper: Get recipe with cost calculation
  private async calculateRecipeCost(recipeId: number): Promise<any> {
    const recipe = await this.repository.findById(recipeId);
    if (!recipe) {
      throw new NotFoundError(`Recipe with ID ${recipeId} not found`);
    }

    const cost = this.calculateCostFromIngredients(recipe);
    const profit = recipe.salePrice ? Number(recipe.salePrice) - cost : 0;

    return {
      ...recipe,
      cost,
      profit,
      profitMargin: recipe.salePrice ? (profit / Number(recipe.salePrice)) * 100 : 0,
    };
  }
}
