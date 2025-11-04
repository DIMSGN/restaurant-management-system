# 🎨 Project Visualization

## 📊 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Phase 4)                       │
│                     React + Vite + TypeScript                    │
│                                                                   │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────┐   │
│  │   Login     │  │    Admin     │  │      Waiter         │   │
│  │   Register  │  │  Dashboard   │  │    Interface        │   │
│  └─────────────┘  └──────────────┘  └─────────────────────┘   │
│                                                                   │
│                    HTTP Requests (Axios)                         │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             │ REST API Calls
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│                     BACKEND - Express Server                      │
│                     Node.js + TypeScript                          │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                     API Routes                           │   │
│  │  /api/auth  /api/products  /api/recipes  /api/sales     │   │
│  └────────────┬────────────┬────────────┬───────────┬───────┘   │
│               │            │            │           │            │
│  ┌────────────▼────────────▼────────────▼───────────▼────────┐ │
│  │                   Authentication Middleware               │ │
│  │                      JWT Verification                     │ │
│  └────────────┬────────────┬────────────┬───────────┬────────┘ │
│               │            │            │           │            │
│  ┌────────────▼────┐  ┌───▼──────┐  ┌──▼──────┐  ┌▼─────────┐ │
│  │  User Service  │  │ Product  │  │ Recipe  │  │  Sale    │ │
│  │                │  │ Service  │  │ Service │  │ Service  │ │
│  │  - Register    │  │ - CRUD   │  │ - CRUD  │  │ - Record │ │
│  │  - Login       │  │ - Search │  │ - Calc  │  │ - Update │ │
│  │  - Validate    │  │ - Alert  │  │ - Cost  │  │ - Profit │ │
│  └────────────┬────┘  └───┬──────┘  └──┬──────┘  └┬─────────┘ │
│               │           │            │           │            │
│  ┌────────────▼───────────▼────────────▼───────────▼────────┐ │
│  │                    Repository Layer                       │ │
│  │              (Database Access - Prisma)                   │ │
│  └────────────┬───────────┬────────────┬───────────┬────────┘ │
└───────────────┼───────────┼────────────┼───────────┼──────────┘
                │           │            │           │
┌───────────────▼───────────▼────────────▼───────────▼──────────┐
│                      MySQL Database                            │
│                                                                 │
│  ┌──────┐  ┌─────────┐  ┌────────┐  ┌──────┐  ┌──────────┐  │
│  │Users │  │Products │  │Recipes │  │Sales │  │Categories│  │
│  └──────┘  └─────────┘  └────────┘  └──────┘  └──────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow - Example: Create Sale

```
User Action
    │
    ├─> 1. POST /api/sales
    │      Authorization: Bearer <token>
    │      { recipeId: 1, quantity: 2 }
    │
    ├─> 2. Middleware: authenticate()
    │      ├─ Verify JWT token
    │      └─ Extract user info
    │
    ├─> 3. Middleware: authorize(ADMIN, WAITER)
    │      └─ Check user role
    │
    ├─> 4. Controller: validate request
    │      └─ Zod schema validation
    │
    ├─> 5. Service: SaleService.recordSale()
    │      ├─ Get recipe with ingredients
    │      ├─ Check stock availability
    │      ├─ Calculate cost & profit
    │      └─ Start transaction
    │
    ├─> 6. Repository: Update DB (Transaction)
    │      ├─ prisma.$transaction([
    │      │   ├─ Update product stocks
    │      │   └─ Create sale record
    │      └─ ])
    │
    └─> 7. Response: 201 Created
           {
             status: "success",
             data: { sale details }
           }
```

---

## 🏗️ Domain-Driven Design - Bounded Contexts

