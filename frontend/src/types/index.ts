export interface User {
  id: number;
  username: string;
  role: 'ADMIN' | 'WAITER';
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  role: 'ADMIN' | 'WAITER';
}

export interface Product {
  id: number;
  name: string;
  amount: number;
  minimumStock: number;
  purchasePrice: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCreateRequest {
  name: string;
  amount: number;
  minimumStock: number;
  purchasePrice: number;
  price: number;
}

export interface ProductUpdateRequest {
  name?: string;
  amount?: number;
  minimumStock?: number;
  purchasePrice?: number;
  price?: number;
}

export interface Recipe {
  id: number;
  name: string;
  price: number;
  cost: number;
  profit: number;
  profitPercentage: number;
  ingredients: RecipeIngredient[];
  createdAt: string;
  updatedAt: string;
}

export interface RecipeIngredient {
  id: number;
  productId: number;
  productName: string;
  quantityUsed: number;
  recipeId: number;
  createdAt: string;
  updatedAt: string;
}

export interface RecipeCreateRequest {
  name: string;
  price: number;
  ingredients: {
    productId: number;
    quantityUsed: number;
  }[];
}

export interface RecipeUpdateRequest {
  name?: string;
  price?: number;
  ingredients?: {
    productId: number;
    quantityUsed: number;
  }[];
}

export interface Sale {
  id: number;
  recipeId: number;
  recipeName: string;
  quantity: number;
  totalPrice: number;
  totalCost: number;
  totalProfit: number;
  saleDate: string;
  category: 'FOOD' | 'DRINK';
  userId: number;
  userName: string;
  createdAt: string;
  updatedAt: string;
}

export interface SaleCreateRequest {
  recipeId: number;
  quantity: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: string[];
}
