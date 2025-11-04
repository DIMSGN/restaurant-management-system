# 📂 Project Structure Overview

## Complete File Tree

```
restaurant-management/
│
├── README.md                           # Main project overview
├── GETTING_STARTED.md                  # Quick start guide
│
└── backend/
    ├── .env.example                    # Environment template
    ├── .gitignore                      # Git ignore rules
    ├── .eslintrc.json                  # ESLint config
    ├── .prettierrc                     # Prettier config
    ├── package.json                    # Dependencies & scripts
    ├── tsconfig.json                   # TypeScript config
    ├── README.md                       # Backend documentation
    │
    ├── prisma/
    │   ├── schema.prisma              # ⭐ DOMAIN MODELS (DDD)
    │   └── seed.ts                    # Database seeding script
    │
    └── src/
        ├── server.ts                   # 🚀 Entry point
        ├── app.ts                      # Express app setup
        │
        ├── config/
        │   ├── config.ts              # Environment variables
        │   └── database.ts            # Prisma client singleton
        │
        ├── shared/                     # Shared utilities
        │   ├── errors.ts              # Custom error classes
        │   ├── errorHandler.ts        # Global error handler
        │   ├── asyncHandler.ts        # Async wrapper
        │   ├── authMiddleware.ts      # JWT authentication
        │   └── types.ts               # TypeScript interfaces
        │
        └── domain/                     # ⭐ BOUNDED CONTEXTS (DDD)
            │
            ├── users/                  # Authentication Context
            │   ├── user.dto.ts        # Validation schemas (Zod)
            │   ├── user.repository.ts # Database operations
            │   ├── user.service.ts    # Business logic
            │   └── user.routes.ts     # REST API endpoints
            │
            ├── products/               # Inventory Context
            │   ├── product.dto.ts
            │   ├── product.repository.ts
            │   ├── product.service.ts
            │   └── product.routes.ts
            │
            ├── recipes/                # Recipe Context (TODO)
            │   └── index.ts           # Placeholder
            │
            └── sales/                  # Sales Context (TODO)
                └── index.ts           # Placeholder
```

---

## 🧱 Architecture Pattern

### Layered Architecture (per domain)

```
┌─────────────────────────────────────────┐
│          REST API (Routes)              │  ← HTTP endpoints
│  GET /api/products, POST /api/products  │
└────────────────┬────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────┐
│         Controller Layer                │  ← Request handling
│      (inside routes file)               │     Validation (Zod)
└────────────────┬────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────┐
│         Service Layer                   │  ← Business Logic
│   ProductService.createProduct()        │     Calculations
│   ProductService.updateProduct()        │     Rules
└────────────────┬────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────┐
│       Repository Layer                  │  ← Database Access
│   ProductRepository.create()            │     Prisma queries
│   ProductRepository.findAll()           │
└────────────────┬────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────┐
│         Database (MySQL)                │  ← Data Storage
└─────────────────────────────────────────┘
```

---

## 📝 File Responsibilities

### `*.dto.ts` - Data Transfer Objects
- **Purpose**: Define input/output schemas
- **Tool**: Zod validation
- **Example**:
```typescript
export const createProductSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
  // ...
});
```

### `*.repository.ts` - Data Access Layer
- **Purpose**: Database operations (CRUD)
- **Tool**: Prisma Client
- **Example**:
```typescript
async findAll() {
  return await prisma.product.findMany();
}
```

### `*.service.ts` - Business Logic Layer
- **Purpose**: Domain rules, calculations, orchestration
- **Example**:
```typescript
async createProduct(dto) {
  // Validation logic
  // Call repository
  // Return result
}
```

### `*.routes.ts` - API Endpoints
- **Purpose**: HTTP routing, auth middleware
- **Tool**: Express Router
- **Example**:
```typescript
router.post('/', authenticate, authorize(ADMIN), async (req, res) => {
  const product = await service.createProduct(req.body);
  res.json(product);
});
```

---

## 🔐 Middleware Flow