```
┌──────────────────────────────────────────────────────────────┐
│                   RESTAURANT MANAGEMENT DOMAIN               │
│                                                              │
│  ┌─────────────────┐  ┌─────────────────┐                 │
│  │ Authentication  │  │   Inventory     │                 │
│  │    Context      │  │    Context      │                 │
│  │                 │  │                 │                 │
│  │  • User         │  │  • Product      │                 │
│  │  • Role         │  │  • Category     │                 │
│  │  • Login        │  │  • Unit         │                 │
│  │  • Register     │  │  • Rule         │                 │
│  └─────────────────┘  └─────────────────┘                 │
│                                                              │
│  ┌─────────────────┐  ┌─────────────────┐                 │
│  │     Recipe      │  │      Sales      │                 │
│  │    Context      │  │     Context     │                 │
│  │                 │  │                 │                 │
│  │  • Recipe       │  │  • Sale         │                 │
│  │  • Ingredient   │  │  • Transaction  │                 │
│  │  • Cost Calc    │  │  • Profit       │                 │
│  │  • Menu         │  │  • Report       │                 │
│  └─────────────────┘  └─────────────────┘                 │
└──────────────────────────────────────────────────────────────┘
```

---

## 📦 Module Structure Pattern

```
domain/<module>/
│
├── <module>.dto.ts
│   └── Zod schemas
│       ├── createSchema
│       ├── updateSchema
│       └── querySchema
│
├── <module>.repository.ts
│   └── Database operations
│       ├── create()
│       ├── findAll()
│       ├── findById()
│       ├── update()
│       └── delete()
│
├── <module>.service.ts
│   └── Business logic
│       ├── Validation rules
│       ├── Calculations
│       ├── Error handling
│       └── Call repository
│
└── <module>.routes.ts
    └── REST API endpoints
        ├── GET /api/<module>
        ├── GET /api/<module>/:id
        ├── POST /api/<module>
        ├── PATCH /api/<module>/:id
        └── DELETE /api/<module>/:id
```

---

## 🔐 Authentication Flow

```
┌──────────────┐
│   Browser    │
└──────┬───────┘
       │
       │ 1. POST /api/auth/login
       │    { username, password }
       │
       ▼
┌──────────────────┐
│  Auth Controller │
└──────┬───────────┘
       │
       │ 2. Validate credentials
       │
       ▼
┌──────────────────┐
│   Auth Service   │
│  ├─ Check user   │
│  ├─ Verify pwd   │──────> bcrypt.compare()
│  └─ Generate JWT │──────> jwt.sign()
└──────┬───────────┘
       │
       │ 3. Return token
       │
       ▼
┌──────────────┐
│   Browser    │
│  Store token │
│  in memory   │
└──────┬───────┘
       │
       │ 4. Next request
       │    Authorization: Bearer <token>
       │
       ▼
┌──────────────────┐
│   Middleware     │
│  ├─ Verify JWT   │──────> jwt.verify()
│  └─ Extract user │
└──────┬───────────┘
       │
       │ 5. Attach user to request
       │
       ▼
┌──────────────────┐
│  Protected Route │
│  req.user.id     │
│  req.user.role   │
└──────────────────┘
```

---

## 🗄️ Database Relationships

```
                    ┌──────────┐
                    │   User   │
                    └────┬─────┘
                         │
                         │ 1:N
                         │
                    ┌────▼─────┐
              ┌─────┤   Sale   ├─────┐
              │     └──────────┘     │
              │                      │
          N:1 │                      │ N:1
              │                      │
        ┌─────▼──────┐         ┌────▼────┐
        │  Product   │         │ Recipe  │
        └─────┬──────┘         └────┬────┘
              │                     │
          1:N │                     │ 1:N
              │                     │
        ┌─────▼──────┐              │
        │    Rule    │              │
        │  (Alert)   │              │
        └────────────┘              │
              │                     │
          N:1 │                 N:M │
              │              ┌──────▼──────────┐
        ┌─────▼──────┐       │ RecipeIngredient│
        │  Category  │       └──────┬──────────┘
        └────────────┘              │
              │                     │ N:1
          N:1 │                     │
              │               ┌─────▼──────┐
        ┌─────▼──────┐        │  Product   │
        │    Unit    │        │ (back ref) │
        └────────────┘        └────────────┘
```

