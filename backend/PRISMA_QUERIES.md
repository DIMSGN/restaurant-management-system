# 🔍 Common Prisma Queries - Reference Guide

Quick reference για Prisma operations που θα χρειαστείς.

---

## 📖 Basic CRUD

### Create
```typescript
const product = await prisma.product.create({
  data: {
    name: 'Tomatoes',
    amount: 50,
    unit: { connect: { id: 1 } },        // Foreign key relation
    category: { connect: { id: 1 } },
  },
  include: {
    unit: true,      // Include related data
    category: true,
  },
});
```

### Find One
```typescript
const product = await prisma.product.findUnique({
  where: { id: 1 },
  include: {
    unit: true,
    category: true,
  },
});
```

### Find Many
```typescript
const products = await prisma.product.findMany({
  where: {
    categoryId: 1,
    amount: { gte: 10 },    // Greater than or equal
  },
  include: {
    unit: true,
    category: true,
  },
  orderBy: { createdAt: 'desc' },
  skip: 0,
  take: 10,
});
```

### Update
```typescript
const updated = await prisma.product.update({
  where: { id: 1 },
  data: {
    amount: 25,
    price: 5.99,
  },
});
```

### Delete
```typescript
await prisma.product.delete({
  where: { id: 1 },
});
```

---

## 🔗 Relations

### Create with Nested Relations
```typescript
// Create recipe WITH ingredients in one transaction
const recipe = await prisma.recipe.create({
  data: {
    name: 'Greek Salad',
    salePrice: 12.5,
    ingredients: {
      create: [
        { productId: 1, amount: 0.5 },  // Tomatoes
        { productId: 2, amount: 0.1 },  // Olive Oil
      ],
    },
  },
  include: {
    ingredients: {
      include: { product: true },
    },
  },
});
```

### Query with Relations
```typescript
const recipe = await prisma.recipe.findUnique({
  where: { id: 1 },
  include: {
    ingredients: {
      include: {
        product: {
          include: { unit: true },
        },
      },
    },
  },
});
```

---

## 🔢 Aggregations

### Count
```typescript
const count = await prisma.product.count({
  where: { categoryId: 1 },
});
```

### Sum, Avg, Min, Max
```typescript
const stats = await prisma.sale.aggregate({
  where: { saleDate: { gte: new Date('2024-01-01') } },
  _sum: { salePrice: true, profit: true },
  _avg: { salePrice: true },
  _count: true,
});

console.log(stats._sum.salePrice); // Total sales
console.log(stats._avg.salePrice); // Average sale
```

### Group By
```typescript
const salesByCategory = await prisma.sale.groupBy({
  by: ['category'],
  _sum: {
    salePrice: true,
    profit: true,
  },
  _count: true,
});
```

---

## 🔄 Transactions

### Simple Transaction
```typescript
await prisma.$transaction([
  prisma.product.update({
    where: { id: 1 },
    data: { amount: { decrement: 5 } },
  }),
  prisma.sale.create({
    data: {
      productId: 1,
      quantitySold: 5,
      salePrice: 25,
    },
  }),
]);
```

### Interactive Transaction (Recommended for Sales)
```typescript
const result = await prisma.$transaction(async (tx) => {
  // 1. Get product
  const product = await tx.product.findUnique({
    where: { id: productId },
  });

  if (!product || product.amount < quantity) {
    throw new Error('Insufficient stock');
  }

  // 2. Update stock
  await tx.product.update({
    where: { id: productId },
    data: { amount: { decrement: quantity } },
  });

  // 3. Create sale
  const sale = await tx.sale.create({
    data: {
      productId,
      quantitySold: quantity,
      salePrice: product.price! * quantity,
      costOfGoods: product.purchasePrice! * quantity,
      profit: (product.price! - product.purchasePrice!) * quantity,
    },
  });

  return sale;
});
```

---

## 🔍 Filters

### Where Conditions
```typescript
// Equals
{ categoryId: 1 }

// Not equals
{ categoryId: { not: 1 } }

// Greater than
{ amount: { gt: 10 } }
{ amount: { gte: 10 } }  // Greater or equal

// Less than
{ amount: { lt: 10 } }
{ amount: { lte: 10 } }  // Less or equal

// In array
{ categoryId: { in: [1, 2, 3] } }

// String contains (case-insensitive)
{ name: { contains: 'tomato', mode: 'insensitive' } }

// String starts with
{ name: { startsWith: 'Tom' } }

// Date range
{
  createdAt: {
    gte: new Date('2024-01-01'),
    lt: new Date('2024-12-31'),
  },
}

// AND condition
{
  AND: [
    { categoryId: 1 },
    { amount: { gt: 10 } },
  ],
}

// OR condition
{
  OR: [
    { categoryId: 1 },
    { categoryId: 2 },
  ],
}

// NOT condition
{
  NOT: {
    amount: 0,
  },
}
```

