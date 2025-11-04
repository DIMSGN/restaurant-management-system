import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user (strong password: Admin@123)
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {
      passwordHash: adminPassword,
      role: UserRole.ADMIN,
    },
    create: {
      username: 'admin',
      passwordHash: adminPassword,
      role: UserRole.ADMIN,
    },
  });
  console.log('✅ Admin user created:', admin.username, '(password: Admin@123)');

  // Create waiter user (strong password: Waiter@123)
  const waiterPassword = await bcrypt.hash('Waiter@123', 10);
  const waiter = await prisma.user.upsert({
    where: { username: 'waiter' },
    update: {
      passwordHash: waiterPassword,
      role: UserRole.WAITER,
    },
    create: {
      username: 'waiter',
      passwordHash: waiterPassword,
      role: UserRole.WAITER,
    },
  });
  console.log('✅ Waiter user created:', waiter.username, '(password: Waiter@123)');

  // Create sample units
  const kgUnit = await prisma.unit.upsert({
    where: { name: 'kg' },
    update: {},
    create: { name: 'kg', conversionFactor: 1.0 },
  });

  const literUnit = await prisma.unit.upsert({
    where: { name: 'L' },
    update: {},
    create: { name: 'L', conversionFactor: 1.0 },
  });

  const pieceUnit = await prisma.unit.upsert({
    where: { name: 'piece' },
    update: {},
    create: { name: 'piece', conversionFactor: 1.0 },
  });

  console.log('✅ Units created: kg, L, piece');

  // Create sample categories
  const foodCategory = await prisma.category.upsert({
    where: { name: 'Food' },
    update: {},
    create: { name: 'Food', description: 'Food items' },
  });

  const drinkCategory = await prisma.category.upsert({
    where: { name: 'Drinks' },
    update: {},
    create: { name: 'Drinks', description: 'Beverages' },
  });

  console.log('✅ Categories created: Food, Drinks');

  // Create sample products
  await prisma.product.create({
    data: {
      name: 'Tomatoes',
      unitId: kgUnit.id,
      categoryId: foodCategory.id,
      amount: 50,
      price: 3.5,
      purchasePrice: 2.0,
      receivedDate: new Date(),
      expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      minimumStock: 10,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Olive Oil',
      unitId: literUnit.id,
      categoryId: foodCategory.id,
      amount: 20,
      price: 12.0,
      purchasePrice: 8.0,
      receivedDate: new Date(),
      expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      minimumStock: 5,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Coca Cola',
      unitId: pieceUnit.id,
      categoryId: drinkCategory.id,
      amount: 100,
      price: 2.5,
      purchasePrice: 1.2,
      receivedDate: new Date(),
      expirationDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months
      minimumStock: 20,
    },
  });

  console.log('✅ Sample products created');

  console.log('✨ Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
