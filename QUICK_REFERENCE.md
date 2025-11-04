# 🎯 Quick Reference Card

## 📋 Essential Commands

```bash
# Start Development Server
npm run dev

# Database Operations
npm run prisma:studio      # Visual DB browser
npm run prisma:migrate     # Apply migrations
npm run prisma:generate    # Generate Prisma Client
npm run prisma:seed        # Seed sample data

# Code Quality
npm run lint              # Check code
npm run format            # Auto-format
```

---

## 🔐 Default Users (after seed)

| Username | Password | Role |
|----------|----------|------|
| `admin` | `Admin@123` | ADMIN |
| `waiter` | `Waiter@123` | WAITER |

**Password Requirements**: Min 8 chars, uppercase, lowercase, numbers, special characters

---

## 🌐 API Endpoints

**Base URL**: `http://localhost:3000/api`

### Auth (No token required)
```
POST /auth/register    { username, password, role? }
POST /auth/login       { username, password }
```

### Auth (Token required)
```
GET /auth/me
```

### Products (Token required)
```
GET    /products           # List all
GET    /products/:id       # Get one
GET    /products/low-stock # Low stock alert
POST   /products           # Create (Admin only)
PATCH  /products/:id       # Update (Admin only)
DELETE /products/:id       # Delete (Admin only)
```

---

## 🔑 Authentication Header

```
Authorization: Bearer <your-jwt-token>
```

---

## 📝 Example Requests

### Login
```json
POST /api/auth/login
{
  "username": "admin",
  "password": "Admin@123"
}
```

**Rate Limit**: 5 attempts per 15 minutes

### Create Product (Admin only)
```json
POST /api/products
Authorization: Bearer <token>

{
  "name": "Feta Cheese",
  "unitId": 1,
  "categoryId": 1,
  "amount": 15,
  "price": 9.5,
  "purchasePrice": 6.0,
  "receivedDate": "2024-11-04",
  "expirationDate": "2024-12-04",
  "minimumStock": 5
}
```

---

## 🗄️ Prisma Schema Key Models

```prisma
User       # Authentication
Product    # Inventory items
Unit       # kg, L, piece
Category   # Food, Drinks, etc.
Recipe     # Menu items
RecipeIngredient  # Recipe ↔ Product
Sale       # Sales transactions
Rule       # Stock alerts
```

---

## 🏗️ Module Structure Pattern

```
domain/<module>/
├── <module>.dto.ts         # Zod validation schemas
├── <module>.repository.ts  # Database operations (Prisma)
├── <module>.service.ts     # Business logic
└── <module>.routes.ts      # REST API endpoints
```

---

## 📂 Key Files to Know

| File | Purpose |
|------|---------|
| `prisma/schema.prisma` | All database models |
| `src/app.ts` | Express app setup |
| `src/server.ts` | Server entry point |
| `src/config/config.ts` | Environment config |
| `src/shared/authMiddleware.ts` | JWT auth |
| `src/shared/errorHandler.ts` | Global errors |

---

## 🔧 Environment Variables

```env
DATABASE_URL="mysql://user:pass@localhost:3306/restaurant_db"
JWT_ACCESS_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret"
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

---

## 🎯 User Roles & Permissions

| Role | Can Do |
|------|--------|
| **ADMIN** | Everything (CRUD all resources) |
| **WAITER** | Read products, create sales only |

---

## 🧪 Testing Workflow

1. **Start server**: `npm run dev`
2. **Login**: POST `/api/auth/login`
3. **Copy token** from response
4. **Make requests** with `Authorization: Bearer <token>`

---

## 📊 Response Format

### Success
```json
{
  "status": "success",
  "message": "...",
  "data": { ... }
}
```

### Error
```json
{
  "status": "error",
  "message": "Error description"
}
```

---

## 🐛 Quick Fixes

| Problem | Solution |
|---------|----------|
| Cannot connect to DB | Check MySQL running + `.env` |
| Prisma errors | `npm run prisma:generate` |
| Port in use | Change `PORT` in `.env` |
| TypeScript errors | `npm run lint:fix` |

---

## 📚 Documentation

- `README.md` - Project overview
- `GETTING_STARTED.md` - Setup guide
- `PROJECT_STRUCTURE.md` - Architecture
- `PRISMA_QUERIES.md` - Query examples
- `SETUP_COMPLETE.md` - Status & next steps

---

## 🎓 Learning Path

1. ✅ Study `products/` module (complete example)
2. ⏳ Build `recipes/` module (similar pattern)
3. ⏳ Build `sales/` module (add transactions)
4. ⏳ Build React frontend
5. ⏳ Add Swagger docs

---

## 💡 Pro Tips

- Use `prisma:studio` to visualize DB
- Always validate input with Zod
- Use transactions for multi-step operations
- Check errors in terminal output
- Test with Postman before frontend
