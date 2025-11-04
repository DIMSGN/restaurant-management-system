import { Router, Response } from 'express';
import { RecipeService } from './recipe.service';
import { asyncHandler } from '../../shared/asyncHandler';
import { authenticate, authorize, AuthRequest } from '../../shared/authMiddleware';
import { createRecipeSchema, updateRecipeSchema, recipeQuerySchema } from './recipe.dto';
import { UserRole } from '@prisma/client';

const router = Router();
const recipeService = new RecipeService();

// GET /api/recipes - Get all recipes
router.get(
  '/',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const query = recipeQuerySchema.parse(req.query);
    const { recipes, total } = await recipeService.getAllRecipes(query);

    res.json({
      status: 'success',
      data: recipes,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    });
  })
);

// GET /api/recipes/:id - Get recipe by ID
router.get(
  '/:id',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const recipe = await recipeService.getRecipeById(Number(req.params.id));
    res.json({
      status: 'success',
      data: recipe,
    });
  })
);

// POST /api/recipes - Create new recipe (Admin only)
router.post(
  '/',
  authenticate,
  authorize(UserRole.ADMIN),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const dto = createRecipeSchema.parse(req.body);
    const recipe = await recipeService.createRecipe(dto);
    res.status(201).json({
      status: 'success',
      message: 'Recipe created successfully',
      data: recipe,
    });
  })
);

// PATCH /api/recipes/:id - Update recipe (Admin only)
router.patch(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const dto = updateRecipeSchema.parse(req.body);
    const recipe = await recipeService.updateRecipe(Number(req.params.id), dto);
    res.json({
      status: 'success',
      message: 'Recipe updated successfully',
      data: recipe,
    });
  })
);

// DELETE /api/recipes/:id - Delete recipe (Admin only)
router.delete(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    await recipeService.deleteRecipe(Number(req.params.id));
    res.json({
      status: 'success',
      message: 'Recipe deleted successfully',
    });
  })
);

export default router;
