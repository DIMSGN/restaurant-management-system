# 🍽️ Restaurant Management System

**Full-Stack Application για Διαχείριση Εστιατορίου**

---

## 📊 Project Overview

Ολοκληρωμένο σύστημα για τη διαχείριση:
- 📦 **Inventory** (Αποθήκη προϊόντων)
- 🍕 **Recipes** (Συνταγές με υπολογισμό κόστους)
- 💰 **Sales** (Πωλήσεις με auto stock update)
- 📈 **Reports** (Στατιστικά & Analytics)
- 🔐 **Authentication** (Admin & Waiter roles)

---

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express** + **TypeScript**
- **Prisma ORM** (Model-First Approach)
- **MySQL** Database
- **JWT** Authentication
- **Zod** Validation
- **bcrypt** Password hashing
- **Winston** Structured logging
- **Helmet** Security headers
- **express-rate-limit** Rate limiting & DDoS protection

### Frontend (Phase 4)
- **React** + **Vite** + **TypeScript**
- **TailwindCSS** για styling
- **React Router** για navigation
- **Axios** για API calls
- **Zustand** ή **Context API** για state management

---

## 🎯 Key Features

### Authentication & Authorization
- ✅ User registration με role selection
- ✅ Login με JWT tokens
- ✅ Role-based access control (ADMIN, WAITER)
- ✅ Protected routes
- ✅ Strong password policy (8+ chars, mixed case, numbers, symbols)
- ✅ Rate limiting on auth endpoints (5 attempts/15min)
- ✅ Brute force attack prevention

### Inventory Management
- ✅ CRUD operations για products
- ✅ Categories & Units system
- ✅ Stock tracking με expiration dates
- ✅ Low stock alerts
- ✅ Pagination & filters

### Recipe Management ✅
- ✅ Create recipes με multiple ingredients
- ✅ Auto-calculate recipe cost
- ✅ Link recipes to inventory
- ✅ Recipe profitability analysis

### Sales Tracking ✅
- ✅ Record sales (recipe ή product)
- ✅ Auto stock deduction (με SERIALIZABLE transactions)
- ✅ Race condition prevention
- ✅ Profit calculation
- ✅ Payment method tracking
- ✅ Sales history & reports
- ✅ Optimized with database indices

---

## 📁 Project Structure

```
restaurant-management/
├── backend/                    # Node.js + Express API
│   ├── prisma/
│   │   ├── schema.prisma      # Domain Models (DDD)
│   │   └── seed.ts
│   ├── src/
│   │   ├── config/            # Environment & DB config
│   │   ├── domain/            # Bounded Contexts
│   │   │   ├── users/         # Auth domain
│   │   │   ├── products/      # Inventory domain
│   │   │   ├── recipes/       # Recipe domain
│   │   │   └── sales/         # Sales domain
│   │   ├── shared/            # Utilities, middleware
│   │   ├── app.ts
│   │   └── server.ts
│   └── README.md
│
└── frontend/                   # React + Vite (Phase 4)
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   └── App.tsx
    └── README.md
```

---

## 🚀 Quick Start

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MySQL credentials
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Server: `http://localhost:3000`

### Default Users (after seed):
- Admin: `admin` / `Admin@123`
- Waiter: `waiter` / `Waiter@123`

**Note**: Strong password policy enforced (8+ chars, uppercase, lowercase, numbers, special characters)

---

## 📝 API Documentation

### Base URL: `http://localhost:3000/api`

#### Authentication
- `POST /auth/register` - Register user
- `POST /auth/login` - Login
- `GET /auth/me` - Get profile (protected)

#### Products
- `GET /products` - List all (paginated)
- `GET /products/:id` - Get by ID
- `GET /products/low-stock` - Low stock alert
- `POST /products` - Create (Admin only)
- `PATCH /products/:id` - Update (Admin only)
- `DELETE /products/:id` - Delete (Admin only)

