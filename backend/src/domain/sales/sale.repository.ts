import { prisma } from '../../config/database';
import { Sale, Prisma } from '@prisma/client';

export class SaleRepository {
  // Create sale
  async create(data: Prisma.SaleCreateInput): Promise<Sale> {
    return await prisma.sale.create({
      data,
      include: {
        recipe: true,
        product: true,
        user: {
          select: {
            id: true,
            username: true,
            role: true,
          },
        },
      },
    });
  }

  // Find all sales with filters
  async findAll(filters: {
    startDate?: Date;
    endDate?: Date;
    category?: string;
    paymentMethod?: string;
    page?: number;
    limit?: number;
  }): Promise<{ sales: Sale[]; total: number }> {
    const { startDate, endDate, category, paymentMethod, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.SaleWhereInput = {};

    if (startDate || endDate) {
      where.saleDate = {};
      if (startDate) where.saleDate.gte = startDate;
      if (endDate) where.saleDate.lte = endDate;
    }

    if (category) where.category = category as any;
    if (paymentMethod) where.paymentMethod = paymentMethod as any;

    const [sales, total] = await Promise.all([
      prisma.sale.findMany({
        where,
        include: {
          recipe: true,
          product: true,
          user: {
            select: {
              id: true,
              username: true,
              role: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.sale.count({ where }),
    ]);

    return { sales, total };
  }

  // Find by ID
  async findById(id: number): Promise<Sale | null> {
    return await prisma.sale.findUnique({
      where: { id },
      include: {
        recipe: {
          include: {
            ingredients: {
              include: {
                product: true,
              },
            },
          },
        },
        product: true,
        user: {
          select: {
            id: true,
            username: true,
            role: true,
          },
        },
      },
    });
  }

  // Sales analytics
  async getSalesStats(startDate?: Date, endDate?: Date): Promise<any> {
    const where: Prisma.SaleWhereInput = {};
    if (startDate || endDate) {
      where.saleDate = {};
      if (startDate) where.saleDate.gte = startDate;
      if (endDate) where.saleDate.lte = endDate;
    }

    const stats = await prisma.sale.aggregate({
      where,
      _sum: {
        salePrice: true,
        costOfGoods: true,
        profit: true,
        quantitySold: true,
      },
      _avg: {
        salePrice: true,
        profit: true,
      },
      _count: true,
    });

    return stats;
  }

  // Sales by category
  async getSalesByCategory(startDate?: Date, endDate?: Date): Promise<any> {
    const where: Prisma.SaleWhereInput = {};
    if (startDate || endDate) {
      where.saleDate = {};
      if (startDate) where.saleDate.gte = startDate;
      if (endDate) where.saleDate.lte = endDate;
    }

    return await prisma.sale.groupBy({
      by: ['category'],
      where,
      _sum: {
        salePrice: true,
        profit: true,
        quantitySold: true,
      },
      _count: true,
    });
  }
}
