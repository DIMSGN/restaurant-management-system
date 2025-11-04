import { SaleRepository } from './sale.repository';
import { CreateSaleDto, SaleQueryDto } from './sale.dto';
import { NotFoundError, ValidationError } from '../../shared/errors';
import { prisma } from '../../config/database';
import { Sale } from '@prisma/client';

export class SaleService {
  private repository: SaleRepository;

  constructor() {
    this.repository = new SaleRepository();
  }

  async recordSale(dto: CreateSaleDto, userId: number): Promise<Sale> {
    // Use Prisma transaction with SERIALIZABLE isolation to prevent race conditions
    return await prisma.$transaction(async (tx) => {
      let totalCost = 0;
      let totalPrice = 0;

      // Case 1: Sale from Recipe
      if (dto.recipeId) {
        const recipe = await tx.recipe.findUnique({
          where: { id: dto.recipeId },
          include: {
            ingredients: {
              include: {
                product: true,
              },
            },
          },
        });

        if (!recipe) {
          throw new NotFoundError(`Recipe with ID ${dto.recipeId} not found`);
        }

        // Check stock availability for all ingredients
        for (const ingredient of recipe.ingredients) {
          const requiredAmount = Number(ingredient.amount) * dto.quantitySold;
          const availableAmount = Number(ingredient.product.amount);

          if (availableAmount < requiredAmount) {
            throw new ValidationError(
              `Insufficient stock for ${ingredient.product.name}. Required: ${requiredAmount}, Available: ${availableAmount}`
            );
          }
        }

        // Update stock for all ingredients
        for (const ingredient of recipe.ingredients) {
          const deductAmount = Number(ingredient.amount) * dto.quantitySold;
          
          await tx.product.update({
            where: { id: ingredient.productId },
            data: {
              amount: {
                decrement: deductAmount,
              },
            },
          });

          // Calculate cost
          const ingredientCost = Number(ingredient.product.purchasePrice || 0) * deductAmount;
          totalCost += ingredientCost;
        }

        totalPrice = Number(recipe.salePrice || 0) * dto.quantitySold;
      }

      // Case 2: Sale from Product directly
      if (dto.productId) {
        const product = await tx.product.findUnique({
          where: { id: dto.productId },
        });

        if (!product) {
          throw new NotFoundError(`Product with ID ${dto.productId} not found`);
        }

        const availableAmount = Number(product.amount);
        if (availableAmount < dto.quantitySold) {
          throw new ValidationError(
            `Insufficient stock for ${product.name}. Required: ${dto.quantitySold}, Available: ${availableAmount}`
          );
        }

        // Update stock
        await tx.product.update({
          where: { id: dto.productId },
          data: {
            amount: {
              decrement: dto.quantitySold,
            },
          },
        });

        totalCost = Number(product.purchasePrice || 0) * dto.quantitySold;
        totalPrice = Number(product.price || 0) * dto.quantitySold;
      }

      const profit = totalPrice - totalCost;

      // Create sale record
      const sale = await tx.sale.create({
        data: {
          recipeId: dto.recipeId,
          productId: dto.productId,
          userId,
          quantitySold: dto.quantitySold,
          saleDate: new Date(),
          salePrice: totalPrice,
          costOfGoods: totalCost,
          profit,
          category: dto.category,
          paymentMethod: dto.paymentMethod,
          notes: dto.notes,
        },
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

      return sale;
    }, {
      isolationLevel: 'Serializable', // Prevent concurrent sale race conditions
      maxWait: 5000, // Maximum time to wait for transaction to start (5 seconds)
      timeout: 10000, // Maximum time for transaction to complete (10 seconds)
    });
  }

  async getAllSales(filters: SaleQueryDto) {
    const queryFilters: any = {
      page: filters.page,
      limit: filters.limit,
    };

    if (filters.startDate) queryFilters.startDate = new Date(filters.startDate);
    if (filters.endDate) queryFilters.endDate = new Date(filters.endDate);
    if (filters.category) queryFilters.category = filters.category;
    if (filters.paymentMethod) queryFilters.paymentMethod = filters.paymentMethod;

    return await this.repository.findAll(queryFilters);
  }

  async getSaleById(id: number): Promise<Sale> {
    const sale = await this.repository.findById(id);
    if (!sale) {
      throw new NotFoundError(`Sale with ID ${id} not found`);
    }
    return sale;
  }

  async getSalesStats(startDate?: string, endDate?: string) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;

    const [stats, byCategory] = await Promise.all([
      this.repository.getSalesStats(start, end),
      this.repository.getSalesByCategory(start, end),
    ]);

    return {
      summary: {
        totalSales: stats._count,
        totalRevenue: Number(stats._sum.salePrice || 0),
        totalCost: Number(stats._sum.costOfGoods || 0),
        totalProfit: Number(stats._sum.profit || 0),
        averageSale: Number(stats._avg.salePrice || 0),
        averageProfit: Number(stats._avg.profit || 0),
        profitMargin:
          stats._sum.salePrice
            ? (Number(stats._sum.profit || 0) / Number(stats._sum.salePrice)) * 100
            : 0,
      },
      byCategory,
    };
  }
}
