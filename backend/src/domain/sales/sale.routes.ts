import { Router, Response } from 'express';
import { SaleService } from './sale.service';
import { asyncHandler } from '../../shared/asyncHandler';
import { authenticate, AuthRequest } from '../../shared/authMiddleware';
import { createSaleSchema, saleQuerySchema } from './sale.dto';

const router = Router();
const saleService = new SaleService();

// GET /api/sales - Get all sales
router.get(
  '/',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const query = saleQuerySchema.parse(req.query);
    const { sales, total } = await saleService.getAllSales(query);

    res.json({
      status: 'success',
      data: sales,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    });
  })
);

// GET /api/sales/stats - Get sales statistics
router.get(
  '/stats',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { startDate, endDate } = req.query;
    const stats = await saleService.getSalesStats(
      startDate as string,
      endDate as string
    );

    res.json({
      status: 'success',
      data: stats,
    });
  })
);

// GET /api/sales/:id - Get sale by ID
router.get(
  '/:id',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const sale = await saleService.getSaleById(Number(req.params.id));
    res.json({
      status: 'success',
      data: sale,
    });
  })
);

// POST /api/sales - Record new sale (Admin & Waiter)
router.post(
  '/',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const dto = createSaleSchema.parse(req.body);
    const sale = await saleService.recordSale(dto, req.user!.id);

    res.status(201).json({
      status: 'success',
      message: 'Sale recorded successfully',
      data: sale,
    });
  })
);

export default router;