```
Request
  ↓
[CORS] → Allow frontend origin
  ↓
[JSON Parser] → Parse body
  ↓
[Route Handler]
  ↓
[authenticate] → Verify JWT token
  ↓
[authorize(ADMIN)] → Check role
  ↓
[asyncHandler] → Catch errors
  ↓
[Controller Logic]
  ↓
[Service Logic]
  ↓
[Repository]
  ↓
Response / Error Handler
```

---

## 🎯 Domain-Driven Design (DDD)

### Bounded Contexts

| Context | Folder | Responsibility |
|---------|--------|----------------|
| **Authentication** | `users/` | Login, register, JWT, roles |
| **Inventory** | `products/` | Stock management, categories, units |
| **Recipe** | `recipes/` | Menu items, ingredients, cost calc |
| **Sales** | `sales/` | Transactions, profit, stock updates |

### Domain Models (Prisma Schema)

```prisma
User ─────< Sale
             │
Product ────┴──── Recipe
  │                 │
  ├─ Unit          └─ RecipeIngredient
  ├─ Category
  └─ Rule
```

---

## 🚦 Request/Response Flow Example

### Example: Create Product

1. **Client** sends:
```http
POST /api/products
Authorization: Bearer <token>
{
  "name": "Cheese",
  "unitId": 1,
  "categoryId": 1,
  "amount": 10,
  "price": 8.5
}
```

2. **Route** (`product.routes.ts`):
   - Validates JWT → `authenticate`
   - Checks role → `authorize(ADMIN)`
   - Validates body → `createProductSchema.parse()`

3. **Service** (`product.service.ts`):
   - Business validation (expiration > received date)
   - Calls repository

4. **Repository** (`product.repository.ts`):
   - `prisma.product.create()` with relations

5. **Response**:
```json
{
  "status": "success",
  "data": {
    "id": 5,
    "name": "Cheese",
    "amount": 10,
    "unit": { "name": "kg" },
    "category": { "name": "Food" }
  }
}
```

---

## 🔧 Configuration Files

### `tsconfig.json`
- TypeScript compilation settings
- Strict mode enabled
- Output to `dist/`

### `.eslintrc.json`
- Code quality rules
- TypeScript linting

### `.prettierrc`
- Code formatting
- Single quotes, semicolons, etc.

### `.env` (not in repo)
```env
DATABASE_URL=mysql://...
JWT_ACCESS_SECRET=...
PORT=3000
```

### `prisma/schema.prisma`
- ⭐ **Model-First approach**
- All domain entities
- Relations, indexes, enums

---

## 📦 Key Dependencies

### Runtime
- `express` - Web framework
- `@prisma/client` - ORM
- `zod` - Validation
- `bcrypt` - Password hashing
- `jsonwebtoken` - JWT auth
- `cors` - Cross-origin

### Dev
- `typescript` - Type safety
- `tsx` - TS execution
- `prisma` - DB toolkit
- `eslint` - Linting
- `prettier` - Formatting

---

## 🧪 Testing Strategy (Future)

```
tests/
├── unit/
│   ├── services/
│   │   └── product.service.test.ts
│   └── repositories/
│       └── product.repository.test.ts
├── integration/
│   └── api/
│       └── products.test.ts
└── e2e/
    └── flows/
        └── purchase-flow.test.ts
```

---

## 📚 Learning Resources

- **Prisma Docs**: https://www.prisma.io/docs
- **Express**: https://expressjs.com
- **Zod**: https://zod.dev
- **JWT**: https://jwt.io
- **DDD**: Domain-Driven Design principles

---

## 🎓 For Your Project Presentation

Highlight:
1. ✅ **Model-First** με Prisma schema
2. ✅ **Layered Architecture** (Repo → Service → Controller)
3. ✅ **Domain-Driven Design** (bounded contexts)
4. ✅ **Type Safety** (TypeScript + Zod)
5. ✅ **Security** (JWT + role-based auth)
6. ✅ **Best Practices** (error handling, validation, etc.)
