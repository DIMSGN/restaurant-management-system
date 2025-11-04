import { Request, Response, NextFunction } from 'express';
import { AppError } from './errors';
import { ZodError } from 'zod';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  // Zod Validation Errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  // Custom App Errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  // Prisma Errors
  if (err.name === 'PrismaClientKnownRequestError') {
    return res.status(400).json({
      status: 'error',
      message: 'Database error occurred',
    });
  }

  // Default 500 error
  console.error('💥 Unhandled Error:', err);
  return res.status(500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
  });
};