**Swagger documentation** (TODO - Phase 5)

---

## 🧱 Domain-Driven Design

### Bounded Contexts

1. **Authentication Context** (`users`)
   - User management
   - Login/register
   - Role validation

2. **Inventory Context** (`products`)
   - Product CRUD
   - Stock tracking
   - Low stock alerts

3. **Recipe Context** (`recipes`)
   - Recipe management
   - Ingredient mapping
   - Cost calculation

4. **Sales Context** (`sales`)
   - Sales recording
   - Stock updates (transactional)
   - Profit analysis

---

## 🗄️ Database Schema (ERD)

```
User (1) ────< Sale
             /
Product (N) ─┴─ (N) Recipe
  │                   │
  │                   │
  ├─ (1) Unit         └─ (N) RecipeIngredient
  ├─ (1) Category
  └─ (N) Rule (alerts)
```

---

## ✅ Development Progress

### Phase 1 - Backend Foundation ✅ COMPLETE
- [x] Project structure
- [x] Prisma schema (Model-First)
- [x] Authentication system
- [x] Products CRUD
- [x] Error handling & validation
- [x] Authorization middleware

### Phase 2 - Core Business Logic ✅ COMPLETE
- [x] Recipe management (CRUD + cost calculation)
- [x] Sales tracking με SERIALIZABLE transactions
- [x] Stock update logic (automatic)
- [x] Profit & analytics
- [x] Sales statistics & reports
- [x] Race condition prevention

### Phase 2.5 - Security & Production Hardening ✅ COMPLETE
- [x] Rate limiting (auth: 5/15min, API: 100/15min)
- [x] Helmet security headers
- [x] Winston structured logging
- [x] Strong password policy
- [x] Input validation improvements
- [x] Database indices optimization
- [x] Transaction isolation (SERIALIZABLE)
- [x] Request body size limits (10kb)
- [x] Enhanced health check endpoint

### Phase 3 - Frontend Development 📅 NEXT
- [ ] React setup με Vite
- [ ] Login/Register pages
- [ ] Admin dashboard
- [ ] Waiter interface
- [ ] Protected routes

### Phase 4 - Polish & Documentation 📅 PLANNED
- [ ] Swagger API docs
- [ ] Unit tests (Jest)
- [ ] Integration tests
- [ ] README improvements
- [ ] Demo video

---

## 🎓 Learning Objectives (Coding Factory)

✅ **Domain-Driven Design**
✅ **Model-First Approach** με Prisma
✅ **Layered Architecture** (Repository → Service → Controller)
✅ **REST API** με Express
✅ **JWT Authentication**
✅ **TypeScript** best practices
✅ **Zod Validation**
✅ **Error Handling**
✅ **Rate Limiting & Security**
✅ **Production-Ready Logging**
✅ **Transaction Safety**
⏳ **React + TypeScript**
⏳ **Swagger Documentation**

---

## 📅 Timeline

- **Week 1-2**: Backend setup & Authentication ✅
- **Week 3-4**: Recipe & Sales logic
- **Week 5-6**: Frontend development
- **Week 7-8**: Testing, docs, polish
- **Deadline**: 18/1/2026

---

## 🤝 Contributing

Αυτό το project είναι μέρος της τελικής εργασίας του Coding Factory.

---

## � Documentation

This project includes comprehensive documentation:

- **[📚 Documentation Index](DOCS_INDEX.md)** - Complete guide to all docs
- **[🚀 Getting Started](GETTING_STARTED.md)** - Quick setup guide
- **[📂 Project Structure](PROJECT_STRUCTURE.md)** - Architecture details
- **[🎯 Quick Reference](QUICK_REFERENCE.md)** - Commands & API cheat sheet
- **[🎨 Architecture Visual](ARCHITECTURE_VISUAL.md)** - Diagrams & flows
- **[🌐 Git Setup](GIT_SETUP.md)** - GitHub instructions

---

## �📄 License

ISC
