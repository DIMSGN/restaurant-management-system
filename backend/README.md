# Restaurant Management System - Backend

## 📋 Περιγραφή

Ολοκληρωμένο σύστημα διαχείρισης εστιατορίου με Inventory Management, Recipe Management, Sales Tracking και Reporting.

**Tech Stack:**
- Node.js + Express + TypeScript
- Prisma ORM
- MySQL Database
- JWT Authentication
- Zod Validation

---

## 🚀 Installation

### Prerequisites
- Node.js (v18 ή νεότερο)
- MySQL (v8.0 ή νεότερο)
- npm ή yarn

### Setup Steps

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd restaurant-management/backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
```

Άνοιξε το `.env` και ρύθμισε:
```env
DATABASE_URL="mysql://username:password@localhost:3306/restaurant_db"
JWT_ACCESS_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
PORT=3000
```

4. **Create database**
```bash
# Στο MySQL console:
CREATE DATABASE restaurant_db;
```

5. **Run Prisma migrations**
```bash
npm run prisma:generate
npm run prisma:migrate
```

6. **Seed the database (optional)**
```bash
npm run prisma:seed
```
Αυτό δημιουργεί:
- Admin user: `admin` / `Admin@123`
- Waiter user: `waiter` / `Waiter@123`
- Sample units, categories, products

**Note**: Strong passwords required (8+ chars, mixed case, numbers, symbols)

7. **Start development server**
```bash
npm run dev
```

Server runs at: `http://localhost:3000`

---

## 📁 Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma          # Prisma schema (Domain Models)
│   └── seed.ts                # Database seeding
├── src/
│   ├── config/
│   │   ├── config.ts          # Environment config
│   │   └── database.ts        # Prisma client
│   ├── domain/                # Domain-Driven Design
│   │   ├── users/             # Authentication & Users
│   │   │   ├── user.dto.ts
│   │   │   ├── user.repository.ts
│   │   │   ├── user.service.ts
│   │   │   └── user.routes.ts
│   │   ├── products/          # Inventory Management
│   │   ├── recipes/           # Recipe Management (TODO)
│   │   └── sales/             # Sales Tracking (TODO)
│   ├── shared/
│   │   ├── errors.ts          # Custom error classes
│   │   ├── errorHandler.ts    # Global error handler
│   │   ├── authMiddleware.ts  # JWT auth middleware
│   │   ├── asyncHandler.ts    # Async wrapper
│   │   └── types.ts           # Shared TypeScript types
│   ├── app.ts                 # Express app setup
│   └── server.ts              # Server entry point
├── package.json
└── tsconfig.json
```

---

## 🔑 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | No |
| POST | `/login` | Login user | No |
| GET | `/me` | Get current user profile | Yes |

### Products (`/api/products`)

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/` | Get all products (paginated) | Yes | All |
| GET | `/:id` | Get product by ID | Yes | All |
| GET | `/low-stock` | Get low stock products | Yes | All |
| POST | `/` | Create new product | Yes | Admin |
| PATCH | `/:id` | Update product | Yes | Admin |
| DELETE | `/:id` | Delete product | Yes | Admin |

### Recipes (`/api/recipes`) - TODO
### Sales (`/api/sales`) - TODO

---

## 🔐 Authentication

Το API χρησιμοποιεί **JWT (JSON Web Tokens)**.

### Login Flow:
1. POST `/api/auth/login` με `{ username, password }`
2. Παίρνεις response: `{ token: "..." }`
3. Σε κάθε επόμενο request, στέλνεις header:
```
Authorization: Bearer <token>
```

### User Roles:
- **ADMIN**: Πλήρη πρόσβαση (CRUD σε όλα)
- **WAITER**: Μόνο read + sales

---

## 🧪 Testing με Postman

1. **Login as Admin:**
```json
POST http://localhost:3000/api/auth/login
{
  "username": "admin",
  "password": "Admin@123"
}
```

**Rate Limit**: 5 attempts per 15 minutes

2. **Copy το token** από response

3. **Get Products:**
```
GET http://localhost:3000/api/products
Headers:
  Authorization: Bearer <your-token>
```

4. **Create Product (Admin only):**
```json
POST http://localhost:3000/api/products
Headers:
  Authorization: Bearer <admin-token>
Body:
{
  "name": "Cheese",
  "unitId": 1,
  "categoryId": 1,
  "amount": 25,
  "price": 8.5,
  "purchasePrice": 5.0,
  "receivedDate": "2024-11-04",
  "expirationDate": "2024-12-04",
  "minimumStock": 5
}
```

---

## 🗄️ Database Schema (Prisma)

### Main Models:
- **User**: Authentication (Admin, Waiter)
- **Unit**: Measurement units (kg, L, piece)
- **Category**: Product categories
- **Product**: Inventory items
- **Recipe**: Menu items with ingredients
- **RecipeIngredient**: Many-to-many relation
- **Rule**: Stock alert rules
- **Sale**: Sales transactions

---

## 🎯 Development Roadmap

### ✅ Phase 1 - COMPLETED
- [x] Project setup
- [x] Prisma schema
- [x] Authentication (register/login)
- [x] Products CRUD
- [x] Zod validation
- [x] Error handling
- [x] Role-based authorization

### ✅ Phase 2 - COMPLETED
- [x] Recipe management
- [x] Sales tracking with SERIALIZABLE transactions
- [x] Stock update logic
- [x] Low stock alerts

### ✅ Phase 2.5 - Security Hardening - COMPLETED
- [x] Rate limiting (express-rate-limit)
- [x] Security headers (Helmet)
- [x] Structured logging (Winston)
- [x] Strong password policy
- [x] Input validation improvements
- [x] Database indices optimization
- [x] Request body size limits
- [x] Enhanced health check

### 📅 Phase 3 - PLANNED
- [ ] Reports & Analytics
- [ ] Swagger documentation
- [ ] Unit tests
- [ ] Frontend integration

---

## 📝 Scripts

```bash
npm run dev          # Start development server (hot reload)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Lint code
npm run format       # Format code with Prettier
npm run prisma:generate   # Generate Prisma Client
npm run prisma:migrate    # Run migrations
npm run prisma:studio     # Open Prisma Studio (DB GUI)
npm run prisma:seed       # Seed database
```

---

## 🐛 Common Issues

### "Cannot connect to MySQL"
- Βεβαιώσου ότι το MySQL τρέχει
- Έλεγξε το `DATABASE_URL` στο `.env`

### "Prisma Client not generated"
```bash
npm run prisma:generate
```

### "Port 3000 already in use"
Άλλαξε το `PORT` στο `.env` file.

---

## 👨‍💻 Authors

- Coding Factory 2025

## 📄 License

ISC
