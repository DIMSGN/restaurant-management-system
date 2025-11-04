import { ProductRepository } from './product.repository';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { NotFoundError, ValidationError } from '../../shared/errors';
import { Product } from '@prisma/client';

export class ProductService {
  private repository: ProductRepository;

  constructor() {
    this.repository = new ProductRepository();
  }

  async createProduct(dto: CreateProductDto): Promise<Product> {
    // Business logic validation
    if (new Date(dto.expirationDate) <= new Date(dto.receivedDate)) {
      throw new ValidationError('Expiration date must be after received date');
    }

    // Additional validations
    if (dto.price <= dto.purchasePrice) {
      throw new ValidationError('Sale price must be higher than purchase price');
    }

    if (dto.minimumStock > dto.amount) {
      throw new ValidationError('Minimum stock cannot be greater than current amount');
    }

    return await this.repository.create({
      name: dto.name,
      amount: dto.amount,
      price: dto.price,
      purchasePrice: dto.purchasePrice,
      receivedDate: new Date(dto.receivedDate),
      expirationDate: new Date(dto.expirationDate),
      minimumStock: dto.minimumStock,
      unit: { connect: { id: dto.unitId } },
      category: { connect: { id: dto.categoryId } },
    });
  }

  async getAllProducts(filters: {
    categoryId?: number;
    unitId?: number;
    page?: number;
    limit?: number;
  }) {
    return await this.repository.findAll(filters);
  }

  async getProductById(id: number): Promise<Product> {
    const product = await this.repository.findById(id);
    if (!product) {
      throw new NotFoundError(`Product with ID ${id} not found`);
    }
    return product;
  }

  async updateProduct(id: number, dto: UpdateProductDto): Promise<Product> {
    // Check if product exists
    await this.getProductById(id);

    const updateData: any = {};
    if (dto.name) updateData.name = dto.name;
    if (dto.amount !== undefined) updateData.amount = dto.amount;
    if (dto.price) updateData.price = dto.price;
    if (dto.purchasePrice) updateData.purchasePrice = dto.purchasePrice;
    if (dto.receivedDate) updateData.receivedDate = new Date(dto.receivedDate);
    if (dto.expirationDate) updateData.expirationDate = new Date(dto.expirationDate);
    if (dto.minimumStock !== undefined) updateData.minimumStock = dto.minimumStock;
    if (dto.unitId) updateData.unit = { connect: { id: dto.unitId } };
    if (dto.categoryId) updateData.category = { connect: { id: dto.categoryId } };

    return await this.repository.update(id, updateData);
  }

  async deleteProduct(id: number): Promise<void> {
    await this.getProductById(id);
    await this.repository.delete(id);
  }

  async getLowStockProducts(): Promise<Product[]> {
    return await this.repository.findLowStock();
  }
}
