import { Request, Response, NextFunction } from 'express';

// Async handler wrapper για να αποφύγουμε try-catch σε κάθε route
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
