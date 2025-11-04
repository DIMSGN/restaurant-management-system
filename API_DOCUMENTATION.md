# 🌐 Complete API Documentation

**Base URL**: `http://localhost:3000/api`

**Authentication**: All endpoints (except auth) require JWT token in header:
```
Authorization: Bearer <token>
```

---

## 🔐 Authentication Endpoints

### Register User
```http
POST /api/auth/register

Body:
{
  "username": "string",
  "password": "string",
  "role": "ADMIN" | "WAITER"  // optional, defaults to WAITER
}

Response: 201
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "user": { id, username, role },
    "token": "jwt-token"
  }
}
```

### Login
```http
POST /api/auth/login

Body:
{
  "username": "string",
  "password": "string"
}

Response: 200
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "user": { id, username, role },
    "token": "jwt-token"
  }
}
```

### Get Current User Profile
```http
GET /api/auth/me
Authorization: Bearer <token>

Response: 200
{
  "status": "success",
  "data": { id, username, role, createdAt }
}
```

---

## 📦 Products Endpoints

### Get All Products
```http
GET /api/products?page=1&limit=10&categoryId=1&unitId=1
Authorization: Bearer <token>

Response: 200
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Tomatoes",
      "amount": 50,
      "price": 3.5,
      "purchasePrice": 2.0,
      "minimumStock": 10,
      "unit": { id, name },
      "category": { id, name }
    }
  ],
  "pagination": { page, limit, total, totalPages }
}
```

### Get Product by ID
```http
GET /api/products/:id
Authorization: Bearer <token>

Response: 200
{
  "status": "success",
  "data": { product details with unit, category, rules }
}
```

### Get Low Stock Products
```http
GET /api/products/low-stock
Authorization: Bearer <token>

Response: 200
{
  "status": "success",
  "data": [ products where amount <= minimumStock ]
}
```

### Create Product (Admin Only)
```http
POST /api/products
Authorization: Bearer <admin-token>

Body:
{
  "name": "string",
  "unitId": number,
  "categoryId": number,
  "amount": number,
  "price": number,
  "purchasePrice": number,
  "receivedDate": "YYYY-MM-DD",
  "expirationDate": "YYYY-MM-DD",
  "minimumStock": number
}

Response: 201
{
  "status": "success",
  "message": "Product created successfully",
  "data": { product }
}
```

### Update Product (Admin Only)
```http
PATCH /api/products/:id
Authorization: Bearer <admin-token>

Body: (all fields optional)
{
  "name": "string",
  "amount": number,
  "price": number,
  ...
}

Response: 200
{
  "status": "success",
  "message": "Product updated successfully",
  "data": { updated product }
}
```

### Delete Product (Admin Only)
```http
DELETE /api/products/:id
Authorization: Bearer <admin-token>

Response: 200
{
  "status": "success",
  "message": "Product deleted successfully"
}
```

---

## 🍕 Recipes Endpoints

### Get All Recipes
```http
GET /api/recipes?page=1&limit=10&search=salad
Authorization: Bearer <token>

Response: 200
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Greek Salad",
      "salePrice": 12.5,
      "cost": 5.2,              // Auto-calculated
      "profit": 7.3,            // Auto-calculated
      "profitMargin": 58.4,     // Auto-calculated
      "ingredients": [
        {
          "product": { name, unit },
          "amount": 0.5
        }
      ]
    }
  ],
  "pagination": { ... }
}
```

### Get Recipe by ID
```http
GET /api/recipes/:id
Authorization: Bearer <token>

Response: 200
{
  "status": "success",
  "data": {
    recipe with ingredients, cost, profit, profitMargin
  }
}
```

### Create Recipe (Admin Only)
```http
POST /api/recipes
Authorization: Bearer <admin-token>

Body:
{
  "name": "string",
  "description": "string",  // optional
  "salePrice": number,
  "ingredients": [
    {
      "productId": number,
      "amount": number
    }
  ]
}

Response: 201
{
  "status": "success",
  "message": "Recipe created successfully",
  "data": { recipe with cost/profit }
}
```

### Update Recipe (Admin Only)
```http
PATCH /api/recipes/:id
Authorization: Bearer <admin-token>

Body: (all fields optional)
{
  "name": "string",
  "salePrice": number,
  "ingredients": [ ... ]  // replaces all ingredients
}

Response: 200
{
  "status": "success",
  "message": "Recipe updated successfully",
  "data": { updated recipe }
}
```

