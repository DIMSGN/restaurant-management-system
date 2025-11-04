import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/config';
import { errorHandler } from './shared/errorHandler';
import { logger } from './shared/logger';
import { apiLimiter, authLimiter } from './shared/rateLimiter';

// Import routes
import authRoutes from './domain/users/user.routes';
import productRoutes from './domain/products/product.routes';
import recipeRoutes from './domain/recipes/recipe.routes';
import saleRoutes from './domain/sales/sale.routes';

export const createApp = (): Application => {
  const app = express();

  // Security middleware
  app.use(helmet()); // Security headers
  app.use(cors({ origin: config.cors.origin, credentials: true }));
  app.use(express.json({ limit: '10kb' })); // Prevent large payload attacks
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));

  // Apply general rate limiting to all API routes
  app.use('/api', apiLimiter);

  // Health check (no rate limit)
  app.get('/health', async (req, res) => {
    try {
      // Check database connection
      await require('./config/database').prisma.$queryRaw`SELECT 1`;
      res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config.nodeEnv,
        database: 'connected',
      });
    } catch (error) {
      logger.error('Health check failed', { error });
      res.status(503).json({
        status: 'ERROR',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
      });
    }
  });

  // API Routes
  app.use('/api/auth', authLimiter, authRoutes); // Apply stricter rate limit to auth
  app.use('/api/products', productRoutes);
  app.use('/api/recipes', recipeRoutes);
  app.use('/api/sales', saleRoutes);

  // 404 Handler
  app.use((req, res) => {
    res.status(404).json({
      status: 'error',
      message: 'Route not found',
    });
  });

  // Error Handler (must be last)
  app.use(errorHandler);

  return app;
};
