# 🚀 Next Steps - Getting Started

## ✅ Τι έχουμε φτιάξει μέχρι τώρα:

### Backend Structure ✅
- ✅ Complete project setup με TypeScript
- ✅ Prisma schema (all models)
- ✅ Authentication system (register/login/JWT)
- ✅ Products module (full CRUD με validation)
- ✅ Error handling & middleware
- ✅ Role-based authorization
- ✅ Database seeding

---

## 📋 Τι πρέπει να κάνεις ΤΩΡΑ:

### Step 1: Install Dependencies ⚡

```bash
cd "c:\Users\dimit\Desktop\Final Project\restaurant-management\backend"
npm install
```

Αυτό θα εγκαταστήσει όλα τα packages (Express, Prisma, TypeScript, κλπ.)

---

### Step 2: Setup Database 🗄️

1. **Άνοιξε το MySQL** και δημιούργησε database:
```sql
CREATE DATABASE restaurant_db;
```

2. **Δημιούργησε `.env` file:**
```bash
cp .env.example .env
```

3. **Άνοιξε το `.env`** και βάλε τα credentials σου:
```env
DATABASE_URL="mysql://root:your-password@localhost:3306/restaurant_db"
JWT_ACCESS_SECRET=super-secret-key-123
JWT_REFRESH_SECRET=another-secret-456
PORT=3000
```

---

### Step 3: Run Prisma Migrations 🔄

```bash
npm run prisma:generate
npm run prisma:migrate
```

Αυτό θα:
- Δημιουργήσει το Prisma Client
- Δημιουργήσει όλα τα tables στη βάση

---

### Step 4: Seed the Database 🌱

```bash
npm run prisma:seed
```

Αυτό θα δημιουργήσει:
- **Admin user**: `admin` / `admin123`
- **Waiter user**: `waiter` / `waiter123`
- Sample units (kg, L, piece)
- Sample categories (Food, Drinks)
- Sample products (Tomatoes, Olive Oil, Coca Cola)

---

### Step 5: Start the Server 🚀

```bash
npm run dev
```

✅ Αν όλα πάνε καλά, θα δεις:
```
✅ Database connected successfully
🚀 Server running on port 3000
📝 Environment: development
🔗 Health check: http://localhost:3000/health
```

---

### Step 6: Test the API με Postman 🧪

#### 1. Health Check
```
GET http://localhost:3000/health
```
Response: `{ "status": "OK" }`

#### 2. Login as Admin
```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "Admin@123"
}
```

**Note**: Rate limited to 5 login attempts per 15 minutes

Response:
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "username": "admin",
      "role": "ADMIN"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**📋 COPY το token!**

#### 3. Get All Products
```
GET http://localhost:3000/api/products
Authorization: Bearer <your-token-here>
```

#### 4. Create New Product (Admin only)
```
POST http://localhost:3000/api/products
Authorization: Bearer <admin-token>
Content-Type: application/json

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

#### 5. Try as Waiter (should fail for POST)
Login με `waiter` / `Waiter@123` και δοκίμασε να κάνεις POST product.
Θα πάρεις: `403 Forbidden` ✅

#### 6. Test Rate Limiting
Κάνε 6 login attempts γρήγορα.
Θα πάρεις: `429 Too Many Requests` στο 6ο ✅

---

## 🎯 Τι έχει μείνει (Phase 2 & 3):

### Phase 2: Recipe Management
- [ ] Create `recipe.dto.ts`, `recipe.repository.ts`, `recipe.service.ts`, `recipe.routes.ts`
- [ ] Implement recipe CRUD
- [ ] Calculate recipe cost από ingredients
- [ ] Add recipe endpoints στο `app.ts`

### Phase 3: Sales Tracking
- [ ] Create `sale.dto.ts`, `sale.repository.ts`, `sale.service.ts`, `sale.routes.ts`
- [ ] Implement sales recording
- [ ] **ΣΗΜΑΝΤΙΚΟ**: Stock update με `prisma.$transaction()` για consistency
- [ ] Calculate profit (sale_price - cost_of_goods)
- [ ] Add sales endpoints

---

## 🛠️ Useful Commands

```bash
# Development
npm run dev              # Start με hot reload

# Prisma
npm run prisma:studio    # Open DB GUI (φανταστικό για debugging!)
npm run prisma:migrate   # Create new migration
npm run prisma:generate  # Regenerate Prisma Client

# Code Quality
npm run lint             # Check code
npm run format           # Auto-format
```

---

## 🐛 Troubleshooting

### "Cannot connect to database"
- Έλεγξε ότι το MySQL τρέχει
- Έλεγξε το `DATABASE_URL` στο `.env`
- Τρέξε: `mysql -u root -p` για να δεις αν μπαίνεις

### "Prisma Client not generated"
```bash
npm run prisma:generate
```

### "Port 3000 already in use"
Άλλαξε το `PORT=3001` στο `.env`

### TypeScript errors
```bash
npm run lint:fix
```

---

## 📚 Next Learning Steps

1. **Μελέτησε το Prisma schema** (`prisma/schema.prisma`)
   - Δες πως οι relations δουλεύουν
   - Κατάλαβε τα `@relation`, `@map`, `@@index`

2. **Μελέτησε ένα domain module** (π.χ. `products/`)
   - DTO → validation με Zod
   - Repository → database operations
   - Service → business logic
   - Routes → REST API endpoints

3. **Φτιάξε το Recipe module** (με τη βοήθειά μου!)
   - Θα ακολουθήσει το ίδιο pattern
   - Θα προσθέσουμε logic για ingredient calculations

4. **Φτιάξε το Sales module**
   - Θα μάθεις **transactions** (`prisma.$transaction`)
   - Critical για data consistency

---

## 🎓 Για το Final Project

Αυτό που έχεις τώρα **καλύπτει ήδη**:
- ✅ Domain Model (Prisma schema)
- ✅ Model-First Approach
- ✅ Layered Architecture
- ✅ Repository/Service/Controller pattern
- ✅ Authentication & Authorization
- ✅ JWT με roles
- ✅ Validation (Zod)
- ✅ Error handling

**Μένουν:**
- ⏳ Recipe & Sales modules
- ⏳ Frontend (React)
- ⏳ Swagger documentation
- ⏳ README με deployment instructions

---

## 💪 Ready?

Τρέξε τα commands από το **Step 1** και πες μου αν όλα δουλεύουν!

Αν έχεις errors, στείλε μου το error message να το διορθώσουμε.

Μόλις τρέξει το server, θα προχωρήσουμε στο **Recipe module**! 🚀