### Delete Recipe (Admin Only)
```http
DELETE /api/recipes/:id
Authorization: Bearer <admin-token>

Response: 200
{
  "status": "success",
  "message": "Recipe deleted successfully"
}
```

---

## 💰 Sales Endpoints

### Get All Sales
```http
GET /api/sales?page=1&limit=10&startDate=2024-01-01&endDate=2024-12-31&category=food&paymentMethod=cash
Authorization: Bearer <token>

Response: 200
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "recipe": { name },
      "product": { name },
      "quantitySold": 2,
      "salePrice": 25.0,
      "costOfGoods": 10.4,
      "profit": 14.6,
      "category": "food",
      "paymentMethod": "cash",
      "saleDate": "2024-11-04",
      "user": { username }
    }
  ],
  "pagination": { ... }
}
```

### Get Sales Statistics
```http
GET /api/sales/stats?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <token>

Response: 200
{
  "status": "success",
  "data": {
    "summary": {
      "totalSales": 150,
      "totalRevenue": 5430.50,
      "totalCost": 2100.20,
      "totalProfit": 3330.30,
      "averageSale": 36.20,
      "averageProfit": 22.20,
      "profitMargin": 61.32
    },
    "byCategory": [
      {
        "category": "food",
        "_sum": { salePrice, profit },
        "_count": 100
      }
    ]
  }
}
```

### Get Sale by ID
```http
GET /api/sales/:id
Authorization: Bearer <token>

Response: 200
{
  "status": "success",
  "data": { sale details with recipe/product }
}
```

### Record Sale (Admin & Waiter)
```http
POST /api/sales
Authorization: Bearer <token>

Body: (either recipeId OR productId required)
{
  "recipeId": number,           // optional
  "productId": number,          // optional
  "quantitySold": number,
  "category": "food" | "cocktail" | "coffee" | "drink",
  "paymentMethod": "cash" | "card" | "mobile" | "other",
  "notes": "string"             // optional
}

Response: 201
{
  "status": "success",
  "message": "Sale recorded successfully",
  "data": { sale with calculated profit }
}

Note: Automatically updates stock via transaction!
```

---

## ❌ Error Responses

### 400 - Validation Error
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "field": "price",
      "message": "Price must be positive"
    }
  ]
}
```

### 401 - Unauthorized
```json
{
  "status": "error",
  "message": "No token provided"
}
```

### 403 - Forbidden
```json
{
  "status": "error",
  "message": "You do not have permission to perform this action"
}
```

### 404 - Not Found
```json
{
  "status": "error",
  "message": "Product with ID 99 not found"
}
```

### 409 - Conflict
```json
{
  "status": "error",
  "message": "Username already exists"
}
```

### 500 - Internal Server Error
```json
{
  "status": "error",
  "message": "Internal server error"
}
```

---

## 🔧 Request Examples with cURL

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin@123"}'
```

**Rate Limit**: 5 attempts per 15 minutes

### Get Products
```bash
curl http://localhost:3000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Recipe
```bash
curl -X POST http://localhost:3000/api/recipes \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Greek Salad",
    "salePrice": 12.5,
    "ingredients": [
      {"productId": 1, "amount": 0.3},
      {"productId": 2, "amount": 0.05}
    ]
  }'
```

### Record Sale
```bash
curl -X POST http://localhost:3000/api/sales \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "recipeId": 1,
    "quantitySold": 2,
    "category": "food",
    "paymentMethod": "cash"
  }'
```

---

## 📊 Business Logic Notes

### Recipe Cost Calculation
- Automatically calculated from ingredient costs
- `cost = Σ(ingredient.amount × product.purchasePrice)`
- `profit = salePrice - cost`
- `profitMargin = (profit / salePrice) × 100`

### Sales Transaction
- **Atomic operation** using Prisma transactions
- Steps:
  1. Validate stock availability
  2. Update product stock (decrement)
  3. Calculate cost & profit
  4. Create sale record
- If any step fails, entire transaction rolls back

### Stock Alerts
- Products with `amount <= minimumStock` are flagged
- Retrieved via `/api/products/low-stock`

---

## 🎯 Testing Workflow

1. **Login**: Get JWT token
2. **Create Products**: Add inventory items
3. **Create Recipe**: Link products as ingredients
4. **Record Sale**: Sell recipe (auto updates stock)
5. **View Stats**: Check sales analytics

---

## 📚 Additional Resources

- Prisma schema: `backend/prisma/schema.prisma`
- Postman collection: (TODO - export collection)
- Swagger UI: (TODO - Phase 4)