---

## 📄 Pagination

```typescript
async findAll(page: number, limit: number) {
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count(),
  ]);

  return {
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
```

---

## 🧮 Useful Patterns

### Check if exists
```typescript
const exists = await prisma.product.findUnique({
  where: { id: 1 },
  select: { id: true },
});

if (!exists) throw new NotFoundError('Product not found');
```

### Upsert (Create or Update)
```typescript
const unit = await prisma.unit.upsert({
  where: { name: 'kg' },
  update: {},
  create: { name: 'kg', conversionFactor: 1.0 },
});
```

### Increment/Decrement
```typescript
await prisma.product.update({
  where: { id: 1 },
  data: {
    amount: { increment: 10 },  // Add 10
    // amount: { decrement: 5 },  // Subtract 5
  },
});
```

### Select Specific Fields
```typescript
const users = await prisma.user.findMany({
  select: {
    id: true,
    username: true,
    // passwordHash excluded!
  },
});
```

---

## 🎯 Recipe Module Example Queries

### Create Recipe with Ingredients
```typescript
const recipe = await prisma.recipe.create({
  data: {
    name: 'Greek Salad',
    salePrice: 12.5,
    ingredients: {
      create: [
        { productId: 1, amount: 0.5 },  // 500g tomatoes
        { productId: 2, amount: 0.05 }, // 50ml olive oil
        { productId: 3, amount: 0.2 },  // 200g feta
      ],
    },
  },
  include: {
    ingredients: {
      include: {
        product: {
          include: { unit: true },
        },
      },
    },
  },
});
```

### Calculate Recipe Cost
```typescript
const recipe = await prisma.recipe.findUnique({
  where: { id: 1 },
  include: {
    ingredients: {
      include: { product: true },
    },
  },
});

const cost = recipe.ingredients.reduce((sum, ingredient) => {
  return sum + (ingredient.amount * ingredient.product.purchasePrice);
}, 0);

console.log('Recipe cost:', cost);
console.log('Sale price:', recipe.salePrice);
console.log('Profit:', recipe.salePrice - cost);
```

---

## 🛒 Sales Module Example

### Record Sale with Stock Update
```typescript
async recordSale(dto: CreateSaleDto) {
  return await prisma.$transaction(async (tx) => {
    // 1. Get recipe with ingredients
    const recipe = await tx.recipe.findUnique({
      where: { id: dto.recipeId },
      include: { ingredients: true },
    });

    if (!recipe) throw new NotFoundError('Recipe not found');

    // 2. Check stock availability
    for (const ingredient of recipe.ingredients) {
      const product = await tx.product.findUnique({
        where: { id: ingredient.productId },
      });

      const required = ingredient.amount * dto.quantity;
      if (product!.amount < required) {
        throw new ValidationError(
          `Insufficient stock for ${product!.name}`
        );
      }
    }

    // 3. Update stock for all ingredients
    for (const ingredient of recipe.ingredients) {
      await tx.product.update({
        where: { id: ingredient.productId },
        data: {
          amount: {
            decrement: ingredient.amount * dto.quantity,
          },
        },
      });
    }

    // 4. Calculate cost
    const costOfGoods = recipe.ingredients.reduce((sum, ing) => {
      return sum + (ing.amount * ing.product.purchasePrice);
    }, 0) * dto.quantity;

    const totalPrice = recipe.salePrice * dto.quantity;
    const profit = totalPrice - costOfGoods;

    // 5. Create sale record
    return await tx.sale.create({
      data: {
        recipeId: recipe.id,
        quantitySold: dto.quantity,
        salePrice: totalPrice,
        costOfGoods,
        profit,
        saleDate: new Date(),
        category: dto.category,
        paymentMethod: dto.paymentMethod,
      },
    });
  });
}
```

---

## 📚 Resources

- **Prisma Docs**: https://www.prisma.io/docs
- **Prisma Client API**: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference
- **Transactions**: https://www.prisma.io/docs/concepts/components/prisma-client/transactions

---

## 💡 Tips

1. **Always use `include`** when you need related data
2. **Use transactions** for operations that must succeed/fail together
3. **Use `select`** to exclude sensitive fields (passwords)
4. **Pagination** is crucial for large datasets
5. **Validation** should happen BEFORE database calls
6. **Error handling**: Catch Prisma errors and convert to custom errors
