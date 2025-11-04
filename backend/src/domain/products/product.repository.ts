import { prisma } from '../../config/database';
import { Prisma, Product } from '@prisma/client';

export class ProductRepository {
  // Create
  async create(data: Prisma.ProductCreateInput): Promise<Product> {
    return await prisma.product.create({
      data,
      include: {
        unit: true,
        category: true,
      },
    });
  }

  // Find all with pagination and filters
  async findAll(filters: {
    categoryId?: number;
    unitId?: number;
    page?: number;
    limit?: number;
  }): Promise<{ products: Product[]; total: number }> {
    const { categoryId, unitId, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};
    if (categoryId) where.categoryId = categoryId;
    if (unitId) where.unitId = unitId;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          unit: true,
          category: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    return { products, total };
  }

  // Find by ID
  async findById(id: number): Promise<Product | null> {
    return await prisma.product.findUnique({
      where: { id },
      include: {
        unit: true,
        category: true,
        rules: true,
      },
    });
  }

  // Update
  async update(id: number, data: Prisma.ProductUpdateInput): Promise<Product> {
    return await prisma.product.update({
      where: { id },
      data,
      include: {
        unit: true,
        category: true,
      },
    });
  }

  // Delete
  async delete(id: number): Promise<Product> {
    return await prisma.product.delete({
      where: { id },
    });
  }

  // Find low stock products
  async findLowStock(): Promise<Product[]> {
    // Get all products and filter where amount <= minimumStock
    const allProducts = await prisma.product.findMany({
      include: {
        unit: true,
        category: true,
      },
    });

    // Filter products with low stock
    return allProducts.filter(
      (product) => Number(product.amount) <= Number(product.minimumStock)
    );
  }
}