---

## 📊 User Journey Map

### Admin Journey
```
Login
  │
  ├─> Dashboard
  │     │
  │     ├─> Manage Inventory
  │     │     ├─ Add products
  │     │     ├─ Update stock
  │     │     └─ View alerts
  │     │
  │     ├─> Manage Recipes
  │     │     ├─ Create recipes
  │     │     ├─ Add ingredients
  │     │     └─ Set prices
  │     │
  │     ├─> View Sales
  │     │     ├─ Sales history
  │     │     ├─ Profit analysis
  │     │     └─ Export reports
  │     │
  │     └─> Settings
  │           ├─ Manage users
  │           └─ System config
  │
  └─> Logout
```

### Waiter Journey
```
Login
  │
  ├─> Dashboard
  │     │
  │     ├─> View Menu (Recipes)
  │     │
  │     ├─> Create Sale
  │     │     ├─ Select items
  │     │     ├─ Set quantity
  │     │     └─ Process payment
  │     │
  │     └─> View Alerts
  │           └─ Low stock items
  │
  └─> Logout
```

---

## 🎯 Technology Stack Layers

```
┌───────────────────────────────────────────┐
│            PRESENTATION LAYER              │
│        React + Vite + TailwindCSS         │
└─────────────────┬─────────────────────────┘
                  │
                  │ HTTP/REST
                  │
┌─────────────────▼─────────────────────────┐
│          APPLICATION LAYER                 │
│         Express + TypeScript               │
│                                            │
│  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │   Auth   │  │Validation│  │  CORS   │ │
│  │   JWT    │  │   Zod    │  │         │ │
│  └──────────┘  └──────────┘  └─────────┘ │
└─────────────────┬─────────────────────────┘
                  │
┌─────────────────▼─────────────────────────┐
│           BUSINESS LAYER                   │
│      Services (Domain Logic)               │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │  Product  Recipe  Sale  User         │ │
│  │  Service  Service Service Service    │ │
│  └──────────────────────────────────────┘ │
└─────────────────┬─────────────────────────┘
                  │
┌─────────────────▼─────────────────────────┐
│          DATA ACCESS LAYER                 │
│      Repositories + Prisma ORM             │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │  Product  Recipe  Sale  User         │ │
│  │  Repo     Repo    Repo  Repo         │ │
│  └──────────────────────────────────────┘ │
└─────────────────┬─────────────────────────┘
                  │
┌─────────────────▼─────────────────────────┐
│          DATABASE LAYER                    │
│             MySQL Server                   │
│                                            │
│  Tables: users, products, recipes,         │
│          sales, categories, units          │
└────────────────────────────────────────────┘
```

---

## 🚀 Development Timeline

```
Week 1-2: ✅ DONE
├── Project setup
├── Prisma schema
├── Authentication
├── Products module
└── Documentation

Week 3-4: 🔨 IN PROGRESS
├── Recipe module
├── Sales module
└── Business logic

Week 5-6: 📅 PLANNED
├── React setup
├── Login/Register
├── Admin dashboard
└── Waiter interface

Week 7-8: 📅 PLANNED
├── Swagger docs
├── Testing
├── Polish
└── Deployment prep

Deadline: 18/1/2026
```

---

## 💡 Key Principles Applied

```
✅ DRY (Don't Repeat Yourself)
   └─> Reusable middleware, shared utilities

✅ SOLID Principles
   └─> Single Responsibility (each file has one job)

✅ Separation of Concerns
   └─> DTO → Repository → Service → Controller

✅ Type Safety
   └─> TypeScript + Zod + Prisma

✅ Security First
   └─> JWT + bcrypt + validation

✅ Error Handling
   └─> Global error handler + custom errors
```
