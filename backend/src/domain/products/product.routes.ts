import { Router, Response } from 'express';
import { ProductService } from './product.service';
import { asyncHandler } from '../../shared/asyncHandler';
import { authenticate, authorize, AuthRequest } from '../../shared/authMiddleware';
import { createProductSchema, updateProductSchema, productQuerySchema } from './product.dto';
import { UserRole } from '@prisma/client';

const router = Router();
const productService = new ProductService();

// GET /api/products - Get all products (with filters)
router.get(
  '/',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const query = productQuerySchema.parse(req.query);
    const { products, total } = await productService.getAllProducts(query);

    res.json({
      status: 'success',
      data: products,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    });
  })
);

// GET /api/products/low-stock - Get low stock products
router.get(
  '/low-stock',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const products = await productService.getLowStockProducts();
    res.json({
      status: 'success',
      data: products,
    });
  })
);

// GET /api/products/:id - Get product by ID
router.get(
  '/:id',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const product = await productService.getProductById(Number(req.params.id));
    res.json({
      status: 'success',
      data: product,
    });
  })
);

// POST /api/products - Create new product (Admin only)
router.post(
  '/',
  authenticate,
  authorize(UserRole.ADMIN),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const dto = createProductSchema.parse(req.body);
    const product = await productService.createProduct(dto);
    res.status(201).json({
      status: 'success',
      message: 'Product created successfully',
      data: product,
    });
  })
);

// PATCH /api/products/:id - Update product (Admin only)
router.patch(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const dto = updateProductSchema.parse(req.body);
    const product = await productService.updateProduct(Number(req.params.id), dto);
    res.json({
      status: 'success',
      message: 'Product updated successfully',
      data: product,
    });
  })
);

// DELETE /api/products/:id - Delete product (Admin only)
router.delete(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    await productService.deleteProduct(Number(req.params.id));
    res.json({
      status: 'success',
      message: 'Product deleted successfully',
    });
  })
);

export default router;
